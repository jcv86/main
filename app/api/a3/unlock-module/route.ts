import { NextResponse } from 'next/server'

/**
 * Retired compatibility endpoint.
 * Module completion must pass through `/api/a3/module-completion`, which
 * validates identity, A2 checkpoint access, prerequisites and idempotent XP.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'Este endpoint fue retirado. Usa el flujo activo de Entrenamiento.',
      replacement: '/api/a3/module-completion',
    },
    { status: 410 },
  )
}
