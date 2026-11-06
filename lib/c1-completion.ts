import type { AssessmentDraft } from '@/lib/assessment-drafts'
import { validateC1CompletionAnswers, validateC1DraftAnswers } from '@/lib/c1-responses'

export const C1_COMPLETION_PATH = '/api/journey/complete-c1'
export const C1_NEXT_PATH = '/despega/a1-cerebral-intro'
export const C1_SIGN_IN_PATH = '/auth/signin?next=%2Fdespega%2Fconozcamonos-1'
export const C1_ACTOR_HEADER = 'X-DTC-Actor-Id'
export const C1_EXPECTED_ACTOR_HEADER = 'X-DTC-Expected-User-Id'

export type C1CompletionInput = {
  schemaVersion: 1
  answers: Record<string, unknown>
  expectedDraftUpdatedAt: string | null
}
export type C1Completed = {
  state: 'completed'
  origin: 'atomic' | 'legacy'
  responseId: string
  draftId: string | null
  completedAt: string
  nextPath: typeof C1_NEXT_PATH
}
export type C1CompletionResult = C1Completed & { replayed: boolean }
export type C1CompletionStatus =
  | (C1Completed & { draft: null })
  | { state: 'not_started'; draft: null }
  | { state: 'in_progress'; draft: AssessmentDraft }
  | { state: 'recovery_required'; draft: AssessmentDraft | null }

export const C1_COMPLETION_ERRORS = {
  authentication_required: { status: 401, message: 'Tu sesión venció. Vuelve a ingresar y luego reintenta; tus respuestas siguen aquí.' },
  access_required: { status: 403, message: 'Esta cuenta no tiene acceso al piloto. Ingresa con una cuenta habilitada para continuar.' },
  invalid_answers: { status: 422, message: 'Revisa que hayas respondido las siete preguntas y que cada texto tenga como máximo 500 caracteres.' },
  draft_changed: { status: 409, message: 'El avance guardado cambió en otra pestaña. Tus respuestas siguen aquí; revisa la versión guardada antes de continuar.' },
  completion_conflict: { status: 409, message: 'Ya existe un cierre con respuestas diferentes. Tus respuestas siguen aquí; revisa el avance guardado antes de continuar.' },
  recovery_required: { status: 409, message: 'Encontramos un cierre anterior que todavía no pudimos confirmar. Conservamos el avance disponible para que puedas reintentar.' },
  session_changed: { status: 409, message: 'La cuenta activa cambió. Recupera el avance de la cuenta actual para continuar.' },
  completion_unavailable: { status: 503, message: 'No pudimos confirmar el guardado. Tus respuestas siguen aquí. Intenta de nuevo.' },
} as const
export type C1CompletionErrorCode = keyof typeof C1_COMPLETION_ERRORS

export class C1CompletionError extends Error {
  readonly code: C1CompletionErrorCode
  readonly status: number
  constructor(code: C1CompletionErrorCode) {
    super(C1_COMPLETION_ERRORS[code].message)
    this.name = 'C1CompletionError'
    this.code = code
    this.status = C1_COMPLETION_ERRORS[code].status
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}
function isUuid(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}
export function isC1DraftRevision(value: unknown): value is string {
  return typeof value === 'string'
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)
    && Number.isFinite(Date.parse(value))
}

export function parseC1CompletionInput(value: unknown): C1CompletionInput | null {
  if (!isRecord(value) || value.schemaVersion !== 1) return null
  if (Object.keys(value).some(key => !['schemaVersion', 'answers', 'expectedDraftUpdatedAt'].includes(key))) return null
  if (new TextEncoder().encode(JSON.stringify(value)).length > 64 * 1024) return null
  if (!validateC1CompletionAnswers(value.answers)) return null
  if (value.expectedDraftUpdatedAt !== null && !isC1DraftRevision(value.expectedDraftUpdatedAt)) return null
  return { schemaVersion: 1, answers: value.answers, expectedDraftUpdatedAt: value.expectedDraftUpdatedAt as string | null }
}

function parseCompleted(value: unknown): C1Completed | null {
  if (!isRecord(value) || value.state !== 'completed') return null
  if (value.origin !== 'atomic' && value.origin !== 'legacy') return null
  if (!isUuid(value.responseId) || !isC1DraftRevision(value.completedAt) || value.nextPath !== C1_NEXT_PATH) return null
  const draftId = value.draftId ?? null
  if (value.origin === 'atomic' ? !isUuid(draftId) : draftId !== null && !isUuid(draftId)) return null
  return { state: 'completed', origin: value.origin, responseId: value.responseId, draftId: draftId as string | null,
    completedAt: value.completedAt, nextPath: C1_NEXT_PATH }
}

export function parseC1CompletionResult(value: unknown): C1CompletionResult | null {
  const completed = parseCompleted(value)
  if (!completed || !isRecord(value) || typeof value.replayed !== 'boolean') return null
  return { ...completed, replayed: value.replayed }
}

