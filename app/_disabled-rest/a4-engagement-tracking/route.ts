import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

interface EngagementEvent {
  event_type: string
  feature: string
  duration_seconds?: number
  completed?: boolean
  variant?: string
  metadata?: Record<string, any>
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const event: EngagementEvent = await request.json()

    // Get current A4 score
    const { data: scores } = await supabase
      .from("a4_strategic_scores")
      .select("score")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)

    const currentScore = scores?.[0]?.score || 0

    // Track engagement event
    const { error: trackError } = await supabase
      .from("a4_engagement_tracking")
      .insert({
        user_id: user.id,
        event_type: event.event_type,
        feature: event.feature,
        duration_seconds: event.duration_seconds || null,
        completed: event.completed || false,
        variant: event.variant || "standard",
        a4_score_at_event: currentScore,
        metadata: event.metadata || null,
        created_at: new Date().toISOString(),
      })

    if (trackError) throw trackError

    return NextResponse.json({
      success: true,
      recorded_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error tracking engagement:", error)
    return NextResponse.json(
      { error: "Failed to track engagement" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const days = parseInt(url.searchParams.get("days") || "7")
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

    // Get engagement metrics
    const { data: events, error: eventsError } = await supabase
      .from("a4_engagement_tracking")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", startDate)
      .order("created_at", { ascending: false })

    if (eventsError) throw eventsError

    // Calculate metrics
    const metrics = {
      total_events: events?.length || 0,
      total_duration_seconds: events?.reduce((sum, e) => sum + (e.duration_seconds || 0), 0) || 0,
      completed_actions: events?.filter(e => e.completed).length || 0,
      completion_rate: events && events.length > 0 
        ? Math.round((events.filter(e => e.completed).length / events.length) * 100)
        : 0,
      features_engaged: [...new Set(events?.map(e => e.feature))],
      calibration_effectiveness: calculateCalibrationImpact(events),
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("[v0] Error fetching engagement metrics:", error)
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    )
  }
}

function calculateCalibrationImpact(events: any[]) {
  if (!events || events.length === 0) return 0
  
  const calibratedEvents = events.filter(e => e.variant === "calibrated")
  const standardEvents = events.filter(e => e.variant === "standard")

  if (calibratedEvents.length === 0 || standardEvents.length === 0) return 0

  const calibratedCompletionRate = calibratedEvents.filter(e => e.completed).length / calibratedEvents.length
  const standardCompletionRate = standardEvents.filter(e => e.completed).length / standardEvents.length

  const impact = ((calibratedCompletionRate - standardCompletionRate) / standardCompletionRate) * 100
  return Math.round(impact)
}
