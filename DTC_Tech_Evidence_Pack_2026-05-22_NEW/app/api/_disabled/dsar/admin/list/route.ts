import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: requests, error } = await supabase
      .from("dsar_requests")
      .select(
        `
        *,
        profiles:user_id (email, full_name)
      `,
      )
      .order("created_at", { ascending: false })

    if (error) throw error

    // Get summary stats
    const summary = {
      total: requests.length,
      pending: requests.filter((r: any) => r.status === "pending").length,
      processing: requests.filter((r: any) => r.status === "processing").length,
      completed: requests.filter((r: any) => r.status === "completed").length,
      by_type: {
        access: requests.filter((r: any) => r.request_type === "access").length,
        deletion: requests.filter((r: any) => r.request_type === "deletion").length,
        portability: requests.filter((r: any) => r.request_type === "portability").length,
        rectification: requests.filter((r: any) => r.request_type === "rectification").length,
      },
    }

    return NextResponse.json({ requests, summary })
  } catch (error) {
    console.error("Error fetching DSAR requests:", error)
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
  }
}
