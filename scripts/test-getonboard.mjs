import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import {
  normalizeGetOnBoardJob,
  normalizeGetOnBoardJobResult,
  normalizeGetOnBoardPayload,
  normalizeGetOnBoardPublishedAt,
  normalizeGetOnBoardWorkMode,
  isGetOnBoardJobUrl,
  buildGetOnBoardJobsUrl,
  fetchGetOnBoardBatch,
  fetchGetOnBoardJobs,
  GetOnBoardProviderError,
} from '../lib/opportunities/sources/getonboard.ts'

// Synthetic content with the public JSON shape observed on 2026-10-07.
// No private API, live network, credentials or database writes are used.
const payload = JSON.parse(readFileSync(new URL('./fixtures/getonboard/public-response.synthetic.json', import.meta.url), 'utf8'))
const source = payload.data[0]
const verifiedAt = '2026-10-07T18:00:00.000Z'
const now = () => new Date(verifiedAt).getTime()
const row = (id = source.id, attributes = {}) => ({
  ...structuredClone(source),
  id,
  attributes: { ...structuredClone(source.attributes), ...attributes },
  links: { public_url: 'https://www.getonbrd.com/jobs/' + id },
})
const response = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', ...headers },
})
const isError = (kind, code) => error => error instanceof GetOnBoardProviderError && error.kind === kind && error.code === code

test('observed inline company expansion and resource public_url normalize successfully', () => {
  const job = normalizeGetOnBoardJob(source, verifiedAt)
  assert.ok(job)
  assert.equal(job.sourceId, source.id)
  assert.equal(job.title, 'Desarrollador de pruebas')
  assert.equal(job.company, 'Empresa sintética DTC')
  assert.equal(job.originalUrl, source.links.public_url)
  assert.equal(job.location, 'Santiago, Chile')
  assert.equal(job.remote, false)
  assert.equal(job.workMode, 'hybrid', 'remote=false must not become onsite')
  assert.equal(job.publishedAt, '2026-10-02T13:14:42.000Z')
  assert.equal(job.lastVerifiedAt, verifiedAt)
  assert.equal(job.verificationStatus, 'verified_active')
  assert.deepEqual(job.skills, ['TypeScript', 'Node.js'])
})

test('flattened compatibility form keeps a matching provider identity', () => {
  const sample = {
    data: {
      id: 'product-manager-empresa-sintetica',
      attributes: {
        title: 'Product Manager', company_name: 'Empresa sintética',
        public_url: 'https://www.getonbrd.com/jobs/product-management/product-manager-empresa-sintetica',
        published_at: '2026-09-20T12:00:00Z', remote: true,
      },
    },
  }
  const job = normalizeGetOnBoardJob(sample, verifiedAt)
  assert.equal(job.sourceId, sample.data.id)
  assert.equal(job.company, 'Empresa sintética')
  assert.equal(job.workMode, 'remote')
})

test('a description cannot resurrect a contradictory, temporary or unsupported declared mode', () => {
  for (const attributes of [
    { remote_modality: 'fully_remote', remote: false, description: 'This role is remote.' },
    { remote_modality: 'no_remote', remote: true, description: 'Modalidad presencial.' },
    { remote_modality: 'temporarily_remote', remote: true, description: 'This role is remote.' },
    { remote_modality: 'undocumented', remote: true, description: 'This role is remote.' },
    { remote_modality: '', remote: false, description: 'This role is remote.' },
  ]) {
    const job = normalizeGetOnBoardJob(row(source.id, attributes), verifiedAt)
    assert.ok(job)
    assert.equal(job.workMode, null)
    assert.equal(job.remote, null)
  }
  const hybrid = normalizeGetOnBoardJob(row(source.id, { remote_modality: '', remote: false, description: 'Modalidad híbrida.' }), verifiedAt)
  assert.equal(hybrid.workMode, 'hybrid', 'A non-remote flag alone does not imply onsite')
  assert.equal(hybrid.remote, false)
})

test('oversized descriptions are rejected before a truncation could remove negating source text', () => {
  const samples = [
    { description_headline: 'x'.repeat(39_960) + '\nThis role is remote.', functions: 'No hay teletrabajo.', description: '', desirable: '' },
    { description: 'x'.repeat(40_001), description_headline: 'This role is remote.' },
    { description: '<div>' + 'x'.repeat(200_000) + '</div>' },
  ]
  for (const attributes of samples) assert.deepEqual(
    normalizeGetOnBoardJobResult(row(source.id, attributes), verifiedAt),
    { kind: 'rejected', reason: 'description_too_large' },
  )
})

