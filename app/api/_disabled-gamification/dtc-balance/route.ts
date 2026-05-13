import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Supabase only if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // Return default if Supabase not configured
    if (!supabase) {
      return NextResponse.json({
        balance: 0,
        lifetime_earned: 0,
        lifetime_spent: 0,
        current_xp: 0,
        total_xp: 0,
      })
    }

    // Get or create DTC balance
    let { data: balance } = await supabase
      .from('user_dtc_balance')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!balance) {
      const { data: newBalance, error: insertError } = await supabase
        .from('user_dtc_balance')
        .insert([{ user_id: userId, balance: 0, lifetime_earned: 0, lifetime_spent: 0 }])
        .select()
        .single()
      
      if (insertError) {
        console.error('[v0] Error creating DTC balance:', insertError)
        return NextResponse.json(
          { success: true, balance: 0, lifetime_earned: 0, lifetime_spent: 0 },
          { status: 200 }
        )
      }
      balance = newBalance
    }

    return NextResponse.json({
      success: true,
      balance: balance?.balance || 0,
      lifetime_earned: balance?.lifetime_earned || 0,
      lifetime_spent: balance?.lifetime_spent || 0
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
      // Get current balance first
      const { data: currentBalance } = await supabase
        .from('user_dtc_balance')
        .select('balance, lifetime_earned')
        .eq('user_id', userId)
        .single()

      if (!currentBalance) {
        return NextResponse.json(
          { error: 'User balance not found' },
          { status: 404 }
        )
      }

      // Update balance with correct calculations
      const newBalance = currentBalance.balance + amount
      const newLifetimeEarned = currentBalance.lifetime_earned + amount

      const { data: updatedBalance } = await supabase
        .from('user_dtc_balance')
        .update({
          balance: newBalance,
          lifetime_earned: newLifetimeEarned,
          updated_at: new Date().toISOString()
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
        newBalance: updatedBalance?.balance
      })
    } else if (action === 'spend') {
      // Spend points on premium features
      const { data: balance } = await supabase
        .from('user_dtc_balance')
        .select('balance, lifetime_spent')
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
      const newLifetimeSpent = balance.lifetime_spent + amount

      const { data: updatedBalance } = await supabase
        .from('user_dtc_balance')
        .update({
          balance: newBalance,
          lifetime_spent: newLifetimeSpent,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

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
        newBalance: updatedBalance?.balance
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
