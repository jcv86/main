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

    // Validate required fields
    if (!jobTitle || !department || !candidateName || !candidateEmail) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    // Generate application ID
    const { data: appIdData, error: appIdError } = await supabase.rpc("generate_application_id")

    if (appIdError) {
      console.error("Error generating application ID:", appIdError)
      return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }

    const applicationId = appIdData

    // Insert application
    const { data: applicationData, error: insertError } = await supabase
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

    if (insertError) {
      console.error("Error inserting application:", insertError)
      return NextResponse.json({ error: "Error al guardar la aplicación" }, { status: 500 })
    }

    // Insert initial status history
    const { error: historyError } = await supabase.from("application_status_history").insert({
      application_id: applicationData.id,
      status: "submitted",
      notes: "Aplicación enviada por el candidato",
      updated_by: "system",
    })

    if (historyError) {
      console.error("Error inserting status history:", historyError)
    }

    return NextResponse.json({
      success: true,
      applicationId: applicationId,
      message: "Aplicación enviada exitosamente",
    })
  } catch (error) {
    console.error("Error in POST /api/applications:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
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
      .select("*")
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
      console.error("Error fetching applications:", error)
      return NextResponse.json({ error: "Error al obtener las aplicaciones" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      applications: data,
      total: data.length,
    })
  } catch (error) {
    console.error("Error in GET /api/applications:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
