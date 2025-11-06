import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: Request, { params }: { params: Promise<{ alertId: string }> }) {
  try {
    const { alertId } = await params
    const { acknowledgedBy } = await request.json()

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

    const { error } = await supabase
      .from("metric_alerts")
      .update({
        status: "acknowledged",
        acknowledged_by: acknowledgedBy,
        acknowledged_at: new Date().toISOString(),
      })
      .eq("id", alertId)

    if (error) {
      return NextResponse.json({ error: "Failed to acknowledge alert" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error acknowledging alert:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
