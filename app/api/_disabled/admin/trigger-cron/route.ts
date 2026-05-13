import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    // Verify user is admin
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("id", user.id).single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const { endpoint } = await request.json()

    if (!endpoint) {
      return NextResponse.json({ error: "Endpoint is required" }, { status: 400 })
    }

    // Call the cron endpoint with the secret from server-side
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 })
    }

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cronSecret}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Cron job failed")
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error triggering cron job:", error)
    return NextResponse.json({ error: error.message || "Failed to trigger cron job" }, { status: 500 })
  }
}
