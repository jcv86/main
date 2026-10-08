import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import {
  buildChileTrabajosListingUrl,
  fetchChileTrabajosBatch,
  probeChileTrabajosJob,
  discoverChileTrabajosJobIds,
  fetchChileTrabajosOpportunities,
} from '../lib/opportunities/sources/chiletrabajos.ts'
import {
  parseChileTrabajosJobHtml,
  parseChileTrabajosListingHtml,
  normalizeChileTrabajosDate,
  isChileTrabajosExpired,
  isChileTrabajosJobUrl,
  inferChileTrabajosWorkMode,
} from '../lib/opportunities/sources/chiletrabajos-parser.ts'

const fixture = name => readFileSync(new URL('./fixtures/chiletrabajos/' + name, import.meta.url), 'utf8')
const structured = fixture('structured-job.html')
const htmlOnly = fixture('html-job.html')
const listing = fixture('search-results.html')
const at = new Date('2026-10-07T17:00:00.000Z')
const now = () => at.getTime()
const jobUrl = id => 'https://www.chiletrabajos.cl/trabajo/' + id
const listingUrl = buildChileTrabajosListingUrl('contador', 'Santiago')
const jobHtml = (id, title = 'Analista de pruebas') => structured.replaceAll('7000001', id).replaceAll('Analista de pruebas', title)
const listings = ids => '<html><body><main>' + ids.map(id => '<a href="/trabajo/' + id + '">Aviso</a>').join('') + '</main></body></html>'
const response = (html, url, status = 200, headers = {}) => {
  const result = new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', ...headers } })
  Object.defineProperty(result, 'url', { value: url })
  return result
}
const code = expected => error => error?.code === expected

test('maintenance interleaves nine discoveries and three known offers within twelve probes', async () => {
  const fresh = Array.from({ length: 15 }, (_, i) => String(7000101 + i))
  const preferred = ['7000201', '7000202', '7000203', '7000204']
  const probes = []
  const batch = await fetchChileTrabajosBatch('', 'Santiago', 12, {
    now, budgetMs: 35_000, maxCandidates: 12, preferredIds: preferred,
    fetchImpl: async url => {
      if (url.includes('/encuentra-un-empleo')) return response(listings(fresh), url)
      const id = url.split('/').pop()
      probes.push(id)
      return response(jobHtml(id), url)
    },
  })
  assert.deepEqual(probes, [
    ...fresh.slice(0, 3), preferred[0], ...fresh.slice(3, 6), preferred[1],
    ...fresh.slice(6, 9), preferred[2],
  ])
  assert.equal(batch.jobs.length, 12)
  assert.equal(batch.diagnostics.probed, 12)
  assert.equal(batch.diagnostics.maintenance_selected, 3)
  assert.equal(batch.diagnostics.maintenance_probed, 3)
  assert.equal(batch.diagnostics.outcome, 'ok')
})

test('maintenance validates IDs, caps known candidates and probes overlap only once', async () => {
  const known = ['7000301', '7000302', '7000303']
  const fresh = ['7000311', '7000312', '7000313', '7000314']
  const probes = []
  const batch = await fetchChileTrabajosBatch('', 'Santiago', 12, {
    now,
    preferredIds: ['https://private.example/path', '../7000301', '7e6', '', 7000301,
      known[0], known[0], known[1], known[2], '7000304'],
    fetchImpl: async url => {
      assert.equal(new URL(url).origin, 'https://www.chiletrabajos.cl')
      if (url.includes('/encuentra-un-empleo')) return response(listings([...known, ...fresh]), url)
      const id = url.split('/').pop()
      assert.match(id, /^\d{5,10}$/)
      probes.push(id)
      return response(jobHtml(id), url)
    },
  })
  assert.deepEqual(probes, [...fresh.slice(0, 3), known[0], fresh[3], ...known.slice(1)])
  assert.equal(new Set(probes).size, probes.length)
  assert.equal(batch.diagnostics.maintenance_selected, 3)
  assert.equal(batch.diagnostics.maintenance_probed, 3)
  assert.ok(known.every(id => !JSON.stringify(batch.diagnostics).includes(id)))
})

