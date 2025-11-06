import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const searchParams = request.nextUrl.searchParams
    const days = Number.parseInt(searchParams.get("days") || "30")

    // Get critical prompts based on thresholds from document
    const { data: criticalMetrics, error } = await supabase
      .from("coaching_metrics")
      .select(`
        *,
        coaching_sessions (
          id,
          user_id,
          coach_type,
          conversation_category,
          created_at,
          updated_at
        )
      `)
      .gte("created_at", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .or("satisfaction_rating.lt.4.3,engagement_percentage.lt.70,action_completion_percentage.lt.60")
      .order("created_at", { ascending: false })

    if (error) throw error

    // Group by issue type
    const criticalByType = {
      low_satisfaction: criticalMetrics?.filter((m) => (m.satisfaction_rating || 0) < 4.3) || [],
      low_engagement: criticalMetrics?.filter((m) => (m.engagement_percentage || 0) < 70) || [],
      low_action: criticalMetrics?.filter((m) => (m.action_completion_percentage || 0) < 60) || [],
    }

    // Get conversation logs for critical sessions
    const sessionIds = criticalMetrics?.map((m) => m.session_id) || []

    const { data: conversations, error: convError } = await supabase
      .from("coaching_sessions")
      .select("*")
      .in("id", sessionIds)

    if (convError) throw convError

    return NextResponse.json({
      summary: {
        total_critical: criticalMetrics?.length || 0,
        low_satisfaction_count: criticalByType.low_satisfaction.length,
        low_engagement_count: criticalByType.low_engagement.length,
        low_action_count: criticalByType.low_action.length,
      },
      critical_by_type: criticalByType,
      conversations: conversations || [],
    })
  } catch (error: any) {
    console.error("[v0] Error fetching critical prompts:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch critical prompts" }, { status: 500 })
  }
}
