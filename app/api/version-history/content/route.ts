import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const licenseId = searchParams.get("licenseId")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let query = supabase
      .from("content_license_history")
      .select(`
        *,
        license:content_licenses!content_license_history_license_id_fkey(
          content_title,
          content_type
        )
      `)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (licenseId) {
      query = query.eq("license_id", licenseId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ contentHistory: data || [] })
  } catch (error: any) {
    console.error("[v0] Error fetching content history:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch content history" }, { status: 500 })
  }
}
