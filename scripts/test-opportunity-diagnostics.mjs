import assert from 'node:assert/strict'
import test from 'node:test'
import { fetchEmployerBatch } from '../lib/opportunities/sources/employers.ts'
import { normalizeGetOnBoardPayload } from '../lib/opportunities/sources/getonboard.ts'
import {
  addOpportunityReason, opportunityContentCoverage,
  safeOpportunityReasonCounts, safeOpportunityContentCoverage,
} from '../lib/opportunities/source-diagnostics.ts'

// Synthetic source shapes only. No network, credentials or database writes.
const VERIFIED_AT = '2026-10-08T01:00:00.000Z'
const NOW = Date.parse(VERIFIED_AT)
const FUTURE = new Date(NOW + 3_600_000).toISOString()
const json = body => new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } })
const greenhouse = (id, overrides = {}) => ({
  id, internal_job_id: id + 1000, title: 'Analista de operaciones',
  location: { name: 'Santiago, Chile' }, offices: [],
  content: '<p>Analizar procesos y preparar reportes.</p><h2>Requisitos</h2><ul><li>Experiencia con Excel.</li></ul><p>Modalidad híbrida.</p>',
  first_published: '2026-10-07T12:00:00Z',
  absolute_url: `https://job-boards.greenhouse.io/cabify/jobs/${id}`,
  ...overrides,
})
async function collectGreenhouse(jobs) {
  const requests = []
  const batch = await fetchEmployerBatch(0, {
    now: () => NOW, cooldowns: { 'lever:fintual': FUTURE },
    fetchImpl: async url => {
      requests.push(url)
      return url.endsWith('/robots.txt')
        ? new Response('User-agent: *\nDisallow: /embed/\n')
        : json({ jobs, meta: { total: jobs.length } })
    },
  })
  assert.equal(requests.filter(url => !url.endsWith('/robots.txt')).length, 1)
  return { batch, board: batch.boards.find(value => value.source === 'greenhouse') }
}
function checkReconciliation(board) {
  assert.equal(board.diagnosticsVersion, 1)
  assert.equal(board.considered, board.accepted + board.excluded + board.rejected)
  assert.equal(board.received, board.considered + board.notConsidered)
  assert.equal(board.accepted, board.returned + board.deferredEligible)
  assert.equal(Object.values(board.excludedReasons).reduce((a, b) => a + b, 0), board.excluded)
  assert.equal(Object.values(board.rejectedReasons).reduce((a, b) => a + b, 0), board.rejected)
  assert.equal(board.contentCoverage.total, board.returned)
}

test('diagnostics project fixed reason codes and bounded integers without arbitrary source content', () => {
  const counts = {}
  addOpportunityReason(counts, 'missing_description')
  addOpportunityReason(counts, 'missing_description')
  addOpportunityReason(counts, 'PRIVATE_SOURCE_SENTINEL')
  assert.deepEqual(counts, { missing_description: 2, invalid_record: 1 })
  const result = safeOpportunityReasonCounts({
    ...counts, privatePayload: 'PRIVATE_SOURCE_SENTINEL', job_url: 'PRIVATE_URL_SENTINEL',
    expired: -1, scheduled: 0.5, duplicate_id: 501, job_identity: NaN,
  })
  assert.deepEqual(result, counts)
  assert.doesNotMatch(JSON.stringify(result), /PRIVATE_/)
  for (const input of [null, [], 'missing_description', 1]) assert.deepEqual(safeOpportunityReasonCounts(input), {})
})

test('content coverage measures returned field presence without implying fit or confidence', () => {
  const result = opportunityContentCoverage([
    { requirements: ['Experiencia con Excel'], skills: ['Excel'], workMode: 'hybrid' },
    { requirements: [], skills: [], workMode: null },
    { requirements: ['Experiencia con SQL'], skills: [], workMode: null },
  ])
  assert.deepEqual(result, { measured: 'returned', total: 3, with_requirements: 2, with_skills: 1, with_work_mode: 1 })
  assert.deepEqual(safeOpportunityContentCoverage({ ...result, source_payload: 'PRIVATE_SOURCE_SENTINEL' }), result)
  for (const change of [{ total: 501 }, { with_skills: 4 }, { with_work_mode: -1 }, { total: '3' }, { measured: 'received' }]) {
    assert.equal(safeOpportunityContentCoverage({ ...result, ...change }), undefined)
  }
})

test('every employer exclusion and rejection retains its own counted reason in a partial snapshot', async () => {
  const { batch, board } = await collectGreenhouse([
    greenhouse(1), greenhouse(2, { location: { name: 'Madrid, Spain' } }),
    greenhouse(3, { internal_job_id: null }), greenhouse(4, { title: 'Talent Pool' }),
    greenhouse(5, { first_published: FUTURE }),
    greenhouse(6, { application_deadline: '2026-10-07T12:00:00Z' }),
    greenhouse(7, { content: '' }), greenhouse(8, { id: 'malformed' }), greenhouse(1),
  ])
  checkReconciliation(board)
  assert.equal(board.received, 9)
  assert.deepEqual(board.excludedReasons, { geography_unconfirmed: 1, prospect_post: 1, talent_pool: 1, scheduled: 1, expired: 1 })
  assert.deepEqual(board.rejectedReasons, { missing_description: 1, job_identity: 1, duplicate_id: 1 })
  assert.equal(board.outcome, 'partial')
  assert.equal(board.completeSnapshot, false)
  assert.equal(batch.jobs.length, 1)
  assert.deepEqual(board.contentCoverage, { measured: 'returned', total: 1, with_requirements: 1, with_skills: 1, with_work_mode: 1 })
  assert.doesNotMatch(JSON.stringify(board), /Analizar procesos|Experiencia con Excel/)
})

