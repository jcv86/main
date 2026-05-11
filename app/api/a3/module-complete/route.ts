import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { PILLAR3_MODULES } from '@/lib/pillar3-config'

/**
 * POST /api/a3/module-complete
 * Marks a module as completed and awards XP
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { moduleId } = await request.json()

    if (!moduleId || !PILLAR3_MODULES[moduleId as keyof typeof PILLAR3_MODULES]) {
      return NextResponse.json(
        { success: false, error: 'Invalid module ID' },
        { status: 400 }
      )
    }

    const module = PILLAR3_MODULES[moduleId as keyof typeof PILLAR3_MODULES]
    const userId = session.user.id

    // Check if already completed
    const { data: existing } = await supabase
      .from('a3_completed_modules')
      .select('id')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .single()

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Module already completed',
        xpAwarded: 0,
        totalXp: await getUserTotalXP(supabase, userId),
      })
    }

    // Record module completion
    const { error: insertError } = await supabase
      .from('a3_completed_modules')
      .insert({
        user_id: userId,
        module_id: moduleId,
        xp_earned: module.xp,
        completed_at: new Date().toISOString(),
      })

    if (insertError) {
      console.error('Error recording module completion:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to record completion' },
        { status: 500 }
      )
    }

    // Get updated total XP
    const totalXp = await getUserTotalXP(supabase, userId)

    return NextResponse.json({
      success: true,
      message: 'Module completed successfully',
      xpAwarded: module.xp,
      totalXp,
    })
  } catch (error) {
    console.error('Error in module-complete:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getUserTotalXP(supabase: any, userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('a3_completed_modules')
    .select('xp_earned')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching user XP:', error)
    return 0
  }

  return data.reduce((sum: number, item: any) => sum + (item.xp_earned || 0), 0)
}
