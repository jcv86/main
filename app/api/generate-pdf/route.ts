import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { html } = await request.json()

    if (!html) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      )
    }

    // Usar window.print() es más confiable que html2pdf en servidor
    // Retornar un error indicando que use el cliente-side print
    return NextResponse.json(
      { 
        success: false,
        message: 'Use client-side print functionality',
        instructions: 'Click the download button and select "Save as PDF" from the print dialog'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error in PDF route:', error)
    return NextResponse.json(
      { error: 'Failed to process request', details: String(error) },
      { status: 500 }
    )
  }
}
