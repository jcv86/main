import { createClient } from '@/lib/supabase/client'
import { canonicalOnboardingPath, ONBOARDING_PATHS } from '@/lib/journey/flow'

/** Legacy client navigation helper; server module guards remain authoritative. */
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
  onboarding_completed?: boolean
  onboarding_cerebral_completed?: boolean
  a1_test_completed?: boolean
}

export async function getNextRequiredPage(userId: string): Promise<string> {
  const supabase = createClient()
  const { data: profile, error } = await supabase.from('despega_user_profiles').select('*').eq('user_id', userId).maybeSingle()
  if (error || !profile) return '/despega/conozcamonos-1'
  return canonicalOnboardingPath(profile)
}

export function getUserStage(profile: UserProfile): number {
  return ONBOARDING_PATHS.indexOf(canonicalOnboardingPath(profile)) + 1
}

/** Display hint only. Never use client flags as authorization for a module. */
export function isStageUnlocked(profile: UserProfile, stage: 'a1' | 'a2' | 'a3' | 'a4'): boolean {
  const ready = canonicalOnboardingPath(profile) === '/despega/a2'
  switch (stage) {
    case 'a1': return Boolean(profile.onboarding_conozcamonos_1_completed || profile.onboarding_completed)
    case 'a2': return ready
    case 'a3': return ready && Boolean(profile.a3_unlocked)
    case 'a4': return ready && Boolean(profile.a4_unlocked)
    default: return false
  }
}
