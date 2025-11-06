import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get all active variants with their metrics
    const { data: variants, error } = await supabase
      .from("prompt_versions")
      .select(`
        *,
        prompt_variant_assignments(count),
        coaching_metrics(
          satisfaction_rating,
          message_count,
          action_completed
        )
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) throw error

    // Generate CSV
    const headers = [
      "Coach",
      "Category",
      "Version",
      "Status",
      "Total Sessions",
      "Avg Satisfaction",
      "Avg Engagement",
      "Action Completion %",
      "Created At",
    ]

    const rows =
      variants?.map((v) => {
        const metrics = v.coaching_metrics || []
        const totalSessions = metrics.length
        const avgSatisfaction =
          totalSessions > 0
            ? (metrics.reduce((sum: number, m: any) => sum + (m.satisfaction_rating || 0), 0) / totalSessions).toFixed(
                2,
              )
            : "0"
        const avgEngagement =
          totalSessions > 0
            ? (metrics.reduce((sum: number, m: any) => sum + (m.message_count || 0), 0) / totalSessions).toFixed(2)
            : "0"
        const actionRate =
          totalSessions > 0
            ? ((metrics.filter((m: any) => m.action_completed).length / totalSessions) * 100).toFixed(1)
            : "0"

        return [
          v.coach_type,
          v.conversation_category,
          v.version_name,
          v.is_published ? "Published" : "Testing",
          totalSessions,
          avgSatisfaction,
          avgEngagement,
          actionRate,
          new Date(v.created_at).toISOString(),
        ]
      }) || []

    const csv = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="ab-test-results-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exporting A/B test CSV:", error)
    return NextResponse.json({ error: "Failed to export CSV" }, { status: 500 })
  }
}
