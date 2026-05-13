import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userEmail, action, xp, multiplier } = await request.json()

    if (!userEmail || !action || !xp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get user progress
    const { data: userProgress, error: fetchError } = await supabase
      .from('user_progress')
      .select('total_xp, current_level')
      .eq('user_email', userEmail)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const actualXP = Math.round(xp * (multiplier || 1))
    const newTotalXP = (userProgress?.total_xp || 0) + actualXP
    const newLevel = Math.floor(newTotalXP / 1000) + 1
    const levelUp = newLevel > (userProgress?.current_level || 1)

    // Update user progress
    const { error: updateError } = await supabase
      .from('user_progress')
      .update({
        total_xp: newTotalXP,
        current_level: newLevel,
        last_activity: new Date().toISOString(),
      })
      .eq('user_email', userEmail)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
    }

    // Log XP gain for analytics
    await supabase
      .from('xp_logs')
      .insert({
        user_email: userEmail,
        action,
        xp_gained: actualXP,
        multiplier: multiplier || 1,
        timestamp: new Date().toISOString(),
      })

    return NextResponse.json({
      success: true,
      xp_gained: actualXP,
      multiplier: multiplier || 1,
      total_xp: newTotalXP,
      current_level: newLevel,
      level_up: levelUp,
      new_level: levelUp ? newLevel : null
    })
  } catch (error) {
    console.error('[v0] Error in XP gain:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
