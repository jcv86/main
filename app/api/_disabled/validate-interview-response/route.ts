import { NextRequest, NextResponse } from 'next/server'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function POST(request: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    )
  }

  try {
    const { question, response, language = 'es' } = await request.json()

    if (!question || !response) {
      return NextResponse.json(
        { error: 'Question and response are required' },
        { status: 400 }
      )
    }

    // Call OpenAI to validate context relevance
    const validationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: language === 'es' 
              ? `Eres un validador de respuestas de entrevistas. Tu trabajo es verificar si una respuesta del usuario está realmente relacionada con la pregunta de la entrevista.

Responde SOLO con un JSON válido sin explicaciones adicionales: {"isRelevant": true/false, "reason": "breve explicación"}

Una respuesta es relevante si:
- Aborda directamente el tema de la pregunta
- Contiene información significativa sobre el tema
- No es simplemente una prueba técnica o distracción (ej: "estoy probando el micrófono")

Una respuesta NO es relevante si:
- Ignora completamente la pregunta
- Es una prueba técnica (micrófono, conexión, etc)
- Habla de un tema completamente diferente
- Es muy corta y genérica sin contenido relevante`
              : `You are an interview response validator. Your job is to verify if a user's response is actually related to the interview question.

Respond ONLY with valid JSON without additional explanation: {"isRelevant": true/false, "reason": "brief explanation"}

A response is relevant if:
- It directly addresses the question topic
- It contains meaningful information about the topic
- It's not just a technical test or distraction (e.g., "testing the microphone")

A response is NOT relevant if:
- It completely ignores the question
- It's a technical test (microphone, connection, etc)
- It talks about a completely different topic
- It's too short and generic without relevant content`
          },
          {
            role: 'user',
            content: `Pregunta: "${question}"\n\nRespuesta del usuario: "${response}"\n\n¿Es esta respuesta contextualmente relevante a la pregunta?`
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      })
    })

    const data = await validationResponse.json()

    if (!validationResponse.ok) {
      console.error('[v0] OpenAI API error:', data)
      // If API fails, default to allowing (fail-safe)
      return NextResponse.json({ isRelevant: true, reason: 'Validation skipped' })
    }

    // Parse the response from OpenAI
    const content = data.choices[0]?.message?.content
    
    try {
      const parsed = JSON.parse(content)
      console.log('[v0] Context validation result:', parsed)
      return NextResponse.json({
        isRelevant: parsed.isRelevant,
        reason: parsed.reason
      })
    } catch (parseErr) {
      console.error('[v0] Failed to parse OpenAI response:', content)
      // Default to allowing if we can't parse
      return NextResponse.json({ isRelevant: true, reason: 'Parse error, allowing response' })
    }
  } catch (error) {
    console.error('[v0] Validation endpoint error:', error)
    // Fail-safe: allow response if validation fails
    return NextResponse.json({ isRelevant: true, reason: 'Validation error, allowing response' })
  }
}
