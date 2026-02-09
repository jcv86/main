import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Fetch retry metrics by test type
    const { data, error } = await supabase
      .from("test_save_retries")
      .select("test_type, status, attempt_number")

    if (error) {
      console.error("[v0] Error fetching retry metrics:", error)
      return NextResponse.json({ metrics: [] })
    }

    // Group by test type and calculate metrics
    const metricsMap: Record<
      string,
      {
        testType: string
        totalRetries: number
        successfulRetries: number
        failedRetries: number
        totalAttempts: number
      }
    > = {}

    data?.forEach((record) => {
      if (!metricsMap[record.test_type]) {
        metricsMap[record.test_type] = {
          testType: record.test_type,
          totalRetries: 0,
          successfulRetries: 0,
          failedRetries: 0,
          totalAttempts: 0,
        }
      }

      metricsMap[record.test_type].totalRetries++

      if (record.status === "success") {
        metricsMap[record.test_type].successfulRetries++
      } else if (record.status === "failed") {
        metricsMap[record.test_type].failedRetries++
      }

      metricsMap[record.test_type].totalAttempts += record.attempt_number || 1
    })

    const metrics = Object.values(metricsMap).map((m) => ({
      ...m,
      avgAttemptsPerTest: m.totalAttempts / Math.max(m.totalRetries, 1),
    }))

    return NextResponse.json({ metrics })
  } catch (e: any) {
    console.error("[v0] Exception in retry-metrics:", e)
    return NextResponse.json(
      { error: e.message || "Internal server error", metrics: [] },
      { status: 500 },
    )
  }
}
