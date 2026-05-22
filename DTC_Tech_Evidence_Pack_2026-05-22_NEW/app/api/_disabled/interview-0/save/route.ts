import { createClient } from '@/lib/supabase/server'
import { saveInterview0Progress, completeInterview0 } from '@/lib/interview-0/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check session first
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      // Allow demo mode for preview - just return success without saving
      const body = await request.json()
      return NextResponse.json(
        { 
          success: true, 
          message: 'Demo mode - data not persisted',
          data: body 
        },
        { status: 200 }
      )
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      // Allow demo mode for preview
      const body = await request.json()
      return NextResponse.json(
        { 
          success: true, 
          message: 'Demo mode - data not persisted',
          data: body 
        },
        { status: 200 }
      )
    }

    const body = await request.json()
    
    console.log('[v0] Saving interview-0:', { userId: user.id.substring(0, 8), interview_0_completed: body.interview_0_completed, final_score: body.final_score })
    
    // Save interview-0 progress to database
    await saveInterview0Progress(user.id, body)

    // If interview-0 is completed, award XP and mark module complete
    if (body.interview_0_completed && body.final_score) {
      console.log('[v0] Completing interview-0 with score:', body.final_score)
      await completeInterview0(user.id, body.final_score)
      console.log('[v0] Interview-0 completion saved, 70 XP awarded')
    }
    
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save' },
      { status: 500 }
    )
  }
}
