export type BenchmarkSpecificity =
  | 'region_occupation_education'
  | 'region_occupation'
  | 'occupation'
  | 'region'
  | 'national'

export type ChileBenchmarkMetric =
  | 'monthly_labor_income_mean'
  | 'monthly_labor_income_median'
  | 'employment_rate'
  | 'unemployment_rate'
  | 'vacancy_demand'
  | 'skill_demand'

export type ChileBenchmarkUnit = 'clp_month' | 'percent' | 'count' | 'index'
export type ChileBenchmarkSource = 'ine_esi' | 'ine_ene' | 'sence_enadel' | 'other_official'
export type ChileBenchmarkReliability = 'official_published' | 'official_microdata_derived'
export type ChileBenchmarkPeriodPrecision = 'year' | 'quarter' | 'month' | 'date' | 'range'

export interface ChileBenchmarkRequest {
  metricKey: ChileBenchmarkMetric
  regionCode?: string | null
  occupationCode?: string | null
  educationLevel?: string | null
  employmentCategory?: string | null
  industryCode?: string | null
  /** Inclusive publication/observation cutoff, in YYYY-MM-DD format. */
  asOf?: string
}

/** Raw database values are checked before becoming a resolved benchmark. */
export interface ChileBenchmarkRow {
  id: string
  source_key: string
  source_period: string
  metric_key: string
  region_code: string | null
  occupation_code: string | null
  education_level: string | null
  employment_category: string | null
  industry_code: string | null
  value_numeric: number | string | null
  unit: string
  sample_size: number | null
  reliability_status: string
  source_ref: string
  published_at: string | null
}

export interface ResolvedChileBenchmark {
  benchmarkId: string
  specificity: BenchmarkSpecificity
  metricKey: ChileBenchmarkMetric
  value: number
  unit: ChileBenchmarkUnit
  sourceKey: ChileBenchmarkSource
  sourcePeriod: string
  sourcePeriodStart: string
  sourcePeriodEnd: string
  sourcePeriodPrecision: ChileBenchmarkPeriodPrecision
  sourceRef: string
  publishedAt: string
  reliabilityStatus: ChileBenchmarkReliability
  sampleSize: number | null
  dimensions: {
    regionCode: string | null
    occupationCode: string | null
    educationLevel: string | null
    employmentCategory: string | null
    industryCode: string | null
  }
  asOf: string
  resolutionVersion: 'chile-benchmark-v2'
}

interface BenchmarkPeriod {
  start: string
  end: string
  precision: ChileBenchmarkPeriodPrecision
}

interface RankedBenchmark {
  benchmark: ResolvedChileBenchmark
  specificityScore: number
  cohortScore: number
  periodEnd: number
  publishedAt: number
}

const metricUnits: Record<ChileBenchmarkMetric, readonly ChileBenchmarkUnit[]> = {
  monthly_labor_income_mean: ['clp_month'],
  monthly_labor_income_median: ['clp_month'],
  employment_rate: ['percent'],
  unemployment_rate: ['percent'],
  vacancy_demand: ['count', 'percent', 'index'],
  skill_demand: ['count', 'percent', 'index'],
}

function dateTime(value: unknown): number | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const time = Date.parse(`${value}T00:00:00.000Z`)
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value ? time : null
}

export function requireChileBenchmarkAsOf(asOf: string): string {
  if (dateTime(asOf) === null) throw new Error('INVALID_CHILE_BENCHMARK_AS_OF')
  return asOf
}

function monthEnd(year: string, month: number): string {
  const first = new Date(`${year}-${String(month).padStart(2, '0')}-01T00:00:00.000Z`)
  first.setUTCMonth(first.getUTCMonth() + 1, 0)
  return first.toISOString().slice(0, 10)
}

/** Only unambiguous periods are eligible; free-text labels are never date-sorted. */
function parsePeriod(value: string): BenchmarkPeriod | null {
  if (/^\d{4}$/.test(value)) return { start: `${value}-01-01`, end: `${value}-12-31`, precision: 'year' }
  const quarter = /^(\d{4})-[QT]([1-4])$/.exec(value)
  if (quarter) {
    const lastMonth = Number(quarter[2]) * 3
    return {
      start: `${quarter[1]}-${String(lastMonth - 2).padStart(2, '0')}-01`,
      end: monthEnd(quarter[1], lastMonth),
      precision: 'quarter',
    }
  }
  if (/^\d{4}-\d{2}$/.test(value) && dateTime(`${value}-01`) !== null) {
    return { start: `${value}-01`, end: monthEnd(value.slice(0, 4), Number(value.slice(5))), precision: 'month' }
  }
  if (dateTime(value) !== null) return { start: value, end: value, precision: 'date' }
  const range = value.split('/')
  if (range.length !== 2) return null
  const first = parsePeriod(range[0])
  const last = parsePeriod(range[1])
  if (!first || !last || dateTime(first.start)! > dateTime(last.start)! || dateTime(first.end)! > dateTime(last.end)!) return null
  return { start: first.start, end: last.end, precision: 'range' }
}

