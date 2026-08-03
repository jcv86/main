import { normalizeCoachText } from '@/lib/a3/coach-practice'
import { hasDifficultRedFlag } from '@/lib/a3/difficult-questions'

export const BASIC_INTERVIEW_DRAFT_KEY = 'dtc:a3:basic-interview-mission:draft:v1'

export const BASIC_INTERVIEW_QUESTION_IDS = [
  'warmup',
  'introduction',
  'careerWalk',
  'currentRole',
  'motivation',
  'departure',
  'achievement',
  'challenge',
  'teamwork',
  'weakness',
  'candidateQuestions',
  'closing',
] as const

export type BasicInterviewQuestionId = (typeof BASIC_INTERVIEW_QUESTION_IDS)[number]

export const BASIC_INTERVIEW_EVALUATION_IDS = [
  'clarity',
  'structure',
  'relevance',
  'confidence',
  'authenticity',
] as const

export type BasicInterviewEvaluationId = (typeof BASIC_INTERVIEW_EVALUATION_IDS)[number]

export interface BasicInterviewAnswer {
  text: string
  durationSeconds: number
  selfRating: number
}

export interface BasicInterviewEvaluation {
  rating: number
  observation: string
}

export interface BasicInterviewDraft {
  answers: Record<BasicInterviewQuestionId, BasicInterviewAnswer>
  evaluation: Record<BasicInterviewEvaluationId, BasicInterviewEvaluation>
  strongestAnswer: string
  weakestAnswer: string
  difficultQuestionLearning: string
  nextPracticeAction: string
  routeReflection: string
  readinessState: 'ready' | 'targeted-practice' | 'repeat-mission' | ''
}

export interface BasicInterviewContext {
  fullName: string
  targetRole: string
  company: string
  prioritySignals: string[]
  approvedIntroduction: string
  approvedMotivation: string
  previousWeakestAnswer: string
  previousImprovementAction: string
  preparedWeaknessAnswer: string
  remainingRisk: string
  available: boolean
}

const EMPTY_ANSWER: BasicInterviewAnswer = {
  text: '',
  durationSeconds: 0,
  selfRating: 0,
}

const EMPTY_EVALUATION: BasicInterviewEvaluation = {
  rating: 0,
  observation: '',
}

export const EMPTY_BASIC_INTERVIEW_DRAFT: BasicInterviewDraft = {
  answers: Object.fromEntries(
    BASIC_INTERVIEW_QUESTION_IDS.map((id) => [id, { ...EMPTY_ANSWER }]),
  ) as Record<BasicInterviewQuestionId, BasicInterviewAnswer>,
  evaluation: Object.fromEntries(
    BASIC_INTERVIEW_EVALUATION_IDS.map((id) => [id, { ...EMPTY_EVALUATION }]),
  ) as Record<BasicInterviewEvaluationId, BasicInterviewEvaluation>,
  strongestAnswer: '',
  weakestAnswer: '',
  difficultQuestionLearning: '',
  nextPracticeAction: '',
  routeReflection: '',
  readinessState: '',
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

function readinessValue(
  value: unknown,
): BasicInterviewDraft['readinessState'] {
  return value === 'ready' || value === 'targeted-practice' || value === 'repeat-mission'
    ? value
    : ''
}

export function toBasicInterviewDraft(value: unknown): BasicInterviewDraft {
  const deliverable = objectValue(value)
  const answersValue = objectValue(deliverable.answers)
  const answers = Object.fromEntries(
    BASIC_INTERVIEW_QUESTION_IDS.map((id) => {
      const answer = objectValue(answersValue[id])
      return [
        id,
        {
          text: textValue(answer.text),
          durationSeconds: numberValue(answer.durationSeconds),
          selfRating: Math.min(5, numberValue(answer.selfRating)),
        },
      ]
    }),
  ) as Record<BasicInterviewQuestionId, BasicInterviewAnswer>

  const evaluationValue = objectValue(deliverable.evaluation)
  const evaluation = Object.fromEntries(
    BASIC_INTERVIEW_EVALUATION_IDS.map((id) => {
      const item = objectValue(evaluationValue[id])
      return [
        id,
        {
          rating: Math.min(5, numberValue(item.rating)),
          observation: textValue(item.observation),
        },
      ]
    }),
  ) as Record<BasicInterviewEvaluationId, BasicInterviewEvaluation>

  return {
    answers,
    evaluation,
    strongestAnswer: textValue(deliverable.strongestAnswer),
    weakestAnswer: textValue(deliverable.weakestAnswer),
    difficultQuestionLearning: textValue(deliverable.difficultQuestionLearning),
    nextPracticeAction: textValue(deliverable.nextPracticeAction),
    routeReflection: textValue(deliverable.routeReflection),
    readinessState: readinessValue(deliverable.readinessState),
  }
}

export function extractBasicInterviewContext(
  cvDeliverable: unknown,
  decoderDeliverable: unknown,
  answersDeliverable: unknown,
  firstSimulationDeliverable: unknown,
  difficultQuestionsDeliverable: unknown,
): BasicInterviewContext {
  const cv = objectValue(cvDeliverable)
  const decoder = objectValue(decoderDeliverable)
  const answers = objectValue(answersDeliverable)
  const simulation = objectValue(firstSimulationDeliverable)
  const difficult = objectValue(difficultQuestionsDeliverable)
  const riskPlans = Array.isArray(difficult.riskPlans) ? difficult.riskPlans : []
  const weaknessPlan = riskPlans
    .map(objectValue)
    .find((plan) => plan.riskId === 'weakness')

  const fullName = textValue(cv.fullName)
  const targetRole = textValue(decoder.jobTitle) || textValue(cv.targetRole)
  const company = textValue(decoder.company)
  const prioritySignals = [
    ...stringList(decoder.priorityKeywords),
    ...stringList(decoder.mustHaveRequirements),
  ]
  const approvedIntroduction = textValue(answers.selfIntroduction)
  const approvedMotivation = textValue(answers.motivation)
  const previousWeakestAnswer = textValue(simulation.weakestAnswer)
  const previousImprovementAction = textValue(simulation.improvementAction)
  const preparedWeaknessAnswer = textValue(weaknessPlan?.fullAnswer)
  const remainingRisk = textValue(difficult.remainingRisk)

  return {
    fullName,
    targetRole,
    company,
    prioritySignals,
    approvedIntroduction,
    approvedMotivation,
    previousWeakestAnswer,
    previousImprovementAction,
    preparedWeaknessAnswer,
    remainingRisk,
    available: Boolean(
      fullName ||
        targetRole ||
        company ||
        prioritySignals.length ||
        approvedIntroduction ||
        previousWeakestAnswer ||
        preparedWeaknessAnswer,
    ),
  }
}

export function countBasicInterviewWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length
}

