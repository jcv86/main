import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const coach = searchParams.get("coach")
    const category = searchParams.get("category")

    const supabase = await createClient()

    let query = supabase.from("coaching_metrics").select("*").order("created_at", { ascending: false })

    if (startDate) {
      query = query.gte("created_at", startDate)
    }
    if (endDate) {
      query = query.lte("created_at", endDate)
    }
    if (coach) {
      query = query.eq("coach_type", coach)
    }
    if (category) {
      query = query.eq("conversation_category", category)
    }

    const { data: metrics, error } = await query

    if (error) throw error

    // Generate CSV
    const headers = [
      "ID",
      "Session ID",
      "Coach",
      "Category",
      "Satisfaction",
      "Message Count",
      "Action Completed",
      "Feedback",
      "Created At",
    ]

    const rows =
      metrics?.map((m) => [
        m.id,
        m.session_id,
        m.coach_type,
        m.conversation_category,
        m.satisfaction_rating,
        m.message_count,
        m.action_completed ? "Yes" : "No",
        m.satisfaction_feedback || "",
        new Date(m.created_at).toISOString(),
      ]) || []

    const csv = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="coaching-metrics-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exporting CSV:", error)
    return NextResponse.json({ error: "Failed to export CSV" }, { status: 500 })
  }
}
