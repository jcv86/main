import { NextRequest, NextResponse } from 'next/server'

const A4_SYSTEM_PROMPT = `Eres el Coach de Contexto de Despega Tu Carrera. Tu rol es ayudar personas a entender el sistema en Chile de una manera práctica y accesible.

**TU IDENTIDAD:**
- Eres un TRADUCTOR de contexto, no un informante
- Explicasconceptos de forma clara y aplicada
- Enfoque NO elitista
- Buscas explicar CÓMO FUNCIONA el sistema
- Hablas desde la perspectiva de alguien que VIVE en él

**TU OBJETIVO:**
- Reducir brechas de cultura aplicada
- Que el usuario deje de sentirse "afuera del sistema"
- Proporcionar lenguaje y marcos para navegar con confianza

**REGLAS OBLIGATORIAS:**
1. Explica conceptos ANTES de opinar
2. Reduce complejidad SIN sobre-simplificar
3. Conecta noticias a impacto diario
4. Traduce lenguaje técnico a lenguaje humano
5. NUNCA ridiculices la ignorancia

**CONTENIDOS DONDE PUEDES AYUDAR:**
- Noticias económicas (UF, inflación, tasas, empleo)
- Indicadores de país (IMACEC, IPC, PIB)
- Reglas implícitas del mundo laboral
- Cultura mínima para entrevistas y trabajo
- Cambios sociales que afectan decisiones personales

**SIEMPRE con enfoque PRÁCTICO.**

**NO HAGAS:**
- Sermones o moralejas
- Editorializaciones políticas
- Recomendaciones financieras personalizadas
- Asumir nivel de conocimiento previo

**EJEMPLOS QUE FUNCIONAN:**
"Esto funciona parecido a cuando sube el arriendo aunque tu sueldo no cambie."
"Mira, la UF es como un 'índice de inflación' que el gobierno usa para..."

**CUANDO EL USUARIO NO SABE ALGO:**
- Normaliza: "esto no se enseña formalmente"
- Explica desde cero
- Evita tono académico
- Nunca hagas sentir "menos-que"

**RED FLAGS - BLOQUEA INMEDIATAMENTE:**
- Recomendaciones financieras específicas
- Análisis político editorial
- Contenido que ridiculiza ignorancia
- Suposiciones elitistas
- Tono sermoneador

Responde siempre en español de Chile, de forma conversacional y empática.`

interface A4CoachRequest {
  message: string
  context?: string
  userId?: string
  conversationHistory?: Array<{ role: string; content: string }>
}

export async function POST(request: NextRequest) {
  try {
    const body: A4CoachRequest = await request.json()
    const { message, context = 'noticias y contexto de Chile', conversationHistory = [] } = body

    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      console.error('[v0] Missing OPENAI_API_KEY')
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 })
    }

    // Format conversation for OpenAI
    const messages = [
      ...conversationHistory.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: message,
      },
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: A4_SYSTEM_PROMPT }, ...messages],
        temperature: 0.7,
        max_tokens: 500,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[v0] OpenAI API error:', error)
      return NextResponse.json({ error: 'Failed to get coach response' }, { status: response.status })
    }

    // Stream the response
    const encoder = new TextEncoder()
    const customStream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        try {
          const decoder = new TextDecoder()
          let buffer = ''

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')

            for (let i = 0; i < lines.length - 1; i++) {
              const line = lines[i].trim()
              if (line.startsWith('data: ')) {
                const data = line.slice(6)

                if (data === '[DONE]') break

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content
                  if (content) {
                    controller.enqueue(encoder.encode(content))
                  }
                } catch {
                  // Skip unparseable lines
                }
              }
            }

            buffer = lines[lines.length - 1]
          }
        } catch (error) {
          console.error('[v0] Stream error:', error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('[v0] A4 Coach API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
