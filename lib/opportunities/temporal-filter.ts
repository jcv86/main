import { normalizeChileTrabajosDate } from './sources/chiletrabajos-parser'

function chileDate(now: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now)
  const part = (type: string) => parts.find(value => value.type === type)?.value || ''
  return `${part('year')}-${part('month')}-${part('day')}`
}

export function isOpportunityPublished(value: unknown, now: Date): boolean {
  if (value === null || value === undefined || (typeof value === 'string' && !value.trim())) return true
  const normalized = normalizeChileTrabajosDate(value)
  if (!normalized) return false
  return normalized.length === 10
    ? normalized <= chileDate(now)
    : Date.parse(normalized) <= now.getTime()
}

/**
 * Both date columns are TEXT. Current writers store YYYY-MM-DD or UTC ISO with
 * milliseconds. Filter those canonical values before LIMIT, preserving the full
 * Chilean expiry day. Other legacy shapes require the real in-memory date parser;
 * lexical comparison must never reject a valid timestamp with an explicit offset.
 * Only server-generated dates enter this raw PostgREST expression.
 */
export function opportunityTemporalFilter(now: Date, includePublication = true): string {
  const today = chileDate(now)
  const timestamp = now.toISOString()
  const datePattern = '____-__-__'
  const timestampPattern = '____-__-__T__:__:__.___Z'
  const clause = (column: 'expires_at' | 'published_at', dayOperator: string, instantOperator: string) =>
    `or(${column}.is.null,${column}.eq."",` +
    `and(${column}.like.${datePattern},${column}.${dayOperator}.${today}),` +
    `and(${column}.like.${timestampPattern},${column}.${instantOperator}.${timestamp}),` +
    `and(${column}.not.like.${datePattern},${column}.not.like.${timestampPattern}))`
  const expiry = clause('expires_at', 'gte', 'gt')
  return includePublication
    ? `and(${expiry},${clause('published_at', 'lte', 'lte')})`
    : expiry
}
