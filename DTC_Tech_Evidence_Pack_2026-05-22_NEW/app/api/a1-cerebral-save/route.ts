import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { responses, questions, disc_profile } = body

    const supabase = await createClient()

    // Get the authenticated user from the session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'User must be authenticated to save assessment results' },
        { status: 401 }
      )
    }

    // Ensure user exists in public.users (required for FK constraint)
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existingUser) {
      // Create the public.users record if missing
      const { error: userInsertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (userInsertError && userInsertError.code !== '23505') {
        // 23505 = unique violation (user already exists, which is fine)
        console.error('[v0] Failed to create public.users record:', userInsertError)
      }
    }

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

    const saveData = {
      user_id: user.id,
      responses: responses,
      questions: questions,
      disc_profile: disc_profile,
      dominant_pattern: dominant_pattern,
      completed_at: new Date().toISOString(),
    }

    // Save to a1_cerebral_assessment table
    const { data, error } = await supabase
      .from('a1_cerebral_assessment')
      .insert(saveData)
      .select()
      .single()

    if (error) {
      console.error('[v0] Supabase insert error:', error.message, error.code)
      throw new Error(`Database error: ${error.message}`)
    }

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
