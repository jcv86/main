import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const date = searchParams.get("date")

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("user_email", email)
      .maybeSingle()

    if (profileError) {
      console.error("[v0] Error fetching user profile:", profileError)
      return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
    }

    // If no user found, return empty activities array
    if (!profile) {
      console.log("[v0] No user profile found for email:", email)
      return NextResponse.json({ activities: [] })
    }

    let query = supabase
      .from("calendar_events")
      .select("*")
      .eq("user_id", profile.id)
      .order("start_time", { ascending: true })

    if (date) {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      query = query.gte("start_time", startOfDay.toISOString()).lte("start_time", endOfDay.toISOString())
    }

    const { data: activities, error } = await query

    if (error) throw error

    return NextResponse.json({ activities: activities || [] })
  } catch (error) {
    console.error("[v0] Error fetching activities:", error)
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_email, title, description, event_type, start_time, end_time } = body

    if (!user_email || !title || !event_type || !start_time || !end_time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("user_email", user_email)
      .maybeSingle()

    if (profileError) {
      console.error("[v0] Error fetching user profile:", profileError)
      return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
    }

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { data: activity, error } = await supabase
      .from("calendar_events")
      .insert({
        user_id: profile.id,
        title,
        description,
        event_type,
        start_time,
        end_time,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ activity })
  } catch (error) {
    console.error("[v0] Error creating activity:", error)
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 })
  }
}
