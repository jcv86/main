import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProgressMetrics } from '@/lib/dtc-agentos/analytics/insights-engine'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await getProgressMetrics(user.id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      metrics: result.metrics,
    })
  } catch (error) {
    console.error('[v0] Error getting progress metrics:', error)
    return NextResponse.json({ error: 'Failed to get progress metrics' }, { status: 500 })
  }
}
