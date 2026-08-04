import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      error: 'El endpoint legacy de Conozcámonos 1 fue retirado.',
      code: 'LEGACY_C1_RESPONSE_ENDPOINT_RETIRED',
      replacement: '/despega/conozcamonos-1',
      message:
        'Conozcámonos 1 guarda únicamente las respuestas del usuario autenticado desde el flujo canónico.',
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
