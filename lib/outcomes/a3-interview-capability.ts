export const A3_INTERVIEW_PROMPTS = [
  {
    key: 'behavioral',
    label: 'Experiencia concreta',
    prompt: 'Cuéntame una situación profesional desafiante, qué hiciste tú y qué resultado obtuviste.',
  },
  {
    key: 'value_fit',
    label: 'Valor y encaje',
    prompt: '¿Por qué tu experiencia sería valiosa para el rol que buscas ahora?',
  },
  {
    key: 'challenge',
    label: 'Pregunta difícil',
    prompt: '¿Qué debilidad o brecha profesional podría preocupar a un entrevistador y cómo la estás abordando?',
  },
] as const

export type A3InterviewPromptKey = typeof A3_INTERVIEW_PROMPTS[number]['key']
export type A3InterviewResponses = Record<A3InterviewPromptKey, string>

const STRUCTURE = /\b(situaci[oó]n|contexto|objetivo|tarea|acci[oó]n|resultado|primero|despu[eé]s|finalmente)\b/i
const EVIDENCE = /\b(logr[eé]|aument|reduj|mejor|implement|lider|entreg|resultado|%|por ciento|equipo|cliente|proyecto|meta|plazo)\b/i
const RELEVANCE = /\b(rol|cargo|puesto|empresa|equipo|cliente|industria|experiencia|valor|problema)\b/i
const SYNTHESIS = /\b(por eso|en resumen|principal|clave|impacto|aprend[ií]|resultado)\b/i
const CHALLENGE = /\b(brecha|debilidad|me falta|estoy|mejorando|desarrollando|aprendiendo|plan|practico|feedback)\b/i

function words(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function scoreSignal(text: string, signal: RegExp, strongAt = 28) {
  const count = words(text)
  if (count < 8) return 0
  let score = count >= strongAt ? 3 : count >= 18 ? 2 : 1
  if (signal.test(text)) score += 1
  return Math.min(4, score)
}

export function scoreA3InterviewCapability(responses: A3InterviewResponses) {
  const combined = `${responses.behavioral} ${responses.value_fit} ${responses.challenge}`
  const dimensions = {
    answer_structure: scoreSignal(responses.behavioral, STRUCTURE),
    evidence_specificity: scoreSignal(responses.behavioral, EVIDENCE),
    question_relevance: scoreSignal(responses.value_fit, RELEVANCE),
    clarity_synthesis: scoreSignal(combined, SYNTHESIS, 60),
    challenge_handling: scoreSignal(responses.challenge, CHALLENGE),
  }

  return {
    dimensions,
    score: Object.values(dimensions).reduce((sum, value) => sum + value, 0),
    confidence: 1,
  }
}
