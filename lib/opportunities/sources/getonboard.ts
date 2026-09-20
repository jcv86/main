export type OpportunityVerificationStatus =
  | 'verified_active'
  | 'verified_restricted'
  | 'stale'
  | 'unavailable'
  | 'unknown'

export interface CanonicalOpportunity {
  source: 'getonboard'
  sourceId: string
  title: string
  company: string
  location: string | null
  remote: boolean | null
  description: string
  requirements: string[]
  skills: string[]
  originalUrl: string
  publishedAt: string | null
  lastVerifiedAt: string
  verificationStatus: OpportunityVerificationStatus
  raw: unknown
}

type JsonObject = Record<string, unknown>

function object(value: unknown): JsonObject {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as JsonObject : {}
}

function text(...values: unknown[]): string {
  for (const value of values) if (typeof value === 'string' && value.trim()) return value.trim()
  return ''
}

function strings(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => typeof item === 'string' ? item.trim() : text(object(item).name, object(item).title)).filter(Boolean)
}

export function normalizeGetOnBoardJob(input: unknown, verifiedAt = new Date().toISOString()): CanonicalOpportunity | null {
  const root = object(input)
  const data = object(root.data ?? root)
  const attrs = object(data.attributes ?? data)
  const companyObj = object(attrs.company)
  const links = object(attrs.links)
  const sourceId = text(data.id, attrs.id)
  const title = text(attrs.title, attrs.name)
  const company = text(companyObj.name, attrs.company_name, attrs.company)
  const originalUrl = text(attrs.url, attrs.public_url, attrs.web_url, links.public, links.web)
  if (!sourceId || !title || !company || !/^https:\/\//i.test(originalUrl)) return null

  const location = text(attrs.location, attrs.location_name, attrs.location_text) || null
  const description = text(attrs.description, attrs.description_headline, attrs.functions)
  const requirements = strings(attrs.requirements)
  const skills = [...new Set([
    ...strings(attrs.skills),
    ...strings(attrs.technologies),
    ...strings(attrs.required_skills),
  ])]
  const publishedAt = text(attrs.published_at, attrs.created_at) || null
  const remoteRaw = attrs.remote ?? attrs.remote_allowed
  const remote = typeof remoteRaw === 'boolean' ? remoteRaw : null

  return {
    source: 'getonboard',
    sourceId,
    title,
    company,
    location,
    remote,
    description,
    requirements,
    skills,
    originalUrl,
    publishedAt,
    lastVerifiedAt: verifiedAt,
    verificationStatus: 'verified_active',
    raw: input,
  }
}

export async function fetchGetOnBoardJobs(query = '', page = 1): Promise<CanonicalOpportunity[]> {
  const params = new URLSearchParams()
  if (query.trim()) params.set('query', query.trim())
  params.set('page', String(Math.max(1, page)))
  const candidates = [
    `https://www.getonbrd.com/api/v0/search/jobs?${params}`,
    `https://www.getonbrd.com/api/v0/jobs/search?${params}`,
  ]
  let lastError = ''
  for (const url of candidates) {
    try {
      const response = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': 'DespegaTuCarrera/1.0' }, cache: 'no-store' })
      if (!response.ok) {
        lastError = `${response.status} ${response.statusText}`
        continue
      }
      const payload = await response.json()
      const root = object(payload)
      const rows = Array.isArray(root.data) ? root.data : Array.isArray(payload) ? payload : []
      const verifiedAt = new Date().toISOString()
      return rows.map((row) => normalizeGetOnBoardJob(row, verifiedAt)).filter((row): row is CanonicalOpportunity => row !== null)
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'unknown error'
    }
  }
  throw new Error(`Get on Board public jobs endpoint unavailable: ${lastError}`)
}
