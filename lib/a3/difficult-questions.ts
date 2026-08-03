import { normalizeCoachText } from '@/lib/a3/coach-practice'

export const DIFFICULT_QUESTIONS_DRAFT_KEY = 'dtc:a3:difficult-questions:draft:v1'

export const DIFFICULT_RISK_IDS = [
  'employment-gap',
  'job-changes',
  'experience-gap',
  'termination',
  'weakness',
  'conflict',
] as const

export type DifficultRiskId = (typeof DIFFICULT_RISK_IDS)[number]

export const DIFFICULT_RISK_LABELS: Record<DifficultRiskId, string> = {
  'employment-gap': 'Vacío laboral',
  'job-changes': 'Cambios frecuentes de trabajo',
  'experience-gap': 'Brecha de experiencia',
  termination: 'Salida involuntaria',
  weakness: 'Debilidad profesional',
  conflict: 'Conflicto laboral',
}

export const PRESSURE_QUESTION_IDS = ['differentiate', 'failure', 'departure'] as const
export type PressureQuestionId = (typeof PRESSURE_QUESTION_IDS)[number]

export interface DifficultRiskPlan {
  riskId: DifficultRiskId | ''
  facts: string
  accountability: string
  learning: string
  readyNow: string
  fullAnswer: string
}

export interface PressureAnswer {
  text: string
  durationSeconds: number
  selfRating: number
}

export interface DifficultQuestionsDraft {
  riskPlans: DifficultRiskPlan[]
  redFlagChecks: string[]
  pressureAnswers: Record<PressureQuestionId, PressureAnswer>
  strongestResponse: string
  remainingRisk: string
  improvementAction: string
  reflection: string
}

export interface DifficultQuestionsContext {
  fullName: string
  targetRole: string
  company: string
  prioritySignals: string[]
  previousWeakestAnswer: string
  previousImprovementAction: string
  previousReflection: string
  available: boolean
}

export const REQUIRED_RED_FLAG_CHECKS = [
  'no-blame',
  'no-evasion',
  'honest-facts',
  'positive-close',
] as const

const EMPTY_RISK_PLAN: DifficultRiskPlan = {
  riskId: '',
  facts: '',
  accountability: '',
  learning: '',
  readyNow: '',
  fullAnswer: '',
}

const EMPTY_PRESSURE_ANSWER: PressureAnswer = {
  text: '',
  durationSeconds: 0,
  selfRating: 0,
}

export const EMPTY_DIFFICULT_QUESTIONS_DRAFT: DifficultQuestionsDraft = {
  riskPlans: Array.from({ length: 3 }, () => ({ ...EMPTY_RISK_PLAN })),
  redFlagChecks: [],
  pressureAnswers: Object.fromEntries(
    PRESSURE_QUESTION_IDS.map((id) => [id, { ...EMPTY_PRESSURE_ANSWER }]),
  ) as Record<PressureQuestionId, PressureAnswer>,
  strongestResponse: '',
  remainingRisk: '',
  improvementAction: '',
  reflection: '',
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function numberValue(value: unknown): number {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric >= 0 ? Math.round(numeric) : 0
}

function stringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  if (typeof value !== 'string') return []
  return value
    .split(/\r?\n|,|;/)
    .map((item) => item.trim().replace(/^[-•*]\s*/, ''))
    .filter(Boolean)
}

function riskIdValue(value: unknown): DifficultRiskId | '' {
  return typeof value === 'string' && DIFFICULT_RISK_IDS.includes(value as DifficultRiskId)
    ? (value as DifficultRiskId)
    : ''
}

