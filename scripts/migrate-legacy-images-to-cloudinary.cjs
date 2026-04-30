#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { v2: cloudinary } = require("cloudinary");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const contents = fs.readFileSync(filePath, "utf8");

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const equalsIndex = line.indexOf("=");
    if (equalsIndex === -1) continue;

    const key = line.slice(0, equalsIndex).trim();
    let value = line.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function parseArgs(argv) {
  const options = {
    dryRun: false,
    collections: null,
  };

  for (const arg of argv) {
    if (arg === "--dry-run") {
      options.dryRun = true;
    }

    if (arg.startsWith("--collections=")) {
      const raw = arg.slice("--collections=".length);
      options.collections = raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return options;
}

function slugify(input) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "asset";
}

function hash(input) {
  return crypto.createHash("sha1").update(input).digest("hex").slice(0, 10);
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function getCollectionLabel(name) {
  return name.replace(/s$/, "");
}

function getLegacyUrls(value) {
  if (typeof value !== "string") return [];
  const matches = value.match(/https?:\/\/[^\s"'<>]*blob\.vercel-storage\.com[^\s"'<>]*/g);
  return matches ? [...new Set(matches)] : [];
}

async function main() {
  loadEnvFile(path.join(process.cwd(), ".env.local"));
  loadEnvFile(path.join(process.cwd(), ".env"));

  const options = parseArgs(process.argv.slice(2));

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("CLOUDINARY_CLOUD_NAME is missing");
  }

  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are missing");
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  await mongoose.connect(process.env.MONGODB_URI, {
    bufferCommands: false,
  });

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection failed");
  }

  const allCollections = await db.listCollections().toArray();
  const collectionNames = allCollections
    .map((item) => item.name)
    .filter((name) => !name.startsWith("system."));

  const targetCollections = options.collections?.length
    ? collectionNames.filter((name) => options.collections.includes(name))
    : collectionNames;

  const uploadCache = new Map();
  const stats = {
    collectionsScanned: 0,
    documentsScanned: 0,
    documentsUpdated: 0,
    legacyUrlHits: 0,
    uniqueUrlsUploaded: 0,
    errors: [],
  };

  async function uploadLegacyUrl(legacyUrl, context) {
    if (uploadCache.has(legacyUrl)) {
      return uploadCache.get(legacyUrl);
    }

    if (options.dryRun) {
      console.log(
        `[dry-run] ${context.collectionName} ${context.docId} ${context.fieldPath}: ${legacyUrl}`,
      );
      uploadCache.set(legacyUrl, legacyUrl);
      return legacyUrl;
    }

    const fileName = (() => {
      try {
        const parsed = new URL(legacyUrl);
        const base = path.posix.basename(parsed.pathname) || "asset";
        return base;
      } catch {
        return "asset";
      }
    })();

    const baseName = fileName.replace(/\.[^.]+$/, "") || "asset";
    const folder = [
      process.env.CLOUDINARY_UPLOAD_FOLDER || "deqoin",
      "legacy-migration",
      getCollectionLabel(context.collectionName),
    ].join("/");
    const publicId = `${slugify(baseName)}-${hash(legacyUrl)}`;

    const result = await cloudinary.uploader.upload(legacyUrl, {
      folder,
      public_id: publicId,
      overwrite: false,
      unique_filename: false,
      use_filename: false,
      resource_type: "auto",
      secure: true,
    });

    const secureUrl = result.secure_url || result.url;
    if (!secureUrl) {
      throw new Error(`Cloudinary did not return a URL for ${legacyUrl}`);
    }

    stats.uniqueUrlsUploaded += 1;
    console.log(`[upload] ${legacyUrl} -> ${secureUrl}`);
    uploadCache.set(legacyUrl, secureUrl);
    return secureUrl;
  }

  async function walk(node, context) {
    if (typeof node === "string") {
      const urls = getLegacyUrls(node);
      if (!urls.length) {
        return { changed: false, value: node };
      }

      stats.legacyUrlHits += urls.length;
      let nextValue = node;
      for (const legacyUrl of urls) {
        const replacement = await uploadLegacyUrl(legacyUrl, context);
        nextValue = nextValue.split(legacyUrl).join(replacement);
      }

      return { changed: nextValue !== node, value: nextValue };
    }

    if (Array.isArray(node)) {
      let changed = false;
      for (let index = 0; index < node.length; index += 1) {
        const result = await walk(node[index], {
          ...context,
          fieldPath: `${context.fieldPath}[${index}]`,
        });
        if (result.changed) {
          node[index] = result.value;
          changed = true;
        }
      }
      return { changed, value: node };
    }

    if (isPlainObject(node)) {
      let changed = false;
      for (const [key, value] of Object.entries(node)) {
        if (key === "_id") continue;

        const nextContext = {
          ...context,
          fieldPath: context.fieldPath ? `${context.fieldPath}.${key}` : key,
        };
        const result = await walk(value, nextContext);
        if (result.changed) {
          node[key] = result.value;
          changed = true;
        }
      }
      return { changed, value: node };
    }

    return { changed: false, value: node };
  }

  for (const collectionName of targetCollections) {
    stats.collectionsScanned += 1;
    const collection = db.collection(collectionName);
    const cursor = collection.find({});

    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      if (!doc) continue;

      stats.documentsScanned += 1;

      try {
        const result = await walk(doc, {
          collectionName,
          docId: String(doc._id),
          fieldPath: "",
        });

        if (result.changed) {
          if (!options.dryRun) {
            await collection.replaceOne({ _id: doc._id }, doc);
          }
          stats.documentsUpdated += 1;
          console.log(`[update] ${collectionName} ${doc._id}`);
        }
      } catch (error) {
        const message = error?.message || String(error);
        stats.errors.push({
          collectionName,
          docId: String(doc._id),
          message,
        });
        console.error(`[error] ${collectionName} ${doc._id}: ${message}`);
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        dryRun: options.dryRun,
        ...stats,
      },
      null,
      2,
    ),
  );

  await mongoose.disconnect();

  if (stats.errors.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error?.stack || error?.message || String(error));
  process.exitCode = 1;
});
