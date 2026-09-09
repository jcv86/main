import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const route = readFileSync('app/api/admin/pilot-invitations/route.ts', 'utf8')
const page = readFileSync('app/admin/pilot-invitations/page.tsx', 'utf8')

for (const expected of [
  "data?.role === 'superadmin'",
  "randomBytes(32).toString('base64url')",
  "createHash('sha256')",
  "https://www.despegatucarrera.com",
  "from: 'info@despegatucarrera.com'",
  ".eq('status', 'issued')",
  "status: 'revoked'",
]) assert.ok(route.includes(expected), `missing issuer guard: ${expected}`)

assert.ok(!route.includes('console.log'), 'issuer must not log email or token data')
assert.ok(page.includes('aria-live="polite"'), 'result state must be announced')
assert.ok(page.includes("type=\"email\""), 'issuer requires a semantic email field')

console.log(JSON.stringify({ pilotInvitationIssuer: true }))
