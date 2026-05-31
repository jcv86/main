import { NextRequest, NextResponse } from 'next/server'
import { getPlatformMetrics, getContentMetrics } from '@/lib/dtc-agentos/admin/platform-management'

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type') || 'platform'

    if (type === 'content') {
      const result = await getContentMetrics()
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 403 })
      }
      return NextResponse.json({ success: true, metrics: result.metrics })
    }

    const result = await getPlatformMetrics()
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 403 })
    }

    return NextResponse.json({ success: true, metrics: result.metrics })
  } catch (error) {
    console.error('[v0] Error getting metrics:', error)
    return NextResponse.json({ error: 'Failed to get metrics' }, { status: 500 })
  }
}
