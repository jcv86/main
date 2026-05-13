import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

export async function POST(request: Request) {
  try {
    const { pillarId } = await request.json()

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

    // Insert or update pillar completion
    const { error } = await supabase
      .from('despega_pillar_completion')
      .upsert({
        user_id: userId,
        pillar_id: pillarId,
        completed_at: new Date().toISOString(),
        xp_earned: 0, // XP already awarded separately
      })
      .eq('user_id', userId)
      .eq('pillar_id', pillarId)

    if (error) {
      console.error('[v0] Error marking pillar complete:', error)
      return NextResponse.json(
        { error: 'Failed to mark pillar complete' },
        { status: 500 }
      )
    }

    console.log(`[v0] Marked pillar ${pillarId} complete for user ${userId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error in complete-pillar:', error)
    return NextResponse.json(
      { error: 'Failed to complete pillar' },
      { status: 500 }
    )
  }
}
