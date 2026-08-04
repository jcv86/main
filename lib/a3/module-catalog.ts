export type A3ModuleId =
  | 'career-mirror'
  | 'value-mining-lab'
  | 'cv-builder-studio'
  | 'job-decoder'
  | 'answer-architecture'
  | 'coach-practice-room'
  | 'communication-gym'
  | 'first-recruiter-simulation'
  | 'risk-difficult-questions-lab'
  | 'basic-interview-mission'

export type A3TrainingType = 'coach' | 'interviewer'
export type A3ValidationMode = 'coach' | 'cv_builder'

export interface A3ModuleDefinition {
  id: A3ModuleId
  number: number
  title: string
  xp: number
  checkpointDay: number
  route: string
  trainingType: A3TrainingType
  requiredPreviousModules: readonly A3ModuleId[]
  completionContract: {
    enabled: boolean
    validationMode?: A3ValidationMode
    minimumResponses: number
    minimumResponseLength: number
    requiredDeliverableKeys: readonly string[]
    passScore: number
  }
}

export const A3_MODULES: readonly A3ModuleDefinition[] = [
  {
    id: 'career-mirror',
    number: 1,
    title: 'Espejo de Carrera',
    xp: 80,
    checkpointDay: 7,
    route: '/despega/a3/career-mirror',
    trainingType: 'coach',
    requiredPreviousModules: [],
    completionContract: {
      enabled: true,
      validationMode: 'coach',
      minimumResponses: 4,
      minimumResponseLength: 20,
      requiredDeliverableKeys: [
        'careerDirection',
        'professionalIdentity',
        'coreValues',
        'personalBrand',
      ],
      passScore: 75,
    },
  },
  {
    id: 'value-mining-lab',
    number: 2,
    title: 'Laboratorio de Minería de Valor',
    xp: 100,
    checkpointDay: 16,
    route: '/despega/a3/value-mining-lab',
    trainingType: 'coach',
    requiredPreviousModules: ['career-mirror'],
    completionContract: {
      enabled: true,
      validationMode: 'coach',
      minimumResponses: 4,
      minimumResponseLength: 20,
      requiredDeliverableKeys: [
        'projectValue',
        'criticalValue',
        'futureApplication',
        'nextAction',
      ],
      passScore: 75,
    },
  },
  {
    id: 'cv-builder-studio',
    number: 3,
    title: 'Estudio Constructor de CV',
    xp: 120,
    checkpointDay: 27,
    route: '/despega/a3/cv-builder-studio',
    trainingType: 'coach',
    requiredPreviousModules: ['career-mirror', 'value-mining-lab'],
    completionContract: {
      enabled: true,
      validationMode: 'cv_builder',
      minimumResponses: 0,
      minimumResponseLength: 0,
      requiredDeliverableKeys: [
        'fullName',
        'email',
        'phone',
        'location',
        'targetRole',
        'targetKeywords',
        'professionalSummary',
        'experienceTitle',
        'experienceCompany',
        'experienceDates',
        'achievement1',
        'achievement2',
        'achievement3',
        'skills',
        'atsChecklist',
      ],
      passScore: 75,
    },
  },
  {
    id: 'job-decoder',
    number: 4,
    title: 'Decodificador de Ofertas',
    xp: 100,
    checkpointDay: 35,
    route: '/despega/a3/job-decoder',
    trainingType: 'coach',
    requiredPreviousModules: [
      'career-mirror',
      'value-mining-lab',
      'cv-builder-studio',
    ],
    completionContract: {
      enabled: false,
      minimumResponses: 0,
      minimumResponseLength: 0,
      requiredDeliverableKeys: [],
      passScore: 75,
    },
  },
  {
    id: 'answer-architecture',
    number: 5,
    title: 'Arquitectura de Respuestas',
    xp: 120,
    checkpointDay: 43,
    route: '/despega/a3/answer-architecture',
    trainingType: 'coach',
    requiredPreviousModules: [
      'career-mirror',
      'value-mining-lab',
      'cv-builder-studio',
      'job-decoder',
    ],
    completionContract: {
      enabled: false,
      minimumResponses: 0,
      minimumResponseLength: 0,
      requiredDeliverableKeys: [],
      passScore: 75,
    },
  },
  {
    id: 'coach-practice-room',
    number: 6,
    title: 'Sala de Práctica del Coach',
    xp: 130,
    checkpointDay: 51,
    route: '/despega/a3/coach-practice-room',
    trainingType: 'coach',
    requiredPreviousModules: [
      'career-mirror',
      'value-mining-lab',
      'cv-builder-studio',
      'job-decoder',
      'answer-architecture',
    ],
    completionContract: {
      enabled: false,
      minimumResponses: 0,
      minimumResponseLength: 0,
      requiredDeliverableKeys: [],
      passScore: 75,
    },
  },
  {
    id: 'communication-gym',
    number: 7,
    title: 'Gimnasio de Comunicación',
    xp: 140,
    checkpointDay: 58,
    route: '/despega/a3/communication-gym',
    trainingType: 'coach',
    requiredPreviousModules: [
      'career-mirror',
      'value-mining-lab',
      'cv-builder-studio',
      'job-decoder',
      'answer-architecture',
      'coach-practice-room',
    ],
    completionContract: {
      enabled: false,
      minimumResponses: 0,
      minimumResponseLength: 0,
      requiredDeliverableKeys: [],
      passScore: 75,
    },
  },
  {
    id: 'first-recruiter-simulation',
    number: 8,
    title: 'Primera Simulación con Reclutador',
    xp: 160,
    checkpointDay: 68,
    route: '/despega/a3/first-recruiter-simulation',
    trainingType: 'interviewer',
    requiredPreviousModules: [
      'career-mirror',
      'value-mining-lab',
      'cv-builder-studio',
      'job-decoder',
      'answer-architecture',
      'coach-practice-room',
      'communication-gym',
    ],
    completionContract: {
      enabled: false,
      minimumResponses: 0,
      minimumResponseLength: 0,
      requiredDeliverableKeys: [],
      passScore: 75,
    },
  },
  {
    id: 'risk-difficult-questions-lab',
    number: 9,
    title: 'Laboratorio de Preguntas Difíciles',
    xp: 170,
    checkpointDay: 78,
    route: '/despega/a3/risk-difficult-questions-lab',
    trainingType: 'interviewer',
    requiredPreviousModules: [
      'career-mirror',
      'value-mining-lab',
      'cv-builder-studio',
      'job-decoder',
      'answer-architecture',
      'coach-practice-room',
      'communication-gym',
      'first-recruiter-simulation',
    ],
    completionContract: {
      enabled: false,
      minimumResponses: 0,
      minimumResponseLength: 0,
      requiredDeliverableKeys: [],
      passScore: 75,
    },
  },
  {
    id: 'basic-interview-mission',
    number: 10,
    title: 'Misión de Entrevista Básica',
    xp: 220,
    checkpointDay: 88,
    route: '/despega/a3/basic-interview-mission',
    trainingType: 'interviewer',
    requiredPreviousModules: [
      'career-mirror',
      'value-mining-lab',
      'cv-builder-studio',
      'job-decoder',
      'answer-architecture',
      'coach-practice-room',
      'communication-gym',
      'first-recruiter-simulation',
      'risk-difficult-questions-lab',
    ],
    completionContract: {
      enabled: false,
      minimumResponses: 0,
      minimumResponseLength: 0,
      requiredDeliverableKeys: [],
      passScore: 75,
    },
  },
] as const

