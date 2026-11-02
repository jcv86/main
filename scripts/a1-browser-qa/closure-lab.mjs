import assert from 'node:assert/strict'
import { existsSync, readFileSync, realpathSync } from 'node:fs'
import { join, resolve, sep } from 'node:path'
import { tmpdir } from 'node:os'

export const CLOSURE_PORT = 3116
export const CLOSURE_BASE = `http://localhost:${CLOSURE_PORT}`

/** Every entry point checks both the disposable directory and the literal local endpoints. */
export function closureLab() {
  assert.equal(process.env.A1_BROWSER_LAB, 'yes', 'Explicit disposable lab opt-in required')
  assert.ok(process.env.A1_LAB_ROOT, 'A1_LAB_ROOT is required')
  const temporary = realpathSync(resolve(process.env.RUNNER_TEMP || tmpdir()))
  const root = realpathSync(resolve(process.env.A1_LAB_ROOT))
  assert.ok(root.startsWith(temporary + sep), 'Lab must be a child of temporary storage')
  const app = realpathSync(join(root, 'app-runtime'))
  assert.equal(app, join(root, 'app-runtime'), 'Application must not escape the disposable directory')
  assert.ok(existsSync(join(root, 'fixtures.private.json')), 'Run the previous local Auth seed first')
  assert.ok(existsSync(join(root, 'stack/supabase/config.toml')), 'Existing disposable stack is required')
  assert.ok(!existsSync(join(root, 'stack/supabase/.temp/project-ref')), 'A linked Supabase project is forbidden')
  const status = JSON.parse(readFileSync(join(root, 'status.json'), 'utf8'))
  const api = new URL(status.API_URL), database = new URL(status.DB_URL)
  assert.equal(api.protocol, 'http:', 'Only local HTTP Supabase is allowed')
  assert.ok(['postgres:', 'postgresql:'].includes(database.protocol), 'Expected local PostgreSQL')
  for (const endpoint of [api, database]) {
    assert.ok(['localhost', '127.0.0.1'].includes(endpoint.hostname), 'Remote endpoints are forbidden')
  }
  assert.ok(status.ANON_KEY && status.SERVICE_ROLE_KEY, 'Use only the local stack credentials')
  return { root, app, status, evidence: join(root, 'evidence'), repo: process.cwd() }
}

/** Do not inherit external provider credentials into the application under test. */
export function closureServerEnv(status) {
  const environment = {}
  for (const name of ['PATH', 'HOME', 'TMPDIR', 'TEMP', 'TMP', 'SystemRoot', 'CI', 'TERM']) {
    if (process.env[name]) environment[name] = process.env[name]
  }
  return {
    ...environment,
    NODE_ENV: 'development',
    NEXT_TELEMETRY_DISABLED: '1',
    NEXT_PUBLIC_APP_URL: CLOSURE_BASE,
    NEXT_PUBLIC_SUPABASE_URL: status.API_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: status.ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: status.SERVICE_ROLE_KEY,
  }
}

export function readClosureFixtures(root) {
  const value = JSON.parse(readFileSync(join(root, 'closure-fixtures.private.json'), 'utf8'))
  assert.equal(value.scope, 'disposable-local-closure')
  assert.equal(value.users.length, 2)
  for (const user of value.users) {
    assert.ok(['closure-alpha', 'closure-beta'].includes(user.label))
    assert.equal(user.email, `dtc-qa-${user.label}@example.invalid`)
    assert.match(user.id, /^[0-9a-f-]{36}$/i)
  }
  return value
}

export function safeFailure(error, secrets = []) {
  let message = error instanceof Error ? error.message : 'Unknown acceptance failure'
  for (const secret of secrets) if (secret) message = message.split(String(secret)).join('[REDACTED]')
  // Assertion/framework messages must not accidentally publish a token or database URL.
  return message.replace(/eyJ[\w-]+\.[\w-]+\.[\w-]+/g, '[JWT REDACTED]')
    .replace(/postgres(?:ql)?:\/\/\S+/g, '[DATABASE REDACTED]').slice(0, 1800)
}
