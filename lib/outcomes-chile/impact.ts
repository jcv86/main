import type { ResolvedChileBenchmark } from './benchmark-selector'
import { deriveEconomicOutcome, deriveJobSearchFunnel, deriveTimeToJobDays } from './metrics'

export type OutcomeVerification = 'self_reported' | 'corroborated' | 'verified'

interface EvidenceRecord {
  id: string
  created_at: string
  verification_status: OutcomeVerification
}

export interface ChileSearchEvent extends EvidenceRecord {
  event_type: string
  occurred_at: string
}

export interface ChileEmploymentOutcome extends EvidenceRecord {
  outcome_type: string
  effective_date: string
  region_code: string | null
  occupation_code: string | null
  employment_category: string | null
}

export interface ChileSalaryMeasurement extends EvidenceRecord {
  employment_outcome_id: string | null
  measurement_role: 'baseline' | 'new_role' | 'follow_up'
  monthly_net_clp: number
  measured_at: string
}

export interface ChileFollowup extends EvidenceRecord {
  employment_outcome_id: string | null
  followup_day: 30 | 90 | 180
  due_at: string
  completed_at: string | null
  employment_active: boolean | null
  same_role: boolean | null
}

export interface ChileImpactEvidence {
  events: readonly ChileSearchEvent[]
  employment: readonly ChileEmploymentOutcome[]
  salary: readonly ChileSalaryMeasurement[]
  followups: readonly ChileFollowup[]
}

const verificationRank: Record<OutcomeVerification, number> = { self_reported: 0, corroborated: 1, verified: 2 }
const DAY_MS = 86_400_000

function isDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const time = Date.parse(`${value}T00:00:00Z`)
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value
}

function visibleRecord(row: EvidenceRecord, asOf: string): boolean {
  const created = Date.parse(row.created_at)
  return Boolean(row.id) && Object.hasOwn(verificationRank, row.verification_status)
    && Number.isFinite(created) && created <= Date.parse(asOf)
}

function visibleSalary(rows: readonly ChileSalaryMeasurement[], asOf: string): ChileSalaryMeasurement[] {
  return rows.filter((row) => visibleRecord(row, asOf) && isDateOnly(row.measured_at)
    && row.measured_at <= chileCalendarDate(asOf)
    && ['baseline', 'new_role', 'follow_up'].includes(row.measurement_role)
    && Number.isInteger(row.monthly_net_clp) && row.monthly_net_clp >= 0 && row.monthly_net_clp <= 100_000_000)
}

function compareSalary(a: ChileSalaryMeasurement, b: ChileSalaryMeasurement): number {
  return b.measured_at.localeCompare(a.measured_at)
    || Date.parse(b.created_at) - Date.parse(a.created_at) || a.id.localeCompare(b.id)
}

export type SalaryPairStatus = 'comparable' | 'missing_latest' | 'missing_baseline'
  | 'no_earlier_baseline' | 'ambiguous_baseline' | 'ambiguous_latest'

/** No supersession field exists: conflicting measurements on the same date stay unresolved. */
export function selectChileSalaryPair(rows: readonly ChileSalaryMeasurement[], asOf: string) {
  const eligible = visibleSalary(rows, asOf)
  const latestCandidates = eligible.filter((row) => row.measurement_role !== 'baseline').sort(compareSalary)
  let latest: ChileSalaryMeasurement | null = latestCandidates[0] ?? null
  let baseline: ChileSalaryMeasurement | null = null
  let status: SalaryPairStatus = 'missing_latest'
  let conflictingRecordIds: string[] = []
  if (latest) {
    const sameDate = latestCandidates.filter((row) => row.measured_at === latest!.measured_at)
    if (new Set(sameDate.map((row) => `${row.monthly_net_clp}:${row.employment_outcome_id ?? ''}`)).size > 1) {
      status = 'ambiguous_latest'
      conflictingRecordIds = sameDate.map((row) => row.id).sort()
      latest = null
    } else {
      const allBaselines = eligible.filter((row) => row.measurement_role === 'baseline')
      const earlier = allBaselines.filter((row) => row.measured_at < latest!.measured_at).sort(compareSalary)
      baseline = earlier[0] ?? null
      status = baseline ? 'comparable' : allBaselines.length ? 'no_earlier_baseline' : 'missing_baseline'
      if (baseline) {
        const sameBaselineDate = earlier.filter((row) => row.measured_at === baseline!.measured_at)
        if (new Set(sameBaselineDate.map((row) => `${row.monthly_net_clp}:${row.employment_outcome_id ?? ''}`)).size > 1) {
          conflictingRecordIds = sameBaselineDate.map((row) => row.id).sort()
          baseline = null
          status = 'ambiguous_baseline'
        }
      }
    }
  } else {
    const baselines = eligible.filter((row) => row.measurement_role === 'baseline').sort(compareSalary)
    baseline = baselines[0] ?? null
    if (baseline) {
      const sameDate = baselines.filter((row) => row.measured_at === baseline!.measured_at)
      if (new Set(sameDate.map((row) => `${row.monthly_net_clp}:${row.employment_outcome_id ?? ''}`)).size > 1) {
        conflictingRecordIds = sameDate.map((row) => row.id).sort()
        baseline = null
        status = 'ambiguous_baseline'
      }
    }
  }
  return { baseline, latest, status, conflictingRecordIds }
}

