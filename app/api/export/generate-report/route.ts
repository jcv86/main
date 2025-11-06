import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { startDate, endDate, includeCharts } = await request.json()

    const supabase = await createClient()

    // Fetch metrics data
    let query = supabase.from("coaching_metrics").select("*").order("created_at", { ascending: false })

    if (startDate) {
      query = query.gte("created_at", startDate)
    }
    if (endDate) {
      query = query.lte("created_at", endDate)
    }

    const { data: metrics, error } = await query

    if (error) throw error

    // Calculate summary statistics
    const totalSessions = metrics?.length || 0
    const avgSatisfaction =
      totalSessions > 0
        ? (metrics!.reduce((sum, m) => sum + (m.satisfaction_rating || 0), 0) / totalSessions).toFixed(2)
        : "0"
    const avgEngagement =
      totalSessions > 0
        ? (metrics!.reduce((sum, m) => sum + (m.message_count || 0), 0) / totalSessions).toFixed(2)
        : "0"
    const actionRate =
      totalSessions > 0 ? ((metrics!.filter((m) => m.action_completed).length / totalSessions) * 100).toFixed(1) : "0"

    // Group by coach
    const sofiaMetrics = metrics?.filter((m) => m.coach_type === "sofia") || []
    const daniMetrics = metrics?.filter((m) => m.coach_type === "dani") || []

    const report = {
      generatedAt: new Date().toISOString(),
      period: {
        start: startDate || "All time",
        end: endDate || "Present",
      },
      summary: {
        totalSessions,
        avgSatisfaction: Number.parseFloat(avgSatisfaction),
        avgEngagement: Number.parseFloat(avgEngagement),
        actionCompletionRate: Number.parseFloat(actionRate),
      },
      byCoach: {
        sofia: {
          sessions: sofiaMetrics.length,
          avgSatisfaction:
            sofiaMetrics.length > 0
              ? (sofiaMetrics.reduce((sum, m) => sum + (m.satisfaction_rating || 0), 0) / sofiaMetrics.length).toFixed(
                  2,
                )
              : "0",
          avgEngagement:
            sofiaMetrics.length > 0
              ? (sofiaMetrics.reduce((sum, m) => sum + (m.message_count || 0), 0) / sofiaMetrics.length).toFixed(2)
              : "0",
          actionRate:
            sofiaMetrics.length > 0
              ? ((sofiaMetrics.filter((m) => m.action_completed).length / sofiaMetrics.length) * 100).toFixed(1)
              : "0",
        },
        dani: {
          sessions: daniMetrics.length,
          avgSatisfaction:
            daniMetrics.length > 0
              ? (daniMetrics.reduce((sum, m) => sum + (m.satisfaction_rating || 0), 0) / daniMetrics.length).toFixed(2)
              : "0",
          avgEngagement:
            daniMetrics.length > 0
              ? (daniMetrics.reduce((sum, m) => sum + (m.message_count || 0), 0) / daniMetrics.length).toFixed(2)
              : "0",
          actionRate:
            daniMetrics.length > 0
              ? ((daniMetrics.filter((m) => m.action_completed).length / daniMetrics.length) * 100).toFixed(1)
              : "0",
        },
      },
      criticalPrompts: {
        lowSatisfaction: metrics?.filter((m) => (m.satisfaction_rating || 0) < 4.3).length || 0,
        lowEngagement: metrics?.filter((m) => (m.message_count || 0) < 2).length || 0,
        lowActionRate: metrics?.filter((m) => !m.action_completed).length || 0,
      },
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error generating report:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