test('scheduled publication is not verified active before its actual date or instant', () => {
  for (const published_at of ['2026-10-08', '2026-10-07T18:00:00.001Z', Date.parse('2026-10-07T18:00:01Z') / 1000]) {
    assert.equal(normalizeGetOnBoardJob(row(source.id, { published_at }), verifiedAt), null)
  }
  assert.ok(normalizeGetOnBoardJob(row(source.id, { published_at: verifiedAt }), verifiedAt))
  const midnight = '2026-10-08T02:59:59.999Z'
  assert.ok(normalizeGetOnBoardJob(row(source.id, { published_at: '2026-10-07' }), midnight))
  assert.equal(normalizeGetOnBoardJob(row(source.id, { published_at: '2026-10-08' }), midnight), null)
  assert.ok(normalizeGetOnBoardJob(row(source.id, { published_at: '2026-10-08' }), '2026-10-08T03:00:00.000Z'))
  const batch = normalizeGetOnBoardPayload({ data: [source, row('scheduled-synthetic', { published_at: '2026-10-09' })] }, verifiedAt)
  assert.equal(batch.jobs.length, 1)
  assert.equal(batch.diagnostics.outcome, 'partial')
  assert.equal(batch.diagnostics.rejected, 1)
})

test('expanded fields can exist at the resource level as in the official SDK', () => {
  const sample = row()
  sample.company = sample.attributes.company
  delete sample.attributes.company
  assert.equal(normalizeGetOnBoardJob(sample, verifiedAt).company, 'Empresa sintética DTC')
})

test('public source URL requires provider hostname, job path and matching slug', () => {
  for (const url of [
    'https://example.org/signin',
    'https://www.getonbrd.com/',
    'https://www.getonbrd.com/api/v0/jobs/' + source.id,
    'https://www.getonbrd.com/jobs/a-different-job',
    source.links.public_url + '?tracking=unexpected',
    source.links.public_url + '#unexpected',
    source.links.public_url.replace('getonbrd.com', 'getonbrd.com.evil.example'),
    source.links.public_url.replace('www.getonbrd.com', 'user:password@www.getonbrd.com'),
    source.links.public_url.replace('getonbrd.com', 'getonbrd.com:8443'),
  ]) {
    assert.equal(isGetOnBoardJobUrl(url, source.id), false, url)
    assert.equal(normalizeGetOnBoardJob({ ...row(), links: { public_url: url } }, verifiedAt), null)
  }
  assert.equal(isGetOnBoardJobUrl(source.links.public_url, source.id), true)
})

test('missing identity, company and job title are rejected without invented metadata', () => {
  for (const sample of [
    { ...row(), id: '' },
    { ...row(), type: 'company' },
    row(source.id, { title: '', name: '' }),
    row(source.id, { company: { data: { id: 'unexpanded', type: 'company' } } }),
    { ...row(), links: {} },
  ]) assert.equal(normalizeGetOnBoardJob(sample, verifiedAt), null)
})

test('HTML fields become visible text; scripts, styles and tag keywords do not become evidence', () => {
  const sample = row(source.id, {
    technologies: ['TypeScript'],
    requirements: ['<b>Experiencia comprobable</b>'],
  })
  const job = normalizeGetOnBoardJob(sample, verifiedAt)
  assert.match(job.description, /Revisar datos y desarrollar aplicaciones accesibles/)
  assert.match(job.description, /Se requiere experiencia/)
  assert.ok(!/<[^>]+>|UNSAFE_SCRIPT_SENTINEL|color: red/.test(job.description))
  assert.deepEqual(job.requirements, ['Experiencia comprobable', 'Se requiere experiencia en desarrollo y comunicación clara.'])
  assert.deepEqual(job.skills, ['TypeScript', 'Node.js'])
  assert.ok(!job.skills.some(skill => /DO_NOT_INFER|Server backend/.test(skill)))
})

test('unexpanded tags and city IDs do not become skills or invented city names', () => {
  const sample = row(source.id, {
    location_cities: { data: [{ id: '1', type: 'location_city' }] },
    tags: { data: [{ id: 'typescript', type: 'tag' }] },
  })
  const job = normalizeGetOnBoardJob(sample, verifiedAt)
  assert.equal(job.location, 'Chile', 'only the explicitly supplied country is known')
  assert.deepEqual(job.skills, [])
  sample.attributes.countries = []
  assert.equal(normalizeGetOnBoardJob(sample, verifiedAt).location, null)
})

