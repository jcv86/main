import assert from 'node:assert/strict'
import {
  buildChileImpact, chileCalendarDate, selectChileSalaryPair,
  type ChileImpactEvidence, type ChileSalaryMeasurement,
} from '../lib/outcomes-chile/impact'
import { selectChileBenchmark, type ChileBenchmarkRow } from '../lib/outcomes-chile/benchmark-selector'

// Synthetic records only. This script makes no network or database request.
const computedAt = '2026-10-07T13:00:00.000Z'
const record = (id: string) => ({ id, created_at: '2026-10-01T12:00:00.000Z', verification_status: 'self_reported' as const })
const salary = (id: string, role: ChileSalaryMeasurement['measurement_role'], amount: number, date: string): ChileSalaryMeasurement => ({
  ...record(id), measurement_role: role, monthly_net_clp: amount, measured_at: date, employment_outcome_id: null,
})
const empty: ChileImpactEvidence = { events: [], employment: [], salary: [], followups: [] }
const benchmarkRow: ChileBenchmarkRow = {
  id: 'synthetic-national-reference', source_key: 'ine_esi', source_period: '2025',
  metric_key: 'monthly_labor_income_median', region_code: null, occupation_code: null,
  education_level: null, employment_category: null, industry_code: null,
  value_numeric: 750000, unit: 'clp_month', sample_size: null,
  reliability_status: 'official_published', source_ref: 'synthetic-test-fixture-not-official-data', published_at: '2026-08-01',
}
const benchmark = selectChileBenchmark([benchmarkRow], { metricKey: 'monthly_labor_income_median' }, '2026-10-01')!
assert.ok(benchmark)
let cases = 0
function check(name: string, run: () => void) { run(); cases++; }

