import { generateText, Output } from 'ai'
import { openai } from '@ai-sdk/openai'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

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

    const prompt = `Eres un experto en desarrollo profesional y perfiles conductuales DISC (Despega Cerebral). 

El usuario ${userName ? `(${userName})` : ''} ha completado una evaluación de Perfil Cerebral con los siguientes resultados:

PERFIL PRIMARIO: ${primaryProfileName} (${Math.round(profile.primaryScore)}%)
Características: ${primaryTraits}

PERFIL SECUNDARIO: ${secondaryProfileName} (${Math.round(profile.secondaryScore)}%)
Características: ${secondaryTraits}

Proporciona insights profesionales personalizados sobre:
1. Fortalezas profesionales (2-3 oraciones)
2. Áreas de desarrollo (2-3 oraciones)
3. Recomendaciones para entrevistas (2-3 oraciones)
4. Consejos para trabajar en equipo (2-3 oraciones)

Sé específico, práctico y motivador. Usa un tono profesional pero amable.`

    const insightSchema = z.object({
      fortalezas: z.string().describe('Las fortalezas profesionales del usuario'),
      areasDesarrollo: z.string().describe('Las áreas de desarrollo recomendadas'),
      entrevistas: z.string().describe('Recomendaciones para entrevistas'),
      equipoTrabajo: z.string().describe('Consejos para trabajar en equipo')
    })

    const result = await generateText({
      model: openai('gpt-4-turbo'),
      prompt,
      output: Output.object({ schema: insightSchema }),
      temperature: 0.7,
      maxTokens: 1000
    })

    const insights = JSON.parse(result.text)

    return NextResponse.json({
      success: true,
      insights: {
        fortalezas: insights.fortalezas,
        areasDesarrollo: insights.areasDesarrollo,
        entrevistas: insights.entrevistas,
        equipoTrabajo: insights.equipoTrabajo
      }
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
