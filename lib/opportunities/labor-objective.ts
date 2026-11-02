import type { CareerSearchIntent, LocationPreference, ObjectiveStage, UnknownIndustryPolicy } from './search-intent'
import { normalizeOpportunityText, resolveOpportunityCategory } from './taxonomy'

export interface CompleteOpportunityFilters extends CareerSearchIntent {
  functionalAreas: string[]
  objectiveStage: ObjectiveStage
  industries: string[]
  excludedIndustries: string[]
  unknownIndustryPolicy: UnknownIndustryPolicy
  locationPreference: LocationPreference
}

export class LaborObjectiveError extends Error {}
const invalid = (message = 'Revisa los datos de tu objetivo laboral.'): never => { throw new LaborObjectiveError(message) }
export const OBJECTIVE_COLUMNS = 'id,name,target_roles,breadth,locations,work_modes,functional_areas,objective_stage,industries,excluded_industries,unknown_industry_policy,location_preference,seniority_min,salary_min_clp,employment_types,languages,is_primary,is_active,source,created_at,updated_at'

/** Do not silently truncate, coerce, or discard an invalid explicit preference. */
export function objectiveList(value: unknown, maximum: number, maxLength = 160): string[] {
  if (!Array.isArray(value) || value.length > maximum || value.some(item =>
    typeof item !== 'string' || !item.trim() || item.length > maxLength)) return invalid()
  return [...new Set((value as string[]).map(item => item.trim()))]
}

export function completeOpportunityFilters(value: CareerSearchIntent): CompleteOpportunityFilters {
  return {
    targetRoles: [...value.targetRoles], breadth: value.breadth,
    locations: [...value.locations], workModes: [...value.workModes],
    functionalAreas: [...(value.functionalAreas ?? [])],
    objectiveStage: value.objectiveStage ?? (value.targetRoles.length || value.functionalAreas?.length ? 'specific' : 'exploring'),
    industries: [...(value.industries ?? [])], excludedIndustries: [...(value.excludedIndustries ?? [])],
    unknownIndustryPolicy: value.unknownIndustryPolicy ?? 'exclude',
    locationPreference: value.locationPreference ?? (value.locations.length ? 'selected' : 'unspecified'),
  }
}

/** The same validated contract is used by the form, URL, writer and saved reader. */
export function parseLaborObjective(value: Record<string, unknown>, saving = false): CompleteOpportunityFilters {
  const targetRoles = objectiveList(value.targetRoles === undefined ? [] : value.targetRoles, 8, 200)
  const functionalAreas = objectiveList(value.functionalAreas === undefined ? [] : value.functionalAreas, 8).map(area => {
    const match = resolveOpportunityCategory(area)
    if (!match) return invalid('Elige un área funcional disponible.')
    return match.label
  })
  const locations = objectiveList(value.locations === undefined ? [] : value.locations, 6)
  const workModes = objectiveList(value.workModes === undefined ? [] : value.workModes, 4)
  if (workModes.some(mode => !['onsite', 'hybrid', 'remote', 'flexible'].includes(mode))) return invalid('Elige una modalidad válida.')
  const breadth = value.breadth === undefined ? 'related' : value.breadth
  const objectiveStage = value.objectiveStage === undefined ? (targetRoles.length || functionalAreas.length ? 'specific' : 'exploring') : value.objectiveStage
  const unknownIndustryPolicy = value.unknownIndustryPolicy === undefined ? 'exclude' : value.unknownIndustryPolicy
  const locationPreference = value.locationPreference === undefined ? (locations.length ? 'selected' : 'unspecified') : value.locationPreference
  if (!['precise', 'related', 'exploratory'].includes(String(breadth)) || typeof breadth !== 'string'
      || !['specific', 'exploring'].includes(String(objectiveStage)) || typeof objectiveStage !== 'string'
      || !['include', 'exclude'].includes(String(unknownIndustryPolicy)) || typeof unknownIndustryPolicy !== 'string'
      || !['unspecified', 'any', 'selected'].includes(String(locationPreference)) || typeof locationPreference !== 'string') return invalid()
  if ((locationPreference === 'selected') !== (locations.length > 0)) return invalid('Revisa las regiones elegidas para tu objetivo.')
  if (saving && objectiveStage === 'specific' && !targetRoles.length && !functionalAreas.length) return invalid('Agrega un cargo o un área, o elige «Todavía estoy explorando».')
  const industries = objectiveList(value.industries === undefined ? [] : value.industries, 8)
  const excludedIndustries = objectiveList(value.excludedIndustries === undefined ? [] : value.excludedIndustries, 8)
  const excluded = new Set(excludedIndustries.map(normalizeOpportunityText))
  if (industries.some(industry => excluded.has(normalizeOpportunityText(industry)))) return invalid('Un rubro no puede estar elegido y excluido al mismo tiempo.')
  return { targetRoles, functionalAreas: [...new Set(functionalAreas)], locations, workModes,
    breadth: breadth as CareerSearchIntent['breadth'], objectiveStage: objectiveStage as ObjectiveStage,
    industries, excludedIndustries, unknownIndustryPolicy: unknownIndustryPolicy as UnknownIndustryPolicy,
    locationPreference: locationPreference as LocationPreference }
}

