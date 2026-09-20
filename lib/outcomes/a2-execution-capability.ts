export const A2_EXECUTION_PROMPTS = [
  { key: 'objective', label: 'Objetivo de 7 días', prompt: 'Elige un objetivo profesional concreto que quieras lograr durante los próximos 7 días.' },
  { key: 'actions', label: 'Acciones observables', prompt: '¿Qué acciones específicas ejecutarás para avanzar hacia ese objetivo?' },
  { key: 'evidence', label: 'Evidencia de resultado', prompt: '¿Qué evidencia observable te permitirá saber si realmente avanzaste o generaste impacto?' },
  { key: 'obstacle', label: 'Obstáculo y contingencia', prompt: '¿Cuál es el obstáculo más probable y qué harás si ocurre?' },
  { key: 'review', label: 'Regla de revisión', prompt: 'Al terminar los 7 días, ¿qué resultado te hará continuar, adaptar o detener este plan?' },
] as const

export type A2ExecutionPromptKey = typeof A2_EXECUTION_PROMPTS[number]['key']
export type A2ExecutionResponses = Record<A2ExecutionPromptKey, string>

const OBJECTIVE = /\b(lograr|completar|conseguir|enviar|contactar|crear|terminar|mejorar|validar|publicar|entrevista|postular)\b/i
const ACTION = /\b(primero|luego|cada|enviar|contactar|crear|revisar|practicar|investigar|agendar|postular|publicar)\b/i
const EVIDENCE = /\b(evidencia|respuesta|entrevista|documento|enviado|completado|publicado|reuni[oó]n|feedback|m[eé]trica|resultado|confirmaci[oó]n)\b/i
const OBSTACLE = /\b(si|obst[aá]culo|riesgo|bloqueo|alternativa|contingencia|entonces|plan b|cambiar[eé]|ajustar[eé])\b/i
const REVIEW = /\b(continuar|adaptar|ajustar|detener|mantener|revisar|resultado|si logro|si no)\b/i

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function score(text: string, signal: RegExp) {
  const words = wordCount(text)
  if (words < 6) return 0
  let value = words >= 22 ? 3 : words >= 12 ? 2 : 1
  if (signal.test(text)) value += 1
  return Math.min(4, value)
}

export function scoreA2ExecutionCapability(responses: A2ExecutionResponses) {
  const dimensions = {
    objective_specificity: score(responses.objective, OBJECTIVE),
    action_quality: score(responses.actions, ACTION),
    evidence_definition: score(responses.evidence, EVIDENCE),
    obstacle_planning: score(responses.obstacle, OBSTACLE),
    review_discipline: score(responses.review, REVIEW),
  }
  return {
    dimensions,
    score: Object.values(dimensions).reduce((sum, value) => sum + value, 0),
    confidence: 1,
  }
}
