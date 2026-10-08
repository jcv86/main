import type { CanonicalOpportunity } from '../types'
import { sourceRetryAfterUntil } from './retry-after'
import { isOpportunityPublished } from '../temporal-filter'
import { deriveOpportunityEvidence, readableOpportunityText, readableOpportunityTextResult } from '../opportunity-evidence'
import {
  addOpportunityReason, opportunityContentCoverage,
  type OpportunityReasonCode, type OpportunityReasonCounts, type OpportunityContentCoverage,
} from '../source-diagnostics'
export type { CanonicalOpportunity, OpportunityVerificationStatus } from '../types'

type JsonObject = Record<string, unknown>

function object(value: unknown): JsonObject {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as JsonObject : {}
}

function text(...values: unknown[]): string {
  for (const value of values) if (typeof value === 'string' && value.trim()) return value.trim()
  return ''
}

/** Public API expansions wrap resources as { data: { id, type, attributes } }. */
function resource(value: unknown): JsonObject {
  const wrapper = object(value)
  const data = object(wrapper.data ?? wrapper)
  return { ...data, ...object(data.attributes) }
}

function plainText(value: unknown): string {
  return readableOpportunityText(value)
}

function strings(value: unknown): string[] {
  const data = object(value).data ?? value
  if (typeof data === 'string') return [plainText(data)].filter(Boolean)
  if (!Array.isArray(data)) return []
  return data.slice(0, 100).map(item =>
    typeof item === 'string' ? plainText(item) : plainText(text(resource(item).name, resource(item).title)),
  ).filter(Boolean)
}

export function isGetOnBoardJobUrl(value: unknown, sourceId?: string): boolean {
  if (typeof value !== 'string') return false
  // Accept the current /jobs/<slug> and the older /jobs/<category>/<slug> forms.
  // An anchored source pattern excludes userinfo, ports, encoded path separators,
  // tracking parameters, fragments and unrelated HTTPS destinations.
  const match = value.match(/^https:\/\/(?:www\.)?getonbrd\.com\/jobs\/([a-z0-9][a-z0-9-]*)(?:\/([a-z0-9][a-z0-9-]*))?\/?$/i)
  if (!match) return false
  const slug = match[2] || match[1]
  return !sourceId || slug === sourceId
}

export function normalizeGetOnBoardPublishedAt(value: unknown): string | null {
  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value) || value < 0) return null
    // The public OpenAPI schema defines published_at as Unix seconds.
    const date = new Date(value * 1000)
    return Number.isFinite(date.getTime()) ? date.toISOString() : null
  }
  if (typeof value !== 'string') return null
  const raw = value.trim()
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:?\d{2}))?$/i.test(raw)) return null
  const [year, month, day] = raw.slice(0, 10).split('-').map(Number)
  const calendarDate = new Date(Date.UTC(year, month - 1, day))
  if (calendarDate.getUTCFullYear() !== year || calendarDate.getUTCMonth() !== month - 1 || calendarDate.getUTCDate() !== day) return null
  const date = new Date(raw)
  if (!Number.isFinite(date.getTime())) return null
  return raw.length === 10 ? raw : date.toISOString()
}

export function normalizeGetOnBoardWorkMode(
  modality: unknown,
  remote: unknown,
): CanonicalOpportunity['workMode'] {
  const mode = typeof modality === 'string' ? modality.trim().toLowerCase() : ''
  if (mode === 'hybrid') return 'hybrid'
  if (mode === 'no_remote') return remote === true ? null : 'onsite'
  if (mode === 'fully_remote' || mode === 'remote_local') return remote === false ? null : 'remote'
  // Temporary arrangements and undocumented values do not establish a stable mode.
  if (mode) return null
  return remote === true ? 'remote' : null
}

function geographicName(value: unknown): string {
  const name = plainText(value)
  return /^(?:remote|remoto|remota)$/i.test(name) ? '' : name
}

function geographicRelation(value: unknown, city = false): { names: string[]; unresolved: boolean } {
  const wrapper = object(value)
  const data = Object.prototype.hasOwnProperty.call(wrapper, 'data') ? wrapper.data : value
  if (data === null || data === undefined) return { names: [], unresolved: false }
  if (!Array.isArray(data)) return { names: [], unresolved: true }
  const entries = data.slice(0, 100).map(resource)
  const names = entries.map(entry => {
    const name = geographicName(entry.name)
    const country = city ? geographicName(entry.country) : ''
    return name ? [name, country].filter(Boolean).join(', ') : ''
  })
  return { names: names.filter(Boolean), unresolved: data.length > 100 || names.some(name => !name) }
}

