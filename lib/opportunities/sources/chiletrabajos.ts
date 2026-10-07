import {
  ChileTrabajosProviderError,
  parseChileTrabajosJobHtml,
  parseChileTrabajosListingHtml,
  isChileTrabajosJobUrl,
  isChileTrabajosListingUrl,
  type ChileTrabajosPublicJob,
} from './chiletrabajos-parser'

export {
  ChileTrabajosProviderError,
  isChileTrabajosJobUrl,
  normalizeChileTrabajosDate,
  isChileTrabajosExpired,
} from './chiletrabajos-parser'
export type { ChileTrabajosPublicJob, ChileTrabajosWorkMode } from './chiletrabajos-parser'

export interface ChileTrabajosRequestOptions {
  timeoutMs?: number
  budgetMs?: number
  signal?: AbortSignal
  /** Dependency injection for deterministic tests; callers use the server fetch by default. */
  fetchImpl?: (url: string, init: RequestInit) => Promise<Response>
  now?: () => number
}

export interface ChileTrabajosBatchOptions extends ChileTrabajosRequestOptions {
  maxCandidates?: number
}

export interface ChileTrabajosDiscoveryResult {
  source: 'chiletrabajos'
  fetchedAt: string
  listingUrl: string
  ids: string[]
}

export interface ChileTrabajosBatchDiagnostics {
  discovered: number
  probed: number
  active: number
  stale: number
  parse_failed: number
  unavailable: number
  irrelevant: number
  returned: number
  budget_exhausted: boolean
  candidate_limit_reached: boolean
  discovery_status: 'ok' | 'empty' | 'parse_failed' | 'unavailable'
  outcome: 'ok' | 'partial' | 'no_matches' | 'parse_failed' | 'unavailable'
  failure_code?: string
}

export interface ChileTrabajosBatchResult {
  source: 'chiletrabajos'
  fetchedAt: string
  listingUrl: string
  /** Active offers relevant to the search. */
  jobs: ChileTrabajosPublicJob[]
  /** Parsed offers, including stale/unknown, so an existing index can be downgraded. */
  verifiedJobs: ChileTrabajosPublicJob[]
  /** Failed individual IDs; a discovery failure never invalidates the whole index. */
  failedJobs: Array<{ sourceId: string; verificationStatus: 'unknown' | 'unavailable' }>
  diagnostics: ChileTrabajosBatchDiagnostics
}

interface RequestContext {
  fetchImpl: (url: string, init: RequestInit) => Promise<Response>
  now: () => number
  deadline: number
  timeoutMs: number
  signal?: AbortSignal
}

const MAX_HTML_BYTES = 2 * 1024 * 1024
const MAX_REDIRECTS = 3

function bounded(value: number | undefined, fallback: number, minimum: number, maximum: number): number {
  return Number.isFinite(value) ? Math.max(minimum, Math.min(Math.floor(value!), maximum)) : fallback
}

function context(options: ChileTrabajosRequestOptions = {}): RequestContext {
  const now = options.now || Date.now
  return {
    fetchImpl: options.fetchImpl || fetch,
    now,
    deadline: now() + bounded(options.budgetMs, 12_000, 25, 40_000),
    timeoutMs: bounded(options.timeoutMs, 5_000, 25, 8_000),
    signal: options.signal,
  }
}

function assertRequestUrl(url: string, id?: string): void {
  const valid = id ? isChileTrabajosJobUrl(url, id) : isChileTrabajosListingUrl(url)
  if (!valid) throw new ChileTrabajosProviderError('parse_failed', 'redirect_identity', 'Chiletrabajos redirect did not preserve the requested resource')
}