test('unused maintenance places return to discovery without exceeding twelve total probes', async () => {
  for (const preferred of [[], ['7000401']]) {
    const fresh = Array.from({ length: 15 }, (_, i) => String(7000411 + i))
    const probes = []
    const batch = await fetchChileTrabajosBatch('', 'Santiago', 12, {
      now, maxCandidates: 12, preferredIds: preferred,
      fetchImpl: async url => {
        if (url.includes('/encuentra-un-empleo')) return response(listings(fresh), url)
        const id = url.split('/').pop(); probes.push(id)
        return response(jobHtml(id), url)
      },
    })
    assert.equal(probes.length, 12)
    assert.equal(probes.filter(id => fresh.includes(id)).length, 12 - preferred.length)
    assert.equal(batch.diagnostics.maintenance_probed, preferred.length)
    assert.equal(batch.diagnostics.returned, 12)
  }
})

test('known offers are revalidated after an empty listing without inventing discoveries', async () => {
  const batch = await fetchChileTrabajosBatch('', 'Santiago', 12, {
    now, preferredIds: ['7000501', '7000502'],
    fetchImpl: async url => response(url.includes('/encuentra-un-empleo')
      ? '<form action="/encuentra-un-empleo"><input name="2"></form><p>No se encontraron ofertas de trabajo.</p>'
      : jobHtml(url.split('/').pop()), url),
  })
  assert.equal(batch.diagnostics.discovered, 0)
  assert.equal(batch.diagnostics.discovery_status, 'empty')
  assert.equal(batch.diagnostics.maintenance_probed, 2)
  assert.equal(batch.diagnostics.returned, 2)
  assert.equal(batch.diagnostics.outcome, 'ok')
})

test('a changed listing format preserves valid known offers and a degraded diagnosis', async () => {
  const batch = await fetchChileTrabajosBatch('', 'Santiago', 12, {
    now, preferredIds: ['7000601', '7000602', '7000603'],
    fetchImpl: async url => response(url.includes('/encuentra-un-empleo')
      ? '<main><h1>Nuevo formato de resultados</h1></main>' : jobHtml(url.split('/').pop()), url),
  })
  assert.equal(batch.jobs.length, 3)
  assert.equal(batch.diagnostics.discovery_status, 'parse_failed')
  assert.equal(batch.diagnostics.failure_code, 'listing_shape')
  assert.equal(batch.diagnostics.maintenance_probed, 3)
  assert.equal(batch.diagnostics.outcome, 'partial')
})

test('discovery throttling, service pauses, forbidden access and challenges suppress all known probes', async () => {
  for (const [status, retry, expected, html = 'Provider unavailable'] of [
    [429, '3600', new Date(now() + 3600_000).toISOString()],
    [429, undefined, new Date(now() + 3 * 3600_000).toISOString()],
    [503, new Date(now() + 86400_000).toUTCString(), new Date(now() + 86400_000).toISOString()],
    [503, undefined, undefined],
    [403, '3600', undefined],
    [200, undefined, undefined, '<title>Just a moment</title><h1>Access denied</h1>'],
  ]) {
    let calls = 0
    const batch = await fetchChileTrabajosBatch('', 'Santiago', 12, {
      now, preferredIds: ['7000701', '7000702', '7000703'],
      fetchImpl: async url => {
        calls++
        return response(html, url, status, retry ? { 'Retry-After': retry } : {})
      },
    })
    assert.equal(calls, 1, String(status))
    assert.equal(batch.diagnostics.probed, 0)
    assert.equal(batch.diagnostics.maintenance_selected, 3)
    assert.equal(batch.diagnostics.maintenance_probed, 0)
    assert.equal(batch.diagnostics.retryAfterUntil, expected)
    assert.equal(batch.diagnostics.failure_code, status === 200 ? 'access_challenge' : 'http_' + status)
    assert.deepEqual(batch.failedJobs, [])
  }
})

