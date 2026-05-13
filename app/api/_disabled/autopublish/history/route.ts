import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("autopublish_history")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching autopublish history:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}
