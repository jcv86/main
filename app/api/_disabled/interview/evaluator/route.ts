import { NextRequest, NextResponse } from 'next/server'
import { generateInterviewerFeedback } from '@/lib/interviewer-agents'

export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const { interviewerId, question, userResponse, questionCategory, difficulty } = await request.json()

    // Validate required fields
    if (!interviewerId || !question || !userResponse || !questionCategory || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate intelligent feedback using the interviewer agent
    const feedbackResult = await generateInterviewerFeedback(
      interviewerId,
      question,
      userResponse,
      questionCategory,
      difficulty as 'basico' | 'intermedio' | 'avanzado'
    )

    return NextResponse.json({
      success: true,
      score: feedbackResult.score,
      feedback: feedbackResult.feedback,
      followUp: feedbackResult.followUp
    })
  } catch (error) {
    console.error('[v0] Interviewer feedback error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate feedback' },
      { status: 500 }
    )
  }
}
