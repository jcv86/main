import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/despega/save-coach-context
 * Guarda snapshots del contexto del usuario de todos los pilares (A1+A2+A3+A4)
 * Permite que el Coach (Sofia/Dani) tenga contexto omniconexo en sus respuestas
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, a1_data, a2_data, a3_data, a4_data } = body

    if (!user_id) {
      return NextResponse.json(
        { error: 'Missing required field: user_id' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    console.log(`[v0] Saving coach context snapshot for user ${user_id}`)

    // Build comprehensive context
    const contextSnapshot = {
      user_id,
      a1_context: a1_data || null,
      a2_context: a2_data || null,
      a3_context: a3_data || null,
      a4_context: a4_data || null,
      contexto_completo: buildComprehensiveContext({
        a1: a1_data,
        a2: a2_data,
        a3: a3_data,
        a4: a4_data,
      }),
      // Note: Timestamps are auto-managed by Supabase (created_at, updated_at)
    }

    // Delete old context (keep only latest)
    await supabase
      .from('coach_context_snapshots')
      .delete()
      .eq('user_id', user_id)

    // Save new context
    const { data: savedContext, error: contextError } = await supabase
      .from('coach_context_snapshots')
      .insert(contextSnapshot)
      .select()
      .single()

    if (contextError || !savedContext) {
      console.error('[v0] Error saving coach context:', contextError)
      return NextResponse.json(
        { error: 'Error saving coach context' },
        { status: 500 }
      )
    }

    console.log(`[v0] Saved coach context for user ${user_id}`)

    return NextResponse.json({
      success: true,
      context_id: savedContext.id,
    })
  } catch (error) {
    console.error('[v0] Error in save-coach-context:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Construye el contexto completo del usuario a partir de todos los pilares
 */
function buildComprehensiveContext(data: any): string {
  const parts: string[] = []

  // A1 - Diagnóstico
  if (data.a1) {
    parts.push(
      `Perfil: ${data.a1.nivel_detectado || 'No definido'} (DISC: ${data.a1.score_energia}E/${data.a1.score_enfoque}En/${data.a1.score_relaciones}R/${data.a1.score_plan_ejecutivo}PE)`
    )
  }

  // A2 - Misión y Sprint
  if (data.a2) {
    parts.push(`Misión: ${data.a2.mision_90_dias || 'No definida'}`)
    parts.push(`Sprint Actual: Ciclo ${data.a2.ciclo_actual}`)
  }

  // A3 - Entrenamientos
  if (data.a3) {
    parts.push(`Entrenamiento: ${data.a3.tema_actual || 'Pendiente'}`)
    parts.push(
      `Progreso A3: ${data.a3.progreso_ciclo || 0}% (Día ${data.a3.dia_ciclo || 1})`
    )
  }

  // A4 - Contexto de Realidad
  if (data.a4) {
    parts.push(`Contexto A4: ${data.a4.foco_actual || 'General'}`)
  }

  return parts.join(' | ')
}
