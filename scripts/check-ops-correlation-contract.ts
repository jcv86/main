import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  createRequestId,
  DTC_REQUEST_ID_HEADER,
  normalizeRequestId,
  resolveRequestId,
} from '../lib/observability/request-id'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const generated = createRequestId()
assert.match(generated, /^dtc-[A-Za-z0-9-]+$/)
assert.equal(normalizeRequestId('short'), null)
assert.equal(normalizeRequestId('bad\nheader-value'), null)
assert.equal(normalizeRequestId('dtc-client-12345678'), 'dtc-client-12345678')
assert.equal(
  resolveRequestId(new Headers({ [DTC_REQUEST_ID_HEADER]: 'dtc-client-12345678' })),
  'dtc-client-12345678',
)

const middleware = source('middleware.ts')
const logger = source('lib/observability/server-log.ts')
const gamification = source('app/api/gamification/global/route.ts')
const transitionRoute = source('app/api/journey/transition/route.ts')
const transitions = source('lib/journey/transitions.ts')
const phaseTransition = source('components/phase-transition-handler.tsx')
const a2Intro = source('components/a2-canonical-intro.tsx')

assert.ok(middleware.includes('resolveRequestId(request.headers)'))
assert.ok(middleware.includes('forwardedHeaders.set(DTC_REQUEST_ID_HEADER, requestId)'))
assert.ok(middleware.includes('request: { headers: forwardedHeaders }'))
assert.ok(middleware.includes('withRequestId(rateLimitResponse, requestId)'))
assert.ok(middleware.includes('Content-Type, Authorization, ${DTC_REQUEST_ID_HEADER}'))
assert.ok(!middleware.includes("ip: request.headers.get('x-forwarded-for')"))

assert.ok(logger.includes('SENSITIVE_KEY'))
assert.ok(logger.includes("'[REDACTED]'"))
assert.ok(logger.includes('errorDescriptor'))
assert.ok(!logger.includes('candidate.message'))
assert.ok(!logger.includes('error.message'))

assert.ok(gamification.includes('request_id: requestId'))
assert.ok(gamification.includes('logOperationalError({'))
assert.ok(gamification.includes("event: 'gamification.global.failed'"))
assert.ok(!gamification.includes("console.error('[v0] Error fetching global gamification:'"))

assert.ok(transitionRoute.includes('SAFE_TRANSITION_ERRORS'))
assert.ok(transitionRoute.includes('{ ...payload, request_id: requestId }'))
assert.ok(transitionRoute.includes("'No pudimos registrar la transición.'"))
assert.ok(transitionRoute.includes('recordJourneyTransition(currentUser.id, step, {'))
assert.ok(!transitionRoute.includes("console.error('[v0] Journey transition error:'"))

assert.ok(transitions.includes("event: 'journey.transition.completed'"))
assert.ok(transitions.includes("event: 'journey.transition.failed'"))
assert.ok(transitions.includes("event: 'journey.a3.visited'"))
assert.ok(transitions.includes("event: 'journey.a3.visit_failed'"))
assert.ok(!transitions.includes('metadata: { userId'))

for (const client of [phaseTransition, a2Intro]) {
  assert.ok(client.includes('createRequestId()'))
  assert.ok(client.includes('[DTC_REQUEST_ID_HEADER]: requestId'))
  assert.ok(client.includes('Código de soporte: ${supportId}'))
}

console.log(JSON.stringify({
  evidenceLevel: 'runtime_and_source_contract',
  correlationIdValidation: true,
  apiRequestIdPropagation: true,
  rawIpRateLimitLogging: false,
  structuredErrorRedaction: true,
  journeyTransitionLogs: true,
  userVisibleSupportCode: true,
  internalDatabaseErrorsExposedByJourneyApi: false,
}))