check('empty is missing evidence, not measured zero income or zero-day employment', () => {
  const result = buildChileImpact(empty, null, computedAt)
  assert.equal(result.observed.economic.latestMonthlyNetClp, null)
  assert.equal(result.observed.employment.timeToJobDays, null)
  assert.equal(result.delta.versusBaseline.comparable, false)
  assert.equal(result.delta.versusBenchmark.comparable, false)
  assert.equal(result.verification.salaryPair, null)
  assert.ok(result.observed.retention.every((row) => row.completed === 0))
})
check('positive delta preserves evidence and does not create a causal claim', () => {
  const result = buildChileImpact({ ...empty, salary: [salary('b', 'baseline', 1000000, '2026-08-01'), salary('l', 'new_role', 1200000, '2026-10-01')] }, benchmark, computedAt)
  assert.equal(result.delta.versusBaseline.monthlyClp, 200000)
  assert.equal(result.delta.versusBaseline.percent, 20)
  assert.equal(result.observed.salary.baseline?.recordId, 'b')
  assert.equal(result.observed.salary.latest?.recordId, 'l')
  assert.equal(result.verification.salaryPair, 'self_reported')
  assert.equal(result.projection.annualizedLiftClp, 2400000)
  assert.equal(result.projection.realized, false)
  assert.equal('observedAnnualLiftClp' in result.observed.economic, false)
  assert.equal('annualizedLiftClp' in result.observed.economic, false, 'projection must not live inside observed')
  assert.equal(result.attribution.causalEffectEstablished, false)
})
check('official labor income is disclosed but never subtracted from net pay', () => {
  const result = buildChileImpact({ ...empty, salary: [salary('l', 'new_role', 1200000, '2026-10-01')] }, benchmark, computedAt)
  assert.equal(result.benchmark?.benchmarkId, 'synthetic-national-reference')
  assert.equal(result.specificity, 'national')
  assert.deepEqual(result.delta.versusBenchmark, { comparable: false, reason: 'income_definition_mismatch', monthlyClp: null, percent: null })
})
check('decreases remain negative and explicit zero baseline has no percentage', () => {
  const lower = buildChileImpact({ ...empty, salary: [salary('b', 'baseline', 1000000, '2026-08-01'), salary('l', 'follow_up', 800000, '2026-10-01')] }, null, computedAt)
  assert.equal(lower.delta.versusBaseline.monthlyClp, -200000)
  assert.equal(lower.delta.versusBaseline.percent, -20)
  assert.equal(lower.projection.annualizedLiftClp, -2400000)
  const zero = buildChileImpact({ ...empty, salary: [salary('b', 'baseline', 0, '2026-08-01'), salary('l', 'new_role', 800000, '2026-10-01')] }, null, computedAt)
  assert.equal(zero.delta.versusBaseline.monthlyClp, 800000)
  assert.equal(zero.delta.versusBaseline.percent, null)
})
check('latest earlier baseline wins regardless of input order', () => {
  const measurements = [salary('old', 'baseline', 700000, '2026-01-01'), salary('recent', 'baseline', 1000000, '2026-08-01'), salary('l', 'new_role', 1200000, '2026-10-01')]
  const first = buildChileImpact({ ...empty, salary: measurements }, null, computedAt)
  const reverse = buildChileImpact({ ...empty, salary: [...measurements].reverse() }, null, computedAt)
  assert.deepEqual(first, reverse)
  assert.equal(first.observed.salary.baseline?.recordId, 'recent')
})
check('baseline after or on the same date never creates a longitudinal delta', () => {
  for (const date of ['2026-10-01', '2026-10-02']) {
    const result = buildChileImpact({ ...empty, salary: [salary('b', 'baseline', 900000, date), salary('l', 'new_role', 1200000, '2026-10-01')] }, null, computedAt)
    assert.equal(result.delta.versusBaseline.status, 'no_earlier_baseline')
    assert.equal(result.delta.versusBaseline.monthlyClp, null)
    assert.equal(result.projection.annualizedLiftClp, null)
  }
})
check('conflicting same-date measurements require resolution', () => {
  const b = salary('b', 'baseline', 900000, '2026-08-01')
  const l = salary('l', 'new_role', 1200000, '2026-10-01')
  const latestConflict = selectChileSalaryPair([b, l, salary('l2', 'follow_up', 1300000, '2026-10-01')], computedAt)
  assert.equal(latestConflict.status, 'ambiguous_latest')
  assert.equal(latestConflict.latest, null)
  assert.deepEqual(latestConflict.conflictingRecordIds, ['l', 'l2'])
  const baselineConflict = selectChileSalaryPair([b, l, salary('b2', 'baseline', 950000, '2026-08-01')], computedAt)
  assert.equal(baselineConflict.status, 'ambiguous_baseline')
  assert.equal(baselineConflict.baseline, null)
  const baselineOnlyConflict = selectChileSalaryPair([b, salary('b2', 'baseline', 950000, '2026-08-01')], computedAt)
  assert.equal(baselineOnlyConflict.status, 'ambiguous_baseline')
  assert.equal(baselineOnlyConflict.baseline, null)
  assert.deepEqual(baselineOnlyConflict.conflictingRecordIds, ['b', 'b2'])
})
check('future dates, invalid amounts, invalid dates and future-created records are excluded', () => {
  const result = buildChileImpact({ ...empty, salary: [
    salary('b', 'baseline', 1000000, '2026-08-01'), salary('l', 'new_role', 1200000, '2026-10-01'),
    salary('future-date', 'follow_up', 1500000, '2026-11-01'), salary('invalid-number', 'new_role', NaN, '2026-10-02'),
    salary('invalid-date', 'new_role', 2000000, '2026-02-30'), { ...salary('future-created', 'follow_up', 3000000, '2026-10-02'), created_at: '2026-11-01T12:00:00Z' },
  ] }, null, computedAt)
  assert.equal(result.observed.salary.latest?.recordId, 'l')
  assert.equal(result.evidenceCoverage.excludedInvalidOrFuture.salary, 4)
})
check('verification belongs to the actual pair, not unrelated verified observations', () => {
  const result = buildChileImpact({ ...empty, salary: [
    salary('b', 'baseline', 1000000, '2026-08-01'),
    { ...salary('l', 'new_role', 1200000, '2026-10-01'), verification_status: 'verified' },
    { ...salary('old-verified', 'baseline', 700000, '2026-01-01'), verification_status: 'verified' },
  ] }, null, computedAt)
  assert.equal(result.verification.verifiedSalaryMeasurements, 2)
  assert.equal(result.verification.salaryPair, 'self_reported')
})
check('job interval uses Santiago calendar days and later starts, excluding promotions', () => {
  assert.equal(chileCalendarDate('2026-01-02T01:00:00Z'), '2026-01-01')
  const result = buildChileImpact({ ...empty,
    events: [{ ...record('app'), event_type: 'application', occurred_at: '2026-01-02T01:00:00Z' }],
    employment: [
      { ...record('old-job'), outcome_type: 'job_started', effective_date: '2025-12-01', region_code: null, occupation_code: null, employment_category: null },
      { ...record('promotion'), outcome_type: 'promotion', effective_date: '2026-01-01', region_code: null, occupation_code: null, employment_category: null },
      { ...record('new-job'), outcome_type: 'job_started', effective_date: '2026-01-03', region_code: null, occupation_code: null, employment_category: null },
    ],
  }, null, computedAt)
  assert.equal(result.observed.employment.timeToJobDays, 2)
  assert.equal(result.observed.employment.employmentRecordId, 'new-job')
})
check('future Chile calendar day is not current salary near UTC midnight', () => {
  const result = buildChileImpact({ ...empty, salary: [
    { ...salary('today', 'new_role', 1000000, '2026-10-01'), created_at: '2026-10-02T00:30:00Z' },
    { ...salary('tomorrow', 'new_role', 1500000, '2026-10-02'), created_at: '2026-10-02T00:30:00Z' },
  ] }, null, '2026-10-02T01:00:00Z')
  assert.equal(result.observed.salary.latest?.recordId, 'today')
  assert.equal(result.evidenceCoverage.included.salary, 1)
})
check('followups separate scheduled, overdue, completed and unknown employment', () => {
  const result = buildChileImpact({ ...empty,
    employment: [{ ...record('job'), outcome_type: 'job_started', effective_date: '2026-08-01', region_code: null, occupation_code: null, employment_category: null }],
    followups: [
      { ...record('f30'), verification_status: 'verified', employment_outcome_id: 'job', followup_day: 30, due_at: '2026-08-31', completed_at: '2026-09-01T12:00:00Z', employment_active: null, same_role: null },
      { ...record('f90'), employment_outcome_id: 'job', followup_day: 90, due_at: '2026-10-30', completed_at: '2026-10-01T12:00:00Z', employment_active: true, same_role: true },
      { ...record('f180'), employment_outcome_id: 'job', followup_day: 180, due_at: '2027-01-28', completed_at: null, employment_active: null, same_role: null },
      { ...record('unlinked'), employment_outcome_id: 'unknown-job', followup_day: 30, due_at: '2026-08-31', completed_at: null, employment_active: null, same_role: null },
    ],
  }, null, computedAt)
  assert.equal(result.observed.retention[0].completed, 1)
  assert.equal(result.observed.retention[0].employmentUnknown, 1)
  assert.equal(result.observed.retention[0].employmentActive, 0)
  assert.equal(result.observed.retention[0].verification, 'self_reported', 'unverified employment date limits retention evidence')
  assert.equal(result.observed.retention[1].pending, 1)
  assert.equal(result.observed.retention[1].completed, 0, 'early completion does not prove day-90 retention')
  assert.equal(result.observed.retention[2].pending, 1)
  assert.equal(result.evidenceCoverage.excludedInvalidOrFuture.followups, 1)
})
check('event ratios are explicitly distinct from process conversion rates', () => {
  const result = buildChileImpact({ ...empty, events: [
    { ...record('a'), event_type: 'application', occurred_at: '2026-09-01T12:00:00Z' },
    { ...record('i1'), event_type: 'interview', occurred_at: '2026-09-02T12:00:00Z' },
    { ...record('i2'), event_type: 'interview', occurred_at: '2026-09-03T12:00:00Z' },
  ] }, null, computedAt)
  assert.equal(result.observed.jobSearch.interviewRate, 200)
  assert.equal(result.observed.jobSearch.rateBasis, 'recorded_event_ratio_not_process_conversion')
})
check('invalid computation time fails instead of producing NaN', () => {
  assert.throws(() => buildChileImpact(empty, null, 'invalid'), /INVALID_IMPACT_COMPUTED_AT/)
})

console.log(JSON.stringify({ outcomesChileImpact: 'PASS', cases, evidence: 'synthetic-runtime', causalClaim: false, realizedAnnualIncomeClaim: false }))