test('a repaired duplicate stays accepted while the earlier rejection prevents absence reconciliation', async () => {
  const { board } = await collectGreenhouse([greenhouse(1, { content: '' }), greenhouse(1)])
  checkReconciliation(board)
  assert.equal(board.accepted, 1)
  assert.deepEqual(board.rejectedReasons, { missing_description: 1 })
  assert.equal(board.completeSnapshot, false)
})

test('unprocessed employer rows are counted separately from excluded or rejected jobs', async () => {
  const { board } = await collectGreenhouse(Array.from({ length: 650 }, (_, index) => greenhouse(index + 1, { location: { name: 'Madrid, Spain' } })))
  checkReconciliation(board)
  assert.equal(board.received, 650)
  assert.equal(board.considered, 500)
  assert.equal(board.notConsidered, 150)
  assert.deepEqual(board.excludedReasons, { geography_unconfirmed: 500 })
  assert.deepEqual(board.rejectedReasons, {})
  assert.equal(board.completeSnapshot, false)
  assert.equal(board.failureCode, 'row_limit')
})

test('eligible rows deferred by the fifty-job return budget are not reported as rejected', async () => {
  const { board } = await collectGreenhouse(Array.from({ length: 75 }, (_, index) => greenhouse(index + 1)))
  checkReconciliation(board)
  assert.equal(board.considered, 75)
  assert.equal(board.returned, 50)
  assert.equal(board.deferredEligible, 25)
  assert.equal(board.notConsidered, 0)
  assert.equal(board.rejected, 0)
  assert.equal(board.contentCoverage.total, 50)
  assert.equal(board.completeSnapshot, false)
})

test('a provider failure after a valid page preserves the counts and source failure code', async () => {
  const id = index => `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`
  const jobs = Array.from({ length: 100 }, (_, index) => ({
    id: id(index), text: 'Analista de operaciones', country: index === 0 ? 'CL' : 'ES',
    categories: { location: index === 0 ? 'Santiago, Chile' : 'Madrid, Spain' },
    descriptionPlain: 'Analizar procesos y preparar reportes.',
    hostedUrl: `https://jobs.lever.co/fintual/${id(index)}`, lists: [],
  }))
  let calls = 0
  const batch = await fetchEmployerBatch(0, {
    now: () => NOW, cooldowns: { 'greenhouse:cabify': FUTURE },
    fetchImpl: async url => url.endsWith('/robots.txt')
      ? new Response('User-agent: *\nDisallow: /embed/\n')
      : ++calls === 1 ? json(jobs) : new Response('', { status: 503 }),
  })
  const board = batch.boards.find(value => value.source === 'lever')
  checkReconciliation(board)
  assert.equal(board.outcome, 'partial')
  assert.equal(board.accepted, 1)
  assert.equal(board.excluded, 99)
  assert.equal(board.failureCode, 'http_503')
  assert.equal(board.completeSnapshot, false)
})

const getonboard = (id, attributes = {}) => ({
  id, type: 'job', links: { public_url: `https://www.getonbrd.com/jobs/${id}` },
  attributes: { title: 'Analista de datos', company_name: 'Empresa sintética',
    description: 'Analizar procesos.', requirements: ['Experiencia con SQL.'],
    remote_modality: 'hybrid', ...attributes },
})

test('Get on Board reasons reconcile only the thirty records actually considered', () => {
  const rows = Array.from({ length: 40 }, (_, index) => getonboard(`analista-${index}`))
  rows[1] = getonboard('sin-empresa', { company_name: '' })
  rows[2] = getonboard('programado', { published_at: FUTURE })
  rows[3] = getonboard('remoto-local', { remote_modality: 'remote_local', location_tenants: { data: [{ id: 'opaque', type: 'country' }] } })
  rows[4] = { ...getonboard('url-invalida'), links: { public_url: 'https://unrelated.example/job' } }
  const { diagnostics, jobs } = normalizeGetOnBoardPayload({ data: rows }, VERIFIED_AT)
  assert.equal(diagnostics.diagnostics_version, 1)
  assert.equal(diagnostics.received, 40)
  assert.equal(diagnostics.considered, 30)
  assert.equal(diagnostics.not_considered, 10)
  assert.equal(diagnostics.rejected, 4)
  assert.equal(diagnostics.normalized, 26)
  assert.equal(jobs.length, 26)
  assert.deepEqual(diagnostics.rejected_reasons, { company_missing: 1, scheduled: 1, remote_geography_unresolved: 1, job_url: 1 })
  assert.equal(diagnostics.outcome, 'partial')
  assert.equal(diagnostics.content_coverage.total, jobs.length)
  assert.equal(diagnostics.content_coverage.with_requirements, jobs.length)
})

test('empty source snapshots remain distinguishable from entirely invalid records', () => {
  const empty = normalizeGetOnBoardPayload({ data: [] }, VERIFIED_AT)
  assert.equal(empty.diagnostics.outcome, 'no_matches')
  assert.deepEqual(empty.diagnostics.rejected_reasons, {})
  const invalid = normalizeGetOnBoardPayload({ data: [{ type: 'company' }, {}] }, VERIFIED_AT)
  assert.equal(invalid.diagnostics.outcome, 'parse_failed')
  assert.deepEqual(invalid.diagnostics.rejected_reasons, { resource_type: 1, job_identity: 1 })
  assert.equal(invalid.diagnostics.content_coverage.total, 0)
})
