import { createHash } from 'node:crypto'
import { z } from 'zod'
import { selectChileBenchmark } from './benchmark-selector'
import type { ChileBenchmarkRow } from './benchmark-selector'

// Offline operator boundary. This module has no network, credentials or database client.
// This first format deliberately accepts only national, officially published ESI income.
const text = z.string().trim().min(1).max(1200).refine(value => !value.includes('\0'))
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const timestamp = Date.parse(`${value}T00:00:00.000Z`)
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value
}, 'A real calendar date is required')
const key = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100)
const positiveInteger = z.number().int().positive().max(Number.MAX_SAFE_INTEGER)
const officialUrl = z.string().url().max(480).refine(value => {
  const url = new URL(value)
  return url.protocol === 'https:' && url.hostname === 'www.ine.gob.cl'
    && !url.username && !url.password && !url.port && !url.hash
}, 'An exact HTTPS INE source is required')
const evidence = z.array(z.object({
  documentId: key,
  pdfPage: positiveInteger,
  locator: text,
}).strict()).min(1).max(12)

const manifestSchema = z.object({
  schemaVersion: z.literal('dtc-chile-official-national-income-v1'),
  sourceVersion: key,
  preparedAsOf: date,
  sourceKey: z.literal('ine_esi'),
  publisher: z.literal('Instituto Nacional de Estadísticas de Chile'),
  sourcePeriod: z.string().regex(/^20\d{2}$/),
  originalPeriodLabel: text,
  publishedAt: date,
  publicationEvidenceUrl: officialUrl,
  catalogUrl: officialUrl,
  sourceDocumentId: key,
  documents: z.array(z.object({
    id: key,
    title: text,
    url: officialUrl,
    filename: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*\.pdf$/).max(120),
    mediaType: z.literal('application/pdf'),
    sha256: z.string().regex(/^[0-9a-f]{64}$/),
    byteLength: positiveInteger.max(32 * 1024 * 1024),
    retrievedAt: date,
    pageCount: positiveInteger.max(1000),
  }).strict()).min(1).max(12),
  scope: z.object({
    level: z.literal('national'),
    country: z.literal('CL'),
    sex: z.literal('all'),
    employmentCategories: z.literal('all'),
    populationDefinition: text,
    geographicCoverage: text,
    evidence,
  }).strict(),
  incomeDefinition: z.object({
    variable: z.literal('ing_t_p'),
    occupationScope: z.literal('principal'),
    measure: z.literal('net_labor_income'),
    currency: z.literal('CLP'),
    priceBasis: z.string().regex(/^20\d{2}-10$/),
    collectionPeriod: z.string().regex(/^20\d{2}-10\/20\d{2}-12$/),
    referencePeriod: z.string().regex(/^20\d{2}-09\/20\d{2}-11$/),
    referenceRule: text,
    components: text,
    dtcComparability: z.literal('context_only_not_harmonized'),
    comparabilityReason: text,
    evidence,
  }).strict(),
  quality: z.object({
    reliabilityStatus: z.literal('official_published'),
    // The published household count and expanded population cannot stand in for
    // an unweighted person count. A future format may admit a sourced person n.
    sampleSize: z.null(),
    sampleSizeStatus: z.literal('estimate_person_count_not_published_in_reviewed_documents'),
    sampleSizeReason: text,
    achievedDwellings: positiveInteger,
    expandedEmployedPopulation: positiveInteger,
    nationalMeanAbsoluteErrorClp: z.number().finite().nonnegative(),
    nationalMeanRelativeErrorPercent: z.number().finite().min(0).max(100),
    nationalMedianError: z.null(),
    assessment: text,
    evidence,
  }).strict(),
  observations: z.array(z.object({
    metricKey: z.enum(['monthly_labor_income_mean', 'monthly_labor_income_median']),
    valueNumeric: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
    unit: z.literal('clp_month'),
    evidence,
  }).strict()).length(2),
  exclusions: z.array(text).min(1).max(12),
}).strict()

export type OfficialChileBenchmarkManifest = z.infer<typeof manifestSchema>

function fail(reason: string): never {
  throw new Error(`INVALID_CHILE_OFFICIAL_MANIFEST: ${reason}`)
}

