import type { createAdminClient } from '@/lib/supabase/server'

interface A4AccessResult {
  canAccess: boolean
  routeCompletedAt: string | null
  reason: 'A3_ROUTE_NOT_COMPLETED' | null
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
  return {
    canAccess: Boolean(routeCompletedAt),
    routeCompletedAt,
    reason: routeCompletedAt ? null : 'A3_ROUTE_NOT_COMPLETED',
  }
}

export function getA4AccessDenialMessage() {
  return 'Radar Estratégico se habilita al cerrar la ruta completa de Entrenamiento.'
}
