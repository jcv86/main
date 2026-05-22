import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/a2/improve-intro
 * Uses OpenAI GPT-4o via direct API call to improve professional introductions
 */
export async function POST(request: NextRequest) {
  try {
    const { versionA, versionB, selectedVersion, userContext } = await request.json()

    if (!versionA || !versionB || !selectedVersion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const selectedText = selectedVersion === 'a' ? versionA : versionB
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.error('[v0] Missing OPENAI_API_KEY')
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 })
    }

    const systemPrompt = `You are a professional branding coach helping someone improve their professional introduction. 
Your goal is to enhance their introduction to be more compelling, authentic, and memorable.

Provide:
1. 2-3 specific, actionable improvements to make
2. A revised version incorporating those improvements
3. Why these changes matter for their professional brand

Be conversational, specific, and encouraging.`

    const userPrompt = `Their selected introduction is:
"${selectedText}"

Context: ${userContext || 'Professional career transition'}

Improve this introduction to be more compelling and memorable while keeping it authentic.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[v0] OpenAI API error:', error)
      return NextResponse.json(
        { error: 'Failed to improve introduction' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const improvement = data.choices[0]?.message?.content || 'Unable to generate improvement'

    return NextResponse.json({
      success: true,
      improvement,
      selectedVersion,
      model: 'gpt-4o-mini',
    })
  } catch (error) {
    console.error('[v0] Error improving intro:', error)
    return NextResponse.json(
      { error: 'Failed to improve introduction' },
      { status: 500 }
    )
  }
}

