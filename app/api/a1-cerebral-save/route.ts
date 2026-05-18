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

    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.id !== user_id) {
      console.error('[v0] User mismatch or not authenticated')
      return NextResponse.json(
        { error: 'Unauthorized' },
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
      console.error('[v0] Supabase error:', error)
      throw error
    }

    console.log('[v0] Successfully saved Cerebral assessment:', data)

    return NextResponse.json({
      success: true,
      assessmentId: data.id,
      profile: disc_profile,
    })
  } catch (err) {
    console.error('[v0] Error in a1-cerebral-save endpoint:', err)
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    )
  }
}
