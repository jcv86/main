import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { PILLAR3_MODULES } from '@/lib/pillar3-config'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

/**
 * POST /api/a3/module-complete
 * Marks a module as completed and awards XP
 */
export async function POST(request: Request) {
  try {
    // Get auth token from cookies to extract user ID
    const cookieStore = await cookies()
    const authToken =
      cookieStore.get('sb-auth-token')?.value || 
      cookieStore.get('sb-token')?.value ||
      cookieStore.get('sb_access_token')?.value

    if (!authToken) {
      console.warn('[v0] No auth token found in cookies for module-complete')
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Extract user ID from JWT token
    let userId: string
    try {
      const decoded: any = jwtDecode(authToken)
      userId = decoded.sub
      if (!userId) {
        throw new Error('No user ID in token')
      }
    } catch (decodeError) {
      console.error('[v0] Error decoding auth token:', decodeError)
      return NextResponse.json(
        { success: false, error: 'Invalid authentication token' },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    const { moduleId } = await request.json()

    if (!moduleId || !PILLAR3_MODULES[moduleId as keyof typeof PILLAR3_MODULES]) {
      return NextResponse.json(
        { success: false, error: 'Invalid module ID' },
        { status: 400 }
      )
    }

    const module = PILLAR3_MODULES[moduleId as keyof typeof PILLAR3_MODULES]

    // Check if already completed
    const { data: existing } = await supabase
      .from('a3_completed_modules')
      .select('id')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .single()

    if (existing) {
      console.log('[v0] Module already completed:', moduleId)
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
      console.error('[v0] Error recording module completion:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to record completion' },
        { status: 500 }
      )
    }

    console.log('[v0] Module completion recorded:', { moduleId, xpEarned: module.xp, userId })

    // Get updated total XP
    const totalXp = await getUserTotalXP(supabase, userId)

    return NextResponse.json({
      success: true,
      message: 'Module completed successfully',
      xpAwarded: module.xp,
      totalXp,
    })
  } catch (error) {
    console.error('[v0] Error in module-complete:', error)
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
    console.error('[v0] Error fetching user XP:', error)
    return 0
  }

  return data.reduce((sum: number, item: any) => sum + (item.xp_earned || 0), 0)
}
