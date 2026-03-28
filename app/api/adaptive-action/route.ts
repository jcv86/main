import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { AdaptiveLearningBlueprint } from "@/lib/adaptive-learning/blueprint"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Gather user data for profile calculation
    const [sessionsResult, metricsResult, testsResult] = await Promise.all([
      supabase
        .from("coaching_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),

      supabase.from("coaching_metrics").select("*").eq("user_id", user.id),

      supabase.from("test_results").select("*").eq("user_id", user.id),
    ])

    const userData = {
      sessions: sessionsResult.data || [],
      metrics: metricsResult.data || [],
      testResults: parseTestResults(testsResult.data || []),
      avgEngagement: calculateAvgEngagement(metricsResult.data || []),
      completedActions: metricsResult.data?.filter((m) => m.action_completed).length || 0,
      lastActive: sessionsResult.data?.[0]?.created_at || new Date(),
    }

    // Calculate dynamic profile
    const profile = AdaptiveLearningBlueprint.calculateProfile(user.id, userData)

    // Decide next action
    const nextAction = AdaptiveLearningBlueprint.decideNextAction(profile)

    return NextResponse.json({
      profile,
      nextAction,
      success: true,
    })
  } catch (error) {
    console.error("[v0] Error in adaptive action:", error)
    return NextResponse.json({ error: "Failed to generate adaptive action" }, { status: 500 })
  }
}

function parseTestResults(results: any[]) {
  const parsed: any = {}

  results.forEach((result) => {
    if (result.test_type === "mbti") parsed.mbti = result.result
    if (result.test_type === "disc") parsed.disc = result.result
    if (result.test_type === "big_five") parsed.bigFive = result.result
    if (result.test_type === "riasec") parsed.riasec = result.result
    if (result.test_type === "soft_skills") parsed.softSkills = result.result
  })

  return parsed
}

function calculateAvgEngagement(metrics: any[]) {
  if (metrics.length === 0) return 0
  const total = metrics.reduce((sum, m) => sum + (m.engagement_score || 0), 0)
  return total / metrics.length
}
