import { DISC_TEST_QUESTIONS } from '@/lib/disc-test-questions'
import { DESPEGA_PROFILES } from '@/lib/despega-profiles'

export type A1DiscDimension = 'D' | 'I' | 'S' | 'C'

export interface A1ProfessionalReportInput {
  rawScores: Partial<Record<A1DiscDimension, unknown>>
  dominantPattern?: unknown
  secondaryPattern?: unknown
  completedAt?: string | null
  c1Responses?: Record<string, unknown>
  c2Responses?: Record<string, unknown>
}

export interface A1ProfessionalReport {
  assessmentDate: string | null
  primary: A1DiscDimension
  secondary: A1DiscDimension
  combinationName: string
  rawScores: Record<A1DiscDimension, number>
  intensities: Record<A1DiscDimension, number>
  answeredContextItems: number
  dimensions: Array<{
    key: A1DiscDimension
    name: string
    professionalName: string
    score: number
    rawScore: number
    strength: string
    development: string
    color: string
  }>
  strengths: string[]
  tensions: string[]
  context: {
    currentSituation: string
    experience: string
    currentChallenge: string
    objective90Days: string
    sector: string
    targetRole: string
    targetSkills: string[]
    availableTime: string
    learningPreferences: string[]
    barriers: string[]
    planStyle: string
  }
}

const DIMENSIONS: A1DiscDimension[] = ['D', 'I', 'S', 'C']
const COMBINATIONS: Record<string, string> = {
  'D-I': 'Impulsor Catalítico',
  'D-S': 'Impulsor Estable',
  'D-C': 'Estratega Ejecutivo',
  'I-D': 'Catalizador Decisivo',
  'I-S': 'Facilitador Influyente',
  'I-C': 'Comunicador Estratégico',
  'S-D': 'Gestor Resuelto',
  'S-I': 'Conector Confiable',
  'S-C': 'Constructor Metódico',
  'C-D': 'Arquitecto Ejecutivo',
  'C-I': 'Analista Persuasivo',
  'C-S': 'Arquitecto Estable',
}

function isDimension(value: unknown): value is A1DiscDimension {
  return typeof value === 'string' && DIMENSIONS.includes(value.toUpperCase() as A1DiscDimension)
}

function safeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function stringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(safeText).filter(Boolean)
  const text = safeText(value)
  return text ? [text] : []
}

function numericScore(value: unknown): number {
  const score = Number(value)
  const limit = DISC_TEST_QUESTIONS.length
  return Number.isFinite(score) ? Math.max(-limit, Math.min(limit, score)) : 0
}

export function discNetScoreToIntensity(score: number): number {
  const limit = DISC_TEST_QUESTIONS.length
  return Math.round(((Math.max(-limit, Math.min(limit, score)) + limit) / (limit * 2)) * 100)
}

export function buildA1ProfessionalReport(input: A1ProfessionalReportInput): A1ProfessionalReport {
  const rawScores = Object.fromEntries(
    DIMENSIONS.map((key) => [key, numericScore(input.rawScores[key])]),
  ) as Record<A1DiscDimension, number>
  const ranked = [...DIMENSIONS].sort(
    (left, right) => rawScores[right] - rawScores[left] || DIMENSIONS.indexOf(left) - DIMENSIONS.indexOf(right),
  )
  const storedPrimary = isDimension(input.dominantPattern)
    ? input.dominantPattern.toUpperCase() as A1DiscDimension
    : null
  const primary = storedPrimary || ranked[0]
  const storedSecondary = isDimension(input.secondaryPattern)
    ? input.secondaryPattern.toUpperCase() as A1DiscDimension
    : null
  const secondary = storedSecondary && storedSecondary !== primary
    ? storedSecondary
    : ranked.find((key) => key !== primary) || ranked[1]
  const intensities = Object.fromEntries(
    DIMENSIONS.map((key) => [key, discNetScoreToIntensity(rawScores[key])]),
  ) as Record<A1DiscDimension, number>
  const c1 = input.c1Responses || {}
  const c2 = input.c2Responses || {}
  const contextValues = [...Object.values(c1), ...Object.values(c2)]

  return {
    assessmentDate: input.completedAt || null,
    primary,
    secondary,
    combinationName: COMBINATIONS[`${primary}-${secondary}`] || `${DESPEGA_PROFILES[primary].nombre} + ${DESPEGA_PROFILES[secondary].nombre}`,
    rawScores,
    intensities,
    answeredContextItems: contextValues.filter((value) => stringList(value).length > 0).length,
    dimensions: DIMENSIONS.map((key) => ({
      key,
      name: DESPEGA_PROFILES[key].nombre,
      professionalName: DESPEGA_PROFILES[key].nombreProfesional,
      score: intensities[key],
      rawScore: rawScores[key],
      strength: DESPEGA_PROFILES[key].fortalezas[0],
      development: DESPEGA_PROFILES[key].oportunidades[0],
      color: DESPEGA_PROFILES[key].color,
    })),
    strengths: [
      ...DESPEGA_PROFILES[primary].fortalezas.slice(0, 3),
      ...DESPEGA_PROFILES[secondary].fortalezas.slice(0, 2),
    ],
    tensions: [
      ...DESPEGA_PROFILES[primary].oportunidades.slice(0, 3),
      ...DESPEGA_PROFILES[secondary].oportunidades.slice(0, 2),
    ],
    context: {
      currentSituation: safeText(c1['1']),
      experience: safeText(c1['2']),
      currentChallenge: safeText(c1['3']),
      objective90Days: safeText(c2['1']) || safeText(c1['4']),
      sector: safeText(c2['2']),
      targetRole: safeText(c2['3']),
      targetSkills: stringList(c2['4']),
      availableTime: safeText(c2['5']) || safeText(c1['6']),
      learningPreferences: stringList(c2['6']).length ? stringList(c2['6']) : stringList(c1['7']),
      barriers: stringList(c2['7']),
      planStyle: safeText(c2['8']),
    },
  }
}
