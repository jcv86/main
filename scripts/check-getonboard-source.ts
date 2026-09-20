import assert from 'node:assert/strict'
import { normalizeGetOnBoardJob } from '../lib/opportunities/sources/getonboard'
import { readFileSync } from 'node:fs'

const sample = {
  data: {
    id: 'job-123',
    attributes: {
      title: 'Product Manager',
      company_name: 'Empresa Real',
      location: 'Santiago, Chile',
      remote: true,
      description: 'Liderar producto.',
      technologies: ['Product Strategy', 'Analytics'],
      public_url: 'https://www.getonbrd.com/jobs/product-management/product-manager-empresa-real',
      published_at: '2026-09-20T12:00:00Z',
    },
  },
}
const normalized = normalizeGetOnBoardJob(sample, '2026-09-20T15:00:00Z')
assert.ok(normalized)
assert.equal(normalized.source, 'getonboard')
assert.equal(normalized.sourceId, 'job-123')
assert.equal(normalized.title, 'Product Manager')
assert.equal(normalized.company, 'Empresa Real')
assert.equal(normalized.verificationStatus, 'verified_active')
assert.ok(normalized.originalUrl.startsWith('https://www.getonbrd.com/'))

assert.equal(normalizeGetOnBoardJob({ data: { id: 'bad', attributes: { title: 'Sin URL', company_name: 'X' } } }), null)

const route = readFileSync('app/api/a4/opportunities/getonboard/route.ts', 'utf8')
assert.ok(route.includes('resolveServerUser'))
assert.ok(route.includes('checkA4Access'))
assert.ok(route.includes("coverage: 'public_api'"))
assert.ok(route.includes("status: 502"))

console.log(JSON.stringify({
  canonicalNormalization: true,
  originalUrlFailClosed: true,
  authenticatedA4Boundary: true,
  upstreamFailureFailClosed: true,
}))
