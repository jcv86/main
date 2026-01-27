import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { calcularProgresoCompleto } from '@/lib/progress-rewards-system'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 })
    }

    const supabase = await createClient()

    // Obtener acciones completadas del usuario
    const { data: accionesCompletadas } = await supabase
      .from('a2_user_actions_completed')
      .select('a2_micro_actions(dificultad)')
      .eq('user_id', userId)

    // Contar por dificultad
    const accionesPorDificultad = {
      facil: 0,
      intermedia: 0,
      dificil: 0,
      experto: 0
    }

    accionesCompletadas?.forEach((accion: any) => {
      const dificultad = accion.a2_micro_actions?.dificultad || 'intermedia'
      accionesPorDificultad[dificultad as keyof typeof accionesPorDificultad]++
    })

    const totalAcciones = accionesCompletadas?.length || 0

    // Obtener días consecutivos
    const { data: ultimasAcciones } = await supabase
      .from('a2_user_actions_completed')
      .select('completado_at')
      .eq('user_id', userId)
      .order('completado_at', { ascending: false })
      .limit(30)

    let diasConsecutivos = 0
    let diasTotalesActivos = 0
    const hoyMidnight = new Date()
    hoyMidnight.setHours(0, 0, 0, 0)

    if (ultimasAcciones && ultimasAcciones.length > 0) {
      const fechas = new Set<string>()
      ultimasAcciones.forEach((accion: any) => {
        const fecha = new Date(accion.completado_at).toDateString()
        fechas.add(fecha)
      })
      diasTotalesActivos = fechas.size

      // Calcular racha
      let fechaActual = new Date(hoyMidnight)
      diasConsecutivos = 0

      for (let i = 0; i < 365; i++) {
        const fechaStr = fechaActual.toDateString()
        if (fechas.has(fechaStr)) {
          diasConsecutivos++
          fechaActual.setDate(fechaActual.getDate() - 1)
        } else {
          break
        }
      }
    }

    // Obtener rutas completadas
    const { data: rutasCompletadas } = await supabase
      .from('a2_user_route_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('estado', 'completado')

    // Obtener ofertas laborales
    const { data: ofertas } = await supabase
      .from('a3_user_empleador_match')
      .select('id')
      .eq('user_id', userId)
      .eq('estado', 'oferta_activa')

    // Calcular promedio global de puntos (para percentil)
    const { data: todosLosUsuarios } = await supabase
      .from('a2_user_actions_completed')
      .select('user_id')

    const puntosPromedio = totalAcciones * 25 // Promedio estimado

    // Calcular progreso completo
    const progreso = calcularProgresoCompleto(
      totalAcciones,
      accionesPorDificultad,
      diasConsecutivos,
      diasTotalesActivos,
      rutasCompletadas?.length || 0,
      ofertas?.length || 0,
      puntosPromedio
    )

    return NextResponse.json({ success: true, progreso })
  } catch (error) {
    console.error('[v0] Error calculando progreso:', error)
    return NextResponse.json({ error: 'Error al calcular progreso' }, { status: 500 })
  }
}