export type GetOnBoardNormalization =
  | { kind: 'accepted'; job: CanonicalOpportunity }
  | { kind: 'rejected'; reason: OpportunityReasonCode }

export function normalizeGetOnBoardJobResult(input: unknown, verifiedAt = new Date().toISOString()): GetOnBoardNormalization {
  const root = object(input)
  const data = object(root.data ?? root)
  if (data.type && data.type !== 'job') return { kind: 'rejected', reason: 'resource_type' }
  const attrs = resource(data)
  const companyObj = resource(attrs.company)
  const links = object(attrs.links)
  const sourceId = text(data.id, attrs.id)
  const title = plainText(text(attrs.title, attrs.name))
  const company = plainText(text(companyObj.name, attrs.company_name, attrs.company))
  const originalUrl = text(links.public_url, links.public, links.web, attrs.url, attrs.public_url, attrs.web_url)
  if (!sourceId || !title) return { kind: 'rejected', reason: 'job_identity' }
  if (!company) return { kind: 'rejected', reason: 'company_missing' }
  if (!isGetOnBoardJobUrl(originalUrl, sourceId)) return { kind: 'rejected', reason: 'job_url' }

  const cities = geographicRelation(attrs.location_cities, true)
  const regions = geographicRelation(attrs.location_regions)
  const countriesExpanded = geographicRelation(attrs.location_tenants)
  const countries = strings(attrs.countries).map(geographicName).filter(Boolean)
  const declaredLocation = geographicName(text(attrs.location, attrs.location_name, attrs.location_text))
  const geographicNames = [...new Set([
    ...cities.names, ...regions.names, ...countriesExpanded.names,
    ...(!cities.names.length && !countriesExpanded.names.length ? countries : []),
  ])]
  const location = geographicNames.join(' · ') || declaredLocation || null
  if (text(attrs.remote_modality).toLowerCase() === 'remote_local' &&
    (!location || cities.unresolved || regions.unresolved || countriesExpanded.unresolved)) {
    // A local remote offer with opaque territorial restrictions must not become
    // an unrestricted remote recommendation. Never translate IDs into countries.
    return { kind: 'rejected', reason: 'remote_geography_unresolved' }
  }

  const descriptionParts = [
    attrs.description_headline, attrs.functions, attrs.description, attrs.desirable,
  ].map(readableOpportunityTextResult)
  if (descriptionParts.some(part => part.exceedsLimit)) return { kind: 'rejected', reason: 'description_too_large' }
  const description = [...new Set(descriptionParts.map(part => part.text).filter(Boolean))].join('\n\n')
  // Slicing can remove the end of a negation and manufacture a qualification.
  if (readableOpportunityTextResult(description).exceedsLimit) return { kind: 'rejected', reason: 'description_too_large' }
  const requirements = strings(attrs.requirements)
  const skills = [...new Set([
    ...strings(attrs.skills),
    ...strings(attrs.technologies),
    ...strings(attrs.required_skills),
    ...strings(attrs.tags),
  ])].slice(0, 100)
  const publishedAt = normalizeGetOnBoardPublishedAt(attrs.published_at ?? attrs.created_at)
  if (!isOpportunityPublished(publishedAt, new Date(verifiedAt))) return { kind: 'rejected', reason: 'scheduled' }
  const remoteRaw = attrs.remote ?? attrs.remote_allowed
  const remote = typeof remoteRaw === 'boolean' ? remoteRaw : null
  const declaredMode = normalizeGetOnBoardWorkMode(attrs.remote_modality, remote)
  const hasModeDeclaration = typeof attrs.remote_modality === 'string'
    ? Boolean(attrs.remote_modality.trim()) : attrs.remote_modality != null
  const unresolvedDeclaration = hasModeDeclaration && declaredMode === null
  const enriched = deriveOpportunityEvidence({
    description, requirements, skills,
    workMode: declaredMode,
  })
  // A temporary, unsupported or contradictory source field must remain unknown.
  const workMode = unresolvedDeclaration || (remote === false && enriched.workMode === 'remote')
    ? null : enriched.workMode

  return { kind: 'accepted', job: {
    source: 'getonboard',
    sourceId,
    title,
    company,
    location,
    remote: workMode === 'remote' ? true : workMode ? false : null,
    workMode,
    description,
    requirements: enriched.requirements,
    skills: enriched.skills,
    originalUrl,
    publishedAt,
    lastVerifiedAt: verifiedAt,
    verificationStatus: 'verified_active',
    raw: input,
  } }
}

