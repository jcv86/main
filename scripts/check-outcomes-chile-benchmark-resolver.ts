import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { selectChileBenchmark } from '../lib/outcomes-chile/benchmark-selector'
import type { ChileBenchmarkMetric, ChileBenchmarkRequest, ChileBenchmarkRow } from '../lib/outcomes-chile/benchmark-selector'

// Synthetic selector fixtures only; these are not official Chile benchmark data.
function row(changes: Partial<ChileBenchmarkRow> = {}): ChileBenchmarkRow {
  return {
    id: 'fixture-national',
    source_key: 'ine_esi',
    source_period: '2025',
    metric_key: 'monthly_labor_income_median',
    region_code: null,
    occupation_code: null,
    education_level: null,
    employment_category: null,
    industry_code: null,
    value_numeric: 1000,
    unit: 'clp_month',
    sample_size: 100,
    reliability_status: 'official_published',
    source_ref: 'urn:dtc:test-fixture:income',
    published_at: '2026-06-01',
    ...changes,
  }
}

const asOf = '2026-10-07'
const request: ChileBenchmarkRequest = {
  metricKey: 'monthly_labor_income_median',
  regionCode: '13',
  occupationCode: 'fixture-occupation',
  educationLevel: 'fixture-education',
  employmentCategory: 'private_employee',
  industryCode: 'fixture-industry',
}
const select = (rows: readonly ChileBenchmarkRow[], changes: Partial<ChileBenchmarkRequest> = {}, cutoff = asOf) =>
  selectChileBenchmark(rows, { ...request, ...changes }, cutoff)

assert.equal(select([]), null, 'An empty dataset is not a zero-valued benchmark')
assert.equal(select([row({ metric_key: 'monthly_labor_income_mean' })]), null, 'The requested metric must match')
for (const metricKey of ['monthly_net_income_median', 'toString'] as unknown as ChileBenchmarkMetric[]) {
  assert.equal(select([row()], { metricKey }), null, 'Unknown metrics are ineligible')
}

const levels = [
  row({ id: 'fixture-exact', region_code: '13', occupation_code: 'fixture-occupation', education_level: 'fixture-education' }),
  row({ id: 'fixture-region-occupation', region_code: '13', occupation_code: 'fixture-occupation' }),
  row({ id: 'fixture-occupation', occupation_code: 'fixture-occupation' }),
  row({ id: 'fixture-region', region_code: '13' }),
  row(),
]
const expectedLevels = ['region_occupation_education', 'region_occupation', 'occupation', 'region', 'national']
for (let index = 0; index < levels.length; index += 1) {
  const result = select([...levels.slice(index)].reverse())
  assert.equal(result?.benchmarkId, levels[index].id, 'Specificity fallback remains ordered')
  assert.equal(result?.specificity, expectedLevels[index])
}
assert.equal(select([
  { ...levels[0], source_period: '2024', published_at: '2025-06-01' },
  row(),
])?.benchmarkId, 'fixture-exact', 'Recency does not override the existing specificity fallback')

const fullySpecific = row({
  ...levels[0],
  employment_category: 'private_employee',
  industry_code: 'fixture-industry',
})
for (const key of ['regionCode', 'occupationCode', 'educationLevel', 'employmentCategory', 'industryCode'] as const) {
  for (const mismatch of [undefined, null, 'different']) {
    assert.equal(select([fullySpecific, row()], { [key]: mismatch })?.benchmarkId, 'fixture-national', `A ${key} subgroup requires a known matching dimension`)
  }
}
for (const changes of [
  { employment_category: 'self_employed' },
  { industry_code: 'other-industry' },
  { education_level: 'fixture-education' },
  { region_code: '13', education_level: 'fixture-education' },
  { region_code: '' },
  { employment_category: ' ' },
]) {
  assert.equal(select([row(changes)]), null, 'Unsupported or mismatched subgroup rows are not national aggregates')
}
assert.equal(select([
  row(),
  row({ id: 'fixture-category', employment_category: 'private_employee' }),
  row({ id: 'fixture-category-industry', employment_category: 'private_employee', industry_code: 'fixture-industry' }),
])?.benchmarkId, 'fixture-category-industry', 'Known matching subgroup dimensions refine equal specificity')

