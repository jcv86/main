import type { CareerSearchIntent, SearchBreadth } from './search-intent'
import { completeOpportunityFilters, parseLaborObjective, LaborObjectiveError } from './labor-objective'

export type OpportunityView = 'explore' | 'saved'
export type OpportunityFilters = CareerSearchIntent
export const OPPORTUNITY_PAGE_SIZE = 18

export class OpportunityQueryError extends Error {}

export function copyOpportunityFilters(value: OpportunityFilters): OpportunityFilters {
  return completeOpportunityFilters(value)
}

export function opportunityFilterParams(filters: OpportunityFilters): URLSearchParams {
  filters = completeOpportunityFilters(filters)
  const params = new URLSearchParams()
  filters.targetRoles.forEach(value => params.append('role', value))
  filters.locations.forEach(value => params.append('region', value))
  filters.workModes.forEach(value => params.append('mode', value))
  filters.functionalAreas?.forEach(value => params.append('area', value))
  filters.industries?.forEach(value => params.append('industry', value))
  filters.excludedIndustries?.forEach(value => params.append('excludeIndustry', value))
  params.set('breadth', filters.breadth)
  params.set('stage', filters.objectiveStage!)
  params.set('unknownIndustry', filters.unknownIndustryPolicy!)
  params.set('locationPreference', filters.locationPreference!)
  return params
}

/** Strict request bounds prevent an invalid filter from silently widening a search. */
export function parseOpportunityQuery(url: URL, defaultView: OpportunityView = 'saved') {
  const allowed = new Set(['view', 'role', 'area', 'industry', 'excludeIndustry', 'region', 'mode', 'breadth', 'stage', 'unknownIndustry', 'locationPreference', 'offset', 'snapshot'])
  if ([...url.searchParams.keys()].some(key => !allowed.has(key))) throw new OpportunityQueryError('Hay un filtro no reconocido. Revisa tu búsqueda.')
  const list = (key: string, maximum: number) => {
    const raw = url.searchParams.getAll(key)
    if (raw.length > maximum || raw.some(value => !value.trim() || value.length > 200)) {
      throw new OpportunityQueryError('Revisa los filtros de la búsqueda.')
    }
    return [...new Set(raw.map(value => value.trim()))]
  }
  const one = (key: string, fallback: string) => {
    const values = url.searchParams.getAll(key)
    if (values.length > 1) throw new OpportunityQueryError('Revisa los filtros de la búsqueda.')
    return values[0] ?? fallback
  }
  const view = one('view', defaultView)
  const breadth = one('breadth', 'related')
  const offsetText = one('offset', '0')
  const snapshot = one('snapshot', '')
  if (!['explore', 'saved'].includes(view) || !['precise', 'related', 'exploratory'].includes(breadth)
      || !/^(0|[1-9]\d{0,2})$/.test(offsetText) || Number(offsetText) > 500
      || Number(offsetText) % OPPORTUNITY_PAGE_SIZE !== 0
      || (snapshot && !/^[a-f0-9]{64}$/.test(snapshot))
      || (Number(offsetText) > 0 && !snapshot)) {
    throw new OpportunityQueryError('Revisa los filtros o vuelve a la primera página.')
  }
  const workModes = list('mode', 4)
  if (workModes.some(mode => !['onsite', 'hybrid', 'remote', 'flexible'].includes(mode))) {
    throw new OpportunityQueryError('Elige una modalidad válida.')
  }
  const targetRoles = list('role', 8)
  const functionalAreas = list('area', 8)
  const locations = list('region', 6)
  let filters: OpportunityFilters
  try {
    filters = parseLaborObjective({ targetRoles, functionalAreas, locations, workModes, breadth: breadth as SearchBreadth,
      objectiveStage: one('stage', targetRoles.length || functionalAreas.length ? 'specific' : 'exploring'),
      industries: list('industry', 8), excludedIndustries: list('excludeIndustry', 8),
      unknownIndustryPolicy: one('unknownIndustry', 'exclude'),
      locationPreference: one('locationPreference', locations.length ? 'selected' : 'unspecified') })
  } catch (error) {
    if (error instanceof LaborObjectiveError) throw new OpportunityQueryError(error.message)
    throw error
  }
  return {
    view: view as OpportunityView,
    filters,
    offset: Number(offsetText), snapshot,
  }
}
