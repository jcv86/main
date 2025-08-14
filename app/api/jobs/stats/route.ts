import { NextResponse } from "next/server"
import { chileanJobService } from "@/lib/chilean-job-data"

export async function GET() {
  try {
    const stats = await chileanJobService.getJobStats()

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Error fetching job stats:", error)

    // Return fallback data in case of error
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch job statistics",
        data: {
          total_jobs: 0,
          by_source: {},
          by_region: {},
          by_industry: {},
          by_experience: {},
          by_employment_type: {},
          average_salary: 0,
          salary_ranges: {
            min: 0,
            max: 0,
            currency: "CLP",
          },
          remote_percentage: 0,
          top_skills: [],
          top_companies: [],
        },
      },
      { status: 500 },
    )
  }
}
