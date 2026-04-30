import { createClient } from '@/lib/supabase/client'

export interface TaskCompletion {
  id: string
  user_id: string
  phase: 30 | 60 | 90
  day: number
  task_title: string
  completed_at: string
  created_at: string
  updated_at: string
}

/**
 * Generate a unique task ID for deduplication
 */
export const getTaskId = (phase: 30 | 60 | 90, day: number, title: string): string => {
  return `${phase}-${day}-${title}`
}

/**
 * Fetch all completed tasks for the current user
 */
export const fetchUserCompletions = async (): Promise<TaskCompletion[]> => {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('a2_user_task_completions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching completions:', error)
    return []
  }

  return data || []
}

/**
 * Mark a task as completed
 */
export const markTaskComplete = async (
  phase: 30 | 60 | 90,
  day: number,
  title: string
): Promise<TaskCompletion | null> => {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.error('[v0] No authenticated user')
    return null
  }

  const { data, error } = await supabase
    .from('a2_user_task_completions')
    .insert({
      user_id: user.id,
      phase,
      day,
      task_title: title
    })
    .select()
    .single()

  if (error) {
    // If it's a unique constraint error (task already completed), ignore it
    if (error.code === '23505') {
      console.log('[v0] Task already marked as complete')
      return { phase, day, task_title: title } as any
    }
    console.error('[v0] Error marking task complete:', error)
    return null
  }

  return data
}

/**
 * Unmark a task as completed
 */
export const unmarkTaskComplete = async (
  phase: 30 | 60 | 90,
  day: number,
  title: string
): Promise<boolean> => {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.error('[v0] No authenticated user')
    return false
  }

  const { error } = await supabase
    .from('a2_user_task_completions')
    .delete()
    .match({
      user_id: user.id,
      phase,
      day,
      task_title: title
    })

  if (error) {
    console.error('[v0] Error unmarking task:', error)
    return false
  }

  return true
}

/**
 * Get completed tasks for a specific phase
 */
export const getPhaseCompletions = async (phase: 30 | 60 | 90): Promise<string[]> => {
  const completions = await fetchUserCompletions()
  return completions
    .filter(c => c.phase === phase)
    .map(c => getTaskId(c.phase, c.day, c.task_title))
}

/**
 * Convert completions to a Set of task IDs for faster lookup
 */
export const completionsToSet = (completions: TaskCompletion[]): Set<string> => {
  return new Set(completions.map(c => getTaskId(c.phase, c.day, c.task_title)))
}

/**
 * Reset all task completions for the current user
 */
export const resetAllCompletions = async (): Promise<boolean> => {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.error('[v0] No authenticated user')
    return false
  }

  const { error } = await supabase
    .from('a2_user_task_completions')
    .delete()
    .eq('user_id', user.id)

  if (error) {
    console.error('[v0] Error resetting completions:', error)
    return false
  }

  return true
}
