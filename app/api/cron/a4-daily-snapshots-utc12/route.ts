import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * Cron: A4 Daily Snapshots (UTC+12)
 * Schedule: Every day at 12:00 PM UTC
 * Purpose: Trigger daily snapshot collection for A4 job search tracking
 */
export async function GET(request: NextRequest) {
  try {
    // Verify Cron Secret
    const secret = request.headers.get('authorization')?.replace('Bearer ', '')
    const expectedSecret = process.env.CRON_SECRET

    if (!secret || !expectedSecret) {
      return NextResponse.json(
        { error: 'CRON_SECRET no está configurado de forma segura.' },
        { status: 503 }
      )
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid CRON_SECRET' },
        { status: 401 }
      )
    }

    const supabase = await createAdminClient()

    // Get all active A4 users who started their 30-day journey
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('id, user_id')
      .eq('current_module', 'a4')
      .limit(100)

    if (usersError) {
      console.error('[Cron A4 UTC12] Error fetching users:', usersError)
      return NextResponse.json(
        { error: 'Error fetching users', details: usersError.message },
        { status: 500 }
      )
    }

    // Create daily snapshots for each user
    let snapshotsCreated = 0

    for (const userProfile of users || []) {
      const { error: snapshotError } = await supabase
        .from('a4_daily_snapshots')
        .insert({
          user_id: userProfile.user_id,
          snapshot_date: new Date().toISOString().split('T')[0],
          timezone: 'UTC+12',
          status: 'pending'
        })

      if (!snapshotError) {
        snapshotsCreated++
      } else {
        console.warn(`[Cron A4 UTC12] Failed to create snapshot for user ${userProfile.user_id}:`, snapshotError)
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `A4 Daily Snapshots (UTC+12) completed`,
        usersProcessed: users?.length || 0,
        snapshotsCreated,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Cron A4 UTC12] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
