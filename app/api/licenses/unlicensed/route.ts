import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("unlicensed_content").select("*").order("content_title")

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching unlicensed content:", error)
    return NextResponse.json({ error: "Failed to fetch unlicensed content" }, { status: 500 })
  }
}
