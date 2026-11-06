import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { spawnSync } from 'node:child_process'
import { closureLab } from './closure-lab.mjs'
import { AUTH_VIEWPORTS, assertAuthSources, authTestHeaders, readAuthFixtures } from './auth-lab.mjs'

// No server, database, browser or network is started. Prove the new entrypoints
// inherit the disposable/loopback guards and detect copied-source tampering.
const temporary = mkdtempSync(join(tmpdir(), 'dtc-auth-guard-check-'))
const root = join(temporary, 'lab'), app = join(root, 'app-runtime')
const oldEnvironment = { A1_BROWSER_LAB: process.env.A1_BROWSER_LAB,
  RUNNER_TEMP: process.env.RUNNER_TEMP, A1_LAB_ROOT: process.env.A1_LAB_ROOT }
let checked = 0
const reject = (fn, message) => { assert.throws(fn, message); checked += 1 }
try {
  mkdirSync(app, { recursive: true })
  mkdirSync(join(root, 'stack/supabase'), { recursive: true })
  mkdirSync(join(root, 'evidence'))
  writeFileSync(join(root, 'stack/supabase/config.toml'), 'project_id = "guard-self-check"\n')
  writeFileSync(join(root, 'fixtures.private.json'), '{}')
  writeFileSync(join(root, 'closure-prepared.json'), '{}')
  const status = { API_URL: 'http://127.0.0.1:54321', DB_URL: 'postgresql://local:local@127.0.0.1:54322/local',
    ANON_KEY: 'synthetic-public-key-for-guard-check', SERVICE_ROLE_KEY: 'synthetic-local-key-for-guard-check' }
  const writeStatus = value => writeFileSync(join(root, 'status.json'), JSON.stringify(value))
  writeStatus(status)
  Object.assign(process.env, { A1_BROWSER_LAB: 'yes', RUNNER_TEMP: temporary, A1_LAB_ROOT: root })
  assert.equal(closureLab().app, app); checked += 1
  process.env.A1_BROWSER_LAB = 'no'
  reject(closureLab, /opt-in/)
  process.env.A1_BROWSER_LAB = 'yes'
  for (const patch of [
    { API_URL: 'https://remote.example.invalid' },
    { API_URL: 'http://remote.example.invalid' },
    { API_URL: 'https://localhost:54321' },
    { DB_URL: 'postgresql://local:local@remote.example.invalid:54322/local' },
  ]) {
    writeStatus({ ...status, ...patch })
    reject(closureLab, /local|Remote/)
  }
  writeStatus(status)
  mkdirSync(join(root, 'stack/supabase/.temp'))
  writeFileSync(join(root, 'stack/supabase/.temp/project-ref'), 'not-allowed')
  reject(closureLab, /linked/)
  rmSync(join(root, 'stack/supabase/.temp/project-ref'))
  process.env.RUNNER_TEMP = join(root, 'stack')
  reject(closureLab, /child of temporary/)
  process.env.RUNNER_TEMP = temporary

  const addresses = AUTH_VIEWPORTS.flatMap(viewport => ['returning', 'invited', 'outsider', 'quota']
    .map(scenario => authTestHeaders(viewport, scenario)['x-forwarded-for']))
  assert.equal(new Set(addresses).size, 8)
  assert.ok(addresses.every(address => /^192\.0\.2\.\d+$/.test(address))); checked += 1
  reject(() => authTestHeaders(AUTH_VIEWPORTS[0], 'unbounded'), /Unknown/)

  const uuid = index => `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`
  writeFileSync(join(root, 'closure-fixtures.private.json'), JSON.stringify({ scope: 'disposable-local-closure',
    password: 'synthetic-password-guard-check-only', users: ['closure-alpha', 'closure-beta'].map((label, index) =>
      ({ label, id: uuid(index + 1), email: `dtc-qa-${label}@example.invalid` })) }))
  const users = AUTH_VIEWPORTS.flatMap((viewport, index) => ['invited', 'outsider'].map((kind, kindIndex) => {
    const label = `auth-${kind}-${viewport.name}`
    return { label, id: uuid(index * 2 + kindIndex + 3), email: `dtc-qa-${label}@example.invalid`,
      ...(kind === 'invited' ? { invitationToken: 'a'.repeat(43), invitationId: uuid(index + 20) } : {}) }
  }))
  const fixtures = { scope: 'disposable-local-real-email-auth', password: 'synthetic-password-guard-check-only', users }
  const writeFixtures = value => writeFileSync(join(root, 'auth-fixtures.private.json'), JSON.stringify(value))
  writeFixtures(fixtures)
  assert.equal(readAuthFixtures(root).users.length, 4); checked += 1
  writeFixtures({ ...fixtures, scope: 'remote' })
  reject(() => readAuthFixtures(root))
  writeFixtures({ ...fixtures, users: users.map((user, index) => index ? user : { ...user, email: 'real@example.com' }) })
  reject(() => readAuthFixtures(root))
  writeFixtures(fixtures)

  const prepared = spawnSync(process.execPath, ['scripts/a1-browser-qa/auth-prepare.mjs'], {
    cwd: process.cwd(), encoding: 'utf8', env: { PATH: process.env.PATH,
      A1_BROWSER_LAB: 'yes', A1_LAB_ROOT: root, RUNNER_TEMP: temporary, A1_SOURCE_COMMIT: 'guard-self-check' },
  })
  assert.equal(prepared.status, 0, prepared.stderr)
  const manifest = JSON.parse(readFileSync(join(root, 'auth-prepared.json'), 'utf8'))
  assertAuthSources(manifest, app, process.cwd()); checked += 1
  const observer = readFileSync(join(app, 'app/auth-session-observer.tsx'), 'utf8')
  assert.ok(observer.includes('useSession()'))
  assert.ok(!/fetch\(|signIn|signOut|setSession|document\.cookie/.test(observer)); checked += 1
  writeFileSync(join(app, 'app/auth/email-login/page.tsx'), 'tampered auth implementation')
  reject(() => assertAuthSources(manifest, app, process.cwd()), /changed in the laboratory/)
  const repeated = spawnSync(process.execPath, ['scripts/a1-browser-qa/auth-prepare.mjs'], {
    cwd: process.cwd(), encoding: 'utf8', env: { PATH: process.env.PATH,
      A1_BROWSER_LAB: 'yes', A1_LAB_ROOT: root, RUNNER_TEMP: temporary },
  })
  assert.notEqual(repeated.status, 0)
  assert.match(repeated.stderr, /only once/); checked += 1
  console.log(`Real email-auth laboratory self-check: PASS (${checked} isolation/fixture/source checks; no network or database).`)
} finally {
  for (const [name, value] of Object.entries(oldEnvironment)) {
    if (value === undefined) delete process.env[name]
    else process.env[name] = value
  }
  rmSync(temporary, { recursive: true, force: true })
}
