import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Generate unique application ID
async function generateApplicationId(): Promise<string> {
  const { data, error } = await supabase.rpc("generate_application_id")
  if (error) {
    throw new Error("Failed to generate application ID")
  }
  return data
}

// POST - Submit new job application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      jobTitle,
      department,
      candidateName,
      candidateEmail,
      candidatePhone,
      resumeUrl,
      coverLetter,
      linkedinProfile,
      portfolioUrl,
      yearsExperience,
      currentCompany,
      currentPosition,
      salaryExpectation,
      availabilityDate,
    } = body

    // Generate unique application ID
    const applicationId = await generateApplicationId()

    // Insert the application
    const { data, error } = await supabase
      .from("job_applications")
      .insert({
        application_id: applicationId,
        job_title: jobTitle,
        department: department,
        candidate_name: candidateName,
        candidate_email: candidateEmail,
        candidate_phone: candidatePhone,
        resume_url: resumeUrl,
        cover_letter: coverLetter,
        linkedin_profile: linkedinProfile,
        portfolio_url: portfolioUrl,
        years_experience: yearsExperience,
        current_company: currentCompany,
        current_position: currentPosition,
        salary_expectation: salaryExpectation,
        availability_date: availabilityDate,
        status: "submitted",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
    }

    // Add initial status history entry
    await supabase.from("application_status_history").insert({
      application_id: data.id,
      status: "submitted",
      notes: "Application submitted successfully",
      updated_by: "system",
    })

    return NextResponse.json({
      success: true,
      applicationId: applicationId,
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
    const department = searchParams.get("department")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = supabase
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
          interviewer_name,
          status
        )
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq("status", status)
    }

    if (department) {
      query = query.eq("department", department)
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
    console.error("Applications fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
