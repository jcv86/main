import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/gamification/global
 * Consolidates XP and gamification data from ALL user activities
 * Combines: A1, A2, A3, A4 sections + bonuses
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
        },
        { status: 200 }
      )
    }

    const userId = user.id

    // Fetch all section data
    const [
      { data: a3Progress },
      { data: a3Gamification },
      { data: a4Modules },
      { data: interviews },
    ] = await Promise.all([
      supabase
        .from('a3_user_progreso')
        .select('tiempo_dedicado_minutos, sesiones_completadas, progreso_porcentaje, puntos_dtc')
        .eq('user_id', userId)
        .single(),
      supabase
        .from('a3_gamification')
        .select('puntos_xp, nivel_actual, racha_actual, badges_desbloqueados')
        .eq('user_id', userId)
        .single(),
      supabase
        .from('a4_module_progress')
        .select('completado, progreso_porcentaje, tiempo_dedicado_minutos')
        .eq('user_id', userId),
      supabase
        .from('a3_user_entrevistas')
        .select('score_total, created_at')
        .eq('user_id', userId),
    ])

    // Calculate XP from each section
    let totalXp = 0
    const sections: Record<string, any> = {}

    // A3 Section (Entrenamiento Intensivo)
    const a3Xp = (a3Gamification?.puntos_xp || 0) + (a3Progress?.puntos_dtc || 0)
    totalXp += a3Xp
    sections.a3 = {
      name: 'Entrenamiento Intensivo',
      xp: a3Xp,
      sessions: a3Progress?.sesiones_completadas || 0,
      minutes: a3Progress?.tiempo_dedicado_minutos || 0,
      progress: a3Progress?.progreso_porcentaje || 0,
    }

    // A4 Section (Módulos)
    const completedModules = (a4Modules || []).filter((m) => m.completado).length
    const totalModules = (a4Modules || []).length
    const a4Xp = completedModules * 150 // 150 XP per module
    totalXp += a4Xp
    sections.a4 = {
      name: 'Módulos de Conocimiento',
      xp: a4Xp,
      completed: completedModules,
      total: totalModules,
      progress: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
    }

    // Interview Bonus
    const perfectScoreInterviews = (interviews || []).filter((i) => i.score_total >= 95).length
    const interviewBonus = perfectScoreInterviews * 250 // Bonus for perfect scores
    totalXp += interviewBonus
    sections.interviews = {
      name: 'Entrevistas',
      total_completed: interviews?.length || 0,
      perfect_score_bonus: interviewBonus,
      xp_contribution: (interviews?.length || 0) * 50 + interviewBonus,
    }

    // Calculate level (every 1000 XP = 1 level)
    const currentLevel = Math.floor(totalXp / 1000) + 1
    const xpToNextLevel = currentLevel * 1000 - totalXp

    // Consolidate badges
    const badges = [
      ...(a3Gamification?.badges_desbloqueados || []),
    ]

    // Add achievement badges
    if (interviews && interviews.length >= 5) badges.push('🥉 5 Entrevistas')
    if (interviews && interviews.length >= 10) badges.push('🥈 10 Entrevistas')
    if (interviews && interviews.length >= 25) badges.push('🥇 25 Entrevistas')
    if (totalXp >= 5000) badges.push('💎 5k XP Master')
    if (completedModules === totalModules && totalModules > 0) badges.push('🎓 Cursos Completados')

    return NextResponse.json(
      {
        total_xp: totalXp,
        current_level: currentLevel,
        xp_to_next_level: xpToNextLevel,
        daily_streak: a3Gamification?.racha_actual || 0,
        badges: [...new Set(badges)], // Remove duplicates
        sections,
        breakdown: {
          a3_xp: a3Xp,
          a4_xp: a4Xp,
          interview_bonus: interviewBonus,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error calculating global gamification:', error)
    return NextResponse.json(
      {
        total_xp: 0,
        current_level: 1,
        xp_to_next_level: 1000,
        daily_streak: 0,
        badges: [],
        sections: {},
      },
      { status: 200 }
    )
  }
}
