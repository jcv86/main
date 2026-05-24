/**
 * A3 Interview Responses API
 * POST endpoint to save user responses during interviews
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getDemoUserFromRequest } from '@/lib/auth/demo-user'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Check for demo user
    const demoUser = getDemoUserFromRequest(request)
    if (demoUser) {
      console.log('[v0] Demo user - skipping A3 response save')
      return NextResponse.json({
        success: true,
        message: 'Demo mode - responses not saved',
        id: 'demo-' + Date.now()
      })
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { sessionId, pregunta, respuestaUsuario, analisis, scores } = body

    // Save response to database
    const { data, error } = await supabase
      .from('a3_respuestas_entrevista')
      .insert({
        sesion_id: sessionId,
        pregunta,
        respuesta_usuario: respuestaUsuario,
        score_contenido: scores?.contenido || 0,
        score_entrega: scores?.entrega || 0,
        score_confianza: scores?.confianza || 0,
        analisis_fortalezas: analisis?.fortalezas || [],
        areas_mejora: analisis?.areas || [],
        sugerencias_especificas: analisis?.sugerencias || '',
        recomendacion_siguiente: analisis?.recomendacion || '',
        pregunta_id: null, // Can be linked later if needed
        user_id: user.id // Add user tracking
      })

    if (error) {
      console.error('[v0] Error saving A3 response:', error)
      return NextResponse.json(
        { error: 'Failed to save response' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Response saved successfully',
      id: (data && data.length > 0) ? data[0].id : 'unknown'
    })
  } catch (error) {
    console.error('[v0] A3 responses API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
