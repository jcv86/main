import type { OutcomesChileSummary } from '@/lib/outcomes-chile/workspace'

export const OUTCOMES_CHILE_ROUTE = '/despega/resultados-laborales'
export const OUTCOMES_CHILE_SIGN_IN = `/auth/signin?next=${encodeURIComponent(OUTCOMES_CHILE_ROUTE)}`
const ENDPOINT = '/api/outcomes/chile'

export type OutcomeCapturePayload =
  | { action: 'job_search_event'; eventType: string; occurredAt: string; targetRole: string | null; sourceChannel: string | null; regionCode: null; occupationCode: null }
  | { action: 'employment_outcome'; outcomeType: string; effectiveDate: string; roleTitle: string; workMode: string | null; employmentCategory: string | null; sourceChannel: string | null; regionCode: null; occupationCode: null }
  | { action: 'salary_outcome'; measurementRole: string; monthlyNetClp: number; measuredAt: string; employmentOutcomeId: string | null }
  | { action: 'complete_followup'; followupId: string; employmentActive: boolean; sameRole: boolean | null }

export class OutcomesClientError extends Error {
  constructor(
    public readonly kind: 'session' | 'unavailable' | 'validation' | 'conflict' | 'unconfirmed',
    message: string,
    public readonly refreshSuggested = false,
  ) {
    super(message)
    this.name = 'OutcomesClientError'
  }
}

