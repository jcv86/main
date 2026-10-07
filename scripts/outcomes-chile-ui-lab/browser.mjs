import assert from 'node:assert/strict'
import { labOrigin, labUrl, loadTool } from './build.mjs'
import { FIXTURE_NOW, fixtureId, scenarioEvidence, summaryFrom } from './fixtures.ts'

const PRIVATE_HEADERS = { 'Cache-Control': 'private, no-store', 'Content-Type': 'application/json' }
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** A synthetic transport/model, not a substitute for the SQL or authenticated API tests. */
export function syntheticBackend(name = 'populated', options = {}) {
  const evidence = scenarioEvidence(name)
  const requests = []
  const reads = []
  const accepted = new Map()
  const readSteps = [...(options.readSteps ?? [])]
  const writeSteps = [...(options.writeSteps ?? [])]
  let nextId = 1000
  let abortedResponses = 0

  const record = () => ({ id: fixtureId(nextId++), verification_status: 'self_reported', created_at: FIXTURE_NOW })
  const persist = (payload) => {
    const base = record()
    switch (payload.action) {
      case 'salary_outcome':
        evidence.salary = [...evidence.salary, {
          ...base, measurement_role: payload.measurementRole, monthly_net_clp: payload.monthlyNetClp,
          measured_at: payload.measuredAt, employment_outcome_id: payload.employmentOutcomeId ?? null,
        }]
        break
      case 'job_search_event':
        evidence.events = [...evidence.events, {
          ...base, event_type: payload.eventType, occurred_at: payload.occurredAt,
          target_role: payload.targetRole ?? null, source_channel: payload.sourceChannel ?? null,
        }]
        break
      case 'employment_outcome':
        evidence.employment = [...evidence.employment, {
          ...base, outcome_type: payload.outcomeType, effective_date: payload.effectiveDate,
          role_title: payload.roleTitle, region_code: payload.regionCode ?? null,
          occupation_code: payload.occupationCode ?? null, employment_category: payload.employmentCategory ?? null,
        }]
        evidence.followups = [...evidence.followups, ...[30, 90, 180].map((day) => ({
          ...record(), employment_outcome_id: base.id, followup_day: day,
          due_at: new Date(Date.parse(payload.effectiveDate + 'T00:00:00Z') + day * 86400000).toISOString().slice(0, 10),
          completed_at: null, employment_active: null, same_role: null,
        }))]
        break
      case 'complete_followup': {
        const row = evidence.followups.find((candidate) => candidate.id === payload.followupId)
        assert.ok(row, 'UI attempted to complete an unknown synthetic followup')
        evidence.followups = evidence.followups.map((candidate) => candidate.id === row.id ? {
          ...candidate, completed_at: FIXTURE_NOW, employment_active: payload.employmentActive, same_role: payload.sameRole,
        } : candidate)
        return { data: { id: row.id, verification_status: 'self_reported' } }
      }
      default: throw new Error(`Unsupported UI action: ${payload.action}`)
    }
    return { data: { id: base.id, verification_status: 'self_reported' } }
  }

  return {
    evidence, requests, reads, accepted,
    summary: () => summaryFrom(evidence, options.benchmark),
    get abortedResponses() { return abortedResponses },
    async handle(route) {
      const request = route.request()
      if (request.method() === 'GET') {
        reads.push(request.url())
        const step = readSteps.shift() ?? {}
        if (step.delayMs) await delay(step.delayMs)
        return route.fulfill({ status: step.status ?? 200, headers: PRIVATE_HEADERS, body: JSON.stringify(step.body ?? summaryFrom(evidence, options.benchmark)) })
      }
      assert.equal(request.method(), 'POST', 'only the contracted read/capture endpoint should be called')
      const body = request.postDataJSON()
      requests.push(body)
      assert.match(body.requestId, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
      assert.ok(!Object.hasOwn(body, 'userId') && !Object.hasOwn(body, 'user_id'), 'UI must never send an owner override')
      assert.ok(!Object.hasOwn(body, 'verification_status'), 'UI must never promote evidence')
      const step = writeSteps.shift() ?? {}
      if (step.delayMs) await delay(step.delayMs)
      if (step.status && step.status >= 400) {
        return route.fulfill({ status: step.status, headers: PRIVATE_HEADERS, body: JSON.stringify(step.body ?? { error: 'Synthetic service unavailable' }) })
      }
      const { requestId, ...payload } = body
      const fingerprint = JSON.stringify(Object.fromEntries(Object.entries(payload).sort(([a], [b]) => a.localeCompare(b))))
      const previous = accepted.get(requestId)
      assert.ok(!previous || previous.fingerprint === fingerprint, 'a retry key was reused with a different payload')
      const response = previous?.response ?? persist(payload)
      if (!previous) accepted.set(requestId, { fingerprint, response })
      if (step.commitThenAbort) {
        abortedResponses++
        return route.abort('failed')
      }
      return route.fulfill({ status: payload.action === 'complete_followup' ? 200 : 201, headers: PRIVATE_HEADERS, body: JSON.stringify(response) })
    },
  }
}

export async function launchBrowser() {
  const { chromium } = loadTool('playwright')
  let executablePath = process.env.DTC_OUTCOMES_UI_BROWSER_EXECUTABLE
  if (!executablePath && process.env.DTC_OUTCOMES_UI_TOOLS_ROOT) {
    const distribution = loadTool('@sparticuz/chromium')
    executablePath = await (distribution.default ?? distribution).executablePath()
  }
  return chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath, args: ['--single-process', '--no-zygote', '--disable-gpu'] } : {}),
  })
}

