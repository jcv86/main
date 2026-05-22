import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Manually mark interview-0 as complete and award XP
 * This is for testing/fixing the connection between interview-0 and A3
 */
export async function POST(request: Request) {
  const secret = request.headers.get('x-fix-secret')
  if (secret !== 'fix-xp-now') {
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

    console.log('[v0] Manual fix: Marking interview-0 complete for user', user.id.substring(0, 8))

    // Mark interview-0 as completed
    const { error: i0Error } = await supabase
      .from('a3_interview_0_progress')
      .upsert({
        user_id: user.id,
        final_score: 100,
        passed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (i0Error) {
      console.error('[v0] Failed to update interview-0:', i0Error)
      throw i0Error
    }

    console.log('[v0] Interview-0 marked as complete')

    // Check if user progress exists
    const { data: existing, error: fetchError } = await supabase
      .from('a3_user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single()

    console.log('[v0] Existing progress check:', { exists: !!existing, error: fetchError?.message })

    if (fetchError?.code === 'PGRST116' || !existing) {
      // No progress record, create one
      console.log('[v0] Creating new progress record with 70 XP')
      const { error: insertError } = await supabase
        .from('a3_user_progress')
        .insert({
          user_id: user.id,
          total_xp: 70,
          total_dtc: 0,
          completed_modules: ['auditoria-inicial'],
          last_activity_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('[v0] Failed to insert progress:', insertError)
        throw insertError
      }

      console.log('[v0] Progress record created')
    } else {
      // Update existing
      console.log('[v0] Updating existing progress record')
      const completedModules = existing.completed_modules || []
      if (!completedModules.includes('auditoria-inicial')) {
        completedModules.push('auditoria-inicial')
      }

      const { error: updateError } = await supabase
        .from('a3_user_progress')
        .update({
          total_xp: (existing.total_xp || 0) + 70,
          completed_modules: completedModules,
          last_activity_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('[v0] Failed to update progress:', updateError)
        throw updateError
      }

      console.log('[v0] Progress updated')
    }

    // Verify the fix worked
    const { data: verified } = await supabase
      .from('a3_user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return NextResponse.json({
      status: 'ok',
      message: 'Interview-0 completed and XP awarded',
      result: {
        user_id: user.id.substring(0, 8),
        total_xp: verified?.total_xp || 0,
        completed_modules: verified?.completed_modules || [],
        next_step: 'Go to A3 page to see Método STAR unlocked'
      }
    })
  } catch (error) {
    console.error('[v0] Manual fix error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
