import assert from 'node:assert/strict'
import { checkRateLimit, createRateLimiter, rateLimiters } from '../lib/middleware/rate-limit.ts'

const actualNow = Date.now
let now = 2_000_000_000_000
Date.now = () => now
const request = (ip) => new Request('https://example.invalid/api/health/ready', {
  headers: { 'x-forwarded-for': ip },
})
const passed = []

try {
  const sharedClient = request('192.0.2.1')
  // The production policies are exercised together, as in API preflight -> pilot-status.
  for (let index = 0; index < 8; index++) assert.equal(await checkRateLimit(sharedClient, rateLimiters.api), null)
  for (let index = 0; index < 5; index++) assert.equal(await checkRateLimit(sharedClient, rateLimiters.auth), null)
  const authDenied = await checkRateLimit(sharedClient, rateLimiters.auth)
  assert.equal(authDenied.status, 429)
  assert.equal(authDenied.headers.get('X-RateLimit-Limit'), '5')
  assert.equal(authDenied.headers.get('X-RateLimit-Remaining'), '0')
  assert.equal(authDenied.headers.get('Retry-After'), '900')
  assert.equal((await authDenied.json()).retryAfter, 900)
  assert.equal(await checkRateLimit(sharedClient, rateLimiters.api), null)
  for (let index = 9; index < 100; index++) assert.equal(await checkRateLimit(sharedClient, rateLimiters.api), null)
  const apiDenied = await checkRateLimit(sharedClient, rateLimiters.api)
  assert.equal(apiDenied.status, 429)
  assert.equal(apiDenied.headers.get('X-RateLimit-Limit'), '100')
  for (let index = 0; index < 20; index++) assert.equal(await checkRateLimit(sharedClient, rateLimiters.ai), null)
  const aiDenied = await checkRateLimit(sharedClient, rateLimiters.ai)
  assert.equal(aiDenied.status, 429)
  assert.equal(aiDenied.headers.get('X-RateLimit-Limit'), '20')
  assert.equal(aiDenied.headers.get('Retry-After'), '3600')
  passed.push('ordinary API reads preserve the five auth requests and auth exhaustion does not block API reads')

  assert.equal(await checkRateLimit(request('192.0.2.2'), rateLimiters.auth), null)
  passed.push('one client cannot consume another client allowance')

  const client = request('192.0.2.3')
  const shortPolicy = createRateLimiter({ windowMs: 1_000, maxRequests: 1 })
  const longPolicy = createRateLimiter({ windowMs: 60_000, maxRequests: 1 })
  assert.equal(await checkRateLimit(client, shortPolicy), null)
  assert.equal(await checkRateLimit(client, longPolicy), null)
  now += 1_000
  assert.equal(await checkRateLimit(client, shortPolicy), null)
  const longDenied = await checkRateLimit(client, longPolicy)
  assert.equal(longDenied.status, 429)
  assert.equal(longDenied.headers.get('Retry-After'), '59')
  assert.equal(longDenied.headers.get('X-RateLimit-Limit'), '1')
  passed.push('each policy retains its own time window and the short policy resets at its boundary')

  now += 59_000
  assert.equal(await checkRateLimit(client, longPolicy), null)
  assert.equal((await checkRateLimit(client, longPolicy)).status, 429)
  passed.push('an expired window restores only its configured allowance')

  console.log(JSON.stringify({ verdict: 'GO', passed: passed.length, cases: passed, remoteNetwork: false }))
} finally {
  Date.now = actualNow
}