async function readLimitedHtml(response: Response, signal: AbortSignal): Promise<string> {
  const declared = Number(response.headers.get('content-length') || 0)
  if (declared > MAX_HTML_BYTES) {
    await response.body?.cancel()
    throw new ChileTrabajosProviderError('parse_failed', 'payload_too_large', 'Chiletrabajos response exceeded the size limit')
  }
  const contentType = response.headers.get('content-type') || ''
  if (contentType && !/\b(?:text\/html|application\/xhtml\+xml)\b/i.test(contentType)) {
    await response.body?.cancel()
    throw new ChileTrabajosProviderError('parse_failed', 'content_type', 'Chiletrabajos response was not HTML')
  }
  if (!response.body) {
    const html = await response.text()
    if (new TextEncoder().encode(html).byteLength > MAX_HTML_BYTES) throw new ChileTrabajosProviderError('parse_failed', 'payload_too_large', 'Chiletrabajos response exceeded the size limit')
    return html
  }
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  const cancelReader = () => { void reader.cancel().catch(() => {}) }
  signal.addEventListener('abort', cancelReader, { once: true })
  let bytes = 0
  let html = ''
  try {
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > MAX_HTML_BYTES) {
        await reader.cancel()
        throw new ChileTrabajosProviderError('parse_failed', 'payload_too_large', 'Chiletrabajos response exceeded the size limit')
      }
      html += decoder.decode(value, { stream: true })
    }
    return html + decoder.decode()
  } finally {
    signal.removeEventListener('abort', cancelReader)
    reader.releaseLock()
  }
}

async function fetchHtml(initialUrl: string, ctx: RequestContext, id?: string): Promise<{ html: string; url: string }> {
  const remaining = ctx.deadline - ctx.now()
  if (remaining <= 0) throw new ChileTrabajosProviderError('unavailable', 'budget_exhausted', 'Chiletrabajos request budget was exhausted')
  if (ctx.signal?.aborted) throw new ChileTrabajosProviderError('unavailable', 'aborted', 'Chiletrabajos request was cancelled')
  const controller = new AbortController()
  const abortExternal = () => controller.abort()
  ctx.signal?.addEventListener('abort', abortExternal, { once: true })
  const timer = setTimeout(() => controller.abort(), Math.min(ctx.timeoutMs, remaining))
  let abortListener: (() => void) | undefined
  const cancelled = new Promise<never>((_, reject) => {
    abortListener = () => reject(new ChileTrabajosProviderError(
      'unavailable',
      ctx.signal?.aborted ? 'aborted' : ctx.now() >= ctx.deadline ? 'budget_exhausted' : 'timeout',
      'Chiletrabajos request did not complete within its budget',
    ))
    controller.signal.addEventListener('abort', abortListener, { once: true })
  })
  const operation = async () => {
    let url = initialUrl
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      assertRequestUrl(url, id)
      const response = await ctx.fetchImpl(url, {
        headers: { Accept: 'text/html,application/xhtml+xml', 'User-Agent': 'DespegaTuCarrera/1.0 (+https://www.despegatucarrera.com)' },
        cache: 'no-store', redirect: 'manual', signal: controller.signal,
      })
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location')
        await response.body?.cancel()
        if (!location || hop === MAX_REDIRECTS) throw new ChileTrabajosProviderError('parse_failed', 'redirect_limit', 'Chiletrabajos redirect could not be resolved')
        try { url = new URL(location, url).toString() } catch {
          throw new ChileTrabajosProviderError('parse_failed', 'redirect_identity', 'Chiletrabajos redirect was not a valid source URL')
        }
        // Validate the next destination before any request, including every redirect hop.
        assertRequestUrl(url, id)
        continue
      }
      if (!response.ok) {
        await response.body?.cancel()
        throw new ChileTrabajosProviderError('unavailable', 'http_' + response.status, 'Chiletrabajos returned HTTP ' + response.status)
      }
      const finalUrl = response.url || url
      assertRequestUrl(finalUrl, id)
      return { html: await readLimitedHtml(response, controller.signal), url: finalUrl }
    }
    throw new ChileTrabajosProviderError('parse_failed', 'redirect_limit', 'Chiletrabajos redirect limit was exceeded')
  }
  try {
    return await Promise.race([operation(), cancelled])
  } catch (error) {
    if (error instanceof ChileTrabajosProviderError) throw error
    if (controller.signal.aborted) throw new ChileTrabajosProviderError('unavailable', ctx.now() >= ctx.deadline ? 'budget_exhausted' : 'timeout', 'Chiletrabajos request timed out')
    throw new ChileTrabajosProviderError('unavailable', 'network_error', 'Chiletrabajos request failed')
  } finally {
    clearTimeout(timer)
    ctx.signal?.removeEventListener('abort', abortExternal)
    if (abortListener) controller.signal.removeEventListener('abort', abortListener)
  }
}

