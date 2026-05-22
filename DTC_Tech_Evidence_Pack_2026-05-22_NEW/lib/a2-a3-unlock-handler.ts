/**
 * A2 → A3 Unlock Handler
 * 
 * When user completes a day in A2, this triggers any A3 module unlocks.
 * Maps: Day completions → A3 module unlocks
 */

import { createClient } from '@/lib/supabase/server'
import { A2_DAYS } from './a2-days-config'

export interface A3UnlockResult {
  success: boolean
  unlockedModules: string[]
  message: string
}

/**
 * Get all unlock days from A2 config
 * Returns mapping of day number to A3 module that unlocks
 */
export function getA3UnlockMap(): Record<number, string> {
  const unlockMap: Record<number, string> = {}
  
  Object.values(A2_DAYS).forEach(day => {
    if (day.unlocksA3Module) {
      unlockMap[day.dia] = day.unlocksA3Module
    }
  })
  
  return unlockMap
}

/**
 * Get A3 modules that unlock on a specific day
 */
export function getA3ModulesForDay(dayNumber: number): string[] {
  const day = A2_DAYS[dayNumber]
  return day?.unlocksA3Module ? [day.unlocksA3Module] : []
}

/**
 * Trigger A3 module unlocks when a day is completed
 * This is called from the Day completion API endpoint
 */
export async function triggerA3UnlocksForDay(
  userId: string,
  dayNumber: number,
): Promise<A3UnlockResult> {
  try {
    const modulesToUnlock = getA3ModulesForDay(dayNumber)
    
    if (modulesToUnlock.length === 0) {
      return {
        success: true,
        unlockedModules: [],
        message: `Day ${dayNumber} completed - no A3 modules unlocked`,
      }
    }

    const supabase = await createClient()
    
    // Get or create user's A3 progress record
    const { data: existingProgress, error: fetchError } = await supabase
      .from('a3_user_progress')
      .select('unlocked_modules, unlock_dates')
      .eq('user_id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('[v0] Error fetching A3 progress:', fetchError)
      return {
        success: false,
        unlockedModules: [],
        message: 'Error accessing A3 progress',
      }
    }

    // Initialize or update unlock tracking
    const unlockedModules = existingProgress?.unlocked_modules || []
    const unlockDates = existingProgress?.unlock_dates || {}

    // Add newly unlocked modules
    let newUnlocks = 0
    const now = new Date().toISOString()
    
    for (const module of modulesToUnlock) {
      if (!unlockedModules.includes(module)) {
        unlockedModules.push(module)
        unlockDates[module] = now
        newUnlocks++
      }
    }

    // Update or insert A3 progress record
    if (existingProgress) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('a3_user_progress')
        .update({
          unlocked_modules: unlockedModules,
          unlock_dates: unlockDates,
          updated_at: now,
        })
        .eq('user_id', userId)

      if (updateError) {
        console.error('[v0] Error updating A3 progress:', updateError)
        return {
          success: false,
          unlockedModules: [],
          message: 'Error updating A3 progress',
        }
      }
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from('a3_user_progress')
        .insert({
          user_id: userId,
          unlocked_modules: unlockedModules,
          unlock_dates: unlockDates,
          completed_module_ids: [],
        })

      if (insertError) {
        console.error('[v0] Error creating A3 progress:', insertError)
        return {
          success: false,
          unlockedModules: [],
          message: 'Error creating A3 progress record',
        }
      }
    }

    // Log the unlock event
    if (newUnlocks > 0) {
      console.log(`[v0] A3 modules unlocked for user ${userId}: ${modulesToUnlock.join(', ')}`)
      
      // Optionally store unlock event
      await supabase
        .from('despega_score_events')
        .insert({
          user_id: userId,
          event_type: 'a3_module_unlock',
          details: {
            day_completed: dayNumber,
            unlocked_modules: modulesToUnlock,
            timestamp: now,
          },
        })
    }

    return {
      success: true,
      unlockedModules,
      message: newUnlocks > 0 
        ? `🎉 A3 modules unlocked: ${modulesToUnlock.join(', ')}`
        : `Day ${dayNumber} completed - A3 modules already unlocked`,
    }
  } catch (error) {
    console.error('[v0] Error in triggerA3UnlocksForDay:', error)
    return {
      success: false,
      unlockedModules: [],
      message: 'Error triggering A3 unlocks',
    }
  }
}

/**
 * Get all unlocked A3 modules for a user
 */
export async function getUserUnlockedA3Modules(userId: string): Promise<string[]> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('a3_user_progress')
      .select('unlocked_modules')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No record yet, return empty
        return []
      }
      console.error('[v0] Error fetching unlocked modules:', error)
      return []
    }

    return data?.unlocked_modules || []
  } catch (error) {
    console.error('[v0] Error in getUserUnlockedA3Modules:', error)
    return []
  }
}

/**
 * Get unlock date for a specific A3 module
 */
export async function getA3ModuleUnlockDate(
  userId: string,
  moduleId: string,
): Promise<Date | null> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('a3_user_progress')
      .select('unlock_dates')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return null
    }

    const unlockDate = data.unlock_dates?.[moduleId]
    return unlockDate ? new Date(unlockDate) : null
  } catch (error) {
    console.error('[v0] Error getting unlock date:', error)
    return null
  }
}