test('detail Retry-After preserves completed observations then stops every remaining queue', async () => {
  for (const status of [429, 503]) {
    const probes = []
    const batch = await fetchChileTrabajosBatch('', 'Santiago', 12, {
      now, preferredIds: ['7000801', '7000802', '7000803'],
      fetchImpl: async url => {
        if (url.includes('/encuentra-un-empleo')) return response(listings(['7000811', '7000812', '7000813']), url)
        const id = url.split('/').pop(); probes.push(id)
        return probes.length === 2
          ? response('Private body must not be logged', url, status, { 'Retry-After': '86400' })
          : response(jobHtml(id), url)
      },
    })
    assert.deepEqual(probes, ['7000811', '7000812'])
    assert.equal(batch.diagnostics.outcome, 'partial')
    assert.equal(batch.diagnostics.failure_code, 'http_' + status)
    assert.equal(batch.diagnostics.retryAfterUntil, new Date(now() + 86400_000).toISOString())
    assert.equal(batch.diagnostics.maintenance_probed, 0)
    assert.equal(batch.verifiedJobs.length, 1)
    assert.equal(batch.failedJobs.length, 1)
    assert.ok(!JSON.stringify(batch.diagnostics).includes('Private body'))
  }
})

test('invalid 503 pauses do not manufacture cooldowns and the next valid detail is retained', async () => {
  let probes = 0
  const batch = await fetchChileTrabajosBatch('', 'Santiago', 12, {
    now,
    fetchImpl: async url => {
      if (url.includes('/encuentra-un-empleo')) return response(listings(['7000901', '7000902']), url)
      probes++
      return probes === 1 ? response('Unavailable', url, 503, { 'Retry-After': '-1' }) : response(jobHtml(url.split('/').pop()), url)
    },
  })
  assert.equal(probes, 2)
  assert.equal(batch.diagnostics.retryAfterUntil, undefined)
  assert.equal(batch.jobs.length, 1)
  assert.equal(batch.diagnostics.outcome, 'partial')
})

test('maintenance shares the 35-second work budget and caller cancellation with discovery', async () => {
  let clock = now()
  const batch = await fetchChileTrabajosBatch('', 'Santiago', 12, {
    now: () => clock, budgetMs: 35_000, preferredIds: ['7001001', '7001002', '7001003'],
    fetchImpl: async url => {
      if (url.includes('/encuentra-un-empleo')) return response(listings(Array.from({ length: 12 }, (_, i) => String(7001011 + i))), url)
      clock += 5000
      return response(jobHtml(url.split('/').pop()), url)
    },
  })
  assert.equal(batch.diagnostics.probed, 7)
  assert.equal(batch.diagnostics.maintenance_probed, 1)
  assert.equal(batch.diagnostics.budget_exhausted, true)
  assert.equal(batch.diagnostics.outcome, 'partial')
  const controller = new AbortController(); controller.abort()
  const cancelled = await fetchChileTrabajosBatch('', 'Santiago', 12, {
    now, signal: controller.signal, preferredIds: ['7001001'],
    fetchImpl: async () => assert.fail('Cancelled maintenance must not request the provider'),
  })
  assert.equal(cancelled.diagnostics.probed, 0)
  assert.equal(cancelled.diagnostics.maintenance_probed, 0)
})

test('the compatibility wrapper retains the provider retry date in its controlled error', async () => {
  await assert.rejects(fetchChileTrabajosOpportunities('', 'Santiago', 12, {
    now, fetchImpl: async url => response('Limited', url, 429, { 'Retry-After': '86400' }),
  }), error => error.code === 'http_429' && error.retryAfterUntil === new Date(now() + 86400_000).toISOString())
})

