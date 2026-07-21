import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type JourneyModule = 'A1' | 'A2' | 'A3' | 'A4' | 'COMPLETED'

export interface JourneyState {
  userId: string
  currentModule: JourneyModule
  currentA2Day: number
  highestA2DayUnlocked: number
  a1CompletedAt: string | null
  a2StartedAt: string | null
  a2CompletedAt: string | null
  a3UnlockedAt: string | null
  a4UnlockedAt: string | null
  version: number
}

export interface JourneyAccess {
  a1: boolean
  a2: boolean
  a3: boolean
  a4: boolean
}

interface JourneyRow {
  user_id: string
  current_module: JourneyModule
  current_a2_day: number
  highest_a2_day_unlocked: number
  a1_completed_at: string | null
  a2_started_at: string | null
  a2_completed_at: string | null
  a3_unlocked_at: string | null
  a4_unlocked_at: string | null
  version: number
}

interface ProfileFlags {
  onboarding_conozcamonos_1_completed?: boolean | null
  a1_cerebral_intro_seen?: boolean | null
  a1_cerebral_completed?: boolean | null
  a1_results_viewed?: boolean | null
  a1_report_viewed?: boolean | null
  a2_intro_seen?: boolean | null
  onboarding_conozcamonos_2_completed?: boolean | null
  a2_route_generated?: boolean | null
  a2_unlocked?: boolean | null
  a3_unlocked?: boolean | null
  a4_unlocked?: boolean | null
}

const MODULE_ENTRY: Record<Exclude<JourneyModule, 'COMPLETED'>, string> = {
  A1: '/despega/conozcamonos-1',
  A2: '/despega/a2/dashboard',
  A3: '/despega/a3',
  A4: '/despega/a4',
}

function mapState(row: JourneyRow): JourneyState {
  return {
    userId: row.user_id,
    currentModule: row.current_module,
    currentA2Day: row.current_a2_day,
    highestA2DayUnlocked: row.highest_a2_day_unlocked,
    a1CompletedAt: row.a1_completed_at,
    a2StartedAt: row.a2_started_at,
    a2CompletedAt: row.a2_completed_at,
    a3UnlockedAt: row.a3_unlocked_at,
    a4UnlockedAt: row.a4_unlocked_at,
    version: row.version,
  }
}

export function getModuleAccess(state: JourneyState, profile: ProfileFlags): JourneyAccess {
  const a1Complete = Boolean(state.a1CompletedAt || profile.a1_cerebral_completed)
  const a2 = a1Complete && Boolean(profile.a2_route_generated || profile.a2_unlocked)
  return {
    a1: true,
    a2,
    a3: a2 && Boolean(state.a3UnlockedAt || profile.a3_unlocked),
    a4: a2 && Boolean(state.a4UnlockedAt || profile.a4_unlocked),
  }
}

export async function getJourneyForCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { error: ensureError } = await supabase.rpc('ensure_despega_journey_state', {
    p_user_id: user.id,
  })
  if (ensureError) throw new Error(`Unable to initialize journey: ${ensureError.message}`)

  const [{ data: row, error: stateError }, { data: profile, error: profileError }] = await Promise.all([
    supabase.from('despega_journey_state').select('*').eq('user_id', user.id).single(),
    supabase.from('despega_user_profiles').select('*').eq('user_id', user.id).maybeSingle(),
  ])

  if (stateError || !row) throw new Error(`Unable to load journey: ${stateError?.message ?? 'missing state'}`)
  if (profileError) throw new Error(`Unable to load journey profile: ${profileError.message}`)

  const state = mapState(row as JourneyRow)
  const flags = (profile ?? {}) as ProfileFlags
  return { user, state, profile: flags, access: getModuleAccess(state, flags) }
}

export async function requireJourneyModule(module: Exclude<JourneyModule, 'COMPLETED'>) {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/sign-in')

  const allowed = journey.access[module.toLowerCase() as keyof JourneyAccess]
  if (!allowed) {
    const next = await getCanonicalNextPath(journey.profile)
    redirect(next)
  }

  return journey
}

export async function requireA2Day(day: number) {
  const journey = await requireJourneyModule('A2')
  if (day < 1 || day > 90 || day > journey.state.highestA2DayUnlocked) {
    redirect(`/despega/a2/dia-${journey.state.highestA2DayUnlocked}`)
  }
  return journey
}

export async function getCanonicalNextPath(profile: ProfileFlags): Promise<string> {
  if (!profile.onboarding_conozcamonos_1_completed) return '/despega/conozcamonos-1'
  if (!profile.a1_cerebral_intro_seen) return '/despega/a1-cerebral-intro'
  if (!profile.a1_cerebral_completed) return '/despega/a1-cerebral'
  if (!profile.a1_results_viewed) return '/despega/a1/resultado'
  if (!profile.a1_report_viewed) return '/despega/a1-report'
  if (!profile.a2_intro_seen) return '/despega/a2/intro'
  if (!profile.onboarding_conozcamonos_2_completed) return '/despega/conozcamonos-2'
  if (!profile.a2_route_generated) return '/despega/a2-routes'
  return MODULE_ENTRY.A2
}
