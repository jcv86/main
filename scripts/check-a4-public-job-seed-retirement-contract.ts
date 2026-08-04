import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const retiredRoute = source('app/api/a4/seed-jobs/route.ts')
const canonicalRoute = source('app/api/a4/job-matching/route.ts')

assert.ok(retiredRoute.includes("code: 'A4_PUBLIC_JOB_SEED_RETIRED'"))
assert.ok(retiredRoute.includes("replacement: '/api/a4/job-matching'"))
assert.ok(retiredRoute.includes('status: 410'))
assert.ok(!retiredRoute.includes('SUPABASE_SERVICE_ROLE_KEY'))
assert.ok(!retiredRoute.includes('createClient'))
assert.ok(!retiredRoute.includes(".insert("))
assert.ok(!retiredRoute.includes(".select("))
assert.ok(!retiredRoute.includes('JOBS_DATA'))

assert.equal(
  existsSync(join(process.cwd(), 'scripts/seed-jobs.ts')),
  false,
  'The executable fake-job seed must remain deleted.',
)
assert.equal(
  existsSync(join(process.cwd(), 'scripts/02-seed-market-jobs.sql')),
  false,
  'The fake market-job SQL seed must remain deleted.',
)

assert.ok(canonicalRoute.includes('resolveServerUser'))
assert.ok(canonicalRoute.includes('checkA4Access'))
assert.ok(canonicalRoute.includes('minScore'))
assert.ok(canonicalRoute.includes('limit'))
assert.ok(!canonicalRoute.includes('SUPABASE_SERVICE_ROLE_KEY'))
assert.ok(!canonicalRoute.includes(".insert("))

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    publicPrivilegedSeedRetired: true,
    fakeJobSeedFilesRemoved: 2,
    canonicalReplacement: '/api/a4/job-matching',
    canonicalRouteAuthenticated: true,
    canonicalRouteA4Gated: true,
    liveHttpCheckedInThisScript: false,
    liveDatabaseCheckedInThisScript: false,
  }),
)
