import { readFileSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    // slug[0] es el nombre del archivo
    const { slug } = await params
    const filename = slug?.[0]

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename required' },
        { status: 400 }
      )
    }

    // Whitelist of allowed HTML files
    const allowedFiles = [
      'LEEME',
      'RESUMEN_INVERSOR',
      'LISTA_PROGRESO_MVP',
      'ESTADO_GIT_Y_DEPLOY',
      'LEEME_TECNICO',
      'ARQUITECTURA_TECNICA',
      'DESCARGA_Y_USO',
    ]

    const baseName = filename.replace(/\.(html|pdf)$/, '')
    
    if (!allowedFiles.includes(baseName)) {
      return NextResponse.json(
        { error: 'File not allowed' },
        { status: 403 }
      )
    }

    // Default to .html if no extension
    const actualFilename = filename.endsWith('.pdf') 
      ? `${baseName}.html`
      : `${baseName}.html`
    
    const filePath = join(process.cwd(), actualFilename)
    
    try {
      const fileContent = readFileSync(filePath)
      
      return new NextResponse(fileContent, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': 'inline',
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
