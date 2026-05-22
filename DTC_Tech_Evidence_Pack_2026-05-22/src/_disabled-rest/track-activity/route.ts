import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, activity_type, details } = body

    if (!user_id || !activity_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Track user activity
    const { data, error } = await supabase
      .from('user_activity_log')
      .insert({
        user_id,
        activity_type,
        details: details || null,
        timestamp: new Date().toISOString(),
      })

    if (error) {
      console.error('[v0] Error tracking activity:', error)
      return NextResponse.json(
        { error: 'Failed to track activity' },
        { status: 500 }
      )
    }

    console.log(`[v0] Activity tracked: ${activity_type} for user ${user_id}`)

    return NextResponse.json({
      success: true,
      activity_logged: true,
      activity_type,
    })
  } catch (error) {
    console.error('[v0] Error in track-activity:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
