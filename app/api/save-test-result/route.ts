import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('[v0] Authentication error:', authError)
      return NextResponse.json(
        { error: 'Unauthorized - No authenticated user' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { testType, testName, results, score, durationMinutes } = body

    if (!testType || !results) {
      return NextResponse.json(
        { error: 'Missing required fields: testType and results are required' },
        { status: 400 }
      )
    }

    console.log(`[v0] Saving test result for user: ${user.email}, test: ${testType}`)

    const { data, error } = await supabase
      .from('test_results')
      .insert({
        user_email: user.email,
        test_type: testType,
        test_name: testName || testType,
        results: results,
        score: score || 0,
        completed_at: new Date().toISOString(),
        duration_minutes: durationMinutes || 0,
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Error saving test result:', error)
      return NextResponse.json(
        { error: 'Failed to save test result', details: error.message },
        { status: 500 }
      )
    }

    console.log('[v0] Test result saved successfully:', data)

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('[v0] Unexpected error saving test result:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
