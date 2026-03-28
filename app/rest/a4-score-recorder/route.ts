import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { score, source, metadata } = await request.json()

    if (typeof score !== 'number' || score < 0 || score > 100) {
      return NextResponse.json({ error: "Invalid score" }, { status: 400 })
    }

    // Calculate trend by comparing with previous score
    const { data: previousScores } = await supabase
      .from("a4_strategic_scores")
      .select("score")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)

    const previousScore = previousScores?.[0]?.score || 50
    let trend = "stable"
    if (score > previousScore + 5) trend = "increasing"
    else if (score < previousScore - 5) trend = "decreasing"

    // Determine level based on score
    let level = "beginner"
    if (score >= 30 && score < 60) level = "intermediate"
    else if (score >= 60 && score < 85) level = "advanced"
    else if (score >= 85) level = "expert"

    // Insert new score
    const { data: newScore, error: scoreError } = await supabase
      .from("a4_strategic_scores")
      .insert({
        user_id: user.id,
        score,
        source,
        trend,
        level,
        metadata,
        created_at: new Date().toISOString(),
      })
      .select()

    if (scoreError) throw scoreError

    return NextResponse.json({
      success: true,
      score: newScore?.[0],
      trend,
      level,
    })
  } catch (error) {
    console.error("[v0] Error recording A4 score:", error)
    return NextResponse.json(
      { error: "Failed to record score" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get score history for last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    
    const { data: scores, error: scoresError } = await supabase
      .from("a4_strategic_scores")
      .select("score, trend, level, created_at, source")
      .eq("user_id", user.id)
      .gte("created_at", thirtyDaysAgo)
      .order("created_at", { ascending: false })

    if (scoresError) throw scoresError

    // Calculate statistics
    const scoreValues = scores?.map(s => s.score) || []
    const avgScore = scoreValues.length > 0 ? scoreValues.reduce((a, b) => a + b) / scoreValues.length : 0
    const maxScore = Math.max(...scoreValues, 0)
    const minScore = Math.min(...scoreValues, 100)
    const currentScore = scores?.[0]?.score || 0
    const currentLevel = scores?.[0]?.level || "beginner"

    return NextResponse.json({
      current: {
        score: currentScore,
        level: currentLevel,
        trend: scores?.[0]?.trend || "stable",
      },
      statistics: {
        average: Math.round(avgScore),
        max: maxScore,
        min: minScore,
        dataPoints: scoreValues.length,
      },
      history: scores?.slice(0, 14) || [], // Last 2 weeks for chart
    })
  } catch (error) {
    console.error("[v0] Error fetching A4 score history:", error)
    return NextResponse.json(
      { error: "Failed to fetch score history" },
      { status: 500 }
    )
  }
}
