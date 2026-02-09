import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest, { params }: { params: { testType: string } }) {
  try {
    const { testType } = params

    if (!testType) {
      return NextResponse.json({ error: "Test type required" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Fetch completion metrics for this test type
    const { data: metrics, error } = await supabase
      .from("test_completion_metrics")
      .select("duration_minutes")
      .eq("test_type", testType)
      .eq("completion_percentage", 100)
      .order("duration_minutes", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching metrics:", error)
      return NextResponse.json(
        { error: "Failed to fetch metrics" },
        { status: 500 },
      )
    }

    if (!metrics || metrics.length === 0) {
      return NextResponse.json({
        average: 0,
        median: 0,
        min: 0,
        max: 0,
        p95: 0,
        sampleSize: 0,
      })
    }

    const durations = metrics.map((m) => m.duration_minutes)
    const sorted = [...durations].sort((a, b) => a - b)

    const average = durations.reduce((a, b) => a + b, 0) / durations.length
    const median = sorted[Math.floor(sorted.length / 2)]
    const min = sorted[0]
    const max = sorted[sorted.length - 1]
    const p95Index = Math.ceil(sorted.length * 0.95) - 1
    const p95 = sorted[Math.max(0, p95Index)]

    return NextResponse.json({
      average: parseFloat(average.toFixed(2)),
      median: parseFloat(median.toFixed(2)),
      min: parseFloat(min.toFixed(2)),
      max: parseFloat(max.toFixed(2)),
      p95: parseFloat(p95.toFixed(2)),
      sampleSize: durations.length,
    })
  } catch (e: any) {
    console.error("[v0] Exception in test-metrics:", e)
    return NextResponse.json(
      { error: e.message || "Internal server error" },
      { status: 500 },
    )
  }
}
