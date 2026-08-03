import { NextResponse } from 'next/server'

/**
 * Retired compatibility endpoint.
 *
 * This route previously accepted a module ID and a completion status directly
 * from the browser, then unlocked modules and awarded XP without validating the
 * required evidence. Canonical completion is exclusively handled by
 * /api/a3/module-completion.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'Unverified A3 progress mutations have been retired.',
      code: 'A3_UNVERIFIED_PROGRESS_RETIRED',
      canonicalEndpoint: '/api/a3/module-completion',
      canonicalPath: '/despega/a3',
    },
    { status: 410 },
  )
}
