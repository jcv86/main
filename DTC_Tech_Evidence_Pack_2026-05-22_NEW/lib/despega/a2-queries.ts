import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

// Get A2 intermediate content for user
export async function getA2Content(userId: string, category?: string) {
  let query = supabase
    .from("despega_a2_content")
    .select("*")
    .eq("user_level", "intermedio")

  if (category) {
    query = query.eq("category", category)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

// Get skill gap analysis
export async function getSkillGapAnalysis(userId: string, a1Results: any) {
  // Calculate gaps based on A1 scores
  const gaps = {
    energia: Math.max(0, 100 - (a1Results.score_energia || 0)),
    enfoque: Math.max(0, 100 - (a1Results.score_enfoque || 0)),
    relaciones: Math.max(0, 100 - (a1Results.score_relaciones || 0)),
    plan_ejecutivo: Math.max(0, 100 - (a1Results.score_plan_ejecutivo || 0))
  }

  return gaps
}

// Get smart recommendations based on profile
export async function getSmartRecommendations(
  userId: string,
  a1Results: any,
  completedA3?: string[],
  completedA4?: string[]
) {
  try {
    const { data: profile } = await supabase
      .from("despega_user_profiles")
      .select("*")
      .eq("id", userId)
      .single()

    const { data: recommendations } = await supabase
      .from("despega_a2_recommendations")
      .select("*")
      .eq("user_id", userId)
      .order("priority", { ascending: false })

    return recommendations || []
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return []
  }
}

// Get transition content between pillars
export async function getTransitionContent(
  fromPillar: string,
  toPillar: string
) {
  try {
    const { data } = await supabase
      .from("despega_pillar_transitions")
      .select("*")
      .eq("from_pillar", fromPillar)
      .eq("to_pillar", toPillar)
      .single()

    return data
  } catch (error) {
    console.error("Error fetching transition content:", error)
    return null
  }
}

// Save skill gap assessment
export async function saveSkillGapAssessment(
  userId: string,
  a1ResultsId: string,
  gapAnalysis: Record<string, any>
) {
  const { error } = await supabase
    .from("despega_skill_gaps")
    .insert([
      {
        user_id: userId,
        a1_results_id: a1ResultsId,
        gap_analysis: gapAnalysis,
        created_at: new Date().toISOString()
      }
    ])

  if (error) throw error
}

// Get learning path recommendations
export async function getLearningPath(userId: string) {
  try {
    const { data } = await supabase
      .from("despega_learning_paths")
      .select("*")
      .eq("user_id", userId)
      .order("sequence", { ascending: true })

    return data || []
  } catch (error) {
    console.error("Error fetching learning path:", error)
    return []
  }
}

// Update user progression through pillars
export async function updatePillarProgression(
  userId: string,
  pillar: string,
  progress: number
) {
  const { error } = await supabase
    .from("despega_pilar_progress")
    .upsert(
      {
        user_id: userId,
        pilar: pillar,
        progreso: progress,
        updated_at: new Date().toISOString()
      },
      { onConflict: "user_id,pilar" }
    )

  if (error) throw error
}

// Get A2 assessment results
export async function getA2Assessment(userId: string) {
  try {
    const { data } = await supabase
      .from("despega_a2_assessments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    return data
  } catch (error) {
    console.error("Error fetching A2 assessment:", error)
    return null
  }
}

// Save A2 assessment
export async function saveA2Assessment(
  userId: string,
  assessmentData: Record<string, any>
) {
  const { error } = await supabase
    .from("despega_a2_assessments")
    .insert([
      {
        user_id: userId,
        assessment_data: assessmentData,
        created_at: new Date().toISOString()
      }
    ])

  if (error) throw error
}
