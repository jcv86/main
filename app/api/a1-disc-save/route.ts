import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] A1 DISC Save API called')
    
    const body = await request.json()
    const { responses, questions, disc_profile } = body
    
    // Create server client with service role key for reliable insert
    const sb = createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await sb.auth.getUser()
    if (authError || !user) {
      console.error('[v0] Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('[v0] User authenticated:', user.id)
    console.log('[v0] DISC Profile:', disc_profile)
    
    // Calculate dominant and secondary patterns from scores
    const sortedDimensions = Object.entries(disc_profile).sort((a, b) => b[1] - a[1])
    const dominant_pattern = String(sortedDimensions[0]?.[0] || 'D')
    const secondary_pattern = String(sortedDimensions[1]?.[0] || 'I')
    
    console.log('[v0] Patterns - Dominant:', dominant_pattern, 'Secondary:', secondary_pattern)
    
    // Prepare insert data
    const insertData = {
      user_id: user.id,
      responses,
      questions,
      disc_profile,
      dominant_pattern,
      secondary_pattern,
      completed_at: new Date().toISOString()
    }
    
    console.log('[v0] Inserting into a1_disc_assessment:', JSON.stringify(insertData, null, 2))
    
    // Insert with explicit error handling
    const { data, error } = await sb
      .from('a1_disc_assessment')
      .insert([insertData])
      .select()
    
    if (error) {
      console.error('[v0] Supabase insert error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      return NextResponse.json(
        { error: error.message || 'Failed to save test results' },
        { status: 400 }
      )
    }
    
    console.log('[v0] Successfully saved A1 DISC assessment:', data)
    
    return NextResponse.json({
      success: true,
      data: data[0]
    })
    
  } catch (err) {
    console.error('[v0] Unexpected error in A1 DISC save:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
