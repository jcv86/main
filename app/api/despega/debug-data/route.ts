'use server'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated',
        message: authError?.message || 'No user found'
      }, { status: 401 })
    }

    console.log('[v0] Debug check - User:', user.id)

    // Check A1 progress
    const { data: a1Progress, error: a1Error } = await supabase
      .from('a1_progress')
      .select('*')
      .eq('user_id', user.id)
      .single()

    console.log('[v0] A1 Progress:', a1Progress, 'Error:', a1Error)

    // Check A2 missions
    const { data: a2Missions, error: a2MissionsError } = await supabase
      .from('a2_user_missions')
      .select('*')
      .eq('user_id', user.id)

    console.log('[v0] A2 Missions:', a2Missions, 'Error:', a2MissionsError)

    // Check A2 bitácora
    const { data: bitacora, error: bitacoraError } = await supabase
      .from('a2_user_bitacora')
      .select('*')
      .eq('user_id', user.id)

    console.log('[v0] Bitácora:', bitacora, 'Error:', bitacoraError)

    // Check test results
    const { data: testResults, error: testError } = await supabase
      .from('unified_test_results')
      .select('*')
      .eq('user_email', user.email)

    console.log('[v0] Test Results:', testResults, 'Error:', testError)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email
      },
      data: {
        a1: {
          progress: a1Progress,
          error: a1Error?.message
        },
        a2: {
          missions: a2Missions,
          missionsError: a2MissionsError?.message,
          bitacora: bitacora,
          bitacoraError: bitacoraError?.message
        },
        testResults: {
          results: testResults,
          error: testError?.message
        }
      }
    })
  } catch (error: any) {
    console.error('[v0] Debug endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
