import { normalizeOpportunityText } from './taxonomy'

export type SearchBreadth = 'precise' | 'related' | 'exploratory'
export interface CareerSearchIntent {
  targetRoles: string[]
  breadth: SearchBreadth
  locations: string[]
  workModes: string[]
}

const ADJACENT: Record<string, string[]> = {
  riesgo: ['crédito', 'risk manager', 'credit manager', 'control de riesgo'],
  credito: ['riesgo', 'credit manager', 'riesgo crediticio'],
  operaciones: ['operations manager', 'jefe de operaciones', 'excelencia operacional'],
  finanzas: ['finance manager', 'planificación financiera', 'fp&a', 'control de gestión'],
  producto: ['product manager', 'product owner', 'product lead'],
  contador: ['contadora', 'contador auditor', 'analista contable'],
  contadora: ['contador', 'contador auditor', 'analista contable'],
}

/**
 * Reviewed occupational translations, not similarity scores. Distinct professions
 * (data analyst / data scientist, account executive / account manager) stay apart.
 * A requested qualifier is retained when a phrase is translated: "senior" never
 * disappears and "analista de datos clínicos" does not become any data analyst.
 */
const EQUIVALENT_ROLES: readonly (readonly string[])[] = [
  ['Analista de datos', 'Analista datos', 'Data Analyst'],
  ['Ingeniero de datos', 'Ingeniera de datos', 'Data Engineer'],
  ['Científico de datos', 'Científica de datos', 'Data Scientist'],
  ['Ingeniero de software', 'Ingeniera de software', 'Software Engineer'],
  ['Desarrollador de software', 'Desarrolladora de software', 'Software Developer'],
  ['Desarrollador backend', 'Desarrolladora backend', 'Backend Developer', 'Back End Developer'],
  ['Desarrollador frontend', 'Desarrolladora frontend', 'Frontend Developer', 'Front End Developer'],
  ['Desarrollador full stack', 'Desarrolladora full stack', 'Full Stack Developer'],
  ['Diseñador UX', 'Diseñadora UX', 'UX Designer'],
  ['Gerente de producto', 'Product Manager'],
  ['Gestor de proyectos', 'Gestora de proyectos', 'Project Manager'],
  ['Gerente de riesgo', 'Gerente de riesgos', 'Risk Manager'],
  ['Gerente de crédito', 'Credit Manager'],
  ['Gerente de operaciones', 'Operations Manager'],
  ['Analista financiero', 'Analista financiera', 'Financial Analyst'],
  ['Analista contable', 'Accounting Analyst'],
  ['Contador', 'Contadora', 'Accountant'],
  ['Analista de recursos humanos', 'Human Resources Analyst'],
  ['Reclutador', 'Reclutadora', 'Recruiter'],
  ['Ejecutivo de ventas', 'Ejecutiva de ventas', 'Sales Executive'],
  ['Ejecutivo de cuentas', 'Ejecutiva de cuentas', 'Account Executive'],
  ['Representante de servicio al cliente', 'Customer Service Representative'],
]

export interface OpportunityRoleTerm {
  term: string
  requestedRole: string
  kind: 'title' | 'equivalent' | 'related'
}

export function normalizeRoleSearchPhrase(value: string): string {
  return normalizeOpportunityText(value).replace(/[^a-z0-9+# ]/g, ' ').replace(/\s+/g, ' ').trim()
}

function equivalentTerms(role: string): string[] {
  const normalized = normalizeRoleSearchPhrase(role)
  const padded = ' ' + normalized + ' '
  return EQUIVALENT_ROLES.flatMap(group => group.flatMap(alias => {
    const phrase = normalizeRoleSearchPhrase(alias)
    if (!padded.includes(' ' + phrase + ' ')) return []
    const [before, after] = padded.split(' ' + phrase + ' ')
    // These reviewed level words can move around an ES/EN occupational phrase,
    // but remain mandatory. Other modifiers keep their exact position and text.
    const qualifier = !before.trim() && /^(senior|junior)$/.test(after.trim()) ? after.trim()
      : !after.trim() && /^(senior|junior)$/.test(before.trim()) ? before.trim() : null
    return group.filter(value => normalizeRoleSearchPhrase(value) !== phrase).flatMap(value => {
      if (normalized === phrase) return [value]
      const translated = padded.replace(' ' + phrase + ' ', ' ' + normalizeRoleSearchPhrase(value) + ' ').trim()
      return qualifier ? [translated, qualifier + ' ' + value, value + ' ' + qualifier] : [translated]
    })
  }))
}

/** Compile once so inclusion and its explanation consume exactly the same terms. */
export function planOpportunityRoleTerms(intent: Pick<CareerSearchIntent, 'targetRoles' | 'breadth'>): OpportunityRoleTerm[] {
  const seen = new Set<string>()
  const exact = intent.targetRoles.map(value => value.trim()).filter(value => {
    const normalized = normalizeRoleSearchPhrase(value)
    if (!normalized || seen.has(normalized)) return false
    seen.add(normalized)
    return true
  }).slice(0, 8)
  const direct: OpportunityRoleTerm[] = exact.map(role => ({ term: role, requestedRole: role, kind: 'title' }))
  if (intent.breadth === 'precise') return direct
  const equivalent: OpportunityRoleTerm[] = exact.flatMap(role => equivalentTerms(role).map(term => ({
    term, requestedRole: role, kind: 'equivalent' as const,
  })))
  const adjacent: OpportunityRoleTerm[] = exact.flatMap(role => {
    const normalized = ' ' + normalizeRoleSearchPhrase(role) + ' '
    return Object.entries(ADJACENT).flatMap(([key, values]) =>
      normalized.includes(' ' + key + ' ') ? values.map(term => ({
        term, requestedRole: role, kind: 'related' as const,
      })) : []
    )
  })
  const exploratory: OpportunityRoleTerm[] = intent.breadth === 'exploratory' ? exact.flatMap(role => [
    role.replace(/\bsubgerente\b/ig, 'gerente'),
    role.replace(/\bjefe\b/ig, 'gerente'),
    role.replace(/\bgerente\b/ig, 'head'),
  ].map(term => ({ term, requestedRole: role, kind: 'related' as const }))) : []
  const seenTerms = new Set<string>()
  return [...direct, ...equivalent, ...adjacent, ...exploratory].filter(value => {
    const key = normalizeRoleSearchPhrase(value.term)
    if (!key || seenTerms.has(key)) return false
    seenTerms.add(key)
    return true
  })
}

/** Existing external-query budget remains bounded; the index evaluator keeps all compiled terms. */
export function planOpportunityQueries(intent: CareerSearchIntent): string[] {
  return planOpportunityRoleTerms(intent).map(value => value.term).slice(0, intent.breadth === 'precise' ? 8 : 32)
}