function finiteValue(value: ChileBenchmarkRow['value_numeric']): number | null {
  if (typeof value !== 'number' && (typeof value !== 'string' || !/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim()))) return null
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric >= 0 && numeric <= Number.MAX_SAFE_INTEGER ? numeric : null
}

function validDimension(value: unknown): value is string | null {
  return value === null || (typeof value === 'string' && value.trim().length > 0)
}

function matchSpecificity(row: ChileBenchmarkRow, request: ChileBenchmarkRequest): { score: number; level: BenchmarkSpecificity } | null {
  const dimensions = [
    [row.region_code, request.regionCode],
    [row.occupation_code, request.occupationCode],
    [row.education_level, request.educationLevel],
    [row.employment_category, request.employmentCategory],
    [row.industry_code, request.industryCode],
  ]
  // A row describing a subgroup must match an explicitly known request dimension.
  if (dimensions.some(([actual, wanted]) => !validDimension(actual) || (actual !== null && actual !== wanted))) return null
  const region = row.region_code !== null
  const occupation = row.occupation_code !== null
  const education = row.education_level !== null
  if (region && occupation && education) return { score: 50, level: 'region_occupation_education' }
  if (region && occupation && !education) return { score: 40, level: 'region_occupation' }
  if (!region && occupation && !education) return { score: 30, level: 'occupation' }
  if (region && !occupation && !education) return { score: 20, level: 'region' }
  if (!region && !occupation && !education) return { score: 10, level: 'national' }
  return null
}

function compare(a: RankedBenchmark, b: RankedBenchmark): number {
  return b.specificityScore - a.specificityScore
    || b.cohortScore - a.cohortScore
    || b.periodEnd - a.periodEnd
    || b.publishedAt - a.publishedAt
    || (a.benchmark.benchmarkId < b.benchmark.benchmarkId ? -1 : a.benchmark.benchmarkId > b.benchmark.benchmarkId ? 1 : 0)
}

/**
 * Deterministic selection from the complete candidate set. The explicit asOf wins
 * over request.asOf. Period end and publication must both be on/before that day.
 * Missing publication dates and unparseable periods cannot establish eligibility.
 * clp_month labor-income benchmarks never establish net-pay comparability.
 */
export function selectChileBenchmark(
  rows: readonly ChileBenchmarkRow[],
  request: ChileBenchmarkRequest,
  asOf: string,
): ResolvedChileBenchmark | null {
  requireChileBenchmarkAsOf(asOf)
  const cutoff = dateTime(asOf)!
  const acceptedUnits = Object.prototype.hasOwnProperty.call(metricUnits, request.metricKey) ? metricUnits[request.metricKey] : null
  if (!acceptedUnits) return null
  let best: RankedBenchmark | null = null
  for (const row of rows) {
    if (row.metric_key !== request.metricKey || !acceptedUnits.includes(row.unit as ChileBenchmarkUnit)) continue
    if (row.reliability_status !== 'official_published' && row.reliability_status !== 'official_microdata_derived') continue
    if (!['ine_esi', 'ine_ene', 'sence_enadel', 'other_official'].includes(row.source_key)) continue
    if (typeof row.id !== 'string' || !row.id.trim() || typeof row.source_ref !== 'string' || !row.source_ref.trim()) continue
    if (typeof row.source_period !== 'string') continue
    const value = finiteValue(row.value_numeric)
    if (value === null || (row.unit === 'percent' && value > 100) || (row.unit === 'count' && !Number.isSafeInteger(value))) continue
    if (row.sample_size !== null && (!Number.isSafeInteger(row.sample_size) || row.sample_size <= 0)) continue
    const period = parsePeriod(row.source_period)
    const publishedAt = dateTime(row.published_at)
    if (!period || publishedAt === null) continue
    const periodEnd = dateTime(period.end)!
    if (publishedAt > cutoff || periodEnd > cutoff || publishedAt < periodEnd) continue
    const match = matchSpecificity(row, request)
    if (!match) continue
    const candidate: RankedBenchmark = {
      specificityScore: match.score,
      cohortScore: Number(row.employment_category !== null) + Number(row.industry_code !== null),
      periodEnd,
      publishedAt,
      benchmark: {
        benchmarkId: row.id,
        specificity: match.level,
        metricKey: request.metricKey,
        value,
        unit: row.unit as ChileBenchmarkUnit,
        sourceKey: row.source_key as ChileBenchmarkSource,
        sourcePeriod: row.source_period,
        sourcePeriodStart: period.start,
        sourcePeriodEnd: period.end,
        sourcePeriodPrecision: period.precision,
        sourceRef: row.source_ref,
        publishedAt: row.published_at!,
        reliabilityStatus: row.reliability_status,
        sampleSize: row.sample_size,
        dimensions: {
          regionCode: row.region_code,
          occupationCode: row.occupation_code,
          educationLevel: row.education_level,
          employmentCategory: row.employment_category,
          industryCode: row.industry_code,
        },
        asOf,
        resolutionVersion: 'chile-benchmark-v2',
      },
    }
    if (!best || compare(candidate, best) < 0) best = candidate
  }
  return best?.benchmark ?? null
}
