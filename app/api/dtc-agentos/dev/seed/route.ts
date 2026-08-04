import { NextResponse } from 'next/server'

const retiredResponse = () =>
  NextResponse.json(
    {
      error: 'El seed de desarrollo de AgentOS fue retirado de producción.',
      code: 'AGENTOS_DEV_SEED_RETIRED',
      message:
        'Los datos de evaluación, progreso, memoria y documentos deben provenir de evidencia real o de entornos de prueba aislados.',
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
