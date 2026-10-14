import { copyOpportunityFilters, type OpportunityFilters } from './search-query'

export interface PrimarySearchRevision { id: string; updatedAt: string }
export interface SavedPrimarySearch {
  revision: PrimarySearchRevision
  name: string
  filters: OpportunityFilters
  industries: string[]
  excludedIndustries: string[]
}
export class SavedSearchError extends Error {}
const record = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value)
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const timestamp = (value: unknown): value is string => typeof value === 'string' && value.length <= 64 && /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value))
const invalid = (): never => { throw new SavedSearchError('No pudimos verificar tu búsqueda guardada. Vuelve a cargarla antes de reemplazarla.') }
function list(value: unknown, max: number, maxLength = 200): string[] {
  if (!Array.isArray(value) || value.length > max || value.some(item => typeof item !== 'string' || !item.trim() || item.length > maxLength)) return invalid()
  return [...new Set((value as string[]).map(item => item.trim()))]
}

/** A missing response is not an empty search. Never infer preferences from a CV or location. */
export function emptySearchFilters(): OpportunityFilters {
  return { targetRoles: [], breadth: 'related', locations: [], workModes: [] }
}

export function parsePrimarySearchRevision(value: unknown): PrimarySearchRevision | null {
  if (value === null) return null
  if (!record(value) || Object.keys(value).some(key => !['id', 'updatedAt'].includes(key))
      || typeof value.id !== 'string' || !uuid.test(value.id) || !timestamp(value.updatedAt)) return invalid()
  return { id: value.id, updatedAt: value.updatedAt }
}

export function parseSavedPrimarySearch(value: unknown): SavedPrimarySearch {
  if (!record(value) || value.is_primary !== true || value.is_active !== true
      || typeof value.breadth !== 'string' || !['precise', 'related', 'exploratory'].includes(value.breadth)) return invalid()
  const revision = parsePrimarySearchRevision({ id: value.id, updatedAt: value.updated_at })
  if (!revision) return invalid()
  const targetRoles = list(value.target_roles, 8)
  const locations = list(value.locations, 6, 160)
  const workModes = list(value.work_modes, 4, 160)
  if (!targetRoles.length || workModes.some(mode => !['onsite', 'hybrid', 'remote', 'flexible'].includes(mode))) return invalid()
  return {
    revision,
    name: typeof value.name === 'string' && value.name.trim() ? value.name.trim().slice(0, 80) : 'Mi búsqueda principal',
    filters: { targetRoles, locations, workModes, breadth: value.breadth as OpportunityFilters['breadth'] },
    industries: list(value.industries === undefined ? [] : value.industries, 8, 160),
    excludedIndustries: list(value.excluded_industries === undefined ? [] : value.excluded_industries, 8, 160),
  }
}

export function primarySearchFromResponse(value: unknown): SavedPrimarySearch | null {
  if (!record(value) || !Array.isArray(value.intents) || value.intents.length > 100) return invalid()
  if (value.intents.some(item => !record(item) || typeof item.is_primary !== 'boolean' || item.is_active !== true)) return invalid()
  const primary = value.intents.filter(item => item.is_primary === true)
  if (primary.length > 1) return invalid()
  return primary.length ? parseSavedPrimarySearch(primary[0]) : null
}

/** Compare sets, not response ordering; no fields may silently disappear on confirmation. */
export function sameSearchFilters(left: OpportunityFilters, right: OpportunityFilters): boolean {
  const canonical = (value: OpportunityFilters) => JSON.stringify({ breadth: value.breadth,
    targetRoles: [...new Set(value.targetRoles.map(item => item.trim()))].sort(),
    locations: [...new Set(value.locations.map(item => item.trim()))].sort(),
    workModes: [...new Set(value.workModes)].sort() })
  return canonical(left) === canonical(right)
}
export function confirmedSavedSearch(value: unknown, requested: OpportunityFilters): SavedPrimarySearch {
  if (!record(value)) return invalid()
  const search = parseSavedPrimarySearch(value.intent)
  if (!sameSearchFilters(search.filters, requested)) return invalid()
  return { ...search, filters: copyOpportunityFilters(search.filters) }
}
