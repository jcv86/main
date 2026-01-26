import { NextRequest } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI with API key
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  console.error('[v0] OPENAI_API_KEY not configured')
}

const openai = new OpenAI({
  apiKey: apiKey,
})



export async function POST(request: NextRequest) {
  try {
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { userMessage, conversationHistory } = await request.json()

    if (!userMessage) {
      return new Response(JSON.stringify({ error: 'No message provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    console.log('[v0] Received message:', userMessage.substring(0, 50))

    // Build simple conversation
    const messages: any[] = [
      {
        role: 'system',
        content: `You are Sofia, a warm and conversational learning coach. Have natural conversations, not rigid surveys. Be like a friend, genuinely curious, and help them discover their learning path.`,
      },
    ]

    // Add conversation history
    if (conversationHistory && Array.isArray(conversationHistory)) {
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

    console.log('[v0] Calling OpenAI with', messages.length, 'messages')

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    })

    console.log('[v0] OpenAI response received')

    const content = response.choices[0]?.message?.content || ''

    // Return as text stream so client can read it normally
    const encoder = new TextEncoder()
    const data = encoder.encode(content)

    return new Response(data, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('[v0] API Error:', error)
    const errorMsg = error instanceof Error ? error.message : String(error)
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
