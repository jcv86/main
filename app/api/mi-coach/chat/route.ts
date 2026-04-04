import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages, userProfile } = await req.json()

    console.log('[v0] Coach chat request:', { messagesCount: messages.length, userProfile })

    // Build system prompt based on profile
    const systemPrompt = `Eres un coach personal de carrera enfocado en proporcionar mentoría práctica y estratégica.

Contexto del usuario:
- Perfil DISC: ${userProfile?.discType || 'No especificado'}
- Etapa de carrera: ${userProfile?.careerStage || 'A2'}
- Objetivos: ${userProfile?.goals || 'Desarrollo profesional'}

Instrucciones:
1. Responde en español de manera conversacional y práctica
2. Proporciona análisis concretos y estrategias accionables
3. Sé conciso pero completo en tus respuestas
4. Evita hacer juicios de valor sobre las preguntas o situaciones del usuario
5. Enfócate en soluciones y perspectivas útiles
6. Adapta tu estilo de coaching al perfil DISC del usuario
7. No hagas comentarios valorativos como "excelente pregunta" o similares
8. Sé directo, profesional y orientado a resultados`

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
          let buffer = ''

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')

            // Keep the last incomplete line in the buffer
            buffer = lines[lines.length - 1]

            for (let i = 0; i < lines.length - 1; i++) {
              const line = lines[i].trim()

              if (line === '' || !line.startsWith('data: ')) {
                continue
              }

              const data = line.slice(6).trim()

              if (data === '[DONE]') {
                continue
              }

              if (data.length === 0) {
                continue
              }

              try {
                const json = JSON.parse(data)
                const content = json.choices?.[0]?.delta?.content

                if (content) {
                  controller.enqueue(new TextEncoder().encode(content))
                }
              } catch (e) {
                // Silently skip malformed JSON chunks
                // console.error('[v0] Parse error:', e, 'Data:', data)
              }
            }
          }

          // Process any remaining buffer
          if (buffer.trim() && buffer.trim() !== '' && buffer.trim().startsWith('data: ')) {
            const data = buffer.slice(6).trim()
            if (data !== '[DONE]' && data.length > 0) {
              try {
                const json = JSON.parse(data)
                const content = json.choices?.[0]?.delta?.content
                if (content) {
                  controller.enqueue(new TextEncoder().encode(content))
                }
              } catch (e) {
                // Silently skip
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
