import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateOpenEndedResponse, validateBasicInput } from '@/lib/input-validator'

/**
 * POST /api/conozcamonos/validate-response
 * Validación mejorada con IA para detectar texto basura
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
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

    // BASIC CHECKS FIRST - Detect obvious spam patterns
    const trimmedResponse = response.trim()
    
    if (!trimmedResponse) {
      return NextResponse.json({
        valid: false,
        message: 'Respuesta vacía',
        suggestions: 'Por favor, proporciona una respuesta.'
      }, { status: 400 })
    }

    // Check for spam patterns: repeated characters like "asdasdasd", "sdsdsdsds", "123123123"
    const spamPatterns = [
      /^([a-z])\1{4,}$/i,                    // aaaaa, bbbbb
      /^([a-z]{2,})\1{2,}$/i,                // asasas, xyxyxy
      /^([a-z]{3,})\1{1,}$/i,                // abcabc, xyzxyz
      /^(\d)\1{4,}$/,                        // 11111, 99999
      /^(\d{2,})\1{1,}$/,                    // 1212, 9898
      /^[a-z]{20,}$/i,                       // aaaabbbbccccddddeeee (long repeated)
    ]
    
    const isSpam = spamPatterns.some(pattern => pattern.test(trimmedResponse))
    if (isSpam) {
      console.log(`[v0] SPAM DETECTED - Pattern match: ${trimmedResponse}`)
      return NextResponse.json({
        valid: false,
        message: 'Respuesta rechazada',
        suggestions: 'Parece que escribiste caracteres aleatorios. Por favor, proporciona una respuesta genuina y reflexionada.'
      }, { status: 400 })
    }

    // Check minimum length (at least 10 characters, 2+ words)
    const wordCount = trimmedResponse.split(/\s+/).length
    const charCount = trimmedResponse.length
    console.log(`[v0] Length check: chars=${charCount}, words=${wordCount}`)
    
    if (charCount < 10 || wordCount < 2) {
      console.log(`[v0] Too short - chars: ${charCount}, words: ${wordCount}`)
      return NextResponse.json({
        valid: false,
        message: 'Respuesta muy corta',
        suggestions: `Necesitamos más detalle. Actualmente tienes ${charCount} caracteres. Por favor, desarrolla más tu respuesta (mínimo 10 caracteres y 2 palabras).`
      }, { status: 400 })
    }

    // NOW use OpenAI to validate if the text makes sense
    console.log(`[v0] Using OpenAI to validate response quality...`)
    try {
      const aiValidationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a strict validator. Determine if the user's response is genuine, thoughtful, and makes sense.
              
REJECT if:
- Random letters/gibberish (like "xsadasfasfasfa afa sfas" or "asdasdasd")
- Keyboard mashing or random character sequences
- Text that shows no genuine effort or coherence
- Responses that are clearly not attempting to answer the question

ACCEPT if:
- Text shows genuine thought or effort
- It answers the question meaningfully
- Even if short or imperfect, it shows intent to answer

Respond ONLY with valid JSON: {"isValid": true or false, "reason": "brief explanation"}`,
            },
            {
              role: 'user',
              content: `Pregunta: "${question}"

Respuesta del usuario: "${trimmedResponse}"

¿Es esta una respuesta genuina y reflexionada?`,
            },
          ],
          temperature: 0.3,
          max_tokens: 100,
        }),
      })

      if (!aiValidationResponse.ok) {
        console.log(`[v0] OpenAI API error, accepting response to not block user`)
        return NextResponse.json({
          valid: true,
          message: 'Respuesta aceptada',
          feedback: null
        })
      }

      const aiData = await aiValidationResponse.json()
      const aiContent = aiData.choices?.[0]?.message?.content
      console.log(`[v0] OpenAI validation response:`, aiContent)

      try {
        const aiValidation = JSON.parse(aiContent)
        
        if (!aiValidation.isValid) {
          console.log(`[v0] OpenAI rejected response:`, aiValidation.reason)
          return NextResponse.json({
            valid: false,
            message: 'Respuesta rechazada',
            suggestions: `${aiValidation.reason} Por favor, proporciona una respuesta genuina y reflexionada.`
          }, { status: 400 })
        }

        console.log(`[v0] OpenAI approved response`)
        return NextResponse.json({
          valid: true,
          message: 'Respuesta aceptada',
          feedback: null
        })
      } catch (parseErr) {
        console.log(`[v0] Error parsing AI response, accepting to not block user`)
        return NextResponse.json({
          valid: true,
          message: 'Respuesta aceptada',
          feedback: null
        })
      }
    } catch (aiErr) {
      console.log(`[v0] OpenAI validation failed:`, aiErr)
      return NextResponse.json({
        valid: true,
        message: 'Respuesta aceptada',
        feedback: null
      })
    }
  } catch (error) {
    console.error('[v0] Validation endpoint error:', error)
    // Si hay error, aceptar para no bloquear usuario
    return NextResponse.json({
      valid: true,
      message: 'Respuesta aceptada',
      feedback: null
    })
  }
}


