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
      'Paquete_Documentacion_Completo_2026-05-22.tar.gz',
      // Markdown Documents (Spanish names)
      'LEEME.md',
      'RESUMEN_INVERSOR.md',
      'LISTA_PROGRESO_MVP.md',
      'ARQUITECTURA_TECNICA.md',
      'LEEME_TECNICO.md',
      'ESTADO_GIT_Y_DEPLOY.md',
      'DESCARGA_Y_USO.md',
      'DOCUMENTACION_COMPLETA_2026-05-22.md',
      'INDICE_PAQUETE.md',
      'PAQUETE_COMPLETADO.md',
      // HTML Versions (Spanish names)
      'LEEME.html',
      'RESUMEN_INVERSOR.html',
      'LISTA_PROGRESO_MVP.html',
      'ESTADO_GIT_Y_DEPLOY.html',
      'LEEME_TECNICO.html',
      'ARQUITECTURA_TECNICA.html',
      'DESCARGA_Y_USO.html',
      // Additional Documentation Files (Spanish variants)
      'DOCUMENTACION-COMPLETA-DTC.md',
      'DOCUMENTACION-FUNCIONAL-DTC.md',
      'ESTADO-TECNICO-COMPLETO-FINAL.md',
      'INDEX-DOCUMENTACION-COMPLETA.md',
      'RESUMEN-EJECUTIVO-FINAL.md',
      'RESUMEN-IMPLEMENTACION.md',
      'A2_COMPLETE_TECHNICAL_VERIFICATION.md',
      'A4_DASHBOARD_README.md',
      'A4_TECHNICAL_VALIDATION.md',
      'README_A2_COMPLETE.md',
      'README_PRODUCTION.md',
      'README_TECHNICAL.md',
      // Configuration
      '.env.ejemplo',
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
