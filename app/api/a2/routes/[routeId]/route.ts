import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/utils/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ routeId: string }> }
) {
  try {
    const { routeId } = await params
    const userId = request.nextUrl.searchParams.get('userId')
    const userProfile = request.nextUrl.searchParams.get('profile') || 'C'

    if (!userId) {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 })
    }

    const supabase = await createClient()

    // Obtener ruta
    const { data: route, error: routeError } = await supabase
      .from('a2_learning_routes')
      .select('*')
      .eq('id', routeId)
      .single()

    if (routeError || !route) {
      return NextResponse.json({ error: 'Ruta no encontrada' }, { status: 404 })
    }

    // Obtener modulos
    const { data: modules } = await supabase
      .from('a2_route_modules')
      .select('*')
      .eq('ruta_id', routeId)
      .order('orden', { ascending: true })

    // Obtener microacciones personalizadas por perfil
    const { data: actions } = await supabase
      .from('a2_micro_actions')
      .select('*')
      .eq('ruta_id', routeId)
      .eq('tipo_perfil', userProfile)
      .order('dia', { ascending: true })

    // Obtener progreso del usuario
    const { data: userProgress } = await supabase
      .from('a2_user_route_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('ruta_id', routeId)
      .single()

    // Obtener acciones completadas
    const { data: completedActions } = await supabase
      .from('a2_user_actions_completed')
      .select('accion_id')
      .eq('user_id', userId)

    const completedIds = new Set(completedActions?.map(a => a.accion_id) || [])

    // Estructurar respuesta con modulos y acciones
    const modulesWithActions = (modules || []).map(module => ({
      ...module,
      acciones: (actions || [])
        .filter(a => a.modulo_id === module.id)
        .map(a => ({
          ...a,
          completada: completedIds.has(a.id)
        }))
    }))

    // Calcular progreso total
    const totalActions = actions?.length || 1
    const completedCount = completedIds.size
    const progress = (completedCount / totalActions) * 100

    // Determinar modulo actual
    let currentModule = 0
    for (let i = 0; i < modulesWithActions.length; i++) {
      const moduleComplete = modulesWithActions[i].acciones.every((a: any) => a.completada)
      if (!moduleComplete) {
        currentModule = i
        break
      }
      if (i === modulesWithActions.length - 1) {
        currentModule = i
      }
    }

    return NextResponse.json({
      route,
      modules: modulesWithActions,
      progress,
      currentModule,
      userProgress,
    })
  } catch (error) {
    console.error('Error fetching route:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
