import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { readClosureFixtures } from './closure-lab.mjs'

export const AUTH_VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000, ipOffset: 10 },
  { name: 'mobile', width: 390, height: 844, ipOffset: 20 },
]
const cases = ['returning', 'invited', 'outsider', 'quota']

/** TEST-NET-1 identities exist only in this loopback browser client. */
export function authTestHeaders(viewport, scenario) {
  const index = cases.indexOf(scenario)
  assert.ok(AUTH_VIEWPORTS.some(item => item.name === viewport.name && item.ipOffset === viewport.ipOffset))
  assert.ok(index >= 0, 'Unknown bounded authentication scenario')
  return { 'x-forwarded-for': `192.0.2.${viewport.ipOffset + index}` }
}

export function readAuthFixtures(root) {
  const value = JSON.parse(readFileSync(join(root, 'auth-fixtures.private.json'), 'utf8'))
  const closure = readClosureFixtures(root)
  assert.equal(value.scope, 'disposable-local-real-email-auth')
  assert.equal(value.users.length, 4)
  assert.ok(typeof value.password === 'string' && value.password.length >= 32)
  for (const viewport of AUTH_VIEWPORTS) {
    for (const kind of ['invited', 'outsider']) {
      const label = `auth-${kind}-${viewport.name}`
      const matching = value.users.filter(user => user.label === label)
      assert.equal(matching.length, 1, 'Each acceptance identity must be unique')
      const user = matching[0]
      assert.equal(user.email, `dtc-qa-${label}@example.invalid`)
      assert.match(user.id, /^[0-9a-f-]{36}$/i)
      if (kind === 'invited') {
        assert.match(user.invitationToken, /^[A-Za-z0-9_-]{43}$/)
        assert.match(user.invitationId, /^[0-9a-f-]{36}$/i)
      } else {
        assert.equal(user.invitationToken, undefined)
      }
    }
  }
  return { ...value, returning: closure }
}

export function assertAuthSources(manifest, app, repo) {
  assert.equal(manifest.environment, 'disposable-local-real-email-auth')
  for (const required of [
    'app/auth/signin/page.tsx', 'app/auth/email-login/page.tsx',
    'app/api/auth/email-login/route.ts', 'app/api/auth/signout/route.ts',
    'app/api/auth/invitation/claim/route.ts', 'app/api/auth/pilot-status/route.ts',
    'components/session-wrapper.tsx', 'app/providers.tsx', 'components/layout/app-shell.tsx',
  ]) assert.ok(manifest.copied.some(item => item.path === required), `Missing real source: ${required}`)
  for (const item of manifest.copied) {
    const source = readFileSync(join(repo, item.path)), copied = readFileSync(join(app, item.path))
    assert.deepEqual(source, copied, `Application source changed in the laboratory: ${item.path}`)
    assert.equal(createHash('sha256').update(copied).digest('hex'), item.sha256)
  }
}
