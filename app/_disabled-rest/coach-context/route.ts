import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/despega/get-coach-context?user_id=xxx
 * Obtiene el contexto completo del usuario para que el Coach (Sofia/Dani) tenga visibilidad total
 * Devuelve snapshots del estado actual de A1+A2+A3+A4
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json(
        { error: 'Missing required parameter: user_id' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    console.log(`[v0] Getting coach context for user ${user_id}`)

    // Get latest context snapshot
    const { data: contextSnapshot, error: contextError } = await supabase
      .from('coach_context_snapshots')
      .select('*')
      .eq('user_id', user_id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (contextError) {
      console.error('[v0] Error querying coach context:', contextError)
      return NextResponse.json(
        { error: 'Failed to retrieve context' },
        { status: 500 }
      )
    }

    if (!contextSnapshot) {
      // Create initial context for new users
      console.log('[v0] Creating initial coach context for new user:', user_id)
      
      const newContextSnapshot = {
        user_id,
        a1_perfil_disc: 'Pending',
        a1_score_total: 0,
        a1_principales_caracteristicas: {},
        a1_fortalezas: {},
        a1_areas_mejora: {},
        a1_recomendaciones: {},
        a1_insights: {},
        a2_route_id: null,
        a2_route_nombre: null,
        a2_mission_id: null,
        a2_sprint_numero: 0,
        a2_sprint_desafio: null,
        a2_progreso_porcentaje: 0,
        a2_ultima_bitacora_entrada: {},
        a2_progress: {},
        a3_entrenamiento_actual: null,
        a3_entrenamiento_titulo: null,
        a3_progreso_entrenamientos: 0,
        a3_competencias_focos: {},
        a3_feedback: {},
        a4_ultimo_engagement: {},
        a4_badges_desbloqueados: {},
        a4_puntos_acumulados: 0,
        a4_noticias_personalizadas: {},
        a4_intel: {},
        coaching_history: [],
        linkedin_context: {},
        snapshot_version: 1,
      }

      const { data: createdContext, error: createError } = await supabase
        .from('coach_context_snapshots')
        .insert(newContextSnapshot)
        .select()
        .single()

      if (createError || !createdContext) {
        console.error('[v0] Error creating initial coach context:', createError)
        // Return empty context gracefully even if creation fails
        return NextResponse.json({
          success: true,
          context: newContextSnapshot,
          message: 'New user context (created)',
          isNewUser: true,
        })
      }

      console.log('[v0] Created initial coach context for new user:', user_id)
      
      return NextResponse.json({
        success: true,
        context: createdContext,
        message: 'New user context (created)',
        isNewUser: true,
      })
    }

    console.log(`[v0] Retrieved coach context for user ${user_id}`)

    return NextResponse.json({
      success: true,
      context: contextSnapshot,
    })
  } catch (error) {
    console.error('[v0] Error in get-coach-context:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
