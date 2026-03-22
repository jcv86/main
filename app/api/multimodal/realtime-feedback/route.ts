import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

/**
 * POST /api/multimodal/realtime-feedback
 * Lightweight analysis for real-time coaching
 */
export async function POST(request: NextRequest) {
  try {
    const { frameData } = await request.json()

    if (!frameData) {
      return NextResponse.json(
        { error: 'No frame data provided' },
        { status: 400 }
      )
    }

    // Quick analysis with GPT-4o
    const response = await openai.messages.create({
      model: 'gpt-4o',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analiza rápidamente esta captura de entrevista y proporciona 1-2 feedback puntuales INMEDIATOS.

Enfócate en lo MÁS IMPORTANTE para mejorar AHORA MISMO:
- ¿La postura es profesional?
- ¿El contacto visual es directo?
- ¿Los gestos son naturales o forzados?
- ¿Se ve seguro/a?

Responde SOLO con JSON, máximo 2 feedback items:
{
  "feedback": [
    {
      "type": "eye-contact|posture|gestures|confidence",
      "severity": "critical|warning|info",
      "message": "Lo que observo",
      "suggestion": "Acción inmediata a realizar"
    }
  ]
}`
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: frameData
              }
            }
          ]
        }
      ]
    })

    const analysisText =
      response.content[0].type === 'text' ? response.content[0].text : '{}'

    try {
      const feedback = JSON.parse(analysisText)
      return NextResponse.json(feedback)
    } catch {
      // If parsing fails, return empty feedback
      return NextResponse.json({ feedback: [] })
    }
  } catch (error) {
    console.error('[v0] Real-time feedback error:', error)
    // Don't fail the recording if feedback analysis fails
    return NextResponse.json({ feedback: [] })
  }
}
