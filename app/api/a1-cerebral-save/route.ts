import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] A1 Cerebral save endpoint called')

    const body = await request.json()
    const { user_id, responses, questions, disc_profile, response_timings } = body

    if (!user_id) {
      console.error('[v0] Missing user_id in request')
      return NextResponse.json(
        { error: 'Missing user_id' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // For demo users, we'll use the user_id as-is since they might not be in auth.users
    // For authenticated users, verify the session matches
    const { data: { user } } = await supabase.auth.getUser()
    
    console.log('[v0] Authenticated user from server:', user?.id)
    console.log('[v0] User ID from request:', user_id)
    console.log('[v0] Demo mode check: user exists?', !!user)

    // Allow if user is authenticated OR if this is a demo user (no auth session but user_id provided)
    if (user && user.id !== user_id) {
      console.error('[v0] User ID mismatch:', { serverUserId: user.id, requestUserId: user_id })
      return NextResponse.json(
        { error: 'User ID mismatch' },
        { status: 401 }
      )
    }

    console.log('[v0] Saving Cerebral assessment for user:', user_id)

    // Calculate dominant pattern from disc_profile scores
    let dominant_pattern = 'D'
    if (disc_profile && typeof disc_profile === 'object') {
      const scores = {
        D: disc_profile.D || 0,
        I: disc_profile.I || 0,
        S: disc_profile.S || 0,
        C: disc_profile.C || 0,
      }
      
      const maxScore = Math.max(...Object.values(scores))
      const dominantLetter = Object.keys(scores).find(
        key => scores[key as keyof typeof scores] === maxScore
      )
      
      if (dominantLetter) {
        dominant_pattern = dominantLetter
      }
    }
    
    console.log('[v0] Calculated dominant pattern:', dominant_pattern)

    // For demo users, we need to bypass the foreign key constraint
    // Use .insert().select() which will fail with FK error for demo users
    // For authenticated users with valid Supabase accounts, it should work
    
    const saveData = {
      user_id,
      responses: responses,
      questions: questions,
      disc_profile: disc_profile,
      dominant_pattern: dominant_pattern,
      completed_at: new Date().toISOString(),
    }

    console.log('[v0] Preparing to insert:', saveData)

    // Try to insert normally first
    let { data, error } = await supabase
      .from('a1_cerebral_assessment')
      .insert(saveData)
      .select()
      .single()

    // If FK constraint fails (demo user not in auth.users), we can handle it gracefully
    // For now, we'll just return the error to the client for debugging
    if (error) {
      console.error('[v0] Supabase insert error:', error.message, error.code)
      
      // If it's a foreign key error and user is not authenticated (demo user),
      // we should consider storing demo results differently or creating a temporary user record
      if (error.code === '23503' && !user) {
        console.warn('[v0] Foreign key constraint failed for demo user - this is expected')
        // Return a success response anyway since the data structure is valid
        return NextResponse.json({
          success: true,
          assessmentId: `demo-${Date.now()}`,
          profile: disc_profile,
          note: 'Demo assessment recorded (not persisted to database)'
        }, { status: 200 })
      }
      
      throw new Error(`Database error: ${error.message}`)
    }

    console.log('[v0] Successfully saved Cerebral assessment:', data?.id)

    return NextResponse.json({
      success: true,
      assessmentId: data?.id,
      profile: disc_profile,
    }, { status: 200 })
  } catch (err) {
    console.error('[v0] Error in a1-cerebral-save endpoint:', err)
    const errorMsg = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { error: `Cerebral save error: ${errorMsg}` },
      { status: 500 }
    )
  }
}
