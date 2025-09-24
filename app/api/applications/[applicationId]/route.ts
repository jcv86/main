import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest, { params }: { params: { applicationId: string } }) {
  try {
    const { applicationId } = params

    const { data, error } = await supabase
      .from("job_applications")
      .select(`
        *,
        application_status_history (
          status,
          notes,
          changed_by,
          created_at
        ),
        application_interviews (
          interview_type,
          scheduled_date,
          duration_minutes,
          interviewer_name,
          interviewer_email,
          meeting_link,
          notes,
          status,
          created_at
        )
      `)
      .eq("application_id", applicationId)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Application not found" }, { status: 404 })
      }
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Fetch application error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { applicationId: string } }) {
  try {
    const { applicationId } = params
    const body = await request.json()

    const { status, notes, changed_by } = body

    // Update application status
    const { data, error } = await supabase
      .from("job_applications")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("application_id", applicationId)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
    }

    // Add status history entry
    if (status) {
      await supabase.from("application_status_history").insert([
        {
          application_id: data.id,
          status,
          notes: notes || `Status updated to ${status}`,
          changed_by: changed_by || "system",
        },
      ])
    }

    return NextResponse.json({
      success: true,
      application: data,
    })
  } catch (error) {
    console.error("Update application error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { applicationId: string } }) {
  try {
    const { applicationId } = params

    const { error } = await supabase.from("job_applications").delete().eq("application_id", applicationId)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to delete application" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
    })
  } catch (error) {
    console.error("Delete application error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
