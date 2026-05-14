import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { scoreDay1Submission, formatScoringResult } from '@/lib/a2-dtc-scoring'
import { createAdminClient } from '@/lib/supabase/server'

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

    let userId: string | null = null
    try {
      const demoUser = JSON.parse(demoUserCookie.value)
      userId = demoUser.id
    } catch {
      return NextResponse.json(
        { error: 'Invalid authentication' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      visionRole,
      visionDesiredOutcome,
      visionEnvironment,
      milestoneDay10,
      milestoneDay20,
      milestoneDay30,
      actionPlan,
    } = body

    // Create submission object for scoring
    const submission = {
      userId,
      submissionId: `dtc-${userId}-${Date.now()}`,
      visionRole: visionRole || '',
      visionDesiredOutcome: visionDesiredOutcome || '',
      visionEnvironment: visionEnvironment || '',
      milestoneDay10: milestoneDay10 || '',
      milestoneDay20: milestoneDay20 || '',
      milestoneDay30: milestoneDay30 || '',
      actionPlan: actionPlan || {},
      createdAt: new Date(),
    }

    // Score the submission using real DTC scoring logic
    const scoringResult = scoreDay1Submission(submission)

    console.log('[v0] Day 1 DTC Scoring:', {
      userId,
      totalScore: scoringResult.totalScore,
      passed: scoringResult.passed,
      criteria: scoringResult.criteria,
    })

    // Save to database
    const supabase = createAdminClient()
    const { error: saveError } = await supabase
      .from('a2_day1_submissions')
      .update({
        analysis_score: scoringResult.totalScore,
        pass_fail_status: scoringResult.passed ? 'pass' : 'needs_revision',
        analysis_result: {
          criteria: scoringResult.criteria,
          breakdown: scoringResult.breakdown,
          recommendations: scoringResult.recommendations,
        },
        updated_at: new Date(),
      })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)

    if (saveError) {
      console.error('[v0] Error saving analysis:', saveError)
    }

    return NextResponse.json({
      success: true,
      analysis: {
        totalScore: scoringResult.totalScore,
        passed: scoringResult.passed,
        status: scoringResult.passed ? 'pass' : 'needs_revision',
        scores: {
          visionClarity: scoringResult.criteria.visionClarity,
          milestoneQuality: scoringResult.criteria.milestoneQuality,
          completeness: scoringResult.criteria.completeness,
          realism: scoringResult.criteria.realism,
        },
        breakdown: scoringResult.breakdown,
        recommendations: scoringResult.recommendations,
        formattedResult: formatScoringResult(scoringResult),
      },
    })
  } catch (error) {
    console.error('[v0] Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze submission' },
      { status: 500 }
    )
  }
}
