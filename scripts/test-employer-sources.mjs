import assert from 'node:assert/strict'
import test from 'node:test'
import {
  EMPLOYER_BOARDS, employerBoardKey, fetchEmployerBatch, isEmployerJobUrl,
  normalizeEmployerJob, planEmployerBoards,
} from '../lib/opportunities/sources/employers.ts'
import { createEmployerRequestContext, fetchEmployerJson } from '../lib/opportunities/sources/employer-request.ts'

// Synthetic descriptions; field shapes and edge cases were observed in the public
// Lever/Greenhouse APIs on 2026-10-07. Tests perform no real network or DB writes.
const verifiedAt = '2026-10-07T20:00:00.000Z'
const NOW = Date.parse(verifiedAt)
const FUTURE = new Date(NOW + 3_600_000).toISOString()
const now = () => NOW
const board = key => EMPLOYER_BOARDS.find(entry => employerBoardKey(entry) === key)
const uuid = n => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`
const lever = (n = 1, changes = {}, token = 'fintual') => ({
  id: uuid(n), text: 'Analista de operaciones de prueba', country: 'CL', workplaceType: 'hybrid',
  categories: { location: 'Santiago, Chile', allLocations: ['Santiago, Chile'], team: 'Operaciones' },
  descriptionPlain: 'Analizar procesos, construir reportes y proponer mejoras con evidencia verificable.',
  lists: [], additionalPlain: '', createdAt: NOW - 400 * 86400_000,
  hostedUrl: `https://jobs.lever.co/${token}/${uuid(n)}`,
  applyUrl: `https://jobs.lever.co/${token}/${uuid(n)}/apply`,
  ...changes,
})
const greenhouse = (n = 1, changes = {}, token = 'cabify') => ({
  id: n, internal_job_id: n + 1000, title: 'Analista de operaciones de prueba',
  location: { name: 'Santiago de Chile' }, offices: [], metadata: null,
  content: '&lt;p&gt;Revisar procesos y datos. Modelo híbrido de trabajo.&lt;/p&gt;',
  first_published: '2026-10-06T12:00:00-03:00', updated_at: '2026-10-07T09:00:00-03:00',
  application_deadline: null,
  absolute_url: `https://job-boards.greenhouse.io/${token}/jobs/${n}`,
  ...changes,
})
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', ...headers },
})
const robots = (text = 'User-agent: *\nDisallow: /embed/\n') => new Response(text, { headers: { 'Content-Type': 'text/plain' } })
const ghPayload = jobs => ({ jobs, meta: { total: jobs.length } })
const onlyGreenhouse = { now, cooldowns: { 'lever:fintual': FUTURE } }
const onlyLever = { now, cooldowns: { 'greenhouse:cabify': FUTURE } }
const gh = batch => batch.boards.find(entry => entry.source === 'greenhouse')
const lv = batch => batch.boards.find(entry => entry.source === 'lever')
const fakeGH = payload => async url => url.endsWith('/robots.txt') ? robots() : json(payload)

