import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/dtc/wallet
 * 
 * Fetches user's DTC wallet balance and transaction history
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId') || user.id
    const limit = parseInt(searchParams.get('limit') || '20')

    // Fetch DTC balance
    const { data: dtcBalance, error: balanceError } = await supabase
      .from('user_dtc_balance')
      .select('balance, lifetime_earned, lifetime_spent')
      .eq('user_id', userId)
      .single()

    if (balanceError && balanceError.code !== 'PGRST116') {
      console.error('[v0] Error fetching DTC balance:', balanceError)
    }

    // Fetch transaction history
    const { data: transactions, error: transError } = await supabase
      .from('dtc_transactions')
      .select('id, amount, transaction_type, description, created_at, metadata')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (transError) {
      console.warn('[v0] Error fetching transactions:', transError)
    }

    return NextResponse.json({
      success: true,
      balance: dtcBalance?.balance || 0,
      lifetime_earned: dtcBalance?.lifetime_earned || 0,
      lifetime_spent: dtcBalance?.lifetime_spent || 0,
      recent_transactions: (transactions || []).map((tx: any) => ({
        id: tx.id,
        amount: tx.amount,
        type: tx.transaction_type,
        description: tx.description || 'DTC Transaction',
        created_at: tx.created_at,
        metadata: tx.metadata,
      })),
      transaction_count: transactions?.length || 0,
    })
  } catch (error) {
    console.error('[v0] Error in DTC wallet API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wallet' },
      { status: 500 }
    )
  }
}
