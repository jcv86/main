import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { triggerA3UnlocksForDay } from '@/lib/a2-a3-unlock-handler'

/**
 * POST /api/a2/complete-day
 * Mark a specific day as completed for the user
 * Supports both real Supabase users AND demo/dev users
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
    
    // Try to get real Supabase auth user first
    let user = null
    let isDemoUser = false
    
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authUser) {
      // Check if this is a demo user (dev Travis account or test users)
      const demoUserCookie = request.cookies.get('demo_user')?.value
      
      if (!demoUserCookie) {
        console.warn('[v0] No real auth user and no demo_user cookie')
        return NextResponse.json(
          { error: 'Not authenticated' },
          { status: 401 }
        )
      }
      
      try {
        const demoUser = JSON.parse(decodeURIComponent(demoUserCookie))
        user = {
          id: demoUser.id,
          email: demoUser.email,
          is_dev: demoUser.is_dev === true,
        }
        isDemoUser = true
        console.log('[v0] Demo user completing day:', { userId: user.id, email: user.email, isDev: user.is_dev })
      } catch (e) {
        console.error('[v0] Invalid demo_user cookie:', e)
        return NextResponse.json(
          { error: 'Invalid session' },
          { status: 401 }
        )
      }
    } else {
      user = { id: authUser.id, email: authUser.email, is_dev: false }
      console.log('[v0] Real user completing day:', { userId: user.id, email: user.email })
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
          is_demo: isDemoUser, // Mark demo user data
        },
        { onConflict: 'user_id,day' }
      )
      .select()

    if (upsertError) {
      console.error('[v0] Error completing day:', upsertError)
      return NextResponse.json(
        { error: 'Failed to complete day', details: upsertError.message },
        { status: 500 }
      )
    }

    // Trigger A3 module unlocks for this day (only for real users with A3 in flow)
    let unlockResult = null
    if (!isDemoUser) {
      unlockResult = await triggerA3UnlocksForDay(userId, dayNumber)
    } else {
      // For demo users, just log that A3 would unlock
      console.log('[v0] Demo user would unlock A3 modules for day:', dayNumber)
      unlockResult = { day: dayNumber, demo: true, message: 'A3 modules would unlock' }
    }
    
    console.log('[v0] Day completion result:', {
      day: dayNumber,
      userId,
      userType: isDemoUser ? 'demo' : 'real',
      completed: true,
      a3_unlocks: unlockResult,
    })

    return NextResponse.json({
      success: true,
      message: `Day ${dayNumber} marked as completed${isDemoUser ? ' (demo mode)' : ''}`,
      data,
      a3_unlocks: unlockResult,
      userType: isDemoUser ? 'demo' : 'real',
    })
  } catch (error) {
    console.error('[v0] Error in complete-day:', error)
    return NextResponse.json(
      { error: 'Failed to complete day', details: String(error) },
      { status: 500 }
    )
  }
}
