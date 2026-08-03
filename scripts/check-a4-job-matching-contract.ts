import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const route = readFileSync(
  join(process.cwd(), 'app/api/a4/job-matching/route.ts'),
  'utf8',
)

assert.ok(route.includes("resolveServerUser()"))
assert.ok(route.includes("createAdminClient()"))
assert.ok(route.includes("checkA4Access(currentUser.id, supabase)"))
assert.ok(route.includes("getA4AccessDenialMessage()"))
assert.ok(route.includes("{ status: 401 }"))
assert.ok(route.includes("{ status: 403 }"))

assert.ok(route.includes("boundedInteger(searchParams.get('minScore'), 50, 0, 100)"))
assert.ok(route.includes("boundedInteger(searchParams.get('limit'), 20, 1, 50)"))
assert.ok(route.includes("Number.parseInt(rawValue, 10)"))
assert.ok(route.includes("Math.min(maximum, Math.max(minimum, parsed))"))

assert.ok(route.includes(".or(`expires_date.is.null,expires_date.gte.${today}`)"))
assert.ok(!route.includes(".is('expires_date', null)"))
assert.ok(!route.includes("user_profile: profile"))
assert.ok(!route.includes("currentUser.email"))
assert.ok(!route.includes("supabase.from('users')"))
assert.ok(!route.includes("supabase.from('job_recommendations')"))

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    authenticated: true,
    a4AccessGate: true,
    boundedParameters: {
      minScore: [0, 100],
      limit: [1, 50],
    },
    futureExpiringJobsIncluded: true,
    userProfileNotReturned: true,
    liveHttpCheckedInThisScript: false,
    liveDatabaseCheckedInThisScript: false,
  }),
)
