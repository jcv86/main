import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/utils/supabase/server'
import { generarFeedbackIA, generarRecomendacionesPerfil, calcularScoreEntrevista } from '@/lib/a3-feedback-ia'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { respuesta, pregunta, sesion_id, pregunta_numero } = body

    // Obtener perfil y capacidad del usuario
    const { data: perfil } = await supabase
      .from('despega_perfil_informe')
      .select('perfil_tipo')
      .eq('user_id', user.id)
      .single()

    const { data: capacidad } = await supabase
      .from('cip_daily_capacity')
      .select('effective_capacity')
      .eq('user_id', user.id)
      .order('fecha', { ascending: false })
      .limit(1)
      .single()

    const perfilTipo = perfil?.perfil_tipo || 'C'
    const cipCapacity = capacidad?.effective_capacity || 50

    // Generar feedback con IA
    const feedback = await generarFeedbackIA({
      respuesta,
      pregunta,
      perfilTipo,
      cipCapacity,
    })

    // Guardar feedback en BD
    if (feedback.success) {
      await supabase.from('a3_entrevista_feedback_ia').insert({
        sesion_id,
        respuesta_usuario: respuesta,
        pregunta,
        analisis_fortalezas: feedback.feedback.fortalezas,
        areas_mejora: feedback.feedback.areas_mejora,
        sugerencias_especificas: feedback.feedback.sugerencias,
        score_contenido: feedback.feedback.score_contenido,
        score_entrega: feedback.feedback.score_entrega,
        score_confianza: feedback.feedback.score_confianza,
        score_promedio: feedback.promedio_score,
      })
    }

    // Generar recomendaciones personalizadas
    const recomendaciones = generarRecomendacionesPerfil(perfilTipo, cipCapacity)

    return NextResponse.json({
      feedback: feedback.feedback,
      recomendaciones,
      promedio_score: feedback.promedio_score,
    })
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json(
      { error: 'Error generating feedback' },
      { status: 500 }
    )
  }
}
