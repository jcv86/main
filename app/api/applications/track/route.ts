import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { email, applicationId } = await request.json()

    if (!email || !applicationId) {
      return NextResponse.json({ error: "Email and application ID are required" }, { status: 400 })
    }

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
          created_at,
          updated_at
        )
      `)
      .eq("application_id", applicationId)
      .eq("email", email)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Application not found or email does not match" }, { status: 404 })
      }
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
    }

    // Sort status history by date
    if (data.application_status_history) {
      data.application_status_history.sort(
        (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      )
    }

    // Sort interviews by date
    if (data.application_interviews) {
      data.application_interviews.sort(
        (a: any, b: any) =>
          new Date(a.scheduled_date || a.created_at).getTime() - new Date(b.scheduled_date || b.created_at).getTime(),
      )
    }

    return NextResponse.json({
      success: true,
      application: data,
    })
  } catch (error) {
    console.error("Track application error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
