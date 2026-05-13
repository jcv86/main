import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get recent alerts (last 7 days)
    const { data: alerts, error } = await supabase
      .from("threshold_alerts")
      .select("*")
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) throw error

    // Get active (unacknowledged) alerts
    const activeAlerts = alerts.filter((a: any) => !a.acknowledged)

    // Get summary stats
    const summary = {
      total: alerts.length,
      active: activeAlerts.length,
      critical: activeAlerts.filter((a: any) => a.severity === "critical").length,
      warning: activeAlerts.filter((a: any) => a.severity === "warning").length,
      acknowledged: alerts.filter((a: any) => a.acknowledged).length,
    }

    return NextResponse.json({ alerts, activeAlerts, summary })
  } catch (error) {
    console.error("Error fetching threshold alerts:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}
