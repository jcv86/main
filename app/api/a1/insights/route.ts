import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

interface AIInsights {
  fortalezasPrincipales: string
  areasDesarrollo: string
  estiloEntrevista: string
  dinamicaEquipo: string
  carreraAlign: string
  comunicacionEfectiva: string
  gestionConflicto: string
  proxiPaso: string
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
    const { profile, userId, c1Context } = (await req.json()) as {
      profile: CerebroProfile
      userId?: string
      c1Context?: Record<string, unknown>
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

    // Fetch additional context from C1/C2 if userId provided
    let contextData = c1Context || {}
    if (userId) {
      try {
        const supabase = await createClient()
        const { data: c1Data } = await supabase
          .from('canon_conozcamonos_1_responses')
          .select('responses')
          .eq('user_id', userId)
          .single()

        if (c1Data?.responses) {
          contextData = { ...contextData, c1Responses: c1Data.responses }
        }
      } catch (err) {
        console.log('[v0] Could not fetch C1 context:', err)
        // C1 is optional context - continue without it if fetch fails
      }
    }

    const primaryProfileName = profileDescriptions[profile.primary] || profile.primary
    const secondaryProfileName = profileDescriptions[profile.secondary] || profile.secondary
    const primaryTraits = profileTraits[profile.primary] || ''
    const secondaryTraits = profileTraits[profile.secondary] || ''

    // Build context string from C1 responses if available
    let contextString = ''
    if (contextData.c1Responses) {
      const responses = contextData.c1Responses as Record<string, string>
      const challenges = responses['q1'] || ''
      const aspirations = responses['q2'] || ''
      contextString = `
CONTEXTO PERSONAL DEL USUARIO:
- Desafío principal: ${challenges}
- Aspiración profesional: ${aspirations}
`
    }

    const prompt = `Eres un experto en desarrollo profesional, perfiles conductuales DISC y carrera profesional en Chile.

El usuario ha completado una evaluación de Perfil Cerebral (Despega Cerebral) con los siguientes resultados:

PERFIL PRIMARIO: ${primaryProfileName} (${Math.round(profile.primaryScore)}%)
Características: ${primaryTraits}

PERFIL SECUNDARIO: ${secondaryProfileName} (${Math.round(profile.secondaryScore)}%)
Características: ${secondaryTraits}

${contextString}

Proporciona un análisis profesional COMPLETO y personalizado en JSON VÁLIDO con estas claves exactas:
{
  "fortalezasPrincipales": "3-4 oraciones detalladas sobre fortalezas profesionales específicas del perfil",
  "areasDesarrollo": "3-4 oraciones sobre áreas de desarrollo recomendadas",
  "estiloEntrevista": "3-4 oraciones con recomendaciones para entrevistas",
  "dinamicaEquipo": "3-4 oraciones sobre cómo trabajar efectivamente en equipo",
  "carreraAlign": "3-4 oraciones sobre alineación con tipos de carreras y roles",
  "comunicacionEfectiva": "3-4 oraciones sobre cómo comunicarse efectivamente",
  "gestionConflicto": "3-4 oraciones sobre manejo de conflictos",
  "proxiPaso": "3-4 oraciones con recomendaciones de próximos pasos en la carrera"
}

IMPORTANTE: 
- Sé específico, práctico, motivador y profesional
- Adapta el análisis al contexto personal si está disponible
- Usa un tono profesional pero amable
- Responde SOLO con el JSON válido, sin explicaciones, sin markdown, sin bloques de código`

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
        max_tokens: 2000
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

    let insights: AIInsights = {
      fortalezasPrincipales: '',
      areasDesarrollo: '',
      estiloEntrevista: '',
      dinamicaEquipo: '',
      carreraAlign: '',
      comunicacionEfectiva: '',
      gestionConflicto: '',
      proxiPaso: ''
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
        fortalezasPrincipales: `Tu perfil ${primaryProfileName} te proporciona fortalezas únicas para el mercado laboral. Combinado con tu lado ${secondaryProfileName}, tienes una configuración versátil que te permite adaptarte a diferentes contextos profesionales.`,
        areasDesarrollo: `Considera desarrollar habilidades complementarias que equilibren tu perfil natural. Busca retroalimentación regular de mentores y colegas para un crecimiento integral y sostenible.`,
        estiloEntrevista: `En entrevistas, enfatiza ejemplos concretos de logros que demuestren tu perfil en acción. Prepara historias STAR que muestren cómo tus características naturales te ayudaron a resolver problemas reales.`,
        dinamicaEquipo: `Tu perfil aporta perspectiva valiosa al trabajo en equipo. Busca entender y valorar las contribuciones diferentes de cada miembro del equipo para máxima sinergia.`,
        carreraAlign: `Explora roles y carreras que se alineen con tu perfil natural. Considera industrias y empresas donde tu tipo de perfil es particularmente valorado.`,
        comunicacionEfectiva: `Adapta tu estilo de comunicación según tu audiencia. Sé consciente de cómo tu perfil comunica naturalmente y usa esa fortaleza estratégicamente.`,
        gestionConflicto: `Entiende tu reacción natural ante conflictos basada en tu perfil. Desarrolla herramientas complementarias para manejar diferentes tipos de conflictos de manera efectiva.`,
        proxiPaso: `Continúa con la fase de Exploración (A2) para profundizar en el conocimiento de ti mismo. Después, aplica estos insights en tu proceso de búsqueda de empleo y desarrollo profesional.`
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
