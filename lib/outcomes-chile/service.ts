import { createAdminClient } from '@/lib/supabase/server'
import { deriveEconomicOutcome, deriveJobSearchFunnel, deriveTimeToJobDays } from './metrics'

export async function loadOutcomesChileSummary(userId: string) {
  const db = createAdminClient()
  const [events, employment, salary] = await Promise.all([
    db.from('dtc_job_search_events').select('event_type,occurred_at,verification_status').eq('user_id', userId).order('occurred_at'),
    db.from('dtc_employment_outcomes').select('effective_date,verification_status').eq('user_id', userId).order('effective_date', { ascending: true }),
    db.from('dtc_salary_outcomes').select('measurement_role,monthly_net_clp,measured_at,verification_status').eq('user_id', userId).order('measured_at'),
  ])
  if (events.error) throw events.error
  if (employment.error) throw employment.error
  if (salary.error) throw salary.error

  const funnel = deriveJobSearchFunnel((events.data || []).map((row) => row.event_type))
  const baseline = (salary.data || []).find((row) => row.measurement_role === 'baseline')
  const latest = [...(salary.data || [])].reverse().find((row) => row.measurement_role !== 'baseline')
  const firstApplication = (events.data || []).find((row) => row.event_type === 'application')
  const firstJob = (employment.data || [])[0]

  return {
    funnel,
    timeToJobDays: deriveTimeToJobDays(
      firstApplication ? new Date(firstApplication.occurred_at) : null,
      firstJob ? new Date(firstJob.effective_date) : null,
    ),
    economic: deriveEconomicOutcome(baseline?.monthly_net_clp ?? null, latest?.monthly_net_clp ?? null),
    verification: {
      verifiedSearchEvents: (events.data || []).filter((row) => row.verification_status === 'verified').length,
      verifiedEmploymentOutcomes: (employment.data || []).filter((row) => row.verification_status === 'verified').length,
      verifiedSalaryMeasurements: (salary.data || []).filter((row) => row.verification_status === 'verified').length,
    },
    attribution: 'observed_not_causal' as const,
  }
}
