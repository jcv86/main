import assert from 'node:assert/strict'
import {
  classifyAuthState,
  normalizeNextPath,
  providerRedirect,
} from '../lib/auth/pilot-access.ts'

assert.equal(classifyAuthState({ hasUser: false }), 'signed_out')
assert.equal(classifyAuthState({ hasUser: false, authErrorCode: 'session_not_found' }), 'signed_out')
assert.equal(
  classifyAuthState({ hasUser: false, authErrorCode: 'refresh_token_not_found' }),
  'invalid_session',
)
assert.equal(classifyAuthState({ hasUser: true }), 'authenticated')
assert.equal(
  classifyAuthState({ hasUser: true, authErrorCode: 'refresh_token_not_found' }),
  'authenticated',
)

assert.equal(normalizeNextPath(null), '/despega')
assert.equal(normalizeNextPath(''), '/despega')
assert.equal(normalizeNextPath('https://evil.example'), '/despega')
assert.equal(normalizeNextPath('//evil.example'), '/despega')
assert.equal(normalizeNextPath('/\\evil.example'), '/despega')
assert.equal(normalizeNextPath('/despega/a1-cerebral'), '/despega/a1-cerebral')
assert.equal(normalizeNextPath('/despega/a1-cerebral?resume=1'), '/despega/a1-cerebral?resume=1')

assert.deepEqual(
  providerRedirect('google', 'https://despegatucarrera.cl', '/despega/a1-cerebral'),
  {
    provider: 'google',
    options: {
      redirectTo:
        'https://despegatucarrera.cl/auth/callback?next=%2Fdespega%2Fa1-cerebral',
    },
  },
)

assert.deepEqual(
  providerRedirect('linkedin_oidc', 'https://despegatucarrera.cl/', 'https://evil.example'),
  {
    provider: 'linkedin_oidc',
    options: {
      redirectTo: 'https://despegatucarrera.cl/auth/callback?next=%2Fdespega',
    },
  },
)

console.log(JSON.stringify({ pilotAccessDecisions: true }))
