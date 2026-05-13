import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const actionType = searchParams.get("actionType")
    const performedBy = searchParams.get("performedBy")
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    let query = supabase.from("dsar_audit_log").select("*").order("created_at", { ascending: false }).limit(limit)

    if (actionType) {
      query = query.eq("action_type", actionType)
    }

    if (performedBy) {
      query = query.eq("performed_by", performedBy)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ auditLog: data || [] })
  } catch (error: any) {
    console.error("[v0] Error fetching audit log:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch audit log" }, { status: 500 })
  }
}
