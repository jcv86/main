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