test('six pinned boards rotate without omissions every three slots', () => {
  assert.equal(EMPLOYER_BOARDS.length, 6)
  assert.deepEqual([0, 1, 2].flatMap(slot => planEmployerBoards(slot).map(employerBoardKey)), EMPLOYER_BOARDS.map(employerBoardKey))
  assert.deepEqual(planEmployerBoards(3), planEmployerBoards(0))
  assert.equal(board('greenhouse:chile').company, 'Checkr')
  for (const invalid of [-1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => planEmployerBoards(invalid))
})

test('job URLs bind the exact registered board, provider, path and numeric/UUID identity', () => {
  assert.equal(isEmployerJobUrl('lever', `fintual:${uuid(1)}`, lever().hostedUrl), true)
  assert.equal(isEmployerJobUrl('greenhouse', 'cabify:1', greenhouse().absolute_url + '/'), true)
  assert.equal(isEmployerJobUrl('greenhouse', 'cabify:1', 'https://boards.greenhouse.io/cabify/jobs/1'), true)
  for (const bad of [
    'https://evil.example/cabify/jobs/1', 'https://job-boards.greenhouse.io.evil.example/cabify/jobs/1',
    'https://user:secret@job-boards.greenhouse.io/cabify/jobs/1', 'https://job-boards.greenhouse.io:443/cabify/jobs/1',
    'https://job-boards.greenhouse.io/cabify/jobs/1?tracking=1', 'https://job-boards.greenhouse.io/cabify/jobs/1#apply',
    'https://job-boards.greenhouse.io/cabify/jobs/%31', 'https://job-boards.greenhouse.io/cabify/jobs/2',
    'https://job-boards.greenhouse.io/chile/jobs/1', ' https://job-boards.greenhouse.io/cabify/jobs/1',
  ]) assert.equal(isEmployerJobUrl('greenhouse', 'cabify:1', bad), false, bad)
  assert.equal(isEmployerJobUrl('greenhouse', 'unregistered:1', 'https://job-boards.greenhouse.io/unregistered/jobs/1'), false)
  assert.equal(isEmployerJobUrl('greenhouse', 'cabify:9007199254740992', 'https://job-boards.greenhouse.io/cabify/jobs/9007199254740992'), false)
  assert.equal(isEmployerJobUrl('greenhouse', 'cabify:01', 'https://job-boards.greenhouse.io/cabify/jobs/01'), false)
})

test('multi-location Lever jobs keep Chile eligibility even with a foreign primary country', () => {
  const sample = lever(1, { country: 'CO', workplaceType: 'remote', categories: {
    location: 'Bogotá', allLocations: ['Bogotá', 'Argentina', 'Chile', 'Peru'],
  } }, 'coderio')
  const result = normalizeEmployerJob(board('lever:coderio'), sample, verifiedAt)
  assert.equal(result.kind, 'accepted')
  assert.equal(result.job.location, 'Bogotá · Argentina · Chile · Peru')
  assert.equal(result.job.workMode, 'remote')
  assert.equal(result.job.remote, true)
  assert.equal(result.job.raw.country, 'CO')
})

test('remote, LATAM and mentions of company offices cannot invent Chile eligibility', () => {
  for (const location of ['Remote', 'Latin America', 'United States', 'Santiago de Compostela, Spain', 'Santiago, Dominican Republic']) {
    const sample = lever(1, { country: null, workplaceType: 'remote', categories: { location, allLocations: [location] },
      descriptionPlain: 'The company has offices in Chile. This role is remote within its listed country.' })
    assert.equal(normalizeEmployerJob(board('lever:fintual'), sample, verifiedAt).kind, 'excluded', location)
  }
})

test('explicit Chile exclusions stay excluded even when country is CL or another field lists Chile', () => {
  for (const location of ['Remote - Latin America (not available in Chile)', 'Remote LATAM, excluding applicants from Chile', 'Remoto, no disponible para residentes en Chile']) {
    const sample = lever(1, { categories: { location, allLocations: [location, 'Chile'] } })
    assert.equal(normalizeEmployerJob(board('lever:fintual'), sample, verifiedAt).kind, 'excluded', location)
  }
})

test('malformed geography is rejected even when a second field names Chile', () => {
  const sample = lever(1, { categories: { location: 'Chile', allLocations: ['Chile', { id: 42 }] } })
  assert.equal(normalizeEmployerJob(board('lever:fintual'), sample, verifiedAt).kind, 'rejected')
  assert.equal(normalizeEmployerJob(board('greenhouse:cabify'), greenhouse(1, { location: [], offices: [{ name: 'Chile' }] }), verifiedAt).kind, 'rejected')
})

test('Checkr pay-disclosure remote wording does not override an explicit hybrid work requirement', () => {
  const result = normalizeEmployerJob(board('greenhouse:chile'), greenhouse(8226456, {
    content: '<p>If this role is remote, the range depends on the location.</p><p>We believe a hybrid work environment strengthens collaboration. Individuals are expected to work from the office 3+ days a week.</p>',
  }, 'chile'), verifiedAt)
  assert.equal(result.kind, 'accepted')
  assert.equal(result.job.workMode, 'hybrid')
  const conditional = normalizeEmployerJob(board('greenhouse:cabify'), greenhouse(1, { content: '<p>If this role is remote, salary depends on location.</p>' }), verifiedAt)
  assert.equal(conditional.job.workMode, null)
  assert.equal(conditional.job.remote, null)
})

test('negated and historical work modes are ignored; contradictory current modes stay unknown', () => {
  const samples = [
    [greenhouse(1, { location: { name: 'Presencial - Santiago, Chile' }, content: 'No ofrecemos modalidad híbrida. Modalidad presencial.' }), 'onsite'],
    [greenhouse(1, { content: 'Experience working in a hybrid environment. This position is fully remote.' }), 'remote'],
    [greenhouse(1, { location: { name: 'Remote - Chile' }, content: 'Ofrecemos modalidad híbrida de trabajo.' }), null],
  ]
  for (const [sample, expected] of samples) assert.equal(normalizeEmployerJob(board('greenhouse:cabify'), sample, verifiedAt).job.workMode, expected)
})

test('future pools, prospect posts, expired jobs and scheduled publications are excluded', () => {
  for (const sample of [
    greenhouse(1, { internal_job_id: null }),
    greenhouse(1, { title: 'Senior Product Manager (Future Opportunities)' }),
    greenhouse(1, { title: 'Únete a nuestro banco de talentos' }),
    greenhouse(1, { application_deadline: '2026-10-07T19:59:59Z' }),
    greenhouse(1, { first_published: '2026-10-07T20:00:01Z' }),
  ]) assert.equal(normalizeEmployerJob(board('greenhouse:cabify'), sample, verifiedAt).kind, 'excluded')
  const ordinary = greenhouse(1, { content: '<p>Analizar procesos y datos.</p><p>Sign up for future opportunities by email.</p>' })
  assert.equal(normalizeEmployerJob(board('greenhouse:cabify'), ordinary, verifiedAt).kind, 'accepted', 'footer language must not remove a real vacancy')
})

test('invalid expiry or publication dates and missing internal identities are format rejections', () => {
  for (const sample of [
    greenhouse(1, { application_deadline: '2026-02-31T12:00:00Z' }),
    greenhouse(1, { first_published: 'tomorrow' }),
    greenhouse(1, { internal_job_id: undefined }),
    greenhouse(1, { absolute_url: 'https://unrelated.example/job/1' }),
  ]) assert.equal(normalizeEmployerJob(board('greenhouse:cabify'), sample, verifiedAt).kind, 'rejected')
})

test('old Lever creation dates remain source metadata and do not make an active posting expire', () => {
  const result = normalizeEmployerJob(board('lever:fintual'), lever(), verifiedAt)
  assert.equal(result.kind, 'accepted')
  assert.equal(result.job.publishedAt, null)
  assert.equal(result.job.raw.sourceCreatedAt, new Date(NOW - 400 * 86400_000).toISOString())
  assert.equal(result.job.lastVerifiedAt, verifiedAt)
})

test('HTML is decoded safely and only minimal source metadata is retained', () => {
  const input = greenhouse(1, { content: '&lt;p&gt;Contenido visible.&lt;/p&gt;&lt;script&gt;UNSAFE_SENTINEL&lt;/script&gt;',
    salaryRange: { min: 0, max: 1, currency: 'USD' }, unknownPrivatePayload: { sentinel: 'PRIVATE_SENTINEL' } })
  const result = normalizeEmployerJob(board('greenhouse:cabify'), input, verifiedAt)
  assert.equal(result.kind, 'accepted')
  assert.equal(result.job.description, 'Contenido visible.')
  assert.ok(!JSON.stringify(result.job).includes('UNSAFE_SENTINEL'))
  assert.ok(!JSON.stringify(result.job).includes('PRIVATE_SENTINEL'))
  assert.equal('salaryRange' in result.job, false)
  assert.ok(JSON.stringify(result.job.raw).length < 1000)
})

test('Lever visible combined descriptions take precedence over empty plaintext and separate duplicates', () => {
  const input = lever(1, {
    descriptionPlain: ' \n\t ', description: '<p>Apertura y cuerpo combinados verificables.</p>',
    openingPlain: 'SEPARATE_OPENING_SENTINEL', descriptionBodyPlain: 'SEPARATE_BODY_SENTINEL',
  })
  const result = normalizeEmployerJob(board('lever:fintual'), input, verifiedAt)
  assert.equal(result.kind, 'accepted')
  assert.equal(result.job.description, 'Apertura y cuerpo combinados verificables.')
})

test('Lever falls back to documented opening/body/closing fields only when combined text is empty', () => {
  const input = lever(1, {
    descriptionPlain: '', description: '<div> </div>',
    openingPlain: 'Introducción del empleador.',
    descriptionBodyPlain: '\n', descriptionBody: '<p>Construir sistemas y revisar resultados.</p><script>UNSAFE_SENTINEL</script>',
    additionalPlain: ' ', additional: '<p>Condiciones de la convocatoria.</p>',
  })
  const result = normalizeEmployerJob(board('lever:fintual'), input, verifiedAt)
  assert.equal(result.kind, 'accepted')
  assert.equal(result.job.description, 'Introducción del empleador.\n\nConstruir sistemas y revisar resultados.\n\nInformación adicional:\nCondiciones de la convocatoria.')
})

test('genuinely empty Lever descriptions are still rejected and undocumented closing fields are ignored', () => {
  const input = lever(1, {
    descriptionPlain: ' ', description: '<p></p>', openingPlain: '', opening: '<div> </div>',
    descriptionBodyPlain: null, descriptionBody: '<script>UNSAFE_SENTINEL</script>',
    additionalPlain: '', additional: '', closing: 'UNDOCUMENTED_CLOSING_SENTINEL',
  })
  assert.deepEqual(normalizeEmployerJob(board('lever:fintual'), input, verifiedAt), { kind: 'rejected', reason: 'missing_description' })
})

test('empty valid snapshots are healthy and malformed or wholly rejected snapshots are not', async () => {
  const empty = await fetchEmployerBatch(0, { ...onlyGreenhouse, fetchImpl: fakeGH(ghPayload([])) })
  assert.equal(gh(empty).outcome, 'no_matches')
  assert.equal(gh(empty).completeSnapshot, true)
  assert.deepEqual(gh(empty).observedSourceIds, [])
  for (const payload of [{}, { jobs: null }, { jobs: [greenhouse(1, { title: '' })], meta: { total: 1 } }]) {
    const invalid = await fetchEmployerBatch(0, { ...onlyGreenhouse, fetchImpl: fakeGH(payload) })
    assert.equal(gh(invalid).outcome, 'parse_failed')
    assert.equal(gh(invalid).completeSnapshot, false)
  }
})

test('observed snapshot IDs contain only validated active eligible jobs', async () => {
  const payload = ghPayload([
    greenhouse(1), greenhouse(2, { location: { name: 'Madrid' } }),
    greenhouse(3, { internal_job_id: null }), greenhouse(4, { title: 'Talent Pool' }),
    greenhouse(5, { application_deadline: '2026-01-01T00:00:00Z' }),
    greenhouse(6, { first_published: '2026-10-08T00:00:00Z' }),
  ])
  const result = await fetchEmployerBatch(0, { ...onlyGreenhouse, fetchImpl: fakeGH(payload) })
  assert.equal(gh(result).completeSnapshot, true)
  assert.equal(gh(result).received, 6)
  assert.equal(gh(result).excluded, 5)
  assert.equal(gh(result).accepted, 1)
  assert.deepEqual(gh(result).observedSourceIds, ['cabify:1'])
  assert.deepEqual(result.jobs.map(job => job.sourceId), ['cabify:1'])
})

test('duplicates, count mismatches and individual malformed rows cannot authorize reconciliation', async () => {
  for (const payload of [
    ghPayload([greenhouse(), greenhouse()]),
    { jobs: [greenhouse()], meta: { total: 2 } },
    ghPayload([greenhouse(), greenhouse(2, { content: '' })]),
  ]) {
    const result = await fetchEmployerBatch(0, { ...onlyGreenhouse, fetchImpl: fakeGH(payload) })
    assert.equal(gh(result).outcome, 'partial')
    assert.equal(gh(result).completeSnapshot, false)
    assert.deepEqual(gh(result).observedSourceIds, ['cabify:1'])
    assert.equal(result.jobs.length, 1)
  }
})

test('more than fifty eligible jobs is a partial snapshot with at most fifty returned', async () => {
  const result = await fetchEmployerBatch(0, { ...onlyGreenhouse, fetchImpl: fakeGH(ghPayload(Array.from({ length: 51 }, (_, i) => greenhouse(i + 1)))) })
  assert.equal(gh(result).accepted, 51)
  assert.equal(gh(result).returned, 50)
  assert.equal(gh(result).observedSourceIds.length, 51)
  assert.equal(gh(result).completeSnapshot, false)
  assert.equal(gh(result).failureCode, 'eligible_limit')
})

test('successive visits cover eligible Greenhouse rows beyond the first fifty without extra requests', async () => {
  const payload = ghPayload(Array.from({ length: 75 }, (_, i) => greenhouse(i + 1)))
  let jobsCalls = 0
  const fetchImpl = async url => {
    if (url.endsWith('/robots.txt')) return robots()
    jobsCalls++
    assert.equal(new URL(url).pathname, '/v1/boards/cabify/jobs')
    return json(payload)
  }
  const visits = []
  for (const slot of [0, 3, 6, 3]) {
    const result = await fetchEmployerBatch(slot, { ...onlyGreenhouse, fetchImpl })
    assert.equal(gh(result).received, 75)
    assert.equal(gh(result).accepted, 75)
    assert.equal(gh(result).returned, 50)
    assert.equal(gh(result).completeSnapshot, false)
    assert.equal(gh(result).outcome, 'partial')
    assert.equal(gh(result).failureCode, 'eligible_limit')
    const ids = result.jobs.map(job => job.sourceId)
    assert.equal(new Set(ids).size, 50)
    assert.ok(result.jobs.every(job => job.lastVerifiedAt === verifiedAt))
    visits.push(ids)
  }
  assert.equal(jobsCalls, 4, 'one existing jobs request per visit, with no extra pages')
  assert.equal(new Set([...visits[0], ...visits[1]]).size, 75)
  assert.deepEqual(visits[1], visits[3], 'the same slot and payload select the same window')
  assert.notDeepEqual(visits[0], visits[1])
})

test('Lever rotates within its existing first-page cap and keeps the snapshot partial', async () => {
  const payload = Array.from({ length: 100 }, (_, i) => lever(i + 1))
  const visits = []
  let jobsCalls = 0
  for (const slot of [0, 3]) {
    const result = await fetchEmployerBatch(slot, { ...onlyLever, fetchImpl: async url => {
      if (url.endsWith('/robots.txt')) return robots()
      jobsCalls++
      assert.equal(new URL(url).searchParams.get('skip'), '0')
      return json(payload)
    } })
    assert.equal(lv(result).accepted, 100)
    assert.equal(lv(result).returned, 50)
    assert.equal(lv(result).completeSnapshot, false)
    assert.equal(lv(result).outcome, 'partial')
    visits.push(result.jobs.map(job => job.sourceId))
  }
  assert.equal(jobsCalls, 2)
  assert.equal(new Set(visits.flat()).size, 100)
})

test('a complete small board preserves provider order across visits', async () => {
  const payload = ghPayload([greenhouse(9), greenhouse(2), greenhouse(7)])
  for (const slot of [0, 3, 6]) {
    const result = await fetchEmployerBatch(slot, { ...onlyGreenhouse, fetchImpl: fakeGH(payload) })
    assert.equal(gh(result).completeSnapshot, true)
    assert.deepEqual(result.jobs.map(job => job.sourceId), ['cabify:9', 'cabify:2', 'cabify:7'])
  }
})

test('a later valid duplicate recovers a rejected copy but keeps rejection evidence', async () => {
  const result = await fetchEmployerBatch(0, { ...onlyGreenhouse, fetchImpl: fakeGH(ghPayload([
    greenhouse(1, { content: '' }), greenhouse(1),
  ])) })
  assert.equal(gh(result).received, 2)
  assert.equal(gh(result).accepted, 1)
  assert.equal(gh(result).rejected, 1)
  assert.equal(gh(result).returned, 1)
  assert.equal(gh(result).failureCode, 'missing_description')
  assert.equal(gh(result).completeSnapshot, false)
  assert.equal(gh(result).outcome, 'partial')
  assert.deepEqual(gh(result).observedSourceIds, ['cabify:1'])
  assert.ok(result.jobs[0].description.length > 0)
})

test('duplicate recovery never replaces accepted or explicitly excluded evidence', async () => {
  const accepted = await fetchEmployerBatch(0, { ...onlyGreenhouse, fetchImpl: fakeGH(ghPayload([
    greenhouse(1), greenhouse(1, { title: 'A different copy' }),
  ])) })
  assert.equal(accepted.jobs[0].title, 'Analista de operaciones de prueba')
  assert.equal(gh(accepted).rejected, 1)
  assert.equal(gh(accepted).completeSnapshot, false)
  const excluded = await fetchEmployerBatch(0, { ...onlyGreenhouse, fetchImpl: fakeGH(ghPayload([
    greenhouse(1, { application_deadline: '2026-01-01T00:00:00Z' }), greenhouse(1),
  ])) })
  assert.equal(excluded.jobs.length, 0)
  assert.equal(gh(excluded).excluded, 1)
  assert.equal(gh(excluded).rejected, 1)
  assert.equal(gh(excluded).completeSnapshot, false)
})

test('row budgets prevent oversized snapshots from being treated as complete', async () => {
  const rows = Array.from({ length: 501 }, (_, i) => greenhouse(i + 1, { location: { name: 'Madrid' } }))
  const result = await fetchEmployerBatch(0, { ...onlyGreenhouse, fetchImpl: fakeGH(ghPayload(rows)) })
  assert.equal(gh(result).received, 501)
  assert.equal(gh(result).excluded, 500)
  assert.equal(gh(result).completeSnapshot, false)
  assert.equal(gh(result).failureCode, 'row_limit')
})

test('stored cooldowns return a deferred result without fetching even robots', async () => {
  let calls = 0
  const result = await fetchEmployerBatch(0, { now, cooldowns: { 'lever:fintual': FUTURE, 'greenhouse:cabify': FUTURE }, fetchImpl: async () => { calls++; throw Error('unexpected') } })
  assert.equal(calls, 0)
  for (const entry of result.boards) {
    assert.equal(entry.outcome, 'cooldown')
    assert.equal(entry.retryAfterUntil, FUTURE)
    assert.equal(entry.completeSnapshot, false)
    assert.deepEqual(entry.observedSourceIds, [])
  }
})

test('robots exclusions and access failures stop before the jobs endpoint', async () => {
  for (const robotResponse of [
    () => robots('User-agent: *\nDisallow: /v1/boards/\n'),
    () => new Response('Forbidden', { status: 403 }),
    () => new Response('Unauthorized', { status: 401 }),
    () => new Response('<html>captcha</html>', { headers: { 'Content-Type': 'text/html' } }),
    () => robots('Access denied'),
  ]) {
    const paths = []
    const result = await fetchEmployerBatch(0, { ...onlyGreenhouse, fetchImpl: async url => { paths.push(new URL(url).pathname); return robotResponse() } })
    assert.deepEqual(paths, ['/robots.txt'])
    assert.equal(gh(result).completeSnapshot, false)
    assert.equal(result.jobs.length, 0)
  }
})

test('robots matching honors specific user-agent groups, longest paths and wildcard rules', async () => {
  const cases = [
    ['User-agent: *\nDisallow: /\nAllow: /v1/boards/cabify/jobs\n', true],
    ['User-agent: *\nDisallow: /v1/boards/*/jobs\n', false],
    ['User-agent: *\nDisallow: /v1/%62oards/\n', false],
    ['User-agent: *\nAllow: /\nUser-agent: DespegaTuCarrera\nDisallow: /\n', false],
    ['User-agent: AnotherBot\nDisallow: /\n# User-agent: *\n# Disallow: /\n', true],
  ]
  for (const [text, expected] of cases) {
    let jobsCalls = 0
    const result = await fetchEmployerBatch(0, { ...onlyGreenhouse, fetchImpl: async url => {
      if (url.endsWith('/robots.txt')) return robots(text)
      jobsCalls++; return json(ghPayload([greenhouse()]))
    } })
    assert.equal(jobsCalls, expected ? 1 : 0, text)
    assert.equal(gh(result).completeSnapshot, expected, text)
  }
})

test('successful robots policy is cached briefly, then checked again', async () => {
  let clock = NOW
  let robotCalls = 0
  const fetchImpl = async url => {
    if (url.endsWith('/robots.txt')) { robotCalls++; return robots() }
    return json(ghPayload([]))
  }
  const options = { ...onlyGreenhouse, now: () => clock, fetchImpl }
  await fetchEmployerBatch(0, options)
  await fetchEmployerBatch(0, options)
  assert.equal(robotCalls, 1)
  clock += 6 * 60_000
  await fetchEmployerBatch(0, options)
  assert.equal(robotCalls, 2)
})

test('429 and 503 Retry-After preserve server cooldowns with no automatic retry', async () => {
  for (const [status, header, duration] of [[429, '600', 600_000], [503, new Date(NOW + 900_000).toUTCString(), 900_000], [429, null, 3 * 3600_000]]) {
    let jobsCalls = 0
    const result = await fetchEmployerBatch(0, { ...onlyGreenhouse, fetchImpl: async url => {
      if (url.endsWith('/robots.txt')) return robots()
      jobsCalls++; return json({}, status, header ? { 'Retry-After': header } : {})
    } })
    assert.equal(jobsCalls, 1)
    assert.equal(gh(result).outcome, 'rate_limited')
    assert.equal(gh(result).retryAfterUntil, new Date(NOW + duration).toISOString())
    assert.equal(gh(result).completeSnapshot, false)
  }
})

test('a rate-limited host prevents a queued second board and also covers robots 429', async () => {
  for (const rateAtRobots of [false, true]) {
    const paths = []
    const ctx = createEmployerRequestContext({ now, fetchImpl: async url => {
      paths.push(new URL(url).pathname)
      if (url.endsWith('/robots.txt') && !rateAtRobots) return robots()
      return json({}, 429, { 'Retry-After': '600' })
    } })
    try {
      const results = await Promise.allSettled([
        fetchEmployerJson(ctx, 'https://boards-api.greenhouse.io/v1/boards/cabify/jobs?content=true'),
        fetchEmployerJson(ctx, 'https://boards-api.greenhouse.io/v1/boards/chile/jobs?content=true'),
      ])
      assert.ok(results.every(result => result.status === 'rejected' && result.reason.retryAfterUntil === new Date(NOW + 600_000).toISOString()))
      assert.equal(paths.length, rateAtRobots ? 1 : 2)
    } finally { ctx.dispose() }
  }
})

test('fetch and body consumption are both bounded even when the mock ignores abort', async () => {
  let cancelled = false
  for (const stage of ['headers', 'body']) {
    const started = performance.now()
    const result = await fetchEmployerBatch(0, { ...onlyGreenhouse, budgetMs: 150, timeoutMs: 35, fetchImpl: async url => {
      if (url.endsWith('/robots.txt')) return robots()
      if (stage === 'headers') return new Promise(() => {})
      return new Response(new ReadableStream({ cancel() { cancelled = true } }), { headers: { 'Content-Type': 'application/json' } })
    } })
    assert.ok(performance.now() - started < 1000)
    assert.equal(gh(result).outcome, 'unavailable')
    assert.equal(gh(result).completeSnapshot, false)
    assert.equal(gh(result).failureCode, 'timeout')
  }
  assert.equal(cancelled, true)
})

test('external cancellation and the shared batch budget stop pending reads', async () => {
  const controller = new AbortController()
  controller.abort()
  let calls = 0
  const cancelled = await fetchEmployerBatch(0, { ...onlyGreenhouse, signal: controller.signal, fetchImpl: async () => { calls++; throw Error('unexpected') } })
  assert.equal(calls, 0)
  assert.equal(gh(cancelled).completeSnapshot, false)
  const result = await fetchEmployerBatch(0, { ...onlyGreenhouse, budgetMs: 30, timeoutMs: 1000, fetchImpl: async () => new Promise(() => {}) })
  assert.equal(gh(result).failureCode, 'budget_exhausted')
})

test('oversized bodies, wrong content types and redirected identities are rejected', async () => {
  const factories = [
    () => json(ghPayload([]), 200, { 'Content-Length': String(2 * 1024 * 1024 + 1) }),
    () => new Response('x'.repeat(2 * 1024 * 1024 + 1), { headers: { 'Content-Type': 'application/json' } }),
    () => new Response('<html>Challenge</html>', { headers: { 'Content-Type': 'text/html' } }),
    () => { const r = json(ghPayload([])); Object.defineProperty(r, 'url', { value: 'https://evil.example/jobs' }); return r },
  ]
  for (const factory of factories) {
    const result = await fetchEmployerBatch(0, { ...onlyGreenhouse, fetchImpl: async url => url.endsWith('/robots.txt') ? robots() : factory() })
    assert.equal(gh(result).outcome, 'parse_failed')
    assert.equal(gh(result).completeSnapshot, false)
  }
})

test('outgoing requests are credential-free, bounded to known hosts and never follow redirects', async () => {
  const calls = []
  const result = await fetchEmployerBatch(0, { ...onlyGreenhouse, fetchImpl: async (url, init) => {
    calls.push(url)
    assert.equal(new URL(url).hostname, 'boards-api.greenhouse.io')
    assert.equal(init.credentials, 'omit')
    assert.equal(init.redirect, 'error')
    assert.equal(init.method, 'GET')
    assert.match(new Headers(init.headers).get('User-Agent'), /^DespegaTuCarrera\//)
    assert.equal(new Headers(init.headers).has('Authorization'), false)
    return url.endsWith('/robots.txt') ? robots() : json(ghPayload([greenhouse()]))
  } })
  assert.equal(result.jobs.length, 1)
  assert.equal(calls.length, 2)
})

test('invalid UTF-8 cancels the open response stream and returns a parse failure', async () => {
  let cancelled = false
  const result = await fetchEmployerBatch(0, { ...onlyGreenhouse, fetchImpl: async url => {
    if (url.endsWith('/robots.txt')) return robots()
    return new Response(new ReadableStream({
      start(controller) { controller.enqueue(new Uint8Array([0xff])) },
      cancel() { cancelled = true },
    }), { headers: { 'Content-Type': 'application/json' } })
  } })
  assert.equal(gh(result).outcome, 'parse_failed')
  assert.equal(gh(result).failureCode, 'invalid_utf8')
  assert.equal(cancelled, true)
})

test('a crawl-delay longer than the budget never overflows into an immediate request', async () => {
  let calls = 0
  const result = await fetchEmployerBatch(0, { ...onlyGreenhouse, fetchImpl: async url => {
    calls++
    return url.endsWith('/robots.txt') ? robots('User-agent: *\nCrawl-delay: 2147483648\n') : json(ghPayload([]))
  } })
  assert.equal(calls, 1)
  assert.equal(gh(result).failureCode, 'crawl_delay_budget')
  assert.equal(gh(result).completeSnapshot, false)
})

test('Lever paginates through foreign rows, preserves allLocations and respects one second per host', async () => {
  const starts = []
  const urls = []
  const first = Array.from({ length: 100 }, (_, i) => lever(i + 1, { country: 'US', categories: { location: 'United States', allLocations: ['United States'] } }))
  const result = await fetchEmployerBatch(0, { ...onlyLever, fetchImpl: async url => {
    starts.push(performance.now()); urls.push(url)
    if (url.endsWith('/robots.txt')) return robots('User-agent: *\nAllow: /\nCrawl-delay: 1\n')
    return json(new URL(url).searchParams.get('skip') === '0' ? first : [lever(101)])
  } })
  assert.equal(lv(result).received, 101)
  assert.equal(lv(result).excluded, 100)
  assert.equal(lv(result).completeSnapshot, true)
  assert.equal(result.jobs.length, 1)
  assert.match(urls[2], /skip=100&limit=100$/)
  for (let i = 1; i < starts.length; i++) assert.ok(starts[i] - starts[i - 1] >= 995, `${starts[i] - starts[i - 1]}ms`)
})

test('a later paginated failure preserves prior valid jobs but never a complete snapshot', async () => {
  const first = Array.from({ length: 100 }, (_, i) => lever(i + 1, i === 0 ? {} : { country: 'US', categories: { location: 'United States' } }))
  const result = await fetchEmployerBatch(0, { ...onlyLever, fetchImpl: async url => {
    if (url.endsWith('/robots.txt')) return robots('User-agent: *\nAllow: /\nCrawl-delay: 1\n')
    return new URL(url).searchParams.get('skip') === '0' ? json(first) : json({}, 503, { 'Retry-After': '600' })
  } })
  assert.equal(result.jobs.length, 1)
  assert.equal(lv(result).outcome, 'partial')
  assert.equal(lv(result).completeSnapshot, false)
  assert.equal(lv(result).retryAfterUntil, new Date(NOW + 600_000).toISOString())
})

test('all network starts are limited to two hosts while both boards can make progress', async () => {
  let active = 0
  let maximum = 0
  const result = await fetchEmployerBatch(0, { now, fetchImpl: async url => {
    active++; maximum = Math.max(maximum, active)
    await new Promise(resolve => setTimeout(resolve, 10))
    active--
    if (url.endsWith('/robots.txt')) return robots()
    return json(url.includes('api.lever.co') ? [lever()] : ghPayload([greenhouse()]))
  } })
  assert.equal(result.jobs.length, 2)
  assert.ok(maximum <= 2)
  assert.equal(maximum, 2)
})
