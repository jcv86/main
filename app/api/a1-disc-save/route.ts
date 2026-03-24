import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * API endpoint to save A1 DISC test results to Supabase
 * Expects user_id, responses, questions, and disc_profile in request body
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      user_id: string
      responses: unknown
      questions: unknown
      disc_profile: Record<string, number>
    }
    const { responses, questions, disc_profile, user_id } = body

    const supabase = await createClient()
    if (!user_id) {
      console.error('[v0] No user_id provided')
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // All Supabase operations use the authenticated client
    console.log('[v0] User ID from client:', user_id)
    console.log('[v0] DISC Profile:', disc_profile)
    
    // Ensure user exists in public users table (create if missing)
    // This handles users who logged in via client-side auth without going through email-login API
    const { error: userCheckError } = await supabase
      .from('users')
      .upsert(
        {
          id: user_id,
          email: '', // Email will be empty if user doesn't exist in public table yet
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
    
    if (userCheckError) {
      console.error('[v0] Error ensuring user in public table:', userCheckError)
      // If this fails, the insert below will also fail with FK constraint, so log it
    } else {
      console.log('[v0] User record ensured in public users table')
    }
    
    // Calculate dominant and secondary patterns from scores
    const sortedDimensions = Object.entries(disc_profile).sort((a, b) => b[1] - a[1])
    const dominant_pattern = String(sortedDimensions[0]?.[0] || 'D')
    const secondary_pattern = String(sortedDimensions[1]?.[0] || 'I')
    
    console.log('[v0] Patterns - Dominant:', dominant_pattern, 'Secondary:', secondary_pattern)
    
    // Prepare insert data
    const insertData = {
      user_id,
      responses,
      questions,
      disc_profile,
      dominant_pattern,
      secondary_pattern,
      completed_at: new Date().toISOString()
    }
    
    console.log('[v0] Inserting into a1_disc_assessment')
    
    // Insert with explicit error handling
    const { data, error } = await supabase
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
    
    console.log('[v0] Successfully saved A1 DISC assessment')
    
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
