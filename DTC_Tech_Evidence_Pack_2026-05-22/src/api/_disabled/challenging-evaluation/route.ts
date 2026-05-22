import { NextRequest, NextResponse } from 'next/server'

interface EvaluationRequest {
  question: string
  userResponse: string
  difficulty: string
  competencies: string[]
}

export async function POST(req: NextRequest) {
  try {
    const { question, userResponse, difficulty, competencies } = (await req.json()) as EvaluationRequest

    if (!question || !userResponse) {
      return NextResponse.json(
        { error: 'Missing question or response' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('[v0] OPENAI_API_KEY not configured')
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const prompt = `Eres un experto en entrenamiento ejecutivo y evaluación de competencias de entrevista.

PREGUNTA: "${question}"

DIFICULTAD: ${difficulty}
COMPETENCIAS EVALUADAS: ${competencies.join(', ')}

RESPUESTA DEL USUARIO:
"${userResponse}"

Evalúa esta respuesta en una escala de 0-100 considerando:
- Relevancia y coherencia con la pregunta
- Profundidad y especificidad de la respuesta
- Estructura y organización (especialmente si usa STAR)
- Demostracion de competencias solicitadas
- Claridad y capacidad de comunicación
- Ejemplos concretos y medibles

Proporciona ÚNICAMENTE un JSON válido con esta estructura exacta (sin markdown, sin explicaciones extra):
{
  "score": <número 0-100>,
  "scoreExplanation": "<Por qué razón exacta recibió este puntaje (1-2 oraciones claras>",
  "strengths": ["<fortaleza 1>", "<fortaleza 2>", "<fortaleza 3>"],
  "improvements": ["<área de mejora 1>", "<área de mejora 2>", "<área de mejora 3>"],
  "feedback": "<Retroalimentación constructiva y específica (2-3 oraciones)>"
}

Sé justo pero exigente. El estándar es ejecutivo (C-Suite).`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('[v0] OpenAI API error:', errorData)
      return NextResponse.json(
        { error: 'OpenAI API error', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Parse the JSON response
    const evaluation = JSON.parse(content)

    return NextResponse.json({
      score: evaluation.score,
      scoreExplanation: evaluation.scoreExplanation,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      feedback: evaluation.feedback
    })
  } catch (error) {
    console.error('[v0] Evaluation error:', error)
    return NextResponse.json(
      { error: 'Failed to evaluate response' },
      { status: 500 }
    )
  }
}
