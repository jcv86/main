import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { training_id, module_name, tiempo_dedicado_minutos, competencias_desarrolladas } = body

    console.log('[v0] Training completion request received:', { training_id, module_name, tiempo_dedicado_minutos })

    // Get auth token from cookies to extract user ID
    const cookieStore = await cookies()
    const authToken = cookieStore.get('sb-auth-token')?.value || 
                     cookieStore.get('sb-token')?.value

    if (!authToken) {
      console.warn('[v0] No auth token found in cookies for training-completion')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Extract user ID from JWT token
    let userId: string
    try {
      const decoded: any = jwtDecode(authToken)
      userId = decoded.sub
      
      if (!userId) {
        throw new Error('No user ID in token')
      }
      console.log('[v0] Extracted user ID from token:', userId)
    } catch (decodeError) {
      console.error('[v0] Error decoding auth token:', decodeError)
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      )
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

    console.log('[v0] Training completion saved for user:', userId, 'Training:', training_id, 'Minutes:', tiempo_dedicado_minutos)

    return NextResponse.json({
      success: true,
      message: 'Training completion saved successfully',
      savedMinutes: tiempo_dedicado_minutos || 45,
    })
  } catch (error) {
    console.error('[v0] Error in training-completion:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
