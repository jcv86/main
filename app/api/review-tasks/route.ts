import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "pending"
    const severity = searchParams.get("severity")

    const supabase = await createClient()

    let query = supabase.from("pending_review_tasks").select("*")

    if (status !== "all") {
      query = query.eq("status", status)
    }

    if (severity) {
      query = query.eq("severity", severity)
    }

    const { data: tasks, error } = await query

    if (error) throw error

    return NextResponse.json({ tasks })
  } catch (error: any) {
    console.error("Error fetching review tasks:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, taskId, data } = body

    const supabase = await createClient()

    if (action === "create_tasks") {
      // Crear tareas automáticamente desde prompts críticos
      const { data: result, error } = await supabase.rpc("create_review_tasks_from_critical_prompts")

      if (error) throw error

      return NextResponse.json({
        success: true,
        tasksCreated: result,
      })
    }

    if (action === "update_status") {
      const { status, notes, assignedTo } = data

      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      }

      if (notes) updateData.resolution_notes = notes
      if (assignedTo) updateData.assigned_to = assignedTo
      if (status === "in_review") {
        updateData.reviewed_at = new Date().toISOString()
      }

      const { error } = await supabase.from("prompt_review_tasks").update(updateData).eq("id", taskId)

      if (error) throw error

      return NextResponse.json({ success: true })
    }

    if (action === "assign_task") {
      const { assignedTo } = data

      const { error } = await supabase
        .from("prompt_review_tasks")
        .update({
          assigned_to: assignedTo,
          status: "in_review",
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", taskId)

      if (error) throw error

      // Crear notificación
      await supabase.from("admin_notifications").insert({
        admin_email: assignedTo,
        notification_type: "review_assigned",
        title: "Nueva tarea de revisión asignada",
        message: "Se te ha asignado una tarea de revisión de prompt crítico",
        related_task_id: taskId,
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Error managing review task:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
