import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { NextRequest } from 'next/server'
import {
  createInvitationCookieValue,
  resolveInvitationCookieSecret,
  verifyInvitationCookieValue,
} from '../lib/auth/invitation-cookie.ts'

const source = (path) => readFileSync(path, 'utf8')
const secret = 'test-secret-that-is-long-enough-for-hmac'
const claimId = '11111111-1111-4111-8111-111111111111'
const signed = createInvitationCookieValue(claimId, secret)

assert.notEqual(signed, claimId)
assert.equal(verifyInvitationCookieValue(signed, secret), claimId)
assert.equal(verifyInvitationCookieValue(`${signed}x`, secret), null)

assert.equal(
  resolveInvitationCookieSecret({
    PILOT_INVITATION_COOKIE_SECRET: secret,
    SUPABASE_SERVICE_ROLE_KEY: 'service-role-key-that-is-also-long-enough',
  }),
  secret,
)
const derivedSecret = resolveInvitationCookieSecret({
  PILOT_INVITATION_COOKIE_SECRET: '',
  SUPABASE_SERVICE_ROLE_KEY: 'service-role-key-that-is-long-enough-for-a-safe-fallback',
})
assert.equal(derivedSecret.length, 64)
assert.equal(
  derivedSecret,
  resolveInvitationCookieSecret({
    SUPABASE_SERVICE_ROLE_KEY: 'service-role-key-that-is-long-enough-for-a-safe-fallback',
  }),
)
assert.equal(resolveInvitationCookieSecret({}), '')

const claimRoute = source('app/api/auth/invitation/claim/route.ts')
assert.match(claimRoute, /claim_pilot_invitation/)
assert.match(claimRoute, /export async function GET/)
assert.match(claimRoute, /export async function POST/)
const getHandler = claimRoute.slice(
  claimRoute.indexOf('export async function GET'),
  claimRoute.indexOf('export async function POST'),
)
const postHandler = claimRoute.slice(claimRoute.indexOf('export async function POST'))
const claimProcessor = source('lib/auth/process-invitation-claim.ts')
assert.doesNotMatch(getHandler, /claim_pilot_invitation|createAdminClient|createHash\(['"]sha256['"]\)/)
assert.match(getHandler, /method=\"post\"/)
assert.match(getHandler, /Confirmar y continuar/)
assert.match(getHandler, /Cache-Control['"]:\s*['"]no-store/)
assert.match(claimProcessor, /request\.formData\(\)/)
assert.match(postHandler, /claim_pilot_invitation/)
assert.match(claimProcessor, /createHash\(['"]sha256['"]\)/)
assert.match(claimProcessor, /httpOnly:\s*true/)
assert.match(claimProcessor, /sameSite:\s*['"]lax['"]/)
assert.match(claimProcessor, /maxAge:\s*PILOT_CLAIM_MAX_AGE/)
assert.match(claimRoute, /resolveInvitationCookieSecret/)
assert.doesNotMatch(claimRoute, /console\.(?:log|warn|error)\([^)]*token/)

const previousInvitationSecret = process.env.PILOT_INVITATION_COOKIE_SECRET
process.env.PILOT_INVITATION_COOKIE_SECRET = secret
const { GET: getInvitation } = await import(
  '../app/api/auth/invitation/claim/route.ts'
)
const { processInvitationClaim } = await import('../lib/auth/process-invitation-claim.ts')
const invitationToken = 'a'.repeat(43)
let claimCalls = 0
const scannerResponse = await getInvitation(
  new NextRequest(`https://www.despegatucarrera.com/api/auth/invitation/claim?token=${invitationToken}`),
)
assert.equal(scannerResponse.status, 200)
assert.equal(scannerResponse.headers.get('set-cookie'), null)
assert.match(await scannerResponse.text(), /Confirmar y continuar/)
assert.equal(claimCalls, 0, 'scanner GET must not claim the invitation')

const form = new FormData()
form.set('token', invitationToken)
const claimResponse = await processInvitationClaim(
  new NextRequest('https://www.despegatucarrera.com/api/auth/invitation/claim', {
    method: 'POST',
    body: form,
  }),
  {
    createClaimId: () => claimId,
    claim: async (tokenHash, receivedClaimId) => {
      claimCalls += 1
      assert.equal(tokenHash.length, 64)
      assert.equal(receivedClaimId, claimId)
      return { data: { allowed: true }, error: null }
    },
  },
)
assert.equal(claimCalls, 1, 'explicit POST must claim exactly once')
assert.equal(claimResponse.status, 303)
assert.equal(claimResponse.headers.get('location'), 'https://www.despegatucarrera.com/auth/signin?invited=1')
assert.match(claimResponse.headers.get('set-cookie') || '', /dtc_pilot_claim=/)
if (previousInvitationSecret === undefined) delete process.env.PILOT_INVITATION_COOKIE_SECRET
else process.env.PILOT_INVITATION_COOKIE_SECRET = previousInvitationSecret

for (const legacyRoutePath of [
  'app/api/auth/validate-invitation/route.ts',
  'app/api/auth/redeem-invitation/route.ts',
  'app/api/auth/invitation-status/route.ts',
]) {
  const legacyRoute = source(legacyRoutePath)
  assert.match(legacyRoute, /status:\s*410/)
  assert.match(legacyRoute, /LEGACY_INVITATION_FLOW_RETIRED/)
  assert.match(legacyRoute, /['"]Cache-Control['"]:\s*['"]no-store['"]/)
  assert.doesNotMatch(legacyRoute, /createAdminClient|invitation_codes|user_invitations/)
}

const signIn = source('app/auth/signin/page.tsx')
assert.match(signIn, /Continuar con Google/)
assert.match(signIn, /Continuar con LinkedIn/)
assert.match(signIn, /PILOT_OAUTH_NEXT_COOKIE/)
assert.match(signIn, /encodeURIComponent\(nextPath\)/)
assert.doesNotMatch(signIn, /Código de Invitación/)
assert.doesNotMatch(signIn, /validate-invitation/)

const callback = source('app/auth/callback/route.ts')
assert.match(callback, /resolve_pilot_access/)
assert.match(callback, /normalizeNextPath/)
assert.match(callback, /cookieNextPath/)
assert.match(callback, /cookies\.delete\(PILOT_OAUTH_NEXT_COOKIE\)/)
assert.match(callback, /access_required/)
assert.match(callback, /auth\.signOut/)
assert.match(callback, /resolveInvitationCookieSecret/)

const middleware = source('lib/supabase/middleware.ts')
assert.match(middleware, /classifyAuthState/)
assert.match(middleware, /state === ['"]signed_out['"]/)

const rootMiddleware = source('middleware.ts')
assert.match(rootMiddleware, /RATE_LIMIT_EXEMPT_ROUTES/)
assert.match(rootMiddleware, /\/api\/auth\/invitation\/claim/)
assert.match(rootMiddleware, /!isRateLimitExemptRoute\(pathname\)/)

const comenzar = source('app/comenzar/page.tsx')
for (const label of ['Ya tengo cuenta', 'Tengo una invitación', 'Solicitar acceso']) {
  assert.ok(comenzar.includes(label), `missing public action: ${label}`)
}
for (const forbidden of ['Listo para Producción', 'Testing & QA', 'Quick Test']) {
  assert.ok(!comenzar.includes(forbidden), `public QA copy remains: ${forbidden}`)
}

console.log(JSON.stringify({ pilotAuthFlow: true }))
