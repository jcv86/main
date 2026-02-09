import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Fetch all test analytics summaries
    const { data, error } = await supabase
      .from("test_analytics_summary")
      .select("*")
      .order("last_updated", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching analytics:", error)
      return NextResponse.json({ analytics: [] })
    }

    const analytics = (data || []).map((d) => ({
      testType: d.test_type,
      totalCompletions: d.total_completions,
      totalAttempts: d.total_attempts,
      avgDurationMinutes: d.avg_duration_minutes,
      completionRate: d.completion_rate_percentage,
      avgScore: d.avg_score,
      medianDuration: d.median_duration_minutes,
      p95Duration: d.p95_duration_minutes,
    }))

    return NextResponse.json({ analytics })
  } catch (e: any) {
    console.error("[v0] Exception in test-analytics:", e)
    return NextResponse.json(
      { error: e.message || "Internal server error", analytics: [] },
      { status: 500 },
    )
  }
}
