import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] API route called')

    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('[v0] OPENAI_API_KEY not set')
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    console.log('[v0] API key found, parsing request')

    const body = await request.json()
    const { userMessage, conversationHistory } = body

    if (!userMessage) {
      console.warn('[v0] No user message provided')
      return NextResponse.json({ error: 'No message provided' }, { status: 400 })
    }

    console.log('[v0] Received message:', userMessage.substring(0, 50))

    // Build messages array
    const messages: any[] = [
      {
        role: 'system',
        content: `You are Sofia, a warm and conversational learning coach. Have natural conversations, not rigid surveys. Be like a friend, genuinely curious, and help them discover their learning path.`,
      },
    ]

    // Add conversation history
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })
      }
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage,
    })

    console.log('[v0] Built messages array, length:', messages.length)

    // Use fetch to call OpenAI API directly (more reliable)
    console.log('[v0] Calling OpenAI API')

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    console.log('[v0] OpenAI response status:', openaiResponse.status)

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      console.error('[v0] OpenAI API error:', errorData)
      return NextResponse.json(
        { error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}` },
        { status: openaiResponse.status }
      )
    }

    const data = await openaiResponse.json()
    const content = data.choices?.[0]?.message?.content || ''

    console.log('[v0] Got response from OpenAI, length:', content.length)

    // Return response as plain text
    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('[v0] Caught error:', error)
    const errorMsg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}
