import { NextResponse } from 'next/server'

/**
 * Deprecated legacy completion endpoint.
 *
 * Canonical A3 completion is handled exclusively by the authenticated
 * /api/a3/module-completion endpoint, which validates evidence and writes the
 * completion atomically.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'Legacy A3 completion endpoint has been retired',
      code: 'LEGACY_A3_COMPLETION_RETIRED',
      canonicalEndpoint: '/api/a3/module-completion',
      canonicalPath: '/despega/a3',
    },
    { status: 410 },
  )
}
