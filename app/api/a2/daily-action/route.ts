import { createClient } from '@/app/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const userId = request.nextUrl.searchParams.get('userId')
    const routeId = request.nextUrl.searchParams.get('routeId')
    const profile = request.nextUrl.searchParams.get('profile')

    if (!userId || !routeId || !profile) {
      return NextResponse.json(
        { error: 'Parámetros requeridos: userId, routeId, profile' },
        { status: 400 }
      )
    }

    // Obtener progreso del usuario en la ruta
    const { data: progress, error: progressError } = await supabase
      .from('a2_user_route_progress')
      .select('dia_actual, modulo_actual_id')
      .eq('user_id', userId)
      .eq('route_id', routeId)
      .single()

    if (progressError) {
      console.error('[v0] Error getting progress:', progressError)
      return NextResponse.json(
        { error: 'Usuario no tiene esta ruta en progreso' },
        { status: 404 }
      )
    }

    const diaActual = progress?.dia_actual || 1
    const moduloId = progress?.modulo_actual_id

    // Obtener microacción personalizada del día según el perfil del usuario
    const { data: action, error: actionError } = await supabase
      .from('a2_micro_actions')
      .select('*')
      .eq('dia', diaActual)
      .eq('tipo_perfil', profile)
      .eq('module_id', moduloId)
      .single()

    if (actionError) {
      console.error('[v0] Error getting action:', actionError)
      return NextResponse.json(
        { error: 'No hay microacción para hoy' },
        { status: 404 }
      )
    }

    // Verificar si ya fue completada hoy
    const { data: completed } = await supabase
      .from('a2_user_actions_completed')
      .select('id')
      .eq('user_id', userId)
      .eq('action_id', action.id)
      .single()

    return NextResponse.json({
      success: true,
      action: {
        id: action.id,
        titulo: action.titulo,
        descripcion: action.descripcion,
        formato: action.formato,
        duracion_minutos: action.duracion_minutos,
        tareas: action.tareas || [],
        objetivos: action.objetivos || [],
        contenido_url: action.contenido_url
      },
      completed: !!completed,
      dia: diaActual,
      modulo_id: moduloId
    })
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json(
      { error: 'Error obteniendo microacción del día' },
      { status: 500 }
    )
  }
}
