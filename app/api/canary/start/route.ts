import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { deployment_id } = body

    if (!deployment_id) {
      return NextResponse.json({ error: "Missing deployment_id" }, { status: 400 })
    }

    // Update deployment to in_progress and move to first stage
    const { data: deployment, error: updateError } = await supabase
      .from("canary_deployments")
      .update({
        status: "in_progress",
        current_stage: 1,
        started_at: new Date().toISOString(),
      })
      .eq("id", deployment_id)
      .select()
      .single()

    if (updateError) {
      console.error("Error starting deployment:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Get first stage
    const { data: firstStage } = await supabase
      .from("canary_deployment_stages")
      .select("*")
      .eq("deployment_id", deployment_id)
      .eq("stage_number", 1)
      .single()

    if (firstStage) {
      // Update traffic percentage to first stage
      await supabase
        .from("canary_deployments")
        .update({
          current_traffic_percentage: firstStage.traffic_percentage,
        })
        .eq("id", deployment_id)
    }

    // Log event
    await supabase.from("canary_deployment_events").insert({
      deployment_id,
      event_type: "deployment_started",
      event_data: { stage: 1 },
      created_by: "admin",
    })

    return NextResponse.json({
      success: true,
      deployment,
    })
  } catch (error: any) {
    console.error("Error in canary start API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
