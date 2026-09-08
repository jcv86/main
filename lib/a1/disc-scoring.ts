import { DISC_TEST_QUESTIONS } from '@/lib/disc-test-questions'
import { patternEvidence, QUESTIONNAIRE_VERSION, PATTERN_VERSION, type PatternEvidence } from './individual-evidence'

export type DiscDimension = 'D' | 'I' | 'S' | 'C'

export interface DiscSelections {
  more: Record<string, string>
  less: Record<string, string>
  _meta?: {
    questionnaireVersion: typeof QUESTIONNAIRE_VERSION
    scoringVersion: typeof PATTERN_VERSION
    patternEvidence: PatternEvidence
    compatibilityLabelsOnly: boolean
  }
}

export interface DiscScoringValue {
  responses: DiscSelections
  scores: Record<DiscDimension, number>
  /** Required by the legacy RPC/schema. Use responses._meta.patternEvidence for interpretation. */
  dominantPattern: DiscDimension
  secondaryPattern: DiscDimension
  questions: Array<{ id: number; pregunta: string; opciones: Array<{ texto: string; dimension: DiscDimension }> }>
}

export interface DiscScoringResult {
  valid: boolean
  errors: string[]
  value?: DiscScoringValue
}

const DIMENSION_ORDER: DiscDimension[] = ['D', 'I', 'S', 'C']

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function normalizeSelectionRecord(value: unknown): Record<string, string> | null {
  if (!isRecord(value)) return null
  const normalized: Record<string, string> = {}
  for (const [key, selection] of Object.entries(value)) {
    if (typeof selection !== 'string' || !/^[1-9]\d*$/.test(key)) return null
    normalized[key] = selection.trim()
  }
  return normalized
}

export function validateAndScoreDiscResponses(input: unknown): DiscScoringResult {
  if (!isRecord(input)) return { valid: false, errors: ['Las respuestas deben ser un objeto.'] }
  const more = normalizeSelectionRecord(input.more)
  const less = normalizeSelectionRecord(input.less)
  if (!more || !less) return { valid: false, errors: ['Las selecciones MÁS y MENOS deben contener texto válido.'] }

  const expectedIds = new Set(DISC_TEST_QUESTIONS.map((question) => String(question.id)))
  const providedIds = new Set([...Object.keys(more), ...Object.keys(less)])
  const errors: string[] = []
  for (const id of expectedIds) {
    if (!more[id]) errors.push(`Falta la selección MÁS de la pregunta ${id}.`)
    if (!less[id]) errors.push(`Falta la selección MENOS de la pregunta ${id}.`)
  }
  for (const id of providedIds) if (!expectedIds.has(id)) errors.push(`La pregunta ${id} no pertenece al cuestionario canónico.`)

  const scores: Record<DiscDimension, number> = { D: 0, I: 0, S: 0, C: 0 }
  const normalizedMore: Record<string, string> = {}
  const normalizedLess: Record<string, string> = {}
  for (const question of DISC_TEST_QUESTIONS) {
    const id = String(question.id)
    const moreText = more[id], lessText = less[id]
    if (!moreText || !lessText) continue
    if (moreText === lessText) { errors.push(`La pregunta ${id} no puede usar la misma opción en MÁS y MENOS.`); continue }
    const moreOption = question.opciones.find((option) => option.texto === moreText)
    const lessOption = question.opciones.find((option) => option.texto === lessText)
    if (!moreOption) errors.push(`La selección MÁS de la pregunta ${id} no es válida.`)
    if (!lessOption) errors.push(`La selección MENOS de la pregunta ${id} no es válida.`)
    if (!moreOption || !lessOption) continue
    scores[moreOption.dimension] += 1
    scores[lessOption.dimension] -= 1
    normalizedMore[id] = moreOption.texto
    normalizedLess[id] = lessOption.texto
  }
  if (errors.length > 0) return { valid: false, errors }

  const evidence = patternEvidence(scores)
  // Compatibility adapter only: production's dominant_pattern column is NOT NULL.
  // Ambiguity is persisted at its origin and the report uses evidence, not these tie-break aliases.
  const rankedDimensions = [...DIMENSION_ORDER].sort((left, right) => scores[right] - scores[left] || DIMENSION_ORDER.indexOf(left) - DIMENSION_ORDER.indexOf(right))
  return {
    valid: true, errors: [], value: {
      responses: { more: normalizedMore, less: normalizedLess, _meta: {
        questionnaireVersion: QUESTIONNAIRE_VERSION, scoringVersion: PATTERN_VERSION,
        patternEvidence: evidence, compatibilityLabelsOnly: evidence.status !== 'resolved',
      } },
      scores,
      dominantPattern: rankedDimensions[0], secondaryPattern: rankedDimensions[1],
      questions: DISC_TEST_QUESTIONS.map(({ id, pregunta, opciones }) => ({ id, pregunta, opciones: opciones.map((option) => ({ ...option })) })),
    },
  }
}
