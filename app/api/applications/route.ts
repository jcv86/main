import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"


// POST - Submit new job application
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const applicationData = {
      job_id: formData.get("jobId") as string,
      job_title: formData.get("jobTitle") as string,
      first_name: formData.get("firstName") as string,
      last_name: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      linkedin: (formData.get("linkedin") as string) || null,
      portfolio: (formData.get("portfolio") as string) || null,
      experience: formData.get("experience") as string,
      motivation: formData.get("motivation") as string,
      availability: formData.get("availability") as string,
      expected_salary: (formData.get("expectedSalary") as string) || null,
    }

    // Validate required fields
    const requiredFields = [
      "job_id",
      "job_title",
      "first_name",
      "last_name",
      "email",
      "phone",
      "experience",
      "motivation",
      "availability",
    ]
    for (const field of requiredFields) {
      if (!applicationData[field as keyof typeof applicationData]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Handle CV file upload (in a real app, you'd upload to storage)
    const cvFile = formData.get("cv") as File
    let cvFilename = null
    let cvUrl = null

    if (cvFile) {
      cvFilename = cvFile.name
      // In a real application, you would upload the file to a storage service
      // and get back a URL. For now, we'll just store the filename.
      cvUrl = `/uploads/cv/${Date.now()}-${cvFile.name}`
    }

    // Insert application into database
    const { data, error } = await supabase
      .from("job_applications")
      .insert([
        {
          ...applicationData,
          cv_filename: cvFilename,
          cv_url: cvUrl,
          status: "submitted",
        },
      ])
      .select("application_id")
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
    }

    // Send confirmation email (in a real app)
    // await sendConfirmationEmail(applicationData.email, data.application_id)

    return NextResponse.json({
      success: true,
      applicationId: data.application_id,
      message: "Application submitted successfully",
    })
  } catch (error) {
    console.error("Application submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET - Get all applications (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const jobId = searchParams.get("jobId")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = supabase
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
          interviewer_name,
          meeting_link,
          status
        )
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq("status", status)
    }

    if (jobId) {
      query = query.eq("job_id", jobId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
    }

    return NextResponse.json({
      applications: data,
      total: data?.length || 0,
    })
  } catch (error) {
    console.error("Fetch applications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
