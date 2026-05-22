import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Supabase only if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      packageId,
      dtcAmount,
      price
    } = await request.json()

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    if (!userId || !packageId || !dtcAmount || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In production, this would integrate with Stripe
    // For now, simulate a successful purchase
    const transactionId = `stripe_${Date.now()}`

    // Record purchase
    const { data: purchase, error: purchaseError } = await supabase
      .from('dtc_purchases')
      .insert([{
        user_id: userId,
        stripe_transaction_id: transactionId,
        amount_usd: price,
        dtc_amount_purchased: dtcAmount,
        status: 'completed'
      }])
      .select()

    if (purchaseError) throw purchaseError

    // Get or create DTC balance
    const { data: balance } = await supabase
      .from('user_dtc_balance')
      .select('*')
      .eq('user_id', userId)
      .single()

    let newBalance: number

    if (balance) {
      // Update existing balance
      const updatedBalance = balance.balance + dtcAmount
      await supabase
        .from('user_dtc_balance')
        .update({
          balance: updatedBalance,
          lifetime_earned: balance.lifetime_earned + dtcAmount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      newBalance = updatedBalance
    } else {
      // Create new balance
      await supabase
        .from('user_dtc_balance')
        .insert([{
          user_id: userId,
          balance: dtcAmount,
          lifetime_earned: dtcAmount
        }])

      newBalance = dtcAmount
    }

    // Record transaction
    await supabase
      .from('dtc_transactions')
      .insert([{
        user_id: userId,
        amount: dtcAmount,
        transaction_type: 'purchase',
        description: `Purchased ${packageId} package`,
        related_to: 'stripe_purchase',
        related_id: purchase?.[0]?.id,
        metadata: {
          stripe_transaction_id: transactionId,
          package_id: packageId,
          price_usd: price
        }
      }])

    return NextResponse.json({
      success: true,
      transactionId,
      dtcAmount,
      newBalance,
      purchase: purchase?.[0]
    })
  } catch (error) {
    console.error('Error processing DTC purchase:', error)
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    )
  }
}
