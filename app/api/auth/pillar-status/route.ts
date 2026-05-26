import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/auth/pillar-status
 * Returns the user's completed pillars and their pillar access status
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check which pillars the user has completed
    const completedPillars: string[] = []

    // Check A1 completion (must have a1_identity record)
    const { data: a1Data } = await supabase
      .from('a1_identity')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (a1Data) {
      completedPillars.push('a1')
    }

    // Check A2 completion (user should have >0 tasks completed)
    const { data: a2Data } = await supabase
      .from('a2_user_task_completions')
      .select('day')
      .eq('user_id', user.id)
      .eq('day', 90) // Check if day 90 completed
      .single()

    if (a2Data) {
      completedPillars.push('a2')
    }

    // Check A3 completion (user should have module completions)
    const { data: a3Data } = await supabase
      .from('a3_module_completions')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .single()

    if (a3Data) {
      completedPillars.push('a3')
    }

    // Check A4 completion (user should have documents)
    const { data: a4Data } = await supabase
      .from('a4_strategic_documents')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .single()

    if (a4Data) {
      completedPillars.push('a4')
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      email: user.email,
      completedPillars,
      canAccess: {
        a1: true,
        a2: completedPillars.includes('a1'),
        a3: completedPillars.includes('a1') && completedPillars.includes('a2'),
        a4: completedPillars.includes('a1') && completedPillars.includes('a2') && completedPillars.includes('a3'),
      },
    })
  } catch (error) {
    console.error('[v0] Error checking pillar status:', error)
    return NextResponse.json(
      { error: 'Failed to check pillar status' },
      { status: 500 }
    )
  }
}
