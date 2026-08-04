import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      error: 'El endpoint heredado de finalización fue retirado.',
      code: 'A3_LEGACY_MODULE_COMPLETE_RETIRED',
      replacement: '/api/a3/module-completion',
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
