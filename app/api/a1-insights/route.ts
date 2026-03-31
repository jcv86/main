import { NextRequest, NextResponse } from 'next/server'

interface CerebroProfile {
  D: number
  I: number
  S: number
  C: number
  primary: string
  primaryScore: number
  secondary: string
  secondaryScore: number
}

const profileDescriptions: Record<string, string> = {
  D: 'Impulsor - Orientado a Resultados',
  I: 'Catalizador - Orientado a Personas',
  S: 'Estabilizador - Orientado a Procesos',
  C: 'Arquitecto - Orientado a Calidad'
}

const profileTraits: Record<string, string> = {
  D: 'directo, decidido, competitivo, orientado al logro',
  I: 'sociable, entusiasta, influyente, comunicativo',
  S: 'empático, leal, paciente, colaborativo',
  C: 'meticuloso, analítico, perfeccionista, preciso'
}

export async function POST(req: NextRequest) {
  try {
    const { profile, userName } = (await req.json()) as {
      profile: CerebroProfile
      userName?: string
    }

    if (!profile) {
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

    const primaryProfileName = profileDescriptions[profile.primary] || profile.primary
    const secondaryProfileName = profileDescriptions[profile.secondary] || profile.secondary
    const primaryTraits = profileTraits[profile.primary] || ''
    const secondaryTraits = profileTraits[profile.secondary] || ''

    const prompt = `Eres un experto en desarrollo profesional y perfiles conductuales (Despega Cerebral). 

El usuario ${userName ? `(${userName})` : ''} ha completado una evaluación de Perfil Cerebral con los siguientes resultados:

PERFIL PRIMARIO: ${primaryProfileName} (${Math.round(profile.primaryScore)}%)
Características: ${primaryTraits}

PERFIL SECUNDARIO: ${secondaryProfileName} (${Math.round(profile.secondaryScore)}%)
Características: ${secondaryTraits}

Proporciona insights profesionales personalizados en JSON VÁLIDO con estas claves exactas:
{
  "fortalezas": "Las fortalezas profesionales en 2-3 oraciones",
  "areasDesarrollo": "Las áreas de desarrollo recomendadas en 2-3 oraciones",
  "entrevistas": "Recomendaciones para entrevistas en 2-3 oraciones",
  "equipoTrabajo": "Consejos para trabajar en equipo en 2-3 oraciones"
}

Sé específico, práctico y motivador. Usa un tono profesional pero amable.

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
        max_tokens: 800
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
      fortalezas: '',
      areasDesarrollo: '',
      entrevistas: '',
      equipoTrabajo: ''
    }

    const content = data.choices[0]?.message?.content || ''
    
    try {
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('[v0] Failed to parse OpenAI response:', content)
      // Fallback to default insights
      insights = {
        fortalezas: 'Tu perfil combina características que te hacen efectivo en el ámbito profesional. Continúa desarrollando tus fortalezas naturales y busca oportunidades donde puedas aplicarlas plenamente.',
        areasDesarrollo: 'Considera explorar nuevas perspectivas y desarrollar habilidades complementarias para un crecimiento integral. Busca retroalimentación de mentores para fortalecer áreas de desarrollo.',
        entrevistas: 'En entrevistas, enfatiza ejemplos concretos de tus logros y cómo tu perfil te ayudó a alcanzarlos. Prepara historias que muestren tu adaptabilidad y capacidad de trabajo en equipo.',
        equipoTrabajo: 'Trabaja en entender las perspectivas diferentes y busca el equilibrio entre tus fortalezas y las del equipo. Valoriza las contribuciones de cada miembro y colabora en la construcción de objetivos comunes.'
      }
    }

    return NextResponse.json({
      success: true,
      insights
    })
  } catch (error) {
    console.error('[v0] Error generating insights:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate insights',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
