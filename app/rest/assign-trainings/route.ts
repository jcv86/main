import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/despega/assign-trainings
 * Asigna entrenamientos automáticamente basados en el tema del sprint A2
 * Se llama después de que el usuario completa el onboarding y elige su misión
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, a2_theme, a2_mission_id } = body

    if (!user_id || !a2_theme) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, a2_theme' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
      )
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Handle error
          }
        },
      },
    })

    console.log(`[v0] Assigning trainings for user ${user_id} with theme: ${a2_theme}`)

    // Get available trainings for this theme
    const { data: availableTrainings, error: trainingsError } = await supabase
      .from('a3_entrenamientos')
      .select('*')
      .ilike('tema', `%${a2_theme}%`)
      .limit(5)

    if (trainingsError || !availableTrainings) {
      console.error('[v0] Error fetching trainings:', trainingsError)
      return NextResponse.json(
        { error: 'Error fetching trainings' },
        { status: 500 }
      )
    }

    // Create assignments for user
    const assignments = availableTrainings.map((training: any) => ({
      user_id,
      training_id: training.id,
      a2_mission_id,
      tema: a2_theme,
      estado: 'assigned',
      asignado_en: new Date().toISOString(),
    }))

    const { data: createdAssignments, error: insertError } = await supabase
      .from('a3_training_assignments')
      .insert(assignments)
      .select()

    if (insertError) {
      console.error('[v0] Error creating assignments:', insertError)
      return NextResponse.json(
        { error: 'Error creating assignments' },
        { status: 500 }
      )
    }

    console.log(`[v0] Assigned ${createdAssignments?.length || 0} trainings to user ${user_id}`)

    return NextResponse.json({
      success: true,
      assignments_count: createdAssignments?.length || 0,
      trainings: availableTrainings.slice(0, 3),
    })
  } catch (error) {
    console.error('[v0] Error in assign-trainings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
