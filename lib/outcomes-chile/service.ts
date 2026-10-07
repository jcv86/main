import { createAdminClient } from '@/lib/supabase/server'
import { resolveChileBenchmark } from './benchmark-resolver'
import type { ChileBenchmarkRequest, ResolvedChileBenchmark } from './benchmark-selector'
import {
  buildChileImpact, chileCalendarDate, selectChileSalaryPair,
  type ChileEmploymentOutcome, type ChileFollowup, type ChileSalaryMeasurement, type ChileSearchEvent,
} from './impact'

type OutcomesDatabase = ReturnType<typeof createAdminClient>
const PAGE_SIZE = 500
const MAX_RECORDS = 20_000

interface SummaryDependencies {
  db?: OutcomesDatabase
  now?: Date
  resolveBenchmark?: (request: ChileBenchmarkRequest) => Promise<ResolvedChileBenchmark | null>
}

/** Paginate explicitly: a partial PostgREST result must never become a complete-looking metric. */
export async function loadOwnedOutcomeRows<T>(
  db: OutcomesDatabase, table: string, columns: string, userId: string, cutoff: string,
): Promise<T[]> {
  const rows: T[] = []
  const seenIds = new Set<string>()
  let expectedCount: number | null = null
  for (;;) {
    const { data, error, count } = await db.from(table).select(columns, { count: 'exact' })
      .eq('user_id', userId).lte('created_at', cutoff)
      .order('created_at', { ascending: true }).order('id', { ascending: true })
      .range(rows.length, rows.length + PAGE_SIZE - 1)
    if (error) {
      if (['42P01', 'PGRST205'].includes(error.code)) throw new Error('OUTCOMES_CHILE_NOT_READY')
      throw new Error('OUTCOMES_CHILE_READ_FAILED')
    }
    if (!Array.isArray(data) || !Number.isInteger(count) || count! < 0) throw new Error('OUTCOMES_CHILE_INCOMPLETE_READ')
    if (count! > MAX_RECORDS) throw new Error('OUTCOMES_CHILE_READ_LIMIT')
    if (expectedCount !== null && count !== expectedCount) throw new Error('OUTCOMES_CHILE_SNAPSHOT_CHANGED')
    expectedCount = count!
    for (const row of data) {
      const id = (row as unknown as { id: string }).id
      if (!id || seenIds.has(id)) throw new Error('OUTCOMES_CHILE_INCOMPLETE_READ')
      seenIds.add(id)
    }
    rows.push(...data as unknown as T[])
    if (rows.length === expectedCount) return rows
    if (rows.length > expectedCount || data.length === 0) throw new Error('OUTCOMES_CHILE_INCOMPLETE_READ')
  }
}

export async function loadOutcomesChileSummary(userId: string, dependencies: SummaryDependencies = {}) {
  const db = dependencies.db ?? createAdminClient()
  const now = dependencies.now ?? new Date()
  if (!Number.isFinite(now.getTime())) throw new Error('INVALID_IMPACT_COMPUTED_AT')
  const cutoff = now.toISOString()
  const [events, employment, salary, followups] = await Promise.all([
    loadOwnedOutcomeRows<ChileSearchEvent>(db, 'dtc_job_search_events',
      'id,event_type,occurred_at,verification_status,created_at', userId, cutoff),
    loadOwnedOutcomeRows<ChileEmploymentOutcome>(db, 'dtc_employment_outcomes',
      'id,outcome_type,effective_date,region_code,occupation_code,employment_category,verification_status,created_at', userId, cutoff),
    loadOwnedOutcomeRows<ChileSalaryMeasurement>(db, 'dtc_salary_outcomes',
      'id,employment_outcome_id,measurement_role,monthly_net_clp,measured_at,verification_status,created_at', userId, cutoff),
    loadOwnedOutcomeRows<ChileFollowup>(db, 'dtc_outcome_followups',
      'id,employment_outcome_id,followup_day,due_at,completed_at,employment_active,same_role,verification_status,created_at', userId, cutoff),
  ])
  const pair = selectChileSalaryPair(salary, cutoff)
  const linkedEmployment = pair.latest?.employment_outcome_id
    ? employment.find((row) => row.id === pair.latest!.employment_outcome_id
      && row.effective_date <= pair.latest!.measured_at) : null
  const request: ChileBenchmarkRequest = {
    metricKey: 'monthly_labor_income_median',
    asOf: pair.latest?.measured_at ?? chileCalendarDate(cutoff),
    regionCode: linkedEmployment?.region_code ?? null,
    occupationCode: linkedEmployment?.occupation_code ?? null,
    employmentCategory: linkedEmployment?.employment_category ?? null,
  }
  const benchmark = await (dependencies.resolveBenchmark ?? resolveChileBenchmark)(request)
  const impact = buildChileImpact({ events, employment, salary, followups }, benchmark, cutoff)
  return {
    funnel: impact.observed.jobSearch,
    timeToJobDays: impact.observed.employment.timeToJobDays,
    economic: { ...impact.observed.economic, annualizedLiftClp: impact.projection.annualizedLiftClp },
    verification: impact.verification,
    attribution: impact.attribution.classification,
    impact,
  }
}
