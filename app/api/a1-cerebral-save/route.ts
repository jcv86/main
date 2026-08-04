import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { executeCommand } from '@/lib/dtc-agentos/commands/execute-command'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { responses, questions, disc_profile } = body

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'User must be authenticated to save assessment results' },
        { status: 401 },
      )
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existingUser) {
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
        console.error('[v0] Failed to create public.users record:', userInsertError)
      }
    }

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
        key => scores[key as keyof typeof scores] === maxScore,
      )

      if (dominantLetter) {
        dominant_pattern = dominantLetter
      }
    }

    const saveData = {
      user_id: user.id,
      responses,
      questions,
      disc_profile,
      dominant_pattern,
      completed_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('a1_cerebral_assessment')
      .insert(saveData)
      .select()
      .single()

    if (error) {
      console.error('[v0] Supabase insert error:', error.message, error.code)
      throw new Error(`Database error: ${error.message}`)
    }

    try {
      const result = await executeCommand({
        userId: user.id,
        commandId: '/dtc:a1-identity-audit',
        agentId: 'coach',
        modeId: 'identity-audit',
        params: {
          testId: data?.id,
          responses,
          discProfile: disc_profile,
          dominantPattern: dominant_pattern,
        },
      })

      if (!result.success) {
        console.error('[v0] Failed to capture A1 memory:', result.error)
      } else {
        console.log('[v0] A1 memory captured successfully:', result.memoryUpdates)
      }
    } catch (memoryError) {
      console.error('[v0] Exception capturing A1 memory:', memoryError)
    }

    return NextResponse.json({
      success: true,
      assessmentId: data?.id,
      profile: disc_profile,
    })
  } catch (err) {
    console.error('[v0] Error in a1-cerebral-save endpoint:', err)
    const errorMsg = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { error: `Cerebral save error: ${errorMsg}` },
      { status: 500 },
    )
  }
}
