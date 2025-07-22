import { type NextRequest, NextResponse } from "next/server"
import { chileanJobService } from "@/lib/chilean-job-data"

export async function GET() {
  try {
    const alerts = await chileanJobService.getAlerts()
    return NextResponse.json({ alerts })
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json({ error: "Error fetching alerts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, filters, isActive } = body

    if (!name || !filters) {
      return NextResponse.json({ error: "Name and filters are required" }, { status: 400 })
    }

    const alert = await chileanJobService.createAlert({
      name,
      filters,
      isActive: isActive ?? true,
    })

    return NextResponse.json({ alert })
  } catch (error) {
    console.error("Error creating alert:", error)
    return NextResponse.json({ error: "Error creating alert" }, { status: 500 })
  }
}
