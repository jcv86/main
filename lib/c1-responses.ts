import { CONOZCAMONOS_1_QUESTIONS } from '@/lib/canon-conozcamonos-1-questions'

export type C1Responses = Record<number, string | string[]>
export type C1CustomResponses = Record<number, string>
export const C1_CUSTOM_RESPONSES_KEY = '_customResponses'
export const C1_TEXT_LIMIT = 500

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

/** Keep selected options canonical while retaining the participant's draft text. */
export function serializeC1DraftAnswers(responses: C1Responses, customResponses: C1CustomResponses): Record<string, unknown> {
  const answers: Record<string, unknown> = {}
  const custom: Record<string, string> = {}
  for (const question of CONOZCAMONOS_1_QUESTIONS) {
    const answer = responses[question.id]
    if (answer === undefined || (Array.isArray(answer) && answer.length === 0)) continue
    answers[question.id] = Array.isArray(answer) ? [...answer] : answer
    if (question.options?.includes('Otro') && Array.isArray(answer) && answer.includes('Otro')
      && typeof customResponses[question.id] === 'string') {
      custom[question.id] = customResponses[question.id]
    }
  }
  if (Object.keys(custom).length > 0) answers[C1_CUSTOM_RESPONSES_KEY] = custom
  return answers
}

/** Legacy drafts have only numeric question keys and remain readable. */
export function restoreC1DraftAnswers(answers: Record<string, unknown>): {
  responses: C1Responses; customResponses: C1CustomResponses
} {
  const responses: C1Responses = {}, customResponses: C1CustomResponses = {}
  const custom = answers[C1_CUSTOM_RESPONSES_KEY]
  for (const question of CONOZCAMONOS_1_QUESTIONS) {
    const answer = answers[question.id]
    if (question.type === 'text' && typeof answer === 'string') responses[question.id] = answer
    if (question.type === 'select' && Array.isArray(answer) && answer.every(option => typeof option === 'string')) {
      responses[question.id] = [...answer]
      if (question.options?.includes('Otro') && answer.includes('Otro') && isRecord(custom)
        && typeof custom[question.id] === 'string') customResponses[question.id] = custom[question.id] as string
    }
  }
  return { responses, customResponses }
}

/** Reports already read numeric question keys and string/array answers. */
export function serializeC1FinalAnswers(responses: C1Responses, customResponses: C1CustomResponses): C1Responses {
  const { responses: active } = restoreC1DraftAnswers(serializeC1DraftAnswers(responses, customResponses))
  for (const question of CONOZCAMONOS_1_QUESTIONS) {
    const answer = active[question.id], detail = customResponses[question.id]?.trim()
    if (question.options?.includes('Otro') && Array.isArray(answer) && detail) {
      active[question.id] = answer.map(option => option === 'Otro' ? `Otro: ${detail}` : option)
    }
  }
  return active
}

export function validateC1DraftAnswers(value: unknown): boolean {
  if (!isRecord(value)) return false
  const questions = new Map(CONOZCAMONOS_1_QUESTIONS.map(question => [String(question.id), question]))
  return Object.entries(value).every(([id, answer]) => {
    if (id === C1_CUSTOM_RESPONSES_KEY) {
      if (!isRecord(answer)) return false
      return Object.entries(answer).every(([questionId, detail]) => {
        const question = questions.get(questionId), selected = value[questionId]
        return Boolean(question?.options?.includes('Otro') && Array.isArray(selected) && selected.includes('Otro')
          && typeof detail === 'string' && detail.length <= C1_TEXT_LIMIT)
      })
    }
    const question = questions.get(id)
    if (!question) return false
    if (question.type === 'text') return typeof answer === 'string' && answer.length <= C1_TEXT_LIMIT
    if (!Array.isArray(answer) || answer.length === 0 || answer.length > (question.options?.length ?? 0)) return false
    return answer.every(option => typeof option === 'string' && question.options?.includes(option))
  })
}

/** Completion requires every answer; incomplete drafts remain valid above. */
export function validateC1CompletionAnswers(value: unknown): value is Record<string, unknown> {
  if (!isRecord(value) || !validateC1DraftAnswers(value)) return false
  return CONOZCAMONOS_1_QUESTIONS.every(question => {
    const answer = value[question.id]
    if (question.type === 'text') return typeof answer === 'string' && answer.trim().length > 0
    return Array.isArray(answer) && answer.length > 0 && new Set(answer).size === answer.length
  })
}

/** Voice/coach input may exceed textarea maxLength: retain it and ask for editing. */
export function c1TextLimitError(responses: C1Responses, customResponses: C1CustomResponses): string | null {
  for (const question of CONOZCAMONOS_1_QUESTIONS) {
    const answer = responses[question.id]
    const text = question.type === 'text' ? answer
      : Array.isArray(answer) && answer.includes('Otro') ? customResponses[question.id] : undefined
    if (typeof text === 'string' && text.length > C1_TEXT_LIMIT) {
      return `La respuesta de la pregunta ${question.id} supera los ${C1_TEXT_LIMIT} caracteres. Acórtala antes de guardar; el texto sigue aquí para que lo edites.`
    }
  }
  return null
}