for (const value_numeric of [null, NaN, Infinity, -Infinity, -1, '', ' ', 'text', '0x10', '1,000', 'Infinity', '1e1000', Number.MAX_SAFE_INTEGER + 1]) {
  assert.equal(select([row({ value_numeric })]), null, `Invalid numeric benchmark: ${String(value_numeric)}`)
}
assert.equal(select([row({ value_numeric: '1.2e3' })])?.value, 1200, 'Postgres decimal numeric strings are accepted explicitly')
assert.equal(select([row({ value_numeric: 0 })])?.value, 0, 'A real zero remains distinguishable from missing data')
for (const unit of ['percent', 'count', 'index', 'monthly_net_clp', 'CLP']) {
  assert.equal(select([row({ unit })]), null, 'Labor income requires clp_month and does not imply net pay')
}
for (const metricKey of ['employment_rate', 'unemployment_rate'] as const) {
  for (const value of [0, 100]) {
    assert.equal(select([row({ metric_key: metricKey, unit: 'percent', value_numeric: value })], { metricKey })?.value, value)
  }
  for (const invalid of [row({ metric_key: metricKey, unit: 'clp_month' }), row({ metric_key: metricKey, unit: 'percent', value_numeric: 100.01 })]) {
    assert.equal(select([invalid], { metricKey }), null, 'Rates require percentage units and a 0–100 value')
  }
}
for (const metricKey of ['vacancy_demand', 'skill_demand'] as const) {
  for (const unit of ['count', 'percent', 'index']) {
    assert.equal(select([row({ metric_key: metricKey, unit, value_numeric: 10 })], { metricKey })?.unit, unit)
  }
  assert.equal(select([row({ metric_key: metricKey, unit: 'count', value_numeric: 1.5 })], { metricKey }), null, 'Counts require whole values')
  assert.equal(select([row({ metric_key: metricKey, unit: 'percent', value_numeric: 101 })], { metricKey }), null)
  assert.equal(select([row({ metric_key: metricKey, unit: 'clp_month' })], { metricKey }), null)
}
for (const reliability_status of ['suppressed_low_sample', 'self_reported', '', 'unknown']) {
  assert.equal(select([row({ reliability_status })]), null, 'Only recognized official reliability statuses are eligible')
}
assert.equal(select([row({ reliability_status: 'official_microdata_derived' })])?.reliabilityStatus, 'official_microdata_derived')
for (const sample_size of [0, -1, 1.5, NaN, Infinity]) {
  assert.equal(select([row({ sample_size })]), null, 'A supplied sample size must describe positive whole observations')
}
assert.equal(select([row({ sample_size: null })])?.sampleSize, null, 'An undisclosed sample size is not invented')
for (const source_ref of ['', ' ']) assert.equal(select([row({ source_ref })]), null)
assert.equal(select([row({ source_key: 'unofficial_survey' })]), null)

for (const published_at of [null, '', '2026-02-30', '2026-13-01', '2026-10-08', '2025-01-01']) {
  assert.equal(select([row({ published_at })]), null, 'Publication must be valid, no earlier than the period end, and known by the cutoff')
}
for (const source_period of ['unknown', '2025-Q5', '2025-13', '2025-02-29', '2026', '2026-Q4', '2026-10', '2026-10-08', '2026-04/2026-01']) {
  assert.equal(select([row({ source_period, published_at: asOf })]), null, 'Unknown, invalid and future observation periods are ineligible')
}
assert.equal(select([row({ published_at: asOf })])?.publishedAt, asOf, 'The cutoff includes its calendar day')
for (const cutoff of ['2026-02-30', '2026-13-01', '', '07/10/2026', '2026-10-07T00:00:00Z']) {
  assert.throws(() => select([], {}, cutoff), /INVALID_CHILE_BENCHMARK_AS_OF/, 'An invalid cutoff cannot silently use today')
}
assert.equal(select([row()], { asOf: '2030-01-01' }, '2026-05-31'), null, 'The explicit selector cutoff is authoritative')

