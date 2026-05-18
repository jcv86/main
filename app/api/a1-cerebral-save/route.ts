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

    // Verify user is authenticated by checking the session in the request
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

    // Save to a1_cerebral_assessment table
    const { data, error } = await supabase
      .from('a1_cerebral_assessment')
      .insert({
        user_id,
        responses: responses,
        questions: questions,
        disc_profile: disc_profile,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Supabase insert error:', error.message, error.code)
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
