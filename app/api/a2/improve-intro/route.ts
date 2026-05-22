import { NextRequest, NextResponse } from 'next/server'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'

/**
 * POST /api/a2/improve-intro
 * Uses OpenAI GPT-4o to improve intro text based on feedback
 */
export async function POST(request: NextRequest) {
  try {
    const { versionA, versionB, selectedVersion, userContext } = await request.json()

    if (!versionA || !versionB || !selectedVersion) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const selectedText = selectedVersion === 'a' ? versionA : versionB

    const systemPrompt = `You are a professional branding coach helping someone improve their professional introduction. 
Your goal is to enhance their introduction to be more compelling, authentic, and memorable.
Provide specific, actionable improvements that make the introduction:
1. More impactful and memorable
2. Clearer about unique value proposition
3. More engaging and human
4. Professional yet approachable

Respond with:
- 2-3 specific improvements to make
- A revised version of their introduction
- Why these changes matter

Keep the response concise and conversational.`

    const userPrompt = `Their selected introduction is:
"${selectedText}"

Context about them: ${userContext || 'Professional career transition'}

Please improve this introduction to be more compelling and memorable. Focus on making it stand out while staying authentic.`

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
      maxTokens: 500,
    })

    return NextResponse.json({
      success: true,
      improvement: text,
      selectedVersion,
    })
  } catch (error) {
    console.error('[v0] Error improving intro:', error)
    return NextResponse.json(
      { error: 'Failed to improve introduction' },
      { status: 500 }
    )
  }
}
