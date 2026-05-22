import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/a2/complete-day
 * Mark a specific day as completed for the user
 * Used during development to simulate day completions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dayNumber } = body

    if (!dayNumber || dayNumber < 1 || dayNumber > 90) {
      return NextResponse.json(
        { error: 'Invalid day number. Must be between 1 and 90.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userId = user.id

    // Insert or update day completion
    const { data, error: upsertError } = await supabase
      .from('a2_user_task_completions')
      .upsert(
        {
          user_id: userId,
          day: dayNumber,
          completed_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,day' }
      )
      .select()

    if (upsertError) {
      console.error('[v0] Error completing day:', upsertError)
      return NextResponse.json(
        { error: 'Failed to complete day' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Day ${dayNumber} marked as completed`,
      data,
    })
  } catch (error) {
    console.error('[v0] Error in complete-day:', error)
    return NextResponse.json(
      { error: 'Failed to complete day' },
      { status: 500 }
    )
  }
}
