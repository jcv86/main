import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET: Fetch user preferences
 * POST: Save user preferences
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('[v0] Error fetching preferences:', error)
      return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 })
    }

    // Return default preferences if not found
    return NextResponse.json(data || {
      language: 'es',
      timezone: 'America/Santiago',
      theme: 'dark',
      email_notifications: true,
    })
  } catch (error) {
    console.error('[v0] GET preferences error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as Record<string, unknown>
    console.log('[v0] POST preferences body:', body)

    const supabaseAdmin = createAdminClient()

    // Upsert user preferences
    const { data, error } = await supabaseAdmin
      .from('user_preferences')
      .upsert(
        {
          user_id: user.id,
          updated_at: new Date().toISOString(),
          ...body
        },
        { onConflict: 'user_id' }
      )
      .select()

    if (error) {
      console.error('[v0] Error saving preferences - DB error:', error)
      return NextResponse.json({ error: error.message || 'Failed to save preferences' }, { status: 500 })
    }

    console.log('[v0] Preferences saved:', data)
    return NextResponse.json(data?.[0] || { user_id: user.id })
  } catch (error) {
    console.error('[v0] POST preferences error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
  }
}
