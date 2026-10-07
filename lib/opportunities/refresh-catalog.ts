import { timingSafeEqual } from 'node:crypto'
import { fetchChileTrabajosBatch } from './sources/chiletrabajos'
import { fetchGetOnBoardBatch, fetchGetOnBoardJobs } from './sources/getonboard'
import { fetchEmployerBatch, type EmployerBoardResult } from './sources/employers'
import { upsertVerifiedOpportunities, invalidateOpportunityVerifications, reconcileEmployerSnapshot } from './verified-index'
import { acquireOpportunityRefreshLease, type RefreshDbClient, type RefreshLease } from './refresh-lease'
import {
  activeEmployerCooldowns,
  employerBoardIsHealthy,
  runEmployerRefresh,
  waitForOpportunityTask,
  type EmployerRefreshResult,
} from './employer-refresh'

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
  fetchGetOnBoardBatch?: typeof fetchGetOnBoardBatch
  fetchEmployerBatch?: typeof fetchEmployerBatch
  reconcileEmployerSnapshot?: typeof reconcileEmployerSnapshot
}

interface PrimaryRefreshResult {
  jobs: Parameters<typeof upsertVerifiedOpportunities>[1]
  failures: Parameters<typeof invalidateOpportunityVerifications>[2]
  diagnostics: Record<string, unknown>
  failed: boolean
}

async function fetchPrimaryRefresh(
  plan: ReturnType<typeof planOpportunityRefresh>,
  dependencies: RefreshDependencies,
  signal: AbortSignal,
): Promise<PrimaryRefreshResult> {
  if (plan.source === 'chiletrabajos') {
    const batch = await (dependencies.fetchChileBatch ?? fetchChileTrabajosBatch)(
      '', plan.location, CHILETRABAJOS_REFRESH_MAX_CANDIDATES,
      {
        maxCandidates: CHILETRABAJOS_REFRESH_MAX_CANDIDATES,
        budgetMs: CHILETRABAJOS_REFRESH_BUDGET_MS,
        timeoutMs: 5000,
        signal,
      },
    )
    const failures = batch.failedJobs.slice(0, CHILETRABAJOS_REFRESH_MAX_CANDIDATES)
    const failedIds = new Set(failures.map((failure) => failure.sourceId))
    return {
      failures,
      jobs: batch.verifiedJobs.filter((job) => !failedIds.has(job.sourceId))
        .slice(0, CHILETRABAJOS_REFRESH_MAX_CANDIDATES),
      diagnostics: { ...batch.diagnostics },
      failed: !['ok', 'no_matches'].includes(batch.diagnostics.outcome),
    }
  }
  // Preserve the old injectable jobs-only callback for existing contract tests.
  // Production consumes the batch so a partial normalization is not labeled OK.
  if (!dependencies.fetchGetOnBoardBatch && dependencies.fetchGetOnBoard) {
    const jobs = (await dependencies.fetchGetOnBoard(
      plan.category, 1, { timeoutMs: 8000, signal },
    )).slice(0, 30)
    return {
      jobs, failures: [],
      diagnostics: { outcome: jobs.length ? 'ok' : 'no_matches', returned: jobs.length },
      failed: false,
    }
  }
  const batch = await (dependencies.fetchGetOnBoardBatch ?? fetchGetOnBoardBatch)(
    plan.category, 1, { timeoutMs: 8000, signal },
  )
  return {
    jobs: batch.jobs.slice(0, 30),
    failures: [],
    diagnostics: { ...batch.diagnostics },
    failed: !['ok', 'no_matches'].includes(batch.diagnostics.outcome),
  }
}

/** The ledger contains bounded diagnostics, never full job payloads or upstream errors. */
function employerBoardSummary(board: EmployerBoardResult): Record<string, unknown> {
  return {
    source: board.source,
    board: board.board,
    board_key: board.boardKey,
    outcome: board.outcome,
    received: board.received,
    accepted: board.accepted,
    rejected: board.rejected,
    excluded: board.excluded,
    returned: board.returned,
    complete_snapshot: board.completeSnapshot,
    ...(board.retryAfterUntil ? { retry_after_until: board.retryAfterUntil } : {}),
    ...(board.failureCode ? { failure_code: board.failureCode } : {}),
  }
}

