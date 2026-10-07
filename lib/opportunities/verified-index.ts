import type { ChileTrabajosPublicJob } from './sources/chiletrabajos'
import { isChileTrabajosExpired, normalizeChileTrabajosDate } from './sources/chiletrabajos'
import type { CanonicalOpportunity, OpportunityVerificationStatus } from './sources/getonboard'
import { categorizeOpportunity, inferChileRegion, normalizeRoleTitle } from './taxonomy'

export type AdminDbClient = { from: (table: string) => any }
export type VerifiedOpportunityInput = ChileTrabajosPublicJob | CanonicalOpportunity
export const OPPORTUNITY_FRESHNESS_MS = 24 * 60 * 60 * 1000
const TABLE = 'a4_verified_opportunities'

export interface VerifiedOpportunityRow {
  source: 'chiletrabajos' | 'getonboard'
  source_id: string
  original_url: string
  title: string
  normalized_title: string
  category_key: string
  category_label: string
  company: string
  location: string | null
  region: string | null
  work_mode: 'remote' | 'hybrid' | 'onsite' | null
  published_at: string | null
  expires_at: string | null
  verification_status: OpportunityVerificationStatus
  last_verified_at: string
  description: string | null
  requirements: string[]
  skills: string[]
  [key: string]: unknown
}

export interface IndexWriteOptions {
  now?: Date
  signal?: AbortSignal
}

export interface OpportunityVerificationFailure {
  sourceId: string
  verificationStatus: 'stale' | 'unavailable' | 'unknown' | 'verified_restricted'
}

function queryWithSignal(query: any, signal?: AbortSignal): any {
  return signal ? query.abortSignal(signal) : query
}

function knownSource(value: unknown): value is VerifiedOpportunityRow['source'] {
  return value === 'chiletrabajos' || value === 'getonboard'
}

function safeOriginalUrl(source: string, id: string, value: string): boolean {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password) return false
    if (source !== 'chiletrabajos') return source === 'getonboard'
    if (!['www.chiletrabajos.cl', 'chiletrabajos.cl'].includes(url.hostname)) return false
    const match = url.pathname.match(/^\/trabajo\/(?:[^/]+-)?(\d{5,10})\/?$/)
    return Boolean(match && match[1] === id)
  } catch {
    return false
  }
}

function cleanDescription(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const clean = value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 40_000)
  if (!clean || /^(publicidad|advertisement|anuncio)$/i.test(clean)) return null
  return clean
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim().slice(0, 500)).filter(Boolean).slice(0, 100)
    : []
}

function normalizeWorkMode(value: unknown): VerifiedOpportunityRow['work_mode'] {
  return value === 'remote' || value === 'hybrid' || value === 'onsite' ? value : null
}

function validExpiry(value: string | null | undefined, now: Date): boolean {
  if (!value?.trim()) return true
  const normalized = normalizeChileTrabajosDate(value)
  return Boolean(normalized) && !isChileTrabajosExpired(normalized, now)
}

/**
 * Failed checks only invalidate existing rows. They never insert placeholder
 * jobs or advance last_verified_at, and they preserve the last known metadata.
 */
export async function invalidateOpportunityVerifications(
  supabase: AdminDbClient,
  source: VerifiedOpportunityRow['source'],
  failures: OpportunityVerificationFailure[],
  options: IndexWriteOptions = {},
): Promise<number> {
  if (!failures.length) return 0
  const now = (options.now ?? new Date()).toISOString()
  const byId = new Map(failures.map((failure) => [failure.sourceId, failure]))
  let affected = 0

  for (const status of ['stale', 'unavailable', 'unknown', 'verified_restricted'] as const) {
    const ids = [...byId.values()]
      .filter((failure) => failure.verificationStatus === status && failure.sourceId)
      .map((failure) => failure.sourceId)
    if (!ids.length) continue
    const query = supabase.from(TABLE)
      .update({ verification_status: status, updated_at: now }, { count: 'exact' })
      .eq('source', source)
      .in('source_id', ids)
    const { error, count } = await queryWithSignal(query, options.signal)
    if (error) throw error
    affected += typeof count === 'number' ? count : 0
  }
  return affected
}

