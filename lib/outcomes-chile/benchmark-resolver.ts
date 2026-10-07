import { createAdminClient } from '@/lib/supabase/server'
import { requireChileBenchmarkAsOf, selectChileBenchmark } from './benchmark-selector'
import type { ChileBenchmarkRequest, ChileBenchmarkRow, ResolvedChileBenchmark } from './benchmark-selector'

export type {
  BenchmarkSpecificity,
  ChileBenchmarkMetric,
  ChileBenchmarkRequest,
  ChileBenchmarkRow,
  ResolvedChileBenchmark,
} from './benchmark-selector'

const PAGE_SIZE = 500
const MAX_BENCHMARK_ROWS = 20_000
const COLUMNS = 'id,source_key,source_period,metric_key,region_code,occupation_code,education_level,employment_category,industry_code,value_numeric,unit,sample_size,reliability_status,source_ref,published_at'
type BenchmarkDatabase = Pick<ReturnType<typeof createAdminClient>, 'from'>

export async function resolveChileBenchmark(request: ChileBenchmarkRequest, database?: BenchmarkDatabase): Promise<ResolvedChileBenchmark | null> {
  const asOf = requireChileBenchmarkAsOf(request.asOf ?? new Date().toISOString().slice(0, 10))
  const db = database ?? createAdminClient()
  const rows: ChileBenchmarkRow[] = []
  const ids = new Set<string>()
  let expectedCount: number | null = null

  // Supabase limits result sizes. Never choose a fallback from a truncated set.
  do {
    const { data, error, count } = await db.from('dtc_chile_benchmarks')
      .select(COLUMNS, { count: 'exact' })
      .eq('metric_key', request.metricKey)
      .in('reliability_status', ['official_published', 'official_microdata_derived'])
      .lte('published_at', asOf)
      .order('id', { ascending: true })
      .range(rows.length, rows.length + PAGE_SIZE - 1)
    if (error) throw error
    if (!Number.isSafeInteger(count) || count === null || count < 0) throw new Error('CHILE_BENCHMARK_COUNT_UNAVAILABLE')
    if (count > MAX_BENCHMARK_ROWS) throw new Error('CHILE_BENCHMARK_RESULT_LIMIT_EXCEEDED')
    if (expectedCount !== null && count !== expectedCount) throw new Error('CHILE_BENCHMARK_DATA_CHANGED_RETRY')
    expectedCount = count
    const page = (data ?? []) as unknown as ChileBenchmarkRow[]
    if (page.length !== Math.min(PAGE_SIZE, expectedCount - rows.length)) throw new Error('CHILE_BENCHMARK_INCOMPLETE_READ')
    for (const row of page) {
      if (ids.has(row.id)) throw new Error('CHILE_BENCHMARK_DATA_CHANGED_RETRY')
      ids.add(row.id)
      rows.push(row)
    }
  } while (rows.length < expectedCount)

  return selectChileBenchmark(rows, request, asOf)
}
