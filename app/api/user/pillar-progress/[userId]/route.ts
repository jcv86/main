import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'
import type { PillarId } from '@/lib/pillar-structure'

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const cookieStore = await cookies()
    const authToken =
      cookieStore.get('sb-auth-token')?.value ||
      cookieStore.get('sb-token')?.value ||
      cookieStore.get('sb_access_token')?.value

    if (!authToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    let userId: string
    try {
      const decoded: any = jwtDecode(authToken)
      userId = decoded.sub
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const supabase = await createClient()

    // Get completed activities from a3_completed_modules
    const { data: completedActivities } = await supabase
      .from('a3_completed_modules')
      .select('module_id')
      .eq('user_id', userId)

    // Get completed pillars from custom table (we'll create this)
    const { data: pillarProgress } = await supabase
      .from('despega_pillar_completion')
      .select('pillar_id, completed_at, xp_earned')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })

    // Get total XP
    const { data: userXP } = await supabase
      .from('user_dtc_balance')
      .select('balance')
      .eq('user_id', userId)
      .single()

    const activityIds = (completedActivities || []).map((a) => a.module_id)
    const completedPillarIds = (pillarProgress || []).map((p) => p.pillar_id)
    const totalXP = userXP?.balance || 0

    return NextResponse.json({
      completedActivities: activityIds,
      completedPillars: completedPillarIds as PillarId[],
      totalXP,
    })
  } catch (error) {
    console.error('[v0] Error fetching pillar progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}
