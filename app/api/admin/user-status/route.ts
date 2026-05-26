import { NextRequest, NextResponse } from 'next/server'
import { updateUserStatus } from '@/lib/dtc-agentos/admin/platform-management'

export async function PUT(request: NextRequest) {
  try {
    const { userId, status } = await request.json() as {
      userId: string
      status: 'active' | 'paused' | 'completed'
    }

    if (!userId || !status) {
      return NextResponse.json({ error: 'User ID and status required' }, { status: 400 })
    }

    const result = await updateUserStatus(userId, status)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 403 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error updating user status:', error)
    return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 })
  }
}