/** Compatibility for callers that only need an accepted canonical vacancy. */
export function normalizeGetOnBoardJob(input: unknown, verifiedAt = new Date().toISOString()): CanonicalOpportunity | null {
  const result = normalizeGetOnBoardJobResult(input, verifiedAt)
  return result.kind === 'accepted' ? result.job : null
}

export interface GetOnBoardBatchDiagnostics {
  received: number
  considered: number
  normalized: number
  rejected: number
  returned: number
  outcome: 'ok' | 'partial' | 'no_matches' | 'parse_failed'
  failure_code?: string
  diagnostics_version?: 1
  not_considered?: number
  rejected_reasons?: OpportunityReasonCounts
  content_coverage?: OpportunityContentCoverage
}

export interface GetOnBoardBatchResult {
  source: 'getonboard'
  fetchedAt: string
  jobs: CanonicalOpportunity[]
  diagnostics: GetOnBoardBatchDiagnostics
}

export class GetOnBoardProviderError extends Error {
  constructor(
    public readonly kind: 'invalid_request' | 'parse_failed' | 'unavailable',
    public readonly code: string,
    public readonly retryAfterUntil?: string,
  ) {
    super(kind === 'invalid_request' ? 'Invalid Get on Board request' :
      kind === 'parse_failed' ? 'Get on Board response could not be normalized' :
        'Get on Board public jobs endpoint unavailable')
    this.name = 'GetOnBoardProviderError'
  }
}

export function normalizeGetOnBoardPayload(
  payload: unknown,
  verifiedAt = new Date().toISOString(),
): GetOnBoardBatchResult {
  const root = object(payload)
  const diagnostics: GetOnBoardBatchDiagnostics = {
    received: 0, considered: 0, normalized: 0, rejected: 0, returned: 0, outcome: 'parse_failed',
    diagnostics_version: 1, not_considered: 0, rejected_reasons: {}, content_coverage: opportunityContentCoverage([]),
  }
  const result: GetOnBoardBatchResult = { source: 'getonboard', fetchedAt: verifiedAt, jobs: [], diagnostics }
  if (!Array.isArray(root.data)) {
    diagnostics.failure_code = 'payload_shape'
    return result
  }
  diagnostics.received = root.data.length
  const rows = root.data.slice(0, 30)
  diagnostics.considered = rows.length
  diagnostics.not_considered = diagnostics.received - rows.length
  for (const row of rows) {
    const normalized = normalizeGetOnBoardJobResult(row, verifiedAt)
    if (normalized.kind === 'accepted') result.jobs.push(normalized.job)
    else addOpportunityReason(diagnostics.rejected_reasons!, normalized.reason)
  }
  diagnostics.normalized = result.jobs.length
  diagnostics.rejected = rows.length - result.jobs.length
  diagnostics.returned = result.jobs.length
  diagnostics.content_coverage = opportunityContentCoverage(result.jobs)
  diagnostics.outcome = rows.length === 0 ? 'no_matches' :
    result.jobs.length === 0 ? 'parse_failed' :
      diagnostics.rejected ? 'partial' : 'ok'
  if (diagnostics.outcome === 'parse_failed') diagnostics.failure_code = 'no_valid_jobs'
  return result
}

export interface GetOnBoardFetchOptions {
  signal?: AbortSignal
  timeoutMs?: number
  fetchImpl?: (url: string, init: RequestInit) => Promise<Response>
  now?: () => number
}

export function buildGetOnBoardJobsUrl(category = 'programming', page = 1): string {
  const safeCategory = category.trim().toLowerCase()
  if (!/^[a-z0-9-]{1,80}$/.test(safeCategory)) throw new GetOnBoardProviderError('invalid_request', 'invalid_category')
  if (!Number.isSafeInteger(page) || page < 1) throw new GetOnBoardProviderError('invalid_request', 'invalid_page')
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('per_page', '30')
  // These expansions were verified against the public category endpoint.
  for (const field of ['company', 'location_cities', 'tags', 'location_regions', 'location_tenants']) params.append('expand[]', field)
  return 'https://www.getonbrd.com/api/v0/categories/' + safeCategory + '/jobs?' + params
}

