import { planOpportunityQueries, type CareerSearchIntent, type SearchBreadth } from './search-intent'
import { categorizeOpportunity, normalizeOpportunityText, resolveChileRegion, resolveOpportunityCategory } from './taxonomy'

export type OpportunityWorkMode = 'onsite' | 'hybrid' | 'remote'

export interface MatchableOpportunity {
  title: string
  normalized_title?: string | null
  category_key?: string | null
  category_label?: string | null
  location?: string | null
  region?: string | null
  work_mode?: string | null
}

export interface OpportunitySearchFilters {
  targetRoles?: readonly string[]
  breadth?: SearchBreadth
  locations?: readonly string[]
  workModes?: readonly string[]
}

function cleanList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return [...new Set(value.filter((item): item is string => typeof item === 'string')
    .map(item => item.trim()).filter(Boolean))]
}

/** Accept the snake_case shape persisted by /api/a4/search-intents. */
export function searchFiltersFromStoredIntent(value: unknown): CareerSearchIntent {
  const input = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : {}
  const breadth = input.breadth === 'precise' || input.breadth === 'exploratory' ? input.breadth : 'related'
  return {
    targetRoles: cleanList(input.target_roles),
    breadth,
    locations: cleanList(input.locations),
    workModes: cleanList(input.work_modes),
  }
}

export function normalizeOpportunityWorkMode(value: unknown): OpportunityWorkMode | null {
  if (typeof value !== 'string') return null
  const normalized = normalizeOpportunityText(value)
  if (normalized === 'remote' || normalized === 'remoto') return 'remote'
  if (normalized === 'hybrid' || normalized === 'hibrido') return 'hybrid'
  if (normalized === 'onsite' || normalized === 'on site' || normalized === 'presencial') return 'onsite'
  return null
}

function regionIdentity(value: string): string {
  return normalizeOpportunityText(resolveChileRegion(value) || value)
}

function phrase(value: string): string {
  return normalizeOpportunityText(value).replace(/[^a-z0-9+# ]/g, ' ').replace(/\s+/g, ' ').trim()
}

function containsRole(title: string, role: string): boolean {
  const requested = phrase(role)
  return Boolean(requested) && (' ' + phrase(title) + ' ').includes(' ' + requested + ' ')
}

/**
 * One predicate serves results, catalog filters and any subsequent selection.
 * Location and work mode remain required even when the role search is broadened.
 * An explicit area selects that category; a precise title never selects its whole category.
 */
export function createOpportunityMatcher(filters: OpportunitySearchFilters = {}) {
  const targetRoles = cleanList(filters.targetRoles)
  const locations = cleanList(filters.locations)
  const workModes = cleanList(filters.workModes)
  const breadth = filters.breadth || 'related'
  const selectedRegions = new Set(locations.map(regionIdentity))
  // The previous form encoded "Cualquier modalidad" as all three values; preserve that intent.
  const acceptsAnyMode = ['onsite', 'hybrid', 'remote'].every(known =>
    workModes.some(mode => normalizeOpportunityWorkMode(mode) === known)
  )
  const selectedModes = new Set<OpportunityWorkMode>()
  for (const mode of workModes) {
    // Legacy "flexible" opens the three known modes. It does not confirm missing metadata.
    if (normalizeOpportunityText(mode) === 'flexible') {
      for (const known of ['onsite', 'hybrid', 'remote'] as const) selectedModes.add(known)
    } else {
      const known = normalizeOpportunityWorkMode(mode)
      if (known) selectedModes.add(known)
    }
  }

  const explicitAreas = new Set<string>()
  const roleTitles: string[] = []
  for (const target of targetRoles) {
    const area = resolveOpportunityCategory(target)
    if (area) explicitAreas.add(area.key)
    else roleTitles.push(target)
  }
  const roleTerms = planOpportunityQueries({
    targetRoles: roleTitles, breadth, locations: [], workModes: [],
  })
  const exploratoryAreas = new Set(breadth === 'exploratory'
    ? roleTitles.map(title => categorizeOpportunity(title).key).filter(key => key !== 'other')
    : [])

  return (job: MatchableOpportunity): boolean => {
    if (locations.length) {
      const region = typeof job.region === 'string' && job.region.trim()
        ? job.region : resolveChileRegion(job.location || '')
      if (!region || !selectedRegions.has(regionIdentity(region))) return false
    }
    if (workModes.length && !acceptsAnyMode) {
      const mode = normalizeOpportunityWorkMode(job.work_mode)
      if (!mode || !selectedModes.has(mode)) return false
    }
    if (!targetRoles.length) return true
    const title = String(job.title || job.normalized_title || '')
    // Stored categories may come from an older classifier; derive from current source title.
    const category = categorizeOpportunity(title).key
    return explicitAreas.has(category) || exploratoryAreas.has(category)
      || roleTerms.some(term => containsRole(title, term))
  }
}

export function filterOpportunities<T extends MatchableOpportunity>(
  jobs: readonly T[],
  filters: OpportunitySearchFilters = {},
): T[] {
  return jobs.filter(createOpportunityMatcher(filters))
}
