import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

/**
 * POST /api/a2/improve-intro
 * Uses OpenAI GPT-4o to improve intro text based on feedback
 * Streams improvements in real-time for interactive coaching
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
    const otherText = selectedVersion === 'a' ? versionB : versionA

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

    const { stream } = await streamText({
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
    console.error('[v0] Error improving intro:', error)
    return NextResponse.json(
      { error: 'Failed to improve introduction' },
      { status: 500 }
    )
  }
}
