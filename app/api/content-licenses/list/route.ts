import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: licenses, error } = await supabase
      .from("content_licenses")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ licenses })
  } catch (error) {
    console.error("Error fetching content licenses:", error)
    return NextResponse.json({ error: "Failed to fetch content licenses" }, { status: 500 })
  }
}
