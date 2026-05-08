import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

const STARTER_XP = 100

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('sb-auth-token')?.value || 
                     cookieStore.get('sb-token')?.value

    if (!authToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    let userId: string
    try {
      const decoded: any = jwtDecode(authToken)
      userId = decoded.sub
      if (!userId) throw new Error('No user ID in token')
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Check if user already has starter XP
    const { data: existing } = await supabase
      .from('a3_training_module_completions')
      .select('*')
      .eq('user_id', userId)
      .eq('training_type', 'STARTER_XP')
      .maybeSingle()

    if (existing) {
      return NextResponse.json({
        success: false,
        message: 'Starter XP already awarded',
        alreadyAwarded: true,
      })
    }

    // Award starter XP
    const { error: insertError } = await supabase
      .from('a3_training_module_completions')
      .insert({
        user_id: userId,
        training_type: 'STARTER_XP',
        training_module_id: 'starter-welcome',
        xp_amount: STARTER_XP,
        xp_awarded_at: new Date().toISOString(),
        is_first_completion: true,
        first_completion_at: new Date().toISOString(),
      })

    if (insertError) {
      console.error('[v0] Error awarding starter XP:', insertError)
      return NextResponse.json(
        { error: 'Error awarding starter XP' },
        { status: 500 }
      )
    }

    console.log('[v0] Starter XP awarded to user:', userId, '- Amount:', STARTER_XP)

    return NextResponse.json({
      success: true,
      message: 'Welcome! You received 100 XP to get started!',
      xpAwarded: STARTER_XP,
      alreadyAwarded: false,
    })
  } catch (error) {
    console.error('[v0] Error in starter-xp:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
