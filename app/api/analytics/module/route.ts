import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getModuleAnalytics } from '@/lib/dtc-agentos/analytics/insights-engine'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const moduleId = request.nextUrl.searchParams.get('moduleId')
    if (!moduleId) {
      return NextResponse.json({ error: 'Module ID required' }, { status: 400 })
    }

    const result = await getModuleAnalytics(user.id, moduleId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      analytics: result.analytics,
    })
  } catch (error) {
    console.error('[v0] Error getting module analytics:', error)
    return NextResponse.json({ error: 'Failed to get module analytics' }, { status: 500 })
  }
}
