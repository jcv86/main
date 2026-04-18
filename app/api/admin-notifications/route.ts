import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const adminEmail = searchParams.get("email")
    const unreadOnly = searchParams.get("unread") === "true"

    const supabase = await createClient()

    let query = supabase.from("admin_notifications").select("*").order("created_at", { ascending: false }).limit(50)

    if (adminEmail) {
      query = query.eq("admin_email", adminEmail)
    }

    if (unreadOnly) {
      query = query.eq("read", false)
    }

    const { data: notifications, error } = await query

    if (error) throw error

    return NextResponse.json({ notifications })
  } catch (error: any) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, notificationId, notificationIds } = body

    const supabase = await createClient()

    if (action === "mark_read") {
      const { error } = await supabase
        .from("admin_notifications")
        .update({
          read: true,
          read_at: new Date().toISOString(),
        })
        .eq("id", notificationId)

      if (error) throw error

      return NextResponse.json({ success: true })
    }

    if (action === "mark_all_read") {
      const { error } = await supabase
        .from("admin_notifications")
        .update({
          read: true,
          read_at: new Date().toISOString(),
        })
        .in("id", notificationIds)

      if (error) throw error

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Error managing notification:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
