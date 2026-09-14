import assert from 'node:assert/strict'

import { getAuthenticationRecovery } from '../lib/auth/signin-recovery'

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

console.log(JSON.stringify({
  evidenceLevel: 'runtime_contract',
  safeNextPreserved: true,
  externalRedirectRejected: true,
}))