test('on-demand searches keep twenty candidate probes to find relevant offers beyond position twelve', async () => {
  for (const options of [{}, { maxCandidates: 20 }]) {
    let probes = 0
    const ids = Array.from({ length: 20 }, (_, i) => String(7001101 + i))
    const batch = await fetchChileTrabajosBatch('contador', 'Santiago', 5, {
      ...options, now,
      fetchImpl: async url => {
        if (url.includes('/encuentra-un-empleo')) return response(listings(ids), url)
        const id = url.split('/').pop(); probes++
        return response(jobHtml(id, probes > 12 ? 'Contador auditor' : 'Analista de pruebas'), url)
      },
    })
    assert.equal(probes, 17, 'the existing public/default search must reach its five matches')
    assert.equal(batch.jobs.length, 5)
    assert.equal(batch.diagnostics.irrelevant, 12)
    assert.equal(batch.diagnostics.outcome, 'ok')
  }
})

test('generic batch limits still clamp at twenty results and thirty probes while cron opts into twelve', async () => {
  let probes = 0
  const ids = Array.from({ length: 30 }, (_, i) => String(7001201 + i))
  const batch = await fetchChileTrabajosBatch('contador', 'Santiago', 100, {
    now, maxCandidates: 100,
    fetchImpl: async url => {
      if (url.includes('/encuentra-un-empleo')) return response(listings(ids), url)
      const id = url.split('/').pop(); probes++
      return response(jobHtml(id, probes > 10 ? 'Contador auditor' : 'Analista de pruebas'), url)
    },
  })
  assert.equal(probes, 30)
  assert.equal(batch.jobs.length, 20)
  assert.equal(batch.diagnostics.returned, 20)
  assert.equal(batch.diagnostics.outcome, 'ok')
})

test('real search form contract uses job field 2, city field 13 and f=2', () => {
  assert.equal(listingUrl, 'https://www.chiletrabajos.cl/encuentra-un-empleo?2=contador&13=1022&f=2')
  for (const [city, id] of [['Santiago', '1022'], ['Valparaíso', '1014'], ['Concepción', '1035'], ['Antofagasta', '1004'], ['Puerto Montt', '1043']]) {
    const params = new URL(buildChileTrabajosListingUrl('Analista & Auditor', city)).searchParams
    assert.equal(params.get('2'), 'Analista & Auditor')
    assert.equal(params.get('13'), id)
    assert.equal(params.get('f'), '2')
    assert.equal(params.has('1'), false)
  }
  assert.equal(new URL(buildChileTrabajosListingUrl('contador', 'Chile')).searchParams.has('13'), false)
  assert.throws(() => buildChileTrabajosListingUrl('contador', 'Región Metropolitana'), code('unsupported_location'))
})

test('JobPosting without identifier/url uses the page identity, excludes ads and resolves location', () => {
  const job = parseChileTrabajosJobHtml(structured, '7000001', jobUrl('7000001'), at)
  assert.equal(job.verificationStatus, 'verified_active')
  assert.equal(job.title, 'Analista de pruebas')
  assert.equal(job.company, 'Empresa de pruebas DTC')
  assert.equal(job.location, 'Santiago, RM')
  assert.equal(job.publishedAt, '2026-10-06T12:00:00.000Z')
  assert.equal(job.expiresAt, '2026-12-21T11:59:19.000Z')
  assert.ok(job.description.startsWith('La persona seleccionada'))
  assert.ok(job.description.length > 100)
  assert.ok(!job.description.includes('PUBLICIDAD'))
  assert.ok(!job.description.includes('oferta relacionada'))
  assert.equal(job.workMode, null, 'a city and FULL_TIME do not establish an onsite or remote work mode')
})

test('HTML fallback reads the second table cell and the scoped job paragraph', () => {
  const job = parseChileTrabajosJobHtml(htmlOnly, '7000002', jobUrl('7000002'), at)
  assert.equal(job.verificationStatus, 'verified_active')
  assert.equal(job.location, 'Santiago', 'the hidden third country cell must not be appended')
  assert.equal(job.expiresAt, '2026-12-21')
  assert.equal(job.workMode, 'hybrid')
  assert.ok(job.description.startsWith('Buscamos una persona'))
  assert.ok(!/PUBLICIDAD|Otro aviso|oferta relacionada|puesto de trabajo remoto/.test(job.description))
})

