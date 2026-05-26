import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, questionIndex, answer, score } = await request.json() as {
      sessionId: string
      questionIndex: number
      answer: string
      score?: number
    }

    if (!sessionId || questionIndex === undefined || !answer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get current session
    const { data: sessionData, error: fetchError } = await supabase
      .from('a3_interview_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !sessionData) {
      console.error('[v0] Session not found:', fetchError)
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Update answers
    const answers = sessionData.answers || {}
    answers[questionIndex] = answer

    // Update scores if provided
    const scores = sessionData.scores || {}
    if (score !== undefined) {
      scores[questionIndex] = score
    }

    // Move to next question
    const nextIndex = Math.min(questionIndex + 1, sessionData.questions.length)

    const { error: updateError } = await supabase
      .from('a3_interview_sessions')
      .update({
        answers,
        scores,
        current_question_index: nextIndex,
        updated_at: new Date().toISOString(),
      })
      .eq('session_id', sessionId)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('[v0] Error updating session:', updateError)
      return NextResponse.json({ error: 'Failed to save answer' }, { status: 500 })
    }

    // Check if interview is complete
    const isComplete = nextIndex >= sessionData.questions.length

    if (isComplete) {
      // Calculate total score
      const totalScore = Object.values(scores as Record<string, number>).reduce((a, b) => a + b, 0)
      const avgScore = totalScore / Object.keys(scores).length

      // Mark as completed
      await supabase
        .from('a3_interview_sessions')
        .update({
          completed_at: new Date().toISOString(),
          total_score: avgScore,
        })
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
    }

    return NextResponse.json({
      success: true,
      sessionId,
      currentQuestionIndex: nextIndex,
      totalQuestions: sessionData.questions.length,
      isComplete,
      nextQuestion: !isComplete ? sessionData.questions[nextIndex] : null,
    })
  } catch (error) {
    console.error('[v0] Error recording answer:', error)
    return NextResponse.json({ error: 'Failed to record answer' }, { status: 500 })
  }
}
