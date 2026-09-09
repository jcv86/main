import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const config = JSON.parse(source('vercel.json')) as {
  crons?: Array<{ path?: string; schedule?: string }>
}
const crons = config.crons ?? []

assert.ok(crons.length > 0, 'at least one intentional cron must remain')
for (const cron of crons) {
  assert.match(cron.path ?? '', /^\/api\/cron\/[a-z0-9-]+$/)
  const routePath = `${(cron.path ?? '').replace(/^\//, 'app/')}/route.ts`
  assert.ok(existsSync(join(process.cwd(), routePath)), `${cron.path} must map to ${routePath}`)
  assert.ok(cron.schedule, `${cron.path} must define a schedule`)
}

const configuredPaths = crons.map((cron) => cron.path)
assert.ok(!configuredPaths.includes('/api/cron/bimonthly-analysis'))
assert.ok(!configuredPaths.includes('/api/cron/daily-metrics-summary'))

const live = source('app/api/health/live/route.ts')
const ready = source('app/api/health/ready/route.ts')
const a4Cron = source('lib/a4/daily-snapshot-cron.ts')

for (const healthRoute of [live, ready]) {
  assert.match(healthRoute, /'Cache-Control': 'no-store, max-age=0'/)
  assert.match(healthRoute, /'CDN-Cache-Control': 'no-store'/)
  assert.ok(!healthRoute.includes('process.env.'))
}

assert.ok(live.includes("{ status: 'ok' }"))
assert.ok(ready.includes("{ status: 'ready' }"))
assert.ok(ready.includes("{ status: 'unavailable' }"))
assert.ok(ready.includes('{ status: 503, headers: NO_STORE_HEADERS }'))
assert.ok(ready.includes(".from('profiles')"))
assert.ok(ready.includes(".select('id')"))
assert.ok(!ready.includes('error.message'))

const responseStart = a4Cron.indexOf('success: result.failed === 0')
const responseEnd = a4Cron.indexOf('{ headers: NO_STORE_HEADERS }', responseStart)
assert.ok(responseStart >= 0 && responseEnd > responseStart)
const publicResponse = a4Cron.slice(responseStart, responseEnd)
assert.ok(!publicResponse.includes('...result'))
assert.ok(!publicResponse.includes('result.summaries'))
assert.ok(!publicResponse.includes('result.failures'))
assert.ok(a4Cron.includes("error: 'Cron execution failed'"))
assert.ok(!a4Cron.includes("error instanceof Error ? error.message : 'Cron execution failed'"))
assert.match(a4Cron, /'Cache-Control': 'no-store, max-age=0'/)
assert.match(a4Cron, /'CDN-Cache-Control': 'no-store'/)

console.log(
  JSON.stringify({
    cronRoutesConfigured: crons.length,
    cronRouteParity: true,
    healthEndpoints: ['/api/health/live', '/api/health/ready'],
    a4ResponseContainsUserDetails: false,
  }),
)
