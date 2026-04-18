import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { alertId, acknowledgedBy, resolutionNotes } = await request.json()

    if (!alertId) {
      return NextResponse.json({ error: "Alert ID is required" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

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