const ALIASES: Record<string, A3ModuleId> = {
  'module-1': 'career-mirror',
  'module-2': 'value-mining-lab',
  'module-3': 'cv-builder-studio',
  'module-4': 'job-decoder',
  'module-5': 'answer-architecture',
  'module-6': 'coach-practice-room',
  'module-7': 'communication-gym',
  'module-8': 'first-recruiter-simulation',
  'module-9': 'risk-difficult-questions-lab',
  'module-10': 'basic-interview-mission',
  'career-mirror-coach': 'career-mirror',
  'value-mining-lab-coach': 'value-mining-lab',
}

export const A3_MODULE_IDS = A3_MODULES.map((module) => module.id)
export const A3_TOTAL_XP = A3_MODULES.reduce((sum, module) => sum + module.xp, 0)

export function normalizeA3ModuleId(value: unknown): A3ModuleId | null {
  if (typeof value !== 'string') return null
  const normalized = ALIASES[value] || value
  return A3_MODULE_IDS.includes(normalized as A3ModuleId)
    ? (normalized as A3ModuleId)
    : null
}

export function getA3Module(value: unknown): A3ModuleDefinition | null {
  const id = normalizeA3ModuleId(value)
  return id ? A3_MODULES.find((module) => module.id === id) || null : null
}

export function getA3ModuleByNumber(number: number): A3ModuleDefinition | null {
  return A3_MODULES.find((module) => module.number === number) || null
}
