import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { completeA3Module } from '@/lib/a3-access-control'
import { NextResponse } from 'next/server'

/**
 * API endpoint to mark an A3 module as completed.
 * This enables the next module in the sequence.
 */
export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const currentUser = await resolveServerUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const userId = currentUser.id
    const body = await request.json()
    const { moduleId, score } = body

    if (!moduleId) {
      return NextResponse.json({ error: 'Missing moduleId' }, { status: 400 })
    }

    const completed = await completeA3Module(userId, moduleId, supabase)

    if (!completed) {
      return NextResponse.json(
        { error: 'Failed to complete module' },
        { status: 500 },
      )
    }

    const { data: updatedProgress } = await supabase
      .from('a3_user_progress')
      .select('completed_module_ids, total_xp')
      .eq('user_id', userId)
      .single()

    return NextResponse.json({
      success: true,
      message: `Module ${moduleId} completed successfully`,
      score: typeof score === 'number' ? score : undefined,
      progress: {
        completedModuleIds: updatedProgress?.completed_module_ids || [],
        totalXp: updatedProgress?.total_xp || 0,
      },
    })
  } catch (error) {
    console.error('[v0] Error completing module:', error)
    return NextResponse.json({ error: 'Failed to complete module' }, { status: 500 })
  }
}
