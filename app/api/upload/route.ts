import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

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
    const mimeType = request.headers.get('content-type') || '';
    const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;

    console.log('UPLOAD START', { rawFilename, filename, mimeType, hasToken: Boolean(token) });

    const arrayBuffer = await request.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    if (!inputBuffer.length) {
      throw new Error('Empty upload payload');
    }

    const extension = mimeType.includes('png')
      ? 'png'
      : mimeType.includes('webp')
        ? 'webp'
        : mimeType.includes('jpeg') || mimeType.includes('jpg')
          ? 'jpg'
          : 'bin';
    const safeFilename = `${filename.replace(/\.[^.]+$/, '') || 'upload'}.${extension}`;
    const uploadBuffer: Buffer = inputBuffer;

    if (!token) {
      return NextResponse.json(
        {
          error: 'Upload failed',
          details: 'BLOB token is missing in production env',
          step: 'blob-token',
          debug: {
            rawFilename,
            filename,
            mimeType,
            hasToken: false,
          },
        },
        { status: 500 }
      );
    }

    const blob = await put(safeFilename, uploadBuffer, {
      access: 'public',
      token,
    });

    return NextResponse.json({
      ...blob,
      fallback: 'blob',
      debug: {
        safeFilename,
        inputBytes: inputBuffer.length,
        uploadBytes: uploadBuffer.length,
        mimeType,
        hasToken: true,
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
