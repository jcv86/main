import { type NextRequest, NextResponse } from "next/server"
import { chileanJobService } from "@/lib/chilean-job-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const location = searchParams.get("location") || undefined
    const industry = searchParams.get("industry") || undefined
    const experience = searchParams.get("experience") || undefined
    const remote = searchParams.get("remote") === "true" ? true : undefined
    const company = searchParams.get("company") || undefined

    const salaryMin = searchParams.get("salary_min")
    const salaryMax = searchParams.get("salary_max")
    const salary =
      salaryMin && salaryMax
        ? {
            min: Number.parseInt(salaryMin),
            max: Number.parseInt(salaryMax),
          }
        : undefined

    const skills = searchParams.get("skills")?.split(",").filter(Boolean) || undefined

    const filters = {
      location,
      industry,
      experience,
      salary,
      remote,
      company,
      skills,
    }

    const jobs = await chileanJobService.searchJobs(query, filters)

    return NextResponse.json({
      success: true,
      data: jobs,
      total: jobs.length,
      query,
      filters,
    })
  } catch (error) {
    console.error("Error searching jobs:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search jobs",
        data: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}
