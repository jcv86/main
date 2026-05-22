import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filename = request.nextUrl.searchParams.get('file');
    
    if (!filename) {
      return NextResponse.json(
        { error: 'File parameter required' },
        { status: 400 }
      );
    }

    // Whitelist allowed files
    const allowedFiles = [
      // TAR Archives & Bundles
      'DTC_Tech_Evidence_Pack_2026-05-20.tar.gz',
      'DTC_Tech_Evidence_Pack_2026-05-22.tar.gz',
      'Complete_Documentation_Bundle_2026-05-22.tar.gz',
      // Markdown Documents
      'README.md',
      'INVESTOR_BRIEF.md',
      'README_TECHNICAL.md',
      'README_TECHINICAL.md',
      'MVP_PROGRESS_CHECKLIST.md',
      'TECHNICAL_ARCHITECTURE.md',
      'GIT_AND_DEPLOY_STATUS.md',
      'DOWNLOAD_AND_USE.md',
      'DOCUMENTATION_COMPLETE_2026-05-22.md',
      'PACKAGE_INDEX.md',
      'PAQUETE_COMPLETADO.md',
      // HTML Versions (for PDF printing)
      'README.html',
      'INVESTOR_BRIEF.html',
      'MVP_PROGRESS_CHECKLIST.html',
      'GIT_AND_DEPLOY_STATUS.html',
      'README_TECHINICAL.html',
      'TECHNICAL_ARCHITECTURE.html',
      'DOWNLOAD_AND_USE.html',
      // Configuration
      '.env.example',
    ];

    if (!allowedFiles.includes(filename)) {
      return NextResponse.json(
        { error: 'File not allowed', allowed: allowedFiles },
        { status: 403 }
      );
    }

    const filePath = path.join(process.cwd(), filename);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found', file: filename },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);
    
    // Determine content type
    let contentType = 'application/octet-stream';
    if (filename.endsWith('.tar.gz')) contentType = 'application/gzip';
    if (filename.endsWith('.md')) contentType = 'text/markdown';
    if (filename.endsWith('.example')) contentType = 'text/plain';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[v0] Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download file', details: (error as Error).message },
      { status: 500 }
    );
  }
}
