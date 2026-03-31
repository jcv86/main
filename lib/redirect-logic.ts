import { createClient } from '@/lib/supabase/client'

/**
 * CANONICAL USER JOURNEY - 9 STEPS
 * 
 * Step 1: /despega/conozcamonos-1 (Intake Interview)
 * Step 2: /despega/a1-cerebral-intro (A1 Intro)
 * Step 3: /despega/a1-cerebral (A1 Assessment)
 * Step 4: /despega/a1/resultado (A1 Results)
 * Step 5: /despega/a2/intro (A2 Intro)
 * Step 6: /despega/conozcamonos-2 (A2 Intake)
 * Step 7: /despega/a2/dashboard (A2 Missions)
 * Step 8: /despega/a3 (A3 Training)
 * Step 9: /despega/a4 (A4 Radar)
 */

export interface UserProfile {
  onboarding_conozcamonos_1_completed?: boolean
  a1_cerebral_intro_seen?: boolean
  a1_cerebral_completed?: boolean
  a1_report_seen?: boolean
  a2_intro_seen?: boolean
  onboarding_conozcamonos_2_completed?: boolean
  a2_route_generated?: boolean
  a3_unlocked?: boolean
  a4_unlocked?: boolean
  // Legacy flags for backward compatibility
  onboarding_completed?: boolean
  onboarding_cerebral_completed?: boolean
  a1_test_completed?: boolean
}

/**
 * CANONICAL redirect logic: Single source of truth for user navigation
 * Implements the 9-step canonical user journey
 * Returns the NEXT page user needs to visit
 */
export async function getNextRequiredPage(userId: string): Promise<string> {
  const supabase = createClient()
  
  const { data: profile, error } = await supabase
    .from('despega_user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error || !profile) {
    console.log('[v0] [CANONICAL] No profile found, starting from beginning')
    return '/despega/conozcamonos-1'
  }

  // STEP 1: Conozcámonos-1 (Intake Interview)
  if (!profile.onboarding_conozcamonos_1_completed) {
    console.log('[v0] [CANONICAL STEP 1] C1 not completed → /despega/conozcamonos-1')
    return '/despega/conozcamonos-1'
  }

  // STEP 2: A1 Cerebral Intro
  if (!profile.a1_cerebral_intro_seen) {
    console.log('[v0] [CANONICAL STEP 2] A1 intro not seen → /despega/a1-cerebral-intro')
    return '/despega/a1-cerebral-intro'
  }

  // STEP 3: A1 Cerebral Assessment
  if (!profile.a1_cerebral_completed) {
    console.log('[v0] [CANONICAL STEP 3] A1 not completed → /despega/a1-cerebral')
    return '/despega/a1-cerebral'
  }

  // STEP 4: A1 Resultado (Report)
  if (!profile.a1_report_seen) {
    console.log('[v0] [CANONICAL STEP 4] A1 report not seen → /despega/a1/resultado')
    return '/despega/a1/resultado'
  }

  // STEP 5: A2 Intro
  if (!profile.a2_intro_seen) {
    console.log('[v0] [CANONICAL STEP 5] A2 intro not seen → /despega/a2/intro')
    return '/despega/a2/intro'
  }

  // STEP 6: Conozcámonos-2 (A2 Intake)
  if (!profile.onboarding_conozcamonos_2_completed) {
    console.log('[v0] [CANONICAL STEP 6] C2 not completed → /despega/conozcamonos-2')
    return '/despega/conozcamonos-2'
  }

  // STEP 7: A2 Dashboard (Missions)
  if (!profile.a2_route_generated) {
    console.log('[v0] [CANONICAL STEP 7] A2 route not generated → /despega/a2/dashboard')
    return '/despega/a2/dashboard'
  }

  // STEP 8: A3 Training
  if (!profile.a3_unlocked) {
    console.log('[v0] [CANONICAL STEP 8] A3 not unlocked → /despega/a3')
    return '/despega/a3'
  }

  // STEP 9: A4 Radar Estratégico
  if (!profile.a4_unlocked) {
    console.log('[v0] [CANONICAL STEP 9] A4 not unlocked → /despega/a4')
    return '/despega/a4'
  }

  // All steps complete - user can access dashboard
  console.log('[v0] [CANONICAL] All 9 steps complete → /despega/dashboard')
  return '/despega/dashboard'
}

/**
 * Get current user stage (1-9) based on completion flags
 */
export function getUserStage(profile: UserProfile): number {
  if (!profile.onboarding_conozcamonos_1_completed) return 1
  if (!profile.a1_cerebral_intro_seen) return 2
  if (!profile.a1_cerebral_completed) return 3
  if (!profile.a1_report_seen) return 4
  if (!profile.a2_intro_seen) return 5
  if (!profile.onboarding_conozcamonos_2_completed) return 6
  if (!profile.a2_route_generated) return 7
  if (!profile.a3_unlocked) return 8
  if (!profile.a4_unlocked) return 9
  return 9 // All complete
}

/**
 * Checks if user has completed all prerequisites for a specific stage
 */
export function isStageUnlocked(profile: UserProfile, stage: 'a1' | 'a2' | 'a3' | 'a4'): boolean {
  switch (stage) {
    case 'a1':
      return profile.onboarding_conozcamonos_1_completed === true
    case 'a2':
      return (
        profile.onboarding_conozcamonos_1_completed === true &&
        profile.a1_cerebral_completed === true &&
        profile.a1_report_seen === true
      )
    case 'a3':
      return (
        profile.onboarding_conozcamonos_2_completed === true &&
        profile.a2_route_generated === true
      )
    case 'a4':
      return profile.a3_unlocked === true
    default:
      return false
  }
}
