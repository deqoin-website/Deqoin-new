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
  const rawQueryFilename = searchParams.get('filename') || 'upload.png';
  try {
    const contentType = request.headers.get('content-type') || '';
    console.log('UPLOAD START', {
      rawQueryFilename,
      contentType,
      hasBody: Boolean(request.body),
    });

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');
      const rawFilename = typeof formData.get('filename') === 'string'
        ? String(formData.get('filename'))
        : rawQueryFilename;
      const providedName = normalizeFilename(rawFilename) || 'upload.png';

      if (!(file instanceof File)) {
        throw new Error('Missing file payload');
      }

      const mimeType = file.type || contentType || '';
      const fileBase = providedName.replace(/\.[^.]+$/, '') || 'upload';
      const extension = file.name?.split('.').pop()?.toLowerCase() || (
        mimeType.includes('png')
          ? 'png'
          : mimeType.includes('webp')
            ? 'webp'
            : mimeType.includes('jpeg') || mimeType.includes('jpg')
              ? 'jpg'
              : 'bin'
      );
      const safeFilename = `${fileBase}.${extension}`;

      const blob = await put(safeFilename, file, {
        access: 'public',
        addRandomSuffix: true,
        contentType: file.type || undefined,
      });

      return NextResponse.json({
        ...blob,
        fallback: 'blob',
        debug: {
          safeFilename,
          mimeType,
          fileName: file.name,
          fileSize: file.size,
          transport: 'multipart',
        },
      });
    }

    if (!request.body) {
      throw new Error('Missing file payload');
    }

    const providedName = normalizeFilename(rawQueryFilename) || 'upload.png';
    const mimeType = contentType || '';
    const fileBase = providedName.replace(/\.[^.]+$/, '') || 'upload';
    const extension = mimeType.includes('png')
      ? 'png'
      : mimeType.includes('webp')
        ? 'webp'
        : mimeType.includes('jpeg') || mimeType.includes('jpg')
          ? 'jpg'
          : 'bin';
    const safeFilename = `${fileBase}.${extension}`;

    const blob = await put(safeFilename, request.body, {
      access: 'public',
      addRandomSuffix: true,
      contentType: contentType || undefined,
    });

    return NextResponse.json({
      ...blob,
      fallback: 'blob',
      debug: {
        safeFilename,
        mimeType,
        transport: 'stream',
      },
    });
  } catch (error: any) {
    console.error('SERVER SIDE ERROR:', error?.stack || error?.message || String(error));
    return NextResponse.json(
      { 
        error: 'Upload failed', 
        details: error?.message || String(error),
        step: error?.message?.includes('Missing file payload')
          ? 'missing-file'
          : error?.message?.includes('formData')
            ? 'formdata-parse'
            : 'blob-upload',
        hint: 'Kendi terminalinizde (npm run dev ekranında) SERVER SIDE ERROR araması yapın.' 
      },
      { status: 500 }
    );
  }
}
