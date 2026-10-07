import type { createAdminClient } from '@/lib/supabase/server'
import { hasActiveA4QaEntitlement } from './qa-entitlement'

interface A4AccessResult {
  canAccess: boolean
  routeCompletedAt: string | null
  reason: 'A3_ROUTE_NOT_COMPLETED' | null
  accessSource?: 'journey' | 'qa_entitlement'
}

export async function checkA4Access(
  userId: string,
  supabase: ReturnType<typeof createAdminClient>,
): Promise<A4AccessResult> {
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
  return 'Radar Estratégico se habilita al cerrar la ruta completa de Entrenamiento.'
}
