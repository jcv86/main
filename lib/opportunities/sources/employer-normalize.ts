import { deriveOpportunityEvidence, readableOpportunitySection, readableOpportunityText, readableOpportunityTextResult } from '../opportunity-evidence'
import type { CanonicalOpportunity } from '../types'
import { employerBoardKey, employerJobId, isEmployerJobUrl, type EmployerBoard } from './employer-registry'

type ObjectValue = Record<string, unknown>
export type EmployerNormalization =
  | { kind: 'accepted'; job: CanonicalOpportunity }
  | { kind: 'excluded'; reason: string }
  | { kind: 'rejected'; reason: string }

const MAX_TEXT = 40_000
const POOL_TITLE = /\b(?:future opportunit(?:y|ies)|future (?:roles|openings)|talent (?:pool|pipeline|community)|general application(?:s)?|open application|spontaneous application|expression of interest|futuras oportunidades|oportunidades futuras|(?:banco|base) de talentos|postulacion(?:es)? espontanea(?:s)?|candidatura espontanea)\b/

function object(value: unknown): ObjectValue {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as ObjectValue : {}
}

function folded(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim()
}

function string(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function plain(value: unknown): string {
  return readableOpportunityText(value)
}

function firstVisible(...values: unknown[]): string {
  for (const value of values) {
    const text = plain(value)
    if (text) return text
  }
  return ''
}

function isoDate(value: unknown): string | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)) return null
  const [year, month, day] = value.slice(0, 10).split('-').map(Number)
  const calendar = new Date(Date.UTC(year, month - 1, day))
  if (calendar.getUTCFullYear() !== year || calendar.getUTCMonth() !== month - 1 || calendar.getUTCDate() !== day) return null
  const date = new Date(value)
  return Number.isFinite(date.getTime()) ? date.toISOString() : null
}

function excludesChile(value: string): boolean {
  return /\b(?:except|excluding|excluded|not|no|sin|excepto|excluyendo|excluye|unavailable|ineligible)\b[^.;|\n]{0,100}\bchile\b/.test(folded(value))
}

function hasChileLocation(value: string): boolean {
  const location = folded(value)
  if (excludesChile(value)) return false
  if (/\bchile\b/.test(location)) return true
  return location.split(/[;/|·]/).some(part =>
    /^(?:cl|santiago|gran santiago|santiago de chile|(?:gran )?santiago,? region metropolitana(?: de santiago)?|region metropolitana de santiago)$/.test(part.trim()),
  )
}

function geography(board: EmployerBoard, row: ObjectValue): { location: string | null; eligible: boolean; malformed: boolean; country: string | null; names: string[] } {
  const names: string[] = []
  let malformed = false
  let country: string | null = null
  const add = (value: unknown) => {
    if (value === null || value === undefined || value === '') return
    if (typeof value !== 'string' || value.length > 500) { malformed = true; return }
    const cleaned = plain(value)
    if (cleaned) names.push(cleaned)
  }
  if (board.source === 'lever') {
    const categories = object(row.categories)
    if (row.categories !== undefined && Object.keys(categories).length === 0) malformed = true
    add(categories.location)
    if (categories.allLocations !== undefined) {
      if (!Array.isArray(categories.allLocations) || categories.allLocations.length > 50) malformed = true
      else categories.allLocations.forEach(add)
    }
    if (row.country !== undefined && row.country !== null) {
      if (typeof row.country !== 'string' || !/^[a-z]{2}$/i.test(row.country)) malformed = true
      else country = row.country.toUpperCase()
    }
  } else {
    const location = object(row.location)
    if (row.location !== null && row.location !== undefined && (typeof row.location !== 'object' || Array.isArray(row.location))) malformed = true
    add(location.name)
    if (row.offices !== undefined) {
      if (!Array.isArray(row.offices) || row.offices.length > 50) malformed = true
      else row.offices.forEach(value => {
        const office = object(value)
        if (Object.keys(office).length === 0) malformed = true
        add(office.location || office.name)
      })
    }
  }
  const unique = [...new Set(names)]
  const location = unique.join(' · ') || (country === 'CL' ? 'Chile' : null)
  if (location && location.length > 2_000) malformed = true
  return { location, eligible: !unique.some(excludesChile) && (country === 'CL' || unique.some(hasChileLocation)), malformed, country, names: unique }
}

