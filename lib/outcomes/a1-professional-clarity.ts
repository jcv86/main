export const A1_CLARITY_PROMPTS = [
  {
    key: 'target',
    label: 'Dirección profesional',
    prompt: '¿Qué tipo de rol, problema o entorno profesional estás buscando ahora y por qué?',
  },
  {
    key: 'value',
    label: 'Valor profesional',
    prompt: '¿Qué valor concreto puedes aportar en ese contexto?',
  },
  {
    key: 'evidence',
    label: 'Evidencia',
    prompt: 'Da un ejemplo concreto que respalde una de tus fortalezas profesionales.',
  },
  {
    key: 'gap',
    label: 'Brecha prioritaria',
    prompt: '¿Cuál es la principal brecha que hoy necesitas desarrollar y por qué importa?',
  },
] as const

export type A1ClarityPromptKey = typeof A1_CLARITY_PROMPTS[number]['key']
export type A1ClarityResponses = Record<A1ClarityPromptKey, string>

const SPECIFIC_TERMS = /\b(rol|cargo|equipo|industria|cliente|producto|proyecto|proceso|ventas|riesgo|datos|tecnolog|operacion|finanzas|lider|gesti[oó]n)\b/i
const EVIDENCE_TERMS = /\b(logr[eé]|aument|reduj|mejor|implement|lider|entreg|resultado|%|por ciento|cliente|equipo|proyecto|plazo|meta)\b/i
const GAP_TERMS = /\b(me falta|necesito|debo|brecha|mejorar|desarrollar|aprender|practicar|fortalecer)\b/i

function boundedLengthScore(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  if (words < 5) return 0
  if (words < 10) return 1
  if (words < 18) return 2
  return 3
}

function scoreDimension(text: string, signal: RegExp) {
  const base = boundedLengthScore(text)
  if (base === 0) return 0
  return Math.min(4, base + (signal.test(text) ? 1 : 0))
}

export function scoreA1ProfessionalClarity(responses: A1ClarityResponses) {
  const dimensions = {
    direction_clarity: scoreDimension(responses.target, SPECIFIC_TERMS),
    value_articulation: scoreDimension(responses.value, SPECIFIC_TERMS),
    evidence_specificity: scoreDimension(responses.evidence, EVIDENCE_TERMS),
    gap_awareness: scoreDimension(responses.gap, GAP_TERMS),
  }

  return {
    dimensions,
    score: Object.values(dimensions).reduce((sum, value) => sum + value, 0),
    confidence: 1,
  }
}
