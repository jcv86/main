import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import {
  recordJourneyTransition,
  type JourneyTransitionStep,
} from '@/lib/journey/transitions'
import {
  DTC_REQUEST_ID_HEADER,
  resolveRequestId,
} from '@/lib/observability/request-id'

const VALID_STEPS: JourneyTransitionStep[] = ['a1_report', 'a2_intro']
const SAFE_TRANSITION_ERRORS = new Set([
  'Completa Despega Cerebral antes de continuar.',
  'Completa Conozcámonos 2 antes de abrir tu informe final.',
  'Completa A1 y revisa tu informe antes de iniciar Tu Ruta.',
])

function jsonResponse(
  payload: Record<string, unknown>,
  status: number,
  requestId: string,
) {
  return NextResponse.json(
    { ...payload, request_id: requestId },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        [DTC_REQUEST_ID_HEADER]: requestId,
      },
    },
  )
}

export async function POST(request: Request) {
  const requestId = resolveRequestId(request.headers)

  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return jsonResponse({ error: 'No autenticado' }, 401, requestId)
    }

    let body: { step?: unknown }
    try {
      body = (await request.json()) as { step?: unknown }
    } catch {
      return jsonResponse({ error: 'Solicitud inválida' }, 400, requestId)
    }

    const step =
      typeof body.step === 'string' &&
      VALID_STEPS.includes(body.step as JourneyTransitionStep)
        ? (body.step as JourneyTransitionStep)
        : null

    if (!step) {
      return jsonResponse(
        { error: 'La transición solicitada no es válida.' },
        400,
        requestId,
      )
    }

    const result = await recordJourneyTransition(currentUser.id, step, {
      requestId,
    })
    return jsonResponse({ success: true, ...result }, 200, requestId)
  } catch (error) {
    const safeMessage =
      error instanceof Error && SAFE_TRANSITION_ERRORS.has(error.message)
        ? error.message
        : 'No pudimos registrar la transición.'

    return jsonResponse({ error: safeMessage }, 500, requestId)
  }
}