const periods = [
  ['2024-02', '2024-02-01', '2024-02-29', 'month'],
  ['2025-Q2', '2025-04-01', '2025-06-30', 'quarter'],
  ['2025-T3', '2025-07-01', '2025-09-30', 'quarter'],
  ['2025-11/2026-01', '2025-11-01', '2026-01-31', 'range'],
  ['2025-12-15/2026-01-14', '2025-12-15', '2026-01-14', 'range'],
  ['2025-12-15', '2025-12-15', '2025-12-15', 'date'],
]
for (const [source_period, start, end, precision] of periods) {
  const result = select([row({ source_period })])
  assert.equal(result?.sourcePeriod, source_period, 'Preserve the original source period label')
  assert.equal(result?.sourcePeriodStart, start)
  assert.equal(result?.sourcePeriodEnd, end)
  assert.equal(result?.sourcePeriodPrecision, precision)
}
assert.equal(select([
  row({ id: 'fixture-quarter', source_period: '2025-Q2' }),
  row({ id: 'fixture-month', source_period: '2025-10' }),
])?.benchmarkId, 'fixture-month', 'Chronological period ends replace lexical label ordering')
assert.equal(select([
  row({ id: 'fixture-later-publication', published_at: '2026-06-02' }),
  row(),
])?.benchmarkId, 'fixture-later-publication', 'Publication date breaks equal-period ties')
const tiedRows = Object.freeze([Object.freeze(row({ id: 'fixture-b' })), Object.freeze(row({ id: 'fixture-a' }))])
assert.equal(select(tiedRows)?.benchmarkId, 'fixture-a', 'A stable ID breaks remaining ties')
assert.deepEqual(select(tiedRows), select([...tiedRows].reverse()), 'Selection does not depend on input order or mutate its input')

const resolved = select([fullySpecific])
assert.deepEqual(resolved, {
  benchmarkId: 'fixture-exact',
  specificity: 'region_occupation_education',
  metricKey: 'monthly_labor_income_median',
  value: 1000,
  unit: 'clp_month',
  sourceKey: 'ine_esi',
  sourcePeriod: '2025',
  sourcePeriodStart: '2025-01-01',
  sourcePeriodEnd: '2025-12-31',
  sourcePeriodPrecision: 'year',
  sourceRef: 'urn:dtc:test-fixture:income',
  publishedAt: '2026-06-01',
  reliabilityStatus: 'official_published',
  sampleSize: 100,
  dimensions: {
    regionCode: '13',
    occupationCode: 'fixture-occupation',
    educationLevel: 'fixture-education',
    employmentCategory: 'private_employee',
    industryCode: 'fixture-industry',
  },
  asOf,
  resolutionVersion: 'chile-benchmark-v2',
}, 'The complete selected reference is reproducible without a net-income equivalence claim')

assert.equal(select([
  ...Array.from({ length: 1001 }, (_, index) => row({ id: `fixture-${index}` })),
  fullySpecific,
])?.benchmarkId, 'fixture-exact', 'The selector considers the complete candidate set beyond the default API limit')

// Supplement behavior checks with the adapter/schema boundary contracts.
const source = readFileSync('lib/outcomes-chile/benchmark-resolver.ts', 'utf8')
const migration = readFileSync('supabase/migrations/20260930200000_dtc_outcomes_chile_foundation.sql', 'utf8')
assert.ok(source.includes('industry_code'), 'The adapter must retrieve the dimension it matches')
assert.ok(source.includes("{ count: 'exact' }") && source.includes('.range('), 'The adapter must not silently select from one API page')
assert.ok(source.includes('CHILE_BENCHMARK_RESULT_LIMIT_EXCEEDED') && source.includes('CHILE_BENCHMARK_INCOMPLETE_READ'))
assert.ok(migration.includes('monthly_labor_income_mean'))
assert.ok(migration.includes('monthly_labor_income_median'))
assert.ok(!migration.includes('monthly_net_income_mean'))
assert.ok(!migration.includes('monthly_net_income_median'))
console.log(JSON.stringify({
  benchmarkResolver: 'PASS',
  fallback: expectedLevels,
  dimensionMismatchExcluded: true,
  invalidNumericUnitReliabilityExcluded: true,
  deterministicAsOf: true,
  sourcePeriodDisclosure: true,
  netIncomeEquivalence: false,
  paginatedAdapterContract: true,
}))
