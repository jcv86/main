import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { buildJourneyFlow, type FlowInput } from './flow'

type FlowJourney = {
  user: { id: string }
  profile: FlowInput['profile']
  access: FlowInput['access']
  state: { currentModule: string; highestA2DayUnlocked: number }
}

/** Shared read boundary for the dashboard, integral report and journey map. */
export async function readJourneyFlow(journey: FlowJourney, client: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user }, error: authError } = await client.auth.getUser()
  if (authError || !user || user.id !== journey.user.id) throw new Error('No pudimos verificar la identidad del recorrido.')
  const userId = user.id
  const [a2, a3, closure, state] = await Promise.all([
    client.from('a2_user_task_completions').select('day').eq('user_id', userId).not('completed_at', 'is', null),
    client.from('a3_user_progress').select('completed_module_ids').eq('user_id', userId).maybeSingle(),
    client.from('a3_route_progression').select('route_completed_at').eq('user_id', userId).maybeSingle(),
    client.from('despega_journey_state').select('metadata').eq('user_id', userId).maybeSingle(),
  ])
  if (a2.error || a3.error || closure.error || state.error) throw new Error('No pudimos verificar el progreso. No se reemplazó por cero ni se habilitaron etapas.')
  return buildJourneyFlow({
    profile: journey.profile,
    access: journey.access,
    currentModule: journey.state.currentModule,
    highestA2DayUnlocked: journey.state.highestA2DayUnlocked,
    horizonMetadata: state.data?.metadata,
    completedA2Days: (a2.data || []).map(row => row.day),
    completedA3Modules: Array.isArray(a3.data?.completed_module_ids) ? a3.data.completed_module_ids : [],
    // The connected legacy column has no timezone. Use only the completion marker, not an inferred instant.
    a3RouteClosed: closure.data?.route_completed_at != null,
  })
}

export async function loadJourneyFlow(journey: FlowJourney) {
  return readJourneyFlow(journey, await createClient())
}