export function parseOfficialChileBenchmarkManifest(input: unknown): OfficialChileBenchmarkManifest {
  const manifest = manifestSchema.parse(input)
  const year = manifest.sourcePeriod
  if (manifest.publishedAt < `${year}-12-31` || manifest.publishedAt > manifest.preparedAsOf) fail('publication cutoff')
  if (!new RegExp(`^ine-esi-${year}-national-${manifest.publishedAt.replaceAll('-', '')}-v[1-9][0-9]*$`).test(manifest.sourceVersion)) fail('source version identity')
  const definition = manifest.incomeDefinition
  if (definition.priceBasis !== `${year}-10`
    || definition.collectionPeriod !== `${year}-10/${year}-12`
    || definition.referencePeriod !== `${year}-09/${year}-11`) fail('annual wave and price basis')
  const documents = new Map(manifest.documents.map(document => [document.id, document]))
  if (documents.size !== manifest.documents.length) fail('duplicate document ID')
  if (new Set(manifest.documents.map(document => document.filename)).size !== documents.size) fail('duplicate source filename')
  if (new Set(manifest.documents.map(document => document.url)).size !== documents.size) fail('duplicate source URL')
  if (!documents.has(manifest.sourceDocumentId)) fail('missing main document')
  for (const document of manifest.documents) {
    if (document.retrievedAt > manifest.preparedAsOf || document.retrievedAt < manifest.publishedAt) fail('source retrieval date')
    if (!new URL(document.url).pathname.endsWith(`/${document.filename}`)) fail('source filename does not match URL')
  }
  const refs = [manifest.scope.evidence, definition.evidence, manifest.quality.evidence,
    ...manifest.observations.map(observation => observation.evidence)].flat()
  for (const ref of refs) {
    const document = documents.get(ref.documentId)
    if (!document || ref.pdfPage > document.pageCount) fail('evidence document/page')
  }
  if (new Set(manifest.observations.map(observation => observation.metricKey)).size !== 2) fail('duplicate or missing metric')
  for (const observation of manifest.observations) {
    if (!observation.evidence.some(ref => ref.documentId === manifest.sourceDocumentId)) fail('observation lacks main source evidence')
  }
  return manifest
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`
  if (value !== null && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

function sha256(value: string | Uint8Array): string {
  return createHash('sha256').update(value).digest('hex')
}

// UUIDv5, using the public DNS namespace and an explicit DTC resource name.
// Values are excluded from identity: editing a published version must conflict,
// not silently create a second row. A new published source reference/date and
// reviewed version gets new IDs; the same published identity cannot be duplicated.
function versionedId(sourceVersion: string, metric: string): string {
  const namespace = Buffer.from('6ba7b8109dad11d180b400c04fd430c8', 'hex')
  const bytes = createHash('sha1').update(namespace)
    .update(`despegatucarrera.com/official-chile/${sourceVersion}/${metric}/national`).digest().subarray(0, 16)
  bytes[6] = (bytes[6] & 0x0f) | 0x50
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = bytes.toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export interface OfficialChileBenchmarkPlan {
  manifestSha256: string
  sourceVersion: string
  preparedAsOf: string
  comparability: 'context_only_not_harmonized'
  rows: ChileBenchmarkRow[]
}

export function prepareOfficialChileBenchmarkImport(input: unknown): OfficialChileBenchmarkPlan {
  const manifest = parseOfficialChileBenchmarkManifest(input)
  const mainDocument = manifest.documents.find(document => document.id === manifest.sourceDocumentId)!
  const rows: ChileBenchmarkRow[] = [...manifest.observations]
    .sort((a, b) => a.metricKey.localeCompare(b.metricKey, 'en'))
    .map(observation => ({
      id: versionedId(manifest.sourceVersion, observation.metricKey),
      source_key: manifest.sourceKey,
      source_period: manifest.sourcePeriod,
      metric_key: observation.metricKey,
      region_code: null,
      occupation_code: null,
      education_level: null,
      employment_category: null,
      industry_code: null,
      value_numeric: observation.valueNumeric,
      unit: observation.unit,
      sample_size: manifest.quality.sampleSize,
      reliability_status: manifest.quality.reliabilityStatus,
      source_ref: mainDocument.url,
      published_at: manifest.publishedAt,
    }))
  for (const row of rows) {
    const selected = selectChileBenchmark([row], { metricKey: row.metric_key as 'monthly_labor_income_mean' | 'monthly_labor_income_median' }, manifest.preparedAsOf)
    if (!selected || selected.specificity !== 'national') fail('runtime resolver rejects proposed row')
  }
  return {
    manifestSha256: sha256(canonicalJson(manifest)),
    sourceVersion: manifest.sourceVersion,
    preparedAsOf: manifest.preparedAsOf,
    comparability: manifest.incomeDefinition.dtcComparability,
    rows,
  }
}

/** Check cached bytes; this function never downloads or executes source content. */
export function verifyOfficialChileSourceBytes(document: OfficialChileBenchmarkManifest['documents'][number], bytes: Uint8Array): void {
  if (bytes.length !== document.byteLength || sha256(bytes) !== document.sha256) fail(`source checksum mismatch: ${document.id}`)
  if (Buffer.from(bytes.subarray(0, 5)).toString('ascii') !== '%PDF-') fail(`source is not a PDF: ${document.id}`)
}

const columns = [
  'id', 'source_key', 'source_period', 'metric_key', 'region_code', 'occupation_code', 'education_level',
  'employment_category', 'industry_code', 'value_numeric', 'unit', 'sample_size', 'reliability_status', 'source_ref', 'published_at',
]
const sqlRecord = 'id uuid,source_key text,source_period text,metric_key text,region_code text,occupation_code text,education_level text,employment_category text,industry_code text,value_numeric numeric,unit text,sample_size integer,reliability_status text,source_ref text,published_at date'

/**
 * Produce reviewable SQL, never execute it. The caller binds the reviewed hash.
 * The statement is atomic and replay-safe; changed content under an existing ID
 * aborts the entire transaction. No UPDATE, DELETE or schema change is emitted.
 */
export function renderOfficialChileBenchmarkSql(input: unknown, expectedManifestSha256: string): string {
  const plan = prepareOfficialChileBenchmarkImport(input)
  if (expectedManifestSha256 !== plan.manifestSha256) fail('reviewed manifest hash changed')
  const literal = `'${JSON.stringify(plan.rows).replaceAll("'", "''")}'::jsonb`
  const preflightTag = `$dtc_${plan.manifestSha256.slice(0, 32)}_p$`
  const verifyTag = `$dtc_${plan.manifestSha256.slice(0, 32)}_v$`
  if (literal.includes(preflightTag) || literal.includes(verifyTag)) fail('SQL delimiter collision')
  const relation = `pg_catalog.jsonb_to_recordset(${literal}) as p(${sqlRecord})`
  const equality = columns.map(column => `b.${column} is not distinct from p.${column}`).join('\n          and ')
  const naturalKey = columns.filter(column => !['id', 'value_numeric', 'sample_size', 'reliability_status'].includes(column))
    .map(column => `b.${column} is not distinct from p.${column}`).join('\n          and ')
  return `-- DTC official benchmark import; prepared offline, not executed by the generator.
-- Source version: ${plan.sourceVersion}
-- Manifest SHA-256: ${plan.manifestSha256}
-- Context only: no net-pay harmonization or causal claim.
begin;
set local statement_timeout = '15s';
set local lock_timeout = '5s';
set local standard_conforming_strings = on;
lock table public.dtc_chile_benchmarks in share row exclusive mode;

do ${preflightTag}
begin
  if exists (
    select 1 from ${relation}
    join public.dtc_chile_benchmarks b on b.id <> p.id
      and ${naturalKey}
  ) then
    raise exception using errcode = '23505', message = 'DTC_OFFICIAL_BENCHMARK_EQUIVALENT_VERSION_EXISTS';
  end if;
end;
${preflightTag};

insert into public.dtc_chile_benchmarks (${columns.join(',')})
select ${columns.map(column => `p.${column}`).join(',')} from ${relation}
on conflict (id) do nothing;

do ${verifyTag}
begin
  if exists (
    select 1 from ${relation}
    where not exists (
      select 1 from public.dtc_chile_benchmarks b
      where ${equality}
    )
  ) then
    raise exception using errcode = '23505', message = 'DTC_OFFICIAL_BENCHMARK_IMMUTABLE_CONTENT_CONFLICT';
  end if;
end;
${verifyTag};
commit;
`
}
