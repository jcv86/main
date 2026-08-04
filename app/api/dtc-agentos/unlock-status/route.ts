import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    {
      error: 'La inspección pública de reglas AgentOS fue retirada.',
      code: 'AGENTOS_UNLOCK_INSPECTION_RETIRED',
      message:
        'Los desbloqueos se resuelven dentro de los flujos canónicos y no se exponen mediante una API genérica de depuración.',
    },
    {
      status: 410,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  )
}
