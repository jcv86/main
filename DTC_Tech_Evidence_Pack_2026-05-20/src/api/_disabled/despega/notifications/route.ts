import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { type, userId, title, message, actionUrl, milestone } = await request.json()

    const supabase = await createClient()

    // Verify user exists
    const { data: user } = await supabase
      .from("despega_user_profiles")
      .select("email, display_name")
      .eq("id", userId)
      .single()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create notification record
    const { data: notification, error: notifError } = await supabase
      .from("despega_notifications")
      .insert([
        {
          user_id: userId,
          type,
          title,
          message,
          action_url: actionUrl,
          milestone_type: milestone,
          read: false,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (notifError) throw notifError

    // Send email for important milestones
    if (
      milestone &&
      ["a1_completed", "a2_started", "a3_completed", "achievement_unlock"].includes(milestone)
    ) {
      // TODO: Integrate with email service (e.g., SendGrid, Resend)
      console.log(`[Email] Sending ${milestone} notification to ${user.email}`)
    }

    return NextResponse.json({ notification })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const limit = request.nextUrl.searchParams.get("limit") || "10"
    const unreadOnly = request.nextUrl.searchParams.get("unread_only") === "true"

    let query = supabase
      .from("despega_notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(parseInt(limit))

    if (unreadOnly) {
      query = query.eq("read", false)
    }

    const { data: notifications } = await query

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}
