import 'server-only'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { DEMO_COOKIE_NAME, verifyDemoSessionToken } from '@/lib/auth/demo-user'

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

export interface ProfileFlags {
  onboarding_conozcamonos_1_completed?: boolean | null
  a1_cerebral_intro_seen?: boolean | null
  a1_cerebral_completed?: boolean | null
  a1_results_saved?: boolean | null
  a1_report_seen?: boolean | null
  a2_intro_seen?: boolean | null
  conozcamonos_2_completed?: boolean | null
  a2_route_generated?: boolean | null
  a3_unlocked?: boolean | null
  a4_unlocked?: boolean | null
  onboarding_completed?: boolean | null
  onboarding_cerebral_completed?: boolean | null
  a1_test_completed?: boolean | null
}

interface JourneyEvidence {
  a1CompletedAt: string | null
  a2HighestDay: number
  a2StartedAt: string | null
  a3CompletedModules: string[]
  a3UpdatedAt: string | null
  a3RouteCompletedAt: string | null
}

const MODULE_ENTRY: Record<Exclude<JourneyModule, 'COMPLETED'>, string> = {
  A1: '/despega/conozcamonos-1',
  A2: '/despega/a2',
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

function validDay(value: unknown): number {
  const day = Number(value)
  return Number.isInteger(day) && day >= 1 && day <= 90 ? day : 1
}

function normalizeModuleIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function hasCompletedA1(profile: ProfileFlags, state: JourneyState) {
  return Boolean(
    state.a1CompletedAt ||
      profile.a1_cerebral_completed ||
      profile.a1_test_completed ||
      profile.onboarding_cerebral_completed,
  )
}

function hasCompletedC1(profile: ProfileFlags) {
  return Boolean(
    profile.onboarding_conozcamonos_1_completed || profile.onboarding_completed,
  )
}

function hasSeenA1Report(profile: ProfileFlags) {
  return Boolean(profile.a1_report_seen || profile.a1_results_saved)
}

function hasCompletedC2(profile: ProfileFlags) {
  return Boolean(profile.conozcamonos_2_completed)
}

export function getModuleAccess(
  state: JourneyState,
  profile: ProfileFlags,
): JourneyAccess {
  const a1Complete = hasCompletedA1(profile, state)
  const a2OnboardingComplete =
    hasCompletedC1(profile) &&
    a1Complete &&
    hasSeenA1Report(profile) &&
    Boolean(profile.a2_intro_seen) &&
    hasCompletedC2(profile)

  return {
    a1: true,
    a2: a2OnboardingComplete,
    a3:
      a2OnboardingComplete &&
      Boolean(
        state.a3UnlockedAt ||
          profile.a3_unlocked ||
          state.highestA2DayUnlocked >= 7,
      ),
    a4:
      a2OnboardingComplete &&
      Boolean(state.a4UnlockedAt && profile.a4_unlocked),
  }
}

async function getVerifiedDemoUser() {
  const cookieStore = await cookies()
  const demoUser = await verifyDemoSessionToken(
    cookieStore.get(DEMO_COOKIE_NAME)?.value,
  )
  if (!demoUser) return null

  return {
    id: demoUser.id,
    email: demoUser.email,
    user_metadata: {
      full_name: demoUser.name,
      name: demoUser.name,
    },
  }
}

async function getCurrentIdentity() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) return { user, isDemo: false as const }

  const demoUser = await getVerifiedDemoUser()
  return demoUser ? { user: demoUser, isDemo: true as const } : null
}

