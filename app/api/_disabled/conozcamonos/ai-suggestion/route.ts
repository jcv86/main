import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { question, currentResponse } = await request.json()

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    const systemPrompt = `Eres un coach de entrevistas experto. Ayuda al usuario a responder mejor preguntas de entrevista.
Tu rol es:
1. Proporcionar 2-3 sugerencias de puntos clave a mencionar
2. Dar un ejemplo conciso de cómo podría estructurarse una respuesta fuerte
3. Aconsejar qué evitar
4. Mantener todo en español
5. Ser breve pero útil (máximo 150 palabras)`

    const userPrompt = currentResponse 
      ? `Pregunta: "${question}"\n\nRespuesta actual del usuario: "${currentResponse}"\n\nAyuda al usuario a mejorar esta respuesta. Qué puntos clave podría agregar? Cómo estructurarla mejor?`
      : `Pregunta: "${question}"\n\nEl usuario está empezando a responder. Proporciona 2-3 puntos clave que debería mencionar, un ejemplo de estructura fuerte, y qué evitar.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenAI API error: ${error}`)
    }

    const data = await response.json()
    const suggestion = data.choices?.[0]?.message?.content

    console.log('[v0] AI suggestion generated for question:', question.substring(0, 50))

    return NextResponse.json({
      suggestion,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[v0] AI suggestion error:', error)
    return NextResponse.json(
      { error: 'Failed to generate suggestion' },
      { status: 500 }
    )
  }
}
