import { type NextRequest, NextResponse } from "next/server"
import { processWeeklyCoachingMemory } from "@/lib/coaching-memory-extractor"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const secret = request.headers.get("x-cron-secret")
    if (secret !== process.env.CRON_SECRET) {
      console.error("[v0] Invalid cron secret")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Starting weekly coaching memory processing...")

    await processWeeklyCoachingMemory()

    return NextResponse.json({
      success: true,
      message: "Weekly coaching memory processing completed",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error in memory-to-insights cron:", error)
    return NextResponse.json({
      error: "Failed to process weekly coaching memory",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
