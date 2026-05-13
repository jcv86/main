import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] A1→OpenAI: Generando coaching personalizado post-test...')
    
    const body = await request.json()
    const { a1Profile, c1Responses } = body

    if (!a1Profile) {
      console.error('[v0] A1→OpenAI: Missing a1Profile')
      return NextResponse.json(
        { success: false, error: 'a1Profile requerido' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) throw new Error('OPENAI_API_KEY no configurada')

    const c1Context = c1Responses
      ? Object.entries(c1Responses)
          .map(([q, a]) => `${a}`)
          .join(' / ')
      : 'Sin contexto previo'

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
            content: `Eres un coach de liderazgo basado en el sistema Despega Cerebral (liderdisc.com).

PERFIL A1 DESCUBIERTO: ${a1Profile}
CONTEXTO PERSONAL (de antes): ${c1Context}

Basándote en su patrón de liderazgo natural (${a1Profile}), genera coaching post-test que:

1. VALIDA su patrón: Por qué su forma de ser es su fortaleza (no "lo que debe mejorar")
2. CONECTA con contexto: Cómo su vida/objetivos personales se alinean con su patrón de liderazgo
3. PRÓXIMO PASO: Qué hacer ahora para expandir su flexibilidad (adaptabilidad, no cambio)

Lenguaje cálido, personal, basado en liderdisc.com. Máximo 5 oraciones.
Termina con una pregunta reflexiva que lo prepare para Conozcámonos 2.`
          }
        ],
        max_tokens: 400,
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[v0] OpenAI error:', error)
      throw new Error(`OpenAI error: ${error.error?.message}`)
    }

    const data = await response.json()
    const coaching = data.choices?.[0]?.message?.content || ''

    console.log('[v0] A1→OpenAI: Coaching generado exitosamente')

    return NextResponse.json({
      success: true,
      coaching,
      profile: a1Profile,
      trazability: 'A1→OpenAI post-test coaching'
    })
  } catch (error: any) {
    console.error('[v0] A1→OpenAI error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
