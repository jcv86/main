#!/usr/bin/env node

import { pathToFileURL } from 'node:url'

const DEFAULT_TIMEOUT_MS = 10_000

const CHECKS = [
  { id: 'public-home', kind: 'status', path: '/', expectedStatus: 200 },
  { id: 'public-signin', kind: 'status', path: '/auth/signin', expectedStatus: 200 },
  { id: 'protected-dashboard', kind: 'auth', path: '/despega/dashboard' },
  { id: 'protected-a1', kind: 'auth', path: '/despega/a1-cerebral' },
  { id: 'protected-a2', kind: 'auth', path: '/despega/a2' },
  { id: 'protected-a3', kind: 'auth', path: '/despega/a3' },
  { id: 'not-found', kind: 'status', path: '/__dtc-smoke-not-found', expectedStatus: 404 },
]

function normalizeBaseUrl(baseUrl) {
  const normalized = String(baseUrl ?? '').trim().replace(/\/+$/, '')
  if (!normalized) throw new Error('BASE_URL is required')

  const url = new URL(normalized)
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('BASE_URL must use http or https')
  }

  return url.toString().replace(/\/$/, '')
}

async function executeCheck({ baseUrl, check, timeoutMs }) {
  const url = new URL(check.path, `${baseUrl}/`)

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
      headers: { 'user-agent': 'dtc-critical-journey-smoke/1.0' },
    })

    if (check.kind === 'auth') {
      const location = response.headers.get('location')
      const isRedirect = response.status >= 300 && response.status < 400
      const redirectsToAuth = location
        ? new URL(location, url).pathname.startsWith('/auth/') ||
          new URL(location, url).pathname === '/signin'
        : false
      const ok = isRedirect && redirectsToAuth

      return {
        id: check.id,
        path: check.path,
        ok,
        status: response.status,
        location,
        message: ok
          ? 'Authentication boundary enforced'
          : `Expected authentication redirect, received ${response.status}${location ? ` to ${location}` : ''}`,
      }
    }

    const ok = response.status === check.expectedStatus
    return {
      id: check.id,
      path: check.path,
      ok,
      status: response.status,
      message: ok
        ? `Received ${check.expectedStatus}`
        : `Expected ${check.expectedStatus}, received ${response.status}`,
    }
  } catch (error) {
    return {
      id: check.id,
      path: check.path,
      ok: false,
      status: null,
      message: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function runCriticalJourneySmoke({
  baseUrl,
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)
  const checks = await Promise.all(
    CHECKS.map((check) => executeCheck({ baseUrl: normalizedBaseUrl, check, timeoutMs })),
  )
  const failed = checks.filter(({ ok }) => !ok).length

  return {
    baseUrl: normalizedBaseUrl,
    ok: failed === 0,
    passed: checks.length - failed,
    failed,
    checks,
  }
}

async function main() {
  const report = await runCriticalJourneySmoke({
    baseUrl: process.env.BASE_URL,
    timeoutMs: Number(process.env.SMOKE_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
  })

  console.log(JSON.stringify(report, null, 2))
  if (!report.ok) process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
