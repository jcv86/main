import { createClient } from '@/lib/supabase/server'
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
      console.error('[v0] API interview-0/complete: Database error', {
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

    console.log('[v0] API interview-0/complete: Successfully completed for user', user.id.substring(0, 8))
    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error('[v0] API interview-0/complete failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to complete' },
      { status: 500 }
    )
  }
}