test('declared remote modalities preserve hybrid and geographic limits without guessing permanence', () => {
  for (const [mode, remote, expected] of [
    ['hybrid', false, 'hybrid'],
    ['fully_remote', true, 'remote'],
    ['remote_local', true, 'remote'],
    ['no_remote', false, 'onsite'],
    ['temporarily_remote', true, null],
    ['unexpected', true, null],
    ['fully_remote', false, null],
    ['no_remote', true, null],
    [undefined, false, null],
    [undefined, true, 'remote'],
  ]) assert.equal(normalizeGetOnBoardWorkMode(mode, remote), expected, String(mode))
  const restricted = normalizeGetOnBoardJob(row(source.id, {
    remote: true, remote_modality: 'remote_local', location_cities: { data: [] }, countries: ['Chile'],
  }), verifiedAt)
  assert.equal(restricted.workMode, 'remote')
  assert.equal(restricted.location, 'Chile', 'remote does not imply worldwide eligibility')
})

test('expanded local-remote restrictions retain countries and regions without Remote as a country', () => {
  const local = {
    remote: true, remote_modality: 'remote_local', countries: ['Remote'],
    location_cities: { data: [] },
  }
  const chile = normalizeGetOnBoardJob(row(source.id, {
    ...local,
    location_tenants: { data: [{ id: 'chile', type: 'country', attributes: { name: 'Chile' } }] },
    location_regions: { data: null },
  }), verifiedAt)
  assert.equal(chile.location, 'Chile')
  assert.equal(chile.workMode, 'remote')
  const argentina = normalizeGetOnBoardJob(row(source.id, {
    ...local,
    location_tenants: { data: [{ id: 'argentina', type: 'country', attributes: { name: 'Argentina' } }] },
  }), verifiedAt)
  assert.equal(argentina.location, 'Argentina', 'this remains a multinational source')
  const regions = normalizeGetOnBoardJob(row(source.id, {
    ...local,
    location_regions: { data: [
      { id: 'central_america', type: 'region', attributes: { name: 'Central America' } },
      { id: 'south_america', type: 'region', attributes: { name: 'South America' } },
    ] },
  }), verifiedAt)
  assert.equal(regions.location, 'Central America · South America')
  assert.ok(!regions.location.includes('Remote'))
})

test('unresolved territorial restrictions are discarded even when another boundary has a name', () => {
  const unresolved = row('local-remote-unknown', {
    remote: true, remote_modality: 'remote_local', countries: ['Remote'],
    location_cities: { data: [] },
    location_tenants: { data: [{ id: 1, type: 'location_tenant' }] },
  })
  assert.equal(normalizeGetOnBoardJob(unresolved, verifiedAt), null)
  unresolved.attributes.countries = ['Chile']
  assert.equal(normalizeGetOnBoardJob(unresolved, verifiedAt), null, 'a named country must not hide another unresolved restriction')
  const batch = normalizeGetOnBoardPayload({ data: [row(), unresolved] }, verifiedAt)
  assert.equal(batch.diagnostics.outcome, 'partial')
  assert.equal(batch.diagnostics.rejected, 1)
  assert.equal(batch.jobs.length, 1)
})

test('published_at Unix seconds are converted once and invalid calendar inputs remain unknown', () => {
  assert.equal(normalizeGetOnBoardPublishedAt(1790946882), '2026-10-02T13:14:42.000Z')
  assert.equal(normalizeGetOnBoardPublishedAt('2026-10-02T13:14:42Z'), '2026-10-02T13:14:42.000Z')
  assert.equal(normalizeGetOnBoardPublishedAt('2026-10-02'), '2026-10-02')
  for (const value of [-1, NaN, Infinity, 1.5, '2026-02-31', '2026-02-31T13:00:00Z', 'not a date']) {
    assert.equal(normalizeGetOnBoardPublishedAt(value), null, String(value))
  }
})

test('empty, malformed and completely rejected payloads are distinct', () => {
  const empty = normalizeGetOnBoardPayload({ data: [] }, verifiedAt)
  assert.equal(empty.diagnostics.outcome, 'no_matches')
  assert.equal(empty.diagnostics.received, 0)
  for (const malformed of [{}, { data: null }, { data: {} }, null, []]) {
    const result = normalizeGetOnBoardPayload(malformed, verifiedAt)
    assert.equal(result.diagnostics.outcome, 'parse_failed')
    assert.equal(result.diagnostics.failure_code, 'payload_shape')
  }
  const rejected = normalizeGetOnBoardPayload({ data: [{ id: 'bad', attributes: { title: 'Missing company and URL' } }] }, verifiedAt)
  assert.equal(rejected.diagnostics.outcome, 'parse_failed')
  assert.equal(rejected.diagnostics.failure_code, 'no_valid_jobs')
  assert.equal(rejected.diagnostics.received, 1)
  assert.equal(rejected.diagnostics.rejected, 1)
  assert.equal(rejected.diagnostics.returned, 0)
})

