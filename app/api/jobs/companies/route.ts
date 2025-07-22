import { NextResponse } from "next/server"
import { chileanJobService } from "@/lib/chilean-job-data"

export async function GET() {
  try {
    const topCompanies = chileanJobService.getTopCompanies()
    const topSkills = chileanJobService.getTopSkills()

    return NextResponse.json({
      topCompanies,
      topSkills,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching companies data:", error)
    return NextResponse.json({ error: "Error fetching companies data" }, { status: 500 })
  }
}
