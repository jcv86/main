/**
 * A3 Access Control System
 * 
 * Implements the complete gate logic for A3 module unlocking.
 * This is the critical path that prevents users from accessing A3 until:
 * 1. Day 1 is completed and passed (DTC score >= 75)
 * 2. User is at the correct day (checkpoint day)
 * 3. All previous A3 modules are completed
 */

import { canOpenA3Module } from '@/lib/a2-helpers'
import { getA3CheckpointForDay, getCheckpointDayForModule } from '@/lib/a3-checkpoint-map'

export interface A3AccessCheck {
  canAccess: boolean
  reason: string
  blockReasons: string[]
  currentDay: number
  checkpointDay?: number
  requestedModuleId: string
  day1Status: 'not_started' | 'in_progress' | 'passed' | 'needs_revision'
  day1Score?: number
}

export interface A3ModuleAccessState {
  moduleId: string
  moduleName: string
  moduleNumber: number
  checkpointDay: number
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  reason: string
  prerequisitesCompleted: boolean
  day1PresentationMet: boolean
  currentDayMet: boolean
}

/**
 * Check if user can access a specific A3 module
 */
export async function checkA3ModuleAccess(
  userId: string,
  requestedModuleId: string,
  supabase: any,
): Promise<A3AccessCheck> {
  const blockReasons: string[] = []

  try {
    // 1. Get user's current day in A2
    const { data: a2Progress } = await supabase
      .from('a2_user_route_progress')
      .select('dia_actual')
      .eq('user_id', userId)
      .single()

    const currentDay = a2Progress?.dia_actual || 1

    // 2. Get Day 1 submission status
    const { data: day1Submission } = await supabase
      .from('a2_day1_submissions')
      .select('analysis_score, pass_fail_status, analysis_result')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const day1Score = day1Submission?.analysis_score || 0
    const day1Passed = day1Submission?.pass_fail_status === 'pass'

    let day1Status: 'not_started' | 'in_progress' | 'passed' | 'needs_revision' = 'not_started'
    if (day1Passed) day1Status = 'passed'
    else if (day1Score > 0) day1Status = 'needs_revision'

    // 3. Get A3 checkpoint for this module
    const checkpoint = getA3CheckpointForDay(currentDay)

    // 4. Get user's completed A3 modules
    const { data: a3Progress } = await supabase
      .from('a3_user_progress')
      .select('completed_module_ids')
      .eq('user_id', userId)
      .single()

    const completedA3Modules = a3Progress?.completed_module_ids || []

    // 5. Check all conditions
    const day1PresentationMet = day1Passed
    const currentDayMet = checkpoint?.moduleId === requestedModuleId
    
    // Check if all prerequisite modules are completed
    const requiredPrevious = checkpoint?.requiredPreviousModules || []
    const prerequisitesMet = requiredPrevious.length === 0 || 
      requiredPrevious.every(moduleId => completedA3Modules.includes(moduleId))

    // Build block reasons
    if (!day1PresentationMet) {
      blockReasons.push('Day 1: The Contract With Yourself must be completed with a score of 75+')
    }

    if (!currentDayMet) {
      const checkpointDay = getCheckpointDayForModule(requestedModuleId)
      blockReasons.push(
        `You can only access A3 modules on their checkpoint days. ` +
          `${requestedModuleId} is available on day ${checkpointDay || 'unknown'}.` +
          ` You're currently on day ${currentDay}.`,
      )
    }

    if (!prerequisitesMet && checkpoint?.moduleNumber && checkpoint.moduleNumber > 1) {
      const missingModules = requiredPrevious.filter(m => !completedA3Modules.includes(m))
      blockReasons.push(`You must complete these modules first: ${missingModules.join(', ')}`)
    }

    const canAccess = day1PresentationMet && currentDayMet && prerequisitesMet

    return {
      canAccess,
      reason: canAccess ? 'Access granted - all conditions met' : 'Access denied',
      blockReasons,
      currentDay,
      checkpointDay: getCheckpointDayForModule(requestedModuleId),
      requestedModuleId,
      day1Status,
      day1Score,
    }
  } catch (error) {
    console.error('[v0] Error checking A3 access:', error)
    return {
      canAccess: false,
      reason: 'Error checking access',
      blockReasons: ['An error occurred while checking access conditions'],
      currentDay: 1,
      requestedModuleId,
      day1Status: 'not_started',
    }
  }
}

/**
 * Get access state for all 10 A3 modules
 */
export async function getA3AllModulesAccessState(
  userId: string,
  supabase: any,
): Promise<A3ModuleAccessState[]> {
  try {
    // Get user's current day
    const { data: a2Progress } = await supabase
      .from('a2_user_route_progress')
      .select('dia_actual')
      .eq('user_id', userId)
      .single()

    const currentDay = a2Progress?.dia_actual || 1

    // Get Day 1 status
    const { data: day1Submission } = await supabase
      .from('a2_day1_submissions')
      .select('analysis_score, pass_fail_status')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const day1Passed = day1Submission?.pass_fail_status === 'pass'

    // Get completed A3 modules
    const { data: a3Progress } = await supabase
      .from('a3_user_progress')
      .select('completed_module_ids')
      .eq('user_id', userId)
      .single()

    const completedA3Modules = a3Progress?.completed_module_ids || []

    // Build state for all 10 modules
    const moduleStates: A3ModuleAccessState[] = []

    // This would iterate through all 10 modules from the checkpoint map
    // For now, returning structure
    return moduleStates
  } catch (error) {
    console.error('[v0] Error getting A3 modules state:', error)
    return []
  }
}

/**
 * Get human-readable access denial reason
 */
export function getA3AccessDenialMessage(check: A3AccessCheck): string {
  if (check.canAccess) {
    return 'Access granted!'
  }

  const messages: string[] = ['You cannot access this A3 module yet. Here\'s why:\n']
  check.blockReasons.forEach((reason, index) => {
    messages.push(`${index + 1}. ${reason}`)
  })

  if (check.day1Status === 'needs_revision') {
    messages.push(`\nAction required: Revise your Day 1 submission to score 75 or higher.`)
  }

  if (check.currentDay < (check.checkpointDay || 0)) {
    messages.push(
      `\nCome back on day ${check.checkpointDay} when this module will unlock automatically.`,
    )
  }

  return messages.join('\n')
}

/**
 * Mark A3 module as completed
 */
export async function completeA3Module(
  userId: string,
  moduleId: string,
  supabase: any,
): Promise<boolean> {
  try {
    const { data: progress } = await supabase
      .from('a3_user_progress')
      .select('completed_module_ids')
      .eq('user_id', userId)
      .single()

    const completedIds = progress?.completed_module_ids || []
    if (!completedIds.includes(moduleId)) {
      completedIds.push(moduleId)
    }

    await supabase
      .from('a3_user_progress')
      .update({
        completed_module_ids: completedIds,
        updated_at: new Date(),
      })
      .eq('user_id', userId)

    return true
  } catch (error) {
    console.error('[v0] Error completing A3 module:', error)
    return false
  }
}
