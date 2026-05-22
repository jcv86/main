import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { alertId, acknowledgedBy, resolutionNotes } = await request.json()

    if (!alertId) {
      return NextResponse.json({ error: "Alert ID is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("cron_job_alerts")
      .update({
        acknowledged: true,
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: acknowledgedBy || "admin",
        resolution_notes: resolutionNotes || null,
      })
      .eq("id", alertId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, alert: data })
  } catch (error: any) {
    console.error("[v0] Error acknowledging cron alert:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
