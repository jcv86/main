/** Pure reporting boundary. Missing evidence must never become an apparent score. */
export const A1_DIMENSIONS = ['D', 'I', 'S', 'C'] as const
export type A1DiscDimension = (typeof A1_DIMENSIONS)[number]
export type A1ScoreMap = Record<A1DiscDimension, number | null>

export interface A1ScoreEvidence {
  scores: A1ScoreMap
  status: 'complete' | 'partial' | 'missing' | 'invalid'
  availableDimensions: number
  missingDimensions: A1DiscDimension[]
  invalidDimensions: A1DiscDimension[]
}

function assertLimit(limit: number): void {
  if (!Number.isInteger(limit) || limit <= 0) throw new RangeError('Invalid questionnaire score limit')
}

export function readA1ScoreEvidence(raw: unknown, limit: number): A1ScoreEvidence {
  assertLimit(limit)
  const source: Record<string, unknown> = raw && typeof raw === 'object' && !Array.isArray(raw)
    ? raw as Record<string, unknown>
    : {}
  const scores: A1ScoreMap = { D: null, I: null, S: null, C: null }
  const missingDimensions: A1DiscDimension[] = []
  const invalidDimensions: A1DiscDimension[] = []
  for (const key of A1_DIMENSIONS) {
    const value = Object.prototype.hasOwnProperty.call(source, key) ? source[key] : undefined
    if (value == null || (typeof value === 'string' && !value.trim())) {
      missingDimensions.push(key)
      continue
    }
    // Retain compatibility with integer strings; reject coercible booleans, arrays and objects.
    const score = typeof value === 'number' ? value
      : typeof value === 'string' && /^[+-]?\d+(?:\.0+)?$/.test(value.trim()) ? Number(value.trim()) : NaN
    if (!Number.isInteger(score) || Math.abs(score) > limit) {
      invalidDimensions.push(key)
      continue
    }
    scores[key] = score
  }
  const availableDimensions = A1_DIMENSIONS.filter((key) => scores[key] !== null).length
  return {
    scores,
    status: availableDimensions === 4 ? 'complete' : invalidDimensions.length ? 'invalid'
      : availableDimensions ? 'partial' : 'missing',
    availableDimensions,
    missingDimensions,
    invalidDimensions,
  }
}

export function netScoreToIntensity(score: number | null, limit: number): number | null {
  assertLimit(limit)
  if (score === null || !Number.isFinite(score)) return null
  return Math.round(((Math.max(-limit, Math.min(limit, score)) + limit) / (limit * 2)) * 100)
}

function dimension(value: unknown): A1DiscDimension | null {
  if (typeof value !== 'string') return null
  const key = value.trim().toUpperCase() as A1DiscDimension
  return A1_DIMENSIONS.includes(key) ? key : null
}

export function resolveA1Patterns(evidence: A1ScoreEvidence, storedPrimary?: unknown, storedSecondary?: unknown): {
  primary: A1DiscDimension | null
  secondary: A1DiscDimension | null
  source: 'canonical' | 'derived' | 'unavailable'
} {
  if (evidence.status !== 'complete') return { primary: null, secondary: null, source: 'unavailable' }
  const canonicalPrimary = dimension(storedPrimary)
  const canonicalSecondary = dimension(storedSecondary)
  const uniqueLeader = (keys: A1DiscDimension[]): A1DiscDimension | null => {
    const maximum = Math.max(...keys.map((key) => evidence.scores[key]!))
    const leaders = keys.filter((key) => evidence.scores[key] === maximum)
    return leaders.length === 1 ? leaders[0] : null
  }
  const primary = canonicalPrimary || uniqueLeader([...A1_DIMENSIONS])
  if (!primary) return { primary: null, secondary: null, source: 'unavailable' }
  const secondary = canonicalSecondary && canonicalSecondary !== primary ? canonicalSecondary
    : uniqueLeader(A1_DIMENSIONS.filter((key) => key !== primary))
  return {
    primary,
    secondary,
    source: !secondary ? 'unavailable'
      : canonicalPrimary && canonicalSecondary && canonicalSecondary !== primary ? 'canonical' : 'derived',
  }
}

/** Accept explicit ISO timestamps only: never infer a timezone or normalize an impossible calendar date. */
export function normalizeReportTimestamp(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const text = value.trim()
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(Z|[+-]\d{2}:\d{2})$/.exec(text)
  if (!match) return null
  const [, y, m, d, h, min, sec, zone] = match
  const year = Number(y), month = Number(m), day = Number(d)
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const monthDays = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (month < 1 || month > 12 || day < 1 || day > monthDays[month - 1]
    || Number(h) > 23 || Number(min) > 59 || Number(sec) > 59) return null
  if (zone !== 'Z' && (Number(zone.slice(1, 3)) > 23 || Number(zone.slice(4, 6)) > 59)) return null
  const date = new Date(text)
  return Number.isFinite(date.getTime()) ? date.toISOString() : null
}

export function latestReportTimestamp(values: unknown[]): string | null {
  const dates = values.map(normalizeReportTimestamp).filter((value): value is string => value !== null)
  return dates.length ? dates.reduce((latest, date) => Date.parse(date) > Date.parse(latest) ? date : latest) : null
}

export function formatReportDate(value: unknown): string {
  const timestamp = normalizeReportTimestamp(value)
  if (!timestamp) return 'Fecha no disponible'
  return new Intl.DateTimeFormat('es-CL', {
    timeZone: 'America/Santiago', day: '2-digit', month: 'long', year: 'numeric',
  }).format(new Date(timestamp))
}
