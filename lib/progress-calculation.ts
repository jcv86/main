import { createClient } from '@/lib/supabase/server'

/**
 * Calculates overall user progress based on multiple weighted components:
 * - Module completion (35%)
 * - Interview completion (30%)
 * - Training completion (20%)
 * - Average interview score (15%)
 */
export async function calculateProgressPercentage(userId: string): Promise<number> {
  try {
    const supabase = await createClient()

    // Get all required data in parallel for efficiency
    const [modulesData, interviewsData, trainingData] = await Promise.all([
      // Module progress data
      supabase
        .from('a4_module_progress')
        .select('completado, progreso_porcentaje')
        .eq('user_id', userId),
      
      // Interview completion and scores
      supabase
        .from('a3_user_entrevistas')
        .select('score_total')
        .eq('user_id', userId),
      
      // Training assignments
      supabase
        .from('a3_training_assignments')
        .select('completed_at')
        .eq('user_id', userId),
    ])

    // Calculate module progress (35%)
    const modules = modulesData.data || []
    const totalModules = modules.length
    const completedModules = modules.filter((m) => m.completado === true).length
    const moduleProgress = totalModules > 0 ? completedModules / totalModules : 0

    // Calculate interview progress (30%)
    const interviews = interviewsData.data || []
    const targetInterviews = 10 // Target number of interviews
    const interviewProgress = Math.min(interviews.length / targetInterviews, 1)

    // Calculate average interview score (15%)
    const avgInterviewScore =
      interviews.length > 0
        ? interviews.reduce((sum, iv) => sum + (iv.score_total || 0), 0) / interviews.length / 100
        : 0

    // Calculate training progress (20%)
    const trainings = trainingData.data || []
    const completedTrainings = trainings.filter((t) => t.completed_at !== null).length
    const targetTrainings = 5 // Target number of trainings
    const trainingProgress = Math.min(completedTrainings / targetTrainings, 1)

    // Apply weighted calculation
    const overallProgress =
      moduleProgress * 0.35 +
      interviewProgress * 0.3 +
      trainingProgress * 0.2 +
      avgInterviewScore * 0.15

    // Return as percentage (0-100)
    return Math.round(overallProgress * 100)
  } catch (error) {
    console.error('[v0] Error calculating progress:', error)
    return 0
  }
}

/**
 * Saves the calculated progress to database for persistence
 */
export async function syncProgressToDatabase(userId: string, percentage: number): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('a3_user_progreso')
      .update({
        progreso_porcentaje: percentage,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (error) {
      console.error('[v0] Error syncing progress to database:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('[v0] Error in syncProgressToDatabase:', error)
    return false
  }
}
