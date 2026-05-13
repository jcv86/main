import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const demoUserCookie = cookieStore.get('demo_user')
    
    if (!demoUserCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Placeholder analysis with mock scores
    const mockAnalysis = {
      visionClarity: 18,
      milestoneQuality: 16,
      actionCompleteness: 17,
      realismCoherence: 16,
      totalScore: 67,
      passFail: 'fail',
      feedback: 'Your plan has good structure. To improve your score, make your goals more specific and actionable.',
      strengths: [
        'Clear role targeting',
        'Realistic 30-day milestones',
        'Diverse action plan'
      ],
      improvements: [
        'Add specific metrics and KPIs',
        'Include contingency plans',
        'Define success criteria more precisely'
      ]
    }

    return NextResponse.json({
      success: true,
      analysis: {
        totalScore: mockAnalysis.totalScore,
        passFail: mockAnalysis.passFail,
        scores: {
          visionClarity: mockAnalysis.visionClarity,
          milestoneQuality: mockAnalysis.milestoneQuality,
          actionCompleteness: mockAnalysis.actionCompleteness,
          realismCoherence: mockAnalysis.realismCoherence,
        },
        feedback: mockAnalysis.feedback,
        strengths: mockAnalysis.strengths,
        improvements: mockAnalysis.improvements,
      },
      message: 'Placeholder analysis - AI integration coming soon'
    })
  } catch (error) {
    console.error('[v0] Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze submission' },
      { status: 500 }
    )
  }
}
