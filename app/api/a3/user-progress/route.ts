import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import {
  PILLAR3_LEVELS,
  TOTAL_PILLAR3_XP,
  TOTAL_PILLAR3_DTC,
  buildModuleStates,
  calculateLevelCompletion,
  calculateEarnedRewards,
  resolveCanonicalId,
} from '@/lib/pillar3-config'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check session first to avoid unnecessary warnings
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    console.log('[v0] API user-progress: Session check', {
      timestamp: new Date().toISOString(),
      hasSession: !!session,
      sessionError: sessionError?.message,
      userId: session?.user?.id?.substring(0, 8)
    })
    
    if (!session) {
      console.warn('[v0] API user-progress: No active session found - providing demo data', {
        timestamp: new Date().toISOString(),
        url: request.url,
        error: sessionError
      })
      // Return demo/default data when not authenticated (for preview/demo purposes)
      const defaultModuleStates = {
        'auditoria-inicial': 'available',
        'metodo-star': 'locked',
        'cv-inteligente': 'locked',
        'analisis-vacante': 'locked',
        'analisis-multimodal': 'locked',
        'entrenamiento-guiado': 'locked',
        'entrenamiento-estructurado': 'locked',
        'entrenamiento-desafiante': 'locked',
        'entrenamiento-conversacional': 'locked',
        'simulacion-real': 'locked',
      }
      
      return NextResponse.json({
        success: true,
        progress: {
          currentLevel: 'Nivel 1 - Auditoría Inicial',
          progressPct: 0,
          dtcPct: 0,
          totalXp: 0,
          maxXp: 280,
          totalDtc: 0,
          maxDtc: 280,
          nextMilestone: 'Completar Auditoría Inicial',
          nextReward: 'Desbloqueas Nivel 2 (4 herramientas)',
          completedModules: 0,
          totalModules: 10,
          moduleStates: defaultModuleStates,
          skills: {
            presencia: 35,
            claridad: 10,
            estructura: 0,
            preparacion: 25,
            'manejo-presion': 0,
          },
          completedModuleIds: [],
          levelCompletion: {
            level1: false,
            level2: false,
            level3: false,
            level4: false,
          },
        },
      })
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (!user) {
      console.warn('[v0] API user-progress: Session exists but no user - providing demo data', {
        timestamp: new Date().toISOString(),
        userError: userError?.message
      })
      // Return demo data as fallback
      const defaultModuleStates = {
        'auditoria-inicial': 'available',
        'metodo-star': 'locked',
        'cv-inteligente': 'locked',
        'analisis-vacante': 'locked',
        'analisis-multimodal': 'locked',
        'entrenamiento-guiado': 'locked',
        'entrenamiento-estructurado': 'locked',
        'entrenamiento-desafiante': 'locked',
        'entrenamiento-conversacional': 'locked',
        'simulacion-real': 'locked',
      }
      
      return NextResponse.json({
        success: true,
        progress: {
          currentLevel: 'Nivel 1 - Auditoría Inicial',
          progressPct: 0,
          dtcPct: 0,
          totalXp: 0,
          maxXp: 280,
          totalDtc: 0,
          maxDtc: 280,
          nextMilestone: 'Completar Auditoría Inicial',
          nextReward: 'Desbloqueas Nivel 2 (4 herramientas)',
          completedModules: 0,
          totalModules: 10,
          moduleStates: defaultModuleStates,
          skills: {
            presencia: 35,
            claridad: 10,
            estructura: 0,
            preparacion: 25,
            'manejo-presion': 0,
          },
          completedModuleIds: [],
          levelCompletion: {
            level1: false,
            level2: false,
            level3: false,
            level4: false,
          },
        },
      })
    }

    console.log('[v0] API user-progress: Processing request for user', user.id.substring(0, 8))
    // Fetch completed training modules for canonical XP/DTC calculation
    const { data: completions } = await supabase
      .from('a3_training_module_completions')
      .select('training_type, xp_amount, is_first_completion')
      .eq('user_id', user.id)

    const completedRawIds = (completions || [])
      .filter((c) => c.is_first_completion)
      .map((c) => c.training_type)

    // Resolve to canonical IDs and calculate level/module completion
    const { level1, level2, level3, level4, canonicalCompleted } =
      calculateLevelCompletion(completedRawIds)

    // Calculate XP and DTC earned from canonical config (single source of truth)
    const { totalXp, totalDtc: totalDtcFromConfig } = calculateEarnedRewards(completedRawIds)

    // Also fetch actual DTC balance for live total
    const { data: dtcBalance } = await supabase
      .from('user_dtc_balance')
      .select('balance, lifetime_earned')
      .eq('user_id', user.id)
      .maybeSingle()

    // Use the live DTC balance if it exists, else fall back to config-derived total
    const totalDtc = dtcBalance?.balance ?? totalDtcFromConfig

    const maxXp = TOTAL_PILLAR3_XP
    const maxDtc = TOTAL_PILLAR3_DTC
    const progressPct = Math.min(Math.round((totalXp / maxXp) * 100), 100)
    const dtcPct = Math.min(Math.round((totalDtc / maxDtc) * 100), 100)

    console.log('[v0] User progress (canonical):', {
      user_id: user.id,
      completedCanonical: canonicalCompleted,
      level1Complete: level1,
      level2Complete: level2,
      level3Complete: level3,
      totalXp,
      totalDtc,
      progressPct,
    })

    // Build moduleStates using the canonical config
    const moduleStates = buildModuleStates(completedRawIds)

    // Skill values derived from canonical level completion
    const level2CompletedCount = PILLAR3_LEVELS[2].moduleIds.filter((id) =>
      canonicalCompleted.includes(id)
    ).length
    const level3CompletedCount = PILLAR3_LEVELS[3].moduleIds.filter((id) =>
      canonicalCompleted.includes(id)
    ).length

    const skills = {
      presencia: level1 ? 60 : 35,
      claridad: level2CompletedCount > 0 ? 40 + level2CompletedCount * 10 : 10,
      estructura: canonicalCompleted.includes('metodo-star') ? 60 : 0,
      preparacion: level2CompletedCount > 1 ? 60 + level2CompletedCount * 5 : 25,
      'manejo-presion': canonicalCompleted.includes('entrenamiento-desafiante') ? 70 : 0,
    }

    // Determine current level / next milestone
    let currentLevel = PILLAR3_LEVELS[1].name
    let nextMilestone = `Completar ${PILLAR3_LEVELS[1].name}`
    let nextReward = `Desbloqueas ${PILLAR3_LEVELS[2].name} (4 herramientas)`

    if (level1 && !level2) {
      currentLevel = PILLAR3_LEVELS[2].name
      nextMilestone = `Completar 4 herramientas (${level2CompletedCount}/4)`
      nextReward = `Desbloqueas ${PILLAR3_LEVELS[3].name}`
    }
    if (level2 && !level3) {
      currentLevel = PILLAR3_LEVELS[3].name
      nextMilestone = `Completar 4 entrenamientos (${level3CompletedCount}/4)`
      nextReward = `Desbloqueas ${PILLAR3_LEVELS[4].name}`
    }
    if (level3 && !level4) {
      currentLevel = PILLAR3_LEVELS[4].name
      nextMilestone = `Completar Simulación Real`
      nextReward = 'Badge: Listo para Entrevista Real'
    }
    if (level4) {
      currentLevel = 'Pillar 3 Completado'
      nextMilestone = 'Has completado todos los niveles'
      nextReward = 'Listo para entrevistas reales'
    }

    const completedModules = canonicalCompleted.length

    // Convert legacy IDs to canonical for the frontend
    const completedModuleIds = canonicalCompleted

    return NextResponse.json({
      success: true,
      progress: {
        currentLevel,
        progressPct,
        dtcPct,
        totalXp,
        maxXp,
        totalDtc,
        maxDtc,
        nextMilestone,
        nextReward,
        completedModules,
        totalModules: 10,
        moduleStates,
        skills,
        completedModuleIds,
        levelCompletion: {
          level1,
          level2,
          level3,
          level4,
        },
      },
    })
  } catch (error) {
    console.error('[v0] Error fetching user progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
