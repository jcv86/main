import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      error: 'El coach mock legacy del Día 1 fue retirado.',
      code: 'A2_DAY1_MOCK_COACH_RETIRED',
      replacement: '/api/a2/coach-assist',
      message:
        'La asistencia vigente requiere una sesión real y genera sugerencias mediante el endpoint de coaching autenticado.',
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
