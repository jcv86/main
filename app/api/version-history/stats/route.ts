import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get stats from multiple tables
    const [promptVersions, auditLogs, contentChanges, configChanges] = await Promise.all([
      supabase.from("prompt_versions").select("id", { count: "exact", head: true }),
      supabase.from("dsar_audit_log").select("id", { count: "exact", head: true }),
      supabase.from("content_license_history").select("id", { count: "exact", head: true }),
      supabase.from("dsar_config").select("id", { count: "exact", head: true }),
    ])

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: recentActivity } = await supabase
      .from("dsar_audit_log")
      .select("action_type, performed_by, created_at")
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(10)

    // Get top contributors
    const { data: topContributors } = await supabase
      .from("dsar_audit_log")
      .select("performed_by")
      .gte("created_at", sevenDaysAgo.toISOString())

    const contributorCounts: Record<string, number> = {}
    topContributors?.forEach((log) => {
      if (log.performed_by) {
        contributorCounts[log.performed_by] = (contributorCounts[log.performed_by] || 0) + 1
      }
    })

    const topContributorsList = Object.entries(contributorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([email, count]) => ({ email, changes: count }))

    return NextResponse.json({
      stats: {
        totalPromptVersions: promptVersions.count || 0,
        totalAuditLogs: auditLogs.count || 0,
        totalContentChanges: contentChanges.count || 0,
        totalConfigChanges: configChanges.count || 0,
      },
      recentActivity: recentActivity || [],
      topContributors: topContributorsList,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching version history stats:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch stats" }, { status: 500 })
  }
}
