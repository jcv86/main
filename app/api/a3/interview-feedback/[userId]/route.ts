import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { NextRequest, NextResponse } from 'next/server'

const MAX_RESPONSE_LENGTH = 8000

type AtomicCompletionResult = {
  response_id: string
  inserted: boolean
  stored_score: number
  stored_feedback: string
  current_xp: number
  total_xp: number
  interview_streak: number
  best_interview_streak: number
  total_interviews_completed: number
  current_level: string
}

function parseStoredFeedback(value: unknown): Record<string, any> {
  if (value && typeof value === 'object') return value as Record<string, any>
  if (typeof value !== 'string' || !value.trim()) return {}

  try {
    return JSON.parse(value) as Record<string, any>
  } catch {
    return { specificFeedback: value }
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params
    const currentUser = await resolveServerUser()

    if (!currentUser || currentUser.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      sessionId,
      questionId,
      responseText,
      videoDurationSeconds,
      interviewType = 'behavioral',
    } = body

    if (
      typeof sessionId !== 'string' ||
      typeof questionId !== 'string' ||
      typeof responseText !== 'string' ||
      responseText.trim().length === 0 ||
      responseText.length > MAX_RESPONSE_LENGTH
    ) {
      return NextResponse.json({ error: 'Invalid interview response' }, { status: 400 })
    }

    const safeDuration = Math.max(
      1,
      Math.min(
        3600,
        Number.isFinite(Number(videoDurationSeconds))
          ? Math.round(Number(videoDurationSeconds))
          : 60,
      ),
    )
    const safeInterviewType =
      typeof interviewType === 'string' ? interviewType.slice(0, 50) : 'behavioral'
    const supabase = createAdminClient()

    const { data: session, error: sessionError } = await supabase
      .from('a3_entrevistas_sesiones')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .maybeSingle()

    if (sessionError) {
      console.error('[v0] Error verifying interview session:', sessionError)
      return NextResponse.json({ error: 'Failed to verify session' }, { status: 500 })
    }

    if (!session) {
      return NextResponse.json({ error: 'Interview session not found' }, { status: 404 })
    }

    const { data: question, error: questionError } = await supabase
      .from('a3_preguntas_entrevista')
      .select('*')
      .eq('id', questionId)
      .maybeSingle()

    if (questionError) {
      console.error('[v0] Error fetching interview question:', questionError)
      return NextResponse.json({ error: 'Failed to fetch question' }, { status: 500 })
    }

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Avoid a second model call for ordinary retries. The database function below
    // remains the final idempotency gate for genuinely concurrent requests.
    const { data: previousResponse, error: previousResponseError } = await supabase
      .from('a3_respuestas_entrevista')
      .select('id, score_calidad, feedback_ia')
      .eq('sesion_id', sessionId)
      .eq('pregunta_id', questionId)
      .maybeSingle()

    if (previousResponseError) {
      console.error('[v0] Error checking previous interview response:', previousResponseError)
      return NextResponse.json({ error: 'Failed to verify previous response' }, { status: 500 })
    }

    if (previousResponse) {
      return NextResponse.json({
        success: true,
        repeated: true,
        score: previousResponse.score_calidad || 0,
        feedback: parseStoredFeedback(previousResponse.feedback_ia),
        sessionId,
        responseId: previousResponse.id,
        xpAwarded: 0,
      })
    }

    const { data: a1Results } = await supabase
      .from('a1_tests_results')
      .select('result, profile_type')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const userProfile = a1Results?.profile_type || 'D'
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'Interview feedback is unavailable' }, { status: 503 })
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `You are an expert interview coach analyzing a candidate response.

Interview Type: ${safeInterviewType}
Candidate DISC Profile: ${userProfile}
Question: "${question.pregunta}"
Suggested Answer: "${question.sugerencia_respuesta}"
Candidate Response: "${responseText.trim()}"

Return JSON only:
{
  "scores": { "content": 0-100, "delivery": 0-100, "confidence": 0-100 },
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["area1", "area2", "area3"],
  "specificFeedback": "Personalized feedback based on the DISC profile",
  "nextSteps": "Recommended practice area",
  "recommendedQuestions": ["follow-up1", "follow-up2"]
}`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      const openaiError = await openaiResponse.text()
      console.error('[v0] OpenAI API error:', openaiError)
      return NextResponse.json({ error: 'Failed to generate interview feedback' }, { status: 502 })
    }

    const openaiData = await openaiResponse.json()
    const feedbackText = openaiData.choices?.[0]?.message?.content || ''
    let feedback: Record<string, any>

    try {
      const jsonMatch = feedbackText.match(/\{[\s\S]*\}/)
      feedback = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
    } catch (parseError) {
      console.error('[v0] Error parsing AI feedback:', parseError)
      feedback = {
        scores: { content: 75, delivery: 75, confidence: 75 },
        strengths: ['Respuesta completada'],
        improvements: ['Practicar con ejemplos más específicos'],
        specificFeedback: feedbackText,
        nextSteps: 'Practicar una nueva respuesta',
      }
    }

    const scoreValues = [
      Number(feedback.scores?.content),
      Number(feedback.scores?.delivery),
      Number(feedback.scores?.confidence),
    ].map((value) => (Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 75))
    const overallScore = Math.round(
      scoreValues.reduce((sum, value) => sum + value, 0) / scoreValues.length,
    )
    const strengths = Array.isArray(feedback.strengths)
      ? feedback.strengths.filter((value): value is string => typeof value === 'string')
      : []
    const improvements = Array.isArray(feedback.improvements)
      ? feedback.improvements.filter((value): value is string => typeof value === 'string')
      : []
    const calculatedXp = overallScore >= 85 ? 150 : overallScore >= 70 ? 100 : 50

    const { data: atomicRows, error: atomicError } = await supabase.rpc(
      'complete_a3_interview_response',
      {
        p_user_id: userId,
        p_session_id: sessionId,
        p_question_id: questionId,
        p_response_text: responseText.trim(),
        p_score: overallScore,
        p_feedback: JSON.stringify(feedback),
        p_improvements: improvements,
        p_strengths: strengths,
        p_duration: safeDuration,
        p_xp: calculatedXp,
      },
    )

    if (atomicError) {
      console.error('[v0] Error completing interview response atomically:', atomicError)
      return NextResponse.json({ error: 'Failed to save interview response' }, { status: 500 })
    }

    const atomicResult = (Array.isArray(atomicRows) ? atomicRows[0] : atomicRows) as
      | AtomicCompletionResult
      | null

    if (!atomicResult) {
      return NextResponse.json({ error: 'Interview completion returned no result' }, { status: 500 })
    }

    if (!atomicResult.inserted) {
      return NextResponse.json({
        success: true,
        repeated: true,
        score: atomicResult.stored_score,
        feedback: parseStoredFeedback(atomicResult.stored_feedback),
        sessionId,
        responseId: atomicResult.response_id,
        xpAwarded: 0,
        totalXp: atomicResult.total_xp,
      })
    }

    const now = new Date().toISOString()
    const completedModules = {
      ...((session.modulos_completados || {}) as Record<string, boolean>),
      [questionId]: true,
    }

    const { error: sessionUpdateError } = await supabase
      .from('a3_entrevistas_sesiones')
      .update({ modulos_completados: completedModules, updated_at: now })
      .eq('id', sessionId)
      .eq('user_id', userId)

    if (sessionUpdateError) {
      console.error('[v0] Error updating interview session:', sessionUpdateError)
    }

    const { error: feedbackError } = await supabase
      .from('a3_entrevista_feedback_ia')
      .insert({
        sesion_id: sessionId,
        pregunta: question.pregunta,
        respuesta_usuario: responseText.trim(),
        score_contenido: scoreValues[0],
        score_entrega: scoreValues[1],
        score_confianza: scoreValues[2],
        analisis_fortalezas: strengths,
        areas_mejora: improvements,
        sugerencias_especificas:
          typeof feedback.specificFeedback === 'string' ? feedback.specificFeedback : '',
        recomendacion_siguiente:
          typeof feedback.nextSteps === 'string' ? feedback.nextSteps : '',
        creado_at: now,
      })

    if (feedbackError) {
      console.error('[v0] Error saving interview feedback:', feedbackError)
    }

    const { error: engagementError } = await supabase.from('a4_engagement_tracking').insert({
      user_id: userId,
      event_type: 'interview_simulation',
      feature: 'a3_training',
      completed: true,
      duration_seconds: safeDuration,
      created_at: now,
    })

    if (engagementError) {
      console.error('[v0] Error saving interview engagement:', engagementError)
    }

    return NextResponse.json({
      success: true,
      repeated: false,
      score: atomicResult.stored_score,
      feedback,
      sessionId,
      responseId: atomicResult.response_id,
      xpAwarded: calculatedXp,
      totalXp: atomicResult.total_xp,
    })
  } catch (error) {
    console.error('[v0] Error processing A3 response:', error)
    return NextResponse.json({ error: 'Failed to process interview response' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params
    const currentUser = await resolveServerUser()

    if (!currentUser || currentUser.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionId = request.nextUrl.searchParams.get('sessionId')
    const supabase = createAdminClient()

    const { data: sessions, error: sessionsError } = await supabase
      .from('a3_entrevistas_sesiones')
      .select('id')
      .eq('user_id', userId)

    if (sessionsError) {
      console.error('[v0] Error fetching user interview sessions:', sessionsError)
      return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
    }

    const sessionIds = (sessions || []).map((session) => session.id)

    if (sessionId && !sessionIds.includes(sessionId)) {
      return NextResponse.json({ error: 'Interview session not found' }, { status: 404 })
    }

    let feedbackHistory: any[] = []
    if (sessionIds.length > 0) {
      let feedbackQuery = supabase
        .from('a3_entrevista_feedback_ia')
        .select('*')
        .in('sesion_id', sessionIds)
        .order('creado_at', { ascending: false })

      if (sessionId) {
        feedbackQuery = feedbackQuery.eq('sesion_id', sessionId)
      }

      const { data, error: feedbackHistoryError } = await feedbackQuery
      if (feedbackHistoryError) {
        console.error('[v0] Error fetching A3 feedback:', feedbackHistoryError)
        return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
      }
      feedbackHistory = data || []
    }

    const { data: progress, error: progressError } = await supabase
      .from('a3_progreso_entrevistas')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (progressError) {
      console.error('[v0] Error fetching interview progress:', progressError)
    }

    return NextResponse.json({
      feedbackHistory,
      progress,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Error fetching A3 feedback:', error)
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
  }
}
