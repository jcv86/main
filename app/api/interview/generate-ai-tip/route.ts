import { createClient } from '@supabase/supabase-js'
import { OpenAI } from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      questionText,
      userResponse,
      questionContext,
      difficulty,
      isPremium,
      sessionId
    } = await request.json()

    // Validate user and check DTC balance if premium
    if (isPremium) {
      const { data: balance } = await supabase
        .from('user_dtc_balance')
        .select('balance')
        .eq('user_id', userId)
        .single()

      if (!balance || balance.balance < 150) {
        return NextResponse.json(
          { error: 'Insufficient DTC balance. Need 150 DTC points.' },
          { status: 402 }
        )
      }
    }

    // Generate AI tip using OpenAI
    const tipPrompt = `You are an expert interview coach. Provide ONE concise, actionable tip to improve an interview response.

Question: "${questionText}"
${userResponse ? `Candidate Response: "${userResponse}"` : ''}
Difficulty Level: ${difficulty}
Interview Context: ${questionContext || 'General interview'}

Provide a specific, practical tip that helps the candidate improve their response. Keep it under 2 sentences. Focus on ${
      isPremium ? 'advanced techniques and nuances' : 'fundamental improvement areas'
    }.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'user',
          content: tipPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    })

    const tipContent = completion.choices[0].message.content || ''

    // Save tip usage
    const { data: tipData, error: tipError } = await supabase
      .from('interview_tips_usage')
      .insert([
        {
          user_id: userId,
          interview_session_id: sessionId,
          question_id: questionText.hashCode ? Math.abs(questionText.hashCode()) : null,
          tip_type: isPremium ? 'premium' : 'free',
          ai_tip_content: tipContent,
          confidence_score: 0.85,
          question_context: { difficulty, context: questionContext },
          response_before_tip: userResponse,
          is_premium: isPremium,
          dtc_cost: isPremium ? 150 : 0
        }
      ])
      .select()

    if (tipError) throw tipError

    // If premium, deduct DTC points
    if (isPremium) {
      await supabase.rpc('deduct_dtc_points', {
        p_user_id: userId,
        p_amount: 150,
        p_description: 'Premium interview tip purchased',
        p_related_to: 'interview_tips',
        p_related_id: tipData?.[0]?.id
      })
    }

    return NextResponse.json({
      success: true,
      tip: tipContent,
      tipId: tipData?.[0]?.id,
      isPremium,
      dtcSpent: isPremium ? 150 : 0
    })
  } catch (error) {
    console.error('Error generating AI tip:', error)
    return NextResponse.json(
      { error: 'Failed to generate tip' },
      { status: 500 }
    )
  }
}
