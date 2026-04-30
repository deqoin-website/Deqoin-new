import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { Readable } from "node:stream";

export const maxDuration = 60;
export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function normalizeFilename(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9.-]/g, "");
}

function uploadBuffer(buffer: Buffer, filename: string) {
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "deqoin";
  const fileBase = filename.replace(/\.[^.]+$/, "") || "upload";

  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        public_id: fileBase,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      },
    );

    Readable.from(buffer).pipe(stream);
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const rawQueryFilename = searchParams.get("filename") || "upload.png";

  try {
    const contentType = request.headers.get("content-type") || "";
    console.log("UPLOAD START", {
      rawQueryFilename,
      contentType,
      hasBody: Boolean(request.body),
    });

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error("Cloudinary environment variables are missing");
    }

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      const rawFilename = typeof formData.get("filename") === "string"
        ? String(formData.get("filename"))
        : rawQueryFilename;
      const providedName = normalizeFilename(rawFilename) || "upload.png";

      if (!(file instanceof File)) {
        throw new Error("Missing file payload");
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await uploadBuffer(buffer, providedName);

      return NextResponse.json({
        ...result,
        url: result.secure_url,
        fallback: "cloudinary",
        debug: {
          originalName: file.name,
          fileSize: file.size,
          mimeType: file.type || contentType || "",
          transport: "multipart",
        },
      });
    }

    if (!request.body) {
      throw new Error("Missing file payload");
    }

    const providedName = normalizeFilename(rawQueryFilename) || "upload.png";
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await uploadBuffer(buffer, providedName);

    return NextResponse.json({
      ...result,
      url: result.secure_url,
      fallback: "cloudinary",
      debug: {
        originalName: providedName,
        transport: "stream",
      },
    });
  } catch (error: any) {
    console.error("SERVER SIDE ERROR:", error?.stack || error?.message || String(error));
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error?.message || String(error),
        step: error?.message?.includes("Missing file payload")
          ? "missing-file"
          : error?.message?.includes("formData")
            ? "formdata-parse"
            : "cloudinary-upload",
        hint: "Kendi terminalinizde (npm run dev ekranında) SERVER SIDE ERROR araması yapın.",
      },
      { status: 500 },
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      status: "ok",
      service: "upload",
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    },
  );
}
