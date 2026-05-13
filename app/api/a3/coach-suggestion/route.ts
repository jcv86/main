import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { question, answer, context } = await request.json()

    // Get user ID from session
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Call OpenAI to generate coaching suggestion
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an expert career coach helping candidates improve their interview answers and professional development. 
Provide brief, actionable suggestions in Spanish to help them improve their response. 
Keep suggestions concise (2-3 sentences max).
Focus on clarity, impact, and relevance to the role.`
        },
        {
          role: 'user',
          content: `Question: ${question}\n\nCandidate's Answer: ${answer}\n\nContext: ${context}\n\nProvide a brief coaching suggestion to improve this answer.`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    })

    const suggestion = completion.choices[0]?.message?.content || 'No suggestion available'

    // Log coaching interaction for analytics
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { error } = await supabase
          .from('coaching_interactions')
          .insert({
            user_id: user.id,
            question,
            user_answer: answer,
            coach_suggestion: suggestion,
            created_at: new Date().toISOString()
          })
        if (error) {
          console.error('[v0] Error logging coaching interaction:', error)
        }
      }
    } catch (logError) {
      console.error('[v0] Error in coaching interaction logging:', logError)
    }

    return NextResponse.json({ suggestion })
  } catch (error) {
    console.error('[v0] Coach suggestion error:', error)
    return NextResponse.json(
      { error: 'Failed to generate suggestion' },
      { status: 500 }
    )
  }
}
