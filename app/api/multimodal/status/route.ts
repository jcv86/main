import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAnalysisResults, getJobStatus } from '@/lib/multimodal/analysis-queue'

/**
 * GET /api/multimodal/status?sessionId=xxx
 * Get analysis job status and results
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionId = request.nextUrl.searchParams.get('sessionId')
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    // Get session
    const { data: session, error: sessionError } = await supabase
      .from('multimodal_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Get analysis results if available
    let analysis = null
    if (session.analysis_id) {
      analysis = await getAnalysisResults(session.analysis_id)
    }

    // Get job status
    let jobStatus = null
    if (session.job_id) {
      jobStatus = await getJobStatus(session.job_id)
    }

    return NextResponse.json({
      sessionId,
      status: session.status,
      analysis: analysis,
      jobStatus: jobStatus,
      createdAt: session.created_at,
      completedAt: session.completed_at
    })
  } catch (error) {
    console.error('[v0] Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to get status' },
      { status: 500 }
    )
  }
}
