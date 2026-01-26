import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/utils/supabase/server'
import { calculateCerebralProfile, generateInformeContent } from '@/lib/despega-cerebral-logic'
import { generateInformeHTML } from '@/lib/despega-perfil-informe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { userId } = body

    if (!userId || userId !== user.id) {
      return NextResponse.json({ error: 'Usuario no autorizado' }, { status: 403 })
    }

    // Obtener las respuestas del test
    const { data: testData, error: testError } = await supabase
      .from('despega_cerebral_test')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single()

    if (testError || !testData) {
      return NextResponse.json({ error: 'Test no encontrado' }, { status: 404 })
    }

    // Calcular perfil basado en respuestas
    const profile = calculateCerebralProfile(testData.responses)

    // Obtener datos del usuario para completar informe
    const { data: userProfile } = await supabase
      .from('user_learning_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Generar contenido del informe
    const informeContent = generateInformeContent(profile, userProfile)

    // Obtener si es usuario PREMIUM
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    const isPremium = subscription?.status === 'active'

    // Guardar informe en base de datos
    const { data: informe, error: informeError } = await supabase
      .from('despega_perfil_informe')
      .insert({
        user_id: userId,
        perfil_tipo: profile.tipo,
        respuestas_test: testData.responses,
        contenido_informe: informeContent,
        es_premium: isPremium,
        scores: profile.scores,
        generado_at: new Date().toISOString()
      })
      .select()

    if (informeError) throw informeError

    // Generar HTML del informe
    const informeHTML = generateInformeHTML(profile, informeContent, isPremium)

    return NextResponse.json({
      success: true,
      informe: informe[0],
      html: informeHTML,
      isPremium
    })
  } catch (error) {
    console.error('[v0] Error generating informe:', error)
    return NextResponse.json(
      { error: 'Error generando informe' },
      { status: 500 }
    )
  }
}