const GETONBOARD_MAX_RESPONSE_BYTES = 2 * 1024 * 1024

async function readGetOnBoardPayload(
  response: Response,
  signal: AbortSignal,
  ensureActive: () => void,
): Promise<unknown> {
  const declaredBytes = Number(response.headers.get('content-length') || 0)
  if (declaredBytes > GETONBOARD_MAX_RESPONSE_BYTES) {
    await response.body?.cancel()
    throw new GetOnBoardProviderError('parse_failed', 'payload_too_large')
  }
  if (!response.body) throw new GetOnBoardProviderError('parse_failed', 'invalid_json')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  const cancelReader = () => { void reader.cancel().catch(() => {}) }
  signal.addEventListener('abort', cancelReader, { once: true })
  let bytes = 0
  let json = ''
  try {
    for (;;) {
      ensureActive()
      const { done, value } = await reader.read()
      ensureActive()
      if (done) break
      bytes += value.byteLength
      if (bytes > GETONBOARD_MAX_RESPONSE_BYTES) {
        await reader.cancel()
        throw new GetOnBoardProviderError('parse_failed', 'payload_too_large')
      }
      json += decoder.decode(value, { stream: true })
    }
    json += decoder.decode()
    ensureActive()
    let payload: unknown
    try { payload = JSON.parse(json) } catch { throw new GetOnBoardProviderError('parse_failed', 'invalid_json') }
    ensureActive()
    return payload
  } finally {
    signal.removeEventListener('abort', cancelReader)
    reader.releaseLock()
  }
}

export async function fetchGetOnBoardBatch(
  category = 'programming',
  page = 1,
  options: GetOnBoardFetchOptions = {},
): Promise<GetOnBoardBatchResult> {
  const url = buildGetOnBoardJobsUrl(category, page)
  const controller = new AbortController()
  const timeoutMs = Math.max(1, Math.min(8000,
    Number.isFinite(options.timeoutMs) ? options.timeoutMs! : 6000))
  const deadline = Date.now() + timeoutMs
  const ensureActive = () => {
    if (controller.signal.aborted || Date.now() >= deadline) {
      controller.abort()
      throw new DOMException('Aborted', 'AbortError')
    }
  }
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  const abort = () => controller.abort()
  if (options.signal?.aborted) controller.abort()
  else options.signal?.addEventListener('abort', abort, { once: true })

  try {
    ensureActive()
    const response = await (options.fetchImpl ?? fetch)(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'DespegaTuCarrera/1.0' },
      cache: 'no-store',
      signal: controller.signal,
      redirect: 'error',
    })
    ensureActive()
    if (!response.ok) {
      const retryAfterUntil = sourceRetryAfterUntil(response.status, response.headers.get('retry-after'), (options.now ?? Date.now)())
      await response.body?.cancel()
      throw new GetOnBoardProviderError('unavailable', 'http_' + response.status, retryAfterUntil)
    }
    const payload = await readGetOnBoardPayload(response, controller.signal, ensureActive)
    ensureActive()
    const result = normalizeGetOnBoardPayload(payload, new Date((options.now ?? Date.now)()).toISOString())
    ensureActive()
    return result
  } catch (error) {
    if (error instanceof GetOnBoardProviderError ||
      (error instanceof Error && error.name === 'AbortError')) throw error
    if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError')
    throw new GetOnBoardProviderError('unavailable', 'network_error')
  } finally {
    clearTimeout(timeout)
    options.signal?.removeEventListener('abort', abort)
  }
}

/** Compatibility entry point for the scheduled catalog refresh and existing callers. */
export async function fetchGetOnBoardJobs(
  category = 'programming',
  page = 1,
  options: GetOnBoardFetchOptions = {},
): Promise<CanonicalOpportunity[]> {
  const batch = await fetchGetOnBoardBatch(category, page, options)
  if (batch.diagnostics.outcome === 'parse_failed') {
    throw new GetOnBoardProviderError('parse_failed', batch.diagnostics.failure_code || 'payload_shape')
  }
  return batch.jobs
}
