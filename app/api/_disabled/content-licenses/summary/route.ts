import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: summary, error } = await supabase.from("content_license_compliance_summary").select("*")

    if (error) throw error

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Error fetching license summary:", error)
    return NextResponse.json({ error: "Failed to fetch license summary" }, { status: 500 })
  }
}
