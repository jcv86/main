import { type NextRequest, NextResponse } from "next/server"
import { chileanJobService } from "@/lib/chilean-job-data"

export async function GET(request: NextRequest) {
  try {
    const stats = await chileanJobService.getJobStats()

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Error fetching job stats:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch job statistics",
        data: {
          totalJobs: 0,
          averageSalary: 0,
          topSkills: [],
          topCompanies: [],
          locationDistribution: [],
          industryDistribution: [],
        },
      },
      { status: 500 },
    )
  }
}
