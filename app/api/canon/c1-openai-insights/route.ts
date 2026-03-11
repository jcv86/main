'use client'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] C1→OpenAI: Generando insights contextuales pre-A1...')
    
    const { c1Responses, userContext } = await request.json()

    if (!c1Responses || Object.keys(c1Responses).length === 0) {
      throw new Error('C1 responses requeridas')
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) throw new Error('OPENAI_API_KEY no configurada')

    // Formatear respuestas C1 de forma legible
    const c1Summary = Object.entries(c1Responses)
      .map(([q, a]) => `Pregunta ${q}: ${a}`)
      .join('\n')

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
            content: `Eres un coach personal que ha capturado contexto importante sobre alguien ANTES de su test Despega Cerebral.

CONTEXTO CAPTURADO (Conozcámonos 1):
${c1Summary}

Tu trabajo es generar insights conversacionales basados SOLO en este contexto que lo preparen para el test A1. No es análisis psicológico, es preparación.

Genera:
1. OBSERVACIÓN CÁLIDA: Qué notaste interesante en sus respuestas (algo que lo haga sentir visto)
2. PREGUNTA DESAFIANTE: Una pregunta que lo haga reflexionar antes del test
3. RECOMENDACIÓN: Cómo abordar el test A1 para máximo valor

Mantén lenguaje conversacional, personal, sin jargon. Máximo 4 oraciones.`
          }
        ],
        max_tokens: 300,
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[v0] OpenAI error:', error)
      throw new Error(`OpenAI error: ${error.error?.message}`)
    }

    const data = await response.json()
    const insights = data.choices?.[0]?.message?.content || ''

    console.log('[v0] C1→OpenAI: Insights generados exitosamente')

    return NextResponse.json({
      success: true,
      insights,
      trazability: 'C1→OpenAI pre-A1 coaching'
    })
  } catch (error: any) {
    console.error('[v0] C1→OpenAI error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
