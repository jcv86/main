import { NextRequest, NextResponse } from 'next/server'

interface A4Context {
  userName?: string
  radarScores?: {
    estrategico?: number
    noticias?: number
    personalizacion?: number
    pruebas?: number
  }
  engagementMetrics?: {
    puntosAcumulados?: number
    insignias?: string[]
    nivelActual?: string
  }
  performanceLevel?: string
}

export async function POST(req: NextRequest) {
  try {
    const { userName, radarScores, engagementMetrics, performanceLevel } = (await req.json()) as A4Context

    if (!radarScores && !engagementMetrics) {
      return NextResponse.json(
        { error: 'Missing A4 data' },
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

    const prompt = `Eres un experto estratega en desarrollo profesional y mercado laboral inteligente.

El usuario ${userName ? `(${userName})` : ''} está en A4 "Radar Estratégico" con los siguientes datos:

PUNTUACIONES RADAR (0-100):
- Radar Estratégico: ${Math.round(radarScores?.estrategico || 0)}%
- Inteligencia de Noticias: ${Math.round(radarScores?.noticias || 0)}%
- Personalización: ${Math.round(radarScores?.personalizacion || 0)}%
- Pruebas Gamificadas: ${Math.round(radarScores?.pruebas || 0)}%

MÉTRICAS DE ENGAGEMENT:
- Puntos Acumulados: ${engagementMetrics?.puntosAcumulados || 0}
${engagementMetrics?.insignias?.length ? `- Insignias Logradas: ${engagementMetrics.insignias.join(', ')}` : ''}
- Nivel: ${engagementMetrics?.nivelActual || 'Iniciante'}

NIVEL DE DESEMPEÑO GENERAL: ${performanceLevel || 'En Progreso'}

Proporciona insights profesionales personalizados en JSON VÁLIDO con estas claves exactas:
{
  "posicionamientoEstrategico": "Tu posicionamiento estratégico actual en el mercado (2-3 oraciones)",
  "inteligenciaMercado": "Cómo estás aprovechando la inteligencia de mercado para tu ventaja (2-3 oraciones)",
  "nivelGamificacion": "El impacto de tu engagement con la gamificación en tu desarrollo (2-3 oraciones)",
  "proximasFocalizaciones": "Las focalizaciones estratégicas más importantes para próximas semanas (2-3 oraciones)",
  "oportunidadesCaptura": "Oportunidades para capturar valor en el mercado actual (2-3 oraciones)",
  "visionLargo": "Tu visión a largo plazo basada en el progreso actual (2-3 oraciones)"
}

Sé estratégico, inspirador, práctico y visón. Ayuda al usuario a ver el panorama completo de su desarrollo profesional.
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
      posicionamientoEstrategico: '',
      inteligenciaMercado: '',
      nivelGamificacion: '',
      proximasFocalizaciones: '',
      oportunidadesCaptura: '',
      visionLargo: ''
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
        posicionamientoEstrategico: 'Tu posicionamiento en A4 refleja madurez profesional. Continúa refinando tu marca personal.',
        inteligenciaMercado: 'Estás aprovechando bien el análisis de tendencias. Mantén este enfoque proactivo.',
        nivelGamificacion: 'Tu engagement es fuerte. La consistencia en este nivel genera oportunidades reales.',
        proximasFocalizaciones: 'Enfócate en profundizar en áreas de mercado prioritarias para ti. La especialización genera valor.',
        oportunidadesCaptura: 'Las oportunidades surgen de estar preparado. Mantén tus redes activadas y tu perfil actualizado.',
        visionLargo: 'Estás en la trayectoria correcta hacia liderazgo. Sigue construyendo con intencionalidad.'
      }
    }

    return NextResponse.json({
      success: true,
      insights
    })
  } catch (error) {
    console.error('[v0] Error generating A4 insights:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate insights',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
