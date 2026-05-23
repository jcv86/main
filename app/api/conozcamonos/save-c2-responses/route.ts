import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      user_id: string
      responses: Record<number, any>
    }

    const { user_id, responses } = body

    if (!user_id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Validate that A1 was completed first
    const { data: a1Data } = await supabase
      .from('a1_cerebral_assessment')
      .select('id')
      .eq('user_id', user_id)
      .limit(1)
      .single()

    if (!a1Data) {
      return NextResponse.json({ 
        error: 'A1: Despega Cerebral debe completarse antes de C2' 
      }, { status: 400 })
    }

    // Save C2 responses
    const { data, error } = await supabase
      .from('conozcamonos_2_responses')
      .upsert({
        user_id,
        responses,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })

    if (error) {
      console.error('[v0] Error saving C2 responses:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[v0] C2 responses saved for user:', user_id)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[v0] Exception in save-c2-responses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