test('partial normalization records discarded rows instead of silently claiming an empty search', () => {
  const result = normalizeGetOnBoardPayload({ data: [row(), { id: 'bad' }] }, verifiedAt)
  assert.equal(result.diagnostics.outcome, 'partial')
  assert.equal(result.diagnostics.received, 2)
  assert.equal(result.diagnostics.considered, 2)
  assert.equal(result.diagnostics.normalized, 1)
  assert.equal(result.diagnostics.rejected, 1)
  assert.equal(result.jobs.length, 1)
})

test('normalization remains bounded even if the server ignores per_page', () => {
  const result = normalizeGetOnBoardPayload({
    data: Array.from({ length: 120 }, (_, index) => row('developer-synthetic-' + index)),
  }, verifiedAt)
  assert.equal(result.diagnostics.received, 120)
  assert.equal(result.diagnostics.considered, 30)
  assert.equal(result.diagnostics.returned, 30)
  assert.equal(result.jobs.at(-1).sourceId, 'developer-synthetic-29')
})

test('one public request asks for thirty jobs and the five verified expansions', async () => {
  const calls = []
  const batch = await fetchGetOnBoardBatch('programming', 1, {
    now,
    fetchImpl: async (url, options) => {
      calls.push(url)
      const target = new URL(url)
      assert.equal(target.origin, 'https://www.getonbrd.com')
      assert.equal(target.pathname, '/api/v0/categories/programming/jobs')
      assert.equal(target.searchParams.get('page'), '1')
      assert.equal(target.searchParams.get('per_page'), '30')
      assert.deepEqual(target.searchParams.getAll('expand[]'), ['company', 'location_cities', 'tags', 'location_regions', 'location_tenants'])
      assert.equal(options.redirect, 'error')
      assert.ok(options.signal instanceof AbortSignal)
      return response(payload)
    },
  })
  assert.equal(calls.length, 1)
  assert.equal(batch.diagnostics.outcome, 'ok')
  assert.equal(batch.fetchedAt, verifiedAt)
  assert.equal(batch.jobs[0].workMode, 'hybrid')
})

test('compatibility wrapper returns arrays and throws for a broken normalization contract', async () => {
  const jobs = await fetchGetOnBoardJobs('programming', 1, { now, fetchImpl: async () => response(payload) })
  assert.ok(Array.isArray(jobs))
  assert.equal(jobs.length, 1)
  assert.deepEqual(await fetchGetOnBoardJobs('programming', 1, { now, fetchImpl: async () => response({ data: [] }) }), [])
  await assert.rejects(fetchGetOnBoardJobs('programming', 1, {
    now, fetchImpl: async () => response({ data: [{ id: 'bad' }] }),
  }), isError('parse_failed', 'no_valid_jobs'))
  await assert.rejects(fetchGetOnBoardJobs('programming', 1, {
    now, fetchImpl: async () => response({ wrong: [] }),
  }), isError('parse_failed', 'payload_shape'))
})

test('HTTP, network and JSON errors expose only controlled error metadata', async () => {
  await assert.rejects(fetchGetOnBoardBatch('programming', 1, {
    fetchImpl: async () => response({ sensitive: 'body must not become a message' }, 503),
  }), isError('unavailable', 'http_503'))
  await assert.rejects(fetchGetOnBoardBatch('programming', 1, {
    fetchImpl: async () => { throw new Error('private diagnostic value must not escape') },
  }), error => isError('unavailable', 'network_error')(error) && !error.message.includes('private diagnostic'))
  await assert.rejects(fetchGetOnBoardBatch('programming', 1, {
    fetchImpl: async () => new Response('<html>not JSON</html>', { status: 200 }),
  }), isError('parse_failed', 'invalid_json'))
})

