import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { levelCompleted } = body

    // Update user profile with completed level
    // This will create the column if it doesn't exist via upsert
    const { data, error } = await supabase
      .from('despega_user_profiles')
      .upsert(
        {
          user_id: user.id,
          a3_entrenamiento_nivel_completado: levelCompleted,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating training progress:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('[v0] API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's current training level
    const { data: userProfile, error } = await supabase
      .from('despega_user_profiles')
      .select('a3_entrenamiento_nivel_completado')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('[v0] Error fetching training progress:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const completedLevel = userProfile?.a3_entrenamiento_nivel_completado || 0
    const unlockedLevel = Math.min(completedLevel + 1, 4)

    return NextResponse.json({ completedLevel, unlockedLevel })
  } catch (err) {
    console.error('[v0] API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
