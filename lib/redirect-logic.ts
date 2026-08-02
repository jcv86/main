import { createClient } from '@/lib/supabase/client'

/**
 * Legacy client-side redirect helper.
 * Server-rendered entry points must prefer lib/journey/service.ts.
 */
export interface UserProfile {
  onboarding_conozcamonos_1_completed?: boolean
  a1_cerebral_intro_seen?: boolean
  a1_cerebral_completed?: boolean
  a1_results_saved?: boolean
  a1_report_seen?: boolean
  a2_intro_seen?: boolean
  conozcamonos_2_completed?: boolean
  a2_route_generated?: boolean
  a3_unlocked?: boolean
  a4_unlocked?: boolean

  // Compatibility aliases from older profile versions.
  onboarding_completed?: boolean
  onboarding_cerebral_completed?: boolean
  onboarding_conozcamonos_2_completed?: boolean
  a1_test_completed?: boolean
}

function completedC1(profile: UserProfile) {
  return Boolean(
    profile.onboarding_conozcamonos_1_completed || profile.onboarding_completed,
  )
}

function completedA1(profile: UserProfile) {
  return Boolean(
    profile.a1_cerebral_completed ||
      profile.a1_test_completed ||
      profile.onboarding_cerebral_completed,
  )
}

function viewedA1Result(profile: UserProfile) {
  return Boolean(profile.a1_report_seen || profile.a1_results_saved)
}

function completedC2(profile: UserProfile) {
  return Boolean(
    profile.conozcamonos_2_completed ||
      profile.onboarding_conozcamonos_2_completed,
  )
}

/** Returns the next onboarding page; A3 and A4 unlock inside the live journey. */
export async function getNextRequiredPage(userId: string): Promise<string> {
  const supabase = createClient()
  const { data: profile, error } = await supabase
    .from('despega_user_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error || !profile) return '/despega/conozcamonos-1'

  if (!completedC1(profile)) return '/despega/conozcamonos-1'
  if (!profile.a1_cerebral_intro_seen) return '/despega/a1-cerebral-intro'
  if (!completedA1(profile)) return '/despega/a1-cerebral'
  if (!viewedA1Result(profile)) return '/despega/a1/resultado'
  if (!profile.a2_intro_seen) return '/despega/a2/intro'
  if (!completedC2(profile)) return '/despega/conozcamonos-2'

  return '/despega/a2'
}

/** Get current onboarding stage before the live A2 journey begins. */
export function getUserStage(profile: UserProfile): number {
  if (!completedC1(profile)) return 1
  if (!profile.a1_cerebral_intro_seen) return 2
  if (!completedA1(profile)) return 3
  if (!viewedA1Result(profile)) return 4
  if (!profile.a2_intro_seen) return 5
  if (!completedC2(profile)) return 6
  return 7
}

export function isStageUnlocked(
  profile: UserProfile,
  stage: 'a1' | 'a2' | 'a3' | 'a4',
): boolean {
  switch (stage) {
    case 'a1':
      return completedC1(profile)
    case 'a2':
      return completedC1(profile) && completedA1(profile) && viewedA1Result(profile)
    case 'a3':
      return completedC2(profile) && Boolean(profile.a2_route_generated)
    case 'a4':
      return Boolean(profile.a3_unlocked)
    default:
      return false
  }
}
