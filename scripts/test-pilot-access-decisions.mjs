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
  providerRedirect('google', 'https://despegatucarrera.cl'),
  {
    provider: 'google',
    options: {
      redirectTo:
        'https://despegatucarrera.cl/auth/callback',
    },
  },
)

assert.deepEqual(
  providerRedirect('linkedin_oidc', 'https://despegatucarrera.cl/'),
  {
    provider: 'linkedin_oidc',
    options: {
      redirectTo: 'https://despegatucarrera.cl/auth/callback',
    },
  },
)

console.log(JSON.stringify({ pilotAccessDecisions: true }))
