import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("cron_health_summary")
      .select("*")
      .order("health_status", { ascending: false })

    if (error) throw error

    return NextResponse.json({ summary: data || [] })
  } catch (error: any) {
    console.error("[v0] Error fetching cron health summary:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
