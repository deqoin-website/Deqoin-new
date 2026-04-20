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

    const optimizedBuffer = await sharp(inputBuffer)
      .rotate()
      .resize({
        width: 1400,
        height: 1800,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 72, effort: 4 })
      .toBuffer();

    const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
    if (!token) {
      throw new Error('BLOB_READ_WRITE_TOKEN is missing in .env file');
    }

    const safeFilename = `${filename.replace(/\.[^.]+$/, '') || 'upload'}.webp`;
    const blob = await put(safeFilename, optimizedBuffer, {
      access: 'public',
      token,
    });

    return NextResponse.json({
      ...blob,
      fallback: 'blob',
    });
  } catch (error: any) {
    console.error('SERVER SIDE ERROR:', error.message);
    return NextResponse.json(
      { 
        error: 'Upload failed', 
        details: error.message,
        hint: 'Kendi terminalinizde (npm run dev ekranında) SERVER SIDE ERROR araması yapın.' 
      },
      { status: 500 }
    );
  }
}
