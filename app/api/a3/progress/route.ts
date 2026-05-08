import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { calculateProgressPercentage, syncProgressToDatabase } from '@/lib/progress-calculation'
import { 
  getCurrentAchievement, 
  getNextAchievement, 
  getPointsToNextMilestone,
  getUnlockedAchievements,
  calculateTotalPoints
} from '@/lib/pillar3-achievements'
import {
  getCompletionPercentage as getPointBasedCompletion,
  calculateModuleProgress,
  getTotalPossiblePoints,
  PILLAR3_POINTS_CONFIG
} from '@/lib/pillar3-points-system'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      const currentAchievement = getCurrentAchievement(0)
      const nextAchievement = getNextAchievement(0)
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
          achievement: currentAchievement,
          nextAchievement: nextAchievement,
          pointsToNextMilestone: getPointsToNextMilestone(0),
          unlockedAchievements: getUnlockedAchievements(0),
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
      .select('tiempo_dedicado_minutos, score_total, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    // Fetch training assignments (actual completed trainings with dates)
    const { data: trainingSessions } = await supabase
      .from('a3_training_assignments')
      .select('*')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })

    // Fetch training module completions (tracks XP awards)
    const { data: completions } = await supabase
      .from('a3_training_module_completions')
      .select('*')
      .eq('user_id', userId)

    // Calculate XP from first completions
    let totalXPEarned = 0
    if (completions) {
      completions.forEach((completion) => {
        totalXPEarned += completion.xp_amount || 0
      })
    }

    console.log('[v0] Training completions:', completions?.length || 0, 'Total XP:', totalXPEarned)

    // Calculate points from training sessions
    let totalPointsEarned = 0
    const moduleProgress: Record<string, number> = {}

    // Initialize all modules
    Object.values(PILLAR3_POINTS_CONFIG).forEach((module) => {
      moduleProgress[module.id] = 0
    })

    // Count completed trainings per module type (for points, not XP)
    if (trainingSessions) {
      trainingSessions.forEach((session) => {
        // Map training module to module type and add points
        // Since a3_training_assignments links to training_module_id, we can use that
        const moduleId = session.training_module_id?.toString() || ''
        
        // Give points for each completed training (separate from XP)
        const basePoints = PILLAR3_POINTS_CONFIG.audit_initial.pointsPerLesson // ~20-30 points per training
        totalPointsEarned += basePoints
        
        // Track completion by module
        moduleProgress['completed_sessions'] = (moduleProgress['completed_sessions'] || 0) + 1
      })
    }

    // Calculate total points from modules
    totalPointsEarned = Object.values(moduleProgress).reduce((sum, points) => sum + points, 0)

    // Calculate completion percentage based on EARNED XP (1000 XP = 100%)
    const totalPossibleXP = 1000
    const xpBasedCompletion = Math.min((totalXPEarned / totalPossibleXP) * 100, 100)

    // Fetch module progress
    const { data: modules } = await supabase
      .from('a4_module_progress')
      .select('modulo_titulo, tiempo_dedicado_minutos, completado, progreso_porcentaje')
      .eq('user_id', userId)

    // Calculate totals
    const interviewMinutes = (interviews || []).reduce((sum, iv) => sum + (iv.tiempo_dedicado_minutos || 0), 0)
    
    // Get actual elapsed time from training sessions
    const trainingMinutes = (trainingSessions || []).reduce((sum, session) => sum + (session.duration_minutes || 45), 0)
    
    const totalMinutes = interviewMinutes + trainingMinutes
    const totalSessions = (interviews?.length || 0) + (trainingSessions?.length || 0)
    
    console.log('[v0] Progress calculation - Interviews:', interviewMinutes, 'Training:', trainingMinutes, 'Total:', totalMinutes, 'XP Earned:', totalXPEarned, 'Completion %:', xpBasedCompletion)
    
    // Use XP-based completion percentage (0-100% based on earned XP out of 1000)
    const completionPercentage = Math.round(xpBasedCompletion)
    
    // Sync the calculated progress back to database for future reference
    await syncProgressToDatabase(userId, completionPercentage)

    // Calculate section progress
    const sectionProgress = (modules || []).map((module) => {
      const colors = ['bg-training', 'bg-purple', 'bg-emerald-500', 'bg-amber-500']
      return {
        name: module.modulo_titulo || 'Módulo',
        minutes: module.tiempo_dedicado_minutos || 0,
        sessions: Math.floor((module.tiempo_dedicado_minutos || 0) / 30),
        percentage: Math.round(module.progreso_porcentaje || 0),
        color: colors[Math.floor(Math.random() * colors.length)],
      }
    })

    // Calculate XP and level based on earned points and sessions
    const totalXp = totalPointsEarned + totalSessions * 50 + 
      (interviews || []).filter((iv) => iv.score_total >= 85).length * 100
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
    if ((interviews || []).filter((iv) => iv.score_total >= 90).length >= 3) badges.push('⭐ Experto')

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
        totalPointsEarned: totalXPEarned,
        totalPossiblePoints: totalPossibleXP,
        sectionProgress,
        currentLevel,
        xpPoints: totalXp,
        xpToNextLevel,
        badges,
        streak,
        achievement: getCurrentAchievement(completionPercentage),
        nextAchievement: getNextAchievement(completionPercentage),
        pointsToNextMilestone: getPointsToNextMilestone(completionPercentage),
        unlockedAchievements: getUnlockedAchievements(completionPercentage),
        moduleProgress,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error in /api/a3/progress:', error)
    const currentAchievement = getCurrentAchievement(0)
    const nextAchievement = getNextAchievement(0)
    return NextResponse.json(
      {
        totalMinutes: 0,
        totalSessions: 0,
        completionPercentage: 0,
        totalPointsEarned: 0,
        totalPossiblePoints: getTotalPossiblePoints(),
        sectionProgress: [],
        currentLevel: 1,
        xpPoints: 0,
        xpToNextLevel: 1000,
        badges: [],
        streak: 0,
        achievement: currentAchievement,
        nextAchievement: nextAchievement,
        pointsToNextMilestone: getPointsToNextMilestone(0),
        unlockedAchievements: getUnlockedAchievements(0),
        moduleProgress: {},
      },
      { status: 200 }
    )
  }
}
