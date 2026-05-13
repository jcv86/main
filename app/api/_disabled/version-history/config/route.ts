import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const configKey = searchParams.get("key")

    let query = supabase.from("dsar_config").select("*").order("updated_at", { ascending: false })

    if (configKey) {
      query = query.eq("config_key", configKey)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ configHistory: data || [] })
  } catch (error: any) {
    console.error("[v0] Error fetching config history:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch config history" }, { status: 500 })
  }
}
