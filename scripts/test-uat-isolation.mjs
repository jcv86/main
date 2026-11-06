import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { inspectUatEnvironment, isAllowedUatRequestOrigin, isDisabledUatExternalAction, PRODUCTION_SUPABASE_REF } from '../lib/uat/environment.ts'

const ref = 'abcdefghijklmnopqrst'
const env = {
  DTC_ENVIRONMENT: 'uat',
  DTC_UAT_SUPABASE_REF: ref,
  NEXT_PUBLIC_SUPABASE_URL: `https://${ref}.supabase.co`,
  NEXT_PUBLIC_APP_URL: 'https://dtc-uat-fixture.vercel.app',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'sb_publishable_synthetic_fixture',
  SUPABASE_SERVICE_ROLE_KEY: 'sb_secret_synthetic_fixture',
}
let checks = 0
function check(name, fn) { fn(); checks += 1; console.log(`PASS ${name}`) }
function refused(patch) { assert.equal(inspectUatEnvironment({ ...env, ...patch }, true).valid, false) }
function legacyKey(project) { return `fixture.${Buffer.from(JSON.stringify({ ref: project })).toString('base64url')}.signature` }

check('UAT configuration validates without network access', () => assert.equal(inspectUatEnvironment(env, true).valid, true))
check('ordinary environments keep existing runtime behavior', () => assert.equal(inspectUatEnvironment({}).enabled, false))
check('UAT build cannot use an unmarked production or preview environment', () => { refused({ DTC_ENVIRONMENT: undefined }); refused({ DTC_ENVIRONMENT: 'production' }) })
check('production Supabase project is denied even with consistent URL', () => refused({ DTC_UAT_SUPABASE_REF: PRODUCTION_SUPABASE_REF, NEXT_PUBLIC_SUPABASE_URL: `https://${PRODUCTION_SUPABASE_REF}.supabase.co` }))
check('different public/server backends are denied', () => { refused({ NEXT_PUBLIC_SUPABASE_URL: `https://${PRODUCTION_SUPABASE_REF}.supabase.co` }); refused({ SUPABASE_URL: `https://${PRODUCTION_SUPABASE_REF}.supabase.co` }) })
check('malformed or credential-bearing backend URLs are denied', () => { refused({ NEXT_PUBLIC_SUPABASE_URL: `http://${ref}.supabase.co` }); refused({ NEXT_PUBLIC_SUPABASE_URL: `https://secret@${ref}.supabase.co` }); refused({ NEXT_PUBLIC_SUPABASE_URL: `https://${ref}.supabase.co/path` }) })
check('production domains and old project previews are denied', () => { for (const host of ['www.despegatucarrera.com', 'despegatucarrera.com', 'v0-fork-of-despega-tu-carrera-clone-fixture.vercel.app']) refused({ NEXT_PUBLIC_APP_URL: `https://${host}` }) })
check('callback aliases must stay on the UAT origin', () => { refused({ NEXTAUTH_URL: 'https://www.despegatucarrera.com' }); refused({ NEXT_PUBLIC_SITE_URL: 'https://other.example' }) })
check('keys remain mandatory without exposing their value', () => { refused({ SUPABASE_SERVICE_ROLE_KEY: '' }); refused({ NEXT_PUBLIC_SUPABASE_ANON_KEY: '' }); assert.equal(JSON.stringify(inspectUatEnvironment({ ...env, RESEND_API_KEY: 'sensitive-fixture' })).includes('sensitive-fixture'), false) })
check('legacy key refs cannot point to production', () => { refused({ SUPABASE_SERVICE_ROLE_KEY: legacyKey(PRODUCTION_SUPABASE_REF) }); refused({ NEXT_PUBLIC_SUPABASE_ANON_KEY: legacyKey(PRODUCTION_SUPABASE_REF) }); assert.equal(inspectUatEnvironment({ ...env, SUPABASE_SERVICE_ROLE_KEY: legacyKey(ref) }, true).valid, true) })
check('inherited direct database connections are rejected', () => { refused({ POSTGRES_URL: 'synthetic-value' }); refused({ DATABASE_URL: 'synthetic-value' }); refused({ POSTGRES_PASSWORD: 'synthetic-value' }) })
check('public secret aliases and application email delivery are rejected', () => { for (const key of ['NEXT_PUBLIC_OPENAI_API_KEY', 'NEXT_PUBLIC_CRON_SECRET', 'NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY']) refused({ [key]: 'synthetic-value' }) })
check('only the canonical or current immutable UAT origin is allowed', () => {
  const state = inspectUatEnvironment(env, true)
  assert.equal(isAllowedUatRequestOrigin(env.NEXT_PUBLIC_APP_URL, state), true)
  assert.equal(isAllowedUatRequestOrigin('https://dtc-uat-immutable.vercel.app', state, 'dtc-uat-immutable.vercel.app'), true)
  assert.equal(isAllowedUatRequestOrigin('https://unexpected.vercel.app', state), false)
  assert.equal(isAllowedUatRequestOrigin('https://www.despegatucarrera.com', state, 'www.despegatucarrera.com'), false)
  assert.equal(isAllowedUatRequestOrigin(env.NEXT_PUBLIC_APP_URL, inspectUatEnvironment({})), false)
})
check('cron and contact delivery are disabled, Auth remains a real application path', () => {
  for (const path of ['/api/cron/a4-opportunities', '/api/cron/a4-daily-snapshots-utc11', '/api/emails/send', '/api/contact']) assert.equal(isDisabledUatExternalAction(path), true)
  for (const path of ['/api/auth/email-login', '/api/career/objective', '/auth/callback', '/despega/recorrido']) assert.equal(isDisabledUatExternalAction(path), false)
})
check('UAT deployment has no scheduled jobs and refuses a missing environment', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'))
  assert.deepEqual(config.crons, [])
  assert.equal(config.buildCommand, 'npm run build:uat')
})
check('hosted regular-build preflight rejects an unmarked existing project', () => {
  const result = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/assert-uat-environment.ts', '--if-hosted'], {
    cwd: new URL('..', import.meta.url),
    env: { PATH: process.env.PATH, VERCEL_ENV: 'preview' },
    encoding: 'utf8',
  })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /DTC_ENVIRONMENT must be uat/)
})

console.log(`${checks}/${checks} UAT isolation checks passed; no remote service was contacted.`)
