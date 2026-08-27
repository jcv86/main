import { CONOZCAMONOS_1_QUESTIONS } from '@/lib/canon-conozcamonos-1-questions'
import { DISC_TEST_QUESTIONS } from '@/lib/disc-test-questions'

export const ASSESSMENT_TYPES = ['c1', 'a1'] as const
export type AssessmentType = (typeof ASSESSMENT_TYPES)[number]

export type AssessmentDraft = {
  assessmentType: AssessmentType
  schemaVersion: number
  currentQuestion: number
  answers: Record<string, unknown>
  timings: unknown[]
  updatedAt?: string
  completedAt?: string | null
}

const MAX_PAYLOAD_BYTES = 64 * 1024

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function isAssessmentType(value: string): value is AssessmentType {
  return ASSESSMENT_TYPES.includes(value as AssessmentType)
}

function validateC1Answers(value: unknown) {
  if (!isRecord(value)) return false
  const questions = new Map(CONOZCAMONOS_1_QUESTIONS.map((question) => [String(question.id), question]))
  return Object.entries(value).every(([id, answer]) => {
    const question = questions.get(id)
    if (!question) return false
    if (question.type === 'text') return typeof answer === 'string' && answer.length <= 500
    if (!Array.isArray(answer) || answer.length === 0 || answer.length > (question.options?.length ?? 0)) return false
    return answer.every((option) => typeof option === 'string' && question.options?.includes(option))
  })
}

function validateA1Answers(value: unknown) {
  if (!isRecord(value) || !isRecord(value.more) || !isRecord(value.less)) return false
  const questions = new Map(DISC_TEST_QUESTIONS.map((question) => [String(question.id), question]))
  const validateSide = (side: Record<string, unknown>) => Object.entries(side).every(([id, answer]) => {
    const question = questions.get(id)
    return Boolean(question && typeof answer === 'string' && question.opciones.some((option) => option.texto === answer))
  })
  if (!validateSide(value.more) || !validateSide(value.less)) return false
  return Object.keys(value.more).every((id) => !value.less[id] || value.more[id] !== value.less[id])
}

function validateTimings(value: unknown) {
  if (!Array.isArray(value) || value.length > DISC_TEST_QUESTIONS.length) return false
  return value.every((timing) => {
    if (!isRecord(timing)) return false
    const questionId = Number(timing.questionId)
    const responseTime = timing.responseTime === undefined ? undefined : Number(timing.responseTime)
    return Number.isInteger(questionId) && questionId >= 1 && questionId <= DISC_TEST_QUESTIONS.length &&
      (responseTime === undefined || (Number.isFinite(responseTime) && responseTime >= 0 && responseTime <= 3_600))
  })
}

export function validateAssessmentDraft(type: AssessmentType, value: unknown):
  | { valid: true; draft: Omit<AssessmentDraft, 'assessmentType'> }
  | { valid: false; error: string } {
  if (!isRecord(value)) return { valid: false, error: 'El borrador debe ser un objeto.' }
  if (Buffer.byteLength(JSON.stringify(value), 'utf8') > MAX_PAYLOAD_BYTES) return { valid: false, error: 'El borrador excede el tamaño permitido.' }
  const maxQuestion = type === 'c1' ? CONOZCAMONOS_1_QUESTIONS.length : DISC_TEST_QUESTIONS.length
  const currentQuestion = Number(value.currentQuestion)
  if (!Number.isInteger(currentQuestion) || currentQuestion < 0 || currentQuestion >= maxQuestion) return { valid: false, error: 'La pregunta actual no es válida.' }
  if (value.schemaVersion !== 1) return { valid: false, error: 'La versión del cuestionario no es compatible.' }
  if (type === 'c1' ? !validateC1Answers(value.answers) : !validateA1Answers(value.answers)) return { valid: false, error: 'Las respuestas del borrador no son válidas.' }
  const timings = value.timings ?? []
  if (type === 'a1' && !validateTimings(timings)) return { valid: false, error: 'Los tiempos del borrador no son válidos.' }
  return { valid: true, draft: { schemaVersion: 1, currentQuestion, answers: value.answers as Record<string, unknown>, timings: type === 'a1' ? timings as unknown[] : [] } }
}
