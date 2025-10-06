import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export interface LearningPath {
  id: number
  title: string
  description: string
  category: string
  difficulty_level: "beginner" | "intermediate" | "advanced" | "expert"
  estimated_hours: number
  skills_covered: string[]
  prerequisites: string[]
  target_roles: string[]
  completion_rate: number
  popularity_score: number
}

export interface LearningPathStep {
  id: number
  path_id: number
  step_order: number
  title: string
  description: string
  content_type: "book" | "web_resource" | "exercise" | "assessment" | "reflection"
  content_id: number
  estimated_minutes: number
  is_required: boolean
  unlock_criteria: any
}

export interface UserPathProgress {
  id: number
  user_email: string
  path_id: number
  current_step: number
  completed_steps: number[]
  status: "not_started" | "in_progress" | "paused" | "completed"
  completion_percentage: number
  streak_days: number
  total_time_minutes: number
  last_activity_at: string
}

export interface SkillGap {
  skill_name: string
  current_level: number
  target_level: number
  gap_size: number
  priority_score: number
}

export interface PathRecommendation {
  path_id: number
  title: string
  match_score: number
  reason: string
}

/**
 * Get recommended learning paths for user (LinkedIn Learning style)
 */
export async function getRecommendedPaths(userEmail: string, limit = 5): Promise<PathRecommendation[]> {
  try {
    const { data, error } = await supabase.rpc("recommend_learning_paths", {
      p_user_email: userEmail,
      p_limit: limit,
    })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting recommended paths:", error)
    return []
  }
}

/**
 * Calculate user's skill gaps (BetterUp style)
 */
export async function calculateSkillGaps(userEmail: string): Promise<SkillGap[]> {
  try {
    const { data, error } = await supabase.rpc("calculate_skill_gap_score", {
      p_user_email: userEmail,
    })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error calculating skill gaps:", error)
    return []
  }
}

/**
 * Get user's learning path progress
 */
export async function getUserPathProgress(userEmail: string): Promise<UserPathProgress[]> {
  try {
    const { data, error } = await supabase
      .from("user_learning_path_progress")
      .select("*")
      .eq("user_email", userEmail)
      .order("last_activity_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting user path progress:", error)
    return []
  }
}

/**
 * Start a learning path
 */
export async function startLearningPath(userEmail: string, pathId: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("user_learning_path_progress").upsert(
      {
        user_email: userEmail,
        path_id: pathId,
        status: "in_progress",
        started_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString(),
        current_step: 1,
      },
      {
        onConflict: "user_email,path_id",
      },
    )

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error starting learning path:", error)
    return false
  }
}

/**
 * Update learning progress and streak
 */
export async function updateLearningProgress(
  userEmail: string,
  pathId: number,
  stepId: number,
  timeSpent: number,
): Promise<number> {
  try {
    // Get current progress
    const { data: progress } = await supabase
      .from("user_learning_path_progress")
      .select("*")
      .eq("user_email", userEmail)
      .eq("path_id", pathId)
      .single()

    if (!progress) return 0

    // Add step to completed steps
    const completedSteps = [...new Set([...(progress.completed_steps || []), stepId])]

    // Get total steps for this path
    const { data: steps } = await supabase.from("learning_path_steps").select("id").eq("path_id", pathId)

    const totalSteps = steps?.length || 1
    const completionPercentage = (completedSteps.length / totalSteps) * 100

    // Update progress
    await supabase
      .from("user_learning_path_progress")
      .update({
        completed_steps: completedSteps,
        current_step: Math.min(progress.current_step + 1, totalSteps),
        completion_percentage: completionPercentage,
        total_time_minutes: (progress.total_time_minutes || 0) + timeSpent,
        last_activity_at: new Date().toISOString(),
        status: completionPercentage >= 100 ? "completed" : "in_progress",
        completed_at: completionPercentage >= 100 ? new Date().toISOString() : null,
      })
      .eq("user_email", userEmail)
      .eq("path_id", pathId)

    // Update streak
    const { data: streak } = await supabase.rpc("update_learning_streak", {
      p_user_email: userEmail,
      p_path_id: pathId,
    })

    return streak || 0
  } catch (error) {
    console.error("Error updating learning progress:", error)
    return 0
  }
}

