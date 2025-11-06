import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch real metrics from database
    const [coachingMetrics, promptMetrics, testMetrics] = await Promise.all([
      supabase.from("coaching_metrics").select("*"),
      supabase.from("prompt_performance").select("*"),
      supabase.from("test_results").select("*"),
    ])

    // Calculate KPIs based on real data
    const kpis = calculateKPIs({
      coaching: coachingMetrics.data || [],
      prompts: promptMetrics.data || [],
      tests: testMetrics.data || [],
    })

    return NextResponse.json({ kpis, success: true })
  } catch (error) {
    console.error("[v0] Error fetching KPI metrics:", error)
    return NextResponse.json({ error: "Failed to fetch KPI metrics" }, { status: 500 })
  }
}

function calculateKPIs(data: any) {
  const { coaching, prompts } = data

  // Calculate Sofia & Dani metrics
  const avgSatisfaction =
    coaching.length > 0
      ? coaching.reduce((sum: number, m: any) => sum + (m.satisfaction_rating || 0), 0) / coaching.length
      : 0

  const avgEngagement =
    coaching.length > 0 ? (coaching.filter((m: any) => m.engagement_score >= 0.7).length / coaching.length) * 100 : 0

  const actionCompleted =
    coaching.length > 0 ? (coaching.filter((m: any) => m.action_completed).length / coaching.length) * 100 : 0

  return [
    {
      chapter: "3",
      title: "Sofia & Dani",
      metrics: [
        {
          name: "Engagement",
          current: Math.round(avgEngagement),
          target: 76,
          unit: "%",
          status: avgEngagement >= 76 ? "success" : "warning",
        },
        {
          name: "Satisfacción",
          current: Number.parseFloat(avgSatisfaction.toFixed(1)),
          target: 4.7,
          unit: "★",
          status: avgSatisfaction >= 4.7 ? "success" : "warning",
        },
        {
          name: "Acción Completada",
          current: Math.round(actionCompleted),
          target: 68,
          unit: "%",
          status: actionCompleted >= 68 ? "success" : "warning",
        },
      ],
    },
  ]
}
