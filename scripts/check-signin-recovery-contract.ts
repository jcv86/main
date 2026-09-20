import assert from 'node:assert/strict'

import { getAuthenticationRecovery } from '../lib/auth/signin-recovery'
import { isStaleOAuthStateReturn, OAUTH_STATE_EXPIRED_REASON } from '../lib/auth/oauth-recovery'

const unavailable = getAuthenticationRecovery('authentication_unavailable', '/despega/a2/dia-7')
assert.equal(unavailable?.title, 'Acceso temporalmente no disponible')
assert.equal(unavailable?.retryHref, '/auth/signin?next=%2Fdespega%2Fa2%2Fdia-7')

const invalidSession = getAuthenticationRecovery('authentication_verification_failed', '/despega/a4?tab=decisiones')
assert.equal(invalidSession?.title, 'No pudimos verificar tu sesión')
assert.equal(invalidSession?.retryHref, '/auth/signin?next=%2Fdespega%2Fa4%3Ftab%3Ddecisiones')

const unsafeNext = getAuthenticationRecovery('authentication_verification_failed', 'https://example.com/phishing')
assert.equal(unsafeNext?.retryHref, '/auth/signin?next=%2Fdespega')
assert.equal(getAuthenticationRecovery('unknown', '/despega'), null)
assert.equal(getAuthenticationRecovery(null, '/despega'), null)

const staleOAuth = new URLSearchParams('error=invalid_request&error_code=bad_oauth_state&error_description=OAuth+state+not+found+or+expired')
assert.equal(isStaleOAuthStateReturn('/', staleOAuth), true)
assert.equal(isStaleOAuthStateReturn('/auth/signin', staleOAuth), false)
assert.equal(isStaleOAuthStateReturn('/', new URLSearchParams('error=access_denied&error_code=provider_error')), false)

const expiredOAuth = getAuthenticationRecovery(OAUTH_STATE_EXPIRED_REASON, '/despega')
assert.equal(expiredOAuth?.title, 'El inicio de sesión anterior expiró')
assert.equal(expiredOAuth?.retryHref, '/auth/signin?next=%2Fdespega')

console.log(JSON.stringify({
  evidenceLevel: 'runtime_contract',
  safeNextPreserved: true,
  externalRedirectRejected: true,
  staleOAuthStateRecovered: true,
}))