async function loadJourneyEvidence(
  userId: string,
  supabase: ReturnType<typeof createAdminClient>,
): Promise<JourneyEvidence> {
  const [
    a1TestResult,
    a1AssessmentResult,
    a2CompletionResult,
    a2RouteResult,
    a3Result,
    a3RouteResult,
  ] = await Promise.all([
    supabase
      .from('a1_tests_results')
      .select('created_at, completed_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('a1_cerebral_assessment')
      .select('created_at, completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('a2_user_task_completions')
      .select('day, completed_at')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .order('day', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('a2_user_route_progress')
      .select('dia_actual, updated_at, fecha_inicio')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('a3_user_progress')
      .select('completed_module_ids, updated_at, created_at')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('a3_route_progression')
      .select('route_completed_at, updated_at')
      .eq('user_id', userId)
      .maybeSingle(),
  ])

  const a1CompletedAt =
    a1AssessmentResult.data?.completed_at ||
    a1AssessmentResult.data?.created_at ||
    a1TestResult.data?.completed_at ||
    a1TestResult.data?.created_at ||
    null
  const lastCompletedDay = Number(a2CompletionResult.data?.day) || 0
  const routeDay = Number(a2RouteResult.data?.dia_actual) || 1
  const a2HighestDay = Math.max(
    1,
    routeDay,
    lastCompletedDay > 0 ? Math.min(90, lastCompletedDay + 1) : 1,
  )

  return {
    a1CompletedAt,
    a2HighestDay,
    a2StartedAt:
      a2RouteResult.data?.fecha_inicio ||
      a2RouteResult.data?.updated_at ||
      a2CompletionResult.data?.completed_at ||
      null,
    a3CompletedModules: normalizeModuleIds(
      a3Result.data?.completed_module_ids,
    ),
    a3UpdatedAt:
      a3Result.data?.updated_at || a3Result.data?.created_at || null,
    a3RouteCompletedAt: a3RouteResult.data?.route_completed_at || null,
  }
}

function hydrateProfileFlags(
  profile: ProfileFlags,
  evidence: JourneyEvidence,
): ProfileFlags {
  const hasA1Evidence = Boolean(evidence.a1CompletedAt)
  const hasA3Evidence = evidence.a3CompletedModules.length > 0
  const hasA4Evidence = Boolean(evidence.a3RouteCompletedAt)
  const hasA2Evidence =
    evidence.a2HighestDay > 1 || Boolean(evidence.a2StartedAt) || hasA3Evidence

  return {
    ...profile,
    onboarding_conozcamonos_1_completed:
      profile.onboarding_conozcamonos_1_completed || hasA1Evidence,
    a1_cerebral_intro_seen:
      profile.a1_cerebral_intro_seen || hasA1Evidence,
    a1_cerebral_completed:
      profile.a1_cerebral_completed || hasA1Evidence,
    a1_results_saved: profile.a1_results_saved || hasA1Evidence,
    a1_report_seen: profile.a1_report_seen || hasA1Evidence,
    a2_intro_seen: profile.a2_intro_seen || hasA2Evidence,
    conozcamonos_2_completed:
      profile.conozcamonos_2_completed || hasA2Evidence,
    a2_route_generated: profile.a2_route_generated || hasA2Evidence,
    a3_unlocked: profile.a3_unlocked || hasA3Evidence,
    // A4 is derived from the verified A3 route closure, not an isolated legacy flag.
    a4_unlocked: hasA4Evidence,
  }
}

function hydrateJourneyState(
  state: JourneyState,
  profile: ProfileFlags,
  evidence: JourneyEvidence,
): JourneyState {
  const highestA2DayUnlocked = Math.max(
    validDay(state.highestA2DayUnlocked),
    evidence.a2HighestDay,
  )
  const currentA2Day = Math.max(
    validDay(state.currentA2Day),
    highestA2DayUnlocked,
  )
  const hasA3Evidence = evidence.a3CompletedModules.length > 0
  const hasA4Evidence = Boolean(evidence.a3RouteCompletedAt)
  const hasA2Evidence =
    highestA2DayUnlocked > 1 || Boolean(evidence.a2StartedAt) || hasA3Evidence

  let currentModule: JourneyModule = 'A1'
  if (state.currentModule === 'COMPLETED') currentModule = 'COMPLETED'
  else if (hasA4Evidence) currentModule = 'A4'
  else if (state.a3UnlockedAt || profile.a3_unlocked || hasA3Evidence) {
    currentModule = 'A3'
  } else if (state.a2StartedAt || profile.a2_route_generated || hasA2Evidence) {
    currentModule = 'A2'
  }

  return {
    ...state,
    currentModule,
    currentA2Day,
    highestA2DayUnlocked,
    a1CompletedAt: state.a1CompletedAt || evidence.a1CompletedAt,
    a2StartedAt: state.a2StartedAt || evidence.a2StartedAt,
    a3UnlockedAt:
      state.a3UnlockedAt || (hasA3Evidence ? evidence.a3UpdatedAt : null),
    // Ignore premature legacy timestamps unless the A3 route is actually closed.
    a4UnlockedAt: hasA4Evidence
      ? state.a4UnlockedAt || evidence.a3RouteCompletedAt
      : null,
  }
}

export async function getJourneyForCurrentUser() {
  const identity = await getCurrentIdentity()
  if (!identity) return null

  const admin = createAdminClient()
  const userId = identity.user.id
  const { error: ensureError } = await admin.rpc(
    'ensure_despega_journey_state',
    { p_user_id: userId },
  )
  if (ensureError) {
    throw new Error(`Unable to initialize journey: ${ensureError.message}`)
  }

  const [stateResult, profileResult, evidence] = await Promise.all([
    admin
      .from('despega_journey_state')
      .select('*')
      .eq('user_id', userId)
      .single(),
    admin
      .from('despega_user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(),
    loadJourneyEvidence(userId, admin),
  ])

  if (stateResult.error || !stateResult.data) {
    throw new Error(
      `Unable to load journey: ${stateResult.error?.message ?? 'missing state'}`,
    )
  }
  if (profileResult.error) {
    throw new Error(
      `Unable to load journey profile: ${profileResult.error.message}`,
    )
  }

  const rawState = mapState(stateResult.data as JourneyRow)
  const rawProfile = (profileResult.data ?? {}) as ProfileFlags
  const profile = hydrateProfileFlags(rawProfile, evidence)
  const state = hydrateJourneyState(rawState, profile, evidence)

  return {
    user: identity.user,
    state,
    profile,
    access: getModuleAccess(state, profile),
    isDemo: identity.isDemo,
  }
}

export async function requireJourneyModule(
  module: Exclude<JourneyModule, 'COMPLETED'>,
) {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin')

  const allowed = journey.access[module.toLowerCase() as keyof JourneyAccess]
  if (!allowed) {
    if (module === 'A4' && journey.access.a3) redirect(MODULE_ENTRY.A3)
    const next = await getCanonicalNextPath(journey.profile)
    redirect(next)
  }

  return journey
}

export async function requireA2Day(day: number) {
  const journey = await requireJourneyModule('A2')
  if (
    day < 1 ||
    day > 90 ||
    day > journey.state.highestA2DayUnlocked
  ) {
    redirect(`/despega/a2/dia-${journey.state.highestA2DayUnlocked}`)
  }
  return journey
}

export async function getCanonicalNextPath(
  profile: ProfileFlags,
): Promise<string> {
  if (!hasCompletedC1(profile)) return MODULE_ENTRY.A1
  if (!profile.a1_cerebral_intro_seen) return '/despega/a1-cerebral-intro'
  if (
    !profile.a1_cerebral_completed &&
    !profile.a1_test_completed &&
    !profile.onboarding_cerebral_completed
  ) {
    return '/despega/a1-cerebral'
  }
  if (!hasSeenA1Report(profile)) return '/despega/a1/resultado'
  if (!profile.a2_intro_seen) return '/despega/a2/intro'
  if (!hasCompletedC2(profile)) return '/despega/conozcamonos-2'
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

  const supabase = createAdminClient()
  const userId = journey.user.id
  const [a1Result, a2Result, a3Result, documentsResult, scoreResult] =
    await Promise.all([
      supabase
        .from('a1_cerebral_assessment')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('canon_generated_routes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('a3_session_attempts')
        .select('module_id,status,score,created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('dtc_documents')
        .select('id,name,document_type,status,created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('a4_strategic_score')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])

  return {
    state: journey.state,
    access: journey.access,
    a1: (a1Result.data as Record<string, unknown> | null) ?? null,
    a2: (a2Result.data as Record<string, unknown> | null) ?? null,
    a3: (a3Result.data as Array<Record<string, unknown>> | null) ?? [],
    a4: {
      documents:
        (documentsResult.data as Array<Record<string, unknown>> | null) ?? [],
      strategicScore:
        (scoreResult.data as Record<string, unknown> | null) ?? null,
    },
  }
}
