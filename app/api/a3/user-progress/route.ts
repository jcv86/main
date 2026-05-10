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
    const completedModuleIds = completions?.map(c => c.training_type) || []
    
    // Check which modules are completed by level/section
    const level1Complete = completedModuleIds.some(id => 
      id.toLowerCase().includes('auditoria') || id.toLowerCase().includes('entrevista-0') || id.toLowerCase().includes('entrevista 0')
    )
    
    const level2Modules = completedModuleIds.filter(id =>
      id.toLowerCase().includes('star') || id.toLowerCase().includes('cv-inteligente') || 
      id.toLowerCase().includes('analisis-vacante') || id.toLowerCase().includes('analisis-multicanal')
    )
    const level2Complete = level2Modules.length === 4
    
    const level3Modules = completedModuleIds.filter(id =>
      id.toLowerCase().includes('entrevista-guiada') || id.toLowerCase().includes('entrevista-estructurada') ||
      id.toLowerCase().includes('entrevista-desafiante') || id.toLowerCase().includes('entrevista-conversacional')
    )
    const level3Complete = level3Modules.length === 4
    
    const maxXp = 1000
    const progressPct = Math.min(Math.round((totalXp / maxXp) * 100), 100)

    console.log('[v0] User progress calculation:', { user_id: user.id, level1Complete, level2Complete, level3Complete, progressPct })

    // Build module states based on level completion
    const moduleStates = {
      // Level 1: Audit (always available, becomes completed when done)
      'auditoria-inicial': level1Complete ? 'completed' : 'in_progress',
      
      // Level 2: Preparation tools (unlock after Level 1 complete, all 4 must complete)
      'metodo-star': level1Complete ? (level2Modules.includes('metodo-star') ? 'completed' : 'available') : 'locked',
      'cv-inteligente': level1Complete ? (level2Modules.includes('cv-inteligente') ? 'completed' : 'available') : 'locked',
      'analisis-vacante': level1Complete ? (level2Modules.includes('analisis-vacante') ? 'completed' : 'available') : 'locked',
      'analisis-multicanal': level1Complete ? (level2Modules.includes('analisis-multicanal') ? 'completed' : 'available') : 'locked',
      
      // Level 3: Training interviews (unlock after Level 2 complete, all 4 must complete)
      'entrevista-guiada': level2Complete ? (level3Modules.includes('entrevista-guiada') ? 'completed' : 'available') : 'locked',
      'entrevista-estructurada': level2Complete ? (level3Modules.includes('entrevista-estructurada') ? 'completed' : 'available') : 'locked',
      'entrevista-desafiante': level2Complete ? (level3Modules.includes('entrevista-desafiante') ? 'completed' : 'available') : 'locked',
      'entrevista-conversacional': level2Complete ? (level3Modules.includes('entrevista-conversacional') ? 'completed' : 'available') : 'locked',
      
      // Level 4: Real simulation (unlock after Level 3 complete)
      'simulacion-completa': level3Complete ? 'available' : 'locked',
    }

    // Calculate skill values based on completions
    const skills = {
      presencia: level1Complete ? 60 : 35,
      claridad: level2Modules.length > 0 ? 40 : 10,
      estructura: level2Modules.includes('metodo-star') ? 50 : 0,
      preparacion: level2Modules.length > 1 ? 60 : 25,
      'manejo-presion': level3Modules.includes('entrevista-desafiante') ? 50 : 0,
    }

    // Determine current level and next milestone
    let currentLevel = 'Auditoría Inicial'
    let nextMilestone = 'Completar Auditoría Inicial'
    let nextReward = 'Desbloqueas Herramientas de Preparación (4 herramientas)'

    if (level1Complete && !level2Complete) {
      currentLevel = 'Herramientas de Preparación'
      nextMilestone = `Completar 4 herramientas (${level2Modules.length}/4)`
      nextReward = 'Desbloqueas Entrenamientos Progresivos'
    }
    if (level2Complete && !level3Complete) {
      currentLevel = 'Entrenamientos Progresivos'
      nextMilestone = `Completar 4 entrenamientos (${level3Modules.length}/4)`
      nextReward = 'Desbloqueas Simulación Real'
    }
    if (level3Complete) {
      currentLevel = 'Simulación Real'
      nextMilestone = 'Completar Simulación Completa'
      nextReward = 'Badge: Listo para Entrevista Real'
    }

    const completedModules = (level1Complete ? 1 : 0) + level2Modules.length + level3Modules.length

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
        totalModules: 9,
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