/** Geography is proved only by the provider's location fields, never company boilerplate. */
export function normalizeEmployerJob(board: EmployerBoard, input: unknown, verifiedAt: string): EmployerNormalization {
  const row = object(input)
  const id = employerJobId(board.source, row.id)
  const title = plain(board.source === 'lever' ? row.text : row.title)
  if (!id || !title || title.length > 500) return { kind: 'rejected', reason: 'job_identity' }
  const sourceId = `${board.board}:${id}`
  const originalUrl = string(board.source === 'lever' ? row.hostedUrl : row.absolute_url)
  if (!isEmployerJobUrl(board.source, sourceId, originalUrl)) return { kind: 'rejected', reason: 'job_url' }
  if (board.source === 'greenhouse') {
    if (row.internal_job_id === null) return { kind: 'excluded', reason: 'prospect_post' }
    if (!employerJobId('greenhouse', row.internal_job_id)) return { kind: 'rejected', reason: 'internal_job_id' }
  }
  if (POOL_TITLE.test(folded(title))) return { kind: 'excluded', reason: 'talent_pool' }

  const publishedAt = board.source === 'greenhouse' ? isoDate(row.first_published) : null
  if (board.source === 'greenhouse' && row.first_published !== undefined && row.first_published !== null && row.first_published !== '') {
    if (!publishedAt) return { kind: 'rejected', reason: 'invalid_publication_date' }
    if (Date.parse(publishedAt) > Date.parse(verifiedAt)) return { kind: 'excluded', reason: 'scheduled' }
  }

  let expiresAt: string | null = null
  if (row.application_deadline !== undefined && row.application_deadline !== null && row.application_deadline !== '') {
    expiresAt = isoDate(row.application_deadline)
    if (!expiresAt) return { kind: 'rejected', reason: 'invalid_deadline' }
    if (Date.parse(expiresAt) <= Date.parse(verifiedAt)) return { kind: 'excluded', reason: 'expired' }
  }
  const geographic = geography(board, row)
  if (geographic.malformed) return { kind: 'rejected', reason: 'invalid_location' }
  if (!geographic.eligible) return { kind: 'excluded', reason: 'geography_unconfirmed' }
  const lists = Array.isArray(row.lists) ? row.lists.slice(0, 30).map(object) : []
  const listContents = lists.map(value => value.content)
  // List labels identify requirement/benefit boundaries; a label alone is not
  // a description. Preserve them so the same evidence can be read after saving.
  const listSections = lists.map(value => readableOpportunitySection(value.text, value.content)).filter(Boolean)
  const contentFields = board.source === 'lever'
    ? [row.descriptionPlain, row.description, row.openingPlain, row.opening, row.descriptionBodyPlain, row.descriptionBody, ...listContents, row.additionalPlain, row.additional]
    : [row.content]
  if (contentFields.some(value => readableOpportunityTextResult(value).exceedsLimit)) return { kind: 'rejected', reason: 'description_too_large' }
  // Lever documents both the combined description and its separate opening/body.
  // Prefer a non-empty combined value so the same sections are not duplicated.
  const combined = firstVisible(row.descriptionPlain, row.description)
  const parts = board.source === 'lever'
    ? [combined || [...new Set([firstVisible(row.openingPlain, row.opening), firstVisible(row.descriptionBodyPlain, row.descriptionBody)].filter(Boolean))].join('\n\n'),
      ...listSections, readableOpportunitySection('Información adicional', firstVisible(row.additionalPlain, row.additional))]
    : [plain(row.content)]
  const description = [...new Set(parts.filter(Boolean))].join('\n\n')
  if (!description || description.length > MAX_TEXT) return { kind: 'rejected', reason: description ? 'description_too_large' : 'missing_description' }
  const declaredWorkplace = row.workplaceType === 'remote' || row.workplaceType === 'hybrid' || row.workplaceType === 'on-site'
    ? row.workplaceType : null
  const derived = deriveOpportunityEvidence({
    description: board.source === 'greenhouse' ? row.content : description,
    workModeText: board.source === 'lever' ? declaredWorkplace : geographic.location,
  })
  const mode = derived.workMode
  const created = typeof row.createdAt === 'number' && Number.isSafeInteger(row.createdAt) && row.createdAt >= 0 && row.createdAt <= Date.parse(verifiedAt)
    ? new Date(row.createdAt).toISOString() : null
  return {
    kind: 'accepted',
    job: {
      source: board.source, sourceId, title, company: board.company,
      location: geographic.location, remote: mode === 'remote' ? true : mode ? false : null,
      workMode: mode, description, requirements: derived.requirements, skills: derived.skills, originalUrl,
      publishedAt,
      expiresAt, lastVerifiedAt: verifiedAt, verificationStatus: 'verified_active',
      raw: {
        schemaVersion: 1, board: board.board, boardKey: employerBoardKey(board),
        country: geographic.country, locations: geographic.names,
        sourceCreatedAt: created, sourceUpdatedAt: isoDate(row.updated_at),
        internalJobId: board.source === 'greenhouse' ? String(row.internal_job_id) : null,
      },
    },
  }
}
