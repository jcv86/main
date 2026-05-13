import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ isAdmin: false }, { status: 400 })
    }

    const adminClient = await createClient()

    // Check if user is in admin_emails table
    console.log("[v0] [Admin Check] Checking admin_emails table for:", email)
    const { data: adminEmail, error } = await adminClient
      .from("admin_emails")
      .select("email")
      .eq("email", email)
      .maybeSingle()

    console.log("[v0] [Admin Check] Query result:", { adminEmail, error })

    if (error) {
      console.error("[v0] [Admin Check] Database error:", error)
      return NextResponse.json({ isAdmin: false }, { status: 500 })
    }

    const isAdmin = !!adminEmail
    console.log("[v0] [Admin Check] Is admin:", isAdmin)

    return NextResponse.json({ isAdmin })
  } catch (error) {
    console.error("[Admin Check] Error:", error)
    return NextResponse.json({ isAdmin: false }, { status: 500 })
  }
}
