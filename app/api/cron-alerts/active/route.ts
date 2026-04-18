import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data, error } = await supabase
      .from("cron_active_alerts")
      .select("*")
      .order("triggered_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ alerts: data || [] })
  } catch (error: any) {
    console.error("[v0] Error fetching active cron alerts:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
