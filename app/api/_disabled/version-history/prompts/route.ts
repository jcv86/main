import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const promptId = searchParams.get("promptId")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let query = supabase.from("prompt_versions").select("*").order("created_at", { ascending: false }).limit(limit)

    if (promptId) {
      query = query.eq("id", promptId)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching prompt versions:", error)
      return NextResponse.json({ error: error.message, versions: [] }, { status: 500 })
    }

    return NextResponse.json({ versions: data || [] })
  } catch (error: any) {
    console.error("[v0] Error in prompt versions API:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch version history", versions: [] },
      { status: 500 },
    )
  }
}
