export type A2Horizon = 30 | 60 | 90

export interface A2ProgressSnapshot {
  currentDay: number
  highestUnlockedDay: number
  activeHorizon: A2Horizon
  source: 'journey' | 'route' | 'default'
}

export interface A2ProgressReconciliationInput {
  currentDay: number | null
  highestUnlockedDay: number | null
  activeHorizon: A2Horizon
  completedDays: number[]
}

export interface A2ResolvedRoute {
  id: string
  code: string
  name: string
  description: string | null
  durationDays: number
  source: 'progress' | 'recommendation'
}

function validDay(value: unknown): number | null {
  const day = Number(value)
  return Number.isInteger(day) && day >= 1 && day <= 90 ? day : null
}

/**
 * Reconciles canonical journey state with persisted completions. Historical
 * users may have valid sequential completions that predate journey-state
 * tracking; those records must advance the next available day without letting
 * a sparse or forged completion skip gaps in the route.
 */
export function reconcileA2Progress({
  currentDay,
  highestUnlockedDay,
  activeHorizon,
  completedDays,
}: A2ProgressReconciliationInput): Pick<
  A2ProgressSnapshot,
  'currentDay' | 'highestUnlockedDay'
> {
  const completed = new Set(
    completedDays.filter(
      (day) => Number.isInteger(day) && day >= 1 && day <= activeHorizon,
    ),
  )
  let contiguousCompletedDay = 0
  while (completed.has(contiguousCompletedDay + 1)) {
    contiguousCompletedDay += 1
  }

  const nextFromCompletions = Math.min(
    activeHorizon,
    contiguousCompletedDay + 1,
  )
  const reconciledHighest = Math.min(activeHorizon,
    Math.max(highestUnlockedDay ?? currentDay ?? 1, nextFromCompletions),
  )
  const reconciledCurrent = Math.min(
    reconciledHighest,
    Math.max(currentDay ?? 1, nextFromCompletions),
  )

  return {
    currentDay: reconciledCurrent,
    highestUnlockedDay: reconciledHighest,
  }
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function explicitHorizon(metadata: unknown): A2Horizon | null {
  const value = Number(objectValue(metadata).a2_horizon)
  return value === 30 || value === 60 || value === 90 ? value : null
}

export function inferA2Horizon(
  metadata: unknown,
  highestUnlockedDay: number | null,
): A2Horizon {
  const configured = explicitHorizon(metadata)
  if (configured) return configured

  // Grandfather existing routes that had already advanced before explicit
  // extension decisions were introduced.
  if ((highestUnlockedDay || 1) > 60) return 90
  if ((highestUnlockedDay || 1) > 30) return 60
  return 30
}

function normalizeRoute(route: any, source: A2ResolvedRoute['source']): A2ResolvedRoute {
  return {
    id: route.id,
    code: route.codigo || 'RUTA_DTC',
    name: route.nombre || 'Tu Ruta DTC',
    description: route.descripcion || null,
    durationDays: Number(route.duracion_dias) || 90,
    source,
  }
}

/**
 * Keeps an already persisted A2 route for historical continuity. A1 preferences
 * do not assign a new career route. Without a saved route, callers use the
 * canonical mission catalog and its neutral adaptation; no route row is created.
 * A read failure is not evidence that a saved route is absent.
 */
export async function resolveA2Route(
  userId: string,
  supabase: any,
): Promise<A2ResolvedRoute | null> {
  const { data: existingProgress, error: progressError } = await supabase
    .from('a2_user_route_progress')
    .select('route_id')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (progressError) {
    throw new Error('No pudimos recuperar el avance guardado de A2.')
  }

  if (existingProgress?.route_id) {
    const { data: route, error: routeError } = await supabase
      .from('a2_learning_routes')
      .select('id, codigo, nombre, descripcion, duracion_dias')
      .eq('id', existingProgress.route_id)
      .maybeSingle()

    if (routeError) throw new Error('No pudimos recuperar la ruta guardada de A2.')
    if (route) return normalizeRoute(route, 'progress')
  }

  // Keep a recommendation that was already stored for this owner. Its historic
  // match score is only retained in the existing ordering, never presented as a
  // new assessment or used to infer a different personal/professional path.
  const { data: recommendation, error: recommendationError } = await supabase
    .from('a2_route_recommendations')
    .select('route_id')
    .eq('user_id', userId)
    .order('score_match', { ascending: false })
    .order('generado_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (recommendationError) {
    throw new Error('No pudimos recuperar la recomendación guardada de A2.')
  }

  if (recommendation?.route_id) {
    const { data: route, error: routeError } = await supabase
      .from('a2_learning_routes')
      .select('id, codigo, nombre, descripcion, duracion_dias')
      .eq('id', recommendation.route_id)
      .eq('activo', true)
      .maybeSingle()

    if (routeError) throw new Error('No pudimos recuperar la ruta guardada de A2.')
    if (route) return normalizeRoute(route, 'recommendation')
  }

  return null
}

/**
 * Reads A2 progress from the canonical journey state, with the legacy route
 * progress table as a compatibility fallback. New users always start with a
 * 30-day horizon; 60 and 90 require explicit extension decisions.
 * Only successful reads with missing rows can fall back. A failed read must not
 * turn an existing journey into day one when a caller later persists progress.
 */
export async function getA2ProgressSnapshot(
  userId: string,
  supabase: any,
): Promise<A2ProgressSnapshot> {
  const [journeyResult, completionsResult] = await Promise.all([
    supabase
      .from('despega_journey_state')
      .select('current_a2_day, highest_a2_day_unlocked, metadata')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('a2_user_task_completions')
      .select('day')
      .eq('user_id', userId)
      .not('completed_at', 'is', null),
  ])
  const { data: journey, error: journeyError } = journeyResult
  const { data: completionRows, error: completionsError } = completionsResult

  if (journeyError) {
    throw new Error('No pudimos recuperar el estado de Tu Ruta.')
  }
  if (completionsError) {
    throw new Error('No pudimos recuperar las actividades guardadas de Tu Ruta.')
  }

  const completedDays = (completionRows || [])
    .map((row: { day?: unknown }) => Number(row.day))
    .filter((day: number) => Number.isInteger(day) && day >= 1 && day <= 90)
  const highestCompletedDay = completedDays.length
    ? Math.max(...completedDays)
    : null

  const journeyCurrent = validDay(journey?.current_a2_day)
  const journeyHighest = validDay(journey?.highest_a2_day_unlocked)
  if (journeyCurrent || journeyHighest) {
    const activeHorizon = inferA2Horizon(
      journey?.metadata,
      Math.max(journeyHighest ?? 1, highestCompletedDay ?? 1),
    )
    const reconciled = reconcileA2Progress({
      currentDay: journeyCurrent,
      highestUnlockedDay: journeyHighest,
      activeHorizon,
      completedDays,
    })

    return {
      ...reconciled,
      activeHorizon,
      source: 'journey',
    }
  }

  const { data: routeProgress, error: routeError } = await supabase
    .from('a2_user_route_progress')
    .select('dia_actual')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (routeError) {
    throw new Error('No pudimos recuperar el avance histórico de Tu Ruta.')
  }

  const routeDay = validDay(routeProgress?.dia_actual)
  if (routeDay) {
    const activeHorizon = inferA2Horizon(
      null,
      Math.max(routeDay, highestCompletedDay ?? 1),
    )
    const reconciled = reconcileA2Progress({
      currentDay: routeDay,
      highestUnlockedDay: routeDay,
      activeHorizon,
      completedDays,
    })
    return {
      ...reconciled,
      activeHorizon,
      source: 'route',
    }
  }

  const activeHorizon = inferA2Horizon(null, highestCompletedDay)
  return {
    ...reconcileA2Progress({
      currentDay: null,
      highestUnlockedDay: null,
      activeHorizon,
      completedDays,
    }),
    activeHorizon,
    source: 'default',
  }
}
