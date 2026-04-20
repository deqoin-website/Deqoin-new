import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const maxDuration = 60; // 1 minute timeout for video uploads

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const rawFilename = searchParams.get('filename') || 'logo.png';
  
  // Clean filename: remove spaces and special characters
  const filename = rawFilename.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');

  try {
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!buffer.length) {
      throw new Error('Empty upload payload');
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      const ext = path.extname(filename) || '.png';
      const base = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40) || 'upload';
      const finalName = `${base}-${crypto.randomUUID()}${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const outputPath = path.join(uploadDir, finalName);

      await mkdir(uploadDir, { recursive: true });
      await writeFile(outputPath, buffer);

      return NextResponse.json({
        url: `/uploads/${finalName}`,
        pathname: `/uploads/${finalName}`,
        downloadUrl: `/uploads/${finalName}`,
      });
    }

    const blob = await put(filename, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return NextResponse.json(blob);
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
