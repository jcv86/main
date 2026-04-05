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
    
    if (charCount < 10 || wordCount < 2) {
      console.log(`[v0] Too short - chars: ${charCount}, words: ${wordCount}`)
      return NextResponse.json({
        valid: false,
        message: 'Respuesta muy corta',
        suggestions: `Necesitamos más detalle. Actualmente tienes ${charCount} caracteres. Por favor, desarrolla más tu respuesta (mínimo 10 caracteres y 2 palabras).`
      }, { status: 400 })
    }

    let validationResult

    if (questionType === 'text' || !questionType) {
      // Validación abierta con IA
      validationResult = await validateOpenEndedResponse(
        response,
        question,
        {
          minLength: 10,
          maxLength: 500,
          useAI: true // Usar IA para detectar spam
        }
      )
    } else {
      // Validación básica para otros tipos
      validationResult = validateBasicInput(response, {
        minLength: 3,
        maxLength: 500
      })
    }

    // Retornar resultado
    if (!validationResult.isValid) {
      console.log(`[v0] Validation failed:`, validationResult.errors)
      return NextResponse.json({
        valid: false,
        message: 'Respuesta rechazada',
        suggestions: validationResult.errors[0] || 'Por favor, proporciona una respuesta válida',
        errors: validationResult.errors
      })
    }

    console.log(`[v0] Response accepted - confidence: ${validationResult.confidence || 'n/a'}`)
    return NextResponse.json({
      valid: true,
      message: 'Respuesta aceptada',
      feedback: null,
      confidence: validationResult.confidence
    })
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


