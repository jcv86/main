import type { RefreshDbClient } from './refresh-lease'
import { waitForOpportunityTask } from './employer-refresh'

/** A source key covers its fixed public host, including every Chilean city. */
export const PRIMARY_REFRESH_SOURCES = ['chiletrabajos', 'getonboard'] as const
export const PRIMARY_STATE_READ_BUDGET_MS = 3000
export type PrimaryRefreshSource = typeof PRIMARY_REFRESH_SOURCES[number]
export type PrimaryCooldowns = Partial<Record<PrimaryRefreshSource, string>>

export interface PrimaryRefreshState {
  cooldowns: PrimaryCooldowns
  cooldownsLoaded: boolean
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/** Invalid known state fails closed; unknown keys and expired waits never escape. */
export function activePrimaryCooldowns(value: unknown, now: Date): PrimaryCooldowns {
  if (!record(value) || !Number.isFinite(now.getTime())) throw new Error('Invalid primary cooldown state')
  const result: PrimaryCooldowns = {}
  for (const source of PRIMARY_REFRESH_SOURCES) {
    if (!Object.hasOwn(value, source)) continue
    const until = value[source]
    const ms = typeof until === 'string' ? Date.parse(until) : NaN
    if (!Number.isFinite(ms)) throw new Error('Invalid primary cooldown date')
    if (ms > now.getTime()) result[source] = new Date(ms).toISOString()
  }
  return result
}

/** Both sources' waits survive a run that only visits one of them. */
export function carryPrimaryCooldowns(
  previous: PrimaryCooldowns,
  source: PrimaryRefreshSource,
  retryAfterUntil: unknown,
  now: Date,
): PrimaryCooldowns {
  const result = activePrimaryCooldowns(previous, now)
  if (!PRIMARY_REFRESH_SOURCES.includes(source)) throw new Error('Invalid primary cooldown source')
  if (retryAfterUntil === undefined) return result
  const ms = typeof retryAfterUntil === 'string' ? Date.parse(retryAfterUntil) : NaN
  if (!Number.isFinite(ms)) throw new Error('Invalid primary retry date')
  if (ms > now.getTime() && ms > Date.parse(result[source] ?? '1970-01-01')) {
    result[source] = new Date(ms).toISOString()
  }
  return result
}

/** Legacy summaries and failures without a state snapshot cannot erase a wait. */
export async function readPrimaryCooldowns(
  supabase: RefreshDbClient,
  options: { signal?: AbortSignal; now?: Date } = {},
): Promise<PrimaryCooldowns> {
  if (options.signal?.aborted) throw new DOMException('Aborted', 'AbortError')
  let query = supabase.from('cron_job_executions')
    .select('execution_summary')
    .eq('job_name', 'a4-opportunities')
    .in('status', ['success', 'failure'])
    .not('completed_at', 'is', null)
    .not('execution_summary->primary_cooldowns', 'is', null)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (options.signal) query = query.abortSignal(options.signal)
  const { data, error } = await query
  if (error) throw new Error('Primary cooldown state unavailable')
  if (options.signal?.aborted) throw new DOMException('Aborted', 'AbortError')
  if (data === null) return {}
  if (!record(data) || !record(data.execution_summary)) throw new Error('Invalid primary execution state')
  return activePrimaryCooldowns(data.execution_summary.primary_cooldowns, options.now ?? new Date())
}

/** A slow read cannot consume the time reserved for independent provider writes. */
export async function withPrimaryReadDeadline<T>(
  read: (signal: AbortSignal) => Promise<T>,
  signal: AbortSignal,
): Promise<T> {
  const controller = new AbortController()
  const abort = () => controller.abort()
  if (signal.aborted) abort()
  else signal.addEventListener('abort', abort, { once: true })
  const timer = setTimeout(abort, PRIMARY_STATE_READ_BUDGET_MS)
  try {
    if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError')
    return await waitForOpportunityTask(read(controller.signal), controller.signal)
  } finally {
    clearTimeout(timer)
    signal.removeEventListener('abort', abort)
  }
}
