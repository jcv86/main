import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { eventSchema } from '../lib/v1-analytics/schema'

const route = readFileSync('app/api/v1-analytics/route.ts', 'utf8')
const hook = readFileSync('lib/v1-analytics/use-v1-analytics.ts', 'utf8')
const schema = readFileSync('lib/v1-analytics/schema.ts', 'utf8')

for (const contract of [
  "supabase.auth.getUser()",
  'user_id: user.id',
  "role?.role !== 'superadmin'",
  "reason: 'analytics_storage_unavailable'",
  'Math.min(90',
  'sessionsByStage',
  'sessionsByCompletion',
  "'C1 → A1'",
]) assert.ok(route.includes(contract), `missing analytics contract: ${contract}`)

for (const contract of [
  'z.enum(ANALYTICS_EVENTS)',
  'z.enum(ANALYTICS_STAGES)',
  'stageForEvent(event) === stage',
  'metadataSchema',
]) assert.ok(schema.includes(contract), `missing analytics schema contract: ${contract}`)

assert.ok(route.includes('new Date().toISOString()'), 'server must own the event timestamp')
assert.ok(!route.includes('userChoice:'), 'free-form user choices must not be persisted')
assert.ok(!route.includes('console.log'), 'analytics endpoint must not log event data')
assert.ok(!route.includes("admin.from('v1_analytics').insert"), 'writes must respect owner RLS')
assert.ok(route.includes("supabase.from('v1_analytics').insert"), 'writes must use authenticated client')
assert.ok(!hook.includes('[ANALYTICS]'), 'browser must not log analytics payloads')

assert.equal(eventSchema.safeParse({
  event: 'a1_completed',
  stage: 'a1',
  sessionId: 'session_12345678',
  metadata: { duration: 1_000, deviceType: 'desktop' },
}).success, true, 'valid allowlisted event should pass')

assert.equal(eventSchema.safeParse({
  event: 'a1_completed',
  stage: 'a4',
  sessionId: 'session_12345678',
}).success, false, 'event and stage must agree')

for (const unsafePayload of [
  { event: 'unknown', stage: 'a1', sessionId: 'session_12345678' },
  { event: 'a1_completed', stage: 'a1', sessionId: 'session_12345678', userId: 'spoofed' },
  { event: 'a1_completed', stage: 'a1', sessionId: 'session_12345678', timestamp: new Date().toISOString() },
  { event: 'a1_completed', stage: 'a1', sessionId: 'session_12345678', metadata: { userChoice: 'private answer' } },
  { event: 'error_occurred', stage: 'cross', sessionId: 'session_12345678', metadata: { errorType: 'email user@example.com' } },
]) assert.equal(eventSchema.safeParse(unsafePayload).success, false, 'unsafe analytics payload must fail')

console.log(JSON.stringify({ v1AnalyticsContract: true }))
