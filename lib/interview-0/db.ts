import { createClient } from '@/lib/supabase/server'

export interface Interview0Data {
  environment_check?: any
  presence_check?: any
  audio_check?: any
  preparation_check?: any
  stage?: string
  final_score?: number
  passed?: boolean
  interview_0_status?: string
  interview_0_completed?: boolean
  overall_progress_percentage?: number
}

/**
 * Save or update interview-0 progress to Supabase
 */
export async function saveInterview0Progress(
  userId: string,
  data: Interview0Data
): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('a3_interview_0_progress')
    .upsert({
      user_id: userId,
      environment_check: data.environment_check,
      presence_check: data.presence_check,
      audio_check: data.audio_check,
      preparation_check: data.preparation_check,
      stage: data.stage,
      final_score: data.final_score,
      passed: data.passed,
      overall_progress_percentage: data.overall_progress_percentage,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })
  
  if (error) {
    console.error('[v0] Failed to save interview-0 progress:', error)
    throw error
  }
}

/**
 * Get interview-0 progress for a user
 */
export async function getInterview0Progress(userId: string): Promise<Interview0Data | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('a3_interview_0_progress')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) {
    console.log('[v0] No interview-0 progress found for user')
    return null
  }
  
  return data
}

/**
 * Mark interview-0 as completed and award XP
 * TEMPORARY: XP award disabled for testing
 */
export async function completeInterview0(
  userId: string,
  finalScore: number
): Promise<void> {
  const supabase = await createClient()
  
  console.log('[v0] completeInterview0: Starting for user', userId.substring(0, 8), 'with score', finalScore)
  
  // Update interview-0 progress
  const { error: updateError } = await supabase
    .from('a3_interview_0_progress')
    .upsert({
      user_id: userId,
      final_score: finalScore,
      passed: finalScore >= 60,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })
  
  if (updateError) {
    console.error('[v0] Failed to update interview-0 progress:', updateError)
    throw updateError
  }
  console.log('[v0] Updated interview-0 progress record')
  
  // TEMPORARY: XP award disabled for testing core logic
  console.log('[v0] TEMPORARY: XP award disabled - skipping a3_user_progress update')
  
  console.log('[v0] completeInterview0: Finished successfully (XP disabled)')
}
