import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] A1 Cerebral save endpoint called')

    const body = await request.json()
    const { responses, questions, disc_profile, response_timings } = body

    const supabase = await createClient()

    // Get the authenticated user from the session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('[v0] No authenticated user found:', authError?.message)
      return NextResponse.json(
        { error: 'User must be authenticated to save assessment results' },
        { status: 401 }
      )
    }

    console.log('[v0] Authenticated user:', user.id)
    console.log('[v0] Saving Cerebral assessment for user:', user.id)

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

    const saveData = {
      user_id: user.id, // Use the authenticated user's ID
      responses: responses,
      questions: questions,
      disc_profile: disc_profile,
      dominant_pattern: dominant_pattern,
      completed_at: new Date().toISOString(),
    }

    console.log('[v0] Preparing to insert assessment data for user:', user.id)

    // Save to a1_cerebral_assessment table
    const { data, error } = await supabase
      .from('a1_cerebral_assessment')
      .insert(saveData)
      .select()
      .single()

    if (error) {
      console.error('[v0] Supabase insert error:', error.message, error.code, error.details)
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