test('429 carries seconds or HTTP-date pauses and falls back to three hours for invalid headers', async () => {
  const fallback = new Date(now() + 3 * 3600_000).toISOString()
  for (const [header, expected] of [
    ['86400', new Date(now() + 86400_000).toISOString()],
    [new Date(now() + 6 * 3600_000).toUTCString(), new Date(now() + 6 * 3600_000).toISOString()],
    ['Thursday, 08-Oct-26 18:00:00 GMT', '2026-10-08T18:00:00.000Z'],
    ['Thu Oct  8 18:00:00 2026', '2026-10-08T18:00:00.000Z'],
    [undefined, fallback], ['', fallback], ['-1', fallback], ['1.5', fallback],
    ['tomorrow', fallback], ['9'.repeat(500), fallback], ['0', fallback],
    ['Wed, 31 Feb 2027 18:00:00 GMT', fallback],
    [new Date(now() - 1000).toUTCString(), fallback],
  ]) {
    let calls = 0
    await assert.rejects(fetchGetOnBoardBatch('programming', 1, {
      now,
      fetchImpl: async () => {
        calls++
        return response({ private: 'PRIVATE_RATE_LIMIT_BODY' }, 429, header === undefined ? {} : { 'Retry-After': header })
      },
    }), error => error.kind === 'unavailable' && error.code === 'http_429'
      && error.retryAfterUntil === expected && !error.message.includes('PRIVATE_RATE_LIMIT_BODY'))
    assert.equal(calls, 1)
  }
})

test('503 exposes only a valid future Retry-After and preserves the error code', async () => {
  for (const [header, expected] of [
    ['3600', new Date(now() + 3600_000).toISOString()],
    [new Date(now() + 86400_000).toUTCString(), new Date(now() + 86400_000).toISOString()],
    [undefined, undefined], ['-1', undefined], ['1.5', undefined], ['unknown', undefined],
    ['Wed, 31 Feb 2027 18:00:00 GMT', undefined],
    [new Date(now() - 1000).toUTCString(), undefined],
  ]) {
    await assert.rejects(fetchGetOnBoardBatch('programming', 1, {
      now, fetchImpl: async () => response({}, 503, header === undefined ? {} : { 'Retry-After': header }),
    }), error => error.code === 'http_503' && error.retryAfterUntil === expected)
  }
})

test('rate-limit bodies are cancelled without reading them and access denials do not become cooldowns', async () => {
  let cancelled = false
  const body = new ReadableStream({ cancel() { cancelled = true } })
  await assert.rejects(fetchGetOnBoardBatch('programming', 1, {
    now, fetchImpl: async () => new Response(body, { status: 429, headers: { 'Retry-After': '60' } }),
  }), error => error.code === 'http_429' && error.retryAfterUntil === new Date(now() + 60_000).toISOString())
  assert.equal(cancelled, true)
  await assert.rejects(fetchGetOnBoardBatch('programming', 1, {
    now, fetchImpl: async () => response({}, 403, { 'Retry-After': '86400' }),
  }), error => error.code === 'http_403' && error.retryAfterUntil === undefined)
})

test('response bytes are bounded while streaming even without Content-Length', async () => {
  let cancelled = false
  let calls = 0
  const body = new ReadableStream({
    start(controller) { controller.enqueue(new Uint8Array(2 * 1024 * 1024 + 1)) },
    cancel() { cancelled = true },
  })
  await assert.rejects(fetchGetOnBoardBatch('programming', 1, {
    fetchImpl: async () => {
      calls++
      return new Response(body, { headers: { 'Content-Type': 'application/json' } })
    },
  }), isError('parse_failed', 'payload_too_large'))
  assert.equal(calls, 1)
  assert.equal(cancelled, true)
})

test('completed payload cannot return jobs after the work deadline expires', async () => {
  const realNow = Date.now
  let clock = realNow()
  Date.now = () => clock
  try {
    await assert.rejects(fetchGetOnBoardBatch('programming', 1, {
      timeoutMs: 8000,
      fetchImpl: async () => response(payload),
      now: () => { clock += 8001; return new Date(verifiedAt).getTime() },
    }), { name: 'AbortError' })
  } finally {
    Date.now = realNow
  }
})

test('invalid request values and cancelled callers perform no fetch', async () => {
  assert.throws(() => buildGetOnBoardJobsUrl('../private/jobs'), isError('invalid_request', 'invalid_category'))
  assert.throws(() => buildGetOnBoardJobsUrl('programming', NaN), isError('invalid_request', 'invalid_page'))
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(fetchGetOnBoardBatch('programming', 1, {
    signal: controller.signal,
    fetchImpl: async () => assert.fail('Cancelled caller must not send a request'),
  }), { name: 'AbortError' })
})

test('timeout still aborts the only fetch and preserves the existing AbortError contract', async () => {
  let calls = 0
  await assert.rejects(fetchGetOnBoardJobs('programming', 1, {
    timeoutMs: 2,
    fetchImpl: async (_url, options) => {
      calls++
      return new Promise((_resolve, reject) => {
        options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true })
      })
    },
  }), { name: 'AbortError' })
  assert.equal(calls, 1)
})
