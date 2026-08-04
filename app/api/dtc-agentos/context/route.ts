import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    {
      error: 'La inspección pública de contexto AgentOS fue retirada.',
      code: 'AGENTOS_CONTEXT_INSPECTION_RETIRED',
      message:
        'La memoria, el contexto longitudinal y la configuración de agentes solo pueden consumirse desde servicios internos con propósito específico.',
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
