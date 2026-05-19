import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration')
  }

  return createClient(supabaseUrl, supabaseKey)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    
    const body = await request.json()
    const {
      moduleId,
      moduleName,
      moduleNumber,
      trainingType,
      responses,
      careerMirrorCard,
      userId
    } = body

    // Validate required fields
    if (!moduleId || !moduleNumber || !trainingType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get current user ID from auth if not provided
    const authHeader = request.headers.get('authorization')
    let currentUserId = userId

    if (!currentUserId && authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7)
        const {
          data: { user },
          error: authError
        } = await supabase.auth.getUser(token)

        if (authError || !user) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          )
        }
        currentUserId = user.id
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        )
      }
    }

    if (!currentUserId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      )
    }

    // 1. Record session attempt in a3_session_attempts
    const { data: sessionData, error: sessionError } = await supabase
      .from('a3_session_attempts')
      .insert([
        {
          user_id: currentUserId,
          module_id: moduleId,
          module_number: moduleNumber,
          session_type: trainingType === 'coach' ? 'coach_training' : 'interviewer_simulation',
          lead_character: 'coach',
          difficulty: 'adaptive',
          is_route_checkpoint: true,
          status: 'completed',
          progress: 100,
          score: 100, // Module 1 is pass/fail - 100 for completion
          transcript: JSON.stringify({
            q1_career_direction: responses[0] || '',
            q2_professional_identity: responses[1] || '',
            q3_core_values: responses[2] || '',
            q4_personal_brand: responses[3] || ''
          }),
          deliverable: careerMirrorCard || {},
          session_completed_at: new Date().toISOString()
        }
      ])
      .select()

    if (sessionError) {
      console.error('[v0] Session recording error:', sessionError)
      return NextResponse.json(
        { error: 'Failed to record session' },
        { status: 500 }
      )
    }

    // 2. Record module completion in a3_module_completion
    const { data: completionData, error: completionError } = await supabase
      .from('a3_module_completion')
      .upsert(
        [
          {
            user_id: currentUserId,
            module_id: moduleId,
            module_number: moduleNumber,
            completed_at: new Date().toISOString(),
            best_score: 100,
            deliverable: careerMirrorCard || {}
          }
        ],
        { onConflict: 'user_id,module_id' }
      )
      .select()

    if (completionError) {
      console.error('[v0] Completion recording error:', completionError)
      return NextResponse.json(
        { error: 'Failed to record completion' },
        { status: 500 }
      )
    }

    // 3. Update a3_route_progression
    // First get current progression
    const { data: currentProgress, error: getProgressError } = await supabase
      .from('a3_route_progression')
      .select('*')
      .eq('user_id', currentUserId)
      .single()

    if (getProgressError && getProgressError.code !== 'PGRST116') {
      console.error('[v0] Error fetching progress:', getProgressError)
      return NextResponse.json(
        { error: 'Failed to fetch progress' },
        { status: 500 }
      )
    }

    // Calculate next module
    const nextModuleNumber = moduleNumber < 10 ? moduleNumber + 1 : 10
    const totalCompleted = (currentProgress?.total_completed || 0) + 1

    // Determine unlock dates
    const updates: any = {
      user_id: currentUserId,
      current_module_number: nextModuleNumber,
      total_completed: totalCompleted,
      updated_at: new Date().toISOString()
    }

    // First time unlocking modules 7-10, set unlock flags
    if (moduleNumber === 6 && !currentProgress?.can_replay_modules_7_10) {
      updates.can_replay_modules_7_10 = true
      updates.advanced_unlocked_at = new Date().toISOString()
    }

    if (moduleNumber === 10) {
      updates.pro_unlocked_at = new Date().toISOString()
      updates.route_completed_at = new Date().toISOString()
    }

    const { data: progressData, error: progressError } = await supabase
      .from('a3_route_progression')
      .upsert(updates, { onConflict: 'user_id' })
      .select()

    if (progressError) {
      console.error('[v0] Progress update error:', progressError)
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      )
    }

    // 4. Award XP (80 for each module completion)
    const xpAwarded = 80

    // Return success with data
    return NextResponse.json({
      success: true,
      moduleId,
      moduleName,
      moduleNumber,
      xpAwarded,
      nextModule: nextModuleNumber,
      session: sessionData?.[0],
      completion: completionData?.[0],
      progress: progressData?.[0]
    })

  } catch (error) {
    console.error('[v0] Module completion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
