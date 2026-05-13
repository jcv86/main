import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

export async function POST(request: Request) {
  try {
    const { pillarId, xpAmount } = await request.json()

    const cookieStore = await cookies()
    const authToken =
      cookieStore.get('sb-auth-token')?.value ||
      cookieStore.get('sb-token')?.value ||
      cookieStore.get('sb_access_token')?.value

    if (!authToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    let userId: string
    try {
      const decoded: any = jwtDecode(authToken)
      userId = decoded.sub
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const supabase = await createClient()

    // Update user balance
    const { data: currentBalance } = await supabase
      .from('user_dtc_balance')
      .select('balance, lifetime_earned')
      .eq('user_id', userId)
      .single()

    const newBalance = (currentBalance?.balance || 0) + xpAmount
    const newLifetime = (currentBalance?.lifetime_earned || 0) + xpAmount

    await supabase
      .from('user_dtc_balance')
      .update({
        balance: newBalance,
        lifetime_earned: newLifetime,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    // Record transaction
    await supabase.from('dtc_transactions').insert({
      user_id: userId,
      amount: xpAmount,
      type: 'pillar_completion',
      description: `Completación del pilar ${pillarId}`,
      metadata: { pillarId },
    })

    console.log(
      `[v0] Awarded ${xpAmount} XP to user ${userId} for pillar ${pillarId}`
    )

    return NextResponse.json({
      success: true,
      newBalance,
      xpAwarded: xpAmount,
    })
  } catch (error) {
    console.error('[v0] Error awarding XP:', error)
    return NextResponse.json(
      { error: 'Failed to award XP' },
      { status: 500 }
    )
  }
}
