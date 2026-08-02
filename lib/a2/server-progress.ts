export interface A2ProgressSnapshot {
  currentDay: number
  highestUnlockedDay: number
  source: 'journey' | 'route' | 'default'
}

function validDay(value: unknown): number | null {
  const day = Number(value)
  return Number.isInteger(day) && day >= 1 && day <= 90 ? day : null
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