test('structured @graph is supported without choosing unrelated jobs', () => {
  const graph = structured.replace('"@context": "https://schema.org/",\n  "@type": "JobPosting",', '"@context": "https://schema.org/",\n  "@graph": [{"@type": "JobPosting",').replace('"validThrough": "2026-12-21T08:59:19"\n}', '"validThrough": "2026-12-21T08:59:19"}]\n}')
  assert.equal(parseChileTrabajosJobHtml(graph, '7000001', jobUrl('7000001'), at).verificationStatus, 'verified_active')
})

test('calendar expiry, timestamps and Chile summer/winter are distinct', () => {
  assert.equal(normalizeChileTrabajosDate('2026-12-04 (en 75 días)'), '2026-12-04')
  assert.equal(normalizeChileTrabajosDate('07 de Octubre de 2026'), '2026-10-07')
  assert.equal(normalizeChileTrabajosDate('2026-10-07 08:59:19'), '2026-10-07T11:59:19.000Z')
  assert.equal(normalizeChileTrabajosDate('2026-07-15T08:59:19'), '2026-07-15T12:59:19.000Z')
  assert.equal(normalizeChileTrabajosDate('2026-10-07T08:59:19Z'), '2026-10-07T08:59:19.000Z')
  assert.equal(normalizeChileTrabajosDate('2026-09-06T00:30:00'), null, 'the skipped DST hour does not exist in Santiago')
  assert.equal(normalizeChileTrabajosDate('2026-04-04T23:30:00'), '2026-04-05T02:30:00.000Z', 'the earlier ambiguous expiry is conservative')
  assert.equal(normalizeChileTrabajosDate('2026-02-31'), null)
  assert.equal(normalizeChileTrabajosDate('2026-10-07T25:00:00'), null)
  assert.equal(isChileTrabajosExpired('2026-10-07T08:59:19', at), true, 'an intraday deadline must not remain active until midnight')
  assert.equal(isChileTrabajosExpired('2026-10-07', new Date('2026-10-08T02:59:59Z')), false)
  assert.equal(isChileTrabajosExpired('2026-10-07', new Date('2026-10-08T03:00:00Z')), true)
  const expired = structured.replace('2026-12-21T08:59:19', '2026-10-07T08:59:19')
  assert.equal(parseChileTrabajosJobHtml(expired, '7000001', jobUrl('7000001'), at).verificationStatus, 'stale')
  const malformed = structured.replace('2026-12-21T08:59:19', '2026-02-31T08:59:19')
  assert.equal(parseChileTrabajosJobHtml(malformed, '7000001', jobUrl('7000001'), at).verificationStatus, 'unknown')
})

test('expiry messages and insufficient job data never become verified_active', () => {
  const closed = structured.replace('</main>', '<div>Esta oferta ha sido desactivada.</div></main>')
  assert.equal(parseChileTrabajosJobHtml(closed, '7000001', jobUrl('7000001'), at).verificationStatus, 'stale')
  const unrelatedClosed = structured.replace('<section class="related">', '<section class="related"><p>Esta oferta ha expirado.</p>')
  assert.equal(parseChileTrabajosJobHtml(unrelatedClosed, '7000001', jobUrl('7000001'), at).verificationStatus, 'verified_active', 'a related offer cannot expire the main job')
  const empty = '<html><body><h1>Analista</h1><div>PUBLICIDAD</div></body></html>'
  const unknown = parseChileTrabajosJobHtml(empty, '7000001', jobUrl('7000001'), at)
  assert.equal(unknown.verificationStatus, 'unknown')
  assert.equal(unknown.description, undefined)
  assert.throws(() => parseChileTrabajosJobHtml('<title>Just a moment</title><h1>Verifica tu identidad</h1>', '7000001', jobUrl('7000001'), at), code('payload_shape'))
})

