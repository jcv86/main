import { NextRequest, NextResponse } from 'next/server'
import { generateText, Output } from 'ai'
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

const insightsSchema = z.object({
  fortalezasPrincipales: z.string().describe('Las 2-3 fortalezas principales derivadas del perfil'),
  areasDesarrollo: z.string().describe('Las 2-3 áreas de desarrollo recomendadas'),
  estiloEntrevista: z.string().describe('Cómo debería prepararse para entrevistas según su perfil'),
  dinamicaEquipo: z.string().describe('Cómo funciona mejor en equipos'),
  carreraAlign: z.string().describe('Carreras/roles que mejor se alinean con su perfil'),
  comunicacionEfectiva: z.string().describe('Consejos para comunicarse efectivamente'),
  gestionConflicto: z.string().describe('Cómo maneja mejor los conflictos y desacuerdos'),
  proxiPaso: z.string().describe('El próximo paso recomendado en su desarrollo profesional')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      profile: CerebroProfile
      userName?: string
      c1Context?: {
        currentSituation?: string
        challenges?: string
        goals?: string
      }
    }

    const { profile, userName, c1Context } = body

    if (!profile) {
      return NextResponse.json(
        { error: 'Missing profile data' },
        { status: 400 }
      )
    }

    const model = process.env.AI_MODEL || 'openai/gpt-4o-mini'

    const primaryProfileName = profileDescriptions[profile.primary] || profile.primary
    const secondaryProfileName = profileDescriptions[profile.secondary] || profile.secondary
    const primaryTraits = profileTraits[profile.primary] || ''
    const secondaryTraits = profileTraits[profile.secondary] || ''

    const contextSection = c1Context
      ? `CONTEXTO PERSONAL (De Conozcámonos 1):
- Situación Actual: ${c1Context.currentSituation || 'N/A'}
- Desafíos Principales: ${c1Context.challenges || 'N/A'}
- Objetivos a 90 días: ${c1Context.goals || 'N/A'}`
      : ''

    const prompt = `Eres un coach profesional experto en perfiles conductuales DISC y desarrollo de carrera. Has revisado el Análisis Despega Cerebral de un usuario y necesitas generar insights profundos y personalizados.

PERFIL CEREBRAL DEL USUARIO:
- Nombre: ${userName || 'Usuario'}
- Perfil Primario: ${primaryProfileName} (${Math.round(profile.primaryScore)}%)
  Características: ${primaryTraits}
- Perfil Secundario: ${secondaryProfileName} (${Math.round(profile.secondaryScore)}%)
  Características: ${secondaryTraits}

${contextSection}

Tu tarea es generar 8 insights detallados y personalizados que hagan que el usuario diga "¡ESE SOY YO!" Cada insight debe:
1. Ser específico y relevante a su perfil DISC
2. Si hay contexto de C1, conectar directamente con sus desafíos/objetivos
3. Ser motivador pero honesto
4. Incluir ejemplos concretos o acciones
5. Ayudarle a entender su valor único

IMPORTANTE: Las respuestas deben ser reflexivas, profundas y personales. Usa tono conversacional, profesional pero empático.`

    const result = await generateText({
      model,
      system: 'Eres un experto coach profesional especializado en perfiles DISC y desarrollo de carrera.',
      prompt,
      output: Output.object({
        schema: insightsSchema,
      }),
      temperature: 0.8,
      maxTokens: 2000,
    })

    console.log('[v0] Enhanced A1 insights generated successfully')

    return NextResponse.json({
      success: true,
      insights: result.object,
    })
  } catch (error) {
    console.error('[v0] Error generating enhanced insights:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate insights',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
