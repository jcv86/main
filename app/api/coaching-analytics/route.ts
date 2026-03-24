import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const range = searchParams.get("range") || "7d"

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    switch (range) {
      case "24h":
        startDate.setHours(now.getHours() - 24)
        break
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
    }

    const supabase = await createClient()

    // Fetch all metrics within date range
    const { data: metrics, error } = await supabase
      .from("coaching_metrics")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching metrics:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!metrics || metrics.length === 0) {
      return NextResponse.json({
        aggregates: {
          totalSessions: 0,
          avgEngagement: 0,
          avgSatisfaction: 0,
          actionsCompleted: 0,
          completionRate: 0,
          meetsEngagementTarget: false,
          meetsSatisfactionTarget: false,
          meetsActionTarget: false,
        },
        byCoach: {
          sofia: { totalSessions: 0, avgSatisfaction: 0, avgEngagement: 0, completionRate: 0 },
          dani: { totalSessions: 0, avgSatisfaction: 0, avgEngagement: 0, completionRate: 0 },
        },
        byCategory: [],
        criticalPrompts: [],
        trends: [],
      })
    }

    // Calculate aggregates
    const totalSessions = metrics.length
    const avgEngagement = metrics.reduce((sum, m) => sum + (m.message_count || 0), 0) / totalSessions
    const avgSatisfaction = metrics.reduce((sum, m) => sum + (m.satisfaction_rating || 0), 0) / totalSessions
    const actionsCompleted = metrics.filter((m) => m.action_completed).length
    const completionRate = (actionsCompleted / totalSessions) * 100

    const aggregates = {
      totalSessions,
      avgEngagement,
      avgSatisfaction,
      actionsCompleted,
      completionRate,
      meetsEngagementTarget: avgEngagement >= 2,
      meetsSatisfactionTarget: avgSatisfaction >= 4.0,
      meetsActionTarget: completionRate >= 60,
    }

    // Calculate by coach
    const sofiaMetrics = metrics.filter((m) => m.coach_type === "sofia")
    const daniMetrics = metrics.filter((m) => m.coach_type === "dani")

    const byCoach = {
      sofia: {
        totalSessions: sofiaMetrics.length,
        avgSatisfaction:
          sofiaMetrics.length > 0
            ? sofiaMetrics.reduce((sum, m) => sum + (m.satisfaction_rating || 0), 0) / sofiaMetrics.length
            : 0,
        avgEngagement:
          sofiaMetrics.length > 0
            ? sofiaMetrics.reduce((sum, m) => sum + (m.message_count || 0), 0) / sofiaMetrics.length
            : 0,
        completionRate:
          sofiaMetrics.length > 0
            ? (sofiaMetrics.filter((m) => m.action_completed).length / sofiaMetrics.length) * 100
            : 0,
      },
      dani: {
        totalSessions: daniMetrics.length,
        avgSatisfaction:
          daniMetrics.length > 0
            ? daniMetrics.reduce((sum, m) => sum + (m.satisfaction_rating || 0), 0) / daniMetrics.length
            : 0,
        avgEngagement:
          daniMetrics.length > 0
            ? daniMetrics.reduce((sum, m) => sum + (m.message_count || 0), 0) / daniMetrics.length
            : 0,
        completionRate:
          daniMetrics.length > 0
            ? (daniMetrics.filter((m) => m.action_completed).length / daniMetrics.length) * 100
            : 0,
      },
    }

    // Calculate by category
    const categories = [...new Set(metrics.map((m: { conversation_category?: string }) => m.conversation_category))]
    const byCategory = categories.map((category: string | undefined) => {
      const categoryMetrics = metrics.filter((m: { conversation_category?: string }) => m.conversation_category === category)
      return {
        category,
        sessions: categoryMetrics.length,
        avgSatisfaction:
          categoryMetrics.reduce((sum: number, m: { satisfaction_rating?: number }) => sum + (m.satisfaction_rating || 0), 0) / categoryMetrics.length,
        avgEngagement: categoryMetrics.reduce((sum: number, m: { message_count?: number }) => sum + (m.message_count || 0), 0) / categoryMetrics.length,
        completionRate: (categoryMetrics.filter((m: { action_completed?: boolean }) => m.action_completed).length / categoryMetrics.length) * 100,
      }
    })

    // Identify critical prompts (satisfaction < 4.3, action < 60%, engagement < 70%)
    const criticalPrompts = byCategory
      .map((cat: { sessions: number; avgSatisfaction: number; completionRate: number; avgEngagement: number; category?: string }) => {
        const issues = []
        if (cat.avgSatisfaction < 4.3) issues.push(`Satisfacción baja: ${cat.avgSatisfaction.toFixed(1)}★ (meta: 4.3+)`)
        if (cat.completionRate < 60)
          issues.push(`Tasa de completación baja: ${cat.completionRate.toFixed(0)}% (meta: 60%+)`)
        if (cat.avgEngagement < 2) issues.push(`Engagement bajo: ${cat.avgEngagement.toFixed(1)} mensajes (meta: 2+)`)

        if (issues.length > 0) {
          const categoryMetrics = metrics.filter((m) => m.conversation_category === cat.category)
          const coach = categoryMetrics[0]?.coach_type || "unknown"
          return {
            category: cat.category,
            coach,
            sessions: cat.sessions,
            avgSatisfaction: cat.avgSatisfaction,
            avgEngagement: cat.avgEngagement,
            completionRate: cat.completionRate,
            issues,
          }
        }
        return null
      })
      .filter(Boolean)

    // Calculate trends (group by date)
    const trendMap = new Map()
    metrics.forEach((m) => {
      const date = new Date(m.created_at).toISOString().split("T")[0]
      if (!trendMap.has(date)) {
        trendMap.set(date, [])
      }
      trendMap.get(date).push(m)
    })

    const trends = Array.from(trendMap.entries()).map(([date, dayMetrics]: [string, unknown[]]) => ({
      date,
      satisfaction: (dayMetrics as Array<{ satisfaction_rating?: number }>).reduce((sum: number, m) => sum + (m.satisfaction_rating || 0), 0) / dayMetrics.length,
      engagement: (dayMetrics as Array<{ message_count?: number }>).reduce((sum: number, m) => sum + (m.message_count || 0), 0) / dayMetrics.length,
      completionRate: ((dayMetrics as Array<{ action_completed?: boolean }>).filter((m) => m.action_completed).length / dayMetrics.length) * 100,
    }))

    return NextResponse.json({
      aggregates,
      byCoach,
      byCategory,
      criticalPrompts,
      trends,
    })
  } catch (error) {
    console.error("[v0] Error in coaching analytics:", error)
    return NextResponse.json({ error: "Error fetching analytics" }, { status: 500 })
  }
}