function responseError(status: number, code: unknown): OutcomesClientError {
  if (status === 401) return new OutcomesClientError('session', 'Tu sesión terminó. Vuelve a ingresar para continuar.')
  if (status === 404) return new OutcomesClientError('conflict', 'Este seguimiento ya no está disponible. Actualiza tus resultados para revisarlo.', true)
  if (status === 409) {
    const messages: Record<string, string> = {
      FOLLOWUP_NOT_DUE: 'Este seguimiento todavía no está disponible para responder. Revisa su fecha programada.',
      FOLLOWUP_ALREADY_COMPLETED: 'Este seguimiento ya tiene una respuesta guardada. Actualiza tus resultados para verla.',
      FOLLOWUP_VERIFICATION_LOCKED: 'Este seguimiento tiene evidencia revisada y no admite cambios desde aquí.',
      IDEMPOTENCY_KEY_REUSED: 'No pudimos confirmar este registro. Revisa tus resultados antes de iniciar uno nuevo.',
    }
    return new OutcomesClientError('conflict', typeof code === 'string' && Object.hasOwn(messages, code)
      ? messages[code] : 'El registro cambió mientras lo completabas. Actualiza tus resultados para revisarlo.', true)
  }
  if (status === 400 || status === 422) {
    if (typeof code === 'string' && ['FUTURE_OCCURRED_AT', 'FUTURE_EFFECTIVE_DATE', 'FUTURE_MEASURED_AT'].includes(code)) {
      return new OutcomesClientError('validation', 'La fecha ingresada está en el futuro. Registra un hecho que ya haya ocurrido.')
    }
    return new OutcomesClientError('validation', 'Revisa los campos y las fechas antes de volver a guardar.')
  }
  if (status === 503) return new OutcomesClientError('unavailable', 'El servicio no está disponible en este momento. Conservamos lo que escribiste mientras mantengas abierta esta pantalla; puedes reintentar en unos minutos.')
  return new OutcomesClientError('unconfirmed', 'No pudimos confirmar el guardado. Reintenta con los mismos datos para comprobarlo sin duplicar el registro.')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

async function requestJson(init: RequestInit, signal?: AbortSignal): Promise<unknown> {
  const controller = new AbortController()
  const abort = () => controller.abort()
  const timeout = setTimeout(abort, 30_000)
  signal?.addEventListener('abort', abort, { once: true })
  if (signal?.aborted) abort()
  try {
    const response = await fetch(ENDPOINT, {
      ...init, cache: 'no-store', credentials: 'same-origin', signal: controller.signal,
      headers: { Accept: 'application/json', ...init.headers },
    })
    let body: unknown = null
    try { body = await response.json() } catch { /* A lost body must retain the submission ID for retry. */ }
    if (!response.ok) throw responseError(response.status, isRecord(body) ? body.error : null)
    if (!isRecord(body)) throw new OutcomesClientError('unconfirmed', 'No pudimos confirmar la respuesta. Reintenta con los mismos datos para comprobar el registro.')
    return body
  } catch (error) {
    if (error instanceof OutcomesClientError) throw error
    throw new OutcomesClientError('unconfirmed', 'No pudimos confirmar la respuesta. Revisa tu conexión y reintenta con los mismos datos.')
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', abort)
  }
}

function finite(value: unknown): value is number { return typeof value === 'number' && Number.isFinite(value) }
function nullableNumber(value: unknown): boolean { return value === null || finite(value) }
function count(value: unknown): boolean { return finite(value) && Number.isInteger(value) && value >= 0 }
function verification(value: unknown): boolean { return value === 'self_reported' || value === 'corroborated' || value === 'verified' }
function nullableBoolean(value: unknown): boolean { return value === null || typeof value === 'boolean' }
function nullableString(value: unknown): boolean { return value === null || typeof value === 'string' }
function oneOf(value: unknown, options: readonly string[]): boolean { return typeof value === 'string' && options.includes(value) }
function calendarDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function salaryEvidence(value: unknown): boolean {
  return value === null || (isRecord(value) && count(value.monthlyNetClp) && calendarDate(value.measuredAt) && verification(value.verification))
}

function benchmarkEvidence(value: unknown): boolean {
  if (value === null) return true
  return isRecord(value) && finite(value.value) && value.value >= 0
    && oneOf(value.unit, ['clp_month', 'percent', 'count', 'index'])
    && oneOf(value.metricKey, ['monthly_labor_income_mean', 'monthly_labor_income_median', 'employment_rate', 'unemployment_rate', 'vacancy_demand', 'skill_demand'])
    && oneOf(value.sourceKey, ['ine_esi', 'ine_ene', 'sence_enadel', 'other_official'])
    && oneOf(value.specificity, ['region_occupation_education', 'region_occupation', 'occupation', 'region', 'national'])
    && typeof value.sourcePeriod === 'string' && typeof value.sourceRef === 'string'
    && calendarDate(value.publishedAt) && calendarDate(value.asOf)
    && oneOf(value.reliabilityStatus, ['official_published', 'official_microdata_derived'])
    && isRecord(value.dimensions) && nullableString(value.dimensions.employmentCategory)
    && (value.sampleSize === null || count(value.sampleSize))
}

function completeSummary(value: unknown): value is OutcomesChileSummary {
  if (!isRecord(value) || !isRecord(value.impact) || !isRecord(value.workspace)) return false
  const impact = value.impact, workspace = value.workspace
  if (!isRecord(impact.observed) || !isRecord(impact.observed.salary) || !isRecord(impact.observed.economic)
    || !isRecord(impact.observed.jobSearch) || !Array.isArray(impact.observed.retention)
    || !isRecord(impact.delta) || !isRecord(impact.delta.versusBaseline) || !isRecord(impact.projection)
    || !isRecord(impact.verification) || !isRecord(impact.attribution) || typeof impact.attribution.notice !== 'string') return false
  const observed = impact.observed, salary = impact.observed.salary, pair = impact.delta.versusBaseline
  if (!salaryEvidence(salary.baseline) || !salaryEvidence(salary.latest)
    || !['applications', 'interviews', 'offers'].every(key => count(observed.jobSearch[key]))
    || !['baselineMonthlyNetClp', 'latestMonthlyNetClp', 'monthlyLiftClp', 'salaryLiftPct'].every(key => nullableNumber(observed.economic[key]))
    || !oneOf(pair.status, ['comparable', 'missing_latest', 'missing_baseline', 'no_earlier_baseline', 'ambiguous_baseline', 'ambiguous_latest'])
    || typeof pair.comparable !== 'boolean' || pair.comparable !== (pair.status === 'comparable')
    || !nullableNumber(pair.monthlyClp) || !nullableNumber(pair.percent)
    || (pair.comparable && (pair.monthlyClp === null || salary.baseline === null || salary.latest === null))
    || !nullableNumber(impact.projection.annualizedLiftClp)
    || !(impact.verification.salaryPair === null || verification(impact.verification.salaryPair))
    || !benchmarkEvidence(impact.benchmark)) return false
  if (!calendarDate(workspace.asOfDate) || !Array.isArray(workspace.employmentOptions) || !Array.isArray(workspace.followups) || !Array.isArray(workspace.history)) return false
  for (const [items, total, truncated] of [
    [workspace.employmentOptions, workspace.employmentOptionCount, workspace.employmentOptionsTruncated],
    [workspace.followups, workspace.followupCount, workspace.followupsTruncated],
    [workspace.history, workspace.historyCount, workspace.historyTruncated],
  ] as const) {
    if (!count(total) || typeof truncated !== 'boolean' || (total as number) < items.length || truncated !== ((total as number) > items.length)) return false
  }
  return workspace.employmentOptions.every(item => isRecord(item) && typeof item.id === 'string' && typeof item.roleTitle === 'string' && calendarDate(item.effectiveDate) && verification(item.verification))
    && workspace.followups.every(item => isRecord(item) && typeof item.id === 'string' && typeof item.roleTitle === 'string'
      && (item.day === 30 || item.day === 90 || item.day === 180) && calendarDate(item.dueAt) && nullableString(item.completedAt)
      && nullableBoolean(item.employmentActive) && nullableBoolean(item.sameRole) && verification(item.verification)
      && oneOf(item.state, ['upcoming', 'due', 'overdue', 'completed', 'needs_review']) && typeof item.canComplete === 'boolean')
    && workspace.history.every(item => isRecord(item) && typeof item.id === 'string' && typeof item.title === 'string'
      && oneOf(item.kind, ['event', 'employment', 'salary', 'followup']) && nullableString(item.detail)
      && calendarDate(item.date) && (item.monthlyNetClp === null || count(item.monthlyNetClp)) && verification(item.verification))
}

export async function loadOutcomesChile(signal: AbortSignal): Promise<OutcomesChileSummary> {
  try {
    const body = await requestJson({ method: 'GET' }, signal)
    if (!completeSummary(body)) throw new OutcomesClientError('unavailable', 'No pudimos cargar tus resultados completos. Inténtalo nuevamente.')
    return body
  } catch (error) {
    if (error instanceof OutcomesClientError && error.kind === 'session') throw error
    throw new OutcomesClientError('unavailable', 'No pudimos cargar tus resultados completos. Revisa tu conexión e inténtalo nuevamente.')
  }
}

/** One form's retry ledger, held only in memory and cleared by an explicit new-record action. */
export function createOutcomeSubmissionSession() {
  const attempts = new Map<string, { requestId: string; confirmed: boolean }>()
  let inFlight: Promise<'saved' | 'already_saved'> | null = null
  return {
    send(payload: OutcomeCapturePayload): Promise<'saved' | 'already_saved'> {
      if (inFlight) return inFlight
      const ordered = Object.fromEntries(Object.entries(payload).sort(([a], [b]) => a.localeCompare(b)))
      const fingerprint = JSON.stringify(ordered)
      let attempt = attempts.get(fingerprint)
      if (attempt?.confirmed) return Promise.resolve('already_saved')
      if (!attempt) {
        attempt = { requestId: globalThis.crypto.randomUUID(), confirmed: false }
        attempts.set(fingerprint, attempt)
      }
      const current = attempt
      inFlight = requestJson({
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, requestId: current.requestId }),
      }).then((body) => {
        if (!isRecord(body) || !isRecord(body.data) || typeof body.data.id !== 'string') {
          throw new OutcomesClientError('unconfirmed', 'No pudimos confirmar el registro. Reintenta con los mismos datos para comprobarlo.')
        }
        current.confirmed = true
        return 'saved' as const
      }).finally(() => { inFlight = null })
      return inFlight
    },
    reset() {
      if (inFlight) return false
      attempts.clear()
      return true
    },
  }
}

const moneyFormat = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
const numberFormat = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 1 })

export function formatClp(value: number): string { return moneyFormat.format(value) }
export function formatNumber(value: number): string { return numberFormat.format(value) }
export function formatDate(value: string): string {
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value)
  const date = new Date(dateOnly ? `${value}T00:00:00Z` : value)
  if (!Number.isFinite(date.getTime())) return 'Fecha por revisar'
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: dateOnly ? 'UTC' : 'America/Santiago',
  }).format(date)
}

export function localDateTimeValue(date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function eventTimestamp(value: string): string {
  const date = new Date(value)
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) || !Number.isFinite(date.getTime())
    || localDateTimeValue(date) !== value) {
    throw new OutcomesClientError('validation', 'Revisa la fecha y la hora. Deben existir en la zona horaria de tu dispositivo.')
  }
  if (date.getTime() > Date.now()) throw new OutcomesClientError('validation', 'La fecha y hora están en el futuro. Registra un hecho que ya haya ocurrido.')
  return date.toISOString()
}
