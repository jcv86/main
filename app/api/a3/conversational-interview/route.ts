import { NextRequest } from 'next/server'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function POST(req: NextRequest) {
  try {
    const { messages, role, industry, level, questionIndex } = await req.json()

    const systemPrompt = `Eres un entrevistador profesional experimentado conduciendo una entrevista para:
    - Puesto: ${role}
    - Industria: ${industry}
    - Nivel: ${level}
    - Pregunta Actual: ${questionIndex + 1}

    INSTRUCCIONES:
    1. Realiza preguntas de forma conversacional y natural, una a la vez
    2. Escucha activamente y haz preguntas de seguimiento si es necesario
    3. Proporciona ambiente cómodo pero profesional
    4. Al final, da feedback constructivo específico sobre:
       - Contenido de respuestas (relevancia, profundidad)
       - Comunicación (claridad, estructura, confianza)
       - Lenguaje corporal (si es visible en video)
       - Puntuación: 1-10

    Mantén respuestas breves y concisas (max 100 palabras por respuesta).`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        system: systemPrompt,
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        stream: true
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    // Stream the response directly
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })
  } catch (error) {
    console.error('[v0] Interview API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process interview' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
