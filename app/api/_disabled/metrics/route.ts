import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get daily analytics
    const { data: dailyAnalytics, error: analyticsError } = await supabase
      .from("brain_analytics")
      .select("*")
      .gte("date", startDate.toISOString().split("T")[0])
      .order("date", { ascending: true })

    if (analyticsError) throw analyticsError

    // Get total events by category
    const { data: events, error: eventsError } = await supabase
      .from("brain_analytics_events")
      .select("event_category, event_type, created_at, user_email")
      .gte("created_at", startDate.toISOString())

    if (eventsError) throw eventsError

    // Get coaching sessions with satisfaction
    const { data: sessions, error: sessionsError } = await supabase
      .from("ai_coaching_sessions")
      .select("satisfaction_rating, created_at, session_type")
      .gte("created_at", startDate.toISOString())

    if (sessionsError) throw sessionsError

    // Calculate metrics
    const totalQueries = dailyAnalytics?.reduce((sum, day) => sum + (day.total_queries || 0), 0) || 0
    const uniqueUsers = new Set(events?.map((e) => e.user_email).filter(Boolean)).size
    const avgSatisfaction = sessions?.length
      ? sessions.reduce((sum, s) => sum + (s.satisfaction_rating || 0), 0) / sessions.length
      : 0

    // Calculate retention (users who returned after 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: recentUsers, error: recentError } = await supabase
      .from("brain_analytics_events")
      .select("user_email, created_at")
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: true })

    if (recentError) throw recentError

    // Calculate 7-day retention
    const userFirstSeen = new Map()
    const userLastSeen = new Map()

    recentUsers?.forEach((event) => {
      const email = event.user_email
      if (!email) return

      const date = new Date(event.created_at)

      if (!userFirstSeen.has(email) || date < userFirstSeen.get(email)) {
        userFirstSeen.set(email, date)
      }
      if (!userLastSeen.has(email) || date > userLastSeen.get(email)) {
        userLastSeen.set(email, date)
      }
    })

    let retainedUsers = 0
    userFirstSeen.forEach((firstDate, email) => {
      const lastDate = userLastSeen.get(email)
      const daysDiff = (lastDate - firstDate) / (1000 * 60 * 60 * 24)
      if (daysDiff >= 7) {
        retainedUsers++
      }
    })

    const retentionRate = userFirstSeen.size > 0 ? (retainedUsers / userFirstSeen.size) * 100 : 0

    // Event breakdown
    const eventsByCategory = events?.reduce(
      (acc, event) => {
        const category = event.event_category || "unknown"
        acc[category] = (acc[category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Satisfaction by session type
    const satisfactionByType = sessions?.reduce(
      (acc, session) => {
        const type = session.session_type || "general"
        if (!acc[type]) {
          acc[type] = { total: 0, count: 0 }
        }
        acc[type].total += session.satisfaction_rating || 0
        acc[type].count += 1
        return acc
      },
      {} as Record<string, { total: number; count: number }>,
    )

    const satisfactionAverages = Object.entries(satisfactionByType || {}).map(([type, data]) => ({
      type,
      average: data.count > 0 ? data.total / data.count : 0,
      count: data.count,
    }))

    return NextResponse.json({
      success: true,
      metrics: {
        totalQueries,
        uniqueUsers,
        avgSatisfaction: Math.round(avgSatisfaction * 10) / 10,
        retentionRate: Math.round(retentionRate * 10) / 10,
        dailyAnalytics,
        eventsByCategory,
        satisfactionAverages,
      },
    })
  } catch (error: any) {
    console.error("[v0] Metrics error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
