import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      error: 'El endpoint legacy de Conozcámonos 2 fue retirado.',
      code: 'LEGACY_C2_RESPONSE_ENDPOINT_RETIRED',
      replacement: '/api/journey/complete-c2',
      message:
        'Conozcámonos 2 solo puede completarse mediante la sesión verificada y los prerrequisitos canónicos de A1.',
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
