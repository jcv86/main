import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    
    // Allow all markdown, HTML, PDF, and config files
    const allowedExtensions = ['.md', '.html', '.pdf', '.txt', '.ejemplo']
    const extension = filename.substring(filename.lastIndexOf('.'))
    
    if (!allowedExtensions.includes(extension)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido' },
        { status: 403 }
      )
    }

    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return NextResponse.json(
        { error: 'Ruta de archivo invalida' },
        { status: 400 }
      )
    }

    const filePath = join(process.cwd(), filename)
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      )
    }
    
    try {
      const fileContent = readFileSync(filePath)
      
      // Determine content type based on extension
      let contentType = 'text/plain; charset=utf-8'
      if (filename.endsWith('.html')) {
        contentType = 'text/html; charset=utf-8'
      } else if (filename.endsWith('.pdf')) {
        contentType = 'application/pdf'
      } else if (filename.endsWith('.md')) {
        contentType = 'text/markdown; charset=utf-8'
      }

      return new NextResponse(fileContent, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${filename}"`,
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
        },
      })
    } catch (err) {
      console.error('[v0] Error leyendo archivo:', err)
      return NextResponse.json(
        { error: 'Error leyendo archivo' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[v0] Error sirviendo archivo:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
