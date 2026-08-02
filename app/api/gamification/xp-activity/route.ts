import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Public XP writes are disabled.
 *
 * XP amounts must be calculated by the verified server-side completion or
 * evaluation endpoint that owns the underlying activity. Accepting `xp_amount`
 * from the browser would let an authenticated user inflate their own profile.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'Direct XP activity writes have been disabled',
      code: 'XP_ACTIVITY_WRITE_DEPRECATED',
      message: 'XP is awarded only by verified server-side activities.',
    },
    { status: 410 },
  )
}

/**
 * GET /api/gamification/xp-activity
 *
 * Read-only XP history for the verified current user.
 */
export async function GET(request: NextRequest) {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rawLimit = Number.parseInt(request.nextUrl.searchParams.get('limit') || '50', 10)
    const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.min(rawLimit, 100)) : 50
    const section = request.nextUrl.searchParams.get('section')
    const allowedSections = new Set(['A3', 'A4', 'INTERVIEW', 'BONUS'])

    const supabase = createAdminClient()
    let query = supabase
      .from('xp_activity_logs')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (section && allowedSections.has(section)) {
      query = query.eq('section', section)
    }

    const { data, error } = await query

    if (error) {
      console.error('[v0] Error fetching XP activities:', error)
      return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
    }

    return NextResponse.json({ activities: data || [] })
  } catch (error) {
    console.error('[v0] Error in xp-activity GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
