import { normalizeRoleSearchPhrase, planOpportunityRoleTerms, type CareerSearchIntent, type SearchBreadth } from './search-intent'
import { categorizeOpportunity, normalizeOpportunityText, resolveChileRegion, resolveOpportunityCategory, opportunityFunctionalCategories } from './taxonomy'
import { objectiveFromStoredFields } from './labor-objective'
import { validEmployerIndustry, type EmployerIndustryEvidence } from './employer-industry'

export type OpportunityWorkMode = 'onsite' | 'hybrid' | 'remote'

export interface MatchableOpportunity {
  title: string
  normalized_title?: string | null
  category_key?: string | null
  category_label?: string | null
  location?: string | null
  region?: string | null
  work_mode?: string | null
  company?: string
  industry_evidence?: EmployerIndustryEvidence | null
}

export type OpportunityMatchKind = 'all' | 'title' | 'equivalent' | 'related' | 'category' | 'expanded_category'
export interface OpportunityMatchReason {
  code: 'all_roles' | 'title_phrase' | 'reviewed_equivalent' | 'related_role'
    | 'selected_category' | 'expanded_category' | 'region' | 'work_mode' | 'work_mode_unreported'
    | 'functional_area' | 'industry' | 'industry_unconfirmed'
  label: string
}
export interface OpportunityMatch {
  kind: OpportunityMatchKind
  reasons: OpportunityMatchReason[]
  /** Ordinal search relevance, never a probability or candidate compatibility score. */
  rank: number
}

const MATCH_RANK: Record<OpportunityMatchKind, number> = {
  title: 0, equivalent: 1, related: 2, category: 3, expanded_category: 4, all: 5,
}
const MODE_LABELS: Record<OpportunityWorkMode, string> = {
  onsite: 'presencial', hybrid: 'híbrida', remote: 'remota',
}

export interface OpportunitySearchFilters {
  targetRoles?: readonly string[]
  breadth?: SearchBreadth
  locations?: readonly string[]
  workModes?: readonly string[]
  functionalAreas?: readonly string[]
  industries?: readonly string[]
  excludedIndustries?: readonly string[]
  unknownIndustryPolicy?: 'include' | 'exclude'
}

function cleanList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return [...new Set(value.filter((item): item is string => typeof item === 'string')
    .map(item => item.trim()).filter(Boolean))]
}

