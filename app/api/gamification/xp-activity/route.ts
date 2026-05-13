import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface XPActivityRequest {
  section: 'A3' | 'A4' | 'INTERVIEW' | 'BONUS'
  activity_type: string
  xp_amount: number
  reference_id?: string
  metadata?: Record<string, any>
}

/**
 * POST /api/gamification/xp-activity
 * 
 * Logs an XP activity to the audit trail and triggers automatic recalculation
 * of user's global XP pool and level.
 * 
 * Request body:
 * - section: 'A3' | 'A4' | 'INTERVIEW' | 'BONUS'
 * - activity_type: string (e.g., 'interview_completion', 'module_completion')
 * - xp_amount: number (> 0)
 * - reference_id: string (optional, e.g., interview_id or module_id)
 * - metadata: object (optional, for context)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: XPActivityRequest = await request.json()

    // Validate input
    if (!body.section || !['A3', 'A4', 'INTERVIEW', 'BONUS'].includes(body.section)) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
    }
    if (!body.activity_type || typeof body.activity_type !== 'string') {
      return NextResponse.json({ error: 'Invalid activity_type' }, { status: 400 })
    }
    if (!body.xp_amount || body.xp_amount <= 0) {
      return NextResponse.json({ error: 'XP amount must be > 0' }, { status: 400 })
    }

    // Insert into xp_activity_logs
    const { data, error } = await supabase
      .from('xp_activity_logs')
      .insert({
        user_id: user.id,
        section: body.section,
        activity_type: body.activity_type,
        xp_amount: body.xp_amount,
        reference_id: body.reference_id || null,
        metadata: body.metadata || {},
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Error logging XP activity:', error)
      return NextResponse.json({ error: 'Failed to log XP activity' }, { status: 500 })
    }

    // Fetch updated user profile to return current stats
    const { data: profile } = await supabase
      .from('user_gamification_profile')
      .select('xp_a3_total, xp_a4_total, xp_interview_bonus, xp_global_total, current_level')
      .eq('user_id', user.id)
      .single()

    return NextResponse.json({
      success: true,
      activity: data,
      updated_profile: profile,
    })
  } catch (error) {
    console.error('[v0] Error in xp-activity endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/gamification/xp-activity
 * 
 * Fetch XP activity logs for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limit = request.nextUrl.searchParams.get('limit') || '50'
    const section = request.nextUrl.searchParams.get('section')

    let query = supabase
      .from('xp_activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit))

    if (section && ['A3', 'A4', 'INTERVIEW', 'BONUS'].includes(section)) {
      query = query.eq('section', section)
    }

    const { data, error } = await query

    if (error) {
      console.error('[v0] Error fetching XP activities:', error)
      return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
    }

    return NextResponse.json({ activities: data })
  } catch (error) {
    console.error('[v0] Error in xp-activity GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
