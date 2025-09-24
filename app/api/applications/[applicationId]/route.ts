import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest, { params }: { params: { applicationId: string } }) {
  try {
    const { applicationId } = params

    const { data, error } = await supabase
      .from("job_applications")
      .select(`
        *,
        application_status_history(
          status,
          notes,
          updated_by,
          created_at
        ),
        application_interviews(
          interview_type,
          scheduled_date,
          duration_minutes,
          interviewer_name,
          interviewer_email,
          meeting_link,
          location,
          notes,
          status
        )
      `)
      .eq("id", applicationId)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json({ application: data })
  } catch (error) {
    console.error("Application fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { applicationId: string } }) {
  try {
    const { applicationId } = params
    const body = await request.json()
    const { status, notes, updatedBy = "admin" } = body

    // Update application status using the stored function
    const { data, error } = await supabase.rpc("update_application_status", {
      app_id: applicationId,
      new_status: status,
      status_notes: notes,
      updated_by_user: updatedBy,
    })

    if (error || !data) {
      console.error("Status update error:", error)
      return NextResponse.json({ error: "Failed to update application status" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Application status updated successfully",
    })
  } catch (error) {
    console.error("Application update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
