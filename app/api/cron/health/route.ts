import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("cron_job_health").select("*").order("job_name")

    if (error) {
      console.error("[v0] Error fetching cron job health:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Error in cron health API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
