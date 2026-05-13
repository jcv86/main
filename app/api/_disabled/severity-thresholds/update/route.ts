import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, warning_threshold, critical_threshold, is_active } = body

    const { data, error } = await supabase
      .from("severity_thresholds")
      .update({
        warning_threshold,
        critical_threshold,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ threshold: data })
  } catch (error) {
    console.error("Error updating threshold:", error)
    return NextResponse.json({ error: "Failed to update threshold" }, { status: 500 })
  }
}
