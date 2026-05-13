import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("autopublish_config").select("*").single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching autopublish config:", error)
    return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 })
  }
}
