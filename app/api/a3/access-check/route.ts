import { createAdminClient } from '@/lib/supabase/server'
import { checkA3ModuleAccess, getA3AccessDenialMessage } from '@/lib/a3-access-control'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyDemoSessionToken, DEMO_COOKIE_NAME } from '@/lib/auth/demo-user'

/**
 * API endpoint to check if user can access a specific A3 module
 * 
 * Query params:
 * - moduleId: The A3 module ID to check access for (e.g., 'career-mirror')
 * 
 * Returns:
 * - canAccess: boolean
 * - reason: string explaining the result
 * - blockReasons: array of specific reasons if blocked
 * - accessDetails: full access check details
 */
export async function GET(request: Request) {
  try {
    const supabase = createAdminClient()
    const cookieStore = await cookies()
    const demoToken = cookieStore.get(DEMO_COOKIE_NAME)?.value
    const demoUser = await verifyDemoSessionToken(demoToken)

    if (!demoUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const userId = demoUser.id

    // Get moduleId from query params
    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get('moduleId')

    if (!moduleId) {
      return NextResponse.json(
        { error: 'Missing moduleId query parameter' },
        { status: 400 },
      )
    }

    console.log('[v0] Checking A3 access for:', { userId, moduleId })

    // Check access using the main access control function
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
    return NextResponse.json(
      { error: 'Failed to check access' },
      { status: 500 },
    )
  }
}
