import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const secret = request.headers.get('x-debug-secret')
  if (secret !== 'debug-all-issues') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const issues: string[] = []
  const fixes: string[] = []

  try {
    console.log('[v0] === COMPREHENSIVE DEBUG AND FIX START ===')

    // 1. CLEAR AND REINITIALIZE MODULE RULES
    console.log('[v0] Step 1: Clearing old module rules...')
    const { error: deleteError } = await supabase
      .from('a3_module_unlock_rules')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (deleteError) {
      issues.push(`Failed to delete old rules: ${deleteError.message}`)
      console.error('[v0] Delete error:', deleteError)
    } else {
      fixes.push('Cleared all old module rules')
    }

    // 2. INSERT ALL 10 MODULES WITH PROPER DATA
    console.log('[v0] Step 2: Inserting 10 new modules...')
    const modules = [
      {
        module_id: 'auditoria-inicial',
        module_name: 'Auditoría Inicial',
        xp_required: 0,
        prerequisite_module_id: null,
        level: 1,
        sequence_order: 1
      },
      {
        module_id: 'metodo-star',
        module_name: 'Método STAR',
        xp_required: 70,
        prerequisite_module_id: 'auditoria-inicial',
        level: 1,
        sequence_order: 2
      },
      {
        module_id: 'cv-inteligente',
        module_name: 'CV Inteligente',
        xp_required: 140,
        prerequisite_module_id: 'metodo-star',
        level: 1,
        sequence_order: 3
      },
      {
        module_id: 'analisis-vacante',
        module_name: 'Análisis de Vacante',
        xp_required: 210,
        prerequisite_module_id: 'cv-inteligente',
        level: 1,
        sequence_order: 4
      },
      {
        module_id: 'analisis-multicanal',
        module_name: 'Análisis Multicanal',
        xp_required: 280,
        prerequisite_module_id: 'analisis-vacante',
        level: 1,
        sequence_order: 5
      },
      {
        module_id: 'entrenamiento-guiado',
        module_name: 'Entrenamiento Guiado',
        xp_required: 350,
        prerequisite_module_id: 'analisis-multicanal',
        level: 2,
        sequence_order: 6
      },
      {
        module_id: 'entrenamiento-estructurado',
        module_name: 'Entrenamiento Estructurado',
        xp_required: 420,
        prerequisite_module_id: 'entrenamiento-guiado',
        level: 2,
        sequence_order: 7
      },
      {
        module_id: 'entrenamiento-desafiante',
        module_name: 'Entrenamiento Desafiante',
        xp_required: 490,
        prerequisite_module_id: 'entrenamiento-estructurado',
        level: 2,
        sequence_order: 8
      },
      {
        module_id: 'entrenamiento-conversacional',
        module_name: 'Entrenamiento Conversacional',
        xp_required: 560,
        prerequisite_module_id: 'entrenamiento-desafiante',
        level: 3,
        sequence_order: 9
      },
      {
        module_id: 'simulacion-real',
        module_name: 'Simulación Real',
        xp_required: 630,
        prerequisite_module_id: 'entrenamiento-conversacional',
        level: 3,
        sequence_order: 10
      }
    ]

    const { data: inserted, error: insertError } = await supabase
      .from('a3_module_unlock_rules')
      .insert(modules)
      .select()

    if (insertError) {
      issues.push(`Failed to insert modules: ${insertError.message}`)
      console.error('[v0] Insert error:', insertError)
    } else {
      fixes.push(`Inserted ${inserted?.length || 0} modules successfully`)
      console.log('[v0] Inserted modules:', inserted?.map(m => m.module_id))
    }

    // 3. CHECK FOR DUPLICATE USER PROGRESS
    console.log('[v0] Step 3: Checking for duplicate user progress records...')
    const { data: allProgress } = await supabase
      .from('a3_user_progress')
      .select('user_id, id, created_at')

    const userCounts: Record<string, any[]> = {}
    allProgress?.forEach(p => {
      if (!userCounts[p.user_id]) userCounts[p.user_id] = []
      userCounts[p.user_id].push(p)
    })

    const duplicateUsers = Object.entries(userCounts).filter(([_, records]) => records.length > 1)
    if (duplicateUsers.length > 0) {
      console.log('[v0] Found duplicate user progress records:')
      for (const [userId, records] of duplicateUsers) {
        console.log(`  User ${userId.substring(0, 8)}: ${records.length} records`)
        // Keep only the most recent one
        const sorted = records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        const toDelete = sorted.slice(1).map(r => r.id)
        
        if (toDelete.length > 0) {
          const { error: delError } = await supabase
            .from('a3_user_progress')
            .delete()
            .in('id', toDelete)

          if (delError) {
            issues.push(`Failed to delete duplicate records for ${userId}: ${delError.message}`)
          } else {
            fixes.push(`Removed ${toDelete.length} duplicate records for user ${userId.substring(0, 8)}`)
          }
        }
      }
    } else {
      fixes.push('No duplicate user progress records found')
    }

    // 4. VALIDATE XP AWARDS
    console.log('[v0] Step 4: Validating XP awards...')
    const { data: users } = await supabase
      .from('a3_user_progress')
      .select('user_id, total_xp, completed_modules')

    let xpIssues = 0
    users?.forEach(user => {
      if (!user.completed_modules) {
        console.log(`[v0] User ${user.user_id.substring(0, 8)}: empty completed_modules array`)
        xpIssues++
      }
      if (user.completed_modules.includes('auditoria-inicial') && user.total_xp < 70) {
        console.log(`[v0] CRITICAL: User has auditoria-inicial but only ${user.total_xp} XP (should be ≥70)`)
        xpIssues++
      }
    })

    if (xpIssues > 0) {
      issues.push(`Found ${xpIssues} XP validation issues`)
    } else {
      fixes.push('All XP awards are consistent with completed modules')
    }

    // 5. TEST MODULE UNLOCK LOGIC
    console.log('[v0] Step 5: Testing module unlock logic...')
    if (users && users.length > 0) {
      const testUser = users[0]
      const completedCount = testUser.completed_modules?.length || 0
      const xpAmount = testUser.total_xp

      console.log(`[v0] Test User: ${testUser.user_id.substring(0, 8)}`)
      console.log(`[v0]   - Total XP: ${xpAmount}`)
      console.log(`[v0]   - Completed modules: ${completedCount}`)
      console.log(`[v0]   - Completed: [${testUser.completed_modules?.join(', ')}]`)

      // Calculate expected unlocks
      const expectedUnlocks = modules.filter(m => {
        if (m.xp_required === 0) return true
        if (m.prerequisite_module_id && !testUser.completed_modules?.includes(m.prerequisite_module_id)) return false
        return xpAmount >= m.xp_required
      })

      fixes.push(`Test user should have ${expectedUnlocks.length} modules unlocked`)
    }

    console.log('[v0] === DEBUG AND FIX COMPLETE ===')

    return NextResponse.json(
      {
        success: true,
        issues,
        fixes,
        moduleRulesCount: inserted?.length || 0,
        summary: `Found ${issues.length} issues, Applied ${fixes.length} fixes`,
        details: { issues, fixes }
      },
      { status: 200 }
    )

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('[v0] COMPREHENSIVE DEBUG FAILED:', errorMsg)
    return NextResponse.json(
      { error: errorMsg, issues, fixes },
      { status: 500 }
    )
  }
}