export function hasBasicInterviewRedFlag(value: string): boolean {
  return hasDifficultRedFlag(value) || /no tengo preguntas|no sé qué preguntar/i.test(value)
}

export function countBasicInterviewContextOverlap(
  draft: BasicInterviewDraft,
  context?: BasicInterviewContext | null,
): number {
  if (!context?.available) return 0
  const candidateText = normalizeCoachText(
    [
      ...BASIC_INTERVIEW_QUESTION_IDS.map((id) => draft.answers[id].text),
      ...BASIC_INTERVIEW_EVALUATION_IDS.map((id) => draft.evaluation[id].observation),
      draft.nextPracticeAction,
      draft.routeReflection,
    ].join(' '),
  )
  const signals = [
    context.targetRole,
    context.company,
    ...context.prioritySignals,
    context.previousWeakestAnswer,
    context.previousImprovementAction,
    context.remainingRisk,
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

export const SAMPLE_BASIC_INTERVIEW_DRAFT: BasicInterviewDraft = {
  answers: {
    warmup: {
      text: 'Muy bien, gracias por recibirme. Estoy preparado para conversar sobre la oportunidad.',
      durationSeconds: 11,
      selfRating: 4,
    },
    introduction: {
      text: 'Soy profesional de operaciones con experiencia coordinando equipos comerciales y técnicos. Convierto procesos complejos en planes claros, responsables e indicadores visibles. Busco aportar esa capacidad en una jefatura de operaciones con foco en continuidad y mejora.',
      durationSeconds: 39,
      selfRating: 4,
    },
    careerWalk: {
      text: 'Comencé en funciones de análisis y progresivamente asumí coordinación de proyectos transversales. En mi etapa más reciente integré información comercial y operativa, definí responsables y construí tableros de seguimiento. Ese recorrido me permitió combinar análisis, comunicación ejecutiva y ejecución disciplinada, que son las capacidades que quiero profundizar en esta jefatura.',
      durationSeconds: 72,
      selfRating: 4,
    },
    currentRole: {
      text: 'Mi responsabilidad principal es coordinar decisiones entre áreas, anticipar riesgos y asegurar seguimiento. En un proyecto reciente implementé alertas semanales y redujimos 22% los atrasos, entregando mayor visibilidad a la gerencia.',
      durationSeconds: 47,
      selfRating: 4,
    },
    motivation: {
      text: 'Me interesa el rol porque combina coordinación transversal, indicadores y mejora continua. La empresa necesita una operación más predecible y esa prioridad se conecta directamente con mi experiencia ordenando responsables, riesgos y seguimiento.',
      durationSeconds: 42,
      selfRating: 4,
    },
    departure: {
      text: 'Valoro lo aprendido en mi posición actual y busco una etapa con mayor responsabilidad transversal. No estoy escapando de un problema; esta oportunidad se alinea mejor con el impacto que quiero construir y con mi experiencia en coordinación operativa.',
      durationSeconds: 44,
      selfRating: 4,
    },
    achievement: {
      text: 'Situación: un proyecto crítico acumulaba atrasos y no tenía responsables visibles. Tarea: recuperar control sin detener la operación. Acción: definí hitos, responsables y alertas semanales, además de un tablero para la gerencia. Resultado: redujimos 22% los atrasos y mejoramos la predictibilidad del plan durante el trimestre siguiente.',
      durationSeconds: 75,
      selfRating: 5,
    },
    challenge: {
      text: 'Situación: dos áreas competían por los mismos recursos y el proyecto podía perder una fecha contractual. Tarea: construir una prioridad compartida. Acción: levanté restricciones, ordené dependencias y facilité un acuerdo con responsables. Resultado: recuperamos dos semanas del plan y evitamos una nueva escalada entre los equipos.',
      durationSeconds: 73,
      selfRating: 4,
    },
    teamwork: {
      text: 'En un proyecto transversal organicé una mesa semanal con representantes comerciales, técnicos y financieros. Mi aporte fue traducir necesidades distintas en decisiones, responsables y fechas. El equipo redujo 18% los reprocesos y mantuvo los acuerdos visibles para todas las áreas.',
      durationSeconds: 61,
      selfRating: 4,
    },
    weakness: {
      text: 'Una debilidad real era revisar demasiado los entregables críticos. Entendí que eso podía limitar la autonomía y retrasar decisiones. Implementé criterios de calidad previos y revisiones por excepción; así redujimos 30% el tiempo de aprobación sin aumentar errores.',
      durationSeconds: 54,
      selfRating: 4,
    },
    candidateQuestions: {
      text: '¿Cuáles son los resultados más importantes para esta posición durante los primeros seis meses? ¿Qué coordinación entre áreas representa hoy el principal desafío para el equipo?',
      durationSeconds: 31,
      selfRating: 5,
    },
    closing: {
      text: 'Gracias por la conversación. El desafío me interesa y creo que mi experiencia coordinando equipos, indicadores y riesgos puede aportar mayor predictibilidad desde el inicio.',
      durationSeconds: 25,
      selfRating: 4,
    },
  },
  evaluation: {
    clarity: {
      rating: 4,
      observation: 'Las respuestas mantuvieron una idea principal y evitaron explicaciones laterales innecesarias.',
    },
    structure: {
      rating: 4,
      observation: 'Los ejemplos conductuales usaron situación, acción personal y resultado de forma reconocible.',
    },
    relevance: {
      rating: 5,
      observation: 'La mayoría de las respuestas se conectó con coordinación transversal, indicadores y predictibilidad.',
    },
    confidence: {
      rating: 4,
      observation: 'El tono fue firme y directo, aunque puedo sostener mejor la pausa antes de responder preguntas difíciles.',
    },
    authenticity: {
      rating: 4,
      observation: 'Las respuestas incluyeron límites reales, responsabilidad personal y evidencia verificable.',
    },
  },
  strongestAnswer:
    'La respuesta sobre el logro fue la más sólida porque mostró contexto, acción propia, resultado cuantitativo y conexión directa con el rol.',
  weakestAnswer:
    'La explicación de trayectoria todavía puede ser más breve y priorizar solo las transiciones que justifican esta postulación.',
  difficultQuestionLearning:
    'La pregunta de debilidad funcionó mejor cuando nombré un impacto real, expliqué el cambio aplicado y mostré progreso sin presentar una falsa fortaleza.',
  nextPracticeAction:
    'Repetir la trayectoria profesional en menos de 70 segundos y cerrar cada transición con la competencia que aporta a la jefatura de operaciones.',
  routeReflection:
    'El recorrido permitió transformar experiencia dispersa en evidencia, respuestas y práctica observable. La misión final mostró coherencia entre CV, oferta, motivación, logros y preguntas difíciles. Mi siguiente foco será mantener esta estructura en entrevistas reales sin memorizar frases completas y registrar aprendizajes después de cada conversación.',
  readinessState: 'targeted-practice',
}
