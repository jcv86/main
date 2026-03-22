import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/conozcamonos/validate-response
 * Simple validation - just check minimum length
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

    // For any question type, just check minimum length (5+ words)
    const wordCount = response.trim().split(/\s+/).length
    
    if (wordCount < 5) {
      return NextResponse.json({
        valid: false,
        message: 'Respuesta muy corta',
        suggestions: `Necesitamos al menos 5 palabras. Actualmente tienes ${wordCount}. Por favor, desarrolla más tu respuesta.`
      })
    }

    // All other responses are accepted
    console.log(`[v0] Response accepted (${wordCount} words)`)
    return NextResponse.json({
      valid: true,
      message: 'Respuesta aceptada',
      feedback: null
    })
  } catch (error) {
    console.error('[v0] Validation endpoint error:', error)
    // If error, accept to not block user
    return NextResponse.json({
      valid: true,
      message: 'Respuesta aceptada',
      feedback: null
    })
  }
}

