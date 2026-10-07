import { timingSafeEqual } from 'node:crypto'
import { ChileTrabajosProviderError, fetchChileTrabajosBatch } from './sources/chiletrabajos'
import { GetOnBoardProviderError, fetchGetOnBoardBatch, fetchGetOnBoardJobs } from './sources/getonboard'
import { fetchEmployerBatch, type EmployerBoardResult } from './sources/employers'
import { upsertVerifiedOpportunities, invalidateOpportunityVerifications, reconcileEmployerSnapshot, OpportunityPersistenceError, type OpportunityPersistenceCounts, type IndexWriteOptions } from './verified-index'
import { acquireOpportunityRefreshLease, type RefreshDbClient, type RefreshLease } from './refresh-lease'
import { readChileTrabajosRefreshCandidates } from './refresh-candidates'
import {
  activePrimaryCooldowns,
  carryPrimaryCooldowns,
  readPrimaryCooldowns,
  withPrimaryReadDeadline,
  type PrimaryRefreshState,
} from './primary-refresh-state'
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
  readChileCandidates?: typeof readChileTrabajosRefreshCandidates
}

interface PrimaryRefreshResult {
  jobs: Parameters<typeof upsertVerifiedOpportunities>[1]
  failures: Parameters<typeof invalidateOpportunityVerifications>[2]
  diagnostics: Record<string, unknown>
  failed: boolean
  error?: 'PRIMARY_STATE_UNAVAILABLE' | 'PRIMARY_MAINTENANCE_UNAVAILABLE' | 'PROVIDER_UNAVAILABLE'
}

async function fetchPrimaryRefresh(
  plan: ReturnType<typeof planOpportunityRefresh>,
  supabase: RefreshDbClient,
  dependencies: RefreshDependencies,
  signal: AbortSignal,
  state: PrimaryRefreshState,
  now: () => Date,
): Promise<PrimaryRefreshResult> {
  try {
    state.cooldowns = await withPrimaryReadDeadline((readSignal) => readPrimaryCooldowns(supabase, {
      now: now(), signal: readSignal,
    }), signal)
    state.cooldownsLoaded = true
  } catch {
    return {
      jobs: [], failures: [], failed: true, error: 'PRIMARY_STATE_UNAVAILABLE',
      diagnostics: { outcome: 'unavailable', failure_code: 'primary_state_unavailable' },
    }
  }
  const until = state.cooldowns[plan.source]
  if (until && Date.parse(until) > now().getTime()) {
    return {
      jobs: [], failures: [], failed: false,
      diagnostics: { outcome: 'cooldown', retry_after_until: until },
    }
  }

  let maintenanceFailed = false
  try {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError')
    if (plan.source === 'chiletrabajos') {
      let preferredIds: string[] | undefined
      try {
        const ids = await withPrimaryReadDeadline((readSignal) =>
          (dependencies.readChileCandidates ?? readChileTrabajosRefreshCandidates)(supabase, plan.location, {
            now: now(), signal: readSignal,
          }), signal)
        if (!Array.isArray(ids) || ids.length > 3 || ids.some((id) => typeof id !== 'string' || !/^\d{5,10}$/.test(id))) {
          throw new Error('Invalid maintenance candidates')
        }
        preferredIds = [...new Set(ids)]
      } catch {
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError')
        maintenanceFailed = true
      }
      const batch = await waitForOpportunityTask((dependencies.fetchChileBatch ?? fetchChileTrabajosBatch)(
        '', plan.location, CHILETRABAJOS_REFRESH_MAX_CANDIDATES,
        {
          maxCandidates: CHILETRABAJOS_REFRESH_MAX_CANDIDATES,
          budgetMs: CHILETRABAJOS_REFRESH_BUDGET_MS,
          timeoutMs: 5000,
          signal,
          ...(preferredIds ? { preferredIds } : {}),
        },
      ), signal)
      const { retryAfterUntil, ...diagnostics } = batch.diagnostics
      state.cooldowns = carryPrimaryCooldowns(state.cooldowns, plan.source, retryAfterUntil, now())
      const failures = batch.failedJobs.slice(0, CHILETRABAJOS_REFRESH_MAX_CANDIDATES)
      const failedIds = new Set(failures.map((failure) => failure.sourceId))
      const providerFailed = !['ok', 'no_matches'].includes(batch.diagnostics.outcome)
      return {
        failures,
        jobs: batch.verifiedJobs.filter((job) => !failedIds.has(job.sourceId))
          .slice(0, CHILETRABAJOS_REFRESH_MAX_CANDIDATES),
        diagnostics: {
          ...diagnostics,
          maintenance_selection_status: maintenanceFailed ? 'unavailable' : 'ok',
          ...(maintenanceFailed ? { maintenance_failure_code: 'maintenance_candidate_read_failed' } : {}),
          ...(retryAfterUntil && state.cooldowns[plan.source] ? { retryAfterUntil: state.cooldowns[plan.source] } : {}),
        },
        failed: providerFailed || maintenanceFailed,
        ...(providerFailed ? { error: 'PROVIDER_UNAVAILABLE' as const } :
          maintenanceFailed ? { error: 'PRIMARY_MAINTENANCE_UNAVAILABLE' as const } : {}),
      }
    }
    // Preserve the old injectable jobs-only callback for existing contract tests.
    // Production consumes the batch so partial normalization is not labeled OK.
    if (!dependencies.fetchGetOnBoardBatch && dependencies.fetchGetOnBoard) {
      const jobs = (await waitForOpportunityTask(dependencies.fetchGetOnBoard(
        plan.category, 1, { timeoutMs: 8000, signal },
      ), signal)).slice(0, 30)
      return {
        jobs, failures: [],
        diagnostics: { outcome: jobs.length ? 'ok' : 'no_matches', returned: jobs.length },
        failed: false,
      }
    }
    const batch = await waitForOpportunityTask((dependencies.fetchGetOnBoardBatch ?? fetchGetOnBoardBatch)(
      plan.category, 1, { timeoutMs: 8000, signal },
    ), signal)
    return {
      jobs: batch.jobs.slice(0, 30),
      failures: [],
      diagnostics: { ...batch.diagnostics },
      failed: !['ok', 'no_matches'].includes(batch.diagnostics.outcome),
    }
  } catch (error) {
    const providerError = error instanceof GetOnBoardProviderError || error instanceof ChileTrabajosProviderError
      ? error : undefined
    if (providerError?.retryAfterUntil) {
      state.cooldowns = carryPrimaryCooldowns(state.cooldowns, plan.source, providerError.retryAfterUntil, now())
    }
    const code = providerError && /^(http_[1-5]\d{2}|network_error|timeout|budget_exhausted|aborted|parse_failed|payload_shape|invalid_json|payload_too_large|no_valid_jobs)$/.test(providerError.code)
      ? providerError.code : signal.aborted ? 'aborted' : 'provider_unavailable'
    return {
      jobs: [], failures: [], failed: true, error: 'PROVIDER_UNAVAILABLE',
      diagnostics: {
        outcome: 'unavailable', failure_code: code,
        ...(providerError?.retryAfterUntil && state.cooldowns[plan.source] ? { retry_after_until: state.cooldowns[plan.source] } : {}),
        ...(maintenanceFailed ? { maintenance_selection_status: 'unavailable', maintenance_failure_code: 'maintenance_candidate_read_failed' } : {}),
      },
    }
  }
}