/**
 * Get due spaced repetition items
 */
export async function getDueRepetitions(userEmail: string, limit = 10) {
  try {
    const { data, error } = await supabase.rpc("get_due_repetitions", {
      p_user_email: userEmail,
      p_limit: limit,
    })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting due repetitions:", error)
    return []
  }
}

/**
 * Process spaced repetition response (SuperMemo 2 algorithm)
 */
export async function processRepetitionResponse(
  userEmail: string,
  itemId: number,
  quality: number, // 0-5 scale (0 = complete blackout, 5 = perfect response)
): Promise<boolean> {
  try {
    const { data: item } = await supabase.from("spaced_repetition_items").select("*").eq("id", itemId).single()

    if (!item) return false

    // SuperMemo 2 algorithm
    let newEaseFactor = item.ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    if (newEaseFactor < 1.3) newEaseFactor = 1.3

    let newInterval: number
    let newRepetitions: number

    if (quality < 3) {
      // Failed: Reset
      newInterval = 1
      newRepetitions = 0
    } else {
      newRepetitions = item.repetitions + 1
      if (newRepetitions === 1) {
        newInterval = 1
      } else if (newRepetitions === 2) {
        newInterval = 6
      } else {
        newInterval = Math.round(item.interval_days * newEaseFactor)
      }
    }

    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval)

    // Update item
    const qualityResponses = [...(item.quality_responses || []), quality]

    await supabase
      .from("spaced_repetition_items")
      .update({
        ease_factor: newEaseFactor,
        interval_days: newInterval,
        repetitions: newRepetitions,
        next_review_date: nextReviewDate.toISOString().split("T")[0],
        last_reviewed_at: new Date().toISOString(),
        quality_responses: qualityResponses,
      })
      .eq("id", itemId)

    return true
  } catch (error) {
    console.error("Error processing repetition response:", error)
    return false
  }
}

/**
 * Add item to spaced repetition system
 */
export async function addToSpacedRepetition(
  userEmail: string,
  contentId: number,
  contentType: string,
  conceptSummary: string,
): Promise<boolean> {
  try {
    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + 1) // Review tomorrow

    const { error } = await supabase.from("spaced_repetition_items").upsert(
      {
        user_email: userEmail,
        content_id: contentId,
        content_type: contentType,
        concept_summary: conceptSummary,
        next_review_date: nextReviewDate.toISOString().split("T")[0],
      },
      {
        onConflict: "user_email,content_id,content_type",
      },
    )

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error adding to spaced repetition:", error)
    return false
  }
}

/**
 * Get user percentile for skill (peer benchmarking)
 */
export async function getUserPercentile(
  skillName: string,
  userScore: number,
  industry?: string,
  experience?: string,
): Promise<number | null> {
  try {
    const { data, error } = await supabase.rpc("get_user_percentile", {
      p_skill_name: skillName,
      p_user_score: userScore,
      p_industry: industry || null,
      p_experience: experience || null,
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting user percentile:", error)
    return null
  }
}

/**
 * Create skill assessment
 */
export async function createSkillAssessment(
  userEmail: string,
  skillName: string,
  currentLevel: number,
  targetLevel: number,
  importance: "low" | "medium" | "high" | "critical",
): Promise<boolean> {
  try {
    const nextReviewDate = new Date()
    nextReviewDate.setMonth(nextReviewDate.getMonth() + 3) // Review quarterly

    const { error } = await supabase.from("user_skill_assessments").insert({
      user_email: userEmail,
      skill_name: skillName,
      current_level: currentLevel,
      target_level: targetLevel,
      importance,
      next_review_date: nextReviewDate.toISOString().split("T")[0],
    })

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error creating skill assessment:", error)
    return false
  }
}