export async function openExperience(browser, assets, backend, viewport = { width: 390, height: 844 }) {
  const context = await browser.newContext({ viewport, locale: 'es-CL', timezoneId: 'America/Santiago', reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.clock.setFixedTime(new Date(FIXTURE_NOW))
  const errors = []
  const blocked = []
  const transportErrors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') transportErrors.push(message.text())
  })
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (url.origin !== labOrigin) {
      blocked.push(url.href)
      return route.abort('blockedbyclient')
    }
    if (url.pathname === '/api/outcomes/chile') return backend.handle(route)
    if (url.pathname === '/lab.js') return route.fulfill({ contentType: 'text/javascript', body: assets.javascript })
    if (url.pathname === '/lab.css') return route.fulfill({ contentType: 'text/css', body: assets.css })
    if (assets.fontFiles.has(url.pathname)) return route.fulfill({ contentType: 'font/woff2', body: assets.fontFiles.get(url.pathname) })
    if (url.pathname === '/favicon.ico') return route.fulfill({ status: 204 })
    if (url.pathname === '/despega/resultados-laborales') return route.fulfill({ contentType: 'text/html', body: assets.html })
    return route.fulfill({ status: 404, contentType: 'text/plain', body: 'Laboratory navigation boundary' })
  })
  await page.goto(labUrl, { waitUntil: 'domcontentloaded' })
  return { page, context, errors, blocked, transportErrors }
}

export async function assertNoOverflow(page) {
  const dimensions = await page.evaluate(() => ({ viewport: window.innerWidth, content: document.documentElement.scrollWidth }))
  assert.ok(dimensions.content <= dimensions.viewport + 1, `horizontal overflow: ${JSON.stringify(dimensions)}`)
  return dimensions
}

export async function auditAccessibility(page) {
  const axe = loadTool('axe-core')
  await page.addScriptTag({ content: axe.source })
  const report = await page.evaluate(async () => window.axe.run(document.querySelector('main'), {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
  }))
  return {
    version: axe.version,
    violations: report.violations.map(({ id, impact, description, nodes }) => ({
      id, impact, description, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
    })),
  }
}
