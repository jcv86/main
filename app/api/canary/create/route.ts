import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { deployment_name, deployment_type, description, target_version, auto_rollback_enabled = true, stages } = body

    // Validate required fields
    if (!deployment_name || !deployment_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create deployment
    const { data: deployment, error: deploymentError } = await supabase
      .from("canary_deployments")
      .insert({
        deployment_name,
        deployment_type,
        description,
        target_version,
        current_stage: 0,
        current_traffic_percentage: 0,
        status: "pending",
        auto_rollback_enabled,
        created_by: "admin", // TODO: Get from auth
      })
      .select()
      .single()

    if (deploymentError) {
      console.error("Error creating deployment:", deploymentError)
      return NextResponse.json({ error: deploymentError.message }, { status: 500 })
    }

    // Create stages
    const defaultStages = stages || [
      { stage_number: 1, stage_name: "Canary", traffic_percentage: 5, duration_minutes: 30 },
      { stage_number: 2, stage_name: "Early Adopters", traffic_percentage: 25, duration_minutes: 60 },
      { stage_number: 3, stage_name: "Half Traffic", traffic_percentage: 50, duration_minutes: 120 },
      { stage_number: 4, stage_name: "Full Rollout", traffic_percentage: 100, duration_minutes: 60 },
    ]

    const stagesWithDeploymentId = defaultStages.map((stage) => ({
      ...stage,
      deployment_id: deployment.id,
    }))

    const { error: stagesError } = await supabase.from("canary_deployment_stages").insert(stagesWithDeploymentId)

    if (stagesError) {
      console.error("Error creating stages:", stagesError)
      // Rollback deployment creation
      await supabase.from("canary_deployments").delete().eq("id", deployment.id)
      return NextResponse.json({ error: stagesError.message }, { status: 500 })
    }

    // Log event
    await supabase.from("canary_deployment_events").insert({
      deployment_id: deployment.id,
      event_type: "deployment_created",
      event_data: { deployment_name, deployment_type },
      created_by: "admin",
    })

    return NextResponse.json({
      success: true,
      deployment,
    })
  } catch (error: any) {
    console.error("Error in canary create API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
