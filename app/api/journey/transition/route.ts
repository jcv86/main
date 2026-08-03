import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import {
  recordJourneyTransition,
  type JourneyTransitionStep,
} from '@/lib/journey/transitions'

const VALID_STEPS: JourneyTransitionStep[] = ['a1_report', 'a2_intro']

export async function POST(request: Request) {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    let body: { step?: unknown }
    try {
      body = (await request.json()) as { step?: unknown }
    } catch {
      return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
    }

    const step =
      typeof body.step === 'string' &&
      VALID_STEPS.includes(body.step as JourneyTransitionStep)
        ? (body.step as JourneyTransitionStep)
        : null

    if (!step) {
      return NextResponse.json(
        { error: 'La transición solicitada no es válida.' },
        { status: 400 },
      )
    }

    const result = await recordJourneyTransition(currentUser.id, step)
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error('[v0] Journey transition error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'No pudimos registrar la transición.',
      },
      { status: 500 },
    )
  }
}
