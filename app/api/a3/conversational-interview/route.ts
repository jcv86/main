import { streamText } from 'ai'
import { NextRequest } from 'next/server'

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

    const result = streamText({
      model: 'openai/gpt-4-turbo',
      system: systemPrompt,
      messages: await import('ai').then(m => m.convertToModelMessages(messages)),
      temperature: 0.7,
      maxTokens: 500
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('[v0] Interview API error:', error)
    return Response.json(
      { error: 'Failed to process interview' },
      { status: 500 }
    )
  }
}
