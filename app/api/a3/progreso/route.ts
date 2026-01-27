import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Obtener ciclo actual del usuario
    const { data: userCiclo } = await supabase
      .from('user_learning_profiles')
      .select('current_cycle')
      .eq('user_id', user.id)
      .single()

    const ciclo_actual = userCiclo?.current_cycle || 30

    // Obtener todas las entrevistas del usuario
    const { data: entrevistas } = await supabase
      .from('a3_entrevistas_guiadas')
      .select('score, created_at, duracion_segundos')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    const total_entrevistas = entrevistas?.length || 0
    const score_promedio = entrevistas?.length 
      ? entrevistas.reduce((sum, e) => sum + (e.score || 0), 0) / entrevistas.length 
      : 0

    // Calcular porcentaje del ciclo (aproximado: 30 días = 100%)
    const ultima_entrevista = entrevistas?.[0]
    const hoy = new Date()
    const dias_transcurridos = ultima_entrevista 
      ? Math.floor((hoy.getTime() - new Date(ultima_entrevista.created_at).getTime()) / (1000 * 60 * 60 * 24))
      : 0
    const porcentaje_ciclo = Math.min(100, (dias_transcurridos / ciclo_actual) * 100)

    // Obtener badges del usuario
    const { data: achievements } = await supabase
      .from('a3_achievements')
      .select('nombre')
      .eq('user_id', user.id)

    const badges = achievements?.map(a => a.nombre) || []

    return NextResponse.json({
      data: {
        ciclo_actual,
        porcentaje_ciclo: Math.round(porcentaje_ciclo),
        total_entrevistas,
        score_promedio: Math.round(score_promedio * 10) / 10,
        ultima_entrevista: ultima_entrevista ? {
          fecha: ultima_entrevista.created_at,
          score: ultima_entrevista.score,
          duracion: ultima_entrevista.duracion_segundos
        } : null,
        badges
      }
    })
  } catch (error) {
    console.error('[v0] Error en /api/a3/progreso:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
