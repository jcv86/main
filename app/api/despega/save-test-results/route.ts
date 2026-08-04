import { NextResponse } from 'next/server'

const retiredResponse = () =>
  NextResponse.json(
    {
      error: 'El guardado paralelo de resultados fue retirado.',
      code: 'LEGACY_TEST_RESULTS_API_RETIRED',
      replacement: '/api/a1-cerebral-save',
      message:
        'Los resultados de Despega Cerebral se guardan únicamente desde el flujo canónico autenticado.',
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
