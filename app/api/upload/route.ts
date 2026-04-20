import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';

export const maxDuration = 60; // 1 minute timeout for video uploads

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const rawFilename = searchParams.get('filename') || 'logo.png';
  
  // Clean filename: remove spaces and special characters
  const filename = rawFilename.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');

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

    const buffer = optimizedBuffer;
    const ext = path.extname(filename).toLowerCase();
    const dataUrl = `data:image/webp;base64,${buffer.toString('base64')}`;

    try {
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const safeFilename = `${filename.replace(/\.[^.]+$/, '') || 'upload'}.webp`;
        const blob = await put(safeFilename, buffer, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN
        });

        return NextResponse.json({
          ...blob,
          fallback: 'blob',
        });
      }
    } catch (blobError: any) {
      console.warn('Blob upload failed, falling back to data URL:', blobError?.message || blobError);
    }

    return NextResponse.json({
      url: dataUrl,
      pathname: dataUrl,
      downloadUrl: dataUrl,
      fallback: 'data-url',
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
