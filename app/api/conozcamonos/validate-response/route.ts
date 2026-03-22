import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

/**
 * POST /api/conozcamonos/validate-response
 * Validates user response using OpenAI to ensure quality/completeness
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Verify authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { questionId, question, response, questionType } = await request.json()

    if (!questionId || !question || !response) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log(`[v0] Validating response for question: ${questionId}`)

    // For select type questions, always accept (user selected from options)
    if (questionType === 'select') {
      return NextResponse.json({
        valid: true,
        message: 'Respuesta aceptada',
        feedback: null
      })
    }

    // For text type questions, validate with OpenAI
    if (questionType === 'text') {
      // Check minimum length first (avoid unnecessary API calls)
      const wordCount = response.trim().split(/\s+/).length
      if (wordCount < 10) {
        return NextResponse.json({
          valid: false,
          message: 'Respuesta muy corta. Por favor, proporciona más detalles.',
          feedback: `Tu respuesta tiene ${wordCount} palabras. Necesitamos al menos 10 palabras para entender mejor tu situación.`,
          wordCount
        })
      }

      // Use OpenAI to validate response quality
      const validationPrompt = `
Eres un evaluador profesional de respuestas de entrevista. Tu tarea es validar si la respuesta del usuario es suficientemente completa y detallada para la siguiente pregunta de entrevista.

PREGUNTA: "${question}"

RESPUESTA DEL USUARIO: "${response}"

Evalúa la respuesta basándote en estos criterios:
1. ¿Responde directamente la pregunta?
2. ¿Proporciona detalles específicos y ejemplos concretos?
3. ¿Tiene suficiente profundidad (no es una respuesta superficial)?
4. ¿Muestra reflexión y auto-conciencia?
5. ¿Es clara y bien estructurada?

RESPONDE EXACTAMENTE EN ESTE FORMATO (JSON):
{
  "valid": true o false,
  "score": número entre 0-100,
  "reasoning": "explicación breve de por qué es válida o no",
  "suggestions": "si no es válida, qué le falta específicamente"
}

Si score >= 60, considera la respuesta como VÁLIDA.
Si score < 60, considera la respuesta como INVÁLIDA y sugiere mejoras.
      `

      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: validationPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 300
        })

        const responseText = completion.choices[0].message.content || ''
        console.log(`[v0] OpenAI validation response: ${responseText}`)

        // Parse JSON response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          console.error('[v0] Could not parse OpenAI response:', responseText)
          // If parsing fails, accept the response to not block user
          return NextResponse.json({
            valid: true,
            message: 'Respuesta aceptada',
            feedback: null
          })
        }

        const validation = JSON.parse(jsonMatch[0])
        
        console.log(`[v0] Validation result: score=${validation.score}, valid=${validation.valid}`)

        return NextResponse.json({
          valid: validation.valid || validation.score >= 60,
          score: validation.score,
          message: validation.valid || validation.score >= 60 
            ? 'Respuesta aceptada' 
            : 'Respuesta incompleta. ' + (validation.suggestions || 'Por favor, proporciona más detalles.'),
          feedback: validation.reasoning,
          suggestions: validation.suggestions
        })
      } catch (error) {
        console.error('[v0] OpenAI validation error:', error)
        // If OpenAI fails, accept response to not block user
        return NextResponse.json({
          valid: true,
          message: 'Respuesta aceptada',
          feedback: null
        })
      }
    }

    return NextResponse.json({
      valid: true,
      message: 'Respuesta aceptada',
      feedback: null
    })
  } catch (error) {
    console.error('[v0] Validation endpoint error:', error)
    return NextResponse.json(
      { error: 'Error validating response', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
