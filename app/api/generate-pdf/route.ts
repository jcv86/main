import { NextRequest, NextResponse } from 'next/server'

const { default: html2pdf } = require('html2pdf.js/dist/html2pdf.js')

export async function POST(request: NextRequest) {
  try {
    const { html } = await request.json()

    if (!html) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      )
    }

    // Usar html2pdf en el servidor
    const pdfBuffer = await new Promise((resolve, reject) => {
      try {
        const element = {
          innerHTML: html
        }

        const options = {
          margin: 10,
          filename: 'DTC_Respaldo_MVP_CORFO_2026.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            backgroundColor: '#000000'
          },
          jsPDF: { 
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
          }
        }

        // html2pdf devuelve un Promise
        html2pdf()
          .set(options)
          .from(html)
          .outputPdf('blob')
          .then((pdf: Blob) => {
            pdf.arrayBuffer().then((buffer) => {
              resolve(new Uint8Array(buffer))
            })
          })
          .catch(reject)
      } catch (error) {
        reject(error)
      }
    })

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="DTC_Respaldo_MVP_CORFO_2026.pdf"',
      },
    })
  } catch (error) {
    console.error('[v0] Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: String(error) },
      { status: 500 }
    )
  }
}
