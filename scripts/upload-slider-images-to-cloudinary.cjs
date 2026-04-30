#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");

function loadEnv(filePath) {
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

function slugify(input) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "asset";
}

async function uploadFile(filePath, publicId) {
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "deqoin/slider";
  const result = await cloudinary.uploader.upload(filePath, {
    folder: `${folder}/hero-slides`,
    public_id: publicId,
    overwrite: true,
    unique_filename: false,
    use_filename: false,
    resource_type: "image",
    secure: true,
  });

  return result.secure_url || result.url;
}

async function main() {
  loadEnv(path.join(process.cwd(), ".env"));
  loadEnv(path.join(process.cwd(), ".env.local"));

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary credentials are missing");
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const files = [
    {
      key: "mimari",
      file: path.join(process.cwd(), "public/images/slider/mimari_slide.png"),
      publicId: "mimari-slide",
    },
    {
      key: "material",
      file: path.join(process.cwd(), "public/images/slider/tasarim_slide.png"),
      publicId: "tasarim-slide",
    },
    {
      key: "execution",
      file: path.join(process.cwd(), "public/images/slider/uygulama_slide.png"),
      publicId: "uygulama-slide",
    },
  ];

  const results = {};

  for (const item of files) {
    if (!fs.existsSync(item.file)) {
      throw new Error(`Missing file: ${item.file}`);
    }

    const url = await uploadFile(item.file, slugify(item.publicId));
    results[item.key] = url;
    console.log(`[upload] ${item.file} -> ${url}`);
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error?.stack || error?.message || String(error));
  process.exitCode = 1;
});
