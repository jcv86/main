import { type NextRequest, NextResponse } from "next/server"
import { chileanJobService, type JobSearchFilters } from "@/lib/chilean-job-data"
import { demoJobSearchResults } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const career = searchParams.get("career") || ""

    const filters: JobSearchFilters = {
      query: query || undefined,
      location: searchParams.get("location") || undefined,
      region: searchParams.get("region") || undefined,
      commune: searchParams.get("commune") || undefined,
      industry: searchParams.get("industry") || undefined,
      experience: searchParams.get("experience") || undefined,
      modality: searchParams.get("modality") || undefined,
      type: searchParams.get("type") || undefined,
      company: searchParams.get("company") || undefined,
      salaryMin: searchParams.get("salary_min") ? Number.parseInt(searchParams.get("salary_min")!) : undefined,
      salaryMax: searchParams.get("salary_max") ? Number.parseInt(searchParams.get("salary_max")!) : undefined,
      postedDays: searchParams.get("posted_days") ? Number.parseInt(searchParams.get("posted_days")!) : undefined,
    }

    // Parse skills array
    const skillsParam = searchParams.get("skills")
    if (skillsParam) {
      filters.skills = skillsParam.split(",").map((s) => s.trim())
    }

    // Simulate job search with career filter
    const filteredJobs = demoJobSearchResults.filter((job) => {
      const matchesQuery =
        job.title.toLowerCase().includes(query.toLowerCase()) || job.company.toLowerCase().includes(query.toLowerCase())
      const matchesCareer =
        career === "" || job.requirements.some((req) => req.toLowerCase().includes(career.toLowerCase()))
      return matchesQuery && matchesCareer
    })

    if (filteredJobs.length > 0) {
      return NextResponse.json(filteredJobs)
    }

    const result = await chileanJobService.searchJobs(filters)

    return NextResponse.json({
      ...result,
      sources: ["trabajando", "getonboard", "laborum"],
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in job search API:", error)
    return NextResponse.json(
      { error: "Error searching jobs", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const filters: JobSearchFilters = body

    const result = await chileanJobService.searchJobs(filters)

    return NextResponse.json({
      ...result,
      sources: ["trabajando", "getonboard", "laborum"],
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in job search POST API:", error)
    return NextResponse.json(
      { error: "Error searching jobs", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