/** Accept the snake_case shape persisted by /api/a4/search-intents. */
export function searchFiltersFromStoredIntent(value: unknown): CareerSearchIntent {
  if (value === null || value === undefined) return objectiveFromStoredFields({ target_roles: [], functional_areas: [],
    objective_stage: 'exploring', breadth: 'related', locations: [], work_modes: [] })
  if (typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid stored search')
  return objectiveFromStoredFields(value as Record<string, unknown>)
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

function containsRole(title: string, role: string): boolean {
  const requested = normalizeRoleSearchPhrase(role)
  return Boolean(requested) && (' ' + normalizeRoleSearchPhrase(title) + ' ').includes(' ' + requested + ' ')
}

/**
 * One evaluation serves inclusion, result order and the explanation sent to the UI.
 * Location and work mode remain required even when the role search is broadened.
 * An explicit area selects that category; a precise title never selects its whole category.
 */
export function createOpportunityEvaluator(filters: OpportunitySearchFilters = {}) {
  const targetRoles = cleanList(filters.targetRoles)
  const locations = cleanList(filters.locations)
  const workModes = cleanList(filters.workModes)
  const functionalAreas = cleanList(filters.functionalAreas)
  const functionalAreaKeys = new Set(functionalAreas.map(area => resolveOpportunityCategory(area)?.key).filter(Boolean))
  const industries = cleanList(filters.industries).map(normalizeOpportunityText)
  const excludedIndustries = new Set(cleanList(filters.excludedIndustries).map(normalizeOpportunityText))
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
  const roleTerms = planOpportunityRoleTerms({ targetRoles: roleTitles, breadth })
  const exploratoryAreas = new Set(breadth === 'exploratory'
    ? roleTitles.map(title => categorizeOpportunity(title).key).filter(key => key !== 'other')
    : [])

  return (job: MatchableOpportunity): OpportunityMatch | null => {
    const constraintReasons: OpportunityMatchReason[] = []
    const categories = opportunityFunctionalCategories(String(job.title || job.normalized_title || ''))
    if (functionalAreas.length) {
      const area = categories.find(category => functionalAreaKeys.has(category.key))
      if (!area) return null
      constraintReasons.push({ code: 'functional_area', label: 'Función del cargo en el área elegida: ' + area.label })
    }
    if (industries.length || excludedIndustries.size) {
      const evidence = validEmployerIndustry(job.industry_evidence, job.company)
      if (!evidence) {
        if (filters.unknownIndustryPolicy !== 'include') return null
        constraintReasons.push({ code: 'industry_unconfirmed', label: 'Rubro por confirmar: elegiste incluir estas ofertas; no podemos comprobar aún tus preferencias de rubro.' })
      } else {
        const industry = normalizeOpportunityText(evidence.industry)
        if (excludedIndustries.has(industry) || (industries.length && !industries.includes(industry))) return null
        constraintReasons.push({ code: 'industry', label: 'Rubro de la empresa respaldado por su sitio: ' + evidence.industry })
      }
    }
    if (locations.length) {
      const region = typeof job.region === 'string' && job.region.trim()
        ? job.region : resolveChileRegion(job.location || '')
      if (!region || !selectedRegions.has(regionIdentity(region))) return null
      constraintReasons.push({ code: 'region', label: 'Región informada: ' + (resolveChileRegion(region) || region) })
    }
    const mode = normalizeOpportunityWorkMode(job.work_mode)
    if (workModes.length && !acceptsAnyMode) {
      if (!mode || !selectedModes.has(mode)) return null
      constraintReasons.push({ code: 'work_mode', label: 'Modalidad ' + MODE_LABELS[mode] + ' informada por la empresa' })
    } else if (!mode) {
      constraintReasons.push({ code: 'work_mode_unreported', label: 'Modalidad no identificada en esta ficha' })
    }
    const explain = (kind: OpportunityMatchKind, reason: OpportunityMatchReason): OpportunityMatch => ({
      kind, rank: MATCH_RANK[kind], reasons: [reason, ...constraintReasons],
    })
    if (!targetRoles.length) {
      return explain('all', { code: 'all_roles', label: functionalAreas.length ? 'Exploración de cargos dentro de las áreas elegidas' : 'Exploración de todos los cargos' })
    }
    const title = String(job.title || job.normalized_title || '')
    // Compiled terms are ordered direct > reviewed translation > related phrase.
    // A selected area cannot hide the more specific explanation of a matching title.
    const role = roleTerms.find(term => containsRole(title, term.term))
    if (role?.kind === 'title') {
      return explain('title', { code: 'title_phrase', label: 'Coincide con el cargo buscado: ' + role.requestedRole })
    }
    if (role?.kind === 'equivalent') {
      return explain('equivalent', { code: 'reviewed_equivalent', label: 'Cargo equivalente a ' + role.requestedRole + ': ' + role.term })
    }
    if (role) {
      return explain('related', { code: 'related_role', label: 'Cargo relacionado con ' + role.requestedRole + ': ' + role.term })
    }
    // Stored categories may come from an older classifier; derive from current source title.
    const category = categories.find(category => explicitAreas.has(category.key))
    if (category) {
      return explain('category', { code: 'selected_category', label: 'Pertenece al área que seleccionaste: ' + category.label })
    }
    const expanded = categories.find(category => exploratoryAreas.has(category.key))
    if (expanded) {
      return explain('expanded_category', { code: 'expanded_category', label: 'Aparece porque ampliaste la búsqueda al área: ' + expanded.label })
    }
    return null
  }
}

export function createOpportunityMatcher(filters: OpportunitySearchFilters = {}) {
  const evaluate = createOpportunityEvaluator(filters)
  return (job: MatchableOpportunity): boolean => evaluate(job) !== null
}

export function filterOpportunities<T extends MatchableOpportunity>(
  jobs: readonly T[],
  filters: OpportunitySearchFilters = {},
): T[] {
  return jobs.filter(createOpportunityMatcher(filters))
}

interface RankableOpportunity extends MatchableOpportunity {
  last_verified_at?: string | null
  source?: string
  source_id?: string
}

function verificationTime(job: RankableOpportunity): number {
  const value = typeof job.last_verified_at === 'string' ? Date.parse(job.last_verified_at) : NaN
  return Number.isFinite(value) ? value : -Infinity
}

function compareIdentity(left: string | undefined, right: string | undefined): number {
  const a = left || ''
  const b = right || ''
  return a < b ? -1 : a > b ? 1 : 0
}

/** Relevance precedes the existing verification/source/id order; input rows are never mutated. */
export function rankOpportunities<T extends RankableOpportunity>(
  jobs: readonly T[],
  filters: OpportunitySearchFilters = {},
): Array<T & { match: OpportunityMatch }> {
  const evaluate = createOpportunityEvaluator(filters)
  const matches = jobs.flatMap(job => {
    const match = evaluate(job)
    return match ? [{ ...job, match }] : []
  })
  return matches.sort((left, right) => {
    const relevance = left.match.rank - right.match.rank
    if (relevance) return relevance
    const a = verificationTime(left)
    const b = verificationTime(right)
    if (a !== b) return a > b ? -1 : 1
    return compareIdentity(left.source, right.source) || compareIdentity(left.source_id, right.source_id)
  })
}
