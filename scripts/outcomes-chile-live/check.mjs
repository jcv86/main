#!/usr/bin/env node
/** Concrete safety regressions only. No Supabase/Vercel credentials or remote network. */
import assert from 'node:assert/strict'
import { execFileSync, spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { chmodSync, mkdtempSync, readdirSync, rmSync, statSync, symlinkSync } from 'node:fs'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { once } from 'node:events'
import {
  PROJECT_REF, VERCEL_PROJECT_ID, atomicPrivateJson, cooperativeCancellation, failureCode, httpDiagnostic,
  readRecoveryCheckpoint, repository, requestTracker, settledValues, validateConfig,
} from './guards.mjs'
import { captureResponse, relayRealRoute } from './browser.mjs'

const scratch = mkdtempSync(join(tmpdir(), 'dtc-outcomes-live-check-'))
chmodSync(scratch, 0o700)
const cases = []
let activeCase = 'startup'

async function test(name, callback) {
  activeCase = name
  await callback()
  cases.push({ name, status: 'PASS' })
}

async function listen(server) {
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  return `http://127.0.0.1:${server.address().port}`
}

async function closeServer(server) {
  server.closeAllConnections()
  if (server.listening) await new Promise((done) => server.close(done))
}

try {
  await test('target-and-cookie-scope-guards-without-network', async () => {
    const commitSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repository, encoding: 'utf8' }).trim()
    const config = {
      target: {
        origin: 'https://v0-fork-of-despega-tu-carrera-clone-localtest.vercel.app', environment: 'preview', readyState: 'READY',
        deploymentId: 'dpl_localtest', vercelProjectId: VERCEL_PROJECT_ID, supabaseProjectRef: PROJECT_REF,
        commitSha, verifiedAt: new Date().toISOString(),
      },
      supabase: { url: `https://${PROJECT_REF}.supabase.co`, publicKey: 'sb_publishable_local-fixture-no-network', serviceRoleKey: 'sb_secret_local-fixture-no-network' },
      evidenceDirectory: join(scratch, 'not-created'),
      vercelProtectionCookies: [{ name: '_vercel_jwt', value: 'local.synthetic.fixture' }],
    }
    assert.equal(validateConfig(config).vercelProtectionCookies[0].host, new URL(config.target.origin).hostname)
    for (const [patch, code] of [
      [{ target: { ...config.target, origin: 'https://despegatucarrera.com' } }, 'IMMUTABLE_DTC_PREVIEW_REQUIRED'],
      [{ target: { ...config.target, origin: 'https://v0-fork-of-despega-tu-carrera-clo-git-branch.vercel.app' } }, 'IMMUTABLE_DTC_PREVIEW_REQUIRED'],
      [{ target: { ...config.target, supabaseProjectRef: 'qhqcmuggyhnugkvwqqxi' } }, 'WRONG_SUPABASE_PROJECT'],
      [{ target: { ...config.target, commitSha: 'a'.repeat(40) } }, 'DEPLOYMENT_HEAD_MISMATCH'],
      [{ target: { ...config.target, verifiedAt: '2000-01-01T00:00:00Z' } }, 'STALE_DEPLOYMENT_ATTESTATION'],
      [{ vercelProtectionCookies: [{ name: '_vercel_jwt', value: 'local', host: 'unrelated.invalid' }] }, 'INVALID_VERCEL_PROTECTION_COOKIE_SCOPE'],
      [{ vercelProtectionCookies: [{ name: 'arbitrary_cookie', value: 'local' }] }, 'INVALID_VERCEL_PROTECTION_COOKIE_SCOPE'],
      [{ evidenceDirectory: join(repository, 'bad-evidence') }, 'EVIDENCE_MUST_BE_OUTSIDE_CHECKOUT'],
    ]) assert.throws(() => validateConfig({ ...config, ...patch }), (error) => failureCode(error) === code)
  })

  await test('http-diagnostics-redact-values-and-untrusted-keys', async () => {
    const sensitive = 'must-not-appear-in-evidence'
    const diagnostic = httpDiagnostic({
      path: '/api/auth/pilot-status', method: 'GET', status: 429,
      contentType: 'application/json; charset=utf-8', retryAfter: '900', jsonState: 'parsed',
      data: { error: sensitive, message: sensitive, retryAfter: 900, resetAt: sensitive,
        [sensitive]: sensitive, session: { access_token: sensitive }, cookie: sensitive },
    })
    assert.deepEqual(diagnostic, {
      path: '/api/auth/pilot-status', method: 'GET', status: 429, contentType: 'json', bodyKind: 'object',
      responseKeys: ['error', 'message', 'resetAt', 'retryAfter'], omittedResponseKeyCount: 3,
      retryAfterPresent: true, retryAfterSeconds: 900,
    })
    assert.ok(!JSON.stringify(diagnostic).includes(sensitive))
    for (const retryAfter of [sensitive, '900000', '0.5', '-1']) {
      const invalid = httpDiagnostic({ path: '/sensitive/' + sensitive, method: sensitive, status: 503,
        contentType: sensitive, retryAfter, data: [sensitive], jsonState: 'parsed' })
      assert.equal(invalid.path, 'OTHER_PATH')
      assert.equal(invalid.method, 'OTHER_METHOD')
      assert.equal(invalid.bodyKind, 'array')
      assert.equal(invalid.retryAfterSeconds, null)
      assert.ok(!JSON.stringify(invalid).includes(sensitive))
    }
  })

  await test('private-atomic-checkpoint-recovers-pre-claim-invitation', async () => {
    const path = join(scratch, 'checkpoint.json')
    const manifest = {
      formatVersion: 2, runReference: randomUUID(), projectRef: PROJECT_REF, vercelProjectId: VERCEL_PROJECT_ID,
      users: [{ id: randomUUID(), label: 'A' }], invitations: [],
    }
    atomicPrivateJson(path, manifest)
    const originalInode = statSync(path).ino
    manifest.invitations.push({ id: randomUUID(), claimId: randomUUID(), userId: manifest.users[0].id, tokenHash: 'a'.repeat(64) })
    // Represents the checkpoint written before INSERT; no claim or insert response is required to recover its identity.
    atomicPrivateJson(path, manifest)
    const recovered = readRecoveryCheckpoint(path)
    assert.deepEqual(recovered.invitations, manifest.invitations)
    assert.equal(statSync(path).mode & 0o777, 0o600)
    assert.notEqual(statSync(path).ino, originalInode, 'checkpoint replacement must be atomic rename, not in-place truncation')
    assert.deepEqual(readdirSync(scratch), ['checkpoint.json'])
    assert.ok(!['password', 'access_token', 'refresh_token', 'serviceRoleKey', 'vercelProtectionCookies'].some((key) => JSON.stringify(recovered).includes(key)))
    symlinkSync(path, join(scratch, 'symlink.json'))
    assert.throws(() => readRecoveryCheckpoint(join(scratch, 'symlink.json')))
    chmodSync(path, 0o644)
    assert.throws(() => readRecoveryCheckpoint(path), (error) => failureCode(error) === 'RECOVERY_FILE_MUST_BE_PRIVATE_OWNED_REGULAR')
    chmodSync(path, 0o600)
    atomicPrivateJson(path, { ...manifest, invitations: [{ ...manifest.invitations[0], userId: randomUUID() }] })
    assert.throws(() => readRecoveryCheckpoint(path), (error) => failureCode(error) === 'RECOVERY_INVITATION_MANIFEST_INVALID')
  })

  await test('cancellation-waits-for-in-flight-work-and-does-not-interrupt-cleanup', async () => {
    const cancellation = cooperativeCancellation()
    const requests = requestTracker()
    let complete
    let operationFinished = false
    const inFlight = requests.track(async () => {
      await new Promise((done) => { complete = done })
      operationFinished = true
    })
    await Promise.resolve()
    assert.equal(requests.size, 1)
    assert.equal(cancellation.request('SIGTERM'), true)
    assert.equal(operationFinished, false)
    assert.throws(() => cancellation.check(), (error) => failureCode(error) === 'CANCELLED_BY_SIGTERM')
    cancellation.beginDrain()
    const drained = requests.drain()
    assert.equal(operationFinished, false)
    complete()
    await drained
    await inFlight
    assert.equal(operationFinished, true)
    assert.equal(requests.size, 0)
    cancellation.beginCleanup()
    assert.equal(cancellation.request('SIGINT'), false)
    assert.doesNotThrow(() => cancellation.check())
    let secondCompleted = false
    await assert.rejects(settledValues([
      Promise.reject(new Error('local expected failure')),
      new Promise((done) => setTimeout(() => { secondCompleted = true; done() }, 10)),
    ]))
    assert.equal(secondCompleted, true, 'a rejected concurrent member must not race cleanup against its sibling')
  })

  await test('actual-runner-sigterm-during-stdin-exits-without-remote-writes', async () => {
    const child = spawn(process.execPath, ['scripts/outcomes-chile-live/run.mjs', '--preflight'], { cwd: repository, stdio: ['pipe', 'pipe', 'pipe'] })
    let stdout = ''
    let markReady
    const ready = new Promise((done) => { markReady = done })
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString()
      if (stdout.includes('"status":"AWAITING_STDIN"')) markReady()
    })
    child.stderr.resume()
    const exited = once(child, 'exit')
    const timeout = setTimeout(() => child.kill('SIGKILL'), 5_000)
    try {
      await Promise.race([ready, exited.then(() => { throw new Error('runner exited before input readiness') })])
      child.kill('SIGTERM')
      const [code, signal] = await exited
      assert.equal(signal, null)
      assert.equal(code, 1)
      const output = stdout.trim().split('\n').map((line) => JSON.parse(line))
      const report = output.at(-1)
      assert.equal(report.cancellationRequested, 'SIGTERM')
      assert.equal(report.failure, 'CANCELLED_BY_SIGTERM')
      assert.equal(report.verdict, 'NO_GO')
      assert.equal(report.cases.length, 0)
    } finally { clearTimeout(timeout); if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL') }
  })

  await test('failed-browser-click-does-not-abandon-an-unhandled-response-waiter', async () => {
    const root = process.env.DTC_OUTCOMES_UI_TOOLS_ROOT
    const load = createRequire(join(root ? resolve(root) : repository, 'package.json'))
    const { chromium } = load('playwright')
    const module = load('@sparticuz/chromium')
    const binary = module.default ?? module
    let browser
    let unhandledWaiters = 0
    const observe = () => { unhandledWaiters++ }
    process.on('unhandledRejection', observe)
    try {
      browser = await chromium.launch({ executablePath: await binary.executablePath(), headless: true, args: ['--single-process', '--no-zygote', '--disable-gpu'] })
      const page = await browser.newPage()
      const waiter = captureResponse(page, 'employment_outcome')
      await assert.rejects(page.getByRole('button', { name: 'nonexistent local test button', exact: true }).click({ timeout: 25 }))
      await browser.close()
      await new Promise((done) => setImmediate(done))
      assert.equal(unhandledWaiters, 0)
      // The early rejection handler must not convert failure into a fulfilled value.
      await assert.rejects(waiter)
    } finally {
      if (browser) await browser.close()
      process.removeListener('unhandledRejection', observe)
    }
  })

  await test('real-relay-preserves-response-and-never-forwards-credentials-to-redirect-origin', async () => {
    const root = process.env.DTC_OUTCOMES_UI_TOOLS_ROOT
    const load = createRequire(join(root ? resolve(root) : repository, 'package.json'))
    const { chromium } = load('playwright')
    const module = load('@sparticuz/chromium')
    const binary = module.default ?? module
    let externalRequests = 0
    let externalCredentials = 0
    let rateLimitedRequests = 0
    const receiver = createServer((request, response) => {
      externalRequests++
      if (request.headers['x-vercel-protection-bypass'] || request.headers.authorization || request.headers.apikey || request.headers.cookie) externalCredentials++
      response.end('unexpected external destination')
    })
    let sender
    let browser
    const diagnostics = []
    const requests = requestTracker()
    try {
      const externalOrigin = await listen(receiver)
      sender = createServer((request, response) => {
        if (request.url === '/same') { response.writeHead(302, { Location: '/ok' }); response.end(); return }
        if (request.url === '/away') { response.writeHead(302, { Location: externalOrigin + '/sink' }); response.end(); return }
        if (request.url === '/json') { response.writeHead(201, { 'Content-Type': 'application/json' }); response.end('{"realTransport":true}'); return }
        if (request.url === '/api/auth/pilot-status') {
          rateLimitedRequests++
          response.writeHead(429, { 'Content-Type': 'application/json', 'Retry-After': '900' })
          response.end('{"error":"local limit","message":"local private text","retryAfter":900}')
          return
        }
        response.writeHead(200, { 'Content-Type': 'text/html', 'Set-Cookie': 'relay_cookie=preserved; Path=/; SameSite=Lax' })
        response.end('<!doctype html><title>Local relay</title><h1>Original local response</h1>')
      })
      const origin = await listen(sender)
      browser = await chromium.launch({ executablePath: await binary.executablePath(), headless: true, args: ['--single-process', '--no-zygote', '--disable-gpu'] })
      const context = await browser.newContext()
      const page = await context.newPage()
      let blockedRedirects = 0
      await context.route('**/*', async (route) => {
        if (new URL(route.request().url()).origin !== origin) return route.abort('blockedbyclient')
        const result = await relayRealRoute(route, { expectedOrigin: origin, requests, headers: {
          ...route.request().headers(), 'x-vercel-protection-bypass': 'local-dummy', authorization: 'Bearer local-dummy', apikey: 'local-dummy',
        } })
        if (result.blockedRedirect) blockedRedirects++
        if (result.diagnostic) diagnostics.push(result.diagnostic)
      })
      const original = await page.goto(origin + '/json')
      assert.equal(original.status(), 201)
      assert.equal(await original.text(), '{"realTransport":true}')
      await page.goto(origin + '/same')
      assert.equal(new URL(page.url()).pathname, '/ok')
      assert.equal(await page.locator('h1').innerText(), 'Original local response')
      assert.ok((await context.cookies()).some((cookie) => cookie.name === 'relay_cookie' && cookie.value === 'preserved'))
      const limited = await page.evaluate(async () => {
        const response = await fetch('/api/auth/pilot-status')
        return { status: response.status, text: await response.text() }
      })
      assert.equal(limited.status, 429)
      assert.equal(limited.text, '{"error":"local limit","message":"local private text","retryAfter":900}')
      await requests.drain()
      assert.equal(rateLimitedRequests, 1)
      assert.equal(diagnostics.length, 1)
      assert.equal(diagnostics[0].status, 429)
      assert.equal(diagnostics[0].retryAfterSeconds, 900)
      assert.deepEqual(diagnostics[0].responseKeys, ['error', 'message', 'retryAfter'])
      assert.ok(!JSON.stringify(diagnostics).includes('local private text'))
      await assert.rejects(page.goto(origin + '/away'))
      await requests.drain()
      assert.equal(blockedRedirects, 1)
      assert.equal(externalRequests, 0)
      assert.equal(externalCredentials, 0)
      assert.equal(requests.size, 0)
    } finally {
      await requests.drain()
      if (browser) await browser.close()
      if (sender) await closeServer(sender)
      await closeServer(receiver)
    }
  })
  process.stdout.write(JSON.stringify({ verdict: 'GO', cases, remoteNetwork: false, credentialsRequired: false }) + '\n')
} catch (error) {
  process.stdout.write(JSON.stringify({ verdict: 'NO_GO', failedCase: activeCase, code: failureCode(error), cases, remoteNetwork: false }) + '\n')
  process.exitCode = 1
} finally { rmSync(scratch, { recursive: true, force: true }) }
