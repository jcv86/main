import { NextResponse } from 'next/server'

/**
 * Deprecated legacy completion endpoint.
 *
 * The old route accepted a browser-provided user ID and awarded XP through a
 * second, incompatible progress system. Canonical A3 completion is handled by
 * the authenticated `/api/a3/module-completion`, `/api/a3/save-module-progress`
 * and `/api/a3/training-completion` endpoints.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'Legacy A3 completion endpoint has been retired',
      code: 'LEGACY_A3_COMPLETION_RETIRED',
      canonicalPath: '/despega/a3',
    },
    { status: 410 },
  )
}
