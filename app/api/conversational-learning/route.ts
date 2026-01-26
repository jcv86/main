import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Conversational Learning API called')

    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('[v0] OPENAI_API_KEY not configured - returning demo response')
      
      // Return a demo response instead of failing
      const demoResponse = `Entendido, voy a ayudarte con tu aprendizaje. Cuéntame más sobre tus intereses específicos para poder personalizar mejor tu plan de estudio.`
      
      return new Response(demoResponse, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      })
    }

    const body = await request.json()
    const { userMessage, conversationHistory } = body

    if (!userMessage) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 })
    }

    console.log('[v0] Processing message')

    // Build messages array
    const messages: any[] = [
      {
        role: 'system',
        content: `You are Sofia, a warm and conversational learning coach. Have natural conversations about learning and career development. Be like a friend, genuinely curious, and help them discover their learning path. Respond in the same language as the user.`,
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
      const errorData = await openaiResponse.json().catch(() => ({}))
      console.error('[v0] OpenAI API error:', errorData)
      
      // Return a fallback message instead of error
      const fallbackResponse = `Parece que tengo un pequeño problema técnico. Pero puedo ayudarte - cuéntame sobre tus metas de aprendizaje.`
      
      return new Response(fallbackResponse, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      })
    }

    const data = await openaiResponse.json()
    const content = data.choices?.[0]?.message?.content || 'Lo siento, no pude generar una respuesta.'

    console.log('[v0] Response generated successfully')

    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('[v0] API Error:', error)
    
    // Return a fallback response
    const fallbackResponse = `Hola, soy Sofia tu coach de aprendizaje. ¿Cuál es tu área de interés?`
    
    return new Response(fallbackResponse, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  }
}
