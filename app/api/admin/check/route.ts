import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      return NextResponse.json({ isAdmin: false }, { status: 401 })
    }

    // Check if user is in admin_emails table
    const { data: adminEmail } = await supabase
      .from("admin_emails")
      .select("email")
      .eq("email", user.email)
      .maybeSingle()

    return NextResponse.json({ isAdmin: !!adminEmail })
  } catch (error) {
    console.error("[Admin Check] Error:", error)
    return NextResponse.json({ isAdmin: false }, { status: 500 })
  }
}
