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
  source: 'progress' | 'recommendation' | 'profile' | 'fallback'
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

function routeCodeForProfile(profileType: string | null, resultText: string | null): string {
  const profile = `${profileType || ''} ${resultText || ''}`.toLowerCase()

  if (
    profile.includes('d-i') ||
    profile.includes('dominante') ||
    profile.includes('estratég') ||
    profile.includes('estrateg') ||
    profile.includes('lider')
  ) {
    return 'LIDER_EJ'
  }

  if (profile.includes('técnic') || profile.includes('tecnic') || /^c(?:\W|$)/.test(profile)) {
    return 'TECH_ESP'
  }

  if (
    profile.includes('creativ') ||
    profile.includes('emprend') ||
    /^i(?:\W|$)/.test(profile)
  ) {
    return 'EMPREND'
  }

  return 'COLAB_EX'
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
 * Resolves the user's active A2 route without trusting a client-provided route.
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
    console.error('[v0] Error reading existing A2 route:', progressError)
  }

  if (existingProgress?.route_id) {
    const { data: route } = await supabase
      .from('a2_learning_routes')
      .select('id, codigo, nombre, descripcion, duracion_dias')
      .eq('id', existingProgress.route_id)
      .maybeSingle()

    if (route) return normalizeRoute(route, 'progress')
  }

  const { data: recommendation, error: recommendationError } = await supabase
    .from('a2_route_recommendations')
    .select('route_id')
    .eq('user_id', userId)
    .order('score_match', { ascending: false })
    .order('generado_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (recommendationError) {
    console.error('[v0] Error reading A2 recommendation:', recommendationError)
  }

  if (recommendation?.route_id) {
    const { data: route } = await supabase
      .from('a2_learning_routes')
      .select('id, codigo, nombre, descripcion, duracion_dias')
      .eq('id', recommendation.route_id)
      .eq('activo', true)
      .maybeSingle()

    if (route) return normalizeRoute(route, 'recommendation')
  }

  const { data: profile, error: profileError } = await supabase
    .from('a1_tests_results')
    .select('profile_type, resultado_texto')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (profileError) {
    console.error('[v0] Error reading A1 profile for route selection:', profileError)
  }

  const routeCode = routeCodeForProfile(
    profile?.profile_type || null,
    profile?.resultado_texto || null,
  )
  const { data: profileRoute } = await supabase
    .from('a2_learning_routes')
    .select('id, codigo, nombre, descripcion, duracion_dias')
    .eq('codigo', routeCode)
    .eq('activo', true)
    .maybeSingle()

  if (profileRoute) return normalizeRoute(profileRoute, 'profile')

  const { data: fallbackRoute, error: fallbackError } = await supabase
    .from('a2_learning_routes')
    .select('id, codigo, nombre, descripcion, duracion_dias')
    .eq('activo', true)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (fallbackError) {
    console.error('[v0] Error reading fallback A2 route:', fallbackError)
  }

  return fallbackRoute ? normalizeRoute(fallbackRoute, 'fallback') : null
}

/**
 * Reads A2 progress from the canonical journey state, with the legacy route
 * progress table as a compatibility fallback. New users always start with a
 * 30-day horizon; 60 and 90 require explicit extension decisions.
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
    console.error('[v0] Error reading A2 journey state:', journeyError)
  }
  if (completionsError) {
    console.error('[v0] Error reading A2 completion continuity:', completionsError)
  }

  const completedDays = (completionRows || [])
    .map((row: { day?: unknown }) => Number(row.day))
    .filter((day: number) => Number.isInteger(day) && day >= 1 && day <= 90)

  const journeyCurrent = validDay(journey?.current_a2_day)
  const journeyHighest = validDay(journey?.highest_a2_day_unlocked)
  if (journeyCurrent || journeyHighest) {
    const activeHorizon = inferA2Horizon(journey?.metadata, journeyHighest)
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
    console.error('[v0] Error reading compatibility A2 route progress:', routeError)
  }

  const routeDay = validDay(routeProgress?.dia_actual)
  if (routeDay) {
    const activeHorizon = inferA2Horizon(null, routeDay)
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

  const activeHorizon = inferA2Horizon(null, null)
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
