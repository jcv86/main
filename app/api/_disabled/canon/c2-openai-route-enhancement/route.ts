import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] C2→OpenAI: Enriqueciendo ruta generada con insights IA...')
    
    const body = await request.json()
    const { c2Responses, generatedRoute, a1Profile } = body

    // Validate required data with detailed checks
    if (!c2Responses) {
      console.error('[v0] C2→OpenAI: Missing c2Responses', { hasC2: !!c2Responses })
      return NextResponse.json(
        { success: false, error: 'c2Responses requerida' },
        { status: 400 }
      )
    }

    if (!generatedRoute) {
      console.error('[v0] C2→OpenAI: Missing generatedRoute', { hasRoute: !!generatedRoute })
      return NextResponse.json(
        { success: false, error: 'generatedRoute requerida' },
        { status: 400 }
      )
    }

    // Validate generatedRoute structure
    if (!generatedRoute.mision_30 || !generatedRoute.mision_60 || !generatedRoute.mision_90) {
      console.error('[v0] C2→OpenAI: Invalid generatedRoute structure')
      return NextResponse.json(
        { success: false, error: 'generatedRoute tiene estructura inválida (falta mision_30/60/90)' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) throw new Error('OPENAI_API_KEY no configurada')

    // Formatear ruta generada para contexto (con null coalescing)
    const routeSummary = `
Objetivo 30 días: ${generatedRoute.mision_30?.objetivo_principal || 'No especificado'}
Objetivo 60 días: ${generatedRoute.mision_60?.objetivo_principal || 'No especificado'}
Objetivo 90 días: ${generatedRoute.mision_90?.objetivo_principal || 'No especificado'}
Recomendaciones: ${generatedRoute.recomendaciones_personalizadas?.join(', ') || 'Sin recomendaciones'}
Factores de riesgo: ${generatedRoute.factores_riesgo?.join(', ') || 'Ninguno identificado'}
Factores de éxito: ${generatedRoute.factores_exito?.join(', ') || 'Ninguno especificado'}
    `

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `Eres un experto en diseño de rutas de aprendizaje personalizado. Acabas de generar una ruta 90 días para alguien.

PERFIL: ${a1Profile}
RUTA GENERADA:
${routeSummary}

Tu trabajo es crear UN SOLO insight maestro que:

1. SINTETIZA la ruta: Une los 3 milestones en una narrativa coherente
2. EMPODERA: Hace que la persona vea esta ruta como su viaje de transformación personal
3. MOTIVA: Una razón CLARA por qué completar esta ruta cambiaría su carrera/vida

El insight debe sonar como una verdad que la persona necesitaba escuchar.
Una sola oración poderosa. Que suene como: "Esto es exactamente lo que necesitaba."

Basate en su patrón (${a1Profile}) - no genérico, específico para cómo lidera.`
          }
        ],
        max_tokens: 250,
        temperature: 0.85,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[v0] OpenAI error:', error)
      throw new Error(`OpenAI error: ${error.error?.message}`)
    }

    const data = await response.json()
    const routeInsight = data.choices?.[0]?.message?.content || ''

    // Enriquecer ruta con insights
    const enrichedRoute = {
      ...generatedRoute,
      ia_route_insight: routeInsight,
      generated_at: new Date().toISOString(),
      trazability: 'C1+A1+C2→OpenAI Route Enhancement'
    }

    console.log('[v0] C2→OpenAI: Ruta enriquecida exitosamente')

    return NextResponse.json({
      success: true,
      enrichedRoute,
      masterInsight: routeInsight,
    })
  } catch (error: any) {
    console.error('[v0] C2→OpenAI error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
