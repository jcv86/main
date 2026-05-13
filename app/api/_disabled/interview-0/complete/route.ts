import { createClient } from '@/lib/supabase/server'
import { completeInterview0 } from '@/lib/interview-0/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check session first
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      console.warn('[v0] API interview-0/complete: No active session found')
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 }
      )
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { finalScore } = await request.json()
    
    console.log('[v0] API interview-0/complete: Starting XP award for user', user.id.substring(0, 8), 'with score', finalScore)

    // Mark interview-0 as completed in a3_entrevista_0 table
    const { error, data } = await supabase
      .from('a3_entrevista_0')
      .update({
        interview_0_completed: true,
        interview_0_score: finalScore,
        interview_0_status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()

    if (error) {
      console.error('[v0] API interview-0/complete: Database error updating interview record', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      return NextResponse.json(
        { 
          error: error.message || 'Database error',
          code: error.code,
          details: error.details
        },
        { status: 500 }
      )
    }

    // Award 70 XP and mark auditoria-inicial as completed
    console.log('[v0] API interview-0/complete: Calling completeInterview0 to award XP')
    await completeInterview0(user.id, finalScore)
    console.log('[v0] API interview-0/complete: XP awarded successfully')

    console.log('[v0] API interview-0/complete: Successfully completed for user', user.id.substring(0, 8))
    return NextResponse.json({ success: true, data, xpAwarded: 70, module: 'auditoria-inicial' }, { status: 200 })
  } catch (error) {
    console.error('[v0] API interview-0/complete failed:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to complete' },
      { status: 500 }
    )
  }
}
