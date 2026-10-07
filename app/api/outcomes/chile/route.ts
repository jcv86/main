import { type NextRequest, NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { completeOutcomeFollowup, recordEmploymentOutcome, recordJobSearchEvent, recordSalaryOutcome } from '@/lib/outcomes-chile/capture'
import { isCaptureInput, OutcomeCaptureConflictError, OutcomeCaptureNotFoundError, OutcomeCaptureValidationError } from '@/lib/outcomes-chile/capture-validation'
import { loadOutcomesChileSummary } from '@/lib/outcomes-chile/service'

export const dynamic = 'force-dynamic'

function privateJson(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'private, no-store, max-age=0',
      'CDN-Cache-Control': 'no-store',
      'Vercel-CDN-Cache-Control': 'no-store',
    },
  })
}

function logFailure(operation: string, error: unknown) {
  const code = error && typeof error === 'object' && 'code' in error && typeof error.code === 'string'
    && /^[A-Z0-9_]{1,40}$/.test(error.code) ? error.code : 'OUTCOMES_CHILE_FAILED'
  // Database error details can contain personal salary or employment values.
  console.error(`[outcomes-chile] ${operation}`, { code })
}

export async function GET() {
  try {
    const user = await resolveServerUser()
    if (!user) return privateJson({ error: 'No autenticado' }, 401)
    return privateJson(await loadOutcomesChileSummary(user.id))
  } catch (error) {
    logFailure('summary', error)
    return privateJson({ error: 'Tus resultados aún no están disponibles. Intenta nuevamente más tarde.' }, 503)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await resolveServerUser()
    if (!user) return privateJson({ error: 'No autenticado' }, 401)
    let body: unknown
    try { body = await request.json() } catch { return privateJson({ error: 'Solicitud inválida' }, 400) }
    if (!isCaptureInput(body)) return privateJson({ error: 'Solicitud inválida' }, 400)

    if (body.action === 'job_search_event') return privateJson({ data: await recordJobSearchEvent(user.id, body) }, 201)
    if (body.action === 'employment_outcome') return privateJson({ data: await recordEmploymentOutcome(user.id, body) }, 201)
    if (body.action === 'salary_outcome') return privateJson({ data: await recordSalaryOutcome(user.id, body) }, 201)
    if (body.action === 'complete_followup') return privateJson({ data: await completeOutcomeFollowup(user.id, body) })
    return privateJson({ error: 'Acción no soportada' }, 400)
  } catch (error) {
    if (error instanceof OutcomeCaptureValidationError) return privateJson({ error: error.message }, 422)
    if (error instanceof OutcomeCaptureConflictError) return privateJson({ error: error.message }, 409)
    if (error instanceof OutcomeCaptureNotFoundError) return privateJson({ error: error.message }, 404)
    logFailure('capture', error)
    return privateJson({ error: 'No pudimos registrar el resultado.' }, 500)
  }
}
