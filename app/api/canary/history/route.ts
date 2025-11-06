import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: deployments, error } = await supabase
      .from("canary_deployments")
      .select("*")
      .in("status", ["completed", "rolled_back", "failed"])
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({ deployments })
  } catch (error: any) {
    console.error("Error fetching deployment history:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