interface PersistenceSummary {
  /** Inserted or updated rows confirmed by a completed write group, not new jobs. */
  upserted: number
  invalidated: number
  rejected: number
  outcome: 'not_attempted' | 'cooldown' | 'ok' | 'partial' | 'failed'
}

function emptyPersistence(outcome: PersistenceSummary['outcome'] = 'not_attempted'): PersistenceSummary {
  return { upserted: 0, invalidated: 0, rejected: 0, outcome }
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
  const primaryState: PrimaryRefreshState = { cooldowns: {}, cooldownsLoaded: false }
  const primaryPersistence = emptyPersistence()
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
      waitForOpportunityTask(fetchPrimaryRefresh(plan, supabase, dependencies, controller.signal, primaryState, now), controller.signal),
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
    if (primary.failed) sourceErrors[plan.source] = primary.error ?? 'PROVIDER_UNAVAILABLE'
    if (employerState.error) sourceErrors.employers = employerState.error
    for (const board of boards) {
      if (!employerBoardIsHealthy(board)) sourceErrors[board.boardKey] = 'PROVIDER_UNAVAILABLE'
    }
    let persistenceFailed = false
    const availableSource = ['ok', 'no_matches'].includes(String(primary.diagnostics.outcome))
      || boards.some((board) => board.outcome === 'ok' || board.outcome === 'no_matches')
    primaryPersistence.outcome = primary.diagnostics.outcome === 'cooldown' ? 'cooldown' :
      !primary.jobs.length && !primary.failures.length && !primary.failed ? 'ok' : 'not_attempted'
    const boardPersistence = new Map(boards.map((board) => [board.boardKey, emptyPersistence(
      board.outcome === 'cooldown' ? 'cooldown' : 'not_attempted',
    )]))
    result = {
      success: false,
      source: plan.source,
      scope: 'location' in plan ? plan.location : plan.category,
      diagnostics: primary.diagnostics,
      primary_persistence: primaryPersistence,
      employer_boards: boards.map((board) => ({
        ...employerBoardSummary(board), persistence: boardPersistence.get(board.boardKey),
      })),
    }
    if (controller.signal.aborted) throw new Error('Opportunity refresh budget exhausted')

    // Each write group must still own the lease. A DB failure for one group
    // does not discard valid observations from an independent provider.
    const remainingCounts = (total: Readonly<OpportunityPersistenceCounts>, observed: OpportunityPersistenceCounts): OpportunityPersistenceCounts => ({
      upserted: Math.max(0, total.upserted - observed.upserted),
      invalidated: Math.max(0, total.invalidated - observed.invalidated),
      rejected: Math.max(0, total.rejected - observed.rejected),
    })
    const guardedWrite = async <T>(
      summary: PersistenceSummary,
      operation: (options: IndexWriteOptions) => Promise<T>,
    ): Promise<{ value: T; observed: OpportunityPersistenceCounts }> => {
      stage = 'LEASE_LOST'
      if (controller.signal.aborted || !(await waitForOpportunityTask(lease!.owns(controller.signal), controller.signal))) {
        throw new Error('Opportunity refresh lease lost')
      }
      stage = 'PERSISTENCE_FAILED'
      const observed = { upserted: 0, invalidated: 0, rejected: 0 }
      let observing = true
      const onConfirmed = (counts: Readonly<OpportunityPersistenceCounts>) => {
        if (!observing || controller.signal.aborted) return
        addCounts(summary, counts)
        observed.upserted += counts.upserted
        observed.invalidated += counts.invalidated
        observed.rejected += counts.rejected
        if (counts.upserted || counts.invalidated) completedWrites.add(summary)
      }
      try {
        const value = await waitForOpportunityTask(operation({ now: now(), signal: controller.signal, onConfirmed }), controller.signal)
        return { value, observed }
      } catch (error) {
        if (error instanceof OpportunityPersistenceError) {
          throw new OpportunityPersistenceError(remainingCounts(error.confirmed, observed))
        }
        throw error
      } finally {
        observing = false
      }
    }
    const completedWrites = new Set<PersistenceSummary>()
    const addCounts = (summary: PersistenceSummary, stored: Readonly<OpportunityPersistenceCounts>) => {
      summary.upserted += stored.upserted
      summary.invalidated += stored.invalidated
      summary.rejected += stored.rejected
      upserted += stored.upserted
      invalidated += stored.invalidated
      rejected += stored.rejected
    }
    const noteStored = (summary: PersistenceSummary, stored: OpportunityPersistenceCounts, observed: OpportunityPersistenceCounts) => {
      addCounts(summary, remainingCounts(stored, observed))
      summary.outcome = summary.rejected ? 'partial' : 'ok'
      completedWrites.add(summary)
    }
    const noteInvalidated = (summary: PersistenceSummary, count: number, observed: OpportunityPersistenceCounts) => {
      noteStored(summary, { upserted: 0, invalidated: count, rejected: 0 }, observed)
    }
    const notePersistenceFailure = (key: string, summary: PersistenceSummary, error: unknown) => {
      if (error instanceof OpportunityPersistenceError) {
        addCounts(summary, error.confirmed)
        if (error.confirmed.upserted || error.confirmed.invalidated) completedWrites.add(summary)
      }
      summary.outcome = completedWrites.has(summary) ? 'partial' : 'failed'
      if (controller.signal.aborted || stage === 'LEASE_LOST') throw new Error('Opportunity refresh lease lost')
      failed = true
      persistenceFailed = true
      sourceErrors[key] = 'PERSISTENCE_FAILED'
    }

    try {
      if (primary.failures.length) {
        const { value: count, observed } = await guardedWrite(primaryPersistence, (options) => invalidateOpportunityVerifications(
          supabase, 'chiletrabajos', primary.failures, options,
        ))
        noteInvalidated(primaryPersistence, count, observed)
      }
      if (primary.jobs.length) {
        const { value: stored, observed } = await guardedWrite(primaryPersistence, (options) => upsertVerifiedOpportunities(
          supabase, primary.jobs, options,
        ))
        noteStored(primaryPersistence, stored, observed)
        if (stored.rejected) {
          failed = true
          sourceErrors[plan.source] = 'INDEX_REJECTED'
        }
      }
    } catch (error) {
      notePersistenceFailure(plan.source, primaryPersistence, error)
    }

    for (const board of boards) {
      const persistence = boardPersistence.get(board.boardKey)!
      if (board.outcome === 'cooldown') continue
      const jobs = (employerState.batch?.jobs ?? []).filter((job) =>
        job.source === board.source && job.sourceId.startsWith(board.board + ':'))
      try {
        if (jobs.length) {
          const { value: stored, observed } = await guardedWrite(persistence, (options) => upsertVerifiedOpportunities(
            supabase, jobs, options,
          ))
          noteStored(persistence, stored, observed)
          if (stored.rejected) {
            failed = true
            sourceErrors[board.boardKey] = 'INDEX_REJECTED'
            // A rejected row must not be followed by an absence reconciliation.
            continue
          }
        }
        if (board.completeSnapshot && board.rejected === 0 &&
            (board.outcome === 'ok' || board.outcome === 'no_matches')) {
          const { value: count, observed } = await guardedWrite(persistence, (options) =>
            (dependencies.reconcileEmployerSnapshot ?? reconcileEmployerSnapshot)(
              supabase, board, options,
            ))
          noteInvalidated(persistence, count, observed)
        }
      } catch (error) {
        notePersistenceFailure(board.boardKey, persistence, error)
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
        ...(primaryState.cooldownsLoaded ? {
          primary_cooldowns: activePrimaryCooldowns(primaryState.cooldowns, now()),
        } : {}),
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
