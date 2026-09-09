import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const route = readFileSync('app/api/admin/pilot-invitations/route.ts', 'utf8')
const page = readFileSync('app/admin/pilot-invitations/page.tsx', 'utf8')
const form = readFileSync('app/admin/pilot-invitations/pilot-invitation-form.tsx', 'utf8')
const middleware = readFileSync('lib/supabase/middleware.ts', 'utf8')
const emailSender = readFileSync('lib/emails/send-email.ts', 'utf8')

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
assert.ok(page.includes("role?.role !== 'superadmin'"), 'page must enforce a server-side superadmin guard')
assert.ok(page.includes("redirect('/dashboard')"), 'non-admin users must leave the admin page')
assert.ok(middleware.includes("'/admin'"), 'admin routes must be protected by middleware')
assert.ok(middleware.includes('user && !adminPath'), 'admin role guard must not depend on learner pilot access')
assert.ok(form.includes('aria-live="polite"'), 'result state must be announced')
assert.ok(form.includes("type=\"email\""), 'issuer requires a semantic email field')
assert.ok(!emailSender.includes("Sending email to:"), 'email sender must not log recipients')
assert.ok(!emailSender.includes("console.log('[v0] From:'"), 'email sender must not log sender addresses')

console.log(JSON.stringify({ pilotInvitationIssuer: true }))
