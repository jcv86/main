import { type NextRequest, NextResponse } from "next/server"
import { chileanJobService } from "@/lib/chilean-job-data"

// Force dynamic rendering for this route
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""
    const location = searchParams.get("location") || ""
    const industry = searchParams.get("industry") || ""
    const experience_level = searchParams.get("experience_level") || ""
    const employment_type = searchParams.get("employment_type") || ""
    const remote_work = searchParams.get("remote_work") === "true"
    const source = searchParams.get("source") || ""

    const jobs = await chileanJobService.searchJobs({
      query,
      location,
      industry,
      experience_level,
      employment_type,
      remote_work,
      source,
    })

    return NextResponse.json({
      success: true,
      jobs: jobs,
      total: jobs.length,
      query,
      filters: {
        location,
        industry,
        experience_level,
        employment_type,
        remote_work,
        source,
      },
    })
  } catch (error) {
    console.error("Error searching jobs:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search jobs",
        jobs: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query = "", location = "", limit = 50 } = body

    const jobs = await chileanJobService.searchJobs({
      query,
      location,
    })

    // Limit results
    const limitedJobs = jobs.slice(0, limit)

    return NextResponse.json({
      success: true,
      jobs: limitedJobs,
      total: jobs.length,
      query,
      filters: { location },
    })
  } catch (error) {
    console.error("Error searching jobs:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search jobs",
        jobs: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}
