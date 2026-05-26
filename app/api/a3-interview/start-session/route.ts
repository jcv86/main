import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createInterviewSession } from '@/lib/dtc-agentos/a3-interview-engine'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { moduleId, level = 'basic' } = await request.json() as {
      moduleId: string
      level?: 'basic' | 'advanced' | 'pro'
    }

    if (!moduleId) {
      return NextResponse.json({ error: 'Module ID required' }, { status: 400 })
    }

    const result = await createInterviewSession(user.id, moduleId, level)

    if (!result.success) {
      console.error('[v0] Failed to create interview session:', result.error)
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Store session in Supabase for persistence
    const { error: sessionError } = await supabase
      .from('a3_interview_sessions')
      .insert({
        user_id: user.id,
        session_id: result.session!.sessionId,
        module_id: moduleId,
        level,
        questions: result.session!.questions,
        current_question_index: 0,
        answers: {},
        scores: {},
        started_at: new Date().toISOString(),
      })

    if (sessionError) {
      console.error('[v0] Error storing session:', sessionError)
      // Don't fail - session exists in memory
    }

    return NextResponse.json({
      success: true,
      session: {
        sessionId: result.session!.sessionId,
        moduleId: result.session!.moduleId,
        level: result.session!.level,
        totalQuestions: result.session!.questions.length,
        currentQuestionIndex: 0,
        firstQuestion: result.session!.questions[0],
      },
    })
  } catch (error) {
    console.error('[v0] Error starting interview:', error)
    return NextResponse.json({ error: 'Failed to start interview' }, { status: 500 })
  }
}
