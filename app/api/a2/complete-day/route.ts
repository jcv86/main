import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { triggerA3UnlocksForDay } from '@/lib/a2-a3-unlock-handler'

/**
 * POST /api/a2/complete-day
 * Mark a specific day as completed for the user
 * Triggers A3 module unlocks if configured for this day
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dayNumber, submission } = body

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
          submission_data: submission, // Store full submission if provided
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

    // Trigger A3 module unlocks for this day
    const unlockResult = await triggerA3UnlocksForDay(userId, dayNumber)
    
    console.log('[v0] Day completion result:', {
      day: dayNumber,
      userId,
      completed: true,
      a3_unlocks: unlockResult,
    })

    return NextResponse.json({
      success: true,
      message: `Day ${dayNumber} marked as completed`,
      data,
      a3_unlocks: unlockResult,
    })
  } catch (error) {
    console.error('[v0] Error in complete-day:', error)
    return NextResponse.json(
      { error: 'Failed to complete day' },
      { status: 500 }
    )
  }
}
