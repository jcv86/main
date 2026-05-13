import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { moduleId, moduleName, trainingType } = body

    console.log('[v0] Module completion request:', {
      moduleId,
      moduleName,
      trainingType
    })

    // Get auth token from cookies
    const cookieStore = await cookies()
    const authToken =
      cookieStore.get('sb-auth-token')?.value || cookieStore.get('sb-token')?.value

    if (!authToken) {
      console.warn('[v0] No auth token found for module-completion')
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Extract user ID from JWT
    let userId: string
    try {
      const decoded: any = jwtDecode(authToken)
      userId = decoded.sub
      if (!userId) {
        throw new Error('No user ID in token')
      }
    } catch (decodeError) {
      console.error('[v0] Error decoding auth token:', decodeError)
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 })
    }

    const supabase = await createClient()

    // Check if this module has already been completed
    const { data: existingCompletion } = await supabase
      .from('a3_training_module_completions')
      .select('*')
      .eq('user_id', userId)
      .eq('training_module_id', moduleId)
      .maybeSingle()

    let isFirstCompletion = false
    let xpAwarded = 0

    if (!existingCompletion) {
      isFirstCompletion = true
      xpAwarded = 100  // Default XP for module completion

      // Record the first completion
      const { error: completionError } = await supabase
        .from('a3_training_module_completions')
        .insert({
          user_id: userId,
          training_type: trainingType,
          training_module_id: moduleId,
          xp_amount: xpAwarded,
          xp_awarded_at: new Date().toISOString(),
          is_first_completion: true,
          first_completion_at: new Date().toISOString(),
        })

      if (completionError) {
        console.error('[v0] Error recording completion:', completionError)
      } else {
        console.log('[v0] Completion recorded for:', moduleId)
      }

      // Update gamification profile with XP
      const { data: gamProfile } = await supabase
        .from('user_gamification_profile')
        .select('total_xp, current_xp')
        .eq('user_id', userId)
        .maybeSingle()

      if (gamProfile) {
        await supabase
          .from('user_gamification_profile')
          .update({
            total_xp: (gamProfile.total_xp || 0) + xpAwarded,
            current_xp: (gamProfile.current_xp || 0) + xpAwarded,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
      } else {
        await supabase.from('user_gamification_profile').insert({
          user_id: userId,
          total_xp: xpAwarded,
          current_xp: xpAwarded,
          current_level: 'Bronze',
        })
      }
    } else {
      console.log('[v0] Module already completed, no XP awarded:', moduleId)
    }

    return NextResponse.json({
      success: true,
      isFirstCompletion,
      xpAwarded,
      message: isFirstCompletion
        ? `+${xpAwarded} XP ganados`
        : 'Módulo completado (sin XP adicionales)',
    })
  } catch (error) {
    console.error('[v0] Error in module-completion:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
