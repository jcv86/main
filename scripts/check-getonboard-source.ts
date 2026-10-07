import assert from 'node:assert/strict'
import { normalizeGetOnBoardJob, normalizeGetOnBoardPayload } from '../lib/opportunities/sources/getonboard'
import { readFileSync } from 'node:fs'

// Synthetic content; resource links and expanded company/cities/tags mirror the
// public endpoint response observed on 2026-10-07.
const sample = JSON.parse(readFileSync('scripts/fixtures/getonboard/public-response.synthetic.json', 'utf8'))
const normalized = normalizeGetOnBoardJob(sample.data[0], '2026-10-07T18:00:00Z')
assert.ok(normalized)
assert.equal(normalized.source, 'getonboard')
assert.equal(normalized.sourceId, sample.data[0].id)
assert.equal(normalized.title, 'Desarrollador de pruebas')
assert.equal(normalized.company, 'Empresa sintética DTC')
assert.equal(normalized.location, 'Santiago, Chile')
assert.equal(normalized.workMode, 'hybrid')
assert.equal(normalized.publishedAt, '2026-10-02T13:14:42.000Z')
assert.equal(normalized.verificationStatus, 'verified_active')
assert.equal(normalized.originalUrl, sample.data[0].links.public_url)
assert.deepEqual(normalized.skills, ['TypeScript', 'Node.js'])
assert.ok(!normalized.description.includes('UNSAFE_SCRIPT_SENTINEL'))

assert.equal(normalizeGetOnBoardJob({ data: { id: 'bad', attributes: { title: 'Sin URL', company_name: 'X' } } }), null)
assert.equal(normalizeGetOnBoardPayload({ data: [] }).diagnostics.outcome, 'no_matches')
assert.equal(normalizeGetOnBoardPayload({ data: [{ id: 'bad' }] }).diagnostics.outcome, 'parse_failed')

const route = readFileSync('app/api/a4/opportunities/getonboard/route.ts', 'utf8')
assert.ok(route.includes('resolveServerUser'))
assert.ok(route.includes('checkA4Access'))
assert.ok(route.includes("coverage: 'public_api'"))
assert.ok(route.includes('status: 502'))

console.log(JSON.stringify({
  canonicalNormalization: true,
  observedPublicResourceShape: true,
  originalUrlFailClosed: true,
  explicitHybridPreserved: true,
  malformedDistinctFromEmpty: true,
  authenticatedA4Boundary: true,
  upstreamFailureFailClosed: true,
}))
