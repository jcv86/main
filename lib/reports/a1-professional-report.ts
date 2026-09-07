import { DISC_TEST_QUESTIONS } from '@/lib/disc-test-questions'
import { DESPEGA_PROFILES } from '@/lib/despega-profiles'
import {
  A1_DIMENSIONS, latestReportTimestamp, netScoreToIntensity, normalizeReportTimestamp,
  readA1ScoreEvidence, type A1DiscDimension, type A1ScoreEvidence, type A1ScoreMap,
} from './report-evidence'
import { answerText, answerList } from '@/lib/a1/individual-evidence'
import { buildIndividualUnderstanding, type IndividualUnderstanding } from '@/lib/a1/individual-understanding'

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
  assessmentResponses?: unknown
  sourceRevision?: string
  editRevision?: string
}

export interface A1ProfessionalReport {
  assessmentDate: string | null
  generatedAt: string
  primary: A1DiscDimension | null
  secondary: A1DiscDimension | null
  combinationName: string
  interpretationAvailable: boolean
  reviewable: boolean
  patternSource: 'canonical' | 'derived' | 'unavailable'
  scoreEvidence: A1ScoreEvidence
  questionCount: number
  understanding: IndividualUnderstanding
  clarificationEditRevision: string | null
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

export function discNetScoreToIntensity(score: number | null): number | null {
  return netScoreToIntensity(score, DISC_TEST_QUESTIONS.length)
}

export function buildA1ProfessionalReport(input: A1ProfessionalReportInput): A1ProfessionalReport {
  const scoreEvidence = readA1ScoreEvidence(input.rawScores, DISC_TEST_QUESTIONS.length)
  const rawScores = scoreEvidence.scores
  const c1 = input.c1Responses || {}, c2 = input.c2Responses || {}
  const understanding = buildIndividualUnderstanding({ scores: rawScores, responses: input.assessmentResponses, c1, c2, revision: input.sourceRevision })
  const { primary, secondary } = understanding.pattern
  const interpretationAvailable = understanding.pattern.status === 'resolved'
  const canonicalAgrees = typeof input.dominantPattern === 'string' && typeof input.secondaryPattern === 'string'
    && input.dominantPattern.trim().toUpperCase() === primary && input.secondaryPattern.trim().toUpperCase() === secondary
  const patternSource = !interpretationAvailable ? 'unavailable' : canonicalAgrees ? 'canonical' : 'derived'
  const intensities = Object.fromEntries(A1_DIMENSIONS.map((key) => [key, discNetScoreToIntensity(rawScores[key])])) as A1ScoreMap
  const contextValues = [...Object.entries(c1), ...Object.entries(c2)].filter(([key]) => /^[1-9]\d*$/.test(key)).map(([, value]) => value)
  const assessmentDate = normalizeReportTimestamp(input.completedAt)
  const c1CompletedAt = normalizeReportTimestamp(input.c1CompletedAt)
  const c2CompletedAt = normalizeReportTimestamp(input.c2CompletedAt)

  return {
    assessmentDate,
    generatedAt: normalizeReportTimestamp(input.generatedAt) || new Date().toISOString(),
    primary, secondary,
    combinationName: primary && secondary ? COMBINATIONS[`${primary}-${secondary}`]
      || `${DESPEGA_PROFILES[primary].nombre} + ${DESPEGA_PROFILES[secondary].nombre}`
      : understanding.pattern.status === 'ambiguous' ? 'Un perfil con matices por explorar' : 'Lectura pendiente de verificación',
    interpretationAvailable,
    // Legitimate ties are not a failed assessment and must not trap the user in a retake loop.
    reviewable: scoreEvidence.status === 'complete' && !understanding.readingBlocked,
    patternSource, scoreEvidence,
    questionCount: DISC_TEST_QUESTIONS.length,
    understanding,
    clarificationEditRevision: input.editRevision || null,
    provenance: {
      c1CompletedAt, c2CompletedAt,
      latestDatedSource: latestReportTimestamp([assessmentDate, c1CompletedAt, c2CompletedAt, understanding.clarificationSavedAt]),
      hasUndatedSources: !assessmentDate
        || (Object.values(c1).some((value) => answerList(value).length > 0) && !c1CompletedAt)
        || (Object.values(c2).some((value) => answerList(value).length > 0) && !c2CompletedAt),
    },
    rawScores, intensities,
    answeredContextItems: contextValues.filter((value) => answerList(value).length > 0).length,
    dimensions: A1_DIMENSIONS.map((key) => ({
      key, name: DESPEGA_PROFILES[key].nombre, professionalName: DESPEGA_PROFILES[key].nombreProfesional,
      score: intensities[key], rawScore: rawScores[key], strength: DESPEGA_PROFILES[key].fortalezas[0],
      development: DESPEGA_PROFILES[key].oportunidades[0], color: DESPEGA_PROFILES[key].color,
    })),
    strengths: primary && secondary ? [...DESPEGA_PROFILES[primary].fortalezas.slice(0, 3), ...DESPEGA_PROFILES[secondary].fortalezas.slice(0, 2)] : [],
    tensions: primary && secondary ? [...DESPEGA_PROFILES[primary].oportunidades.slice(0, 3), ...DESPEGA_PROFILES[secondary].oportunidades.slice(0, 2)] : [],
    context: {
      currentSituation: answerText(c1['1']), experience: answerText(c1['2']), currentChallenge: answerText(c1['3']),
      objective90Days: answerText(c2['1']) || answerText(c1['4']), sector: answerText(c2['2']), targetRole: answerText(c2['3']),
      targetSkills: answerList(c2['4']), availableTime: answerText(c2['5']) || answerText(c1['6']),
      learningPreferences: answerList(c2['6']).length ? answerList(c2['6']) : answerList(c1['7']),
      barriers: answerList(c2['7']), planStyle: answerText(c2['8']),
    },
  }
}
