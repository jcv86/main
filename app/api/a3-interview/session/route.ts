import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionId = request.nextUrl.searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    const { data: session, error } = await supabase
      .from('a3_interview_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (error || !session) {
      console.error('[v0] Session not found:', error)
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const isComplete = session.completed_at !== null
    const currentQuestionIndex = Math.min(
      session.current_question_index,
      session.questions.length - 1
    )

    return NextResponse.json({
      success: true,
      sessionId: session.session_id,
      moduleId: session.module_id,
      level: session.level,
      totalQuestions: session.questions.length,
      currentQuestionIndex,
      currentQuestion: session.questions[currentQuestionIndex],
      isComplete,
      totalScore: session.total_score,
      answeredCount: Object.keys(session.answers || {}).length,
      startedAt: session.started_at,
      completedAt: session.completed_at,
    })
  } catch (error) {
    console.error('[v0] Error fetching session:', error)
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 })
  }
}