/** Only exact legacy area labels are separated; ambiguous text remains a role. No write occurs. */
export function objectiveFromStoredFields(value: Record<string, unknown>): CompleteOpportunityFilters {
  const roles = objectiveList(value.target_roles, 8, 200)
  const legacyAreas = value.functional_areas === undefined || (Array.isArray(value.functional_areas) && value.functional_areas.length === 0)
  const separated = legacyAreas ? roles.map(resolveOpportunityCategory) : []
  return parseLaborObjective({
    targetRoles: legacyAreas ? roles.filter((_role, i) => !separated[i]) : roles,
    functionalAreas: legacyAreas ? separated.flatMap(area => area ? [area.label] : []) : value.functional_areas,
    breadth: value.breadth, locations: value.locations, workModes: value.work_modes,
    objectiveStage: value.objective_stage,
    industries: value.industries === undefined ? [] : value.industries,
    excludedIndustries: value.excluded_industries === undefined ? [] : value.excluded_industries,
    unknownIndustryPolicy: value.unknown_industry_policy,
    locationPreference: value.location_preference,
  }, true)
}

export function objectiveStorageValues(value: CompleteOpportunityFilters): Record<string, unknown> {
  return { target_roles: value.targetRoles, functional_areas: value.functionalAreas,
    breadth: value.breadth, locations: value.locations, work_modes: value.workModes,
    objective_stage: value.objectiveStage, industries: value.industries,
    excluded_industries: value.excludedIndustries, unknown_industry_policy: value.unknownIndustryPolicy,
    location_preference: value.locationPreference }
}

export function objectiveSummary(value: CareerSearchIntent): string[] {
  const filters = completeOpportunityFilters(value)
  const modes: Record<string, string> = { onsite: 'Presencial', hybrid: 'Híbrido', remote: 'Remoto', flexible: 'Modalidades informadas' }
  return [
    filters.objectiveStage === 'exploring' ? 'Estoy explorando' : 'Objetivo definido',
    ...filters.targetRoles.map(role => 'Cargo: ' + role),
    ...filters.functionalAreas.map(area => 'Área: ' + area),
    filters.locations.length ? filters.locations.join(', ') : filters.locationPreference === 'any' ? 'Todas las regiones' : 'Ubicación por definir',
    filters.workModes.length && !['onsite', 'hybrid', 'remote'].every(mode => filters.workModes.includes(mode))
      ? filters.workModes.map(mode => modes[mode] ?? mode).join(', ') : 'Cualquier modalidad',
    ...filters.industries.map(industry => 'Rubro: ' + industry),
    ...filters.excludedIndustries.map(industry => 'Evitar: ' + industry),
    ...(filters.industries.length || filters.excludedIndustries.length
      ? [filters.unknownIndustryPolicy === 'include' ? 'Incluye rubros por confirmar' : 'Sólo rubros confirmados'] : []),
  ]
}
