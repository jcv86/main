import { type NextRequest, NextResponse } from "next/server"
import { DSARManager } from "@/lib/dsar-manager"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { requestId, action, performedBy } = body

    if (!requestId || !action || !performedBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get request details
    const { data: dsarRequest, error: fetchError } = await supabase
      .from("dsar_requests")
      .select("*")
      .eq("id", requestId)
      .single()

    if (fetchError || !dsarRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    if (action === "collect") {
      // Collect user data
      const result = await DSARManager.collectUserData(requestId, dsarRequest.user_email)

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        data: result.data,
        message: "Data collected successfully",
      })
    } else if (action === "delete") {
      // Delete user data
      const result = await DSARManager.deleteUserData(requestId, dsarRequest.user_email, performedBy)

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        summary: result.summary,
        message: "User data deleted successfully",
      })
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("[API] Error processing DSAR request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
