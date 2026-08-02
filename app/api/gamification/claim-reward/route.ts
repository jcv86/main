import { NextResponse } from 'next/server'

/**
 * Legacy reward-claim endpoint.
 *
 * Rewards must be calculated and awarded by the server action that verifies the
 * underlying completion. Accepting XP or DTC amounts from a browser lets a
 * client inflate its own balance and can also duplicate rewards already granted
 * by the completion endpoint.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'Manual reward claiming has been disabled',
      code: 'REWARD_CLAIM_DEPRECATED',
      message: 'Rewards are now awarded only by verified completion endpoints.',
    },
    { status: 410 },
  )
}
