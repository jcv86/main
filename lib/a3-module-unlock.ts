import { createClient } from '@/lib/supabase/server'
import { isSuperadmin } from './user-roles'

export interface ModuleUnlockStatus {
  moduleId: string
  isUnlocked: boolean
  reason: 'not_started' | 'prerequisite_incomplete' | 'insufficient_xp' | 'unlocked' | 'superadmin'
  prerequisiteModule?: string
  xpRequired?: number
  currentXp?: number
}

/**
 * Get all module unlock rules from database
 */
export async function getModuleUnlockRules() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('a3_module_unlock_rules')
    .select('*')
    .order('sequence_order', { ascending: true })
  
  if (error) {
    return []
  }
  
  return data || []
}

/**
 * Get user's current XP - calculated from completed modules
 */
export async function getUserXP(userId: string): Promise<number> {
  const supabase = await createClient()
  
  // Query the new a3_completed_modules table
  const { data, error } = await supabase
    .from('a3_completed_modules')
    .select('xp_earned')
    .eq('user_id', userId)
  
  if (error) {
    // Fallback to old table for backwards compatibility
    const { data: oldData, error: oldError } = await supabase
      .from('a3_user_progress')
      .select('total_xp')
      .eq('user_id', userId)
      .single()
    
    if (oldError) {
      return 0
    }
    
    return oldData?.total_xp || 0
  }
  
  // Sum all XP from completed modules
  return data.reduce((sum: number, item: any) => sum + (item.xp_earned || 0), 0)
}

/**
 * Get user's completed modules
 */
export async function getUserCompletedModules(userId: string): Promise<string[]> {
  const supabase = await createClient()
  
  // Query the new a3_completed_modules table
  const { data, error } = await supabase
    .from('a3_completed_modules')
    .select('module_id')
    .eq('user_id', userId)
  
  if (error) {
    // Fallback to old table for backwards compatibility
    const { data: oldData, error: oldError } = await supabase
      .from('a3_user_progress')
      .select('completed_modules')
      .eq('user_id', userId)
      .single()
    
    if (oldError) {
      return []
    }
    
    return oldData?.completed_modules || []
  }
  
  return data.map((item: any) => item.module_id) || []
}

/**
 * Check if a specific module is unlocked for the user
 * TEMPORARY: All modules unlocked for all users (XP/gamification disabled)
 */
export async function isModuleUnlocked(
  userId: string,
  moduleId: string
): Promise<ModuleUnlockStatus> {
  // TEMPORARY DEBUG MODE: Unlock all modules for all users
  return {
    moduleId,
    isUnlocked: true,
    reason: 'unlocked'
  }
}

/**
 * Check unlock status for all modules
 */
export async function getAllModulesUnlockStatus(
  userId: string
): Promise<ModuleUnlockStatus[]> {
  const rules = await getModuleUnlockRules()
  const statuses: ModuleUnlockStatus[] = []
  
  for (const rule of rules) {
    const status = await isModuleUnlocked(userId, rule.module_id)
    statuses.push(status)
  }
  
  return statuses
}

/**
 * Mark a module as completed and award XP
 */
export async function completeModule(
  userId: string,
  moduleId: string,
  xpReward: number
): Promise<void> {
  const supabase = await createClient()
  
  // Get current progress or create new record
  const { data: existing } = await supabase
    .from('a3_user_progress')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (!existing) {
    // Create new progress record
    await supabase
      .from('a3_user_progress')
      .insert({
        user_id: userId,
        total_xp: xpReward,
        completed_modules: [moduleId],
        last_activity_at: new Date().toISOString()
      })
  } else {
    // Update existing progress
    const completedModules = existing.completed_modules || []
    if (!completedModules.includes(moduleId)) {
      completedModules.push(moduleId)
    }
    
    await supabase
      .from('a3_user_progress')
      .update({
        total_xp: (existing.total_xp || 0) + xpReward,
        completed_modules: completedModules,
        last_activity_at: new Date().toISOString()
      })
      .eq('user_id', userId)
  }
}

/**
 * Get module unlock rules for display in dashboard
 */
export async function getModuleProgressInfo(userId: string) {
  const rules = await getModuleUnlockRules()
  const userXp = await getUserXP(userId)
  const completedModules = await getUserCompletedModules(userId)
  const superadmin = await isSuperadmin(userId)
  
  return {
    modules: rules,
    userXp,
    completedModules,
    isSuperadmin: superadmin,
    totalModules: rules.length,
    completedCount: completedModules.length
  }
}
