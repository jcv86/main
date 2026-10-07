import { buildChileImpact, type ChileImpactEvidence, type ChileSalaryMeasurement } from '../../lib/outcomes-chile/impact'
import type { ResolvedChileBenchmark } from '../../lib/outcomes-chile/benchmark-selector'
import { buildChileWorkspace, type OutcomesChileSummary } from '../../lib/outcomes-chile/workspace'

export const FIXTURE_NOW = '2026-10-07T13:00:00.000Z'
export const FIXTURE_DATE = '2026-10-07'
export const fixtureId = (number: number) => `00000000-0000-4000-8000-${String(number).padStart(12, '0')}`
export const EMPLOYMENT_ID = fixtureId(201)
export const DUE_FOLLOWUP_ID = fixtureId(302)

// Deliberately invented UI evidence: this value must never enter a seed or citation.
export const SYNTHETIC_BENCHMARK: ResolvedChileBenchmark = {
  benchmarkId: fixtureId(900), specificity: 'national', metricKey: 'monthly_labor_income_mean',
  value: 765432, unit: 'clp_month', sourceKey: 'other_official', sourcePeriod: '2025',
  sourcePeriodStart: '2025-01-01', sourcePeriodEnd: '2025-12-31', sourcePeriodPrecision: 'year',
  sourceRef: 'UI LAB: referencia sintética, sin publicación real; no citar.',
  publishedAt: '2026-08-01', reliabilityStatus: 'official_published', sampleSize: null,
  dimensions: { regionCode: null, occupationCode: null, educationLevel: null, employmentCategory: 'private_employee', industryCode: null },
  asOf: FIXTURE_DATE, resolutionVersion: 'chile-benchmark-v2',
}

const record = (id: number, createdAt = '2026-07-09T15:00:00.000Z') => ({
  id: fixtureId(id), created_at: createdAt, verification_status: 'self_reported' as const,
})

const rent = (id: number, role: ChileSalaryMeasurement['measurement_role'], amount: number, date: string): ChileSalaryMeasurement => ({
  ...record(id, date + 'T15:00:00.000Z'),
  employment_outcome_id: role === 'baseline' ? null : EMPLOYMENT_ID,
  measurement_role: role,
  monthly_net_clp: amount,
  measured_at: date,
})

export function emptyEvidence(): ChileImpactEvidence {
  return { events: [], employment: [], salary: [], followups: [] }
}

export function populatedEvidence(): ChileImpactEvidence {
  return {
    events: [
      { ...record(1, '2026-06-25T15:00:00.000Z'), event_type: 'application', occurred_at: '2026-06-25T15:00:00.000Z', target_role: 'Analista de operaciones' },
      { ...record(2, '2026-07-02T15:00:00.000Z'), event_type: 'interview', occurred_at: '2026-07-02T15:00:00.000Z', target_role: 'Analista de operaciones' },
      { ...record(3, '2026-07-06T15:00:00.000Z'), event_type: 'offer', occurred_at: '2026-07-06T15:00:00.000Z', target_role: 'Analista de operaciones' },
    ],
    employment: [{
      ...record(201), outcome_type: 'job_started', effective_date: '2026-07-09',
      role_title: 'Analista de operaciones y mejora continua',
      region_code: '13', occupation_code: null, employment_category: 'private_employee',
    }],
    salary: [rent(101, 'baseline', 1000000, '2026-06-01'), rent(102, 'new_role', 1200000, '2026-08-01')],
    followups: [
      { ...record(301), employment_outcome_id: EMPLOYMENT_ID, followup_day: 30, due_at: '2026-08-08', completed_at: '2026-08-09T15:00:00.000Z', employment_active: true, same_role: true },
      { ...record(302), employment_outcome_id: EMPLOYMENT_ID, followup_day: 90, due_at: '2026-10-07', completed_at: null, employment_active: null, same_role: null },
      { ...record(303), employment_outcome_id: EMPLOYMENT_ID, followup_day: 180, due_at: '2027-01-05', completed_at: null, employment_active: null, same_role: null },
    ],
  }
}

export function summaryFrom(evidence: ChileImpactEvidence, benchmark: ResolvedChileBenchmark | null = null): OutcomesChileSummary {
  const impact = buildChileImpact(evidence, benchmark, FIXTURE_NOW)
  return {
    funnel: impact.observed.jobSearch,
    timeToJobDays: impact.observed.employment.timeToJobDays,
    economic: { ...impact.observed.economic, annualizedLiftClp: impact.projection.annualizedLiftClp },
    verification: impact.verification,
    attribution: impact.attribution.classification,
    impact,
    workspace: buildChileWorkspace(evidence, FIXTURE_NOW),
  }
}

export function scenarioEvidence(name: 'empty' | 'populated' | 'zero' | 'negative' | 'ambiguous' | 'needs_review'): ChileImpactEvidence {
  if (name === 'empty') return emptyEvidence()
  const evidence = populatedEvidence()
  if (name === 'zero') evidence.salary = [rent(101, 'baseline', 0, '2026-06-01'), rent(102, 'new_role', 800000, '2026-08-01')]
  if (name === 'negative') evidence.salary = [rent(101, 'baseline', 1200000, '2026-06-01'), rent(102, 'new_role', 1000000, '2026-08-01')]
  if (name === 'ambiguous') evidence.salary = [...evidence.salary, rent(103, 'follow_up', 1300000, '2026-08-01')]
  if (name === 'needs_review') evidence.followups = evidence.followups.map((row) => row.id === DUE_FOLLOWUP_ID
    ? { ...row, completed_at: '2026-09-01T15:00:00.000Z', employment_active: true, same_role: true } : row)
  return evidence
}

export function scenario(name: 'empty' | 'populated' | 'zero' | 'negative' | 'ambiguous' | 'needs_review'): OutcomesChileSummary {
  return summaryFrom(scenarioEvidence(name))
}