test('job identity rejects a home page, another domain and a different canonical/visible ID', () => {
  for (const url of ['https://www.chiletrabajos.cl/', 'https://example.org/trabajo/7000001', jobUrl('7000009'), 'https://www.chiletrabajos.cl.evil.example/trabajo/7000001']) {
    assert.equal(isChileTrabajosJobUrl(url, '7000001'), false)
    assert.throws(() => parseChileTrabajosJobHtml(structured, '7000001', url, at), code('job_identity'))
  }
  const wrongCanonical = structured.replace('href="https://www.chiletrabajos.cl/trabajo/7000001"', 'href="https://www.chiletrabajos.cl/trabajo/7000009"')
  assert.throws(() => parseChileTrabajosJobHtml(wrongCanonical, '7000001', jobUrl('7000001'), at), code('job_identity'))
  const wrongId = structured.replace('>7000001</a>', '>7000009</a>')
  assert.throws(() => parseChileTrabajosJobHtml(wrongId, '7000001', jobUrl('7000001'), at), code('job_identity'))
})

test('work mode needs an affirmative statement and respects negations/conflicts', () => {
  assert.equal(inferChileTrabajosWorkMode('', 'Ubicación Santiago. Jornada Full-time.'), null)
  assert.equal(inferChileTrabajosWorkMode('', 'No se ofrece trabajo remoto.'), null)
  assert.equal(inferChileTrabajosWorkMode('', 'Sin posibilidad de teletrabajo.'), null)
  assert.equal(inferChileTrabajosWorkMode('', 'Posibilidad de trabajo remoto después del período inicial.'), null)
  assert.equal(inferChileTrabajosWorkMode('', 'Modalidad: remoto.'), 'remote')
  assert.equal(inferChileTrabajosWorkMode('', 'Modalidad presencial, sin teletrabajo.'), 'onsite')
  assert.equal(inferChileTrabajosWorkMode('', 'Trabajo remoto. Modalidad presencial.'), null)
  assert.equal(inferChileTrabajosWorkMode('', 'Modalidad híbrida con reuniones presenciales.'), 'hybrid')
  assert.equal(inferChileTrabajosWorkMode('Presencial', 'Modalidad híbrida.'), null)
  assert.equal(inferChileTrabajosWorkMode('', '', 'TELECOMMUTE'), 'remote')
  assert.equal(inferChileTrabajosWorkMode('Presencial', '', 'TELECOMMUTE'), null)
})

test('negations, historical mentions and discarded modes do not establish work mode', () => {
  assert.equal(inferChileTrabajosWorkMode('', 'No hay teletrabajo'), null)
  assert.equal(inferChileTrabajosWorkMode('', 'Experiencia previa en teletrabajo'), null)
  assert.equal(inferChileTrabajosWorkMode('', 'No es 100% remoto'), null)
  assert.equal(inferChileTrabajosWorkMode('', 'Se descarta la modalidad híbrida. Modalidad presencial.'), 'onsite')
  assert.equal(inferChileTrabajosWorkMode('', 'Modalidad presencial. No hay teletrabajo'), 'onsite')
  assert.equal(inferChileTrabajosWorkMode('', 'Ofrecemos teletrabajo.'), 'remote')
  assert.equal(inferChileTrabajosWorkMode('', 'No hay teletrabajo.', 'TELECOMMUTE'), null)
})

test('discovery excludes unrelated navigation, foreign URLs and duplicate IDs', () => {
  assert.deepEqual(parseChileTrabajosListingHtml(listing, listingUrl), ['7000011', '7000012', '7000013', '7000014', '7000015', '7000016'])
})

test('one discovery continues beyond five irrelevant jobs to the sixth matching candidate', async () => {
  const calls = []
  const batch = await fetchChileTrabajosBatch('contador', 'Santiago', 1, {
    now,
    fetchImpl: async (url, init) => {
      calls.push(url)
      assert.equal(init.redirect, 'manual')
      if (url.includes('/encuentra-un-empleo')) return response(listing, url)
      const id = url.split('/').pop()
      return response(jobHtml(id, id === '7000016' ? 'Contador auditor' : 'Analista contable'), url)
    },
  })
  assert.equal(calls.filter(url => url.includes('/encuentra-un-empleo')).length, 1)
  assert.equal(calls.length, 7)
  assert.equal(batch.jobs.length, 1)
  assert.equal(batch.jobs[0].sourceId, '7000016')
  assert.equal(batch.diagnostics.probed, 6)
  assert.equal(batch.diagnostics.active, 6)
  assert.equal(batch.diagnostics.irrelevant, 5)
  assert.equal(batch.diagnostics.returned, 1)
  assert.equal(batch.diagnostics.outcome, 'ok')
  assert.equal(batch.verifiedJobs.length, 6)
})

