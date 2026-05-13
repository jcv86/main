import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { deployment_id } = await request.json()

    // Obtener el deployment actual
    const { data: deployment, error: fetchError } = await supabase
      .from("canary_deployments")
      .select("*, stages:canary_deployment_stages(*)")
      .eq("id", deployment_id)
      .single()

    if (fetchError) throw fetchError

    const nextStage = deployment.current_stage + 1

    if (nextStage > deployment.total_stages) {
      // Completar el deployment
      const { error: completeError } = await supabase
        .from("canary_deployments")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          traffic_percentage: 100,
        })
        .eq("id", deployment_id)

      if (completeError) throw completeError

      return NextResponse.json({ success: true, completed: true })
    }

    // Avanzar a la siguiente etapa
    const stage = deployment.stages.find((s: any) => s.stage_number === nextStage)

    const { error: updateError } = await supabase
      .from("canary_deployments")
      .update({
        current_stage: nextStage,
        traffic_percentage: stage.traffic_percentage,
        status: "in_progress",
        started_at: deployment.started_at || new Date().toISOString(),
      })
      .eq("id", deployment_id)

    if (updateError) throw updateError

    // Actualizar la etapa
    const { error: stageError } = await supabase
      .from("canary_deployment_stages")
      .update({
        status: "active",
        started_at: new Date().toISOString(),
      })
      .eq("id", stage.id)

    if (stageError) throw stageError

    return NextResponse.json({ success: true, stage: nextStage })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
