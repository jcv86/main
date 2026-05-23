import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { checkRateLimit, rateLimiters } from "@/lib/middleware/rate-limit"
import { success, error, ApiErrors, validateRequired, logger } from "@/lib/api/error-handler"

export async function POST(request: Request) {
  try {
    // Check rate limit for AI endpoints
    const rateLimitResponse = await checkRateLimit(request, rateLimiters.ai)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const supabase = await createClient()

    // Get user with error handling
    let user
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      user = authUser
    } catch (authError) {
      logger.warn('Auth check failed', { error: authError instanceof Error ? authError.message : String(authError) })
      // Continue without user for testing
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
    const validation = validateRequired(body, ['session_id', 'message_count'])
    if (!validation.valid) {
      return error(
        {
          ...ApiErrors.INVALID_REQUEST,
          message: `Missing required fields: ${validation.missing.join(', ')}`,
        },
        { missing: validation.missing }
      )
    }

    // Rate limiting per user
    const userId = user?.id || "00000000-0000-0000-0000-000000000000"

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
      logger.error('Session creation failed', { message: sessionError.message, code: sessionError.code })
      return error(
        {
          ...ApiErrors.INTERNAL_ERROR,
          message: "Failed to create/update session",
        },
        { sessionError: sessionError.message }
      )
    }

    const { data, error: metricsError } = await supabase.from("coaching_metrics").insert(metricsData).select().single()

    if (metricsError) {
      logger.error('Metrics insertion failed', { message: metricsError.message, code: metricsError.code })
      return error(
        {
          ...ApiErrors.INTERNAL_ERROR,
          message: "Failed to save metrics",
        },
        { metricsError: metricsError.message }
      )
    }

    logger.info('Coaching metrics saved successfully', { session_id, user_id: userId })
    return success({ success: true, data })
  } catch (err) {
    logger.error('Coaching metrics POST error', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    })
    return error(ApiErrors.INTERNAL_ERROR)
  }
}

export async function GET(request: Request) {
  try {
    // Check rate limit for API endpoints (less strict)
    const rateLimitResponse = await checkRateLimit(request, rateLimiters.api)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const supabase = await createClient()

    // Get user with error handling
    let user
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      user = authUser
    } catch (authError) {
      logger.warn('Auth check failed during GET', { error: authError instanceof Error ? authError.message : String(authError) })
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

    const { data, error: fetchError } = await query

    if (fetchError) {
      logger.error('Metrics fetch failed', { message: fetchError.message, code: fetchError.code })
      return error(
        {
          ...ApiErrors.INTERNAL_ERROR,
          message: "Failed to fetch metrics",
        },
        { fetchError: fetchError.message }
      )
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

    logger.info('Coaching metrics retrieved', { total_sessions: totalSessions, user_email: user?.email })

    return success({
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
  } catch (err) {
    logger.error('Coaching metrics GET error', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    })
    return error(ApiErrors.INTERNAL_ERROR)
  }
}
