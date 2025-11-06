import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("content_licenses").select("*").order("content_title")

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching licenses:", error)
    return NextResponse.json({ error: "Failed to fetch licenses" }, { status: 500 })
  }
}
