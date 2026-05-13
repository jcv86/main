import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: history, error } = await supabase
      .from("data_cleanup_history")
      .select("*")
      .order("cleanup_date", { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({ history })
  } catch (error) {
    console.error("Error fetching cleanup history:", error)
    return NextResponse.json({ error: "Failed to fetch cleanup history" }, { status: 500 })
  }
}