test('active, stale, parsing and transport failures have distinct counters and downgrade IDs', async () => {
  const ids = ['7000021', '7000022', '7000023', '7000024']
  const batch = await fetchChileTrabajosBatch('contador', 'Santiago', 5, {
    now,
    fetchImpl: async url => {
      if (url.includes('/encuentra-un-empleo')) return response(listings(ids), url)
      const id = url.split('/').pop()
      if (id === ids[2]) return response('<title>Just a moment</title><h1>Access denied</h1>', url)
      if (id === ids[3]) return response('Unavailable', url, 503)
      const html = jobHtml(id, 'Analista de pruebas')
      return response(id === ids[1] ? html.replace('2026-12-21T08:59:19', '2020-01-01T08:59:19') : html, url)
    },
  })
  for (const key of ['active', 'stale', 'parse_failed', 'unavailable', 'irrelevant']) assert.equal(batch.diagnostics[key], 1, key)
  assert.equal(batch.diagnostics.probed, 4)
  assert.equal(batch.diagnostics.returned, 0)
  assert.equal(batch.diagnostics.outcome, 'partial')
  assert.deepEqual(batch.failedJobs, [
    { sourceId: ids[2], verificationStatus: 'unknown' },
    { sourceId: ids[3], verificationStatus: 'unavailable' },
  ])
  assert.equal(batch.verifiedJobs[1].verificationStatus, 'stale')
})

test('empty search is a valid no_matches outcome, not provider unavailability', async () => {
  let calls = 0
  const batch = await fetchChileTrabajosBatch('contador', 'Santiago', 5, {
    now,
    fetchImpl: async url => {
      calls++
      return response('<form action="/encuentra-un-empleo"><input name="2"></form><p>No se encontraron ofertas de trabajo.</p>', url)
    },
  })
  assert.equal(calls, 1)
  assert.equal(batch.diagnostics.discovery_status, 'empty')
  assert.equal(batch.diagnostics.outcome, 'no_matches')
  assert.equal(batch.diagnostics.probed, 0)
  assert.deepEqual(batch.failedJobs, [])
})

test('a recognized batch with no relevant titles remains distinguishable from a failed connection', async () => {
  const fetchImpl = async url => url.includes('/encuentra-un-empleo')
    ? response(listings(['7000001']), url)
    : response(structured, url)
  const batch = await fetchChileTrabajosBatch('contador', 'Santiago', 5, { now, fetchImpl })
  assert.equal(batch.diagnostics.outcome, 'no_matches')
  assert.equal(batch.diagnostics.active, 1)
  assert.equal(batch.diagnostics.returned, 0)
  assert.deepEqual(await fetchChileTrabajosOpportunities('contador', 'Santiago', 5, { now, fetchImpl }), [])
})

test('unsupported cities make no requests and return a controlled code', async () => {
  const batch = await fetchChileTrabajosBatch('contador', 'Ciudad inventada', 5, {
    now,
    fetchImpl: async () => { assert.fail('An unsupported location must not make a network request') },
  })
  assert.equal(batch.diagnostics.failure_code, 'unsupported_location')
  assert.equal(batch.diagnostics.probed, 0)
  assert.deepEqual(batch.failedJobs, [])
})

test('discovery failure never invalidates every cached offer', async () => {
  for (const [status, html, outcome] of [[503, 'Unavailable', 'unavailable'], [200, '<h1>Access denied</h1>', 'parse_failed']]) {
    const batch = await fetchChileTrabajosBatch('contador', 'Santiago', 5, { now, fetchImpl: async url => response(html, url, status) })
    assert.equal(batch.diagnostics.outcome, outcome)
    assert.deepEqual(batch.failedJobs, [])
    assert.deepEqual(batch.verifiedJobs, [])
  }
})

