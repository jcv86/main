import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createInvitationCookieValue, verifyInvitationCookieValue } from '../lib/auth/invitation-cookie.ts'

const source = (path) => readFileSync(path, 'utf8')
const secret = 'test-secret-that-is-long-enough-for-hmac'
const claimId = '11111111-1111-4111-8111-111111111111'
const signed = createInvitationCookieValue(claimId, secret)

assert.notEqual(signed, claimId)
assert.equal(verifyInvitationCookieValue(signed, secret), claimId)
assert.equal(verifyInvitationCookieValue(`${signed}x`, secret), null)

const claimRoute = source('app/api/auth/invitation/claim/route.ts')
assert.match(claimRoute, /createHash\(['"]sha256['"]\)/)
assert.match(claimRoute, /claim_pilot_invitation/)
assert.match(claimRoute, /httpOnly:\s*true/)
assert.match(claimRoute, /sameSite:\s*['"]lax['"]/)
assert.match(claimRoute, /maxAge:\s*900/)
assert.doesNotMatch(claimRoute, /console\.(?:log|warn|error)\([^)]*token/)

const signIn = source('app/auth/signin/page.tsx')
assert.match(signIn, /Continuar con Google/)
assert.match(signIn, /Continuar con LinkedIn/)
assert.doesNotMatch(signIn, /Código de Invitación/)
assert.doesNotMatch(signIn, /validate-invitation/)

const callback = source('app/auth/callback/route.ts')
assert.match(callback, /resolve_pilot_access/)
assert.match(callback, /normalizeNextPath/)
assert.match(callback, /access_required/)
assert.match(callback, /auth\.signOut/)

const middleware = source('lib/supabase/middleware.ts')
assert.match(middleware, /classifyAuthState/)
assert.match(middleware, /state === ['"]signed_out['"]/)

const comenzar = source('app/comenzar/page.tsx')
for (const label of ['Ya tengo cuenta', 'Tengo una invitación', 'Solicitar acceso']) {
  assert.ok(comenzar.includes(label), `missing public action: ${label}`)
}
for (const forbidden of ['Listo para Producción', 'Testing & QA', 'Quick Test']) {
  assert.ok(!comenzar.includes(forbidden), `public QA copy remains: ${forbidden}`)
}

console.log(JSON.stringify({ pilotAuthFlow: true }))
