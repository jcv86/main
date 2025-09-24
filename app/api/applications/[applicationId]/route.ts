import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest, { params }: { params: { applicationId: string } }) {
  try {
    const { applicationId } = params

    // Get application details with history and interviews
    const { data, error } = await supabase.rpc("get_application_details", { app_id: applicationId })

    if (error) {
      console.error("Error fetching application details:", error)
      return NextResponse.json({ error: "Error al obtener los detalles de la aplicación" }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Aplicación no encontrada" }, { status: 404 })
    }

    const application = data[0]

    return NextResponse.json({
      success: true,
      application: {
        id: application.id,
        applicationId: application.application_id,
        jobTitle: application.job_title,
        department: application.department,
        candidateName: application.candidate_name,
        candidateEmail: application.candidate_email,
        candidatePhone: application.candidate_phone,
        status: application.status,
        createdAt: application.created_at,
        updatedAt: application.updated_at,
        statusHistory: application.status_history,
        interviews: application.interviews,
      },
    })
  } catch (error) {
    console.error("Error in GET /api/applications/[applicationId]:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { applicationId: string } }) {
  try {
    const { applicationId } = params
    const body = await request.json()
    const { status, notes, updatedBy = "admin" } = body

    if (!status) {
      return NextResponse.json({ error: "El estado es requerido" }, { status: 400 })
    }

    // Get application ID (UUID) from application_id
    const { data: appData, error: appError } = await supabase
      .from("job_applications")
      .select("id")
      .eq("application_id", applicationId)
      .single()

    if (appError || !appData) {
      return NextResponse.json({ error: "Aplicación no encontrada" }, { status: 404 })
    }

    // Update application status using the function
    const { error: updateError } = await supabase.rpc("update_application_status", {
      app_id: appData.id,
      new_status: status,
      status_notes: notes,
      updated_by_user: updatedBy,
    })

    if (updateError) {
      console.error("Error updating application status:", updateError)
      return NextResponse.json({ error: "Error al actualizar el estado de la aplicación" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Estado de aplicación actualizado exitosamente",
    })
  } catch (error) {
    console.error("Error in PUT /api/applications/[applicationId]:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
