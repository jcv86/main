import { NextRequest, NextResponse } from 'next/server'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'

/**
 * POST /api/a2/generate-identity
 * Uses OpenAI GPT-4o to generate professional identity versions
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

    // Use Vercel AI Gateway for better compatibility
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    })

    const { text } = await generateText({
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

    return NextResponse.json({
      success: true,
      identity_versions: text,
      archetype,
    })
  } catch (error) {
    console.error('[v0] Error generating identity:', error)
    return NextResponse.json(
      { error: 'Failed to generate professional identity' },
      { status: 500 }
    )
  }
}
