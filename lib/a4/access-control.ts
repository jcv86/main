import type { createAdminClient } from '@/lib/supabase/server'
import { hasActiveA4QaEntitlement } from './qa-entitlement'

interface A4AccessResult {
  canAccess: boolean
  routeCompletedAt: string | null
  reason: 'A3_ROUTE_NOT_COMPLETED' | 'PILOT_ACCESS_REQUIRED' | null
  accessSource?: 'journey' | 'qa_entitlement'
}

export async function checkA4Access(
  userId: string,
  supabase: ReturnType<typeof createAdminClient>,
): Promise<A4AccessResult> {
  // Callers resolve userId from the verified server session (or the scheduled
  // owner's record). Neither old journey evidence nor a QA grant admits a pilot.
  let pilotAllowed: boolean
  try {
    const { data: pilotData, error: pilotError } = await supabase.rpc('resolve_pilot_access', {
      p_user_id: userId,
      p_claim_id: null,
    })
    const pilot = Array.isArray(pilotData) ? pilotData.length === 1 ? pilotData[0] : null : pilotData
    if (pilotError || typeof pilot?.allowed !== 'boolean') throw new Error('Invalid pilot response')
    pilotAllowed = pilot.allowed
  } catch {
    throw new Error('Unable to verify pilot access')
  }
  if (!pilotAllowed) return { canAccess: false, routeCompletedAt: null, reason: 'PILOT_ACCESS_REQUIRED' }

  const { data, error } = await supabase
    .from('a3_route_progression')
    .select('route_completed_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(`Unable to verify A4 access: ${error.message}`)
  }

  const routeCompletedAt = data?.route_completed_at || null
  if (routeCompletedAt) return { canAccess: true, routeCompletedAt, reason: null, accessSource: 'journey' }

  if (await hasActiveA4QaEntitlement(userId, supabase)) {
    return { canAccess: true, routeCompletedAt: null, reason: null, accessSource: 'qa_entitlement' }
  }

  return { canAccess: false, routeCompletedAt: null, reason: 'A3_ROUTE_NOT_COMPLETED' }
}

export function getA4AccessDenialMessage() {
  return 'Para abrir Radar Estratégico necesitas acceso al piloto. La habilitación llega al cerrar Entrenamiento o con un permiso de prueba vigente.'
}
