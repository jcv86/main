import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { checkA3ModuleAccess, getA3AccessDenialMessage } from '@/lib/a3-access-control'
import { NextResponse } from 'next/server'

/**
 * API endpoint to check if user can access a specific A3 module.
 */
export async function GET(request: Request) {
  try {
    const supabase = createAdminClient()
    const currentUser = await resolveServerUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const userId = currentUser.id
    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get('moduleId')

    if (!moduleId) {
      return NextResponse.json(
        { error: 'Missing moduleId query parameter' },
        { status: 400 },
      )
    }

    const accessCheck = await checkA3ModuleAccess(userId, moduleId, supabase)
    const denialMessage = accessCheck.canAccess
      ? undefined
      : getA3AccessDenialMessage(accessCheck)

    return NextResponse.json({
      success: true,
      canAccess: accessCheck.canAccess,
      reason: accessCheck.reason,
      denialMessage,
      blockReasons: accessCheck.blockReasons,
      details: {
        currentDay: accessCheck.currentDay,
        checkpointDay: accessCheck.checkpointDay,
        day1Status: accessCheck.day1Status,
        day1Score: accessCheck.day1Score,
        requestedModuleId: accessCheck.requestedModuleId,
      },
    })
  } catch (error) {
    console.error('[v0] Error checking A3 access:', error)
    return NextResponse.json({ error: 'Failed to check access' }, { status: 500 })
  }
}
