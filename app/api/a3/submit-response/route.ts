import { NextResponse } from 'next/server'

/**
 * Deprecated evaluator for the retired `/a3-modules` experience.
 *
 * The legacy endpoint accepted user identity, response content and scoring
 * structures from the browser, then wrote with service-role privileges. The
 * canonical DTC A3 flows expose their own authenticated coaching and completion
 * APIs, so this duplicate evaluator must not remain callable.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'Legacy A3 response evaluator has been retired',
      code: 'LEGACY_A3_EVALUATOR_RETIRED',
      canonicalPath: '/despega/a3',
    },
    { status: 410 },
  )
}
