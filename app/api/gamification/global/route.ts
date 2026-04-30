import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/gamification/global
 * 
 * Fetches consolidated XP data from user_gamification_profile (pre-calculated by triggers).
 * Returns breakdown by section and total stats.
 * 
 * Architecture:
 * - xp_activity_logs tracks every XP gain with its source section
 * - Triggers automatically recalculate and sync to user_gamification_profile
 * - This endpoint reads the pre-calculated values (fast, consistent, reliable)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          total_xp: 0,
          current_level: 1,
          xp_to_next_level: 1000,
          daily_streak: 0,
          badges: [],
          sections: {},
          breakdown: {
            a3_xp: 0,
            a4_xp: 0,
            interview_bonus: 0,
          },
        },
        { status: 200 }
      )
    }

    const userId = user.id

    // Fetch pre-calculated XP from profile (updated by triggers)
    const { data: profile, error: profileError } = await supabase
      .from('user_gamification_profile')
      .select('xp_a3_total, xp_a4_total, xp_interview_bonus, xp_global_total, current_level, daily_streak, badges_desbloqueados')
      .eq('user_id', userId)
      .single()

    if (profileError || !profile) {
      console.warn('[v0] Profile not found for user, returning defaults')
      return NextResponse.json(
        {
          total_xp: 0,
          current_level: 1,
          xp_to_next_level: 1000,
          daily_streak: 0,
          badges: [],
          sections: {},
          breakdown: {
            a3_xp: 0,
            a4_xp: 0,
            interview_bonus: 0,
          },
        },
        { status: 200 }
      )
    }

    // Calculate XP to next level
    const xpToNextLevel = profile.current_level * 1000 - profile.xp_global_total

    // Fetch section details for additional context
    const [{ data: a3Progress }, { data: a4Modules }, { data: interviews }] = await Promise.all([
      supabase
        .from('a3_user_progreso')
        .select('tiempo_dedicado_minutos, sesiones_completadas, progreso_porcentaje')
        .eq('user_id', userId)
        .single(),
      supabase
        .from('a4_module_progress')
        .select('completado')
        .eq('user_id', userId),
      supabase
        .from('a3_user_entrevistas')
        .select('score_total')
        .eq('user_id', userId),
    ])

    const completedModules = (a4Modules || []).filter((m) => m.completado).length
    const totalModules = (a4Modules || []).length

    const sections = {
      a3: {
        name: 'Entrenamiento Intensivo',
        xp: profile.xp_a3_total,
        sessions: a3Progress?.sesiones_completadas || 0,
        minutes: a3Progress?.tiempo_dedicado_minutos || 0,
        progress: a3Progress?.progreso_porcentaje || 0,
      },
      a4: {
        name: 'Módulos de Conocimiento',
        xp: profile.xp_a4_total,
        completed: completedModules,
        total: totalModules,
        progress: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
      },
      interviews: {
        name: 'Entrevistas',
        total_completed: interviews?.length || 0,
        xp_contribution: profile.xp_interview_bonus,
      },
    }

    // Consolidate badges
    const badges = profile.badges_desbloqueados || []
    
    // Add dynamic badges based on XP milestones
    if (profile.xp_global_total >= 5000) badges.push('💎 5k XP Master')
    if (profile.xp_global_total >= 10000) badges.push('🌟 10k XP Legend')
    if (completedModules === totalModules && totalModules > 0) badges.push('🎓 Cursos Completados')

    return NextResponse.json(
      {
        total_xp: profile.xp_global_total,
        current_level: profile.current_level,
        xp_to_next_level: xpToNextLevel,
        daily_streak: profile.daily_streak || 0,
        badges: [...new Set(badges)], // Remove duplicates
        sections,
        breakdown: {
          a3_xp: profile.xp_a3_total,
          a4_xp: profile.xp_a4_total,
          interview_bonus: profile.xp_interview_bonus,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error fetching global gamification:', error)
    return NextResponse.json(
      {
        total_xp: 0,
        current_level: 1,
        xp_to_next_level: 1000,
        daily_streak: 0,
        badges: [],
        sections: {},
        breakdown: {
          a3_xp: 0,
          a4_xp: 0,
          interview_bonus: 0,
        },
      },
      { status: 200 }
    )
  }
}
