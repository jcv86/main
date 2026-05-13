import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check auth
    const secret = new URL(request.url).searchParams.get('secret')
    const expectedSecret = process.env.ADMIN_INIT_SECRET || 'dev-secret-key'
    
    if (!secret || secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { session } } = await supabase.auth.getSession()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({
        error: 'Not authenticated',
        auth: { session: !!session, user: null }
      })
    }

    console.log('[v0] Debug report for user:', user.id.substring(0, 8))

    // Check module unlock rules
    const { data: rules, error: rulesError } = await supabase
      .from('a3_module_unlock_rules')
      .select('*')
      .order('sequence_order', { ascending: true })

    console.log('[v0] Module rules error:', rulesError)
    console.log('[v0] Module rules count:', rules?.length)

    // Check user progress
    const { data: progress, error: progressError } = await supabase
      .from('a3_user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single()

    console.log('[v0] User progress error:', progressError?.code)
    console.log('[v0] User progress:', progress ? {
      total_xp: progress.total_xp,
      completed_modules: progress.completed_modules,
      last_activity_at: progress.last_activity_at
    } : 'NOT FOUND')

    // Check interview-0 progress
    const { data: interview0, error: int0Error } = await supabase
      .from('a3_interview_0_progress')
      .select('*')
      .eq('user_id', user.id)
      .single()

    console.log('[v0] Interview-0 error:', int0Error?.code)
    console.log('[v0] Interview-0 progress:', interview0 ? {
      final_score: interview0.final_score,
      passed: interview0.passed,
      completed_at: interview0.completed_at
    } : 'NOT FOUND')

    // Calculate what SHOULD be unlocked
    let moduleStates = {}
    if (rules && progress) {
      for (const rule of rules) {
        const isCompleted = progress.completed_modules?.includes(rule.module_id)
        const hasXp = progress.total_xp >= rule.xp_required
        const hasPrerequisite = !rule.prerequisite_module_id || progress.completed_modules?.includes(rule.prerequisite_module_id)
        
        let state = 'unknown'
        if (isCompleted) state = 'completed'
        else if (!hasPrerequisite) state = 'locked_prerequisite'
        else if (!hasXp) state = 'locked_xp'
        else state = 'available'

        moduleStates[rule.module_id] = {
          state,
          details: {
            completed: isCompleted,
            has_xp: hasXp,
            has_prerequisite: hasPrerequisite,
            xp_required: rule.xp_required,
            prerequisite: rule.prerequisite_module_id
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id.substring(0, 8),
        email: user.email
      },
      modules: {
        total_rules: rules?.length,
        rules_in_db: !!rules,
        expected_count: 10,
        sample: rules?.slice(0, 3).map(r => ({ id: r.module_id, name: r.module_name, xp_req: r.xp_required }))
      },
      user_progress: {
        exists: !!progress,
        total_xp: progress?.total_xp,
        completed_modules: progress?.completed_modules,
        last_activity: progress?.last_activity_at
      },
      interview0: {
        exists: !!interview0,
        score: interview0?.final_score,
        passed: interview0?.passed,
        completed_at: interview0?.completed_at
      },
      module_states: moduleStates,
      debug_info: {
        rules_error_code: rulesError?.code,
        progress_error_code: progressError?.code,
        interview0_error_code: int0Error?.code
      }
    })
  } catch (error) {
    console.error('[v0] Debug endpoint error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Debug failed'
    }, { status: 500 })
  }
}
