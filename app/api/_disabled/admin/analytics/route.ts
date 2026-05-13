import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify admin status
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("despega_user_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Not an admin" }, { status: 403 })
    }

    // Get analytics data
    const searchParams = request.nextUrl.searchParams
    const metric = searchParams.get("metric") || "overview"

    if (metric === "overview") {
      // Get user counts
      const { count: totalUsers } = await supabase
        .from("despega_user_profiles")
        .select("*", { count: "exact" })

      const { count: activeUsers } = await supabase
        .from("despega_user_profiles")
        .select("*", { count: "exact" })
        .gte("last_activity", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      // Get completion rates
      const { data: completions } = await supabase
        .from("despega_a1_results")
        .select("count")

      return NextResponse.json({
        totalUsers,
        activeUsers,
        completionRate: completions?.length || 0
      })
    }

    if (metric === "pillar-progress") {
      // Get pillar progress stats
      const { data: progress } = await supabase
        .from("despega_pilar_progress")
        .select("pilar, progreso, score")

      const pillarStats = [
        "a1_cerebral",
        "a2_intermediate",
        "a3_rutas",
        "a4_base"
      ].map(pilar => {
        const pilarData = progress?.filter(p => p.pilar === pilar) || []
        return {
          pilar,
          avgProgress: pilarData.length > 0
            ? pilarData.reduce((sum, p) => sum + (p.progreso || 0), 0) / pilarData.length
            : 0,
          avgScore: pilarData.length > 0
            ? pilarData.reduce((sum, p) => sum + (p.score || 0), 0) / pilarData.length
            : 0,
          totalUsers: pilarData.length
        }
      })

      return NextResponse.json({ pillarStats })
    }

    if (metric === "content-engagement") {
      // Get content engagement data
      const { data: engagementData } = await supabase
        .from("despega_user_misiones")
        .select("mision_id, completed")

      const contentEngagement = {
        a1: engagementData?.filter(e => e.mision_id.startsWith("a1")).length || 0,
        a2: engagementData?.filter(e => e.mision_id.startsWith("a2")).length || 0,
        a3: engagementData?.filter(e => e.mision_id.startsWith("a3")).length || 0,
        a4: engagementData?.filter(e => e.mision_id.startsWith("a4")).length || 0
      }

      return NextResponse.json({ contentEngagement })
    }

    return NextResponse.json({ error: "Unknown metric" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
