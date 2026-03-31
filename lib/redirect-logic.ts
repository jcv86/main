import { createClient } from '@/lib/supabase/client'

export interface UserProfile {
  onboarding_completed?: boolean
  onboarding_cerebral_completed?: boolean
  a1_test_completed?: boolean
  onboarding_conozcamonos_2_completed?: boolean
  a2_route_generated?: boolean
  a2_missions_started?: boolean
  a3_intro_completed?: boolean
  a3_entrevista_0_completed?: boolean
  a3_training_started?: boolean
  a4_unlocked?: boolean
}

/**
 * Determines the next page a user should visit based on their completion flags
 * This is the single source of truth for navigation logic across the app
 */
export async function getNextRequiredPage(userId: string): Promise<string> {
  const supabase = createClient()
  
  const { data: profile, error } = await supabase
    .from('despega_user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error || !profile) {
    console.log('[v0] No profile found, starting from beginning')
    return '/despega/bienvenida'
  }

  // Check prerequisites in order
  if (!profile.onboarding_completed) {
    console.log('[v0] Redirecting: onboarding not completed')
    return '/despega/conozcamonos-1'
  }

  if (!profile.onboarding_cerebral_completed) {
    console.log('[v0] Redirecting: cerebral assessment not completed')
    return '/despega/a1-cerebral-intro'
  }

  if (!profile.a1_test_completed) {
    console.log('[v0] Redirecting: A1 test not completed')
    return '/despega/a1-cerebral'
  }

  if (!profile.onboarding_conozcamonos_2_completed) {
    console.log('[v0] Redirecting: Conozcámonos-2 not completed')
    return '/despega/conozcamonos-2'
  }

  if (!profile.a2_route_generated) {
    console.log('[v0] Redirecting: A2 route not generated')
    return '/despega/a2/intro'
  }

  if (!profile.a2_missions_started) {
    console.log('[v0] Redirecting: A2 missions not started')
    return '/despega/a2/dashboard'
  }

  if (!profile.a3_intro_completed) {
    console.log('[v0] Redirecting: A3 intro not completed')
    return '/despega/a3'
  }

  if (!profile.a3_entrevista_0_completed) {
    console.log('[v0] Redirecting: A3 entrevista-0 not completed')
    return '/despega/a3'
  }

  if (!profile.a4_unlocked) {
    console.log('[v0] Redirecting: A4 not unlocked')
    return '/despega/a4'
  }

  // All prerequisites met, user can access their dashboard
  console.log('[v0] User fully onboarded, showing dashboard')
  return '/despega/dashboard'
}

/**
 * Checks if user has completed all prerequisites for a specific stage
 */
export function isStageUnlocked(profile: UserProfile, stage: 'a1' | 'a2' | 'a3' | 'a4'): boolean {
  switch (stage) {
    case 'a1':
      return profile.onboarding_completed === true
    case 'a2':
      return (
        profile.onboarding_completed === true &&
        profile.onboarding_cerebral_completed === true &&
        profile.a1_test_completed === true &&
        profile.onboarding_conozcamonos_2_completed === true
      )
    case 'a3':
      return (
        profile.a2_route_generated === true &&
        profile.a2_missions_started === true
      )
    case 'a4':
      return profile.a3_entrevista_0_completed === true
    default:
      return false
  }
}
