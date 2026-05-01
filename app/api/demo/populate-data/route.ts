import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Demo users configuration
const DEMO_USERS = [
  { id: 'demo-travis', email: 'travis@nuanu.com', name: 'Travis', role: 'Dev' },
  { id: 'demo-ana', email: 'demo@despegaturcarrera.com', name: 'Ana', role: 'Marketing' },
  { id: 'demo-carlos', email: 'test@dtc.com', name: 'Carlos', role: 'PM' },
  { id: 'demo-admin', email: 'admin@dtc.com', name: 'María', role: 'Admin' },
]

async function populateDemoUserData() {
  const supabase = await createClient()

  for (const demoUser of DEMO_USERS) {
    console.log(`[v0] Populating data for demo user: ${demoUser.name}`)

    // 1. Create/update user profile in profiles table
    await supabase
      .from('profiles')
      .upsert({
        id: demoUser.id,
        email: demoUser.email,
        full_name: demoUser.name,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${demoUser.name}`,
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    // 2. Create despega user profile
    await supabase
      .from('despega_user_profiles')
      .upsert({
        user_id: demoUser.id,
        onboarding_completed: true,
        a1_test_completed: true,
        a1_test_completed_at: new Date().toISOString(),
        a2_intro_seen: true,
        a3_unlocked: true,
        a4_unlocked: true,
        current_ciclo: 1,
        ciclo_start_date: new Date().toISOString().split('T')[0],
        current_stage: 'a3',
        progress_percentage: 35,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    // 3. Create user gamification profile
    await supabase
      .from('user_gamification_profile')
      .upsert({
        user_id: demoUser.id,
        current_level: 'Iniciado',
        current_xp: 2450,
        total_xp: 2450,
        interview_streak: 5,
        best_interview_streak: 7,
        total_interviews_completed: 12,
        total_tips_earned_free: 8,
        total_tips_earned_premium: 3,
        badges: JSON.stringify(['first_test', 'interview_master', 'streak_7']),
        achievements: JSON.stringify([
          { name: 'Primer Test', date: new Date().toISOString() },
          { name: 'Entrevista Perfecta', date: new Date().toISOString() },
        ]),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    // 4. Create user DTC balance
    await supabase
      .from('user_dtc_balance')
      .upsert({
        user_id: demoUser.id,
        balance: 250,
        lifetime_earned: 500,
        lifetime_spent: 250,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    // 5. Create test results (A4 strategic tests)
    await supabase
      .from('a4_user_test_completions')
      .insert({
        user_id: demoUser.id,
        test_id: 'strategic-intelligence-test',
        score: 75,
        answers: JSON.stringify({ q1: 'a', q2: 'b', q3: 'c' }),
        completed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .throwOnError()
      .catch(() => null) // Ignore if duplicate

    // 6. Create module progress (A4)
    await supabase
      .from('a4_module_progress')
      .insert({
        user_id: demoUser.id,
        module_id: 'module-estrategia-1',
        modulo_titulo: 'Estrategia Empresarial Básica',
        progreso_porcentaje: 85,
        completado: false,
        tiempo_dedicado_minutos: 120,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .throwOnError()
      .catch(() => null)

    // 7. Create a few entries in points history
    await supabase
      .from('a4_points_history')
      .insert({
        user_id: demoUser.id,
        relacionado_a: 'module_completion',
        relacionado_id: 'module-1',
        razon: 'Completar módulo de estrategia',
        puntos_ganados: 150,
        balance_anterior: 100,
        balance_nuevo: 250,
        created_at: new Date().toISOString(),
      })
      .throwOnError()
      .catch(() => null)

    // 8. Create badges
    await supabase
      .from('a4_user_badges')
      .insert({
        user_id: demoUser.id,
        badge_id: 'badge-strategist',
        badge_name: 'Estratega',
        badge_description: 'Completa el módulo de estrategia',
        badge_icon: '🎯',
        desbloqueado_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .throwOnError()
      .catch(() => null)

    // 9. Create A3 training data
    await supabase
      .from('a3_user_progreso')
      .insert({
        user_id: demoUser.id,
        fase: 'intermediate',
        entrevistas_completadas: 8,
        score_promedio: 78,
        competencias_desarrolladas: JSON.stringify(['communication', 'confidence', 'clarity']),
        logros: JSON.stringify(['first_interview', 'perfect_score', 'streak_5']),
        empleadores_interesados: 3,
        recomendaciones: JSON.stringify(['Practice eye contact', 'Improve pace', 'Add examples']),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .throwOnError()
      .catch(() => null)

    // 10. Create A2 route progress
    await supabase
      .from('a2_user_route_progress')
      .insert({
        user_id: demoUser.id,
        route_id: 'route-profesional',
        porcentaje_completado: 45,
        estado: 'in_progress',
        dia_actual: 22,
        modulo_actual_id: 'modulo-5',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .throwOnError()
      .catch(() => null)

    // 11. Create strategic score
    await supabase
      .from('a4_strategic_score')
      .insert({
        user_id: demoUser.id,
        score: 72.5,
        score_7day_average: 70.8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .throwOnError()
      .catch(() => null)

    // 12. Create engagement data
    await supabase
      .from('a4_engagement_tracking')
      .insert({
        user_id: demoUser.id,
        event_type: 'module_started',
        feature: 'strategic_module',
        completed: true,
        duration_seconds: 1800,
        a4_score_at_event: 70.5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .throwOnError()
      .catch(() => null)

    console.log(`[v0] Completed populating data for ${demoUser.name}`)
  }

  return { success: true, users: DEMO_USERS.length }
}

export async function POST(request: NextRequest) {
  try {
    // Optional: Add security check
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.DEMO_POPULATE_TOKEN || 'dev-token'

    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await populateDemoUserData()
    return NextResponse.json(result)
  } catch (error) {
    console.error('[v0] Error populating demo data:', error)
    return NextResponse.json(
      { error: 'Failed to populate demo data', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Just return info about what this endpoint does
  return NextResponse.json({
    message: 'POST to this endpoint with Bearer token to populate demo user data',
    demoUsers: DEMO_USERS.map(u => ({ name: u.name, email: u.email })),
  })
}
