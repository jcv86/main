/**
 * Analytics & Insights Engine
 * 
 * Comprehensive analytics for user progress, performance trends, and personalization insights
 */

import { createClient } from '@/lib/supabase/server'

export interface UserAnalytics {
  userId: string
  completionRate: number
  averageModuleScore: number
  progressTrend: 'accelerating' | 'steady' | 'declining' | 'pending'
  totalDaysCompleted: number
  totalDocumentsCreated: number
  strengthsIdentified: string[]
  weaknessesTargeted: string[]
  estimatedCompletionDate: Date | null
  nextRecommendation: string
}

export interface ModuleAnalytics {
  moduleId: string
  moduleName: string
  completionStatus: 'not_started' | 'in_progress' | 'completed'
  averageScore: number
  attemptCount: number
  timeSpentMinutes: number
  lastAttemptDate: Date | null
  insights: string[]
}

export interface ProgressMetrics {
  currentPhase: number // 1-4
  daysInProgram: number
  completionPercentage: number
  modulesCovered: number
  avgScoreByPhase: Record<string, number>
  documentCount: number
  interviewScores: number[]
  strengthDevelopment: { skill: string; progress: number }[]
  weaknessImprovement: { skill: string; progress: number }[]
}

/**
 * Build comprehensive user analytics
 */
export async function buildUserAnalytics(userId: string): Promise<{
  success: boolean
  analytics?: UserAnalytics
  error?: string
}> {
  try {
    const supabase = await createClient()

    // Fetch all relevant data
    const [
      { data: profile },
      { data: completedModules },
      { data: documents },
      { data: interviewSessions },
      { data: memories }
    ] = await Promise.all([
      supabase.from('despega_user_profiles').select('*').eq('user_id', userId).single(),
      supabase.from('a3_session_attempts').select('*').eq('user_id', userId),
      supabase.from('dtc_documents').select('*').eq('user_id', userId),
      supabase.from('a3_interview_sessions').select('*').eq('user_id', userId),
      supabase.from('memory_items').select('*').eq('user_id', userId),
    ])

    if (!profile) {
      return { success: false, error: 'Profile not found' }
    }

    // Calculate completion rate
    const totalModules = 10
    const completedCount = completedModules?.filter((m: any) => m.status === 'completed').length || 0
    const completionRate = (completedCount / totalModules) * 100

    // Calculate average score
    const scores = interviewSessions?.map((s: any) => s.total_score).filter(Boolean) || []
    const averageModuleScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0

    // Determine progress trend
    const recentSessions = interviewSessions?.slice(-5) || []
    let progressTrend: 'accelerating' | 'steady' | 'declining' | 'pending' = 'pending'
    if (recentSessions.length >= 2) {
      const oldAvg = recentSessions.slice(0, Math.ceil(recentSessions.length / 2)).reduce((a, b) => a + (b.total_score || 0), 0) / Math.ceil(recentSessions.length / 2)
      const newAvg = recentSessions.slice(Math.ceil(recentSessions.length / 2)).reduce((a, b) => a + (b.total_score || 0), 0) / Math.floor(recentSessions.length / 2)
      if (newAvg > oldAvg + 5) progressTrend = 'accelerating'
      else if (newAvg > oldAvg - 5) progressTrend = 'steady'
      else progressTrend = 'declining'
    }

    // Extract strengths and weaknesses from memories
    const strengthsIdentified = memories
      ?.filter((m: any) => m.memory_type === 'strength')
      .map((m: any) => m.content)
      .slice(0, 3) || []

    const weaknessesTargeted = memories
      ?.filter((m: any) => m.memory_type === 'weakness')
      .map((m: any) => m.content)
      .slice(0, 3) || []

    // Calculate days completed
    const startDate = profile.created_at ? new Date(profile.created_at) : new Date()
    const totalDaysCompleted = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    // Estimate completion date
    let estimatedCompletionDate: Date | null = null
    if (completionRate < 100 && totalDaysCompleted > 0) {
      const daysPerModule = totalDaysCompleted / completedCount
      const remainingDays = daysPerModule * (totalModules - completedCount)
      estimatedCompletionDate = new Date(Date.now() + remainingDays * 24 * 60 * 60 * 1000)
    }

    // Next recommendation
    const nextRecommendation = getNextRecommendation(
      completionRate,
      averageModuleScore,
      weaknessesTargeted
    )

    return {
      success: true,
      analytics: {
        userId,
        completionRate,
        averageModuleScore,
        progressTrend,
        totalDaysCompleted,
        totalDocumentsCreated: documents?.length || 0,
        strengthsIdentified,
        weaknessesTargeted,
        estimatedCompletionDate,
        nextRecommendation,
      },
    }
  } catch (error) {
    console.error('[v0] Error building user analytics:', error)
    return {
      success: false,
      error: String(error),
    }
  }
}

/**
 * Get analytics for a specific module
 */
