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
          currentLevel: 1,
          totalXp: 0,
          xpToNextLevel: 1000,
          streak: 0,
          badges: [],
          nextChallenge: {
            name: 'Iniciador',
            description: 'Completa 5 entrenamientos',
            reward: 100,
            progress: 0,
            total: 5,
          },
        },
        { status: 200 }
      )
    }

    const userId = user.id

    // Fetch interview history for XP calculation
    const { data: interviews } = await supabase
      .from('a3_user_entrevistas')
      .select('score, created_at')
      .eq('user_id', userId)

    // Fetch user progress for badges
    const { data: progressData } = await supabase
      .from('a3_user_progreso')
      .select('puntos_dtc')
      .eq('user_id', userId)
      .single()

    const totalSessions = interviews?.length || 0
    const totalXp = (progressData?.puntos_dtc || 0) + totalSessions * 50
    const currentLevel = Math.floor(totalXp / 1000) + 1
    const xpToNextLevel = currentLevel * 1000 - totalXp

    // Calculate streak
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

    // Calculate badges
    const badges = []
    if (totalSessions >= 5) badges.push('🥉 5 Entrenamientos')
    if (totalSessions >= 10) badges.push('🥈 10 Entrenamientos')
    if (totalSessions >= 25) badges.push('🥇 25 Entrenamientos')
    if (totalSessions >= 50) badges.push('👑 50 Entrenamientos')
    if ((interviews || []).filter((iv) => iv.score >= 90).length >= 3) badges.push('⭐ Experto')

    // Determine next challenge
    const nextChallenge = (() => {
      if (totalSessions < 5) {
        return {
          name: 'Iniciador',
          description: 'Completa 5 entrenamientos',
          reward: 100,
          progress: totalSessions,
          total: 5,
        }
      } else if (totalSessions < 10) {
        return {
          name: 'Practicante',
          description: 'Completa 10 entrenamientos',
          reward: 200,
          progress: totalSessions,
          total: 10,
        }
      } else {
        return {
          name: 'Maestría',
          description: 'Obtén 3 scores >= 90',
          reward: 300,
          progress: (interviews || []).filter((iv) => iv.score >= 90).length,
          total: 3,
        }
      }
    })()

    return NextResponse.json(
      {
        currentLevel,
        totalXp,
        xpToNextLevel,
        streak,
        badges,
        nextChallenge,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error in /api/a3/gamification:', error)
    return NextResponse.json(
      {
        currentLevel: 1,
        totalXp: 0,
        xpToNextLevel: 1000,
        streak: 0,
        badges: [],
        nextChallenge: null,
      },
      { status: 200 }
    )
  }
}
