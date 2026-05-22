import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

/**
 * POST /api/a2/generate-identity
 * Uses OpenAI GPT-4o to generate professional identity versions
 * Streams results for interactive coaching experience
 */
export async function POST(request: NextRequest) {
  try {
    const { archetype, archetypeDescription, candidateProfile } = await request.json()

    if (!archetype) {
      return NextResponse.json(
        { error: 'Missing archetype' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are an expert personal branding coach who specializes in crafting compelling professional identities.
Generate 3 distinct versions of a professional identity statement for someone who is a ${archetype}.
Each version should be tailored for a specific context and be authentic, compelling, and memorable.

Requirements:
1. SIMPLE: A clear, conversational 1-sentence identity (for casual conversations)
2. RECRUITER: A LinkedIn-ready pitch that highlights impact and expertise (2-3 sentences)
3. INTERVIEW: A structured STAR-format response for "Tell me about yourself" (3-4 sentences)

Make each version authentically different while maintaining core brand consistency.
Include metrics, specific achievements, and clear value propositions where relevant.`

    const userPrompt = `Professional Archetype: ${archetype}
Description: ${archetypeDescription || 'Standard professional'}
${candidateProfile ? `Candidate Profile: ${candidateProfile}` : ''}

Generate 3 tailored identity versions for this professional. Make each version compelling and distinct for its intended context.`

    const { stream } = await streamText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      maxTokens: 800,
    })

    // Return streaming response
    const encoder = new TextEncoder()
    const customStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(encoder.encode(chunk))
        }
        controller.close()
      },
    })

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('[v0] Error generating identity:', error)
    return NextResponse.json(
      { error: 'Failed to generate professional identity' },
      { status: 500 }
    )
  }
}
