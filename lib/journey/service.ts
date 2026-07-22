import 'server-only'

import { cookies } from 'next/headers'
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

const TRAVIS_EMAIL = 'travis@nuanu.com'
const TRAVIS_USER_ID = 'demo-travis'

async function getTravisDemoUser() {
  const cookieStore = await cookies()
  const rawCookie = cookieStore.get('demo_user')?.value
  if (!rawCookie) return null

  try {
    const demoUser = JSON.parse(decodeURIComponent(rawCookie)) as {
      id?: string
      email?: string
      name?: string
      is_dev?: boolean
    }
    if (demoUser.is_dev !== true && demoUser.email !== TRAVIS_EMAIL) return null

    return {
      id: demoUser.id || TRAVIS_USER_ID,
      email: demoUser.email || TRAVIS_EMAIL,
      user_metadata: {
        full_name: demoUser.name || 'Travis',
        name: demoUser.name || 'Travis',
      },
    }
  } catch {
    return null
  }
}

function getTravisJourney(user: NonNullable<Awaited<ReturnType<typeof getTravisDemoUser>>>) {
  const completedAt = '2026-01-01T00:00:00.000Z'
  const state: JourneyState = {
    userId: user.id,
    currentModule: 'A4',
    currentA2Day: 90,
    highestA2DayUnlocked: 90,
    a1CompletedAt: completedAt,
    a2StartedAt: completedAt,
    a2CompletedAt: completedAt,
    a3UnlockedAt: completedAt,
    a4UnlockedAt: completedAt,
    version: 1,
  }
  const profile: ProfileFlags = {
    onboarding_conozcamonos_1_completed: true,
    a1_cerebral_intro_seen: true,
    a1_cerebral_completed: true,
    a1_results_viewed: true,
    a1_report_viewed: true,
    a2_intro_seen: true,
    onboarding_conozcamonos_2_completed: true,
    a2_route_generated: true,
    a2_unlocked: true,
    a3_unlocked: true,
    a4_unlocked: true,
  }

  return { user, state, profile, access: getModuleAccess(state, profile), isDemo: true as const }
}

export async function getJourneyForCurrentUser() {
  const demoUser = await getTravisDemoUser()
  if (demoUser) return getTravisJourney(demoUser)

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
  if (!journey) redirect('/auth/signin')

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

export interface SharedJourneyContext {
  state: JourneyState
  access: JourneyAccess
  a1: Record<string, unknown> | null
  a2: Record<string, unknown> | null
  a3: Array<Record<string, unknown>>
  a4: {
    documents: Array<Record<string, unknown>>
    strategicScore: Record<string, unknown> | null
  }
}

/** Canonical, user-scoped context consumed across A1–A4 and by Vera. */
export async function getSharedJourneyContext(): Promise<SharedJourneyContext | null> {
  const journey = await getJourneyForCurrentUser()
  if (!journey) return null

  if ('isDemo' in journey && journey.isDemo) {
    return {
      state: journey.state,
      access: journey.access,
      a1: { source: 'travis-demo', status: 'completed' },
      a2: { source: 'travis-demo', status: 'completed', highestDayUnlocked: 90 },
      a3: [{ source: 'travis-demo', status: 'completed' }],
      a4: { documents: [], strategicScore: { source: 'travis-demo', status: 'available' } },
    }
  }

  const supabase = await createClient()
  const userId = journey.user.id
  const [a1Result, a2Result, a3Result, documentsResult, scoreResult] = await Promise.all([
    supabase.from('a1_cerebral_assessment').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('canon_generated_routes').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('a3_session_attempts').select('module_id,status,score,created_at').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('dtc_documents').select('id,name,document_type,status,created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
    supabase.from('a4_strategic_score').select('*').eq('user_id', userId).order('updated_at', { ascending: false }).limit(1).maybeSingle(),
  ])

  return {
    state: journey.state,
    access: journey.access,
    a1: (a1Result.data as Record<string, unknown> | null) ?? null,
    a2: (a2Result.data as Record<string, unknown> | null) ?? null,
    a3: (a3Result.data as Array<Record<string, unknown>> | null) ?? [],
    a4: {
      documents: (documentsResult.data as Array<Record<string, unknown>> | null) ?? [],
      strategicScore: (scoreResult.data as Record<string, unknown> | null) ?? null,
    },
  }
}
