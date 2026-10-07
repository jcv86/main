import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { A3_MODULES } from '@/lib/a3/module-catalog'

type Availability = 'available' | 'empty' | 'unavailable'
type RowsResult = { data: unknown; error: unknown; count?: number | null }
type Options = { now?: Date; a3Sessions?: PromiseLike<RowsResult> }
export interface A4JourneyContext {
  status: 'available' | 'empty' | 'degraded'
  identity: { status: Availability; targetRole: string | null; updatedAt: string | null }
  a1: { status: Availability; completedAt: string | null }
  a2: { status: Availability; completedDays: number | null; lastCompletedAt: string | null }
  a3: { status: Availability; completedModules: number | null; lastCompletedAt: string | null }
}

const A2_ROW_LIMIT = 500
const A3_ROW_LIMIT = 200
const MODULE_IDS = new Set<string>(A3_MODULES.map(module => module.id))
const unavailable = (): A4JourneyContext => ({
  status: 'degraded',
  identity: { status: 'unavailable', targetRole: null, updatedAt: null },
  a1: { status: 'unavailable', completedAt: null },
  a2: { status: 'unavailable', completedDays: null, lastCompletedAt: null },
  a3: { status: 'unavailable', completedModules: null, lastCompletedAt: null },
})
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid context record')
  return value as Record<string, unknown>
}
function timestamp(value: unknown, now: Date): string | null {
  if (value === null || value === undefined) return null
  if (typeof value !== 'string' || !value.trim()) throw new Error('Invalid context date')
  const time = Date.parse(value)
  if (!Number.isFinite(time) || time > now.getTime()) throw new Error('Invalid context date')
  return new Date(time).toISOString()
}
function latest(values: Array<string | null>): string | null {
  return values.filter((value): value is string => value !== null).sort().at(-1) ?? null
}
function rows(value: unknown, limit: number): Record<string, unknown>[] {
  if (!Array.isArray(value) || value.length > limit) throw new Error('Incomplete context records')
  return value.map(record)
}
async function section<T>(read: () => PromiseLike<RowsResult>, parse: (data: unknown, result: RowsResult) => T, fallback: T): Promise<T> {
  try {
    const result = await read()
    if (!result || result.error) return fallback
    return parse(result.data, result)
  } catch { return fallback }
}

/** Descriptive reads only: source completion is not a competency or readiness score. */
export async function readA4JourneyContext(
  client: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  options: Options = {},
): Promise<A4JourneyContext> {
  const fallback = unavailable()
  const now = options.now ?? new Date()
  if (!userId || !Number.isFinite(now.getTime())) return fallback
  try {
    const { data, error } = await client.auth.getUser()
    if (error || !data.user || data.user.id !== userId) return fallback
  } catch { return fallback }

  const [identity, a1, a2, a3] = await Promise.all([
    section(() => client.from('career_identities').select('target_roles,updated_at')
      .eq('user_id', userId).maybeSingle(), data => {
      if (data === null) return { status: 'empty' as const, targetRole: null, updatedAt: null }
      const row = record(data)
      if (!Array.isArray(row.target_roles) || row.target_roles.some(role => typeof role !== 'string')) throw new Error('Invalid target roles')
      const targetRole = row.target_roles.map(role => role.trim()).find(Boolean) ?? null
      if (targetRole && targetRole.length > 200) throw new Error('Invalid target role')
      return { status: targetRole ? 'available' as const : 'empty' as const, targetRole, updatedAt: timestamp(row.updated_at, now) }
    }, fallback.identity),
    section(() => client.from('a1_cerebral_assessment').select('completed_at')
      .eq('user_id', userId).not('completed_at', 'is', null)
      .order('completed_at', { ascending: false }).limit(1).maybeSingle(), data => {
      const completedAt = data === null ? null : timestamp(record(data).completed_at, now)
      return { status: completedAt ? 'available' as const : 'empty' as const, completedAt }
    }, fallback.a1),
    section(() => client.from('a2_user_task_completions').select('day,completed_at')
      .eq('user_id', userId).not('completed_at', 'is', null)
      .order('completed_at', { ascending: false }).limit(A2_ROW_LIMIT + 1), data => {
      const completed = rows(data, A2_ROW_LIMIT)
      const dates: string[] = []
      const days = new Set<number>()
      for (const row of completed) {
        if (!Number.isInteger(row.day) || Number(row.day) < 1 || Number(row.day) > 90) throw new Error('Invalid completion day')
        const date = timestamp(row.completed_at, now)
        if (!date) throw new Error('Missing completion date')
        days.add(Number(row.day)); dates.push(date)
      }
      return { status: days.size ? 'available' as const : 'empty' as const, completedDays: days.size, lastCompletedAt: latest(dates) }
    }, fallback.a2),
    section(() => options.a3Sessions ?? client.from('a3_session_attempts')
      .select('module_id,status,session_completed_at').eq('user_id', userId).eq('status', 'completed')
      .order('session_completed_at', { ascending: false, nullsFirst: false }).limit(A3_ROW_LIMIT + 1), (data, result) => {
      // The Radar may share its already owner-scoped result, including unfinished sessions.
      // Its exact owner count establishes completeness independently of the API row cap.
      if (options.a3Sessions && (!Array.isArray(data) || !Number.isInteger(result.count) || result.count !== data.length)) throw new Error('Incomplete shared sessions')
      const completed = rows(data, options.a3Sessions ? 1000 : A3_ROW_LIMIT).filter(row => row.status === 'completed')
      const modules = new Set<string>()
      const dates: Array<string | null> = []
      for (const row of completed) {
        if (typeof row.module_id !== 'string' || !MODULE_IDS.has(row.module_id)) throw new Error('Invalid completed module')
        modules.add(row.module_id); dates.push(timestamp(row.session_completed_at, now))
      }
      return { status: modules.size ? 'available' as const : 'empty' as const, completedModules: modules.size, lastCompletedAt: latest(dates) }
    }, fallback.a3),
  ])
  const states = [identity.status, a1.status, a2.status, a3.status]
  return { status: states.includes('unavailable') ? 'degraded' : states.includes('available') ? 'available' : 'empty', identity, a1, a2, a3 }
}

export async function loadA4JourneyContext(userId: string, options: Options = {}): Promise<A4JourneyContext> {
  try { return await readA4JourneyContext(await createClient(), userId, options) }
  catch { return unavailable() }
}
