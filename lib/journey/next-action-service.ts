import 'server-only'
import { cache } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import type { JourneyFlow } from './flow'
import { buildGuidedNextAction, guidedPracticeDay, type GuidedSourceRead } from './next-action'

type GuidedJourney = { user: { id: string } }

// Only the fields needed for the existing objective parser, summary and provenance.
const OBJECTIVE_SELECT = 'id,target_roles,functional_areas,objective_stage,breadth,locations,location_preference,work_modes,industries,excluded_industries,unknown_industry_policy,source,updated_at'

async function readObjective(client: SupabaseClient, userId: string): Promise<GuidedSourceRead> {
  try {
    const { data, error } = await client.from('career_search_intents').select(OBJECTIVE_SELECT)
      .eq('user_id', userId).eq('is_active', true).eq('is_primary', true)
      .eq('source', 'user_confirmed').maybeSingle()
    if (error) return { status: 'unavailable' }
    if (data === null) return { status: 'missing' }
    return data && typeof data === 'object' && !Array.isArray(data)
      ? { status: 'available', value: data } : { status: 'unavailable' }
  } catch { return { status: 'unavailable' } }
}

async function readAdjustment(client: SupabaseClient, userId: string, day: number): Promise<GuidedSourceRead> {
  try {
    const { data, error } = await client.from('dtc_documents').select('id,content,created_at,related_day')
      .eq('user_id', userId).eq('type', 'a2_practice_adjustment').eq('related_day', day)
      .order('created_at', { ascending: false }).order('id', { ascending: false }).limit(1).maybeSingle()
    if (error) return { status: 'unavailable' }
    if (data === null) return { status: 'missing' }
    return data && typeof data === 'object' && !Array.isArray(data)
      ? { status: 'available', value: data } : { status: 'unavailable' }
  } catch { return { status: 'unavailable' } }
}

/**
 * The caller supplies the already resolved canonical flow. This read boundary
 * revalidates its journey owner and issues only SELECTs through that session.
 * It does not initialize a journey, call an RPC or invoke a model.
 */
export async function readGuidedNextAction(journey: GuidedJourney, flow: JourneyFlow, client: SupabaseClient) {
  try {
    const { data, error } = await client.auth.getUser()
    if (error || !data.user || !journey.user.id || data.user.id !== journey.user.id) throw new Error('Identity mismatch')
  } catch {
    throw new Error('No pudimos verificar la identidad de tu recorrido. Vuelve a iniciar sesión e inténtalo de nuevo.')
  }
  const userId = journey.user.id
  const day = guidedPracticeDay(flow)
  const [objective, adjustment] = await Promise.all([
    flow.practicePath === 'persona' ? Promise.resolve(undefined) : readObjective(client, userId),
    day === null ? Promise.resolve(undefined) : readAdjustment(client, userId, day),
  ])
  return buildGuidedNextAction(flow, { objective, adjustment })
}

/** React cache is scoped to the render request; no cross-user context is retained. */
export const loadGuidedNextAction = cache(async function loadGuidedNextAction(journey: GuidedJourney, flow: JourneyFlow) {
  return readGuidedNextAction(journey, flow, await createClient())
})
