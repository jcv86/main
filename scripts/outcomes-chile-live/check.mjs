#!/usr/bin/env node
/** Concrete safety regressions only. No Supabase/Vercel credentials or remote network. */
import assert from 'node:assert/strict'
import { execFileSync, spawn } from 'node:child_process'
import { randomUUID, X509Certificate } from 'node:crypto'
import { chmodSync, existsSync, lstatSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs'
import { createServer, request as httpRequest } from 'node:http'
import { createServer as createHttpsServer } from 'node:https'
import { connect as connectSocket } from 'node:net'
import { createRequire } from 'node:module'
import { homedir, tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { once } from 'node:events'
import { AuthApiError, AuthSessionMissingError, GoTrueAdminApi } from '@supabase/supabase-js'
import {
  API_PATH, PAGE_PATH, PROJECT_REF, VERCEL_PROJECT_ID, atomicPrivateJson, browserFailureCategory, configuredBrowserProxy, cooperativeCancellation, createNssTrustDirectory, failureCode, httpDiagnostic,
  readRecoveryCheckpoint, repository, requestTracker, revokeThenRemove, sessionRevocationDiagnostic, settledValues, validateConfig,
} from './guards.mjs'
import { browserPreflight, browserRequestDecision, captureResponse, installNativeRequestGuard, prepareBrowserContext, relayRealRoute } from './browser.mjs'

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

  await test('session-revocation-classification-and-failure-cannot-strand-owner', async () => {
    const failures = []
    for (const [status, code, expectedOutcome, expectedCategory] of [
      [403, 'session_not_found', 'already_absent', 'SESSION_ALREADY_ABSENT'],
      [400, 'bad_jwt', 'failed', 'INVALID_SESSION_TOKEN'],
      [403, 'not_admin', 'failed', 'ADMIN_PERMISSION_DENIED'],
      [429, 'over_request_rate_limit', 'failed', 'RATE_LIMITED'],
    ]) {
      // Exercise the installed SDK's real wire-error mapping without a network request or JWT.
      const api = new GoTrueAdminApi({ url: 'http://local-sdk.invalid', headers: {},
        fetch: async () => new Response(JSON.stringify({ code, msg: 'local private error text' }), { status, headers: { 'Content-Type': 'application/json', 'X-Supabase-Api-Version': '2024-01-01' } }),
      })
      const result = await api.signOut('local-noncredential', 'global')
      const diagnostic = sessionRevocationDiagnostic(result.error)
      assert.equal(diagnostic.outcome, expectedOutcome)
      assert.equal(diagnostic.category, expectedCategory)
      assert.ok(!JSON.stringify(diagnostic).includes('local private error text'))
      if (expectedOutcome === 'already_absent') {
        assert.equal(result.error.name, 'AuthSessionMissingError')
        assert.equal(diagnostic.status, 400)
      } else failures.push(result.error)
    }
    for (const status of [400, 401, 403, 404]) {
      assert.equal(sessionRevocationDiagnostic(new AuthApiError('local', status)).outcome, 'failed')
    }
    assert.equal(sessionRevocationDiagnostic(new AuthSessionMissingError()).outcome, 'already_absent')
    let removed = false
    const diagnostics = []
    await revokeThenRemove({ tokens: ['local-a', 'local-b', 'local-c'],
      revoke: async () => { throw failures.shift() },
      onRevocation: (diagnostic) => diagnostics.push(diagnostic),
      remove: async () => { removed = true },
    })
    assert.equal(removed, true)
    assert.equal(diagnostics.filter((entry) => entry.outcome === 'failed').length, 3)
    await assert.rejects(revokeThenRemove({ tokens: ['local'], revoke: async () => ({ error: null }),
      onRevocation: () => {}, remove: async () => { throw new Error('local removal failure') },
    }))
  })

  await test('configured-proxy-is-explicit-and-browser-errors-are-categories-only', async () => {
    assert.deepEqual(configuredBrowserProxy({ HTTPS_PROXY: 'http://127.0.0.1:12345', ALL_PROXY: 'socks5h://127.0.0.1:23456' }), { server: 'http://127.0.0.1:12345' })
    assert.equal(configuredBrowserProxy({}), undefined)
    for (const value of ['http://user:password@127.0.0.1:12345', 'http://127.0.0.1:12345/path', 'socks5://127.0.0.1:12345', 'not-a-url']) {
      assert.throws(() => configuredBrowserProxy({ HTTPS_PROXY: value }), (error) => failureCode(error) === 'BROWSER_CONFIGURED_PROXY_INVALID')
    }
    assert.throws(() => configuredBrowserProxy({ ALL_PROXY: 'socks5h://127.0.0.1:23456' }), (error) => failureCode(error) === 'BROWSER_CONFIGURED_HTTP_PROXY_REQUIRED')
    assert.equal(browserFailureCategory(new Error('getaddrinfo ENOTFOUND private-host-with-token')), 'DNS')
    assert.equal(browserFailureCategory(new Error('Storage.setCookies: Invalid cookie fields private-value')), 'COOKIE_INVALID')
    assert.equal(browserFailureCategory(new Error('net::ERR_TUNNEL_CONNECTION_FAILED private-url')), 'PROXY')
    assert.equal(browserFailureCategory(new Error('unrecognized private error text')), 'UNEXPECTED')
  })

  await test('actual-context-imports-normal-cookie-chunks-before-remote-writes', async () => {
    const origin = 'https://v0-fork-of-despega-tu-carrera-clone-localtest.vercel.app'
    const cookies = [{ name: `sb-${PROJECT_REF}-auth-token.0`, value: 'a'.repeat(3180) },
      { name: `sb-${PROJECT_REF}-auth-token.1`, value: 'b'.repeat(1000) }, { name: '_vercel_jwt', value: 'c'.repeat(313) }]
    const view = await prepareBrowserContext({ origin, cookies })
    try {
      assert.equal(view.page.url(), 'about:blank')
      assert.equal((await view.context.cookies(origin)).length, 3)
    } finally { await view.browser.close() }
  })

  await test('actual-browser-preflight-health-and-anonymous-redirect-use-configured-loopback-proxy', async () => {
    const environmentKeys = ['HTTPS_PROXY', 'https_proxy', 'HTTP_PROXY', 'http_proxy', 'ALL_PROXY', 'all_proxy', 'NODE_USE_ENV_PROXY']
    const originalEnvironment = Object.fromEntries(environmentKeys.map((key) => [key, process.env[key]]))
    const sockets = new Set()
    let proxyRequests = 0
    const seen = []
    const diagnostics = []
    const health = createServer((request, response) => {
      seen.push(request.url)
      assert.equal(request.method, 'GET')
      if (request.url === '/api/health/live') {
        assert.equal(request.headers['x-vercel-protection-bypass'], 'local-protection-value')
        response.writeHead(200, { 'Content-Type': 'application/json' })
        return response.end('{"status":"ok"}')
      }
      if (request.url === PAGE_PATH) {
        assert.equal(request.headers['x-vercel-protection-bypass'], 'local-protection-value')
        response.writeHead(307, { Location: '/auth/signin', 'Set-Cookie': 'local_preflight=preserved; Path=/; HttpOnly; SameSite=Lax' })
        return response.end()
      }
      assert.equal(request.url, '/auth/signin')
      assert.ok(request.headers.cookie?.includes('local_preflight=preserved'))
      response.writeHead(200, { 'Content-Type': 'text/html' })
      response.end('<!doctype html><title>Local signin</title><h1>Original anonymous signin</h1>')
    })
    const proxy = createServer((request, response) => {
      proxyRequests++
      const url = new URL(request.url)
      if (url.origin !== 'http://dtc-preview.invalid') return response.writeHead(403).end()
      const upstream = httpRequest({ hostname: '127.0.0.1', port: health.address().port, path: url.pathname + url.search, method: request.method, headers: request.headers }, (received) => {
        response.writeHead(received.statusCode, received.headers)
        received.pipe(response)
      })
      upstream.on('error', () => response.destroy())
      request.pipe(upstream)
    })
    try {
      await listen(health)
      proxy.on('connect', (request, socket, head) => {
        proxyRequests++
        assert.equal(request.url, 'dtc-preview.invalid:80')
        const upstream = connectSocket({ host: '127.0.0.1', port: health.address().port })
        sockets.add(socket); sockets.add(upstream)
        for (const stream of [socket, upstream]) stream.on('close', () => sockets.delete(stream))
        upstream.on('connect', () => {
          socket.write('HTTP/1.1 200 Connection Established\r\n\r\n')
          if (head.length) upstream.write(head)
          socket.pipe(upstream); upstream.pipe(socket)
        })
        upstream.on('error', () => socket.destroy())
        socket.on('error', () => upstream.destroy())
      })
      const proxyOrigin = await listen(proxy)
      for (const key of ['HTTPS_PROXY', 'https_proxy', 'HTTP_PROXY', 'http_proxy']) process.env[key] = proxyOrigin
      delete process.env.ALL_PROXY; delete process.env.all_proxy
      process.env.NODE_USE_ENV_PROXY = 'true'
      const facts = await browserPreflight(undefined, { target: { origin: 'http://dtc-preview.invalid' },
        vercelProtectionBypass: 'local-protection-value', onHttpDiagnostic: (diagnostic) => diagnostics.push(diagnostic),
      })
      assert.equal(facts.previewHealthVerified, true)
      assert.equal(facts.managedProxyConfigured, true)
      assert.equal(facts.anonymousPrivateRedirectVerified, true)
      assert.equal(facts.nativeRedirectGuardVerified, true)
      assert.ok(proxyRequests >= 3)
      assert.deepEqual(seen, ['/api/health/live', PAGE_PATH, '/auth/signin'])
      assert.equal(diagnostics.length, 3)
      assert.equal(diagnostics[0].status, 200)
      assert.deepEqual(diagnostics[0].responseKeys, ['status'])
      assert.equal(diagnostics[1].status, 307)
      assert.equal(diagnostics[2].status, 200)
    } finally {
      for (const key of environmentKeys) {
        if (originalEnvironment[key] === undefined) delete process.env[key]
        else process.env[key] = originalEnvironment[key]
      }
      for (const socket of sockets) socket.destroy()
      await closeServer(proxy)
      await closeServer(health)
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
  await test('native-guard-blocks-second-hop-origin-escape-and-post-path-change', async () => {
    const root = process.env.DTC_OUTCOMES_UI_TOOLS_ROOT
    const load = createRequire(join(root ? resolve(root) : repository, 'package.json'))
    const { chromium } = load('playwright')
    const module = load('@sparticuz/chromium')
    const binary = module.default ?? module
    let externalRequests = 0
    let externalCredentials = 0
    let forbiddenWrites = 0
    const seen = []
    const receiver = createServer((request, response) => {
      externalRequests++
      if (request.headers['x-vercel-protection-bypass'] || request.headers.authorization || request.headers.apikey || request.headers.cookie) externalCredentials++
      response.end('unexpected external destination')
    })
    let sender
    let browser
    let guard
    const requests = requestTracker()
    try {
      const externalOrigin = await listen(receiver)
      sender = createServer((request, response) => {
        seen.push({ path: request.url, method: request.method })
        if (request.url === '/start') return response.writeHead(307, { Location: '/hop', 'Set-Cookie': 'native_cookie=preserved; Path=/; HttpOnly; SameSite=Lax' }).end()
        if (request.url === '/hop') return response.writeHead(307, { Location: '/ok' }).end()
        if (request.url === '/away') return response.writeHead(307, { Location: '/away-hop' }).end()
        if (request.url === '/away-hop') return response.writeHead(307, { Location: externalOrigin + '/sink' }).end()
        if (request.url === API_PATH && request.method === 'POST') return response.writeHead(307, { Location: '/forbidden-write' }).end()
        if (request.url === '/forbidden-write') forbiddenWrites++
        if (request.url === '/api/auth/signout' && request.method === 'POST') return response.writeHead(303, { Location: '/auth/signin', 'Set-Cookie': 'native_cookie=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax' }).end()
        response.writeHead(200, { 'Content-Type': 'text/html' })
        response.end('<!doctype html><title>Native guarded response</title><h1>Unmodified native body</h1>')
      })
      const origin = await listen(sender)
      // Both origins are independently allowed: a redirect still may not cross between them.
      const policy = { targetOrigin: origin, supabaseOrigin: externalOrigin }
      assert.equal(browserRequestDecision({ url: origin + API_PATH, method: 'PUT', ...policy }).allowed, false)
      assert.equal(browserRequestDecision({ url: origin + API_PATH, method: 'POST', readOnly: true, ...policy }).allowed, false)
      assert.equal(browserRequestDecision({ url: externalOrigin + '/auth/v1/token', method: 'POST', ...policy }).allowed, true)
      browser = await chromium.launch({ executablePath: await binary.executablePath(), headless: true, args: ['--single-process', '--no-zygote', '--disable-gpu'] })
      const context = await browser.newContext({ serviceWorkers: 'block', extraHTTPHeaders: { authorization: 'Bearer local-only-canary', apikey: 'local-only-canary' } })
      const page = await context.newPage()
      guard = await installNativeRequestGuard({ context, page, policy, requests })
      let routeCalls = 0
      let relayFailures = 0
      await context.route('**/*', async (route) => {
        routeCalls++
        assert.equal(new URL(route.request().url()).origin, origin)
        const result = await relayRealRoute(route, { expectedOrigin: origin, requests, headers: {
          ...await route.request().allHeaders(), 'x-vercel-protection-bypass': 'local-only-canary',
        } })
        if (result.transportFailure || result.blockedRedirect) relayFailures++
      })
      const same = await page.goto(origin + '/start')
      assert.equal(same.status(), 200)
      assert.equal(new URL(page.url()).pathname, '/ok')
      assert.equal(await page.locator('h1').innerText(), 'Unmodified native body')
      assert.equal(routeCalls, 1, 'native redirects must be checked even when Playwright omits subsequent route callbacks')
      assert.deepEqual(seen.map((entry) => entry.path), ['/start', '/hop', '/ok'])
      assert.ok((await context.cookies(origin)).some((cookie) => cookie.name === 'native_cookie' && cookie.httpOnly))
      // A real 303 keeps the actual Set-Cookie deletion and changes POST to GET.
      const signedOut = await page.evaluate(async () => (await fetch('/api/auth/signout', { method: 'POST' })).status)
      assert.equal(signedOut, 200)
      assert.ok(seen.some((entry) => entry.path === '/auth/signin' && entry.method === 'GET'))
      assert.equal((await context.cookies(origin)).some((cookie) => cookie.name === 'native_cookie'), false)
      // A real 307 may retain POST, but only for a separately authorized destination path.
      await assert.rejects(page.evaluate(() => fetch('/api/outcomes/chile', { method: 'POST', body: 'local-only' })))
      assert.equal(forbiddenWrites, 0)
      assert.equal(guard.state.blockedMutations, 1)
      await assert.rejects(page.goto(origin + '/away'))
      await requests.drain()
      assert.equal(externalRequests, 0)
      assert.equal(externalCredentials, 0)
      assert.equal(guard.state.blockedRedirects, 1)
      assert.ok(guard.state.redirectsChecked >= 6)
      assert.equal(guard.state.failures, 0)
      assert.equal(relayFailures, 0)
      assert.equal(requests.size, 0)
    } finally {
      guard?.stop()
      await requests.drain()
      if (browser) await browser.close()
      if (sender) await closeServer(sender)
      await closeServer(receiver)
    }
  })
  await test('ephemeral-nss-trust-validates-native-tls-and-rejects-foreign-ca-and-wrong-san', async () => {
    const root = process.env.DTC_OUTCOMES_UI_TOOLS_ROOT
    const load = createRequire(join(root ? resolve(root) : repository, 'package.json'))
    const { chromium } = load('playwright')
    const module = load('@sparticuz/chromium')
    const binary = module.default ?? module
    const priorUmask = process.umask(0o077)
    const fixtureRoot = mkdtempSync(join(scratch, 'tls-fixture-'))
    const sockets = new Set()
    const servers = []
    let trust
    const initialHome = process.env.HOME
    const initialXdg = process.env.XDG_DATA_HOME
    const globalStores = [join(homedir(), '.pki', 'nssdb'), join(homedir(), '.local', 'share', 'pki', 'nssdb')]
    if (initialXdg) globalStores.push(join(initialXdg, 'pki', 'nssdb'))
    const storeMetadata = () => globalStores.map((path) => ['', 'cert9.db', 'key4.db', 'pkcs11.txt'].map((name) => {
      const entry = name ? join(path, name) : path
      if (!existsSync(entry)) return { exists: false }
      const info = lstatSync(entry)
      return { exists: true, inode: info.ino, size: info.size, modified: info.mtimeMs, mode: info.mode }
    }))
    const originalMetadata = storeMetadata()
    const openssl = (args) => execFileSync('openssl', args, { stdio: ['ignore', 'pipe', 'pipe'] })
    const makeCa = (name) => {
      const certificate = join(fixtureRoot, name + '.crt')
      const key = join(fixtureRoot, name + '.key')
      openssl(['req', '-x509', '-newkey', 'ec', '-pkeyopt', 'ec_paramgen_curve:P-256', '-nodes', '-days', '2', '-sha256', '-subj', '/CN=' + name,
        '-addext', 'basicConstraints=critical,CA:TRUE', '-addext', 'keyUsage=critical,keyCertSign,cRLSign', '-out', certificate, '-keyout', key])
      return { certificate, key }
    }
    const makeLeaf = (name, hostname, ca) => {
      const certificate = join(fixtureRoot, name + '.crt')
      const key = join(fixtureRoot, name + '.key')
      const csr = join(fixtureRoot, name + '.csr')
      const extensions = join(fixtureRoot, name + '.ext')
      writeFileSync(extensions, 'basicConstraints=critical,CA:FALSE\nkeyUsage=critical,digitalSignature\nextendedKeyUsage=serverAuth\nsubjectAltName=DNS:' + hostname + '\n', { mode: 0o600 })
      openssl(['req', '-new', '-newkey', 'ec', '-pkeyopt', 'ec_paramgen_curve:P-256', '-nodes', '-sha256', '-subj', '/CN=' + hostname, '-out', csr, '-keyout', key])
      openssl(['x509', '-req', '-in', csr, '-CA', ca.certificate, '-CAkey', ca.key, '-CAcreateserial', '-out', certificate, '-days', '1', '-sha256', '-extfile', extensions])
      return { key: readFileSync(key), cert: Buffer.concat([readFileSync(certificate), readFileSync(ca.certificate)]) }
    }
    const trackSockets = (server) => server.on('connection', (socket) => {
      sockets.add(socket)
      socket.on('close', () => sockets.delete(socket))
    })
    const makeServer = async (hostname, leaf) => {
      const paths = []
      const server = createHttpsServer(leaf, (request, response) => {
        paths.push(request.url)
        if (request.url === '/start') return response.writeHead(307, { Location: '/final', 'Set-Cookie': 'tls_fixture=preserved; Secure; HttpOnly; SameSite=Lax; Path=/' }).end()
        response.writeHead(200, { 'Content-Type': 'text/html' }).end('<!doctype html><title>TLS fixture</title>Verified native TLS body')
      })
      server.on('tlsClientError', () => {})
      trackSockets(server)
      servers.push(server)
      await listen(server)
      return { hostname, server, paths }
    }
    const browse = async (fixture, proxy, expectedError) => {
      let browser
      try {
        browser = await chromium.launch({ executablePath: await binary.executablePath(), headless: true,
          args: ['--single-process', '--no-zygote', '--disable-gpu'], proxy: { server: proxy }, env: trust.environment,
        })
        assert.ok(Number(browser.version().split('.')[0]) >= 146)
        const context = await browser.newContext({ serviceWorkers: 'block' })
        const page = await context.newPage()
        let observedError = null
        let response
        try { response = await page.goto('https://' + fixture.hostname + '/start', { waitUntil: 'domcontentloaded', timeout: 10_000 }) }
        catch (error) { observedError = error.message.match(/net::[A-Z_]+/)?.[0] ?? 'UNCLASSIFIED_ERROR' }
        assert.equal(observedError, expectedError)
        if (expectedError) {
          assert.equal(response, undefined)
          assert.equal(fixture.paths.length, 0, 'invalid TLS must fail before any HTTP request')
        } else {
          assert.equal(response.status(), 200)
          assert.ok((await response.text()).includes('Verified native TLS body'))
          assert.ok((await context.cookies()).some((cookie) => cookie.name === 'tls_fixture' && cookie.secure && cookie.httpOnly))
          assert.deepEqual(fixture.paths, ['/start', '/final'])
        }
      } finally { if (browser) await browser.close() }
    }
    try {
      const ca = makeCa('DTC local trusted CA')
      const foreignCa = makeCa('DTC local untrusted CA')
      const good = await makeServer('dtc-good-tls.invalid', makeLeaf('good', 'dtc-good-tls.invalid', ca))
      const foreign = await makeServer('dtc-foreign-tls.invalid', makeLeaf('foreign', 'dtc-foreign-tls.invalid', foreignCa))
      const mismatch = await makeServer('dtc-wrong-san.invalid', makeLeaf('wrong-san', 'dtc-good-tls.invalid', ca))
      const fixtures = [good, foreign, mismatch]
      const proxy = createServer((_request, response) => response.writeHead(403).end())
      servers.push(proxy)
      trackSockets(proxy)
      proxy.on('connect', (request, client, head) => {
        const fixture = fixtures.find((entry) => request.url === entry.hostname + ':443')
        if (!fixture) return client.destroy()
        const upstream = connectSocket({ host: '127.0.0.1', port: fixture.server.address().port }, () => {
          client.write('HTTP/1.1 200 Connection Established\r\n\r\n')
          if (head.length) upstream.write(head)
          client.pipe(upstream); upstream.pipe(client)
        })
        sockets.add(upstream)
        upstream.on('close', () => sockets.delete(upstream))
        upstream.on('error', () => client.destroy())
        client.on('error', () => upstream.destroy())
        client.on('close', () => upstream.destroy())
      })
      const proxyOrigin = await listen(proxy)
      const fingerprint = new X509Certificate(readFileSync(ca.certificate)).fingerprint256.replaceAll(':', '').toLowerCase()
      trust = createNssTrustDirectory({ certificatePath: ca.certificate, fingerprint })
      assert.equal(trust.environment.HOME, initialHome)
      assert.notEqual(trust.environment.XDG_DATA_HOME, initialXdg)
      await browse(good, proxyOrigin, null)
      await browse(foreign, proxyOrigin, 'net::ERR_CERT_AUTHORITY_INVALID')
      await browse(mismatch, proxyOrigin, 'net::ERR_CERT_COMMON_NAME_INVALID')
      const trustDirectory = trust.environment.XDG_DATA_HOME
      trust.remove()
      assert.equal(trust.removed, true)
      assert.equal(existsSync(trustDirectory), false)
      assert.equal(process.env.HOME, initialHome)
      assert.equal(process.env.XDG_DATA_HOME, initialXdg)
      assert.deepEqual(storeMetadata(), originalMetadata)
    } finally {
      if (trust && !trust.removed) trust.remove()
      for (const socket of sockets) socket.destroy()
      await Promise.all(servers.map(closeServer))
      rmSync(fixtureRoot, { recursive: true, force: false })
      process.umask(priorUmask)
    }
  })
  process.stdout.write(JSON.stringify({ verdict: 'GO', cases, remoteNetwork: false, credentialsRequired: false }) + '\n')
} catch (error) {
  process.stdout.write(JSON.stringify({ verdict: 'NO_GO', failedCase: activeCase, code: failureCode(error), cases, remoteNetwork: false }) + '\n')
  process.exitCode = 1
} finally { rmSync(scratch, { recursive: true, force: true }) }
