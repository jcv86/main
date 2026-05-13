import { NextRequest, NextResponse } from 'next/server'

interface A3Context {
  userName?: string
  interviewScores?: {
    audioAnalysis?: number
    videoAnalysis?: number
    responseQuality?: number
    overall?: number
  }
  performanceMetrics?: {
    passRate?: number
    improvementArea?: string
    strengths?: string[]
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userName, interviewScores, performanceMetrics } = (await req.json()) as A3Context

    if (!interviewScores && !performanceMetrics) {
      return NextResponse.json(
        { error: 'Missing interview or performance data' },
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

    const prompt = `Eres un experto en entrenamiento ejecutivo y coaching de presentaciones profesionales.

El usuario ${userName ? `(${userName})` : ''} ha completado simulaciones de entrevista con los siguientes resultados:

PUNTUACIONES DE ENTREVISTA (0-100):
- Análisis de Audio (claridad, ritmo, volumen): ${Math.round(interviewScores?.audioAnalysis || 0)}%
- Análisis de Video (contacto ocular, postura, gestos): ${Math.round(interviewScores?.videoAnalysis || 0)}%
- Calidad de Respuestas (contenido, estructura, relevancia): ${Math.round(interviewScores?.responseQuality || 0)}%
- Puntuación General: ${Math.round(interviewScores?.overall || 0)}%

MÉTRICAS DE DESEMPEÑO:
- Tasa de Éxito: ${performanceMetrics?.passRate || 0}%
${performanceMetrics?.strengths ? `- Fortalezas Identificadas: ${performanceMetrics.strengths.join(', ')}` : ''}
${performanceMetrics?.improvementArea ? `- Área Principal de Mejora: ${performanceMetrics.improvementArea}` : ''}

Proporciona insights profesionales personalizados en JSON VÁLIDO con estas claves exactas:
{
  "retroalimentacionAudio": "Análisis detallado de la calidad de audio y recomendaciones (2-3 oraciones)",
  "retroalimentacionVideo": "Análisis del lenguaje corporal y presencia (2-3 oraciones)",
  "calidadRespuestas": "Evaluación de contenido y estructura de respuestas (2-3 oraciones)",
  "siguientesAntes": "Pasos a seguir antes de la próxima simulación (2-3 oraciones)",
  "fortalezasAplicar": "Fortalezas identificadas para llevar a entrevistas reales (2-3 oraciones)",
  "estrategiaIntegracion": "Estrategia para integrar este aprendizaje en tu desarrollo (2-3 oraciones)"
}

Sé específico, constructivo, motivador y profesional. Enfatiza el progreso y las oportunidades de mejora.
IMPORTANTE: Responde SOLO con el JSON, sin explicaciones adicionales, sin markdown, sin bloques de código.`

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
        max_tokens: 1200
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[v0] OpenAI API error:', error)
      return NextResponse.json(
        { error: 'OpenAI API error', details: error },
        { status: response.status }
      )
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>
    }

    let insights = {
      retroalimentacionAudio: '',
      retroalimentacionVideo: '',
      calidadRespuestas: '',
      siguientesAntes: '',
      fortalezasAplicar: '',
      estrategiaIntegracion: ''
    }

    const content = data.choices[0]?.message?.content || ''

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('[v0] Failed to parse OpenAI response:', content)
      insights = {
        retroalimentacionAudio: 'Tu audio está mejorando. Continúa trabajando en claridad y modulación del tono para captar atención.',
        retroalimentacionVideo: 'Tu lenguaje corporal refleja confianza. Mantén contacto ocular consistente y gestos naturales en futuras sesiones.',
        calidadRespuestas: 'Tus respuestas muestran estructura. Sigue reforzando ejemplos concretos con el método STAR.',
        siguientesAntes: 'Practica frente a un espejo. Grábate y revisa. Pide retroalimentación a un mentor.',
        fortalezasAplicar: 'Tu comunicación clara es una fortaleza. Llévala a cada entrevista con confianza.',
        estrategiaIntegracion: 'Incorpora estas prácticas en tu rutina diaria. La consistencia genera excelencia.'
      }
    }

    return NextResponse.json({
      success: true,
      insights
    })
  } catch (error) {
    console.error('[v0] Error generating A3 insights:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate insights',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
