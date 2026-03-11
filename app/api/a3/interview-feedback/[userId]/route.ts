import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface InterviewResponse {
  questionId: string
  responseText: string
  videoDurationSeconds?: number
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const supabase = await createClient()
    const { userId } = params
    const body = await request.json()

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      sessionId,
      questionId,
      responseText,
      videoDurationSeconds,
      interviewType = 'behavioral'
    } = body

    console.log(`[v0] Processing A3 response from user ${userId}`)

    // Get the question details
    const { data: question } = await supabase
      .from('a3_preguntas_entrevista')
      .select('*')
      .eq('id', questionId)
      .maybeSingle()

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    // Get user DISC profile for personalized feedback
    const { data: a1Results } = await supabase
      .from('a1_tests_results')
      .select('result, profile_type')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const userProfile = a1Results?.profile_type || 'D'

    // Call OpenAI API directly for interview feedback
    console.log('[v0] Calling OpenAI API directly for A3 interview feedback')
    
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set')
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `
You are an expert interview coach analyzing a candidate's response to an interview question.

Interview Type: ${interviewType}
Candidate DISC Profile: ${userProfile}
Question: "${question.pregunta}"
Suggested Answer: "${question.sugerencia_respuesta}"
Candidate's Response: "${responseText}"

Provide structured feedback in JSON format ONLY (no additional text):
{
  "scores": {
    "content": 0-100,
    "delivery": 0-100,
    "confidence": 0-100
  },
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["area1", "area2", "area3"],
  "specificFeedback": "Personalized feedback based on their DISC profile",
  "nextSteps": "Recommended practice area",
  "recommendedQuestions": ["follow-up1", "follow-up2"]
}

Be specific and constructive. Consider the candidate's DISC profile (${userProfile}) in your feedback.
`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json()
      console.error('[v0] OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${error.error?.message || openaiResponse.statusText}`)
    }

    const openaiData = await openaiResponse.json()
    const feedbackText = openaiData.choices?.[0]?.message?.content || ''
    console.log('[v0] OpenAI feedback received:', feedbackText.substring(0, 100) + '...')

    let feedback

    try {
      // Extract JSON from the response
      const jsonMatch = feedbackText.match(/\{[\s\S]*\}/)
      feedback = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
    } catch (e) {
      console.error('[v0] Error parsing AI feedback:', e)
      feedback = {
        scores: { content: 75, delivery: 80, confidence: 78 },
        strengths: ['Clear articulation', 'Relevant examples'],
        improvements: ['More specific metrics', 'Stronger conclusion'],
        specificFeedback: feedbackText,
        nextSteps: 'Practice with more examples'
      }
    }

    // Calculate overall score
    const overallScore = Math.round(
      (feedback.scores?.content + feedback.scores?.delivery + feedback.scores?.confidence) / 3
    )

    // Save the response and feedback
    const { data: savedResponse } = await supabase
      .from('a3_respuestas_entrevista')
      .insert({
        sesion_id: sessionId,
        pregunta_id: questionId,
        respuesta_usuario: responseText,
        score_calidad: overallScore,
        feedback_ia: feedback,
        areas_mejora: feedback.improvements,
        puntos_fuertes: feedback.strengths,
        tiempo_respuesta: videoDurationSeconds || 60,
        created_at: new Date().toISOString()
      })
      .select()

    // Update session progress
    const { data: session } = await supabase
      .from('a3_entrevistas_sesiones')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle()

    if (session) {
      const modulosCompletados = (session.modulos_completados || {}) as Record<string, boolean>
      modulosCompletados[questionId] = true

      await supabase
        .from('a3_entrevistas_sesiones')
        .update({
          modulos_completados: modulosCompletados,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
    }

    // Save AI feedback entry
    await supabase
      .from('a3_entrevista_feedback_ia')
      .insert({
        sesion_id: sessionId,
        pregunta: question.pregunta,
        respuesta_usuario: responseText,
        score_contenido: feedback.scores?.content || 75,
        score_entrega: feedback.scores?.delivery || 75,
        score_confianza: feedback.scores?.confidence || 75,
        analisis_fortalezas: feedback.strengths,
        areas_mejora: feedback.improvements,
        sugerencias_especificas: feedback.specificFeedback,
        recomendacion_siguiente: feedback.nextSteps,
        creado_at: new Date().toISOString()
      })

    // Log engagement
    await supabase
      .from('a4_engagement_tracking')
      .insert({
        user_id: userId,
        event_type: 'interview_simulation',
        feature: 'a3_training',
        completed: true,
        duration_seconds: videoDurationSeconds || 60,
        created_at: new Date().toISOString()
      })

    console.log(`[v0] A3 response processed with score: ${overallScore}`)

    return NextResponse.json({
      success: true,
      score: overallScore,
      feedback,
      sessionId,
      responseId: savedResponse?.[0]?.id
    })
  } catch (error) {
    console.error('[v0] Error processing A3 response:', error)
    return NextResponse.json(
      { error: 'Failed to process interview response' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const supabase = await createClient()
    const { userId } = params
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get session feedback
    let query = supabase
      .from('a3_entrevista_feedback_ia')
      .select('*')

    if (sessionId) {
      query = query.eq('sesion_id', sessionId)
    }

    const { data: feedbackHistory } = await query.order('creado_at', {
      ascending: false
    })

    // Get progress stats
    const { data: progress } = await supabase
      .from('a3_progreso_entrevistas')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    return NextResponse.json({
      feedbackHistory: feedbackHistory || [],
      progress,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[v0] Error fetching A3 feedback:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}
