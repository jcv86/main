import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get latest strategic score
    const { data: scores, error: scoresError } = await supabase
      .from("a4_strategic_scores")
      .select("score, trend, level, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)

    if (scoresError) throw scoresError

    const latestScore = scores?.[0]

    // Get current signals (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    
    const { data: signals, error: signalsError } = await supabase
      .from("a4_signal_history")
      .select("signal_type, title, intensity, description")
      .eq("user_id", user.id)
      .gte("created_at", sevenDaysAgo)
      .order("created_at", { ascending: false })
      .limit(10)

    if (signalsError) throw signalsError

    return NextResponse.json({
      score: latestScore?.score || 0,
      trend: latestScore?.trend || "stable",
      level: latestScore?.level || "beginner",
      signals: signals || [],
      updated_at: latestScore?.created_at || new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error fetching A4 strategic score:", error)
    return NextResponse.json(
      { error: "Failed to fetch strategic score" },
      { status: 500 }
    )
  }
}
