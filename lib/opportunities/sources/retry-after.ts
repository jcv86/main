const DEFAULT_RATE_LIMIT_PAUSE_MS = 3 * 60 * 60_000
const LAST_SUPPORTED_INSTANT = 253402300799999
const HTTP_DATE = /^(?:(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT|(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), \d{2}-[A-Z][a-z]{2}-\d{2} \d{2}:\d{2}:\d{2} GMT|(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) [A-Z][a-z]{2} {1,2}\d{1,2} \d{2}:\d{2}:\d{2} \d{4})$/

function httpDate(value: string, now: number): number {
  if (value.length > 100 || !HTTP_DATE.test(value)) return NaN
  const parts = value.replace(/[,\-]/g, ' ').trim().split(/\s+/)
  const asctime = parts.length === 5
  const day = Number(parts[asctime ? 2 : 1])
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(parts[asctime ? 1 : 2])
  const yearText = parts[asctime ? 4 : 3]
  let year = Number(yearText)
  if (yearText.length === 2) {
    const currentYear = new Date(now).getUTCFullYear()
    year += Math.floor(currentYear / 100) * 100
    if (year > currentYear + 50) year -= 100
  }
  const [hour, minute, second] = parts[asctime ? 3 : 4].split(':').map(Number)
  const parsed = Date.UTC(year, month, day, hour, minute, second)
  const date = new Date(parsed)
  // Date.parse rolls impossible dates into another month; those are not evidence
  // of a valid provider pause. Interpret all three HTTP-date forms in UTC.
  return month >= 0 && date.getUTCFullYear() === year && date.getUTCMonth() === month
    && date.getUTCDate() === day && date.getUTCHours() === hour
    && date.getUTCMinutes() === minute && date.getUTCSeconds() === second ? parsed : NaN
}

/** Preserve a provider's requested pause without exposing its response body. */
export function sourceRetryAfterUntil(status: number, value: string | null, now: number): string | undefined {
  if ((status !== 429 && status !== 503) || !Number.isFinite(new Date(now).getTime())) return undefined
  const raw = value?.trim() || ''
  const seconds = /^\d+$/.test(raw) ? Number(raw) : NaN
  const requested = Number.isSafeInteger(seconds)
    ? now + seconds * 1000
    : httpDate(raw, now)
  if (Number.isFinite(requested) && requested > now && requested <= LAST_SUPPORTED_INSTANT) {
    return new Date(requested).toISOString()
  }
  const fallback = now + DEFAULT_RATE_LIMIT_PAUSE_MS
  return status === 429 && fallback <= LAST_SUPPORTED_INSTANT ? new Date(fallback).toISOString() : undefined
}
