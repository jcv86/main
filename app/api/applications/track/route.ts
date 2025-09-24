import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { applicationId, email } = body

    if (!applicationId || !email) {
      return NextResponse.json({ error: "ID de aplicación y email son requeridos" }, { status: 400 })
    }

    // Get application details with history and interviews
    const { data, error } = await supabase.rpc("get_application_details", { app_id: applicationId })

    if (error) {
      console.error("Error fetching application details:", error)
      return NextResponse.json({ error: "Error al buscar la aplicación" }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Aplicación no encontrada" }, { status: 404 })
    }

    const application = data[0]

    // Verify email matches
    if (application.candidate_email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: "El email no coincide con la aplicación" }, { status: 403 })
    }

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
    console.error("Error in POST /api/applications/track:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
