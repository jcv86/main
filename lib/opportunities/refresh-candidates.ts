import type { AdminDbClient } from './verified-index'
import { inferChileRegion } from './taxonomy'
import { opportunityTemporalFilter } from './temporal-filter'
import {
  isChileTrabajosExpired,
  isChileTrabajosJobUrl,
  normalizeChileTrabajosDate,
} from './sources/chiletrabajos-parser'

const REFRESH_AFTER_MS = 18 * 60 * 60 * 1000
const MAX_ROWS = 30
const MAX_CANDIDATES = 3
const ELIGIBLE_STATES = ['verified_active', 'unavailable', 'unknown']
const COLUMNS = 'source_id,original_url,region,verification_status,last_verified_at,updated_at,expires_at'

function assertNotAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
}

function validIdentity(id: unknown, originalUrl: unknown): id is string {
  if (typeof id !== 'string' || !/^\d{5,10}$/.test(id) || typeof originalUrl !== 'string') return false
  try {
    const url = new URL(originalUrl)
    return !url.search && !url.hash && isChileTrabajosJobUrl(originalUrl, id)
  } catch {
    return false
  }
}

function validExpiry(value: unknown, now: Date): boolean {
  if (value === null) return true
  if (typeof value !== 'string') return false
  if (!value.trim()) return true
  const normalized = normalizeChileTrabajosDate(value)
  return Boolean(normalized) && !isChileTrabajosExpired(normalized, now)
}

/**
 * Pick a bounded maintenance queue from prior observations in this region.
 * Reading never verifies a vacancy or changes its last-attempt/freshness clocks.
 * A later provider probe must supply the evidence for any index update.
 */
export async function readChileTrabajosRefreshCandidates(
  supabase: AdminDbClient,
  location: string,
  options: { now?: Date; signal?: AbortSignal } = {},
): Promise<string[]> {
  assertNotAborted(options.signal)
  const now = options.now ?? new Date()
  const nowIso = now.toISOString()
  const cutoffMs = now.getTime() - REFRESH_AFTER_MS
  const region = inferChileRegion(location)
  // Unknown/ambiguous locations must not turn maintenance into a countrywide scan.
  if (!region) return []
  const query = supabase.from('a4_verified_opportunities')
    .select(COLUMNS)
    .eq('source', 'chiletrabajos')
    .eq('region', region)
    .in('verification_status', ELIGIBLE_STATES)
    .lte('last_verified_at', new Date(cutoffMs).toISOString())
    .lte('updated_at', nowIso)
    .or(opportunityTemporalFilter(now, false))
    .order('updated_at', { ascending: true })
    .order('last_verified_at', { ascending: true })
    .order('source_id', { ascending: true })
    .limit(MAX_ROWS)
  const response = await (options.signal ? query.abortSignal(options.signal) : query)
  assertNotAborted(options.signal)
  if (response?.error) throw response.error
  if (!Array.isArray(response?.data) || response.data.length > MAX_ROWS
      || response.data.some((row: unknown) => !row || typeof row !== 'object' || Array.isArray(row))) {
    throw new Error('Invalid Chiletrabajos refresh candidate response')
  }

  const ids = new Set<string>()
  for (const row of response.data) {
    const verifiedMs = typeof row.last_verified_at === 'string' ? Date.parse(row.last_verified_at) : NaN
    const updatedMs = typeof row.updated_at === 'string' ? Date.parse(row.updated_at) : NaN
    if (row.region !== region || !ELIGIBLE_STATES.includes(row.verification_status)
        || !Number.isFinite(verifiedMs) || verifiedMs > cutoffMs
        || !Number.isFinite(updatedMs) || updatedMs > now.getTime()
        || !validIdentity(row.source_id, row.original_url)
        || !validExpiry(row.expires_at, now)) continue
    ids.add(row.source_id)
    if (ids.size === MAX_CANDIDATES) break
  }
  return [...ids]
}
