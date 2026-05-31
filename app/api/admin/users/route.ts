import { NextRequest, NextResponse } from 'next/server'
import { getAllUsersForAdmin } from '@/lib/dtc-agentos/admin/platform-management'

export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50')
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0')

    const result = await getAllUsersForAdmin(limit, offset)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      users: result.users,
      total: result.total,
    })
  } catch (error) {
    console.error('[v0] Error getting users:', error)
    return NextResponse.json({ error: 'Failed to get users' }, { status: 500 })
  }
}