function parseDraft(value: unknown): AssessmentDraft | null {
  if (!isRecord(value) || value.assessmentType !== 'c1' || value.schemaVersion !== 1) return null
  if (!Number.isInteger(value.currentQuestion) || Number(value.currentQuestion) < 0 || Number(value.currentQuestion) > 6) return null
  if (!validateC1DraftAnswers(value.answers) || !isC1DraftRevision(value.updatedAt)) return null
  if (value.completedAt !== null && !isC1DraftRevision(value.completedAt)) return null
  if (!Array.isArray(value.timings) || value.timings.length !== 0) return null
  return { assessmentType: 'c1', schemaVersion: 1, currentQuestion: Number(value.currentQuestion),
    answers: value.answers as Record<string, unknown>, timings: [], updatedAt: value.updatedAt, completedAt: value.completedAt as string | null }
}

export function parseC1CompletionStatus(value: unknown): C1CompletionStatus | null {
  if (!isRecord(value)) return null
  if (value.state === 'completed') {
    const completed = parseCompleted(value)
    return completed && value.draft === null ? { ...completed, draft: null } : null
  }
  if (value.state === 'not_started') {
    return value.draft === null && value.responseId == null ? { state: 'not_started', draft: null } : null
  }
  if (value.state !== 'in_progress' && value.state !== 'recovery_required') return null
  const draft = value.draft === null ? null : parseDraft(value.draft)
  if (value.draft !== null && !draft) return null
  if (value.state === 'in_progress') return draft && draft.completedAt === null ? { state: 'in_progress', draft } : null
  return { state: 'recovery_required', draft }
}

/** Only named business errors are public; SQL diagnostics remain server-side. */
export function c1CompletionDatabaseError(value: unknown): C1CompletionErrorCode {
  if (!isRecord(value)) return 'completion_unavailable'
  if (value.code === '22023' && ['c1_invalid_payload', 'c1_unsupported_version'].includes(String(value.message))) return 'invalid_answers'
  if (value.code === '42501' && value.message === 'c1_access_required') return 'access_required'
  if (value.code === 'P0001') {
    if (value.message === 'c1_draft_changed') return 'draft_changed'
    if (value.message === 'c1_already_completed_with_different_answers') return 'completion_conflict'
    if (['c1_completion_inconsistent', 'c1_legacy_completion_conflict'].includes(String(value.message))) return 'recovery_required'
  }
  return 'completion_unavailable'
}

function responseError(status: number, value: unknown): C1CompletionError {
  if (isRecord(value) && typeof value.error === 'string' && Object.hasOwn(C1_COMPLETION_ERRORS, value.error)) {
    const code = value.error as C1CompletionErrorCode
    if (C1_COMPLETION_ERRORS[code].status === status) return new C1CompletionError(code)
  }
  if (status === 401) return new C1CompletionError('authentication_required')
  if (status === 403) return new C1CompletionError('access_required')
  if (status === 422) return new C1CompletionError('invalid_answers')
  if (status === 409) return new C1CompletionError('completion_conflict')
  return new C1CompletionError('completion_unavailable')
}

export function asC1CompletionError(value: unknown): C1CompletionError {
  return value instanceof C1CompletionError ? value : new C1CompletionError('completion_unavailable')
}

async function requestCompletion(method: 'GET' | 'POST', body: C1CompletionInput | undefined, fetcher: typeof fetch, expectedUserId?: string) {
  let response: Response
  try {
    response = await fetcher(C1_COMPLETION_PATH, { method, credentials: 'same-origin', cache: 'no-store',
      headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(expectedUserId ? { [C1_EXPECTED_ACTOR_HEADER]: expectedUserId } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}) })
  } catch {
    throw new C1CompletionError('completion_unavailable')
  }
  const data = await response.json().catch(() => null)
  if (!response.ok) throw responseError(response.status, data)
  return { data, response }
}

export async function loadC1CompletionStatus(fetcher: typeof fetch = fetch): Promise<C1CompletionStatus & { userId: string }> {
  const { data, response } = await requestCompletion('GET', undefined, fetcher)
  const status = parseC1CompletionStatus(data), userId = response.headers.get(C1_ACTOR_HEADER)
  if (!status || !isUuid(userId)) throw new C1CompletionError('completion_unavailable')
  return { ...status, userId }
}

export async function completeC1(input: C1CompletionInput, expectedUserId: string, fetcher: typeof fetch = fetch): Promise<C1CompletionResult> {
  if (!parseC1CompletionInput(input)) throw new C1CompletionError('invalid_answers')
  if (!isUuid(expectedUserId)) throw new C1CompletionError('session_changed')
  const { data } = await requestCompletion('POST', input, fetcher, expectedUserId)
  const result = parseC1CompletionResult(data)
  if (!result || data?.success !== true) throw new C1CompletionError('completion_unavailable')
  return result
}
