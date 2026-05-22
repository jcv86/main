import { createAdminClient } from '@/lib/supabase/server'
import { completeA3Module } from '@/lib/a3-access-control'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * API endpoint to mark an A3 module as completed
 * This enables the next module in the sequence
 * 
 * Body params:
 * - moduleId: The A3 module ID being completed
 * - score: Optional score/XP for the completion
 */
export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const cookieStore = await cookies()
    const demoUserCookie = cookieStore.get('demo_user')

    if (!demoUserCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 },
      )
    }

    let userId: string | null = null
    try {
      const demoUser = JSON.parse(demoUserCookie.value)
      userId = demoUser.id
    } catch {
      return NextResponse.json(
        { error: 'Invalid authentication' },
        { status: 401 },
      )
    }

    const body = await request.json()
    const { moduleId, score } = body

    if (!moduleId) {
      return NextResponse.json(
        { error: 'Missing moduleId' },
        { status: 400 },
      )
    }

    console.log('[v0] Completing A3 module:', { userId, moduleId, score })

    // Mark module as completed
    const completed = await completeA3Module(userId, moduleId, supabase)

    if (!completed) {
      return NextResponse.json(
        { error: 'Failed to complete module' },
        { status: 500 },
      )
    }

    // Get updated progress
    const { data: updatedProgress } = await supabase
      .from('a3_user_progress')
      .select('completed_module_ids, total_xp')
      .eq('user_id', userId)
      .single()

    return NextResponse.json({
      success: true,
      message: `Module ${moduleId} completed successfully`,
      progress: {
        completedModuleIds: updatedProgress?.completed_module_ids || [],
        totalXp: updatedProgress?.total_xp || 0,
      },
    })
  } catch (error) {
    console.error('[v0] Error completing module:', error)
    return NextResponse.json(
      { error: 'Failed to complete module' },
      { status: 500 },
    )
  }
}
