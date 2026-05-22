import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    let user_id = user?.id
    
    // If no Supabase user, check for demo user in cookies
    if (!user_id) {
      console.log('[v0] No Supabase user, checking for demo user')
      const demoUserCookie = request.cookies.get('demo_user')?.value
      if (demoUserCookie) {
        try {
          const demoUser = JSON.parse(demoUserCookie)
          user_id = demoUser.id
          console.log('[v0] Demo user found in dashboard endpoint:', demoUser.email)
        } catch (e) {
          console.error('[v0] Error parsing demo user from cookie:', e)
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
      } else {
        console.log('[v0] User not authenticated and no demo user')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    console.log('[v0] Fetching dashboard data for user:', user_id)

    // Fetch user profile
    const { data: profile } = await supabase
      .from('despega_user_profiles')
      .select('*')
      .eq('user_id', user_id)
      .single()

    // Fetch A1 unified report for DISC profile
    const { data: a1Report } = await supabase
      .from('a1_unified_report')
      .select('perfil_disco_type, cinco_dimensiones')
      .eq('user_id', user_id)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single()

    // Fetch user basic info
    const { data: userInfo } = await supabase
      .from('users')
      .select('full_name, email')
      .eq('id', user_id)
      .single()

    // Fetch A2 mission
    const { data: a2Mission } = await supabase
      .from('a2_user_missions')
      .select('*, a2_learning_routes(nombre)')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Fetch A2 route progress to calculate progress percentage
    const { data: a2Progress } = await supabase
      .from('a2_user_route_progress')
      .select('porcentaje_completado, dia_actual')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Fetch A3 training assignments
    const { data: a3Trainings } = await supabase
      .from('a3_training_assignments')
      .select('id, training_module_id, completed_at')
      .eq('user_id', user_id)

    // Build DISC profile object
    const discProfile = a1Report?.cinco_dimensiones || { D: 0, I: 0, S: 0, C: 0 }
    const dominantProfile = a1Report?.perfil_disco_type || 'D'

    const progressPercent = a2Progress?.porcentaje_completado || 0

    // Format mission data
    const missionData = a2Mission ? {
      id: a2Mission.id,
      titulo: a2Mission.objetivo_especifico || 'Sin título',
      objetivo: a2Mission.objetivo_especifico || 'Sin objetivo',
      sprint_actual: a2Mission.estado === 'active' ? 1 : 0,
      route_nombre: a2Mission.a2_learning_routes?.nombre || 'Ruta Personalizada',
      progreso: a2Progress?.porcentaje_completado || 0,
    } : null

    const dashboardData = {
      name: userInfo?.full_name || 'Usuario',
      email: userInfo?.email || '',
      discProfile,
      dominantProfile,
      progressPercent,
      a2_mission: missionData,
      a3_trainings: a3Trainings || [],
      a2_current_day: a2Progress?.dia_actual || 1,
    }

    console.log('[v0] Dashboard data built:', {
      name: dashboardData.name,
      progressPercent: dashboardData.progressPercent,
      hasA2Mission: !!dashboardData.a2_mission,
    })

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('[v0] Dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 }
    )
  }
}
