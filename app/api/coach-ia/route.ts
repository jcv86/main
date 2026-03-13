import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createClient } from '@/lib/supabase/server'
import { buildCoachSystemPrompt, type CoachContext } from '@/lib/coach-ia'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    
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

    // Stream response from AI
    const result = await streamText({
      model: openai('gpt-4-turbo'),
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    // Return streaming response
    return result.toTextStreamResponse()
  } catch (error) {
    console.error('[v0] Coach IA error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
