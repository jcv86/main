import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: deployments, error } = await supabase
      .from("canary_active_deployments")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ deployments })
  } catch (error: any) {
    console.error("Error fetching active deployments:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
