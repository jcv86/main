export type VeraTrack = 'fast' | 'agentic'

export type VeraIntent =
  | 'explain'
  | 'reflect'
  | 'practice'
  | 'decision'
  | 'compare'
  | 'market'
  | 'journey'
  | 'general'

export interface VeraRoutingDecision {
  track: VeraTrack
  intent: VeraIntent
  needsJourneyContext: boolean
  reasonCodes: string[]
}

const PERSONAL_CONTEXT_PATTERNS = [
  /\bmi perfil\b/i,
  /\bmis resultados\b/i,
  /\bmi ruta\b/i,
  /\bmis objetivos\b/i,
  /\bmi progreso\b/i,
  /\bmi carrera\b/i,
  /\bpara m[ií](?=\s|[,.!?;:]|$)/i,
  /\bcon lo que sabes de m[ií](?=\s|[,.!?;:]|$)/i,
  /\bseg[uú]n (?:mi|mis)\b/i,
  /\blo que (?:hice|respond[ií]|defin[ií])\b/i,
]

const MULTI_STEP_PATTERNS = [
  /\bcompar(?:a|ar|ame|ación)\b/i,
  /\bdecid(?:ir|o|iendo|a)\b/i,
  /\boferta\b/i,
  /\bpostul(?:ar|o|ación)\b/i,
  /\bcargo\b/i,
  /\bentrevista\b/i,
  /\bcv\b/i,
  /\bcurr[ií]cul/i,
  /\bbrecha(?:s)?\b/i,
  /\bevidencia\b/i,
  /\bfortaleza(?:s)?\b/i,
  /\bdebilidad(?:es)?\b/i,
]

const MARKET_PATTERNS = [
  /\bmercado\b/i,
  /\bempleo\b/i,
  /\bsueldo(?:s)?\b/i,
  /\bindustria\b/i,
  /\bsector\b/i,
  /\btendencia(?:s)?\b/i,
  /\bimacec\b/i,
  /\bipc\b/i,
  /\binflaci[oó]n\b/i,
  /\buf\b/i,
]

const PRACTICE_PATTERNS = [
  /\bpractic(?:a|ar|amos)|\bpractiquemos\b/i,
  /\bsimul(?:a|ar|ación)\b/i,
  /\bensay(?:a|ar|emos)\b/i,
  /\brole[- ]?play\b/i,
  /\brespuesta de entrevista\b/i,
]

const EXPLAIN_PATTERNS = [
  /^[¿?]?\s*(?:qué|que) (?:es|significa)\b/i,
  /^[¿?]?\s*c[oó]mo funciona\b/i,
  /^[¿?]?\s*expl[ií]came\b/i,
  /^[¿?]?\s*define\b/i,
]

function matchesAny(text: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(text))
}

function inferIntent(message: string): VeraIntent {
  if (matchesAny(message, PRACTICE_PATTERNS)) return 'practice'
  if (/\bcompar/i.test(message)) return 'compare'
  if (/\bdecid|\boferta\b|\baceptar\b|\brechazar\b/i.test(message)) return 'decision'
  if (matchesAny(message, MARKET_PATTERNS)) return 'market'
  if (/\ba1\b|\ba2\b|\ba3\b|\ba4\b|\bmi ruta\b|\bmi progreso\b/i.test(message)) return 'journey'
  if (matchesAny(message, EXPLAIN_PATTERNS)) return 'explain'
  if (/\bpor qu[eé]\b|\bqu[eé] ves\b|\bqu[eé] patr[oó]n\b|\breflex/i.test(message)) return 'reflect'
  return 'general'
}

/**
 * Cheap first-pass router inspired by CBA's FastTrack/FullAgentic split.
 * It is deliberately deterministic so we can benchmark routing before adding
 * another model call to the critical path.
 */
export function routeVeraQuery(message: string): VeraRoutingDecision {
  const normalized = message.trim()
  const personal = matchesAny(normalized, PERSONAL_CONTEXT_PATTERNS)
  const multiStep = matchesAny(normalized, MULTI_STEP_PATTERNS)
  const explanation = matchesAny(normalized, EXPLAIN_PATTERNS)
  const intent = inferIntent(normalized)
  const practice = intent === 'practice'
  const explainOnly = explanation && !personal && !practice

  const reasonCodes: string[] = []
  if (personal) reasonCodes.push('personal_context')
  if (multiStep && !explainOnly) reasonCodes.push('multi_step')
  if (practice) reasonCodes.push('interactive_practice')
  if (intent === 'market') reasonCodes.push('market_context')
  if (explainOnly) reasonCodes.push('simple_explanation')

  // Generic educational questions stay fast even if they mention an interview,
  // role or CV. Personal context, comparisons, decisions and practice escalate.
  const agentic = personal || (multiStep && !explainOnly) || practice

  return {
    track: agentic ? 'agentic' : 'fast',
    intent,
    needsJourneyContext: agentic || intent === 'journey',
    reasonCodes: reasonCodes.length > 0 ? reasonCodes : ['general_fast_path'],
  }
}

export function buildVeraCoachPolicyPrompt(intent: VeraIntent) {
  return [
    'Eres Vera, coach de desarrollo profesional de Despega Tu Carrera.',
    'Tu objetivo no es decidir por la persona: ayudas a pensar mejor usando contexto, evidencia y preguntas útiles.',
    'Distingue siempre entre evidencia observada, inferencias y preguntas abiertas.',
    'Si falta información importante, pregunta antes de concluir.',
    'No inventes hechos sobre el usuario ni sobre el mercado.',
    'Cuando uses evidencia del recorrido A1–A4, explica qué dato estás usando y por qué es relevante.',
    'Evita tono condescendiente, grandilocuente o excesivamente terapéutico.',
    'Para decisiones, presenta trade-offs y criterios; la decisión final pertenece al usuario.',
    'Para temas de mercado o país, describe hechos y escenarios sin editorializar políticamente.',
    `Intención detectada: ${intent}.`,
  ].join('\n')
}
