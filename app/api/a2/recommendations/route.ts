import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/utils/supabase/server'
import { getRouteRecommendations } from '@/lib/a2-personalization-logic'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 })
    }

    const supabase = await createClient()

    // Obtener perfil del usuario de A1
    const { data: userProfile } = await supabase
      .from('a1_tests_results')
      .select('resultado, test_id')
      .eq('user_id', userId)
      .eq('test_id', 'despega_cerebral')
      .single()

    // Obtener capacidad CIP
    const { data: cipProfile } = await supabase
      .from('user_capacity_profile')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Obtener todas las rutas disponibles
    const { data: routes } = await supabase
      .from('a2_learning_routes')
      .select('*')
      .eq('activa', true)
      .order('orden', { ascending: true })

    // Obtener progreso existente del usuario
    const { data: userProgress } = await supabase
      .from('a2_user_route_progress')
      .select('*, a2_learning_routes(*)')
      .eq('user_id', userId)

    // Calcular recomendaciones personalizadas
    const discProfile = userProfile?.resultado?.tipo || 'C'
    const capacityLevel = cipProfile?.a1_base || 60

    const recommendations = getRouteRecommendations(
      discProfile,
      capacityLevel,
      routes || [],
      userProgress || []
    )

    return NextResponse.json({
      success: true,
      recommendations,
      userProfile: discProfile,
      capacityLevel,
      activeRoutes: userProgress?.filter(p => p.progreso_porcentaje > 0 && p.progreso_porcentaje < 100) || [],
      completedRoutes: userProgress?.filter(p => p.progreso_porcentaje >= 100) || [],
    })
  } catch (error) {
    console.error('Error getting recommendations:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
