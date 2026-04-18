import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // Get or create DTC balance
    let { data: balance } = await supabase
      .from('user_dtc_balance')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!balance) {
      const { data: newBalance } = await supabase
        .from('user_dtc_balance')
        .insert([{ user_id: userId }])
        .select()
        .single()
      balance = newBalance
    }

    return NextResponse.json({
      success: true,
      balance: balance.balance,
      lifetime_earned: balance.lifetime_earned,
      lifetime_spent: balance.lifetime_spent
    })
  } catch (error) {
    console.error('Error fetching DTC balance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, action, amount, description } = await request.json()

    if (!userId || !action || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (action === 'earn') {
      // Add points from interviews, achievements, etc.
      const { data } = await supabase
        .from('user_dtc_balance')
        .update({
          balance: supabase.from('user_dtc_balance').select('balance'),
          lifetime_earned: supabase.from('user_dtc_balance').select('lifetime_earned')
        })
        .eq('user_id', userId)
        .select()
        .single()

      // Record transaction
      await supabase
        .from('dtc_transactions')
        .insert([{
          user_id: userId,
          amount,
          transaction_type: 'earn',
          description: description || 'Points earned',
          metadata: { source: 'interview_completion' }
        }])

      return NextResponse.json({
        success: true,
        action: 'earn',
        amount,
        newBalance: data?.balance
      })
    } else if (action === 'spend') {
      // Spend points on premium features
      const { data: balance } = await supabase
        .from('user_dtc_balance')
        .select('balance')
        .eq('user_id', userId)
        .single()

      if (!balance || balance.balance < amount) {
        return NextResponse.json(
          { error: 'Insufficient balance' },
          { status: 402 }
        )
      }

      // Deduct points
      const newBalance = balance.balance - amount
      await supabase
        .from('user_dtc_balance')
        .update({
          balance: newBalance,
          lifetime_spent: supabase.from('user_dtc_balance').select('lifetime_spent')
        })
        .eq('user_id', userId)

      // Record transaction
      await supabase
        .from('dtc_transactions')
        .insert([{
          user_id: userId,
          amount: -amount,
          transaction_type: 'spend',
          description: description || 'Points spent',
          metadata: { purpose: 'premium_tips' }
        }])

      return NextResponse.json({
        success: true,
        action: 'spend',
        amount,
        newBalance
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error managing DTC points:', error)
    return NextResponse.json(
      { error: 'Failed to manage points' },
      { status: 500 }
    )
  }
}
