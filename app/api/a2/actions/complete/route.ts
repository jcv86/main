import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, actionId } = await request.json()

    if (!userId || !actionId) {
      return NextResponse.json({ error: 'userId y actionId requeridos' }, { status: 400 })
    }

    const supabase = await createClient()

    // Verificar que la accion existe
    const { data: action, error: actionError } = await supabase
      .from('a2_micro_actions')
      .select('*, a2_learning_routes(id, nombre)')
      .eq('id', actionId)
      .single()

    if (actionError || !action) {
      return NextResponse.json({ error: 'Accion no encontrada' }, { status: 404 })
    }

    // Registrar accion completada
    const { error: insertError } = await supabase
      .from('a2_user_actions_completed')
      .insert({
        user_id: userId,
        accion_id: actionId,
        completada_at: new Date().toISOString(),
      })

    if (insertError && insertError.code !== '23505') { // Ignore duplicate
      throw insertError
    }

    // Actualizar progreso del usuario en la ruta
    const routeId = action.ruta_id

    // Contar acciones totales y completadas para esta ruta
    const { count: totalActions } = await supabase
      .from('a2_micro_actions')
      .select('*', { count: 'exact', head: true })
      .eq('ruta_id', routeId)
      .eq('tipo_perfil', action.tipo_perfil)

    const { count: completedActions } = await supabase
      .from('a2_user_actions_completed')
      .select('*, a2_micro_actions!inner(ruta_id)', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('a2_micro_actions.ruta_id', routeId)

    const progressPercent = totalActions ? ((completedActions || 0) / totalActions) * 100 : 0

    // Upsert progreso
    const { error: progressError } = await supabase
      .from('a2_user_route_progress')
      .upsert({
        user_id: userId,
        ruta_id: routeId,
        progreso_porcentaje: progressPercent,
        modulo_actual: action.modulo_id,
        ultimo_acceso: new Date().toISOString(),
      }, {
        onConflict: 'user_id,ruta_id'
      })

    if (progressError) {
      console.error('Error updating progress:', progressError)
    }

    return NextResponse.json({
      success: true,
      message: 'Accion completada',
      progress: progressPercent,
    })
  } catch (error) {
    console.error('Error completing action:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
