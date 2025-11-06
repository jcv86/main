import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Daily summary of coaching metrics
// Runs every day at 9 AM UTC
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()

  try {
    console.log("[v0] Starting daily metrics summary...")

    // Get yesterday's metrics
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split("T")[0]

    const { data: metrics, error } = await supabase
      .from("coaching_metrics")
      .select("*")
      .gte("created_at", `${yesterdayStr}T00:00:00`)
      .lt("created_at", `${yesterdayStr}T23:59:59`)

    if (error) throw error

    if (!metrics || metrics.length === 0) {
      console.log("[v0] No metrics found for yesterday")
      return NextResponse.json({ success: true, message: "No metrics to summarize" })
    }

    // Calculate summary statistics
    const totalSessions = metrics.length
    const avgSatisfaction = metrics.reduce((sum, m) => sum + m.satisfaction_rating, 0) / totalSessions
    const avgEngagement = metrics.reduce((sum, m) => sum + m.message_count, 0) / totalSessions
    const actionCompletionRate = metrics.filter((m) => m.action_completed).length / totalSessions

    const sofiaMetrics = metrics.filter((m) => m.coach_type === "sofia")
    const daniMetrics = metrics.filter((m) => m.coach_type === "dani")

    // Check if any metrics are below thresholds
    const alerts = []
    if (avgSatisfaction < 4.3) {
      alerts.push(`Satisfacción promedio baja: ${avgSatisfaction.toFixed(2)}/5`)
    }
    if (actionCompletionRate < 0.6) {
      alerts.push(`Tasa de acción completada baja: ${(actionCompletionRate * 100).toFixed(1)}%`)
    }
    if (avgEngagement < 2) {
      alerts.push(`Engagement promedio bajo: ${avgEngagement.toFixed(1)} mensajes`)
    }

    // Create notification if there are alerts
    if (alerts.length > 0) {
      await supabase.from("admin_notifications").insert({
        type: "daily_metrics_alert",
        title: "Alerta de Métricas Diarias",
        message: `Métricas del ${yesterdayStr}:\n${alerts.join("\n")}`,
        priority: "medium",
        action_url: "/admin/coaching-analytics",
      })
    }

    const summary = {
      date: yesterdayStr,
      total_sessions: totalSessions,
      avg_satisfaction: avgSatisfaction.toFixed(2),
      avg_engagement: avgEngagement.toFixed(1),
      action_completion_rate: (actionCompletionRate * 100).toFixed(1) + "%",
      sofia_sessions: sofiaMetrics.length,
      dani_sessions: daniMetrics.length,
      alerts: alerts.length,
    }

    console.log("[v0] Daily summary completed:", summary)

    return NextResponse.json({ success: true, summary })
  } catch (error: any) {
    console.error("[v0] Error in daily summary:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
