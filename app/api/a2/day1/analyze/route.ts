import { NextResponse } from 'next/server'
import { scoreDay1Submission, formatScoringResult } from '@/lib/a2-dtc-scoring'
import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(request: Request) {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const visionRole = stringValue(body.visionRole)
    const visionDesiredOutcome = stringValue(body.visionDesiredOutcome)
    const visionEnvironment = stringValue(body.visionEnvironment)
    const milestoneDay10 = stringValue(body.milestoneDay10)
    const milestoneDay20 = stringValue(body.milestoneDay20)
    const milestoneDay30 = stringValue(body.milestoneDay30)
    const actionPlan =
      body.actionPlan && typeof body.actionPlan === 'object' && !Array.isArray(body.actionPlan)
        ? body.actionPlan
        : {}

    const userId = currentUser.id
    const submission = {
      userId,
      submissionId: `dtc-${userId}-${Date.now()}`,
      visionRole,
      visionDesiredOutcome,
      visionEnvironment,
      milestoneDay10,
      milestoneDay20,
      milestoneDay30,
      actionPlan,
      createdAt: new Date(),
    }

    const scoringResult = scoreDay1Submission(submission)
    const now = new Date().toISOString()
    const supabase = createAdminClient()
    const payload = {
      user_id: userId,
      vision_role: visionRole,
      vision_environment: visionEnvironment,
      vision_desired_outcome: visionDesiredOutcome,
      milestone_day10: milestoneDay10,
      milestone_day20: milestoneDay20,
      milestone_day30: milestoneDay30,
      action_plan: actionPlan,
      analysis_score: scoringResult.totalScore,
      pass_fail_status: scoringResult.passed ? 'pass' : 'needs_revision',
      analysis_status: 'completed',
      analysis_result: {
        criteria: scoringResult.criteria,
        breakdown: scoringResult.breakdown,
        recommendations: scoringResult.recommendations,
      },
      updated_at: now,
      completed_at: scoringResult.passed ? now : null,
    }

    const { data: existing, error: lookupError } = await supabase
      .from('a2_day1_submissions')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (lookupError) {
      console.error('[v0] Error finding Day 1 submission:', lookupError)
      return NextResponse.json({ error: 'Failed to save analysis' }, { status: 500 })
    }

    const { error: saveError } = existing
      ? await supabase.from('a2_day1_submissions').update(payload).eq('id', existing.id)
      : await supabase.from('a2_day1_submissions').insert({
          ...payload,
          created_at: now,
        })

    if (saveError) {
      console.error('[v0] Error saving Day 1 analysis:', saveError)
      return NextResponse.json({ error: 'Failed to save analysis' }, { status: 500 })
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
    console.error('[v0] Day 1 analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze submission' }, { status: 500 })
  }
}
