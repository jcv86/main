import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check session first
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      console.warn('[v0] API interview-0/get: No active session found - returning null for demo mode')
      // Return null for demo mode instead of 401
      return NextResponse.json(null, { status: 404 })
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      // Return null for demo mode
      return NextResponse.json(null, { status: 404 })
    }

    const { data, error } = await supabase
      .from('a3_entrevista_0')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    
    if (!data) {
      return NextResponse.json(null, { status: 404 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('[v0] API interview-0/get failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get' },
      { status: 500 }
    )
  }
}
