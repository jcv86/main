import {
  EMPLOYER_BOARDS,
  fetchEmployerBatch,
  type EmployerBoardResult,
} from './sources/employers'
import type { RefreshDbClient } from './refresh-lease'

export const EMPLOYER_REFRESH_BUDGET_MS = 18_000
export const EMPLOYER_REQUEST_TIMEOUT_MS = 8_000

export type EmployerCooldowns = Record<string, string>
export type EmployerRefreshBatch = Awaited<ReturnType<typeof fetchEmployerBatch>>

export interface EmployerRefreshResult {
  batch?: EmployerRefreshBatch
  cooldowns: EmployerCooldowns
  cooldownsLoaded: boolean
  error?: 'EMPLOYER_STATE_UNAVAILABLE' | 'EMPLOYER_PROVIDER_UNAVAILABLE' | 'EMPLOYER_BUDGET_EXHAUSTED'
}

/** A provider that ignores cancellation cannot hold the scheduler past its budget. */
export function waitForOpportunityTask<T>(task: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const abort = () => {
      signal.removeEventListener('abort', abort)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    if (signal.aborted) abort()
    else signal.addEventListener('abort', abort, { once: true })
    // Always observe the original promise, including after an aborted race.
    task.then((value) => {
      signal.removeEventListener('abort', abort)
      resolve(value)
    }, (error) => {
      signal.removeEventListener('abort', abort)
      reject(error)
    })
  })
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/** Only configured boards can carry state; future waits are never shortened. */
export function activeEmployerCooldowns(value: unknown, now: Date): EmployerCooldowns {
  if (!record(value)) throw new Error('Invalid employer cooldown state')
  const result: EmployerCooldowns = {}
  const byProvider = new Map<string, number>()
  for (const board of EMPLOYER_BOARDS) {
    const key = board.source + ':' + board.board
    if (!Object.hasOwn(value, key)) continue
    const until = value[key]
    const ms = typeof until === 'string' ? Date.parse(until) : NaN
    if (!Number.isFinite(ms)) throw new Error('Invalid employer cooldown date')
    if (ms > now.getTime()) byProvider.set(board.source, Math.max(ms, byProvider.get(board.source) ?? 0))
  }
  // Each provider currently uses one reviewed API host. Rotating companies
  // must not turn a host-level Retry-After into a new request to that host.
  for (const board of EMPLOYER_BOARDS) {
    const ms = byProvider.get(board.source)
    if (ms) result[board.source + ':' + board.board] = new Date(ms).toISOString()
  }
  return result
}

/**
 * Use the newest completed A4 run that recorded cooldown state. A failed read
 * must not erase that state: failed runs without a snapshot are skipped here.
 */
export async function readEmployerCooldowns(
  supabase: RefreshDbClient,
  options: { signal?: AbortSignal; now?: Date } = {},
): Promise<EmployerCooldowns> {
  let query = supabase.from('cron_job_executions')
    .select('execution_summary')
    .eq('job_name', 'a4-opportunities')
    .in('status', ['success', 'failure'])
    .not('completed_at', 'is', null)
    .not('execution_summary->employer_cooldowns', 'is', null)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (options.signal) query = query.abortSignal(options.signal)
  const { data, error } = await query
  if (error) throw error
  if (options.signal?.aborted) throw new DOMException('Aborted', 'AbortError')
  if (data === null) return {}
  if (!record(data) || !record(data.execution_summary)) throw new Error('Invalid employer execution state')
  return activeEmployerCooldowns(data.execution_summary.employer_cooldowns, options.now ?? new Date())
}

export function carryEmployerCooldowns(
  previous: EmployerCooldowns,
  boards: readonly EmployerBoardResult[],
  now: Date,
): EmployerCooldowns {
  const cooldowns = activeEmployerCooldowns(previous, now)
  const allowed = new Set(EMPLOYER_BOARDS.map((board) => board.source + ':' + board.board))
  for (const board of boards) {
    if (!allowed.has(board.boardKey) || board.boardKey !== board.source + ':' + board.board) continue
    if (!board.retryAfterUntil) continue
    const ms = Date.parse(board.retryAfterUntil)
    if (!Number.isFinite(ms)) throw new Error('Invalid employer retry date')
    if (ms > now.getTime() && ms > Date.parse(cooldowns[board.boardKey] || '1970-01-01')) {
      cooldowns[board.boardKey] = new Date(ms).toISOString()
    }
  }
  return activeEmployerCooldowns(cooldowns, now)
}

export function employerBoardIsHealthy(board: EmployerBoardResult): boolean {
  return board.outcome === 'ok' || board.outcome === 'no_matches' || board.outcome === 'cooldown'
}

export async function runEmployerRefresh(
  supabase: RefreshDbClient,
  slot: number,
  options: {
    signal: AbortSignal
    now?: () => Date
    fetchBatch?: typeof fetchEmployerBatch
  },
): Promise<EmployerRefreshResult> {
  const now = options.now ?? (() => new Date())
  const controller = new AbortController()
  const startedMs = Date.now()
  const abort = () => controller.abort()
  if (options.signal.aborted) abort()
  else options.signal.addEventListener('abort', abort, { once: true })
  const timer = setTimeout(abort, EMPLOYER_REFRESH_BUDGET_MS)
  let cooldowns: EmployerCooldowns = {}
  let cooldownsLoaded = false
  try {
    if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError')
    cooldowns = await waitForOpportunityTask(readEmployerCooldowns(supabase, {
      now: now(), signal: controller.signal,
    }), controller.signal)
    cooldownsLoaded = true
    // Leave time for the adapter to collect partial board results before this
    // outer deadline. The main provider has its own independent budget.
    const budgetMs = EMPLOYER_REFRESH_BUDGET_MS - (Date.now() - startedMs) - 500
    if (controller.signal.aborted || budgetMs <= 0) {
      controller.abort()
      throw new DOMException('Aborted', 'AbortError')
    }
    const batch = await waitForOpportunityTask((options.fetchBatch ?? fetchEmployerBatch)(slot, {
      signal: controller.signal,
      budgetMs,
      timeoutMs: EMPLOYER_REQUEST_TIMEOUT_MS,
      now: () => now().getTime(),
      cooldowns,
    }), controller.signal)
    cooldowns = carryEmployerCooldowns(cooldowns, batch.boards, now())
    if (controller.signal.aborted || Date.now() - startedMs >= EMPLOYER_REFRESH_BUDGET_MS) {
      controller.abort()
      throw new DOMException('Aborted', 'AbortError')
    }
    return { batch, cooldowns, cooldownsLoaded }
  } catch {
    return {
      cooldowns,
      cooldownsLoaded,
      error: controller.signal.aborted ? 'EMPLOYER_BUDGET_EXHAUSTED' :
        !cooldownsLoaded ? 'EMPLOYER_STATE_UNAVAILABLE' : 'EMPLOYER_PROVIDER_UNAVAILABLE',
    }
  } finally {
    clearTimeout(timer)
    options.signal.removeEventListener('abort', abort)
  }
}
