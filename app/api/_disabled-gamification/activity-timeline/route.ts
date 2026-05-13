import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/gamification/activity-timeline
 * 
 * Fetches user's gamification activity history
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId') || user.id
    const limit = parseInt(searchParams.get('limit') || '20')

    // Fetch DTC transactions (for earnings)
    const { data: dtcTransactions, error: dtcError } = await supabase
      .from('dtc_transactions')
      .select('id, amount, description, created_at, transaction_type, metadata')
      .eq('user_id', userId)
      .eq('transaction_type', 'earn')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (dtcError) {
      console.warn('[v0] Error fetching DTC transactions:', dtcError)
    }

    // Fetch achievements/badges
    const { data: achievements, error: achError } = await supabase
      .from('achievements')
      .select('id, title, description, category, earned_at')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })
      .limit(limit)

    if (achError) {
      console.warn('[v0] Error fetching achievements:', achError)
    }

    // Combine and sort all activities
    const activities: any[] = []

    // Add DTC transactions
    ;(dtcTransactions || []).forEach((tx: any) => {
      activities.push({
        id: tx.id,
        type: 'dtc_gain',
        title: 'DTC Coins Earned',
        description: tx.description || 'Earned from gamification activity',
        value: tx.amount,
        timestamp: tx.created_at,
      })
    })

    // Add achievements
    ;(achievements || []).forEach((ach: any) => {
      let type = 'achievement'
      if (ach.category === 'badge') type = 'badge_unlock'
      if (ach.category === 'level_up') type = 'level_up'
      if (ach.category === 'milestone') type = 'milestone'

      activities.push({
        id: ach.id,
        type: type,
        title: ach.title,
        description: ach.description,
        value: 0,
        timestamp: ach.earned_at,
      })
    })

    // Sort by timestamp
    activities.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()
      return dateB - dateA
    })

    // Return latest activities
    const recentActivities = activities.slice(0, limit)

    return NextResponse.json({
      success: true,
      activities: recentActivities,
      total_count: activities.length,
    })
  } catch (error) {
    console.error('[v0] Error in activity timeline API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity timeline' },
      { status: 500 }
    )
  }
}