/**
 * Only the authenticated production scheduler writes the catalog.
 * One DB-assigned three-hour slot permits one bounded attempt. Six slots
 * rotate five Chilean cities and Get on Board in eighteen hours. An independent
 * bounded employer rotation runs concurrently under the same lease and budget.
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
  let employerState: EmployerRefreshResult | undefined
  let upserted = 0
  let invalidated = 0
  let rejected = 0

  try {
    const supabase = dependencies.createDb()
    const acquired = await waitForOpportunityTask(
      (dependencies.acquireLease ?? acquireOpportunityRefreshLease)(supabase, controller.signal, now),
      controller.signal,
    )
    if (acquired.status !== 'acquired') {
      return json({ success: true, skipped: true, reason: acquired.status.toUpperCase() })
    }
    lease = acquired
    const plan = planOpportunityRefresh(lease.slot)
    stage = 'PROVIDER_UNAVAILABLE'
    const [primaryTask, employerTask] = await Promise.allSettled([
      waitForOpportunityTask(fetchPrimaryRefresh(plan, dependencies, controller.signal), controller.signal),
      runEmployerRefresh(supabase, lease.slot, {
        signal: controller.signal, now, fetchBatch: dependencies.fetchEmployerBatch,
      }),
    ])
    const primary: PrimaryRefreshResult = primaryTask.status === 'fulfilled' ? primaryTask.value : {
      jobs: [], failures: [], failed: true,
      diagnostics: { outcome: 'unavailable', failure_code: 'provider_unavailable' },
    }
    employerState = employerTask.status === 'fulfilled' ? employerTask.value : {
      cooldowns: {}, cooldownsLoaded: false, error: 'EMPLOYER_PROVIDER_UNAVAILABLE',
    }
    const boards = employerState.batch?.boards ?? []
    let failed = primary.failed || Boolean(employerState.error) || boards.some((board) => !employerBoardIsHealthy(board))
    const sourceErrors: Record<string, string> = {}
    if (primary.failed) sourceErrors[plan.source] = 'PROVIDER_UNAVAILABLE'
    if (employerState.error) sourceErrors.employers = employerState.error
    for (const board of boards) {
      if (!employerBoardIsHealthy(board)) sourceErrors[board.boardKey] = 'PROVIDER_UNAVAILABLE'
    }
    let persistenceFailed = false
    const availableSource = !primary.failed || boards.some((board) => board.outcome === 'ok' || board.outcome === 'no_matches')
    result = {
      success: false,
      source: plan.source,
      scope: 'location' in plan ? plan.location : plan.category,
      diagnostics: primary.diagnostics,
      employer_boards: boards.map(employerBoardSummary),
    }
    if (controller.signal.aborted) throw new Error('Opportunity refresh budget exhausted')

    // Each write group must still own the lease. A DB failure for one group
    // does not discard valid observations from an independent provider.
    const guardedWrite = async <T>(operation: () => Promise<T>): Promise<T> => {
      stage = 'LEASE_LOST'
      if (controller.signal.aborted || !(await waitForOpportunityTask(lease!.owns(controller.signal), controller.signal))) {
        throw new Error('Opportunity refresh lease lost')
      }
      stage = 'PERSISTENCE_FAILED'
      return waitForOpportunityTask(operation(), controller.signal)
    }
    const notePersistenceFailure = (key: string) => {
      if (controller.signal.aborted || stage === 'LEASE_LOST') throw new Error('Opportunity refresh lease lost')
      failed = true
      persistenceFailed = true
      sourceErrors[key] = 'PERSISTENCE_FAILED'
    }

    try {
      if (primary.failures.length) {
        invalidated += await guardedWrite(() => invalidateOpportunityVerifications(
          supabase, 'chiletrabajos', primary.failures, { now: now(), signal: controller.signal },
        ))
      }
      if (primary.jobs.length) {
        const stored = await guardedWrite(() => upsertVerifiedOpportunities(
          supabase, primary.jobs, { now: now(), signal: controller.signal },
        ))
        upserted += stored.upserted
        invalidated += stored.invalidated
        rejected += stored.rejected
        if (stored.rejected) {
          failed = true
          sourceErrors[plan.source] = 'INDEX_REJECTED'
        }
      }
    } catch {
      notePersistenceFailure(plan.source)
    }

    for (const board of boards) {
      if (board.outcome === 'cooldown') continue
      const jobs = (employerState.batch?.jobs ?? []).filter((job) =>
        job.source === board.source && job.sourceId.startsWith(board.board + ':'))
      try {
        if (jobs.length) {
          const stored = await guardedWrite(() => upsertVerifiedOpportunities(
            supabase, jobs, { now: now(), signal: controller.signal },
          ))
          upserted += stored.upserted
          invalidated += stored.invalidated
          rejected += stored.rejected
          if (stored.rejected) {
            failed = true
            sourceErrors[board.boardKey] = 'INDEX_REJECTED'
            // A rejected row must not be followed by an absence reconciliation.
            continue
          }
        }
        if (board.completeSnapshot && board.rejected === 0 &&
            (board.outcome === 'ok' || board.outcome === 'no_matches')) {
          invalidated += await guardedWrite(() =>
            (dependencies.reconcileEmployerSnapshot ?? reconcileEmployerSnapshot)(
              supabase, board, { now: now(), signal: controller.signal },
            ))
        }
      } catch {
        notePersistenceFailure(board.boardKey)
      }
    }
    const outcome = failed ? (availableSource || upserted || invalidated ? 'partial' : 'failed') : 'ok'
    result = {
      ...result,
      success: !failed,
      outcome,
      ...(failed ? { error: persistenceFailed ? 'PERSISTENCE_FAILED' :
        outcome === 'partial' ? 'PARTIAL_REFRESH' : 'PROVIDER_UNAVAILABLE' } : {}),
      ...(Object.keys(sourceErrors).length ? { source_errors: sourceErrors } : {}),
    }
    status = failed ? 503 : 200
  } catch {
    result = {
      ...result,
      success: false,
      outcome: upserted || invalidated ? 'partial' : 'failed',
      error: controller.signal.aborted ? 'REFRESH_BUDGET_EXHAUSTED' : stage,
    }
    status = 503
  } finally {
    clearTimeout(deadline)
    if (lease) {
      result = {
        ...result,
        checked_at: now().toISOString(),
        upserted,
        invalidated,
        rejected,
        ...(employerState?.cooldownsLoaded ? {
          employer_cooldowns: activeEmployerCooldowns(employerState.cooldowns, now()),
        } : {}),
      }
      // The 120-second lease is longer than the 50-second work budget and this
      // independent 3-second finalization budget. Completion never touches jobs.
      const completion = new AbortController()
      const completionDeadline = setTimeout(() => completion.abort(), 3000)
      try {
        await waitForOpportunityTask(
          lease.complete(status === 200, result, completion.signal),
          completion.signal,
        )
      } catch {
        result = {
          ...result, success: false, outcome: upserted || invalidated ? 'partial' : 'failed',
          error: 'REFRESH_COMPLETION_FAILED',
        }
        status = 503
      } finally {
        clearTimeout(completionDeadline)
      }
    }
  }
  return json(result, status)
}
