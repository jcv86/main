import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET() {
  try {
    console.log("[v0] Fetching metric alerts")

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

    const { data, error } = await supabase
      .from("metric_alerts")
      .select("*")
      .order("triggered_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("[v0] Error fetching metric alerts:", error)
      return NextResponse.json({ error: "Failed to fetch metric alerts" }, { status: 500 })
    }

    console.log("[v0] Successfully fetched metric alerts:", data?.length || 0, "alerts")
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Unexpected error in metrics alerts API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
