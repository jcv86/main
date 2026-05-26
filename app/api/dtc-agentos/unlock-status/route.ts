/**
 * GET /api/dtc-agentos/unlock-status
 * 
 * Check all unlock conditions for a user.
 * Returns what's unlocked and what conditions are missing.
 * 
 * Query params:
 * - unlockKey: specific unlock to check (optional)
 * 
 * Response:
 * {
 *   unlocks: {
 *     "cv-inteligente": { unlocked: true },
 *     "advanced-interview": { unlocked: false, missing: ["score_threshold"] }
 *   }
 * }
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { checkUnlock } from '@/lib/dtc-agentos/unlock/rules-engine'

const KEY_UNLOCK_MAP = {
  'cv-inteligente': 'cv-inteligente',
  'advanced-interview': 'advanced-interview-access',
  'pro-interview': 'pro-interview-access',
  'a3-modules': 'a3-modules-access',
  'a4-documents': 'a4-documents-access',
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const unlockKey = searchParams.get('key')

    const unlocks: Record<string, { unlocked: boolean; missing?: string[] }> = {}

    if (unlockKey) {
      // Check specific unlock
      const fullKey = KEY_UNLOCK_MAP[unlockKey as keyof typeof KEY_UNLOCK_MAP] || unlockKey
      const result = await checkUnlock(user.id, fullKey)
      unlocks[unlockKey] = {
        unlocked: result.unlocked,
        missing: result.missing.length > 0 ? result.missing : undefined,
      }
    } else {
      // Check all unlocks
      for (const [key, fullKey] of Object.entries(KEY_UNLOCK_MAP)) {
        const result = await checkUnlock(user.id, fullKey)
        unlocks[key] = {
          unlocked: result.unlocked,
          missing: result.missing.length > 0 ? result.missing : undefined,
        }
      }
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      unlocks,
    })
  } catch (error) {
    console.error('[v0] Error checking unlock status:', error)
    return NextResponse.json(
      { error: 'Failed to check unlock status', details: String(error) },
      { status: 500 }
    )
  }
}
