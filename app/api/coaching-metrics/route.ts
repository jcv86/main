import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("[v0] Starting coaching metrics POST request")
    const supabase = await createClient()

    // Get user (optional for testing)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log("[v0] User auth result:", { hasUser: !!user })

    const body = await request.json()
    console.log("[v0] Request body:", body)

    const {
      session_id,
      message_count,
      satisfaction_rating,
      satisfaction_feedback,
      suggested_action,
      action_completed,
      action_notes,
      coach_type,
      conversation_category,
    } = body

    const userId = user?.id || "00000000-0000-0000-0000-000000000000"

    console.log("[v0] Ensuring coaching session exists:", session_id)
    const { error: sessionError } = await supabase.from("coaching_sessions").upsert(
      {
        id: session_id,
        user_id: userId,
        session_title: `${coach_type} - ${conversation_category}`,
        total_messages: message_count,
        last_activity: new Date().toISOString(),
        context_snapshot: {
          coach_type,
          conversation_category,
          suggested_action,
        },
      },
      {
        onConflict: "id",
      },
    )

    if (sessionError) {
      console.error("[v0] Error creating/updating session:", sessionError)
      return NextResponse.json(
        {
          error: sessionError.message,
          details: sessionError.details,
          hint: sessionError.hint,
          code: sessionError.code,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Coaching session ensured")

    // Calculate engagement score (target: 2 messages)
    const engagement_score = Math.min(message_count / 2.0, 1.0)

    const metricsData = {
      user_email: user?.email || "test@despegar.com", // Use test email if no user
      session_id,
      message_count,
      engagement_score,
      satisfaction_rating,
      satisfaction_feedback,
      suggested_action,
      action_completed,
      action_completed_at: action_completed ? new Date().toISOString() : null,
      action_notes,
      coach_type,
      conversation_category,
      updated_at: new Date().toISOString(),
    }

    console.log("[v0] Attempting to insert metrics:", metricsData)

    const { data, error } = await supabase.from("coaching_metrics").insert(metricsData).select().single()

    if (error) {
      console.error("[v0] Error saving coaching metrics:", error)
      console.error("[v0] Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Successfully saved metrics:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Error in coaching metrics API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Get user (optional for testing)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { searchParams } = new URL(request.url)
    const session_id = searchParams.get("session_id")

    let query = supabase.from("coaching_metrics").select("*").order("created_at", { ascending: false })

    if (user?.email) {
      query = query.eq("user_email", user.email)
    }

    if (session_id) {
      query = query.eq("session_id", session_id)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching coaching metrics:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate aggregate metrics
    const totalSessions = data.length
    const avgEngagement = data.reduce((sum, m) => sum + (m.engagement_score || 0), 0) / totalSessions || 0
    const avgSatisfaction =
      data.filter((m) => m.satisfaction_rating).reduce((sum, m) => sum + m.satisfaction_rating, 0) /
        data.filter((m) => m.satisfaction_rating).length || 0
    const actionsCompleted = data.filter((m) => m.action_completed).length
    const completionRate = actionsCompleted / totalSessions || 0

    // Check if metrics meet targets (from document pages 61-63)
    const meetsEngagementTarget = avgEngagement >= 1.0 // 2+ messages
    const meetsSatisfactionTarget = avgSatisfaction >= 4.0 // 4+ stars
    const meetsActionTarget = completionRate >= 0.5 // 50%+ completion

    return NextResponse.json({
      metrics: data,
      aggregates: {
        totalSessions,
        avgEngagement: avgEngagement.toFixed(2),
        avgSatisfaction: avgSatisfaction.toFixed(1),
        actionsCompleted,
        completionRate: (completionRate * 100).toFixed(1) + "%",
        meetsEngagementTarget,
        meetsSatisfactionTarget,
        meetsActionTarget,
      },
    })
  } catch (error) {
    console.error("[v0] Error in coaching metrics GET:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
