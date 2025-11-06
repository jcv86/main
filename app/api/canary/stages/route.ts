import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const deploymentId = searchParams.get("deploymentId")

    if (!deploymentId) {
      return NextResponse.json({ error: "deploymentId is required" }, { status: 400 })
    }

    const { data: stages, error } = await supabase
      .from("canary_deployment_stages")
      .select("*")
      .eq("deployment_id", deploymentId)
      .order("stage_number", { ascending: true })

    if (error) throw error

    return NextResponse.json({ stages })
  } catch (error) {
    console.error("Error fetching deployment stages:", error)
    return NextResponse.json({ error: "Failed to fetch stages" }, { status: 500 })
  }
}
