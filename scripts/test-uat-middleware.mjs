import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import { middleware } from '../middleware.ts'

const fixture = {
  DTC_ENVIRONMENT: 'uat',
  DTC_UAT_SUPABASE_REF: 'abcdefghijklmnopqrst',
  NEXT_PUBLIC_SUPABASE_URL: 'https://abcdefghijklmnopqrst.supabase.co',
  NEXT_PUBLIC_APP_URL: 'https://dtc-uat-fixture.vercel.app',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'sb_publishable_synthetic_fixture',
  SUPABASE_SERVICE_ROLE_KEY: 'sb_secret_synthetic_fixture',
  VERCEL_URL: 'dtc-uat-fixture.vercel.app',
  VERCEL_ENV: 'preview',
}
const optional = ['SUPABASE_URL', 'NEXT_PUBLIC_SITE_URL', 'SITE_URL', 'NEXTAUTH_URL',
  'POSTGRES_URL', 'POSTGRES_PRISMA_URL', 'POSTGRES_URL_NON_POOLING', 'DATABASE_URL',
  'NEXT_PUBLIC_OPENAI_API_KEY', 'NEXT_PUBLIC_CRON_SECRET',
  'NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY', 'NEXT_PUBLIC_SERVICE_ROLE_KEY', 'RESEND_API_KEY']
const names = [...Object.keys(fixture), ...optional]
const previous = new Map(names.map((name) => [name, process.env[name]]))
const originalFetch = globalThis.fetch
let networkCalls = 0
let checks = 0
async function check(name, fn) { await fn(); checks += 1; console.log(`PASS ${name}`) }

try {
  for (const name of optional) delete process.env[name]
  Object.assign(process.env, fixture)
  globalThis.fetch = async () => { networkCalls += 1; throw new Error('Network forbidden in this fixture.') }

  await check('incomplete UAT fails before session/database I/O', async () => {
    delete process.env.DTC_UAT_SUPABASE_REF
    const response = await middleware(new NextRequest(`${fixture.NEXT_PUBLIC_APP_URL}/despega/recorrido`))
    assert.equal(response.status, 503)
    assert.equal(response.headers.get('X-DTC-UAT-Backend'), null)
    process.env.DTC_UAT_SUPABASE_REF = fixture.DTC_UAT_SUPABASE_REF
  })
  await check('wrong application origin is denied before session/database I/O', async () => {
    const response = await middleware(new NextRequest('https://www.despegatucarrera.com/despega/recorrido'))
    assert.equal(response.status, 403)
  })
  await check('cron, email and contact handlers cannot run in UAT', async () => {
    for (const path of ['/api/cron/a4-opportunities', '/api/emails/send', '/api/contact']) {
      const response = await middleware(new NextRequest(`${fixture.NEXT_PUBLIC_APP_URL}${path}`))
      assert.equal(response.status, 403)
      assert.equal((await response.json()).error, 'uat_external_action_disabled')
    }
  })
  await check('an ordinary API continues with UAT identity and noindex', async () => {
    const response = await middleware(new NextRequest(`${fixture.NEXT_PUBLIC_APP_URL}/api/health/live`))
    assert.equal(response.headers.get('x-middleware-next'), '1')
    assert.equal(response.headers.get('X-DTC-Environment'), 'uat')
    assert.equal(response.headers.get('X-DTC-UAT-Backend'), fixture.DTC_UAT_SUPABASE_REF)
    assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow, noarchive')
    assert.match(response.headers.get('Cache-Control'), /no-store/)
  })
  await check('remote laboratory routes remain unavailable', async () => {
    const response = await middleware(new NextRequest(`${fixture.NEXT_PUBLIC_APP_URL}/auth/test`))
    assert.equal(response.status, 404)
  })
  await check('A2 assistant uses the bounded AI allowance without consuming auth or ordinary API allowance', async () => {
    const headers = { 'x-forwarded-for': '192.0.2.211' }
    for (let index = 0; index < 20; index++) {
      const response = await middleware(new NextRequest(`${fixture.NEXT_PUBLIC_APP_URL}/api/despega/a2-coach`, { method: 'POST', headers }))
      assert.equal(response.headers.get('x-middleware-next'), '1')
    }
    const limited = await middleware(new NextRequest(`${fixture.NEXT_PUBLIC_APP_URL}/api/despega/a2-coach`, { method: 'POST', headers }))
    assert.equal(limited.status, 429)
    assert.ok(Number(limited.headers.get('retry-after')) > 3_500, 'The one-hour AI window applies')
    for (const path of ['/api/journey/context', '/api/auth/signout']) {
      const response = await middleware(new NextRequest(`${fixture.NEXT_PUBLIC_APP_URL}${path}`, { method: 'POST', headers }))
      assert.equal(response.headers.get('x-middleware-next'), '1', `${path} keeps its separate allowance`)
    }
  })
  await check('normal application mode does not acquire UAT behavior', async () => {
    delete process.env.DTC_ENVIRONMENT
    const response = await middleware(new NextRequest('https://www.despegatucarrera.com/api/health/live'))
    assert.equal(response.headers.get('x-middleware-next'), '1')
    assert.equal(response.headers.get('X-DTC-Environment'), null)
  })
  assert.equal(networkCalls, 0)
  console.log(`${checks}/${checks} real middleware checks passed with zero network calls.`)
} finally {
  globalThis.fetch = originalFetch
  for (const [name, value] of previous) {
    if (value === undefined) delete process.env[name]
    else process.env[name] = value
  }
}
