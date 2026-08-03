import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const EMPTY_BALANCE = {
  balance: 0,
  lifetime_earned: 0,
  lifetime_spent: 0,
}

export async function GET() {
  try {
    const currentUser = await resolveServerUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const { data: balance, error } = await supabase
      .from('user_dtc_balance')
      .select('balance, lifetime_earned, lifetime_spent')
      .eq('user_id', currentUser.id)
      .maybeSingle()

    if (error) {
      console.error('[v0] Error fetching DTC balance:', error)
      return NextResponse.json(
        { error: 'Failed to fetch balance' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      ...(balance || EMPTY_BALANCE),
    })
  } catch (error) {
    console.error('[v0] Error fetching DTC balance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 },
    )
  }
}

export async function POST() {
  return NextResponse.json(
    {
      error: 'Direct DTC balance mutations are disabled.',
      code: 'SERVER_OWNED_BALANCE',
    },
    {
      status: 405,
      headers: { Allow: 'GET' },
    },
  )
}
