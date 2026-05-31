import { NextRequest, NextResponse } from 'next/server'
import { exportUserData } from '@/lib/dtc-agentos/admin/platform-management'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const result = await exportUserData(userId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 403 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error('[v0] Error exporting data:', error)
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 })
  }
}
