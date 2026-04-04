import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages, userProfile } = await req.json()

    console.log('[v0] Coach chat request:', { messagesCount: messages.length, userProfile })

    // Build system prompt based on profile
    const systemPrompt = `Eres un coach personal experto en desarrollo de carrera. Tu rol es proporcionar mentoría personalizada, estrategias prácticas y motivación.

Contexto del usuario:
- Perfil DISC: ${userProfile?.discType || 'No especificado'}
- Etapa de carrera: ${userProfile?.careerStage || 'A2'}
- Objetivos: ${userProfile?.goals || 'Desarrollo profesional'}

Responde en español, de manera conversacional y práctica. Usa ejemplos concretos. Sé conciso pero profundo.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[v0] OpenAI error:', error)
      return NextResponse.json({ error: 'OpenAI API error' }, { status: 500 })
    }

    // Stream the response back
    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const decoder = new TextDecoder()
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') continue
                if (data.trim()) {
                  try {
                    const json = JSON.parse(data)
                    const content = json.choices?.[0]?.delta?.content
                    if (content) {
                      controller.enqueue(new TextEncoder().encode(content))
                    }
                  } catch (e) {
                    console.error('[v0] Parse error:', e)
                  }
                }
              }
            }
          }
          controller.close()
        } catch (error) {
          console.error('[v0] Stream error:', error)
          controller.error(error)
        }
      },
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('[v0] Coach chat error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
