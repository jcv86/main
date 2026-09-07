import { DISC_TEST_QUESTIONS } from '@/lib/disc-test-questions'
import { DESPEGA_PROFILES } from '@/lib/despega-profiles'
import {
  A1_DIMENSIONS, latestReportTimestamp, netScoreToIntensity, normalizeReportTimestamp,
  readA1ScoreEvidence, resolveA1Patterns,
  type A1DiscDimension, type A1ScoreEvidence, type A1ScoreMap,
} from './report-evidence'

export type { A1DiscDimension } from './report-evidence'

export interface A1ProfessionalReportInput {
  rawScores: Partial<Record<A1DiscDimension, unknown>>
  dominantPattern?: unknown
  secondaryPattern?: unknown
  completedAt?: string | null
  generatedAt?: string | null
  c1CompletedAt?: string | null
  c2CompletedAt?: string | null
  c1Responses?: Record<string, unknown>
  c2Responses?: Record<string, unknown>
}

export interface A1ProfessionalReport {
  assessmentDate: string | null
  generatedAt: string
  primary: A1DiscDimension | null
  secondary: A1DiscDimension | null
  combinationName: string
  interpretationAvailable: boolean
  patternSource: 'canonical' | 'derived' | 'unavailable'
  scoreEvidence: A1ScoreEvidence
  questionCount: number
  provenance: {
    c1CompletedAt: string | null
    c2CompletedAt: string | null
    latestDatedSource: string | null
    hasUndatedSources: boolean
  }
  rawScores: A1ScoreMap
  intensities: A1ScoreMap
  answeredContextItems: number
  dimensions: Array<{
    key: A1DiscDimension
    name: string
    professionalName: string
    score: number | null
    rawScore: number | null
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

const COMBINATIONS: Record<string, string> = {
  'D-I': 'Impulsor Catalítico', 'D-S': 'Impulsor Estable', 'D-C': 'Estratega Ejecutivo',
  'I-D': 'Catalizador Decisivo', 'I-S': 'Facilitador Influyente', 'I-C': 'Comunicador Estratégico',
  'S-D': 'Gestor Resuelto', 'S-I': 'Conector Confiable', 'S-C': 'Constructor Metódico',
  'C-D': 'Arquitecto Ejecutivo', 'C-I': 'Analista Persuasivo', 'C-S': 'Arquitecto Estable',
}

function safeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function stringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(safeText).filter(Boolean)
  const text = safeText(value)
  return text ? [text] : []
}

export function discNetScoreToIntensity(score: number | null): number | null {
  return netScoreToIntensity(score, DISC_TEST_QUESTIONS.length)
}

export function buildA1ProfessionalReport(input: A1ProfessionalReportInput): A1ProfessionalReport {
  const scoreEvidence = readA1ScoreEvidence(input.rawScores, DISC_TEST_QUESTIONS.length)
  const rawScores = scoreEvidence.scores
  const { primary, secondary, source: patternSource } = resolveA1Patterns(
    scoreEvidence, input.dominantPattern, input.secondaryPattern,
  )
  const interpretationAvailable = primary !== null && secondary !== null
  const intensities = Object.fromEntries(
    A1_DIMENSIONS.map((key) => [key, discNetScoreToIntensity(rawScores[key])]),
  ) as A1ScoreMap
  const c1 = input.c1Responses || {}
  const c2 = input.c2Responses || {}
  const contextValues = [...Object.values(c1), ...Object.values(c2)]
  const assessmentDate = normalizeReportTimestamp(input.completedAt)
  const c1CompletedAt = normalizeReportTimestamp(input.c1CompletedAt)
  const c2CompletedAt = normalizeReportTimestamp(input.c2CompletedAt)

  return {
    assessmentDate,
    generatedAt: normalizeReportTimestamp(input.generatedAt) || new Date().toISOString(),
    primary,
    secondary,
    combinationName: primary && secondary ? COMBINATIONS[`${primary}-${secondary}`]
      || `${DESPEGA_PROFILES[primary].nombre} + ${DESPEGA_PROFILES[secondary].nombre}`
      : 'Lectura pendiente de verificación',
    interpretationAvailable,
    patternSource,
    scoreEvidence,
    questionCount: DISC_TEST_QUESTIONS.length,
    provenance: {
      c1CompletedAt,
      c2CompletedAt,
      latestDatedSource: latestReportTimestamp([assessmentDate, c1CompletedAt, c2CompletedAt]),
      hasUndatedSources: !assessmentDate
        || (Object.values(c1).some((value) => stringList(value).length > 0) && !c1CompletedAt)
        || (Object.values(c2).some((value) => stringList(value).length > 0) && !c2CompletedAt),
    },
    rawScores,
    intensities,
    answeredContextItems: contextValues.filter((value) => stringList(value).length > 0).length,
    dimensions: A1_DIMENSIONS.map((key) => ({
      key,
      name: DESPEGA_PROFILES[key].nombre,
      professionalName: DESPEGA_PROFILES[key].nombreProfesional,
      score: intensities[key],
      rawScore: rawScores[key],
      strength: DESPEGA_PROFILES[key].fortalezas[0],
      development: DESPEGA_PROFILES[key].oportunidades[0],
      color: DESPEGA_PROFILES[key].color,
    })),
    strengths: primary && secondary ? [
      ...DESPEGA_PROFILES[primary].fortalezas.slice(0, 3),
      ...DESPEGA_PROFILES[secondary].fortalezas.slice(0, 2),
    ] : [],
    tensions: primary && secondary ? [
      ...DESPEGA_PROFILES[primary].oportunidades.slice(0, 3),
      ...DESPEGA_PROFILES[secondary].oportunidades.slice(0, 2),
    ] : [],
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
