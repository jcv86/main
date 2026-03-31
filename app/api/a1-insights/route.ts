import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
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

    const primaryProfileName = profileDescriptions[profile.primary] || profile.primary
    const secondaryProfileName = profileDescriptions[profile.secondary] || profile.secondary
    const primaryTraits = profileTraits[profile.primary] || ''
    const secondaryTraits = profileTraits[profile.secondary] || ''

    const jsonSchema = {
      type: 'object',
      properties: {
        fortalezas: {
          type: 'string',
          description: 'Las fortalezas profesionales del usuario'
        },
        areasDesarrollo: {
          type: 'string',
          description: 'Las áreas de desarrollo recomendadas'
        },
        entrevistas: {
          type: 'string',
          description: 'Recomendaciones para entrevistas'
        },
        equipoTrabajo: {
          type: 'string',
          description: 'Consejos para trabajar en equipo'
        }
      },
      required: ['fortalezas', 'areasDesarrollo', 'entrevistas', 'equipoTrabajo']
    }

    const prompt = `Eres un experto en desarrollo profesional y perfiles conductuales (Despega Cerebral). 

El usuario ${userName ? `(${userName})` : ''} ha completado una evaluación de Perfil Cerebral con los siguientes resultados:

PERFIL PRIMARIO: ${primaryProfileName} (${Math.round(profile.primaryScore)}%)
Características: ${primaryTraits}

PERFIL SECUNDARIO: ${secondaryProfileName} (${Math.round(profile.secondaryScore)}%)
Características: ${secondaryTraits}

Proporciona insights profesionales personalizados en JSON con estas claves:
- fortalezas: Las fortalezas profesionales (2-3 oraciones)
- areasDesarrollo: Áreas de desarrollo recomendadas (2-3 oraciones)
- entrevistas: Recomendaciones para entrevistas (2-3 oraciones)
- equipoTrabajo: Consejos para trabajar en equipo (2-3 oraciones)

Sé específico, práctico y motivador. Usa un tono profesional pero amable.

Responde SOLO con JSON válido, sin explicaciones adicionales.`

    const result = await generateText({
      model: openai('gpt-4-turbo'),
      prompt,
      temperature: 0.7,
      maxTokens: 1000
    })

    let insights = {
      fortalezas: '',
      areasDesarrollo: '',
      entrevistas: '',
      equipoTrabajo: ''
    }

    try {
      insights = JSON.parse(result.text)
    } catch {
      console.error('[v0] Failed to parse AI response:', result.text)
      // Fallback to default insights
      insights = {
        fortalezas: 'Tu perfil combina características que te hacen efectivo en el ámbito profesional. Continúa desarrollando tus fortalezas naturales.',
        areasDesarrollo: 'Considera explorar nuevas perspectivas y desarrollar habilidades complementarias para un crecimiento integral.',
        entrevistas: 'En entrevistas, enfatiza ejemplos concretos de tus logros y cómo tu perfil te ayudó a alcanzarlos.',
        equipoTrabajo: 'Trabaja en entender las perspectivas diferentes y busca el equilibrio entre tus fortalezas y las del equipo.'
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
