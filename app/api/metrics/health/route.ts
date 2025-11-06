import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET() {
  try {
    console.log("[v0] Fetching metrics health data")

    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    const { data, error } = await supabase.from("metric_health_status").select("*").order("metric_name")

    if (error) {
      console.error("[v0] Error fetching metric health:", error)
      return NextResponse.json({ error: "Failed to fetch metrics health" }, { status: 500 })
    }

    console.log("[v0] Successfully fetched metrics health:", data?.length || 0, "metrics")
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Unexpected error in metrics health API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
