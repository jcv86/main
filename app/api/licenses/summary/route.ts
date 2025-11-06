import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("license_compliance_summary").select("*")

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching license summary:", error)
    return NextResponse.json({ error: "Failed to fetch license summary" }, { status: 500 })
  }
}