export async function getModuleAnalytics(
  userId: string,
  moduleId: string
): Promise<{ success: boolean; analytics?: ModuleAnalytics; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: sessions } = await supabase
      .from('a3_session_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId)

    if (!sessions || sessions.length === 0) {
      return {
        success: true,
        analytics: {
          moduleId,
          moduleName: moduleId,
          completionStatus: 'not_started',
          averageScore: 0,
          attemptCount: 0,
          timeSpentMinutes: 0,
          lastAttemptDate: null,
          insights: ['Module not started yet'],
        },
      }
    }

    const completedSessions = sessions.filter((s: any) => s.status === 'completed')
    const scores = sessions.map((s: any) => s.score).filter(Boolean)
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0

    const totalTimeMs = sessions.reduce((sum, s: any) => sum + (s.duration_ms || 0), 0)
    const timeSpentMinutes = Math.round(totalTimeMs / 60000)

    const lastAttemptDate = sessions.length > 0 ? new Date(sessions[sessions.length - 1].created_at) : null

    const completionStatus: 'not_started' | 'in_progress' | 'completed' =
      completedSessions.length > 0 ? 'completed' : sessions.length > 0 ? 'in_progress' : 'not_started'

    const insights = generateModuleInsights(completionStatus, avgScore, sessions.length)

    return {
      success: true,
      analytics: {
        moduleId,
        moduleName: moduleId.replace(/-/g, ' '),
        completionStatus,
        averageScore: Math.round(avgScore),
        attemptCount: sessions.length,
        timeSpentMinutes,
        lastAttemptDate,
        insights,
      },
    }
  } catch (error) {
    console.error('[v0] Error getting module analytics:', error)
    return {
      success: false,
      error: String(error),
    }
  }
}

/**
 * Get comprehensive progress metrics
 */
export async function getProgressMetrics(userId: string): Promise<{
  success: boolean
  metrics?: ProgressMetrics
  error?: string
}> {
  try {
    const supabase = await createClient()

    const [{ data: profile }, { data: sessions }, { data: documents }] = await Promise.all([
      supabase.from('despega_user_profiles').select('*').eq('user_id', userId).single(),
      supabase.from('a3_session_attempts').select('*').eq('user_id', userId),
      supabase.from('dtc_documents').select('*').eq('user_id', userId),
    ])

    if (!profile) {
      return { success: false, error: 'Profile not found' }
    }

    // Calculate days in program
    const startDate = new Date(profile.created_at)
    const daysInProgram = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    // Calculate completion percentage
    const totalModules = 10
    const completedModules = sessions?.filter((s: any) => s.status === 'completed').length || 0
    const completionPercentage = (completedModules / totalModules) * 100

    // Count unique modules covered
    const modulesCovered = new Set(sessions?.map((s: any) => s.module_id)).size

    // Calculate avg score by phase
    const phase1Sessions = sessions?.filter((s: any) => ['auditoria-inicial', 'metodo-star', 'cv-inteligente'].includes(s.module_id)) || []
    const phase2Sessions = sessions?.filter((s: any) => ['analisis-vacante', 'analisis-multimodal', 'entrenamiento-guiado'].includes(s.module_id)) || []
    const phase3Sessions = sessions?.filter((s: any) => ['entrenamiento-estructurado', 'simulacion-real'].includes(s.module_id)) || []
    const phase4Sessions = sessions?.filter((s: any) => ['sala-practica', 'evaluacion-final'].includes(s.module_id)) || []

    const avgScoreByPhase = {
      phase1: phase1Sessions.length > 0 ? phase1Sessions.reduce((s, x: any) => s + (x.score || 0), 0) / phase1Sessions.length : 0,
      phase2: phase2Sessions.length > 0 ? phase2Sessions.reduce((s, x: any) => s + (x.score || 0), 0) / phase2Sessions.length : 0,
      phase3: phase3Sessions.length > 0 ? phase3Sessions.reduce((s, x: any) => s + (x.score || 0), 0) / phase3Sessions.length : 0,
      phase4: phase4Sessions.length > 0 ? phase4Sessions.reduce((s, x: any) => s + (x.score || 0), 0) / phase4Sessions.length : 0,
    }

    const interviewScores = sessions?.map((s: any) => s.score).filter(Boolean) || []

    return {
      success: true,
      metrics: {
        currentPhase: Math.ceil(completedModules / 2.5),
        daysInProgram,
        completionPercentage: Math.round(completionPercentage),
        modulesCovered,
        avgScoreByPhase,
        documentCount: documents?.length || 0,
        interviewScores,
        strengthDevelopment: [],
        weaknessImprovement: [],
      },
    }
  } catch (error) {
    console.error('[v0] Error getting progress metrics:', error)
    return {
      success: false,
      error: String(error),
    }
  }
}

function getNextRecommendation(
  completionRate: number,
  avgScore: number,
  weaknesses: string[]
): string {
  if (completionRate < 30) {
    return 'Focus on completing the first 3 modules to establish momentum'
  }
  if (completionRate < 60) {
    return 'Midway point! Keep building consistency with daily tasks'
  }
  if (avgScore < 60 && weaknesses.length > 0) {
    return `Strong focus on improving ${weaknesses[0]} - consider extra practice`
  }
  if (completionRate >= 90) {
    return 'Final push! Polish your portfolio and prepare for final interview'
  }
  return 'Maintain steady progress - you\'re on track!'
}

function generateModuleInsights(
  status: 'not_started' | 'in_progress' | 'completed',
  avgScore: number,
  attemptCount: number
): string[] {
  const insights: string[] = []

  if (status === 'not_started') {
    insights.push('This module is ready to start')
  } else if (status === 'in_progress') {
    insights.push(`You've attempted this module ${attemptCount} times`)
    if (avgScore > 80) {
      insights.push('Great performance! Ready to move forward')
    } else if (avgScore > 60) {
      insights.push('Good progress - consider additional practice')
    } else {
      insights.push('Focus on the core concepts for next attempt')
    }
  } else {
    insights.push('Module completed successfully')
    if (avgScore === 100) {
      insights.push('Perfect score!')
    } else if (avgScore > 80) {
      insights.push('Excellent performance')
    }
  }

  return insights
}

export default {
  buildUserAnalytics,
  getModuleAnalytics,
  getProgressMetrics,
}
