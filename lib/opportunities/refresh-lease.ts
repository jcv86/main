import type { AdminDbClient } from './verified-index'

export type RefreshDbClient = AdminDbClient & {
  rpc: (name: string, args?: Record<string, unknown>) => any
}

export type RefreshLease =
  | { status: 'overlap' | 'already_attempted' }
  | {
      status: 'acquired'
      slot: number
      owns: (signal?: AbortSignal) => Promise<boolean>
      complete: (success: boolean, summary: Record<string, unknown>, signal?: AbortSignal) => Promise<void>
    }

function withSignal(query: any, signal?: AbortSignal): any {
  return signal ? query.abortSignal(signal) : query
}

/** All table names and the job key are fixed; callers cannot select other jobs. */
export async function acquireOpportunityRefreshLease(
  supabase: RefreshDbClient,
  signal?: AbortSignal,
  now: () => Date = () => new Date(),
): Promise<RefreshLease> {
  const { data, error } = await withSignal(
    supabase.rpc('acquire_a4_opportunity_refresh'),
    signal,
  )
  if (error) throw error
  if (data?.status === 'overlap' || data?.status === 'already_attempted') {
    return { status: data.status }
  }
  const token = data?.execution_id
  const startedMs = Date.parse(data?.started_at)
  const expiresMs = Date.parse(data?.lease_expires_at)
  if (data?.status !== 'acquired' || !Number.isSafeInteger(data.slot)
      || typeof token !== 'string' || !/^[0-9a-f-]{36}$/i.test(token)
      || !Number.isFinite(startedMs) || !Number.isFinite(expiresMs)
      || expiresMs <= startedMs || expiresMs - startedMs > 120_000) {
    throw new Error('Invalid opportunity refresh lease')
  }

  return {
    status: 'acquired',
    slot: data.slot,
    async owns(checkSignal) {
      if (checkSignal?.aborted || now().getTime() >= expiresMs) return false
      const query = supabase.from('cron_job_executions')
        .select('id')
        .eq('id', token)
        .eq('job_name', 'a4-opportunities')
        .eq('status', 'running')
        .maybeSingle()
      const { data: row, error: readError } = await withSignal(query, checkSignal)
      if (readError) throw readError
      return Boolean(row?.id === token && now().getTime() < expiresMs && !checkSignal?.aborted)
    },
    async complete(success, summary, completionSignal) {
      const finishedAt = now()
      const query = supabase.from('cron_job_executions')
        .update({
          status: success ? 'success' : 'failure',
          completed_at: finishedAt.toISOString(),
          duration_ms: Math.max(0, Math.min(2_147_483_647, finishedAt.getTime() - startedMs)),
          execution_summary: { ...summary, slot: data.slot },
        }, { count: 'exact' })
        .eq('id', token)
        .eq('job_name', 'a4-opportunities')
        .eq('status', 'running')
      const { error: finishError, count } = await withSignal(query, completionSignal)
      if (finishError) throw finishError
      if (count !== 1) throw new Error('Opportunity refresh completion was not recorded')
    },
  }
}
