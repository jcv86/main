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

export function planOpportunityQueries(intent: CareerSearchIntent): string[] {
  const exact = [...new Set(intent.targetRoles.map(value => value.trim()).filter(Boolean))]
  if (intent.breadth === 'precise') return exact.slice(0, 8)
  const adjacent = exact.flatMap(role => {
    const normalized = ' ' + normalizeOpportunityText(role) + ' '
    return Object.entries(ADJACENT).flatMap(([key, values]) =>
      normalized.includes(' ' + key + ' ') ? values : []
    )
  })
  const exploratory = intent.breadth === 'exploratory' ? exact.flatMap(role => [
    role.replace(/\bsubgerente\b/ig, 'gerente'),
    role.replace(/\bjefe\b/ig, 'gerente'),
    role.replace(/\bgerente\b/ig, 'head'),
  ]) : []
  const seen = new Set<string>()
  return [...exact, ...adjacent, ...exploratory].filter(value => {
    const normalized = normalizeOpportunityText(value)
    if (!normalized || seen.has(normalized)) return false
    seen.add(normalized)
    return true
  }).slice(0, 32)
}
