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

const insightsSchema = z.object({
  fortalezasPrincipales: z.string(),
  areasDesarrollo: z.string(),
  estiloEntrevista: z.string(),
  dinamicaEquipo: z.string(),
  carreraAlign: z.string(),
  comunicacionEfectiva: z.string(),
  gestionConflicto: z.string(),
  proxiPaso: z.string()
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

    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

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

IMPORTANTE: Responde con JSON válido en este exacto formato (sin markdown, sin comillas escapadas innecesarias):
{
  "fortalezasPrincipales": "Aquí van las 2-3 fortalezas principales basadas en su perfil",
  "areasDesarrollo": "Aquí van las 2-3 áreas de desarrollo recomendadas",
  "estiloEntrevista": "Cómo debería prepararse para entrevistas según su perfil",
  "dinamicaEquipo": "Cómo funciona mejor en equipos",
  "carreraAlign": "Carreras/roles que mejor se alinean con su perfil",
  "comunicacionEfectiva": "Consejos para comunicarse efectivamente",
  "gestionConflicto": "Cómo maneja mejor los conflictos y desacuerdos",
  "proxiPaso": "El próximo paso recomendado en su desarrollo profesional"
}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto coach profesional especializado en perfiles DISC y desarrollo de carrera. Siempre respondes con JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[v0] OpenAI API error:', error)
      return NextResponse.json(
        { error: 'Failed to generate insights from OpenAI' },
        { status: 500 }
      )
    }

    const data = await response.json() as {
      choices: Array<{ message: { content: string } }>
    }

    const contentStr = data.choices[0]?.message?.content || '{}'
    const insights = JSON.parse(contentStr)

    console.log('[v0] Enhanced A1 insights generated successfully')

    return NextResponse.json({
      success: true,
      insights,
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