export function toDifficultQuestionsDraft(value: unknown): DifficultQuestionsDraft {
  const deliverable = objectValue(value)
  const riskPlansValue = Array.isArray(deliverable.riskPlans) ? deliverable.riskPlans : []
  const riskPlans = Array.from({ length: 3 }, (_, index) => {
    const plan = objectValue(riskPlansValue[index])
    return {
      riskId: riskIdValue(plan.riskId),
      facts: textValue(plan.facts),
      accountability: textValue(plan.accountability),
      learning: textValue(plan.learning),
      readyNow: textValue(plan.readyNow),
      fullAnswer: textValue(plan.fullAnswer),
    }
  })

  const pressureValue = objectValue(deliverable.pressureAnswers)
  const pressureAnswers = Object.fromEntries(
    PRESSURE_QUESTION_IDS.map((id) => {
      const answer = objectValue(pressureValue[id])
      return [
        id,
        {
          text: textValue(answer.text),
          durationSeconds: numberValue(answer.durationSeconds),
          selfRating: Math.min(5, numberValue(answer.selfRating)),
        },
      ]
    }),
  ) as Record<PressureQuestionId, PressureAnswer>

  return {
    riskPlans,
    redFlagChecks: stringList(deliverable.redFlagChecks),
    pressureAnswers,
    strongestResponse: textValue(deliverable.strongestResponse),
    remainingRisk: textValue(deliverable.remainingRisk),
    improvementAction: textValue(deliverable.improvementAction),
    reflection: textValue(deliverable.reflection),
  }
}

export function extractDifficultQuestionsContext(
  cvDeliverable: unknown,
  decoderDeliverable: unknown,
  firstSimulationDeliverable: unknown,
): DifficultQuestionsContext {
  const cv = objectValue(cvDeliverable)
  const decoder = objectValue(decoderDeliverable)
  const simulation = objectValue(firstSimulationDeliverable)
  const fullName = textValue(cv.fullName)
  const targetRole = textValue(decoder.jobTitle) || textValue(cv.targetRole)
  const company = textValue(decoder.company)
  const prioritySignals = [
    ...stringList(decoder.priorityKeywords),
    ...stringList(decoder.mustHaveRequirements),
  ]
  const previousWeakestAnswer = textValue(simulation.weakestAnswer)
  const previousImprovementAction = textValue(simulation.improvementAction)
  const previousReflection = textValue(simulation.interviewReflection)

  return {
    fullName,
    targetRole,
    company,
    prioritySignals,
    previousWeakestAnswer,
    previousImprovementAction,
    previousReflection,
    available: Boolean(
      fullName ||
        targetRole ||
        company ||
        prioritySignals.length ||
        previousWeakestAnswer ||
        previousImprovementAction,
    ),
  }
}

export function countDifficultWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length
}

export function hasDifficultRedFlag(value: string): boolean {
  const normalized = normalizeCoachText(value)
  const patterns = [
    /no fue mi culpa/,
    /mi jefe (era|fue) (terrible|incompetente)/,
    /la empresa (era|fue) (terrible|mala)/,
    /no tengo debilidades/,
    /solo necesito (un|el) trabajo/,
    /me aburr[ií]/,
    /no me valoraron/,
  ]
  return patterns.some((pattern) => pattern.test(normalized))
}

export function countDifficultContextOverlap(
  draft: DifficultQuestionsDraft,
  context?: DifficultQuestionsContext | null,
): number {
  if (!context?.available) return 0
  const candidateText = normalizeCoachText(
    [
      ...draft.riskPlans.map((plan) => plan.fullAnswer),
      ...PRESSURE_QUESTION_IDS.map((id) => draft.pressureAnswers[id].text),
      draft.improvementAction,
      draft.reflection,
    ].join(' '),
  )
  const signals = [
    context.targetRole,
    context.company,
    ...context.prioritySignals,
    context.previousWeakestAnswer,
    context.previousImprovementAction,
  ]
    .map(normalizeCoachText)
    .filter((item) => item.length >= 3)

  return new Set(
    signals.filter((signal) =>
      signal
        .split(' ')
        .filter((token) => token.length >= 4)
        .some((token) => candidateText.includes(token)),
    ),
  ).size
}

