import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: thresholds, error } = await supabase
      .from("severity_thresholds")
      .select("*")
      .order("metric_category", { ascending: true })
      .order("metric_name", { ascending: true })

    if (error) throw error

    // Group by category
    const grouped = thresholds.reduce((acc: any, threshold: any) => {
      if (!acc[threshold.metric_category]) {
        acc[threshold.metric_category] = []
      }
      acc[threshold.metric_category].push(threshold)
      return acc
    }, {})

    return NextResponse.json({ thresholds, grouped })
  } catch (error) {
    console.error("Error fetching thresholds:", error)
    return NextResponse.json({ error: "Failed to fetch thresholds" }, { status: 500 })
  }
}
