import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { eventSchema } from '../lib/v1-analytics/schema'

const route = readFileSync('app/api/v1-analytics/route.ts', 'utf8')
const hook = readFileSync('lib/v1-analytics/use-v1-analytics.ts', 'utf8')
const schema = readFileSync('lib/v1-analytics/schema.ts', 'utf8')
const types = readFileSync('lib/v1-analytics/types.ts', 'utf8')
const c1Page = readFileSync('app/despega/conozcamonos-1/page.tsx', 'utf8')
const journeyTracker = readFileSync('components/analytics/journey-stage-analytics.tsx', 'utf8')
const despegaLayout = readFileSync('app/despega/layout.tsx', 'utf8')

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
assert.ok(route.includes(".gt('expires_at', new Date().toISOString())"), 'admin metrics must exclude expired raw rows explicitly')
assert.ok(!hook.includes('[ANALYTICS]'), 'browser must not log analytics payloads')
assert.ok(!hook.includes('timestamp: new Date().toISOString()'), 'client must not send server-owned timestamp')
assert.ok(hook.includes("metadata?: V1AnalyticsEvent['metadata']"), 'client metadata must be typed to the allowlist')
assert.ok(!types.includes('userChoice?:'), 'client types must not permit free-form user choices')
assert.ok(!types.includes('userId?:'), 'client must not accept user ownership from payloads')
assert.ok(!types.includes('timestamp: string'), 'client event type must not include server-owned timestamp')
assert.ok(!c1Page.includes('totalQuestions:'), 'C1 analytics must not send non-allowlisted metadata')
assert.ok(c1Page.includes("errorType: 'save_failed'"), 'C1 analytics errors must be categorical')
assert.ok(c1Page.includes('trackPageView()'), 'C1 must initialize page timing before event capture')

for (const stageEvent of [
  "a1: 'a1_intro_viewed'",
  "a2: 'a2_dashboard_viewed'",
  "a3: 'a3_page_viewed'",
  "a4: 'a4_page_viewed'",
]) assert.ok(journeyTracker.includes(stageEvent), `missing funnel stage event: ${stageEvent}`)

assert.ok(journeyTracker.includes('v1_funnel_stage_seen_'), 'funnel stage tracking must dedupe within a browser session')
assert.ok(!journeyTracker.includes('metadata:'), 'funnel stage entry must not attach arbitrary metadata')
assert.ok(despegaLayout.includes('<JourneyStageAnalytics />'), 'authenticated journey layout must mount funnel analytics')

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