import { OpenAI } from 'openai'
import { NextRequest, NextResponse } from 'next/server'

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

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('[v0] OPENAI_API_KEY not configured')
      return NextResponse.json(
        { error: 'AI service not configured. Please set OPENAI_API_KEY environment variable.' },
        { status: 503 }
      )
    }

    // Initialize OpenAI client with API key
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    console.log('[v0] Generating AI tip for user:', userId, 'isPremium:', isPremium)

    // Generate AI tip using OpenAI
    const tipPrompt = `You are an expert interview coach. Provide ONE concise, actionable tip to improve an interview response.

Question: "${questionText}"
${userResponse ? `Candidate Response: "${userResponse}"` : ''}
Difficulty Level: ${difficulty}
Interview Context: ${questionContext || 'General interview'}

Provide a specific, practical tip that helps the candidate improve their response. Keep it under 2 sentences. Focus on ${
      isPremium ? 'advanced techniques and nuances' : 'fundamental improvement areas'
    }.`

    console.log('[v0] Calling OpenAI with model: gpt-4-turbo')
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
    console.log('[v0] AI tip generated successfully:', tipContent.substring(0, 50) + '...')

    // For now, return the tip without saving to Supabase (to avoid build-time Supabase initialization)
    // In production, you would save this with proper async initialization
    return NextResponse.json({
      success: true,
      tip: tipContent,
      isPremium,
      dtcSpent: isPremium ? 150 : 0
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[v0] Error generating AI tip:', errorMessage)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate tip',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
