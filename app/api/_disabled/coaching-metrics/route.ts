import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Rate limiting store (simple in-memory for now, can be upgraded to Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count < limit) {
    record.count++
    return true
  }

  return false
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get user with error handling
    let user
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      user = authUser
    } catch (authError) {
      console.error("Auth error:", authError instanceof Error ? authError.message : String(authError))
      // Continue without user for testing
    }

    // Rate limiting per user
    const userId = user?.id || "00000000-0000-0000-0000-000000000000"
    if (!checkRateLimit(userId)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    const body = await request.json()

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

    // Validate required fields
    if (!session_id || message_count === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: session_id, message_count" },
        { status: 400 }
      )
    }

    // Upsert coaching session
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
      console.error("Session error:", sessionError.message)
      return NextResponse.json(
        {
          error: "Failed to create/update session",
          code: sessionError.code,
        },
        { status: 500 },
      )
    }

    // Calculate engagement score
    const engagement_score = Math.min(message_count / 2.0, 1.0)

    const metricsData = {
      user_email: user?.email || "test@despegar.com",
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

    const { data, error } = await supabase.from("coaching_metrics").insert(metricsData).select().single()

    if (error) {
      console.error("Metrics insert error:", error.message)
      return NextResponse.json(
        {
          error: "Failed to save metrics",
          code: error.code,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Coaching metrics API error:", error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Get user with error handling
    let user
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      user = authUser
    } catch (authError) {
      console.error("Auth error:", authError instanceof Error ? authError.message : String(authError))
    }

    // Rate limiting per user
    const userId = user?.id || "00000000-0000-0000-0000-000000000000"
    if (!checkRateLimit(userId, 30, 60000)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

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
      console.error("Metrics fetch error:", error.message)
      return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
    }

    // Calculate aggregate metrics
    const totalSessions = data.length
    const avgEngagement = data.reduce((sum, m) => sum + (m.engagement_score || 0), 0) / totalSessions || 0
    const avgSatisfaction =
      data.filter((m) => m.satisfaction_rating).reduce((sum, m) => sum + m.satisfaction_rating, 0) /
        data.filter((m) => m.satisfaction_rating).length || 0
    const actionsCompleted = data.filter((m) => m.action_completed).length
    const completionRate = actionsCompleted / totalSessions || 0

    const meetsEngagementTarget = avgEngagement >= 1.0
    const meetsSatisfactionTarget = avgSatisfaction >= 4.0
    const meetsActionTarget = completionRate >= 0.5

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
    console.error("Coaching metrics GET error:", error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
