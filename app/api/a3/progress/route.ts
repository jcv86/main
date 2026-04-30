import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          totalMinutes: 0,
          totalSessions: 0,
          completionPercentage: 0,
          sectionProgress: [],
          currentLevel: 1,
          xpPoints: 0,
          xpToNextLevel: 1000,
          badges: [],
          streak: 0,
        },
        { status: 200 }
      )
    }

    const userId = user.id

    // Fetch user progress data
    const { data: progressData } = await supabase
      .from('a3_user_progreso')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Fetch interview history
    const { data: interviews } = await supabase
      .from('a3_user_entrevistas')
      .select('tiempo_dedicado_minutos, score, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    // Fetch module progress
    const { data: modules } = await supabase
      .from('a4_module_progress')
      .select('nombre_modulo, tiempo_dedicado_minutos, completado, progreso_porcentaje')
      .eq('user_id', userId)

    // Return default data if no progress record exists
    if (!progressData) {
      return NextResponse.json(
        {
          totalMinutes: 0,
          totalSessions: 0,
          completionPercentage: 0,
          sectionProgress: [],
          currentLevel: 1,
          xpPoints: 0,
          xpToNextLevel: 1000,
          badges: [],
          streak: 0,
        },
        { status: 200 }
      )
    }

    // Calculate totals
    const totalMinutes = (interviews || []).reduce((sum, iv) => sum + (iv.tiempo_dedicado_minutos || 0), 0)
    const totalSessions = interviews?.length || 0
    const completionPercentage = Math.round(progressData.progreso_porcentaje || 0)

    // Calculate section progress
    const sectionProgress = (modules || []).map((module) => {
      const colors = ['bg-training', 'bg-purple', 'bg-emerald-500', 'bg-amber-500']
      return {
        name: module.nombre_modulo || 'Módulo',
        minutes: module.tiempo_dedicado_minutos || 0,
        sessions: Math.floor((module.tiempo_dedicado_minutos || 0) / 30),
        percentage: Math.round(module.progreso_porcentaje || 0),
        color: colors[Math.floor(Math.random() * colors.length)],
      }
    })

    // Calculate XP and level
    const totalXp = (progressData.puntos_dtc || 0) + totalSessions * 50 + 
      (interviews || []).filter((iv) => iv.score >= 85).length * 100
    const currentLevel = Math.floor(totalXp / 1000) + 1
    const xpToNextLevel = currentLevel * 1000 - totalXp

    // Calculate badges
    const badges = []
    if (totalSessions >= 5) badges.push('🥉 5 Entrenamientos')
    if (totalSessions >= 10) badges.push('🥈 10 Entrenamientos')
    if (totalSessions >= 25) badges.push('🥇 25 Entrenamientos')
    if (totalSessions >= 50) badges.push('👑 50 Entrenamientos')
    if (totalMinutes >= 300) badges.push('⏱️ 5 Horas')
    if (totalMinutes >= 600) badges.push('🔥 10 Horas')
    if ((interviews || []).filter((iv) => iv.score >= 90).length >= 3) badges.push('⭐ Experto')

    // Calculate streak (simple: days with at least one session)
    const dates = new Set(
      (interviews || []).map((iv) => new Date(iv.created_at).toDateString())
    )
    let streak = 0
    let currentDate = new Date()
    for (let i = 0; i < 365; i++) {
      if (dates.has(currentDate.toDateString())) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return NextResponse.json(
      {
        totalMinutes,
        totalSessions,
        completionPercentage,
        sectionProgress,
        currentLevel,
        xpPoints: totalXp,
        xpToNextLevel,
        badges,
        streak,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error in /api/a3/progress:', error)
    return NextResponse.json(
      {
        totalMinutes: 0,
        totalSessions: 0,
        completionPercentage: 0,
        sectionProgress: [],
        currentLevel: 1,
        xpPoints: 0,
        xpToNextLevel: 1000,
        badges: [],
        streak: 0,
      },
      { status: 200 }
    )
  }
}
