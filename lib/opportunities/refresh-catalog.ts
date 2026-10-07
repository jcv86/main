import { timingSafeEqual } from 'node:crypto'
import { fetchChileTrabajosBatch } from './sources/chiletrabajos'
import { fetchGetOnBoardJobs } from './sources/getonboard'
import { upsertVerifiedOpportunities, invalidateOpportunityVerifications } from './verified-index'
import { acquireOpportunityRefreshLease, type RefreshDbClient, type RefreshLease } from './refresh-lease'

export const OPPORTUNITY_REFRESH_BUDGET_MS = 50_000
export const CHILETRABAJOS_REFRESH_BUDGET_MS = 35_000
export const CHILETRABAJOS_REFRESH_MAX_CANDIDATES = 12

const REFRESH_TARGETS = [
  { source: 'chiletrabajos', location: 'Santiago' },
  { source: 'chiletrabajos', location: 'Valparaíso' },
  { source: 'chiletrabajos', location: 'Concepción' },
  { source: 'chiletrabajos', location: 'Antofagasta' },
  { source: 'chiletrabajos', location: 'Puerto Montt' },
  { source: 'getonboard', category: 'programming' },
] as const

const NO_STORE_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'private, no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
}

export function planOpportunityRefresh(slot: number) {
  if (!Number.isSafeInteger(slot)) throw new Error('Invalid refresh slot')
  return REFRESH_TARGETS[((slot % REFRESH_TARGETS.length) + REFRESH_TARGETS.length) % REFRESH_TARGETS.length]
}

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: NO_STORE_HEADERS })
}

function secretMatches(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual)
  const expectedBuffer = Buffer.from(expected)
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
}

interface RefreshEnvironment {
  VERCEL_ENV?: string
  CRON_SECRET?: string
}

export interface RefreshDependencies {
  env: RefreshEnvironment
  createDb: () => RefreshDbClient
  now?: () => Date
  acquireLease?: typeof acquireOpportunityRefreshLease
  fetchChileBatch?: typeof fetchChileTrabajosBatch
  fetchGetOnBoard?: typeof fetchGetOnBoardJobs
}

/**
 * Only the authenticated production scheduler writes the catalog.
 * One DB-assigned three-hour slot permits one bounded attempt. Six slots
 * rotate five Chilean cities and Get on Board in eighteen hours.
 */
export async function runOpportunityRefreshCron(
  request: Request,
  dependencies: RefreshDependencies,
): Promise<Response> {
  if (dependencies.env.VERCEL_ENV !== 'production') {
    return json({ success: true, skipped: true, reason: 'NON_PRODUCTION' })
  }
  if (request.method !== 'GET') {
    return json({ success: false, error: 'METHOD_NOT_ALLOWED' }, 405)
  }
  const secret = dependencies.env.CRON_SECRET?.trim()
  if (!secret || secret.length < 16) {
    return json({ success: false, error: 'CRON_SECRET_NOT_CONFIGURED' }, 503)
  }
  if (!secretMatches(request.headers.get('authorization') || '', 'Bearer ' + secret)) {
    return json({ success: false, error: 'UNAUTHORIZED' }, 401)
  }

  const now = dependencies.now ?? (() => new Date())
  const controller = new AbortController()
  const deadline = setTimeout(() => controller.abort(), OPPORTUNITY_REFRESH_BUDGET_MS)
  let lease: Extract<RefreshLease, { status: 'acquired' }> | undefined
  let result: Record<string, unknown> = { success: false, error: 'REFRESH_FAILED' }
  let status = 503
  let stage = 'LEASE_UNAVAILABLE'

  try {
    const supabase = dependencies.createDb()
    const acquired = await (dependencies.acquireLease ?? acquireOpportunityRefreshLease)(
      supabase, controller.signal, now,
    )
    if (acquired.status !== 'acquired') {
      return json({ success: true, skipped: true, reason: acquired.status.toUpperCase() })
    }
    lease = acquired
    const plan = planOpportunityRefresh(lease.slot)
    stage = 'PROVIDER_UNAVAILABLE'
    let jobs: Parameters<typeof upsertVerifiedOpportunities>[1]
    let failures: Parameters<typeof invalidateOpportunityVerifications>[2] = []
    let diagnostics: Record<string, unknown>
    let providerFailed = false

    if (plan.source === 'chiletrabajos') {
      const batch = await (dependencies.fetchChileBatch ?? fetchChileTrabajosBatch)(
        '', plan.location, CHILETRABAJOS_REFRESH_MAX_CANDIDATES,
        {
          maxCandidates: CHILETRABAJOS_REFRESH_MAX_CANDIDATES,
          budgetMs: CHILETRABAJOS_REFRESH_BUDGET_MS,
          timeoutMs: 5000,
          signal: controller.signal,
        },
      )
      failures = batch.failedJobs.slice(0, CHILETRABAJOS_REFRESH_MAX_CANDIDATES)
      const failedIds = new Set(failures.map((failure) => failure.sourceId))
      jobs = batch.verifiedJobs
        .filter((job) => !failedIds.has(job.sourceId))
        .slice(0, CHILETRABAJOS_REFRESH_MAX_CANDIDATES)
      diagnostics = { ...batch.diagnostics }
      providerFailed = ['unavailable', 'parse_failed'].includes(batch.diagnostics.outcome)
    } else {
      jobs = (await (dependencies.fetchGetOnBoard ?? fetchGetOnBoardJobs)(
        plan.category, 1, { timeoutMs: 8000, signal: controller.signal },
      )).slice(0, 30)
      diagnostics = { outcome: jobs.length ? 'ok' : 'no_matches', returned: jobs.length }
    }

    stage = 'LEASE_LOST'
    if (controller.signal.aborted || !(await lease.owns(controller.signal))) {
      throw new Error('Opportunity refresh lease lost')
    }
    stage = 'PERSISTENCE_FAILED'
    const writeOptions = { now: now(), signal: controller.signal }
    const failedInvalidated = failures.length
      ? await invalidateOpportunityVerifications(supabase, 'chiletrabajos', failures, writeOptions)
      : 0
    const stored = await upsertVerifiedOpportunities(supabase, jobs, writeOptions)
    result = {
      success: !providerFailed,
      source: plan.source,
      scope: 'location' in plan ? plan.location : plan.category,
      checked_at: now().toISOString(),
      upserted: stored.upserted,
      invalidated: failedInvalidated + stored.invalidated,
      rejected: stored.rejected,
      diagnostics,
    }
    status = providerFailed ? 503 : 200
  } catch {
    result = {
      success: false,
      error: controller.signal.aborted ? 'REFRESH_BUDGET_EXHAUSTED' : stage,
      checked_at: now().toISOString(),
    }
    status = 503
  } finally {
    clearTimeout(deadline)
    if (lease) {
      // The 120-second lease is longer than the 50-second work budget and this
      // independent 3-second finalization budget. Completion never touches jobs.
      const completion = new AbortController()
      const completionDeadline = setTimeout(() => completion.abort(), 3000)
      try {
        await lease.complete(status === 200, result, completion.signal)
      } catch {
        result = { ...result, success: false, error: 'REFRESH_COMPLETION_FAILED' }
        status = 503
      } finally {
        clearTimeout(completionDeadline)
      }
    }
  }
  return json(result, status)
}
