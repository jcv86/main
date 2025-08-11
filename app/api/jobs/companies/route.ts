import { type NextRequest, NextResponse } from "next/server"
import { chileanJobService } from "@/lib/chilean-job-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const companies = await chileanJobService.getTopCompanies(limit)

    return NextResponse.json({
      success: true,
      data: companies,
      total: companies.length,
    })
  } catch (error) {
    console.error("Error fetching companies data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch companies data",
        data: [],
      },
      { status: 500 },
    )
  }
}