test('candidate limit and provider throttling stop additional detail requests', async () => {
  const calls = []
  const limited = await fetchChileTrabajosBatch('contador', 'Santiago', 5, {
    now, maxCandidates: 2,
    fetchImpl: async url => { calls.push(url); return response(url.includes('/encuentra-un-empleo') ? listing : jobHtml(url.split('/').pop()), url) },
  })
  assert.equal(calls.length, 3)
  assert.equal(limited.diagnostics.probed, 2)
  assert.equal(limited.diagnostics.candidate_limit_reached, true)
  let throttledCalls = 0
  const throttled = await fetchChileTrabajosBatch('', 'Santiago', 5, {
    now,
    fetchImpl: async url => { throttledCalls++; return url.includes('/encuentra-un-empleo') ? response(listing, url) : response('Too many requests', url, 429) },
  })
  assert.equal(throttledCalls, 2)
  assert.equal(throttled.diagnostics.failure_code, 'http_429')
  assert.equal(throttled.failedJobs.length, 1)
})

test('a shared request budget stops the next candidate and marks a partial batch', async () => {
  let clock = now()
  const batch = await fetchChileTrabajosBatch('', 'Santiago', 10, {
    now: () => clock, budgetMs: 50, maxCandidates: 20,
    fetchImpl: async url => {
      if (url.includes('/encuentra-un-empleo')) return response(listing, url)
      clock += 20
      return response(jobHtml(url.split('/').pop()), url)
    },
  })
  assert.equal(batch.diagnostics.probed, 3)
  assert.equal(batch.diagnostics.budget_exhausted, true)
  assert.equal(batch.diagnostics.outcome, 'partial')
})

test('same-ID redirects are followed, other destinations are rejected before a second request', async () => {
  for (const destination of ['https://example.org/signin', 'https://www.chiletrabajos.cl/', jobUrl('7000009')]) {
    let calls = 0
    await assert.rejects(probeChileTrabajosJob('7000001', {
      now,
      fetchImpl: async url => { calls++; return response(null, url, 302, { Location: destination }) },
    }), code('redirect_identity'))
    assert.equal(calls, 1)
  }
  let calls = 0
  const job = await probeChileTrabajosJob('7000001', {
    now,
    fetchImpl: async url => {
      calls++
      return calls === 1 ? response(null, url, 302, { Location: '/trabajo/analista-7000001' }) : response(structured, url)
    },
  })
  assert.equal(calls, 2)
  assert.equal(job.verificationStatus, 'verified_active')
  assert.equal(job.originalUrl, 'https://www.chiletrabajos.cl/trabajo/analista-7000001')
})

test('response URL and payload bounds are validated even when a fetch implementation follows redirects', async () => {
  await assert.rejects(probeChileTrabajosJob('7000001', { now, fetchImpl: async () => response(structured, 'https://example.org/signin') }), code('redirect_identity'))
  await assert.rejects(probeChileTrabajosJob('7000001', { now, fetchImpl: async url => response('x', url, 200, { 'Content-Length': String(2 * 1024 * 1024 + 1) }) }), code('payload_too_large'))
  await assert.rejects(probeChileTrabajosJob('7000001', { now, fetchImpl: async url => response('{}', url, 200, { 'Content-Type': 'application/json' }) }), code('content_type'))
})

test('request timeout covers a stalled fetch and an already cancelled caller makes no request', async () => {
  await assert.rejects(probeChileTrabajosJob('7000001', {
    timeoutMs: 25, budgetMs: 200,
    fetchImpl: async (_url, init) => new Promise((_resolve, reject) => {
      init.signal.addEventListener('abort', () => reject(new Error('Aborted')), { once: true })
    }),
  }), code('timeout'))
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(discoverChileTrabajosJobIds('contador', 'Santiago', {
    signal: controller.signal,
    fetchImpl: async () => { assert.fail('An aborted request must not fetch') },
  }), code('aborted'))
})
