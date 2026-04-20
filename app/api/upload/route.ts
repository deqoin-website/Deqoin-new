import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import sharp from 'sharp';

export const maxDuration = 60; // 1 minute timeout for video uploads
export const runtime = 'nodejs';

function normalizeFilename(input: string) {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9.-]/g, '');
}

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const rawFilename = searchParams.get('filename') || 'logo.png';
  
  // Clean filename: remove spaces and special characters
  const filename = normalizeFilename(rawFilename) || 'upload.png';

  try {
    const arrayBuffer = await request.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    if (!inputBuffer.length) {
      throw new Error('Empty upload payload');
    }

    let uploadBuffer: Buffer = inputBuffer;
    let safeFilename = `${filename.replace(/\.[^.]+$/, '') || 'upload'}.webp`;
    let transformMode: "sharp-webp" | "raw-fallback" = "sharp-webp";
    try {
      uploadBuffer = await sharp(inputBuffer)
        .rotate()
        .resize({
          width: 1400,
          height: 1800,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 72, effort: 4 })
        .toBuffer();
    } catch (sharpError) {
      transformMode = "raw-fallback";
      console.error('SHARP OPTIMIZATION FAILED:', sharpError instanceof Error ? sharpError.message : String(sharpError));
      const mimeType = request.headers.get('content-type') || '';
      const extension = mimeType.includes('png')
        ? 'png'
        : mimeType.includes('webp')
          ? 'webp'
          : mimeType.includes('jpeg') || mimeType.includes('jpg')
            ? 'jpg'
            : 'bin';
      safeFilename = `${filename.replace(/\.[^.]+$/, '') || 'upload'}.${extension}`;
      uploadBuffer = inputBuffer;
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
    if (!token) {
      throw new Error('BLOB token is missing in production env');
    }

    const blob = await put(safeFilename, uploadBuffer, {
      access: 'public',
      token,
    });

    return NextResponse.json({
      ...blob,
      fallback: 'blob',
      debug: {
        transformMode,
        safeFilename,
        inputBytes: inputBuffer.length,
        uploadBytes: uploadBuffer.length,
      },
    });
  } catch (error: any) {
    console.error('SERVER SIDE ERROR:', error?.stack || error?.message || String(error));
    return NextResponse.json(
      { 
        error: 'Upload failed', 
        details: error?.message || String(error),
        step: error?.message?.includes('token') ? 'blob-token' : error?.message?.includes('Empty upload payload') ? 'empty-payload' : 'transform-or-blob',
        hint: 'Kendi terminalinizde (npm run dev ekranında) SERVER SIDE ERROR araması yapın.' 
      },
      { status: 500 }
    );
  }
}
