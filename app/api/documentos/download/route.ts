import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filename = request.nextUrl.searchParams.get('file');
    
    if (!filename) {
      return NextResponse.json(
        { error: 'Parametro file requerido' },
        { status: 400 }
      );
    }

    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return NextResponse.json(
        { error: 'Ruta de archivo invalida' },
        { status: 400 }
      );
    }

    // Allow all documentation file types
    const allowedExtensions = ['.md', '.html', '.pdf', '.txt', '.ejemplo', '.tar.gz', '.json'];
    const hasAllowedExtension = allowedExtensions.some(ext => filename.endsWith(ext));
    
    if (!hasAllowedExtension) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido' },
        { status: 403 }
      );
    }

    const filePath = path.join(process.cwd(), filename);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Archivo no encontrado', archivo: filename },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);
    
    // Determine content type
    let contentType = 'application/octet-stream';
    if (filename.endsWith('.tar.gz')) contentType = 'application/gzip';
    if (filename.endsWith('.md')) contentType = 'text/markdown; charset=utf-8';
    if (filename.endsWith('.html')) contentType = 'text/html; charset=utf-8';
    if (filename.endsWith('.pdf')) contentType = 'application/pdf';
    if (filename.endsWith('.txt') || filename.endsWith('.ejemplo')) contentType = 'text/plain; charset=utf-8';
    if (filename.endsWith('.json')) contentType = 'application/json; charset=utf-8';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('[v0] Error de descarga:', error);
    return NextResponse.json(
      { error: 'Error al descargar archivo', detalles: (error as Error).message },
      { status: 500 }
    );
  }
}
