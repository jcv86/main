import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const secret = request.headers.get('x-verify-secret')
  if (secret !== 'verify-db-now') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({
        error: 'Not authenticated',
        hint: 'Need to login first'
      }, { status: 401 })
    }

    // Check a3_user_progress table for current user
    console.log('[v0] Checking a3_user_progress for user:', user.id.substring(0, 8))
    
    const { data: userProgress, error: progressError } = await supabase
      .from('a3_user_progress')
      .select('*')
      .eq('user_id', user.id)

    console.log('[v0] User progress query result:', { count: userProgress?.length, error: progressError })

    // Check interview-0 progress
    const { data: interview0, error: interview0Error } = await supabase
      .from('a3_interview_0_progress')
      .select('*')
      .eq('user_id', user.id)

    console.log('[v0] Interview-0 progress query result:', { count: interview0?.length, error: interview0Error })

    // Check module unlock rules
    const { data: rules, error: rulesError } = await supabase
      .from('a3_module_unlock_rules')
      .select('*')

    console.log('[v0] Module unlock rules query result:', { count: rules?.length, error: rulesError })

    return NextResponse.json({
      status: 'ok',
      user_id: user.id.substring(0, 8),
      database_state: {
        user_progress: {
          exists: !!userProgress,
          count: userProgress?.length || 0,
          data: userProgress?.[0] || null,
          error: progressError
        },
        interview_0_progress: {
          exists: !!interview0,
          count: interview0?.length || 0,
          data: interview0?.[0] || null,
          error: interview0Error
        },
        module_unlock_rules: {
          exists: !!rules,
          count: rules?.length || 0,
          sample: rules?.[0] || null,
          error: rulesError
        }
      },
      diagnosis: {
        has_user_progress: (userProgress?.length || 0) > 0,
        has_interview_0_record: (interview0?.length || 0) > 0,
        has_module_rules: (rules?.length || 0) > 0,
        interview_0_completed: interview0?.[0]?.final_score !== null,
        user_xp: userProgress?.[0]?.total_xp || 0,
        user_completed_modules: userProgress?.[0]?.completed_modules || []
      }
    })
  } catch (error) {
    console.error('[v0] Database verification error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
