import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filename = request.nextUrl.searchParams.get('file') || 'DTC_Tech_Evidence_Pack_2026-05-20.tar.gz';
    
    // Read the tar.gz file from the project root
    const filePath = path.join(process.cwd(), filename);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found', availableFile: filename },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);
    
    // Upload to Vercel Blob
    const blob = await put(filename, fileBuffer, {
      access: 'public',
      contentType: 'application/gzip',
    });

    return NextResponse.json({
      success: true,
      filename: filename,
      url: blob.url,
      size: fileBuffer.length,
      message: 'File uploaded to Vercel Blob. Use the URL to download.',
    });
  } catch (error) {
    console.error('[v0] Error uploading to Blob:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: (error as Error).message },
      { status: 500 }
    );
  }
}
