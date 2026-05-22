import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { name, version, description, deployment_type, auto_rollback_enabled } = body

    // Crear el deployment
    const { data: deployment, error: deploymentError } = await supabase
      .from("canary_deployments")
      .insert({
        name,
        version,
        description,
        deployment_type: deployment_type || "canary",
        auto_rollback_enabled: auto_rollback_enabled !== false,
        status: "pending",
        current_stage: 0,
        total_stages: 4,
        traffic_percentage: 0,
      })
      .select()
      .single()

    if (deploymentError) throw deploymentError

    // Crear las etapas predefinidas (5%, 25%, 50%, 100%)
    const stages = [
      { stage_number: 1, traffic_percentage: 5 },
      { stage_number: 2, traffic_percentage: 25 },
      { stage_number: 3, traffic_percentage: 50 },
      { stage_number: 4, traffic_percentage: 100 },
    ]

    const { error: stagesError } = await supabase.from("canary_deployment_stages").insert(
      stages.map((stage) => ({
        deployment_id: deployment.id,
        ...stage,
        status: "pending",
      })),
    )

    if (stagesError) throw stagesError

    return NextResponse.json({ success: true, deployment })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
