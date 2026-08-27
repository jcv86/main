import 'server-only'

import { createAdminClient } from '@/lib/supabase/server'

export type JourneyTransitionStep = 'a1_report' | 'a2_intro'

export interface JourneyTransitionResult {
  nextPath: string
  repairedLegacyState?: boolean
}

interface TransitionProfile {
  a1_report_seen?: boolean | null
  conozcamonos_2_completed?: boolean | null
  a2_route_generated?: boolean | null
}

async function upsertProfileFlags(
  userId: string,
  values: Record<string, unknown>,
) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('despega_user_profiles')
    .upsert(
      {
        user_id: userId,
        ...values,
      },
      { onConflict: 'user_id' },
    )

  if (error) throw error
}

async function hasA1Assessment(userId: string): Promise<boolean> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('a1_cerebral_assessment')
    .select('user_id')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return Boolean(data)
}

async function loadTransitionProfile(userId: string): Promise<TransitionProfile> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('despega_user_profiles')
    .select(
      'a1_report_seen, conozcamonos_2_completed, a2_route_generated',
    )
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return (data || {}) as TransitionProfile
}

function c2Completed(profile: TransitionProfile): boolean {
  return Boolean(
    profile.conozcamonos_2_completed || profile.a2_route_generated,
  )
}

export async function recordJourneyTransition(
  userId: string,
  step: JourneyTransitionStep,
): Promise<JourneyTransitionResult> {
  if (!(await hasA1Assessment(userId))) {
    throw new Error('Completa Despega Cerebral antes de continuar.')
  }

  const profile = await loadTransitionProfile(userId)

  if (step === 'a1_report') {
    if (!c2Completed(profile)) {
      throw new Error('Completa Conozcámonos 2 antes de abrir tu informe final.')
    }

    await upsertProfileFlags(userId, {
      conozcamonos_2_completed: true,
      a1_results_saved: true,
      a1_report_seen: true,
    })

    return { nextPath: '/despega/a2/intro' }
  }

  if (!c2Completed(profile) || !profile.a1_report_seen) {
    throw new Error('Completa A1 y revisa tu informe antes de iniciar Tu Ruta.')
  }

  await upsertProfileFlags(userId, {
    conozcamonos_2_completed: true,
    a1_results_saved: true,
    a1_report_seen: true,
    a2_intro_seen: true,
    a2_intro_seen_at: new Date().toISOString(),
  })

  return { nextPath: '/despega/a2' }
}

/**
 * Earlier versions could imply C2 completion by generating an A2 route.
 * Repair that legacy state at canonical entry points so users never loop.
 */
export async function repairLegacyC2Completion(
  userId: string,
): Promise<boolean> {
  const profile = await loadTransitionProfile(userId)
  if (profile.conozcamonos_2_completed || !c2Completed(profile)) return false

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('despega_user_profiles')
    .update({ conozcamonos_2_completed: true })
    .eq('user_id', userId)

  if (error) throw error
  return true
}

/** Keep canonical journey state aligned when the first A3 checkpoint is opened. */
export async function markA3JourneyVisited(userId: string): Promise<void> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('despega_journey_state')
    .select('current_module, a3_unlocked_at, version')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  if (!data || ['A4', 'COMPLETED'].includes(String(data.current_module))) return
  if (data.current_module === 'A3' && data.a3_unlocked_at) return

  const now = new Date().toISOString()
  const { error: updateError } = await supabase
    .from('despega_journey_state')
    .update({
      current_module: 'A3',
      a3_unlocked_at: data.a3_unlocked_at || now,
      version: (Number(data.version) || 0) + 1,
      updated_at: now,
    })
    .eq('user_id', userId)

  if (updateError) throw updateError
}
