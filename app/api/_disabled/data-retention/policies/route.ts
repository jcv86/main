import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: policies, error } = await supabase
      .from("active_retention_policies")
      .select("*")
      .order("category", { ascending: true })

    if (error) throw error

    return NextResponse.json({ policies })
  } catch (error) {
    console.error("Error fetching retention policies:", error)
    return NextResponse.json({ error: "Failed to fetch retention policies" }, { status: 500 })
  }
}
