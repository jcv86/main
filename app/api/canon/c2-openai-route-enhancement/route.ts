import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] C2→OpenAI: Enriqueciendo ruta generada con insights IA...')
    
    const { c2Responses, generatedRoute, a1Profile } = await request.json()

    if (!c2Responses || !generatedRoute) {
      console.error('[v0] C2→OpenAI: Missing required data', { 
        hasC2: !!c2Responses, 
        hasRoute: !!generatedRoute,
        body: await request.json().catch(() => 'Parse error') 
      })
      throw new Error('C2 responses y generatedRoute requeridas')
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) throw new Error('OPENAI_API_KEY no configurada')

    // Formatear ruta generada para contexto
    const routeSummary = `
Objetivo 30 días: ${generatedRoute.mision_30.objetivo_principal}
Objetivo 60 días: ${generatedRoute.mision_60.objetivo_principal}
Objetivo 90 días: ${generatedRoute.mision_90.objetivo_principal}
Recomendaciones: ${generatedRoute.recomendaciones_personalizadas?.join(', ')}
Factores de riesgo: ${generatedRoute.factores_riesgo?.join(', ')}
Factores de éxito: ${generatedRoute.factores_exito?.join(', ')}
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
