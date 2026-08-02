export interface A2ProgressSnapshot {
  currentDay: number
  highestUnlockedDay: number
  source: 'journey' | 'route' | 'default'
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
    .order('ultima_actividad', { ascending: false })
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
 * progress table as a compatibility fallback.
 */
export async function getA2ProgressSnapshot(
  userId: string,
  supabase: any,
): Promise<A2ProgressSnapshot> {
  const { data: journey, error: journeyError } = await supabase
    .from('despega_journey_state')
    .select('current_a2_day, highest_a2_day_unlocked')
    .eq('user_id', userId)
    .maybeSingle()

  if (journeyError) {
    console.error('[v0] Error reading A2 journey state:', journeyError)
  }

  const journeyCurrent = validDay(journey?.current_a2_day)
  const journeyHighest = validDay(journey?.highest_a2_day_unlocked)
  if (journeyCurrent || journeyHighest) {
    return {
      currentDay: journeyCurrent ?? journeyHighest ?? 1,
      highestUnlockedDay: journeyHighest ?? journeyCurrent ?? 1,
      source: 'journey',
    }
  }

  const { data: routeProgress, error: routeError } = await supabase
    .from('a2_user_route_progress')
    .select('dia_actual')
    .eq('user_id', userId)
    .order('ultima_actividad', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (routeError) {
    console.error('[v0] Error reading legacy A2 route progress:', routeError)
  }

  const routeDay = validDay(routeProgress?.dia_actual)
  if (routeDay) {
    return {
      currentDay: routeDay,
      highestUnlockedDay: routeDay,
      source: 'route',
    }
  }

  return { currentDay: 1, highestUnlockedDay: 1, source: 'default' }
}
