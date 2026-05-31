import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20")
    const unreadOnly = searchParams.get("unread") === "true"

    // Fetch notifications from despega_notifications table
    let query = supabase
      .from("despega_notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (unreadOnly) {
      query = query.eq("read", false)
    }

    const { data, error } = await query

    if (error) {
      // If table doesn't exist, return empty array
      if (error.code === "42P01") {
        return NextResponse.json({ notifications: [], unread_count: 0 })
      }
      console.error("[v0] Error fetching notifications:", error)
      return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
    }

    // Get unread count
    const { count } = await supabase
      .from("despega_notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false)

    return NextResponse.json({
      notifications: data || [],
      unread_count: count || 0
    })
  } catch (error) {
    console.error("[v0] notifications GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, notificationId, notificationIds } = body

    if (action === "mark_read" && notificationId) {
      const { error } = await supabase
        .from("despega_notifications")
        .update({ read: true, read_at: new Date().toISOString() })
        .eq("id", notificationId)
        .eq("user_id", user.id)

      if (error) {
        return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    }

    if (action === "mark_all_read") {
      const { error } = await supabase
        .from("despega_notifications")
        .update({ read: true, read_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("read", false)

      if (error) {
        return NextResponse.json({ error: "Failed to mark all as read" }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    }

    if (action === "delete" && notificationIds) {
      const { error } = await supabase
        .from("despega_notifications")
        .delete()
        .in("id", notificationIds)
        .eq("user_id", user.id)

      if (error) {
        return NextResponse.json({ error: "Failed to delete notifications" }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] notifications POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
