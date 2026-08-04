import { NextResponse } from 'next/server'

const retiredResponse = () =>
  NextResponse.json(
    {
      error: 'El webhook público de auto-detección fue retirado.',
      code: 'A4_AUTO_DETECTION_WEBHOOK_RETIRED',
      replacement: '/api/a4/job-matching',
      message:
        'El job matching solo puede ejecutarse desde el flujo autenticado y después del cierre verificado de A3.',
    },
    {
      status: 410,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  )

export async function POST() {
  return retiredResponse()
}

export async function GET() {
  return retiredResponse()
}
