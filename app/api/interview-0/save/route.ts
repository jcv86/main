import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.warn('[v0] API interview-0/save: No user authenticated')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('[v0] API interview-0/save: Received data for user', user.id.substring(0, 8), {
      hasEnvironment: !!body.environment_check,
      hasPresence: !!body.presence_check,
      hasAudio: !!body.audio_check,
      hasPreparation: !!body.preparation_check,
      status: body.interview_0_status
    })
    
    const { error, data } = await supabase
      .from('a3_entrevista_0')
      .upsert({
        user_id: user.id,
        interview_0_completed: body.interview_0_completed ?? null,
        interview_0_score: body.interview_0_score ?? null,
        interview_0_status: body.interview_0_status ?? 'in_progress',
        environment_check: body.environment_check ?? null,
        presence_check: body.presence_check ?? null,
        audio_check: body.audio_check ?? null,
        preparation_check: body.preparation_check ?? null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()

    if (error) {
      console.error('[v0] API interview-0/save: Database error', {
        code: error.code,
        message: error.message,
        details: error.details
      })
      throw error
    }
    
    console.log('[v0] API interview-0/save: Saved successfully for user', user.id.substring(0, 8))
    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error('[v0] API interview-0/save failed:', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save' },
      { status: 500 }
    )
  }
}
