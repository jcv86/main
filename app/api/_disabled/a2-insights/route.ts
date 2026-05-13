import { NextRequest, NextResponse } from 'next/server'

interface A2Context {
  cerebralProfile?: {
    energia: number
    enfoque: number
    relaciones: number
    plan_ejecutivo: number
    primary?: string
  }
  userName?: string
  missionData?: {
    titulo?: string
    duracion?: string
  }
}

export async function POST(req: NextRequest) {
  try {
    const { cerebralProfile, userName, missionData } = (await req.json()) as A2Context

    if (!cerebralProfile) {
      return NextResponse.json(
        { error: 'Missing profile data' },
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

    const prompt = `Eres un experto coach en transformación profesional y desarrollo de misiones de 90 días.

El usuario ${userName ? `(${userName})` : ''} está iniciando su fase A2 "Camino" con los siguientes datos:

PERFIL CEREBRAL:
- Energía: ${Math.round(cerebralProfile.energia)}%
- Enfoque: ${Math.round(cerebralProfile.enfoque)}%
- Relaciones: ${Math.round(cerebralProfile.relaciones)}%
- Plan Ejecutivo: ${Math.round(cerebralProfile.plan_ejecutivo)}%
- Perfil Dominante: ${cerebralProfile.primary || 'Mixto'}

MISIÓN A2:
${missionData?.titulo ? `Título: ${missionData.titulo}` : ''}
${missionData?.duracion ? `Duración: ${missionData.duracion}` : 'Duración: 90 días'}

Proporciona insights profesionales personalizados en JSON VÁLIDO con estas claves exactas:
{
  "alineacionMision": "Cómo la misión de 90 días se alinea con su perfil cerebral (2-3 oraciones)",
  "rutaAprendizaje": "La ruta de aprendizaje recomendada basada en su perfil (2-3 oraciones)",
  "dinamicasEquipo": "Cómo trabajar efectivamente en equipo durante la misión (2-3 oraciones)",
  "areasGrowth": "Áreas de crecimiento clave en esta fase (2-3 oraciones)",
  "hitosExito": "Hitos de éxito definibles en los 90 días (2-3 oraciones)",
  "riesgosOportunidades": "Riesgos potenciales y oportunidades a vigilar (2-3 oraciones)"
}

Sé específico, práctico, motivador y contextualizado en el framework Despega Tu Carrera.
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
      alineacionMision: '',
      rutaAprendizaje: '',
      dinamicasEquipo: '',
      areasGrowth: '',
      hitosExito: '',
      riesgosOportunidades: ''
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
        alineacionMision: 'Tu misión de 90 días está diseñada para complementar tu perfil cerebral. Utiliza tus fortalezas naturales mientras desarrollas capacidades nuevas.',
        rutaAprendizaje: 'Sigue un enfoque estructurado con revisiones semanales. Adapta el ritmo según tu estilo de aprendizaje dominante.',
        dinamicasEquipo: 'Reconoce las diferentes fortalezas de tu equipo y busca sinergia. La colaboración multiplica los resultados.',
        areasGrowth: 'Enfócate en expandir tu rango de influencia y adaptabilidad. Cada desafío es una oportunidad de aprendizaje.',
        hitosExito: 'Establece objetivos mensuales claros. Celebra los pequeños triunfos y ajusta según sea necesario.',
        riesgosOportunidades: 'Anticipa cambios de contexto. Mantén flexibilidad mientras persigues objetivos claros.'
      }
    }

    return NextResponse.json({
      success: true,
      insights
    })
  } catch (error) {
    console.error('[v0] Error generating A2 insights:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate insights',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
