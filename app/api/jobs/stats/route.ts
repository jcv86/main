import { NextResponse } from "next/server"
import { chileanJobService } from "@/lib/chilean-job-data"

export async function GET() {
  try {
    const stats = await chileanJobService.getJobStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching job stats:", error)
    return NextResponse.json({ error: "Error fetching job statistics" }, { status: 500 })
  }
}
