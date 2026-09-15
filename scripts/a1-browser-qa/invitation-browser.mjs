import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { Client } from 'pg'

assert.equal(process.env.A1_BROWSER_LAB, 'yes', 'Only the disposable browser lab may run')

const root = resolve(process.env.A1_LAB_ROOT)
const base = 'http://localhost:3110'
const status = JSON.parse(readFileSync(join(root, 'status.json'), 'utf8'))
const fixtures = JSON.parse(readFileSync(join(root, 'fixtures.private.json'), 'utf8'))
assert.ok(fixtures.invitationToken)
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(status.API_URL).hostname), 'Remote Supabase forbidden')

const requireTool = createRequire(join(process.env.A1_TOOLS_ROOT, 'package.json'))
const { chromium } = requireTool('playwright')
const tokenHash = createHash('sha256').update(fixtures.invitationToken).digest('hex')
const invitationUrl = `${base}/api/auth/invitation/claim?token=${encodeURIComponent(fixtures.invitationToken)}`

const db = new Client({ connectionString: status.DB_URL })
await db.connect()

const server = spawn(
  process.execPath,
  [join(process.cwd(), 'node_modules/next/dist/bin/next'), 'dev', '--hostname', 'localhost', '--port', '3110'],
  {
    cwd: join(root, 'app-runtime'),
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: status.API_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: status.ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: status.SERVICE_ROLE_KEY,
      NEXT_TELEMETRY_DISABLED: '1',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  },
)

let browser
try {
  let ready = false
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null) throw new Error('Invitation lab server stopped before readiness')
    try {
      if ((await fetch(base)).ok) {
        ready = true
        break
      }
    } catch {}
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 500))
  }
  assert.ok(ready, 'Invitation lab server did not become ready')

  browser = await chromium.launch({ headless: true })
  const scannerContext = await browser.newContext()
  const scanner = await scannerContext.newPage()

  await scanner.goto(invitationUrl)
  await scanner.getByRole('heading', { name: 'Confirma tu invitación' }).waitFor()

  let row = (await db.query(
    'select status, claimed_by_claim_id from public.pilot_invitations where token_hash = $1',
    [tokenHash],
  )).rows[0]
  assert.equal(row.status, 'issued', 'GET scanner visit must not reserve the invitation')
  assert.equal(row.claimed_by_claim_id, null)

  await scanner.getByRole('button', { name: 'Confirmar y continuar' }).click()
  await scanner.waitForURL('**/auth/signin?invited=1')

  row = (await db.query(
    'select status, claimed_by_claim_id, claimed_at from public.pilot_invitations where token_hash = $1',
    [tokenHash],
  )).rows[0]
  assert.equal(row.status, 'claimed')
  assert.ok(row.claimed_by_claim_id)
  assert.ok(row.claimed_at)
  const firstClaimId = String(row.claimed_by_claim_id)

  const claimCookie = (await scannerContext.cookies()).find((cookie) => cookie.name === 'dtc_pilot_claim')
  assert.ok(claimCookie, 'Claim cookie must be created only after explicit POST')
  assert.equal(claimCookie.httpOnly, true)
  assert.equal(claimCookie.sameSite, 'Lax')

  const secondContext = await browser.newContext()
  const second = await secondContext.newPage()
  await second.goto(invitationUrl)
  await second.getByRole('heading', { name: 'Confirma tu invitación' }).waitFor()

  row = (await db.query(
    'select status, claimed_by_claim_id from public.pilot_invitations where token_hash = $1',
    [tokenHash],
  )).rows[0]
  assert.equal(row.status, 'claimed')
  assert.equal(String(row.claimed_by_claim_id), firstClaimId, 'A later GET must not alter the original claim')

  await second.getByRole('button', { name: 'Confirmar y continuar' }).click()
  await second.waitForURL('**/auth/signin?error=invalid_invitation')

  row = (await db.query(
    'select status, claimed_by_claim_id from public.pilot_invitations where token_hash = $1',
    [tokenHash],
  )).rows[0]
  assert.equal(row.status, 'claimed')
  assert.equal(String(row.claimed_by_claim_id), firstClaimId, 'Single-use claim must remain bound to the first browser')
  assert.equal((await secondContext.cookies()).some((cookie) => cookie.name === 'dtc_pilot_claim'), false)

  writeFileSync(
    join(root, 'evidence', 'invitation-browser.json'),
    JSON.stringify({
      commit: process.env.A1_SOURCE_COMMIT,
      scope: 'real Chromium + real production invitation route + real production claim SQL; disposable local Supabase only',
      scannerGetMutatedInvitation: false,
      explicitPostClaimedInvitation: true,
      claimCookieHttpOnly: true,
      claimCookieSameSiteLax: true,
      secondBrowserCouldReclaim: false,
      verdict: 'PASS',
    }, null, 2),
  )
  console.log('DTC invitation browser: PASS (GET read-only, POST single-use claim, HttpOnly cookie)')
} finally {
  if (browser) await browser.close()
  server.kill('SIGTERM')
  await db.end()
}
