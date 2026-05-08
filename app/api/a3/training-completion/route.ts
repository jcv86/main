import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

// Demo user ID for preview/development (consistent across sessions)
const DEMO_USER_ID = 'demo-user-preview-a3'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { training_id, module_name, tiempo_dedicado_minutos, competencias_desarrolladas } = body

    console.log('[v0] Training completion request received:', { training_id, module_name, tiempo_dedicado_minutos })

    // Get auth token from cookies to extract user ID
    const cookieStore = await cookies()
    const authToken = cookieStore.get('sb-auth-token')?.value || 
                     cookieStore.get('sb-token')?.value

    let userId: string = DEMO_USER_ID

    if (authToken) {
      try {
        const decoded: any = jwtDecode(authToken)
        userId = decoded.sub
        
        if (!userId) {
          throw new Error('No user ID in token')
        }
        console.log('[v0] Extracted user ID from token:', userId)
      } catch (decodeError) {
        console.log('[v0] Could not decode auth token, using demo user')
      }
    } else {
      console.log('[v0] No auth token, using demo user for development')
    }

    const supabase = await createClient()
    console.log('[v0] Processing training for user:', userId)

    // Save training assignment completion with actual elapsed time
    const { data: existingAssignment, error: searchError } = await supabase
      .from('a3_training_assignments')
      .select('id')
      .eq('user_id', userId)
      .eq('training_id', training_id)
      .maybeSingle()

    if (searchError) {
      console.error('[v0] Error searching existing training:', searchError)
    }

    let result

    if (existingAssignment) {
      // Update existing assignment
      result = await supabase
        .from('a3_training_assignments')
        .update({
          completed_at: new Date().toISOString(),
          estado: 'completed',
          tiempo_dedicado_minutos: tiempo_dedicado_minutos || 45,
        })
        .eq('id', existingAssignment.id)
        .select()
    } else {
      // Create new assignment record with completion
      result = await supabase
        .from('a3_training_assignments')
        .insert({
          user_id: userId,
          training_id: training_id,
          completed_at: new Date().toISOString(),
          started_at: new Date().toISOString(),
          estado: 'completed',
          tiempo_dedicado_minutos: tiempo_dedicado_minutos || 45,
        })
        .select()
    }

    if (result.error) {
      console.error('[v0] Error saving training completion:', result.error)
      return NextResponse.json(
        { error: 'Error saving training completion' },
        { status: 500 }
      )
    }

    // Calculate XP for this training (120 XP base)
    const xpAmount = 120

    // Check if this is first completion for XP tracking
    const { data: existingCompletion } = await supabase
      .from('a3_training_module_completions')
      .select('*')
      .eq('user_id', userId)
      .eq('training_type', module_name || training_id)
      .maybeSingle()

    let isFirstCompletion = false
    let xpAwarded = 0

    if (!existingCompletion) {
      // First completion - award XP
      isFirstCompletion = true
      xpAwarded = xpAmount

      const { error: xpError } = await supabase
        .from('a3_training_module_completions')
        .insert({
          user_id: userId,
          training_type: module_name || training_id,
          training_module_id: training_id,
          xp_amount: xpAmount,
          xp_awarded_at: new Date().toISOString(),
          is_first_completion: true,
          first_completion_at: new Date().toISOString(),
        })

      if (xpError) {
        console.error('[v0] Error saving XP completion:', xpError)
      } else {
        console.log('[v0] XP awarded for first completion:', xpAmount, 'XP for training:', module_name || training_id)
      }
    } else {
      console.log('[v0] Training already completed before, no additional XP:', module_name || training_id)
    }

    // Update user progress
    const { data: currentProgress, error: fetchError } = await supabase
      .from('a3_user_progreso')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (!currentProgress) {
      // Create new progress record
      await supabase
        .from('a3_user_progreso')
        .insert({
          user_id: userId,
          entrevistas_completadas: 0,
          competencias_desarrolladas: competencias_desarrolladas || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
    } else {
      // Update existing progress record
      const updatedCompetencias = Array.from(
        new Set([
          ...(currentProgress.competencias_desarrolladas || []),
          ...(competencias_desarrolladas || []),
        ])
      )

      await supabase
        .from('a3_user_progreso')
        .update({
          competencias_desarrolladas: updatedCompetencias,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
    }

    console.log('[v0] Training completion saved for user:', userId, 'Training:', training_id, 'Minutes:', tiempo_dedicado_minutos, 'XP:', xpAwarded, 'First:', isFirstCompletion)

    return NextResponse.json({
      success: true,
      message: isFirstCompletion 
        ? `Training completed! +${xpAwarded} XP earned!` 
        : 'Great practice! No additional XP (already completed before)',
      savedMinutes: tiempo_dedicado_minutos || 45,
      xpEarned: xpAwarded,
      isFirstCompletion,
    })
  } catch (error) {
    console.error('[v0] Error in training-completion:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
