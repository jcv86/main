import { createClient } from '@/lib/supabase/server'
import { buildCoachSystemPrompt, type CoachContext } from '@/lib/coach-ia'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { message, stage = 'a1', disc_profile } = await req.json()

    if (!message) {
      return new Response('Message is required', { status: 400 })
    }

    // Get user's progress for context
    const { data: progress } = await supabase
      .from('user_a1_profiles')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)

    // Build coach context
    const coachContext: CoachContext = {
      user_id: user.id,
      current_stage: stage as any,
      disc_profile: disc_profile || progress?.[0]?.disc_profile,
      progress_percentage: progress?.[0]?.progress_percentage || 0
    }

    // Build system prompt
    const systemPrompt = buildCoachSystemPrompt(coachContext)

    // Stream response from OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
        stream: true,
      }),
    })

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text()
      console.error('[v0] OpenAI API error:', error)
      return new Response('AI service error', { status: 500 })
    }

    // Return the streaming response directly
    return new Response(openaiResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('[v0] Coach IA error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
