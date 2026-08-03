import { NextResponse } from 'next/server'

/**
 * Retired compatibility endpoint.
 *
 * This route previously accepted a training identity and self-reported activity
 * from the browser, then awarded XP and DTC through a second progress system.
 * Verified A3 completion now happens only in /api/a3/module-completion.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'Unverified A3 training rewards have been retired.',
      code: 'A3_UNVERIFIED_REWARDS_RETIRED',
      canonicalEndpoint: '/api/a3/module-completion',
      canonicalPath: '/despega/a3',
    },
    { status: 410 },
  )
}
