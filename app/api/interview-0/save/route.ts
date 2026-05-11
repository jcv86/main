import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check session first
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      console.warn('[v0] API interview-0/save: No active session found - allowing demo mode')
      // Allow demo mode for preview - just return success without saving
      const body = await request.json()
      return NextResponse.json(
        { 
          success: true, 
          message: 'Demo mode - data not persisted',
          data: body 
        },
        { status: 200 }
      )
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.warn('[v0] API interview-0/save: No user authenticated - allowing demo mode')
      // Allow demo mode for preview
      const body = await request.json()
      return NextResponse.json(
        { 
          success: true, 
          message: 'Demo mode - data not persisted',
          data: body 
        },
        { status: 200 }
      )
    }

    const body = await request.json()
    console.log('[v0] API interview-0/save: Received request body:', {
      hasEnvironment: !!body.environment_check,
      hasPresence: !!body.presence_check,
      hasAudio: !!body.audio_check,
      hasPreparation: !!body.preparation_check,
      status: body.interview_0_status,
      bodyKeys: Object.keys(body)
    })
    
    const { error, data } = await supabase
      .from('a3_entrevista_0')
      .upsert({
        user_id: user.id,
        conditions_reviewed: {
          environment: body.environment_check ?? null,
          presence: body.presence_check ?? null,
          audio: body.audio_check ?? null,
          preparation: body.preparation_check ?? null
        },
        interview_0_completed: body.interview_0_completed ?? null,
        interview_0_score: body.interview_0_score ?? null,
        interview_0_status: body.interview_0_status ?? 'in_progress',
        environment_check: body.environment_check ?? null,
        presence_check: body.presence_check ?? null,
        audio_check: body.audio_check ?? null,
        preparation_check: body.preparation_check ?? null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()

    if (error) {
      console.error('[v0] API interview-0/save: Database error', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      // Return the actual database error for debugging
      return NextResponse.json(
        { 
          error: error.message || 'Database error',
          code: error.code,
          details: error.details
        },
        { status: 500 }
      )
    }

    // If interview-0 is completed, award XP and update module state
    if (body.interview_0_completed) {
      console.log('[v0] API interview-0/save: Interview completed, awarding XP and unlocking next module')
      
      // Award 70 XP for completing Auditoría Inicial
      const { error: xpError } = await supabase
        .from('user_xp_history')
        .insert({
          user_id: user.id,
          xp_earned: 70,
          reason: 'Completó Auditoría Inicial (Entrevista 0)',
          module_id: 'auditoria-inicial',
          created_at: new Date().toISOString()
        })

      if (xpError) {
        console.warn('[v0] Failed to award XP:', xpError.message)
      } else {
        console.log('[v0] XP awarded: 70 points')
      }

      // Update user module progress to mark Auditoría Inicial as completed
      const { error: progressError } = await supabase
        .from('a3_progress')
        .upsert({
          user_id: user.id,
          module_id: 'auditoria-inicial',
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,module_id'
        })

      if (progressError) {
        console.warn('[v0] Failed to update module progress:', progressError.message)
      } else {
        console.log('[v0] Module progress updated: auditoria-inicial marked as completed')
      }
    }
    
    console.log('[v0] API interview-0/save: Saved successfully for user', user.id.substring(0, 8))
    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error('[v0] API interview-0/save failed:', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save' },
      { status: 500 }
    )
  }
}