const CHILETRABAJOS_CITY_IDS: Record<string, string> = {
  arica: '1000', iquique: '1002', antofagasta: '1004', calama: '1006',
  copiapo: '1007', 'la serena': '1010', coquimbo: '1011', valparaiso: '1014',
  santiago: '1022', 'santiago de chile': '1022', rancagua: '1028',
  talca: '1031', curico: '1032', concepcion: '1035', chillan: '1036',
  temuco: '1039', valdivia: '1041', 'puerto montt': '1043', osorno: '1044',
  coyhaique: '1047', 'punta arenas': '1051',
}

export function buildChileTrabajosListingUrl(search = '', location = 'Santiago'): string {
  const normalizedLocation = location.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ')
  const countryWide = !normalizedLocation || ['chile', 'todo chile'].includes(normalizedLocation)
  const cityId = CHILETRABAJOS_CITY_IDS[normalizedLocation]
  if (!countryWide && !cityId) throw new ChileTrabajosProviderError('invalid_request', 'unsupported_location', 'Chiletrabajos search requires a supported city or Chile')
  // Verified against the provider's public search form on 2026-10-07.
  // "2" is the job query, "13" is a city ID, and "f" selects the search form.
  const params = new URLSearchParams()
  params.set('2', search.trim().slice(0, 100))
  if (cityId) params.set('13', cityId)
  params.set('f', '2')
  return 'https://www.chiletrabajos.cl/encuentra-un-empleo?' + params.toString()
}

async function discover(search: string, location: string, ctx: RequestContext): Promise<ChileTrabajosDiscoveryResult> {
  const response = await fetchHtml(buildChileTrabajosListingUrl(search, location), ctx)
  const ids = parseChileTrabajosListingHtml(response.html, response.url)
  return { source: 'chiletrabajos', fetchedAt: new Date(ctx.now()).toISOString(), listingUrl: response.url, ids }
}

async function probe(id: string, ctx: RequestContext): Promise<ChileTrabajosPublicJob> {
  if (!/^\d{5,10}$/.test(id)) throw new ChileTrabajosProviderError('invalid_request', 'invalid_id', 'Invalid Chiletrabajos job ID')
  const response = await fetchHtml('https://www.chiletrabajos.cl/trabajo/' + id, ctx, id)
  return parseChileTrabajosJobHtml(response.html, id, response.url, new Date(ctx.now()))
}

export async function probeChileTrabajosJob(id: string, options: ChileTrabajosRequestOptions = {}): Promise<ChileTrabajosPublicJob> {
  return probe(id, context(options))
}

export async function discoverChileTrabajosJobIds(
  search = '',
  location = 'Santiago',
  options: ChileTrabajosRequestOptions = {},
): Promise<ChileTrabajosDiscoveryResult> {
  return discover(search, location, context(options))
}

function relevantToSearch(job: ChileTrabajosPublicJob, search: string): boolean {
  const normalize = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const terms = normalize(search).split(/\s+/).filter(term => term.length >= 4 && !['gerente', 'manager', 'jefe', 'head'].includes(term))
  if (!terms.length) return true
  const haystack = normalize(job.title + ' ' + job.company)
  return terms.some(term => haystack.includes(term))
}

function batchOutcome(diagnostics: ChileTrabajosBatchDiagnostics): ChileTrabajosBatchDiagnostics['outcome'] {
  if (diagnostics.discovery_status === 'unavailable') return 'unavailable'
  if (diagnostics.discovery_status === 'parse_failed') return 'parse_failed'
  if (diagnostics.discovery_status === 'empty') return 'no_matches'
  const failures = diagnostics.parse_failed + diagnostics.unavailable
  if (diagnostics.active + diagnostics.stale > 0) {
    if (failures || diagnostics.budget_exhausted) return 'partial'
    return diagnostics.returned ? 'ok' : 'no_matches'
  }
  if (diagnostics.parse_failed > 0) return 'parse_failed'
  return 'unavailable'
}

