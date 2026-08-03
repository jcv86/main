import 'server-only'

import { createAdminClient } from '@/lib/supabase/server'

export type JourneyTransitionStep = 'a1_report' | 'a2_intro'

export interface JourneyTransitionResult {
  nextPath: string
  repairedLegacyState?: boolean
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

export async function recordJourneyTransition(
  userId: string,
  step: JourneyTransitionStep,
): Promise<JourneyTransitionResult> {
  if (!(await hasA1Assessment(userId))) {
    throw new Error('Completa Despega Cerebral antes de continuar.')
  }

  if (step === 'a1_report') {
    await upsertProfileFlags(userId, {
      a1_results_saved: true,
      a1_report_seen: true,
    })

    return { nextPath: '/despega/a2/intro' }
  }

  await upsertProfileFlags(userId, {
    a1_results_saved: true,
    a1_report_seen: true,
    a2_intro_seen: true,
    a2_intro_seen_at: new Date().toISOString(),
  })

  return { nextPath: '/despega/conozcamonos-2' }
}

/**
 * Earlier versions persisted the C2 flag under a longer onboarding alias.
 * Repair it at canonical entry points so completed users never fall into a loop.
 */
export async function repairLegacyC2Completion(
  userId: string,
): Promise<boolean> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('despega_user_profiles')
    .select(
      'conozcamonos_2_completed, onboarding_conozcamonos_2_completed, a2_route_generated',
    )
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  if (!data || data.conozcamonos_2_completed) return false

  const legacyComplete = Boolean(
    data.onboarding_conozcamonos_2_completed || data.a2_route_generated,
  )
  if (!legacyComplete) return false

  const { error: updateError } = await supabase
    .from('despega_user_profiles')
    .update({ conozcamonos_2_completed: true })
    .eq('user_id', userId)

  if (updateError) throw updateError
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
