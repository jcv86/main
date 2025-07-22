import { NextResponse } from "next/server"
import { chileanJobService } from "@/lib/chilean-job-data"

export async function GET() {
  try {
    const notifications = await chileanJobService.getNotifications()
    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Error fetching notifications" }, { status: 500 })
  }
}

export async function POST() {
  try {
    const newNotifications = await chileanJobService.checkAlertsForNewJobs()
    return NextResponse.json({
      newNotifications,
      count: newNotifications.length,
    })
  } catch (error) {
    console.error("Error checking for new jobs:", error)
    return NextResponse.json({ error: "Error checking for new jobs" }, { status: 500 })
  }
}
