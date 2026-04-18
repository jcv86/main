import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("phone, whatsapp_enabled")
      .eq("user_email", email)
      .maybeSingle()

    if (error) {
      console.error("[v0] Error fetching WhatsApp config:", error)
      return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 })
    }

    return NextResponse.json({
      enabled: profile?.whatsapp_enabled || false,
      phone_number: profile?.phone || "",
    })
  } catch (error) {
    console.error("[v0] Error in WhatsApp config API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, phone_number, enabled } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        phone: phone_number,
        whatsapp_enabled: enabled,
      })
      .eq("user_email", email)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating WhatsApp config:", error)
      return NextResponse.json({ error: "Failed to update config" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Error in WhatsApp config update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
