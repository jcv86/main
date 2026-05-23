import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  calculateInterviewScore,
} from '@/lib/interview/interview-simulator'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { action, jobId, jobData, questionNumber, userAnswer } = await request.json()

    if (action === 'start') {
      // Generate questions for new interview
      if (!jobData) {
        return NextResponse.json(
          { error: 'jobData required' },
          { status: 400 }
        )
      }

      console.log('[v0] Starting interview for:', jobData.title)

      const questions = await generateInterviewQuestions(jobData, 5)

      // Store interview in DB
      const { data: sessionData, error: sessionError } = await supabase
        .from('a4_interview_simulations')
        .insert({
          user_id: user.id,
          job_id: jobId,
          job_title: jobData.title,
          company: jobData.company,
          status: 'in-progress',
          questions: questions,
          answers: [],
          started_at: new Date().toISOString(),
        })
        .select()

      if (sessionError) {
        console.error('[v0] Error creating session:', sessionError)
        return NextResponse.json(
          { error: 'Failed to create interview session' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        sessionId: sessionData?.[0]?.id,
        questions,
        currentQuestion: 1,
      })
    } else if (action === 'submit_answer') {
      // Evaluate answer and move to next question
      if (!jobId || questionNumber === undefined || !userAnswer) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }

      console.log('[v0] Evaluating question', questionNumber)

      // Get the interview session
      const { data: sessions, error: fetchError } = await supabase
        .from('a4_interview_simulations')
        .select('*')
        .eq('user_id', user.id)
        .eq('job_id', jobId)
        .eq('status', 'in-progress')
        .order('created_at', { ascending: false })
        .limit(1)

      if (fetchError || !sessions?.length) {
        return NextResponse.json(
          { error: 'Interview session not found' },
          { status: 404 }
        )
      }

      const session = sessions[0]
      const question = session.questions[questionNumber - 1]

      // Evaluate answer
      const evaluation = await evaluateInterviewAnswer(question, userAnswer)

      // Update session with answer
      const updatedAnswers = [...(session.answers || []), evaluation]
      const isComplete = questionNumber >= session.questions.length

      const { error: updateError } = await supabase
        .from('a4_interview_simulations')
        .update({
          answers: updatedAnswers,
          status: isComplete ? 'completed' : 'in-progress',
          completed_at: isComplete ? new Date().toISOString() : null,
        })
        .eq('id', session.id)

      if (updateError) {
        console.error('[v0] Error updating session:', updateError)
      }

      return NextResponse.json({
        success: true,
        evaluation,
        isComplete,
        nextQuestion: isComplete ? null : session.questions[questionNumber],
      })
    } else if (action === 'get_results') {
      // Get final results
      if (!jobId) {
        return NextResponse.json(
          { error: 'jobId required' },
          { status: 400 }
        )
      }

      const { data: sessions, error: fetchError } = await supabase
        .from('a4_interview_simulations')
        .select('*')
        .eq('user_id', user.id)
        .eq('job_id', jobId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)

      if (fetchError || !sessions?.length) {
        return NextResponse.json(
          { error: 'No completed interview found' },
          { status: 404 }
        )
      }

      const session = sessions[0]
      const results = calculateInterviewScore(session.answers || [])

      return NextResponse.json({
        success: true,
        sessionId: session.id,
        results,
        answers: session.answers,
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('[v0] Interview simulation error:', error)
    return NextResponse.json(
      {
        error: 'Interview simulation failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
