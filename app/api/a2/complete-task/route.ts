import { NextResponse } from 'next/server'

const retiredResponse = () =>
  NextResponse.json(
    {
      error: 'El endpoint legacy de tareas A2 fue retirado.',
      code: 'A2_LEGACY_TASK_WRITER_RETIRED',
      replacement: '/api/a2/complete-day',
      message:
        'La finalización de misiones y sus recompensas solo se registran mediante el flujo canónico autenticado y validado en servidor.',
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
