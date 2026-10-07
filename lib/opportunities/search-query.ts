import type { CareerSearchIntent, SearchBreadth } from './search-intent'

export type OpportunityView = 'explore' | 'saved'
export type OpportunityFilters = CareerSearchIntent
export const OPPORTUNITY_PAGE_SIZE = 18

export class OpportunityQueryError extends Error {}

export function copyOpportunityFilters(value: OpportunityFilters): OpportunityFilters {
  return { targetRoles: [...value.targetRoles], breadth: value.breadth, locations: [...value.locations], workModes: [...value.workModes] }
}

export function opportunityFilterParams(filters: OpportunityFilters): URLSearchParams {
  const params = new URLSearchParams()
  filters.targetRoles.forEach(value => params.append('role', value))
  filters.locations.forEach(value => params.append('region', value))
  filters.workModes.forEach(value => params.append('mode', value))
  params.set('breadth', filters.breadth)
  return params
}

/** Strict request bounds prevent an invalid filter from silently widening a search. */
export function parseOpportunityQuery(url: URL, defaultView: OpportunityView = 'saved') {
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
  const workModes = list('mode', 3)
  if (workModes.some(mode => !['onsite', 'hybrid', 'remote'].includes(mode))) {
    throw new OpportunityQueryError('Elige una modalidad válida.')
  }
  return {
    view: view as OpportunityView,
    filters: { targetRoles: list('role', 8), locations: list('region', 6), workModes, breadth: breadth as SearchBreadth },
    offset: Number(offsetText), snapshot,
  }
}