export async function upsertVerifiedOpportunities(
  supabase: AdminDbClient,
  jobs: VerifiedOpportunityInput[],
  options: IndexWriteOptions = {},
): Promise<{ upserted: number; invalidated: number; rejected: number }> {
  const now = options.now ?? new Date()
  const nowIso = now.toISOString()
  const rows: Array<Record<string, unknown>> = []
  const failures = new Map<VerifiedOpportunityRow['source'], OpportunityVerificationFailure[]>()
  let rejected = 0

  for (const job of jobs) {
    if (!knownSource(job.source) || !job.sourceId || !job.title?.trim()
        || !safeOriginalUrl(job.source, job.sourceId, job.originalUrl)) {
      rejected += 1
      continue
    }
    const expiresAt = 'expiresAt' in job ? job.expiresAt : null
    let status = job.verificationStatus
    if (status === 'verified_active' && !validExpiry(expiresAt, now)) {
      status = expiresAt && normalizeChileTrabajosDate(expiresAt) ? 'stale' : 'unknown'
    }
    const verifiedAt = 'lastVerifiedAt' in job ? job.lastVerifiedAt : nowIso
    const verifiedMs = Date.parse(verifiedAt)
    if (status === 'verified_active'
        && (!Number.isFinite(verifiedMs) || verifiedMs > now.getTime()
            || verifiedMs < now.getTime() - OPPORTUNITY_FRESHNESS_MS)) {
      status = 'unknown'
    }
    if (status !== 'verified_active') {
      const group = failures.get(job.source) ?? []
      group.push({ sourceId: job.sourceId, verificationStatus: status })
      failures.set(job.source, group)
      continue
    }

    const category = categorizeOpportunity(job.title)
    const location = job.location?.trim() || null
    const workMode = 'workMode' in job
      ? normalizeWorkMode(job.workMode)
      : 'remote' in job && job.remote === true ? 'remote' : null
    rows.push({
      source: job.source,
      source_id: job.sourceId,
      original_url: job.originalUrl,
      title: job.title.trim(),
      normalized_title: normalizeRoleTitle(job.title),
      category_key: category.key,
      category_label: category.label,
      company: job.company,
      location,
      region: inferChileRegion(location),
      work_mode: workMode,
      published_at: job.publishedAt,
      expires_at: expiresAt ? normalizeChileTrabajosDate(expiresAt) : null,
      verification_status: 'verified_active',
      description: cleanDescription(job.description),
      requirements: 'requirements' in job ? stringArray(job.requirements) : [],
      skills: 'skills' in job ? stringArray(job.skills) : [],
      source_payload: 'raw' in job ? job.raw : null,
      last_verified_at: verifiedAt,
      updated_at: nowIso,
    })
  }

  // A negative observation in this batch takes precedence over an active copy.
  const invalidKeys = new Set([...failures].flatMap(([source, items]) =>
    items.map((item) => source + ':' + item.sourceId)))
  const uniqueRows = [...new Map(rows
    .filter((row) => !invalidKeys.has(String(row.source) + ':' + String(row.source_id)))
    .map((row) => [String(row.source) + ':' + String(row.source_id), row])).values()]

  let invalidated = 0
  for (const [source, items] of failures) {
    invalidated += await invalidateOpportunityVerifications(supabase, source, items, options)
  }
  if (uniqueRows.length) {
    const query = supabase.from(TABLE).upsert(uniqueRows, { onConflict: 'source,source_id' })
    const { error } = await queryWithSignal(query, options.signal)
    if (error) throw error
  }
  return { upserted: uniqueRows.length, invalidated, rejected }
}

/** Read only: expiration and old derived metadata are corrected in memory. */
export async function readVerifiedOpportunities(
  supabase: AdminDbClient,
  limit = 100,
  options: { now?: Date; signal?: AbortSignal } = {},
): Promise<VerifiedOpportunityRow[]> {
  const now = options.now ?? new Date()
  const cutoff = new Date(now.getTime() - OPPORTUNITY_FRESHNESS_MS).toISOString()
  const safeLimit = Math.max(1, Math.min(1000, Number.isFinite(limit) ? Math.floor(limit) : 100))
  const query = supabase.from(TABLE)
    .select('*')
    .eq('verification_status', 'verified_active')
    .gte('last_verified_at', cutoff)
    .lte('last_verified_at', now.toISOString())
    .order('last_verified_at', { ascending: false })
    .limit(safeLimit)
  const { data, error } = await queryWithSignal(query, options.signal)
  if (error) throw error

  return (data ?? []).filter((row: VerifiedOpportunityRow) => {
    const verifiedMs = Date.parse(row.last_verified_at)
    return knownSource(row.source)
      && row.verification_status === 'verified_active'
      && Number.isFinite(verifiedMs)
      && verifiedMs >= now.getTime() - OPPORTUNITY_FRESHNESS_MS
      && verifiedMs <= now.getTime()
      && typeof row.title === 'string' && Boolean(row.title.trim())
      && safeOriginalUrl(row.source, row.source_id, row.original_url)
      && validExpiry(row.expires_at, now)
  }).map((row: VerifiedOpportunityRow) => {
    const category = categorizeOpportunity(row.title)
    const location = row.location?.trim() || null
    return {
      ...row,
      normalized_title: normalizeRoleTitle(row.title),
      category_key: category.key,
      category_label: category.label,
      location,
      region: inferChileRegion(location),
      work_mode: normalizeWorkMode(row.work_mode),
      description: cleanDescription(row.description),
      requirements: stringArray(row.requirements),
      skills: stringArray(row.skills),
      expires_at: row.expires_at ? normalizeChileTrabajosDate(row.expires_at) : null,
    }
  })
}
