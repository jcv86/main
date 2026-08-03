import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import {
  getA2ProgressSnapshot,
  resolveA2Route,
  type A2Horizon,
} from '@/lib/a2/server-progress'
import { nextA2Horizon } from '@/lib/a2/horizon'

interface ExtendHorizonBody {
  targetHorizon?: unknown
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function validHorizon(value: unknown): A2Horizon | null {
  const numeric = Number(value)
  return numeric === 30 || numeric === 60 || numeric === 90
    ? numeric
    : null
}

export async function POST(request: Request) {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    let body: ExtendHorizonBody
    try {
      body = (await request.json()) as ExtendHorizonBody
    } catch {
      return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
    }

    const targetHorizon = validHorizon(body.targetHorizon)
    if (!targetHorizon || targetHorizon === 30) {
      return NextResponse.json(
        { error: 'La extensión debe ser a 60 o 90 días.' },
        { status: 400 },
      )
    }

    const userId = currentUser.id
    const supabase = createAdminClient()
    const now = new Date().toISOString()
    const snapshot = await getA2ProgressSnapshot(userId, supabase)
    const expectedTarget = nextA2Horizon(snapshot.activeHorizon)

    if (!expectedTarget || targetHorizon !== expectedTarget) {
      return NextResponse.json(
        {
          error: `Tu horizonte actual es de ${snapshot.activeHorizon} días. La siguiente extensión válida es ${expectedTarget || 'ninguna'}.`,
          activeHorizon: snapshot.activeHorizon,
          expectedTarget,
        },
        { status: 409 },
      )
    }

    const { data: boundaryCompletion, error: boundaryError } = await supabase
      .from('a2_user_task_completions')
      .select('id, completed_at')
      .eq('user_id', userId)
      .eq('day', snapshot.activeHorizon)
      .not('completed_at', 'is', null)
      .limit(1)
      .maybeSingle()

    if (boundaryError) {
      console.error('[v0] Error checking A2 horizon boundary:', boundaryError)
      return NextResponse.json(
        { error: 'No pudimos verificar el cierre del ciclo actual.' },
        { status: 500 },
      )
    }

    if (!boundaryCompletion?.completed_at) {
      return NextResponse.json(
        {
          error: `Completa el Día ${snapshot.activeHorizon} antes de extender Tu Ruta.`,
          boundaryDay: snapshot.activeHorizon,
        },
        { status: 409 },
      )
    }

    const { data: journey, error: journeyError } = await supabase
      .from('despega_journey_state')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (journeyError) {
      console.error('[v0] Error reading journey for horizon extension:', journeyError)
      return NextResponse.json(
        { error: 'No pudimos leer tu recorrido actual.' },
        { status: 500 },
      )
    }

    const metadata = objectValue(journey?.metadata)
    const history = Array.isArray(metadata.a2_extension_history)
      ? metadata.a2_extension_history
      : []
    const firstDay = snapshot.activeHorizon + 1
    const highestUnlockedDay = Math.max(
      firstDay,
      Math.min(targetHorizon, snapshot.highestUnlockedDay),
    )
    const journeyPayload = {
      user_id: userId,
      current_module: journey?.current_module || 'A2',
      current_a2_day: firstDay,
      highest_a2_day_unlocked: highestUnlockedDay,
      a1_completed_at: journey?.a1_completed_at || null,
      a2_started_at: journey?.a2_started_at || now,
      a2_completed_at: journey?.a2_completed_at || null,
      a3_unlocked_at: journey?.a3_unlocked_at || null,
      a4_unlocked_at: journey?.a4_unlocked_at || null,
      version: (journey?.version || 0) + 1,
      metadata: {
        ...metadata,
        a2_horizon: targetHorizon,
        a2_extension_required: false,
        a2_next_horizon: null,
        a2_extension_history: [
          ...history,
          {
            from: snapshot.activeHorizon,
            to: targetHorizon,
            extended_at: now,
          },
        ],
      },
      updated_at: now,
      created_at: journey?.created_at || now,
    }

    const { error: updateError } = await supabase
      .from('despega_journey_state')
      .upsert(journeyPayload, { onConflict: 'user_id' })

    if (updateError) {
      console.error('[v0] Error extending A2 horizon:', updateError)
      return NextResponse.json(
        { error: 'No pudimos extender Tu Ruta.' },
        { status: 500 },
      )
    }

    const route = await resolveA2Route(userId, supabase)
    if (route) {
      const { data: routeProgress } = await supabase
        .from('a2_user_route_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('route_id', route.id)
        .maybeSingle()

      if (routeProgress?.id) {
        const { error: routeProgressError } = await supabase
          .from('a2_user_route_progress')
          .update({
            dia_actual: firstDay,
            estado: 'activo',
            updated_at: now,
          })
          .eq('id', routeProgress.id)

        if (routeProgressError) {
          console.error(
            '[v0] Error syncing route horizon extension:',
            routeProgressError,
          )
        }
      }
    }

    return NextResponse.json({
      success: true,
      previousHorizon: snapshot.activeHorizon,
      activeHorizon: targetHorizon,
      currentDay: firstDay,
      highestUnlockedDay,
      nextPath: `/despega/a2/dia-${firstDay}`,
    })
  } catch (error) {
    console.error('[v0] A2 extend-horizon error:', error)
    return NextResponse.json(
      { error: 'No pudimos extender Tu Ruta.' },
      { status: 500 },
    )
  }
}
