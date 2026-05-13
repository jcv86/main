import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { visionRole, visionEnvironment, visionDesiredOutcome, milestones, actionPlan } = body

    const cookieStore = await cookies()
    const demoUserCookie = cookieStore.get('demo_user')
    
    if (!demoUserCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const demoUser = JSON.parse(demoUserCookie.value)
    const userId = demoUser.id

    // Format submission data for analysis
    const submissionText = `
VISION STATEMENT:
Role/Title: ${visionRole}
Ideal Environment: ${visionEnvironment}
Desired 30-Day Outcome: ${visionDesiredOutcome}

MILESTONES:
Day 10: ${milestones?.day10 || 'Not specified'}
Day 20: ${milestones?.day20 || 'Not specified'}
Day 30: ${milestones?.day30 || 'Not specified'}

ACTION PLAN:
${actionPlan ? JSON.stringify(actionPlan, null, 2) : 'Not specified'}
`

    // Use AI to analyze and score - use generateText with JSON parsing
    const { text } = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt: `You are an expert career coach evaluating a professional development plan. 

Analyze this 90-day job search plan and provide scores and feedback in JSON format:

1. VISION CLARITY (0-25): Are the role, environment, and outcomes clear and specific?
2. MILESTONE QUALITY (0-25): Are the 30-day milestones realistic, specific, and well-structured?
3. ACTION COMPLETENESS (0-25): Does the action plan cover all necessary activities?
4. REALISM & COHERENCE (0-25): Is the plan realistic and internally coherent?

SUBMISSION TO ANALYZE:
${submissionText}

Respond ONLY with valid JSON in this exact format (no other text):
{
  "visionClarity": <number 0-25>,
  "milestoneQuality": <number 0-25>,
  "actionCompleteness": <number 0-25>,
  "realismCoherence": <number 0-25>,
  "feedback": "<string>",
  "strengths": ["<strength1>", "<strength2>", ...],
  "improvements": ["<improvement1>", "<improvement2>", ...]
}`,
      temperature: 0.7,
    })

    // Parse JSON response
    let object
    try {
      object = JSON.parse(text)
    } catch (parseError) {
      console.error('[v0] Failed to parse AI response:', text)
      // Provide default scores if parsing fails
      object = {
        visionClarity: 15,
        milestoneQuality: 15,
        actionCompleteness: 15,
        realismCoherence: 15,
        feedback: 'Unable to generate detailed feedback. Please try again.',
        strengths: ['Submitted a plan'],
        improvements: ['Review and resubmit for detailed feedback'],
      }
    }

    const totalScore = object.visionClarity + object.milestoneQuality + object.actionCompleteness + object.realismCoherence
    const passFail = totalScore >= 75 ? 'pass' : 'fail'

    // Store analysis in database
    const supabase = createAdminClient()
    const { data: submission, error: getError } = await supabase
      .from('a2_day1_submissions')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (submission) {
      const { error: updateError } = await supabase
        .from('a2_day1_submissions')
        .update({
          analysis_score: totalScore,
          analysis_result: {
            visionClarity: object.visionClarity,
            milestoneQuality: object.milestoneQuality,
            actionCompleteness: object.actionCompleteness,
            realismCoherence: object.realismCoherence,
            feedback: object.feedback,
            strengths: object.strengths,
            improvements: object.improvements,
          },
          analysis_status: 'completed',
          pass_fail_status: passFail,
          updated_at: new Date().toISOString(),
          ...(passFail === 'pass' && { completed_at: new Date().toISOString() }),
        })
        .eq('id', submission.id)

      if (updateError) {
        console.error('[v0] Error updating analysis:', updateError)
      }
    }

    return NextResponse.json({
      success: true,
      analysis: {
        totalScore,
        passFail,
        scores: {
          visionClarity: object.visionClarity,
          milestoneQuality: object.milestoneQuality,
          actionCompleteness: object.actionCompleteness,
          realismCoherence: object.realismCoherence,
        },
        feedback: object.feedback,
        strengths: object.strengths,
        improvements: object.improvements,
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
