import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { finalScore } = await request.json()

    const { error } = await supabase
      .from('a3_entrevista_0')
      .update({
        interview_0_completed: true,
        interview_0_score: finalScore,
        interview_0_status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] API interview-0/complete failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to complete' },
      { status: 500 }
    )
  }
}
