import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { isAbsolute } from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  parseOfficialChileBenchmarkManifest,
  prepareOfficialChileBenchmarkImport,
  renderOfficialChileBenchmarkSql,
  verifyOfficialChileSourceBytes,
} from '../lib/outcomes-chile/official-benchmark-import'
import { selectChileBenchmark } from '../lib/outcomes-chile/benchmark-selector'
import { buildChileImpact } from '../lib/outcomes-chile/impact'

const manifest = JSON.parse(readFileSync('data/outcomes-chile/official/ine-esi-2025-national.v1.json', 'utf8'))
const plan = prepareOfficialChileBenchmarkImport(manifest)
assert.equal(plan.rows.length, 2)
assert.equal(plan.comparability, 'context_only_not_harmonized')
assert.deepEqual(plan.rows.map(row => [row.metric_key, row.value_numeric]), [
  ['monthly_labor_income_mean', 962945], ['monthly_labor_income_median', 680000],
])
for (const row of plan.rows) {
  assert.match(row.id, /^[a-f0-9]{8}-[a-f0-9]{4}-5[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/)
  assert.equal(row.sample_size, null, 'Household count and expanded population must never become person sample size')
  assert.equal(row.reliability_status, 'official_published')
  assert.equal(row.source_period, '2025')
  assert.equal(row.published_at, '2026-07-14')
  for (const dimension of ['region_code', 'occupation_code', 'education_level', 'employment_category', 'industry_code']) assert.equal(row[dimension], null)
}
const median = selectChileBenchmark(plan.rows, { metricKey: 'monthly_labor_income_median', regionCode: '13' }, '2026-10-07')!
assert.equal(median.specificity, 'national', 'No fabricated regional or occupation specificity')
assert.equal(median.value, 680000)
assert.equal(selectChileBenchmark(plan.rows, { metricKey: 'monthly_labor_income_median' }, '2026-07-13'), null, 'No look-ahead before actual publication')
assert.ok(selectChileBenchmark(plan.rows, { metricKey: 'monthly_labor_income_median' }, '2026-07-14'))
const withOfficialContext = buildChileImpact({ events: [], employment: [], followups: [], salary: [{
  id: 'synthetic-income-for-comparability-check', created_at: '2026-10-01T12:00:00Z',
  verification_status: 'self_reported', measurement_role: 'new_role', monthly_net_clp: 1000000,
  measured_at: '2026-10-01', employment_outcome_id: null,
}] }, median, '2026-10-07T14:00:00Z')
assert.equal(withOfficialContext.benchmark?.value, 680000)
assert.deepEqual(withOfficialContext.delta.versusBenchmark, {
  comparable: false, reason: 'income_definition_mismatch', monthlyClp: null, percent: null,
}, 'Published net ESI income still cannot bypass the existing DTC harmonization boundary')

const reversedKeys = Object.fromEntries(Object.entries(manifest).reverse())
assert.deepEqual(prepareOfficialChileBenchmarkImport(reversedKeys), plan, 'Key ordering cannot change identity or reviewed hash')
const reorderedRows = structuredClone(manifest)
reorderedRows.observations.reverse()
assert.deepEqual(prepareOfficialChileBenchmarkImport(reorderedRows).rows, plan.rows, 'Row order is deterministic')
const changed = structuredClone(manifest)
changed.observations[0].valueNumeric += 1
const changedPlan = prepareOfficialChileBenchmarkImport(changed)
assert.deepEqual(changedPlan.rows.map(row => row.id), plan.rows.map(row => row.id), 'A corrected number under the same version must conflict instead of becoming a duplicate')
assert.notEqual(changedPlan.manifestSha256, plan.manifestSha256)
assert.throws(() => renderOfficialChileBenchmarkSql(changed, plan.manifestSha256), /reviewed manifest hash changed/)

let rejectedManifests = 0
const reject = (mutate: (copy: typeof manifest) => void) => {
  const copy = structuredClone(manifest)
  mutate(copy)
  assert.throws(() => parseOfficialChileBenchmarkManifest(copy))
  rejectedManifests += 1
}
reject(copy => { copy.scope.level = 'regional' })
reject(copy => { copy.scope.sex = 'women' })
reject(copy => { copy.scope.regionCode = '13' })
reject(copy => { copy.observations[0].occupation_code = '2' })
reject(copy => { copy.quality.sampleSize = copy.quality.achievedDwellings })
reject(copy => { copy.quality.sampleSize = copy.quality.expandedEmployedPopulation })
reject(copy => { copy.quality.reliabilityStatus = 'official_microdata_derived' })
reject(copy => { copy.quality.reliabilityStatus = 'suppressed_low_sample' })
reject(copy => { copy.incomeDefinition.dtcComparability = 'comparable' })
reject(copy => { copy.incomeDefinition.variable = 'ing_t_t' })
reject(copy => { copy.incomeDefinition.measure = 'gross_income' })
reject(copy => { copy.incomeDefinition.priceBasis = '2024-10' })
reject(copy => { copy.incomeDefinition.referencePeriod = '2025-01/2025-12' })
reject(copy => { copy.incomeDefinition.collectionPeriod = '2024-10/2025-12' })
reject(copy => { copy.publishedAt = '2026-02-30' })
reject(copy => { copy.publishedAt = '2026-10-08' })
reject(copy => { copy.publishedAt = '2025-12-30' })
reject(copy => { copy.preparedAsOf = '2026-07-13' })
reject(copy => { copy.documents[0].retrievedAt = '2026-10-08' })
reject(copy => { copy.documents[0].retrievedAt = '2026-07-13' })
reject(copy => { copy.sourceVersion = 'ine-esi-2024-national-20260714-v1' })
reject(copy => { copy.documents[0].url = 'https://www.ine.gob.cl.example.com/source.pdf' })
reject(copy => { copy.documents[0].url = 'http://www.ine.gob.cl/source.pdf' })
reject(copy => { copy.documents[0].filename = '../source.pdf' })
reject(copy => { copy.documents[0].sha256 = 'unverified' })
reject(copy => { copy.documents[0].id = copy.documents[1].id })
reject(copy => { copy.sourceDocumentId = 'missing' })
reject(copy => { copy.observations[0].evidence[0].pdfPage = 27 })
reject(copy => { copy.observations[0].evidence[0].documentId = 'missing' })
reject(copy => { copy.observations[0].evidence = [copy.observations[0].evidence[1]] })
reject(copy => { copy.observations[0].metricKey = 'unemployment_rate' })
reject(copy => { copy.observations[1].metricKey = copy.observations[0].metricKey })
reject(copy => { copy.observations[0].valueNumeric = '962.945' })
reject(copy => { copy.observations[0].valueNumeric = Number.NaN })
reject(copy => { copy.observations[0].valueNumeric = -1 })
reject(copy => { copy.observations[0].valueNumeric = Number.MAX_SAFE_INTEGER + 1 })
reject(copy => { copy.observations[0].unit = 'clp_year' })

// Synthetic bytes exercise integrity checking; they are never represented as an
// official PDF. The CLI separately verifies the downloaded original files.
const syntheticPdf = Buffer.from('%PDF-1.7\nsynthetic checksum fixture\n')
const syntheticDocument = {
  ...manifest.documents[0],
  byteLength: syntheticPdf.length,
  sha256: createHash('sha256').update(syntheticPdf).digest('hex'),
}
verifyOfficialChileSourceBytes(syntheticDocument, syntheticPdf)
assert.throws(() => verifyOfficialChileSourceBytes(syntheticDocument, Buffer.from(syntheticPdf.toString().replace('fixture', 'changed'))), /checksum mismatch/)
const notPdf = Buffer.from('<html>not a pdf</html>')
assert.throws(() => verifyOfficialChileSourceBytes({ ...syntheticDocument, byteLength: notPdf.length,
  sha256: createHash('sha256').update(notPdf).digest('hex') }, notPdf), /not a PDF/)

const sql = renderOfficialChileBenchmarkSql(manifest, plan.manifestSha256)
assert.equal(sql, renderOfficialChileBenchmarkSql(manifest, plan.manifestSha256))
assert.match(sql, /on conflict \(id\) do nothing/)
assert.doesNotMatch(sql, /\b(update|delete|create table|alter table)\b/i)
assert.match(sql, /DTC_OFFICIAL_BENCHMARK_IMMUTABLE_CONTENT_CONFLICT/)

async function verifySql(): Promise<boolean> {
  const modulePath = process.env.DTC_OUTCOMES_PGLITE_MODULE
  if (!modulePath) return false
  assert.ok(isAbsolute(modulePath), 'PGlite must be an explicit local module path')
  const { PGlite } = await import(pathToFileURL(modulePath).href)
  const db = new PGlite()
  try {
    const foundation = readFileSync('supabase/migrations/20261007143246_dtc_outcomes_chile_foundation.sql', 'utf8')
    const start = foundation.indexOf('create table if not exists public.dtc_chile_benchmarks')
    const end = foundation.indexOf('create table if not exists public.dtc_outcome_verifications')
    assert.ok(start >= 0 && end > start)
    await db.exec(foundation.slice(start, end))
    await db.exec(sql)
    await db.exec(sql)
    assert.equal((await db.query('select count(*)::int as count from public.dtc_chile_benchmarks')).rows[0].count, 2, 'Repeated import creates exactly two rows')
    await db.query('delete from public.dtc_chile_benchmarks where metric_key=$1', ['monthly_labor_income_median'])
    let conflict: unknown
    try { await db.exec(renderOfficialChileBenchmarkSql(changed, changedPlan.manifestSha256)) } catch (error) { conflict = error }
    assert.ok(conflict)
    assert.match(String(conflict), /DTC_OFFICIAL_BENCHMARK_IMMUTABLE_CONTENT_CONFLICT/)
    await db.exec('rollback')
    assert.equal(Number((await db.query("select value_numeric from public.dtc_chile_benchmarks where metric_key='monthly_labor_income_mean'")).rows[0].value_numeric), 962945)
    assert.equal((await db.query('select count(*)::int as count from public.dtc_chile_benchmarks')).rows[0].count, 1, 'An immutable conflict rolls back even the other valid insertion in the batch')
    // Existing historical rows with another ID must not silently duplicate the
    // same publication/period/scope. The batch must fail without adding rows.
    await db.exec('delete from public.dtc_chile_benchmarks')
    const one = plan.rows[0]
    await db.query(`insert into public.dtc_chile_benchmarks
      (id,source_key,source_period,metric_key,value_numeric,unit,reliability_status,source_ref,published_at)
      values ('00000000-0000-4000-8000-000000000001',$1,$2,$3,$4,$5,$6,$7,$8)`,
    [one.source_key, one.source_period, one.metric_key, one.value_numeric, one.unit, one.reliability_status, one.source_ref, one.published_at])
    await assert.rejects(db.exec(sql), /DTC_OFFICIAL_BENCHMARK_EQUIVALENT_VERSION_EXISTS/)
    await db.exec('rollback')
    assert.equal((await db.query('select count(*)::int as count from public.dtc_chile_benchmarks')).rows[0].count, 1)
    return true
  } finally { await db.close() }
}

verifySql().then(databaseVerified => console.log(JSON.stringify({
  officialImport: 'GO', rows: 2, sourceVersion: plan.sourceVersion,
  manifestSha256: plan.manifestSha256, rejectedManifests,
  sourceByteIntegrity: true, sqlExecutedInDisposablePglite: databaseVerified,
  remoteWrites: 0, comparability: plan.comparability,
}))).catch(error => { console.error(error); process.exitCode = 1 })
