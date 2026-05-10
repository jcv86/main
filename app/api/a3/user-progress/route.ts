import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch user's gamification profile
    const { data: profile } = await supabase
      .from('user_gamification_profile')
      .select('current_xp, total_xp, current_level, total_interviews_completed')
      .eq('user_id', user.id)
      .single()

    // Fetch completed training modules for XP calculation
    const { data: completions } = await supabase
      .from('a3_training_module_completions')
      .select('training_type, xp_amount, is_first_completion')
      .eq('user_id', user.id)

    // Calculate total XP earned from completed trainings
    let totalXp = 0
    if (completions) {
      completions.forEach((c) => {
        // Only count XP from first completions
        if (c.is_first_completion) {
          totalXp += c.xp_amount || 0
        }
      })
    }

    // If no trainings completed, use profile total_xp as fallback
    if (totalXp === 0 && profile?.total_xp) {
      totalXp = profile.total_xp
    }

    // Calculate progress based on completions
    const completedModules = completions?.length || 0
    const totalModules = 9 // Total modules in the journey
    const maxXp = 1000
    const progressPct = Math.min(Math.round((totalXp / maxXp) * 100), 100)

    console.log('[v0] User progress calculation:', { user_id: user.id, totalXp, completions_count: completions?.length, progressPct })

    // Check which modules are completed
    const completedModuleIds = completions?.map(c => c.training_type) || []

    // Determine module statuses based on completions
    const auditoriaCompleted = completedModuleIds.some(id => 
      id.toLowerCase().includes('auditoria') || id.toLowerCase().includes('entrevista 0') || id.toLowerCase().includes('preparación inicial')
    )

    // Build module states
    const moduleStates = {
      'auditoria-inicial': auditoriaCompleted ? 'completed' : 'in_progress',
      'metodo-star': auditoriaCompleted ? 'available' : 'locked',
      'cv-inteligente': auditoriaCompleted ? 'available' : 'locked',
      'analisis-vacante': auditoriaCompleted ? 'available' : 'locked',
      'analisis-multicanal': auditoriaCompleted ? 'available' : 'locked',
      // Level 3 modules unlock after 2 preparation tools
      'entrevista-guiada': completedModules >= 3 ? 'available' : 'locked',
      'entrevista-estructurada': completedModules >= 3 ? 'available' : 'locked',
      'entrevista-desafiante': completedModules >= 3 ? 'available' : 'locked',
      'entrevista-conversacional': completedModules >= 3 ? 'available' : 'locked',
      // Level 4 unlocks after 2 training interviews
      'simulacion-completa': completedModules >= 5 ? 'available' : 'locked',
    }

    // Calculate skill values based on completions
    const skills = {
      presencia: auditoriaCompleted ? 60 : 35,
      claridad: completedModules >= 2 ? 40 : 10,
      estructura: completedModuleIds.some(id => id.includes('star')) ? 50 : 0,
      preparacion: completedModuleIds.some(id => id.includes('cv') || id.includes('vacante')) ? 60 : 25,
      'manejo-presion': completedModuleIds.some(id => id.includes('desafiante')) ? 50 : 0,
    }

    // Determine current level text
    let currentLevel = 'Auditoría Inicial'
    let nextMilestone = 'Completar Entrevista 0'
    let nextReward = 'Desbloqueas Método STAR + CV Inteligente + Análisis de Vacante'

    if (auditoriaCompleted) {
      currentLevel = 'Herramientas de Preparación'
      nextMilestone = 'Completar 2 herramientas de preparación'
      nextReward = 'Desbloqueas Entrenamientos de Entrevista'
    }
    if (completedModules >= 3) {
      currentLevel = 'Entrenamientos Progresivos'
      nextMilestone = 'Completar 2 entrenamientos'
      nextReward = 'Desbloqueas Simulación Real'
    }
    if (completedModules >= 5) {
      currentLevel = 'Simulación Real'
      nextMilestone = 'Completar Simulación Completa'
      nextReward = 'Badge: Listo para Entrevista Real'
    }

    return NextResponse.json({
      success: true,
      progress: {
        currentLevel,
        progressPct,
        totalXp,
        maxXp,
        nextMilestone,
        nextReward,
        completedModules,
        totalModules,
        moduleStates,
        skills,
        completedModuleIds,
      }
    })
  } catch (error) {
    console.error('[v0] Error fetching user progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
