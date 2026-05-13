import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { deployment_id, reason } = await request.json()

    // Marcar el deployment como rolled back
    const { error: updateError } = await supabase
      .from("canary_deployments")
      .update({
        status: "rolled_back",
        completed_at: new Date().toISOString(),
        traffic_percentage: 0,
      })
      .eq("id", deployment_id)

    if (updateError) throw updateError

    // Marcar todas las etapas activas como failed
    const { error: stagesError } = await supabase
      .from("canary_deployment_stages")
      .update({
        status: "failed",
        rollback_triggered: true,
        completed_at: new Date().toISOString(),
      })
      .eq("deployment_id", deployment_id)
      .eq("status", "active")

    if (stagesError) throw stagesError

    return NextResponse.json({ success: true, reason })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