export const SAMPLE_DIFFICULT_QUESTIONS_DRAFT: DifficultQuestionsDraft = {
  riskPlans: [
    {
      riskId: 'experience-gap',
      facts:
        'No he tenido formalmente el cargo de jefatura, aunque sí he coordinado equipos comerciales y técnicos en proyectos transversales.',
      accountability:
        'Reconozco que todavía debo profundizar la gestión formal de desempeño y conversaciones de desarrollo.',
      learning:
        'He desarrollado liderazgo práctico definiendo responsables, resolviendo bloqueos y dando seguimiento a compromisos semanales.',
      readyNow:
        'Estoy preparado para asumir una jefatura con estructura, indicadores y apertura para recibir retroalimentación temprana.',
      fullAnswer:
        'Aún no he tenido formalmente el cargo de jefatura, pero he coordinado equipos comerciales y técnicos en proyectos transversales. Reconozco que debo profundizar la gestión formal de desempeño. En la práctica definí responsables y un tablero semanal que redujo 22% los atrasos. Hoy estoy preparado para asumir el rol con estructura, indicadores y retroalimentación temprana.',
    },
    {
      riskId: 'weakness',
      facts:
        'Antes tendía a revisar demasiado los entregables críticos y eso podía retrasar decisiones que ya tenían información suficiente.',
      accountability:
        'Entendí que mi necesidad de control podía limitar la autonomía del equipo y consumir tiempo en detalles de bajo impacto.',
      learning:
        'Ahora defino criterios de calidad antes de comenzar, separo decisiones reversibles y uso revisiones por excepción.',
      readyNow:
        'El cambio me permite mantener calidad sin frenar la velocidad del equipo ni concentrar todas las decisiones en mí.',
      fullAnswer:
        'Una debilidad real era revisar demasiado los entregables críticos. Entendí que eso podía limitar la autonomía y retrasar decisiones. Implementé criterios de calidad previos y revisiones por excepción; así redujimos 30% el tiempo de aprobación. Hoy mantengo control sobre los riesgos relevantes sin concentrar todas las decisiones.',
    },
    {
      riskId: 'conflict',
      facts:
        'En un proyecto, otra área priorizaba una entrega distinta y ambos equipos competíamos por los mismos recursos.',
      accountability:
        'Al principio defendí mi calendario sin comprender por completo los compromisos externos de la otra área.',
      learning:
        'Pedí revisar los supuestos, identificamos dependencias compartidas y construimos una secuencia única de prioridades.',
      readyNow:
        'Desde entonces valido restricciones antes de escalar y documento los acuerdos para evitar nuevas interpretaciones.',
      fullAnswer:
        'En un proyecto competíamos por los mismos recursos y al principio defendí mi calendario sin comprender todos los compromisos externos. Pedí revisar los supuestos, construimos una secuencia compartida y documentamos responsables. El acuerdo permitió recuperar dos semanas del plan. Desde entonces valido restricciones antes de escalar un conflicto.',
    },
  ],
  redFlagChecks: [...REQUIRED_RED_FLAG_CHECKS],
  pressureAnswers: {
    differentiate: {
      text:
        'Puedo aportar una combinación de coordinación transversal, análisis de indicadores y ejecución disciplinada. En mi último proyecto organicé responsables y alertas, reduciendo 22% los atrasos. Esa experiencia responde directamente a la necesidad de mayor predictibilidad en esta jefatura de operaciones.',
      durationSeconds: 48,
      selfRating: 4,
    },
    failure: {
      text:
        'En un proyecto subestimé el tiempo de validación de datos y comuniqué una fecha demasiado optimista. Asumí el error, informé el impacto y reorganicé el trabajo con hitos intermedios. Entregamos una semana tarde, pero el nuevo control evitó repetir el problema y mejoró 18% la precisión de las estimaciones siguientes.',
      durationSeconds: 72,
      selfRating: 4,
    },
    departure: {
      text:
        'Busco una posición con mayor responsabilidad transversal y espacio para convertir información operativa en decisiones. Valoro lo aprendido en mi rol actual y no estoy escapando de un problema; esta oportunidad se alinea mejor con mi siguiente etapa y con el impacto que quiero construir.',
      durationSeconds: 51,
      selfRating: 4,
    },
  },
  strongestResponse:
    'La respuesta sobre el fracaso fue la más sólida porque asumió responsabilidad, explicó la corrección y mostró un resultado posterior medible.',
  remainingRisk:
    'Todavía necesito hacer más específica la respuesta sobre la salida laboral para conectarla con una prioridad concreta de la empresa.',
  improvementAction:
    'Revisar la oferta y agregar una señal específica de coordinación transversal antes de repetir la respuesta de salida en menos de 55 segundos.',
  reflection:
    'Las respuestas difíciles fueron más creíbles cuando mantuve hechos breves, responsabilidad personal y evidencia. Evité culpar a terceros y cerré cada respuesta mostrando qué cambió en mi forma de trabajar. El siguiente foco será responder con la misma claridad sin extenderme.',
}
