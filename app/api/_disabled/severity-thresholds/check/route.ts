import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { metric_name, current_value } = body

    // Get threshold for this metric
    const { data: threshold, error: thresholdError } = await supabase
      .from("severity_thresholds")
      .select("*")
      .eq("metric_name", metric_name)
      .eq("is_active", true)
      .single()

    if (thresholdError || !threshold) {
      return NextResponse.json({ violation: false, message: "No threshold configured" })
    }

    let violation = false
    let severity = null
    let threshold_value = null

    // Check if value violates thresholds
    if (threshold.comparison_operator === "greater_than") {
      if (current_value >= threshold.critical_threshold) {
        violation = true
        severity = "critical"
        threshold_value = threshold.critical_threshold
      } else if (current_value >= threshold.warning_threshold) {
        violation = true
        severity = "warning"
        threshold_value = threshold.warning_threshold
      }
    } else {
      // less_than
      if (current_value <= threshold.critical_threshold) {
        violation = true
        severity = "critical"
        threshold_value = threshold.critical_threshold
      } else if (current_value <= threshold.warning_threshold) {
        violation = true
        severity = "warning"
        threshold_value = threshold.warning_threshold
      }
    }

    // If violation, create alert
    if (violation) {
      const message = `${threshold.description}: ${current_value}${threshold.unit} (umbral: ${threshold_value}${threshold.unit})`

      const { error: alertError } = await supabase.from("threshold_alerts").insert({
        threshold_id: threshold.id,
        metric_name,
        current_value,
        threshold_value,
        severity,
        message,
      })

      if (alertError) console.error("Error creating alert:", alertError)
    }

    return NextResponse.json({
      violation,
      severity,
      threshold_value,
      current_value,
      metric_name,
      unit: threshold.unit,
    })
  } catch (error) {
    console.error("Error checking threshold:", error)
    return NextResponse.json({ error: "Failed to check threshold" }, { status: 500 })
  }
}
