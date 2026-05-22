import { readFileSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    
    // Whitelist of allowed HTML and PDF files
    const allowedFiles = [
      'LEEME.html',
      'RESUMEN_INVERSOR.html',
      'LISTA_PROGRESO_MVP.html',
      'ESTADO_GIT_Y_DEPLOY.html',
      'LEEME_TECNICO.html',
      'ARQUITECTURA_TECNICA.html',
      'DESCARGA_Y_USO.html',
      // Support both extensions
      'LEEME.pdf',
      'RESUMEN_INVERSOR.pdf',
      'LISTA_PROGRESO_MVP.pdf',
      'ESTADO_GIT_Y_DEPLOY.pdf',
      'LEEME_TECNICO.pdf',
      'ARQUITECTURA_TECNICA.pdf',
      'DESCARGA_Y_USO.pdf',
    ]

    if (!allowedFiles.includes(filename)) {
      return NextResponse.json(
        { error: 'File not allowed' },
        { status: 403 }
      )
    }

    const filePath = join(process.cwd(), filename)
    
    try {
      const fileContent = readFileSync(filePath)
      
      const contentType = filename.endsWith('.html') 
        ? 'text/html; charset=utf-8'
        : 'application/pdf'

      return new NextResponse(fileContent, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${filename}"`,
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
        },
      })
    } catch (err) {
      console.error('[v0] File read error:', err)
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('[v0] Error serving file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