function salaryEvidence(row: ChileSalaryMeasurement | null) {
  return row ? {
    recordId: row.id,
    monthlyNetClp: row.monthly_net_clp,
    measuredAt: row.measured_at,
    recordedAt: row.created_at,
    employmentOutcomeId: row.employment_outcome_id,
    verification: row.verification_status,
  } : null
}

function weakestVerification(rows: readonly EvidenceRecord[]): OutcomeVerification | null {
  if (!rows.length) return null
  return rows.reduce((status, row) => verificationRank[row.verification_status] < verificationRank[status]
    ? row.verification_status : status, rows[0].verification_status)
}

export function chileCalendarDate(timestamp: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date(timestamp))
  const part = (type: string) => parts.find((entry) => entry.type === type)!.value
  return `${part('year')}-${part('month')}-${part('day')}`
}

export function buildChileImpact(
  evidence: ChileImpactEvidence,
  benchmark: ResolvedChileBenchmark | null,
  computedAt: string,
) {
  if (!Number.isFinite(Date.parse(computedAt))) throw new Error('INVALID_IMPACT_COMPUTED_AT')
  const asOf = new Date(computedAt).toISOString()
  const asOfDate = chileCalendarDate(asOf)
  const events = evidence.events.filter((row) => visibleRecord(row, asOf)
    && Number.isFinite(Date.parse(row.occurred_at)) && Date.parse(row.occurred_at) <= Date.parse(asOf))
    .sort((a, b) => Date.parse(a.occurred_at) - Date.parse(b.occurred_at) || a.id.localeCompare(b.id))
  const employment = evidence.employment.filter((row) => visibleRecord(row, asOf)
    && isDateOnly(row.effective_date) && row.effective_date <= asOfDate)
    .sort((a, b) => a.effective_date.localeCompare(b.effective_date) || a.id.localeCompare(b.id))
  const salary = visibleSalary(evidence.salary, asOf)
  const pair = selectChileSalaryPair(salary, asOf)
  const economic = deriveEconomicOutcome(pair.baseline?.monthly_net_clp ?? null, pair.latest?.monthly_net_clp ?? null)
  const { annualizedLiftClp, ...observedEconomic } = economic
  const firstApplication = events.find((row) => row.event_type === 'application') ?? null
  const firstApplicationDate = firstApplication ? chileCalendarDate(firstApplication.occurred_at) : null
  const firstJob = firstApplicationDate ? employment.find((row) =>
    ['job_started', 'return_to_work'].includes(row.outcome_type) && row.effective_date >= firstApplicationDate) ?? null : null
  const timeToJobDays = deriveTimeToJobDays(
    firstApplicationDate ? new Date(`${firstApplicationDate}T00:00:00Z`) : null,
    firstJob ? new Date(`${firstJob.effective_date}T00:00:00Z`) : null,
  )
  const followups = evidence.followups.filter((row) => {
    const parent = employment.find((job) => job.id === row.employment_outcome_id)
    if (!visibleRecord(row, asOf) || !parent || ![30, 90, 180].includes(row.followup_day) || !isDateOnly(row.due_at)) return false
    const expected = new Date(Date.parse(`${parent.effective_date}T00:00:00Z`) + row.followup_day * DAY_MS).toISOString().slice(0, 10)
    return row.due_at === expected
  })
  const retention = ([30, 90, 180] as const).map((day) => {
    const rows = followups.filter((row) => row.followup_day === day)
    const isComplete = (row: ChileFollowup) => Boolean(row.completed_at
      && Number.isFinite(Date.parse(row.completed_at)) && Date.parse(row.completed_at) <= Date.parse(asOf)
      && chileCalendarDate(row.completed_at) >= row.due_at)
    const complete = rows.filter(isComplete)
    return {
      day,
      scheduled: rows.length,
      pending: rows.filter((row) => !isComplete(row) && row.due_at >= asOfDate).length,
      overdue: rows.filter((row) => !isComplete(row) && row.due_at < asOfDate).length,
      completed: complete.length,
      employmentActive: complete.filter((row) => row.employment_active === true).length,
      employmentInactive: complete.filter((row) => row.employment_active === false).length,
      employmentUnknown: complete.filter((row) => row.employment_active === null).length,
      // The horizon relies on the employment start as well as the follow-up.
      verification: weakestVerification(complete.flatMap((row) => [row, employment.find((job) => job.id === row.employment_outcome_id)!])),
    }
  })
  const salaryPairVerification = pair.status === 'comparable'
    ? weakestVerification([pair.baseline!, pair.latest!]) : null

  return {
    version: 'chile-impact-v1' as const,
    computedAt: asOf,
    observed: {
      salary: { baseline: salaryEvidence(pair.baseline), latest: salaryEvidence(pair.latest) },
      economic: observedEconomic,
      jobSearch: deriveJobSearchFunnel(events.map((row) => row.event_type)),
      employment: {
        recordedOutcomes: employment.length,
        timeToJobDays,
        intervalBasis: 'first_recorded_application_to_subsequent_job_start' as const,
        applicationRecordId: firstApplication?.id ?? null,
        employmentRecordId: firstJob?.id ?? null,
        verification: firstApplication && firstJob ? weakestVerification([firstApplication, firstJob]) : null,
      },
      retention,
    },
    benchmark,
    delta: {
      versusBaseline: {
        comparable: pair.status === 'comparable',
        status: pair.status,
        monthlyClp: economic.monthlyLiftClp,
        percent: economic.salaryLiftPct,
        conflictingRecordIds: pair.conflictingRecordIds,
      },
      versusBenchmark: {
        comparable: false as const,
        reason: !pair.latest ? 'no_observed_salary' as const : !benchmark ? 'benchmark_unavailable' as const : 'income_definition_mismatch' as const,
        monthlyClp: null,
        percent: null,
      },
    },
    projection: {
      annualizedLiftClp,
      basis: 'monthly_difference_times_12' as const,
      realized: false as const,
      assumption: 'Estimación si la diferencia mensual se mantuviera durante doce meses; no es ingreso anual observado.',
    },
    verification: {
      salaryPair: salaryPairVerification,
      verifiedSearchEvents: events.filter((row) => row.verification_status === 'verified').length,
      verifiedEmploymentOutcomes: employment.filter((row) => row.verification_status === 'verified').length,
      verifiedSalaryMeasurements: salary.filter((row) => row.verification_status === 'verified').length,
    },
    specificity: benchmark?.specificity ?? null,
    attribution: {
      classification: 'observed_not_causal' as const,
      causalEffectEstablished: false as const,
      notice: 'Estos son resultados registrados por la persona. Su evolución no demuestra que DTC haya causado el cambio.',
    },
    limitations: [
      'Los eventos registrados no equivalen a procesos de selección únicos; sus razones pueden superar el 100%.',
      'El intervalo laboral parte de la primera postulación registrada y no acredita el inicio real de la búsqueda ni su vínculo con la contratación.',
      'Las rentas líquidas se comparan entre mediciones anteriores y posteriores, sin ajustar por inflación, jornada o cambio de funciones.',
      'El ingreso laboral oficial se muestra como contexto: su definición no está homologada con la renta líquida declarada.',
      'Un seguimiento programado o vencido no demuestra permanencia laboral.',
    ],
    evidenceCoverage: {
      readConsistency: 'bounded_paginated_reads_not_transactional_snapshot' as const,
      included: { events: events.length, employment: employment.length, salary: salary.length, followups: followups.length },
      excludedInvalidOrFuture: {
        events: evidence.events.length - events.length,
        employment: evidence.employment.length - employment.length,
        salary: evidence.salary.length - salary.length,
        followups: evidence.followups.length - followups.length,
      },
    },
  }
}
