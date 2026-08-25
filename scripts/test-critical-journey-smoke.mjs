#!/usr/bin/env node

import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { after, before, test } from 'node:test'

import { runCriticalJourneySmoke } from './critical-journey-smoke.mjs'

let server
let baseUrl

before(async () => {
  server = createServer((request, response) => {
    const path = new URL(request.url, 'http://localhost').pathname

    if (path === '/' || path === '/auth/signin') {
      response.writeHead(200, { 'content-type': 'text/html' })
      response.end('<html lang="es"><body>Despega Tu Carrera</body></html>')
      return
    }

    if (path.startsWith('/despega')) {
      response.writeHead(307, {
        location: `/auth/signin?callbackUrl=${encodeURIComponent(path)}`,
      })
      response.end()
      return
    }

    response.writeHead(404)
    response.end('Not found')
  })

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  baseUrl = `http://127.0.0.1:${address.port}`
})

after(async () => {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  )
})

test('accepts public entry routes and unauthenticated redirects for the critical journey', async () => {
  const report = await runCriticalJourneySmoke({ baseUrl, timeoutMs: 1_000 })

  assert.equal(report.ok, true)
  assert.equal(report.failed, 0)
  assert.deepEqual(
    report.checks.map(({ id, ok }) => [id, ok]),
    [
      ['public-home', true],
      ['public-signin', true],
      ['protected-dashboard', true],
      ['protected-a1', true],
      ['protected-a2', true],
      ['protected-a3', true],
      ['not-found', true],
    ],
  )
})

test('reports an actionable failure when a protected route becomes publicly accessible', async () => {
  const unsafeServer = createServer((request, response) => {
    if (request.url === '/despega/a3') {
      response.writeHead(200)
      response.end('unsafe')
      return
    }

    response.writeHead(404)
    response.end('Not found')
  })

  await new Promise((resolve) => unsafeServer.listen(0, '127.0.0.1', resolve))
  const address = unsafeServer.address()

  try {
    const report = await runCriticalJourneySmoke({
      baseUrl: `http://127.0.0.1:${address.port}`,
      timeoutMs: 1_000,
    })
    const a3 = report.checks.find(({ id }) => id === 'protected-a3')

    assert.equal(report.ok, false)
    assert.equal(a3.ok, false)
    assert.match(a3.message, /expected authentication redirect/i)
  } finally {
    await new Promise((resolve, reject) =>
      unsafeServer.close((error) => (error ? reject(error) : resolve())),
    )
  }
})

test('normalizes a base URL with a trailing slash', async () => {
  const report = await runCriticalJourneySmoke({ baseUrl: `${baseUrl}/`, timeoutMs: 1_000 })

  assert.equal(report.baseUrl, baseUrl)
  assert.equal(report.ok, true)
})
