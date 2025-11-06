import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const { data, error } = await supabase.from("users").select("phone").eq("email", email).single()

    if (error) {
      console.error("[v0] Error fetching phone number:", error)
      return NextResponse.json({ error: "Failed to fetch phone number" }, { status: 500 })
    }

    return NextResponse.json({
      phone_number: data?.phone || "",
    })
  } catch (error) {
    console.error("[v0] Error fetching phone number:", error)
    return NextResponse.json({ error: "Failed to fetch phone number" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, phone_number } = await request.json()

    if (!email || !phone_number) {
      return NextResponse.json({ error: "Email and phone number are required" }, { status: 400 })
    }

    const { error } = await supabase.from("users").update({ phone: phone_number }).eq("email", email)

    if (error) {
      console.error("[v0] Error updating phone number:", error)
      return NextResponse.json({ error: "Failed to update phone number" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating phone number:", error)
    return NextResponse.json({ error: "Failed to update phone number" }, { status: 500 })
  }
}