export async function fetchChileTrabajosBatch(
  search = '',
  location = 'Santiago',
  limit = 12,
  options: ChileTrabajosBatchOptions = {},
): Promise<ChileTrabajosBatchResult> {
  const ctx = context(options)
  const target = bounded(limit, 12, 1, 20)
  const maxCandidates = bounded(options.maxCandidates, Math.max(target, 20), 1, 30)
  const diagnostics: ChileTrabajosBatchDiagnostics = {
    discovered: 0, probed: 0, active: 0, stale: 0, parse_failed: 0, unavailable: 0, irrelevant: 0, returned: 0,
    budget_exhausted: false, candidate_limit_reached: false, discovery_status: 'unavailable', outcome: 'unavailable',
  }
  const result: ChileTrabajosBatchResult = {
    source: 'chiletrabajos', fetchedAt: new Date(ctx.now()).toISOString(), listingUrl: 'https://www.chiletrabajos.cl/encuentra-un-empleo',
    jobs: [], verifiedJobs: [], failedJobs: [], diagnostics,
  }
  let discovered: ChileTrabajosDiscoveryResult
  try {
    // Exactly one discovery response supplies both the counters and the candidate IDs.
    result.listingUrl = buildChileTrabajosListingUrl(search, location)
    discovered = await discover(search, location, ctx)
    result.listingUrl = discovered.listingUrl
    diagnostics.discovered = discovered.ids.length
    diagnostics.discovery_status = discovered.ids.length ? 'ok' : 'empty'
  } catch (error) {
    const failure = error instanceof ChileTrabajosProviderError ? error : new ChileTrabajosProviderError('unavailable', 'network_error', 'Chiletrabajos request failed')
    diagnostics.discovery_status = failure.kind === 'parse_failed' ? 'parse_failed' : 'unavailable'
    diagnostics.failure_code = failure.code
    diagnostics.budget_exhausted = failure.code === 'budget_exhausted'
    diagnostics.outcome = batchOutcome(diagnostics)
    result.fetchedAt = new Date(ctx.now()).toISOString()
    return result
  }
  for (const id of discovered.ids.slice(0, maxCandidates)) {
    if (result.jobs.length >= target) break
    if (ctx.now() >= ctx.deadline || ctx.signal?.aborted) {
      diagnostics.budget_exhausted = true
      diagnostics.failure_code = ctx.signal?.aborted ? 'aborted' : 'budget_exhausted'
      break
    }
    diagnostics.probed++
    try {
      const job = await probe(id, ctx)
      result.verifiedJobs.push(job)
      if (job.verificationStatus === 'stale') diagnostics.stale++
      else if (job.verificationStatus !== 'verified_active') diagnostics.parse_failed++
      else {
        diagnostics.active++
        if (relevantToSearch(job, search)) result.jobs.push(job)
        else diagnostics.irrelevant++
      }
    } catch (error) {
      const failure = error instanceof ChileTrabajosProviderError ? error : new ChileTrabajosProviderError('unavailable', 'network_error', 'Chiletrabajos request failed')
      const parseFailed = failure.kind === 'parse_failed' || failure.kind === 'invalid_request'
      if (parseFailed) diagnostics.parse_failed++
      else diagnostics.unavailable++
      result.failedJobs.push({ sourceId: id, verificationStatus: parseFailed ? 'unknown' : 'unavailable' })
      diagnostics.failure_code = failure.code
      if (failure.code === 'budget_exhausted') diagnostics.budget_exhausted = true
      // Respect provider throttling and cancellation; do not retry the entire listing.
      if (['http_429', 'http_403', 'aborted', 'budget_exhausted'].includes(failure.code)) break
    }
  }
  diagnostics.returned = result.jobs.length
  diagnostics.candidate_limit_reached = result.jobs.length < target && diagnostics.probed >= maxCandidates && diagnostics.probed < diagnostics.discovered
  diagnostics.budget_exhausted ||= ctx.now() >= ctx.deadline
  diagnostics.outcome = batchOutcome(diagnostics)
  result.fetchedAt = new Date(ctx.now()).toISOString()
  return result
}

export async function fetchChileTrabajosOpportunities(
  search = '',
  location = 'Santiago',
  limit = 12,
  options: ChileTrabajosBatchOptions = {},
): Promise<ChileTrabajosPublicJob[]> {
  const result = await fetchChileTrabajosBatch(search, location, limit, options)
  if (result.diagnostics.outcome === 'unavailable' || result.diagnostics.outcome === 'parse_failed') {
    throw new ChileTrabajosProviderError(
      result.diagnostics.outcome,
      result.diagnostics.failure_code || result.diagnostics.outcome,
      'Chiletrabajos offers could not be verified',
    )
  }
  return result.jobs
}
