import assert from 'node:assert/strict'
import { createRateLimiter } from '../lib/middleware/rate-limit.ts'

const request = new Request('https://uat.invalid/api/example', {
  headers: { 'x-forwarded-for': '192.0.2.101' },
})
const api = createRateLimiter({ windowMs: 60_000, maxRequests: 10 })
const auth = createRateLimiter({ windowMs: 60_000, maxRequests: 2 })

for (let i = 0; i < 5; i++) assert.equal((await api(request)).allowed, true)
assert.equal((await auth(request)).allowed, true, 'API activity must not consume the auth allowance')
assert.equal((await auth(request)).allowed, true)
assert.equal((await auth(request)).allowed, false, 'The original auth threshold must remain enforced')
assert.equal((await api(request)).allowed, true, 'An exhausted auth allowance must not block the API limiter')

const secondIp = new Request('https://uat.invalid/api/example', {
  headers: { 'x-forwarded-for': '192.0.2.102' },
})
assert.equal((await auth(secondIp)).allowed, true, 'Separate clients must retain their own allowance')
console.log('PASS: limiter categories and clients are isolated; auth threshold stays enforced.')
