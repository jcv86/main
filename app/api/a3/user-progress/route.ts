import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getUserRoleData } from '@/lib/user-roles'
import { getUserXP, getUserCompletedModules, getModuleUnlockRules } from '@/lib/a3-module-unlock'
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
          isSuperadmin: false,
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
        'simulacao-real': 'locked',
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
          isSuperadmin: false,
        },
      })
    }

    console.log('[v0] API user-progress: Processing request for user', user.id.substring(0, 8))
    
    // Get user role
    const roleData = await getUserRoleData(user.id)
    const isSuperadmin = roleData.role === 'superadmin'
    
    // For superadmin: show all XP as full
    let totalXp = isSuperadmin ? 999999 : await getUserXP(user.id)
    let totalDtc = isSuperadmin ? 999999 : 0
    
    // Get completed modules
    const completedModules = await getUserCompletedModules(user.id)
    
    const maxXp = TOTAL_PILLAR3_XP
    const maxDtc = TOTAL_PILLAR3_DTC
    const progressPct = isSuperadmin ? 100 : Math.min(Math.round((totalXp / maxXp) * 100), 100)
    const dtcPct = isSuperadmin ? 100 : Math.min(Math.round((totalDtc / maxDtc) * 100), 100)

    console.log('[v0] User progress:', {
      user_id: user.id.substring(0, 8),
      completedModules,
      totalXp,
      progressPct,
      isSuperadmin,
    })

    // Build moduleStates
    const moduleStates: Record<string, string> = {}
    const rules = await getModuleUnlockRules()
    
    for (const rule of rules) {
      if (isSuperadmin) {
        // Superadmin sees all modules as unlocked
        moduleStates[rule.module_id] = 'available'
      } else if (completedModules.includes(rule.module_id)) {
        moduleStates[rule.module_id] = 'completed'
      } else if (rule.prerequisite_module_id && !completedModules.includes(rule.prerequisite_module_id)) {
        moduleStates[rule.module_id] = 'locked'
      } else if (totalXp < rule.xp_required) {
        moduleStates[rule.module_id] = 'locked'
      } else {
        moduleStates[rule.module_id] = 'available'
      }
    }

    // Skill values based on completed modules
    const level1Complete = completedModules.includes('auditoria-inicial')
    const level2Count = [
      'metodo-star',
      'cv-inteligente',
      'analisis-vacante',
      'analisis-multimodal'
    ].filter(m => completedModules.includes(m)).length

    const skills = {
      presencia: level1Complete ? 60 : 35,
      claridad: level2Count > 0 ? 40 + level2Count * 10 : 10,
      estructura: completedModules.includes('metodo-star') ? 60 : 0,
      preparacion: level2Count > 1 ? 60 + level2Count * 5 : 25,
      'manejo-presion': completedModules.includes('entrenamiento-desafiante') ? 70 : 0,
    }

    // Determine current level / next milestone
    let currentLevel = 'Nivel 1 - Auditoría Inicial'
    let nextMilestone = 'Completar Auditoría Inicial'
    let nextReward = 'Desbloqueas 4 herramientas'

    if (level1Complete) {
      currentLevel = 'Nivel 2 - Herramientas'
      nextMilestone = `${level2Count}/4 herramientas completadas`
      nextReward = 'Desbloquea Entrenamientos'
    }

    if (level2Count === 4) {
      currentLevel = 'Nivel 3 - Entrenamientos'
      nextMilestone = 'Completar entrenamientos'
      nextReward = 'Desbloquea Simulación Real'
    }

    if (completedModules.includes('simulacion-real')) {
      currentLevel = 'Pillar 3 Completado'
      nextMilestone = 'Has completado todos los niveles'
      nextReward = 'Listo para entrevistas reales'
    }

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
        completedModules: completedModules.length,
        totalModules: rules.length,
        moduleStates,
        skills,
        completedModuleIds: completedModules,
        levelCompletion: {
          level1: level1Complete,
          level2: level2Count === 4,
          level3: completedModules.includes('simulacion-real'),
          level4: false,
        },
        isSuperadmin,
      },
    })
  } catch (error) {
    console.error('[v0] Error fetching user progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
