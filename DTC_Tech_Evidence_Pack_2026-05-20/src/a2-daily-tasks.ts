'use client'

// A2 Daily Task Framework - Personalized Roadmap Engine
// Task types: Learning, Practice, Simulation, Market Action, Networking, Planning, Certification, Milestone

export type TaskType = 'learning' | 'practice' | 'simulation' | 'market-action' | 'networking' | 'planning' | 'certification' | 'milestone'

export interface A2DailyTask {
  id: string
  day: number
  type: TaskType
  title: string
  description: string
  duration: number // minutes
  priority: 'high' | 'medium' | 'low'
  connectedModule?: string // A3 module ID if applicable
  actions: {
    action: string
    tip: string
  }[]
  successCriteria: string[]
  xpReward: number
  relatedRealWorldAction?: string // e.g., "Apply to 5 companies"
  checklistItems: string[]
}

export interface A2TaskPhase {
  phase: 'foundation' | 'acceleration' | 'mastery'
  startDay: number
  endDay: number
  milestone: string
  description: string
  xpTarget: number
  tasksCount: number
}

// Sample A2 Daily Tasks Framework (Day 1-30 Foundation Phase)
const A2_DAILY_TASKS: Record<number, A2DailyTask> = {
  1: {
    id: 'day-1-vision',
    day: 1,
    type: 'planning',
    title: 'Define tu visión y roadmap (90 días)',
    description: 'Crea documento estructurado con objetivo profesional, hitos clave y timeline realista.',
    duration: 45,
    priority: 'high',
    connectedModule: 'career-mirror',
    actions: [
      { action: 'Escribe tu visión profesional', tip: 'Sé específico: rol, empresa, salario, ubicación en 3 años' },
      { action: 'Define 3 hitos (30/60/90 días)', tip: 'Qué necesitas lograr en cada milestone' },
      { action: 'Crea plan de acciones', tip: 'Desglosaa en acciones semanales' }
    ],
    successCriteria: [
      '✓ Visión escrita y clara',
      '✓ 3 hitos definidos con fechas',
      '✓ Plan en Notion o similar'
    ],
    xpReward: 50,
    relatedRealWorldAction: 'Create structured goal document',
    checklistItems: [
      'Vision statement written',
      '30/60/90 milestones defined',
      'Weekly action plan created'
    ]
  },
  2: {
    id: 'day-2-linkedin-cv',
    day: 2,
    type: 'planning',
    title: 'Optimiza tu CV y LinkedIn',
    description: 'Actualiza ambos documentos con palabras clave del rol objetivo y logros cuantitativos.',
    duration: 75,
    priority: 'high',
    connectedModule: 'cv-builder-studio',
    actions: [
      { action: 'Actualiza CV con palabras clave', tip: 'Incorpora skills relevantes, logros cuantitativos' },
      { action: 'Optimiza LinkedIn', tip: 'Foto profesional, headline claro, descripción compelling' },
      { action: 'Pide retroalimentación', tip: 'Comparte con 2-3 personas para opiniones' }
    ],
    successCriteria: [
      '✓ CV actualizado con keywords',
      '✓ LinkedIn optimizado completamente',
      '✓ Feedback obtenido'
    ],
    xpReward: 60,
    relatedRealWorldAction: 'Have documents ready for applications',
    checklistItems: [
      'CV updated with keywords',
      'LinkedIn headline optimized',
      'Profile picture is professional',
      'Feedback received'
    ]
  },
  3: {
    id: 'day-3-market-research',
    day: 3,
    type: 'learning',
    title: 'Investiga el mercado y rol objetivo',
    description: 'Analiza salarios, skills requeridas, empresas relevantes y ofertas del rol que buscas.',
    duration: 75,
    priority: 'high',
    actions: [
      { action: 'Analiza 5-10 descripciones de rol', tip: 'Extrae skills comunes, requisitos, nivel' },
      { action: 'Investiga salarios por nivel', tip: 'Usa Glassdoor, Levels.fyi, Payscale' },
      { action: 'Crea lista de 20+ empresas objetivo', tip: 'Donde quieres trabajar' }
    ],
    successCriteria: [
      '✓ Job descriptions analizadas',
      '✓ Salarios investigados',
      '✓ Empresas objetivo listadas'
    ],
    xpReward: 55,
    relatedRealWorldAction: 'Know your target market inside-out',
    checklistItems: [
      '5-10 job descriptions analyzed',
      'Salary ranges documented',
      '20+ target companies listed'
    ]
  },
  4: {
    id: 'day-4-skills-audit',
    day: 4,
    type: 'planning',
    title: 'Auditoría de tus skills actuales',
    description: 'Evaluación honesta de qué sabes, qué te falta y en qué eres especialista.',
    duration: 60,
    priority: 'high',
    connectedModule: 'career-mirror',
    actions: [
      { action: 'Lista tus skills actuales', tip: 'Categoriza por nivel (expert, intermediate, beginner)' },
      { action: 'Compara con job descriptions', tip: 'Qué skills requiere vs lo que tienes' },
      { action: 'Prioriza gaps críticos', tip: 'Top 3 skills que DEBES aprender' }
    ],
    successCriteria: [
      '✓ Skills listados y categorizados',
      '✓ Gaps identificados',
      '✓ Top 3 prioridades definidas'
    ],
    xpReward: 50,
    relatedRealWorldAction: 'Identify learning priorities',
    checklistItems: [
      'Current skills documented',
      'Gaps identified clearly',
      'Top 3 skills to learn prioritized'
    ]
  },
  5: {
    id: 'day-5-learning-start',
    day: 5,
    type: 'learning',
    title: 'Busca e inicia curso/recurso principal',
    description: 'Elige y comienza el principal recurso de aprendizaje para cerrar tus gaps de skills.',
    duration: 60,
    priority: 'high',
    actions: [
      { action: 'Busca 3-5 cursos relevantes', tip: 'Udemy, Coursera, LinkedIn Learning' },
      { action: 'Elige uno y regístrate', tip: 'El que mejor se alinee con tus gaps' },
      { action: 'Completa Lección 1', tip: 'Ve el primer módulo/capítulo' }
    ],
    successCriteria: [
      '✓ Curso elegido',
      '✓ Registrado y acceso confirmado',
      '✓ Lección 1 completada'
    ],
    xpReward: 60,
    relatedRealWorldAction: 'Start formal learning',
    checklistItems: [
      'Course selected',
      'Registered and have access',
      'First lesson completed'
    ]
  },
  7: {
    id: 'day-7-market-action-week1',
    day: 7,
    type: 'market-action',
    title: 'Inicia acción de búsqueda: Semana 1',
    description: 'Pon en movimiento las acciones de búsqueda. Primer contacto con mercado.',
    duration: 65,
    priority: 'high',
    actions: [
      { action: 'Aplica a 3 posiciones', tip: 'De tu lista de empresas objetivo' },
      { action: 'Contacta 5 personas en LinkedIn', tip: 'Personalizado, sin copy-paste' },
      { action: 'Documenta acciones', tip: 'Crea tracker en Google Sheets o Notion' }
    ],
    successCriteria: [
      '✓ 3 aplicaciones enviadas',
      '✓ 5 conexiones iniciadas',
      '✓ Tracker creado'
    ],
    xpReward: 70,
    relatedRealWorldAction: 'Apply to 3 companies, reach out to 5 people',
    checklistItems: [
      '3 applications submitted',
      '5 personalized LinkedIn messages sent',
      'Tracking spreadsheet created'
    ]
  },
  8: {
    id: 'day-8-checkpoint-week1',
    day: 8,
    type: 'planning',
    title: 'Revisión Semana 1: Checkpoint',
    description: 'Pausa para evaluar qué funcionó y ajustar si es necesario.',
    duration: 50,
    priority: 'medium',
    actions: [
      { action: 'Revisa aplicaciones y respuestas', tip: 'Quién respondió? Feedback?' },
      { action: 'Mide KPIs de semana 1', tip: 'Aplicaciones, conexiones, entrevistas' },
      { action: 'Ajusta estrategia si es necesario', tip: 'Dobla volumen? Cambio de enfoque?' }
    ],
    successCriteria: [
      '✓ Semana revisada',
      '✓ KPIs medidos',
      '✓ Ajustes documentados'
    ],
    xpReward: 40,
    relatedRealWorldAction: 'Weekly review and optimization',
    checklistItems: [
      'Week 1 metrics calculated',
      'Response analysis complete',
      'Strategy adjustments documented'
    ]
  },
  15: {
    id: 'day-15-interview-prep',
    day: 15,
    type: 'practice',
    title: 'Entrevistas de práctica y preparación',
    description: 'Realiza 2-3 entrevistas de práctica para ganar confianza.',
    duration: 120,
    priority: 'high',
    connectedModule: 'basic-interview-mission',
    actions: [
      { action: 'Prepara 3 historias STAR', tip: 'Situación, Tarea, Acción, Resultado' },
      { action: 'Agenda 2-3 entrevistas de práctica', tip: 'Con mentores o amigos' },
      { action: 'Realiza las entrevistas', tip: 'Vístete profesional, toma notas' }
    ],
    successCriteria: [
      '✓ Historias STAR preparadas',
      '✓ Entrevistas de práctica completadas',
      '✓ Retroalimentación documentada'
    ],
    xpReward: 80,
    relatedRealWorldAction: 'Practice interviews with real feedback',
    checklistItems: [
      '3 STAR stories prepared',
      '2-3 practice interviews completed',
      'Feedback documented'
    ]
  },
  30: {
    id: 'day-30-milestone-foundation',
    day: 30,
    type: 'milestone',
    title: 'Hito 30 Días: Foundation Completa',
    description: 'Celebra el primer mes. Tienes los fundamentos listos para el siguiente nivel.',
    duration: 90,
    priority: 'high',
    actions: [
      { action: 'Revisa todo lo completado', tip: 'CV, LinkedIn, primeras aplicaciones, networking' },
      { action: 'Celebra los logros', tip: 'Reconoce el progreso hecho' },
      { action: 'Prepárate para Acceleration Phase', tip: 'Intensifica el ritmo' }
    ],
    successCriteria: [
      '✓ 30 días completados',
      '✓ Fundamentals en lugar',
      '✓ 50+ aplicaciones enviadas',
      '✓ 30+ conexiones iniciadas',
      '✓ Entrevistas práctica completadas'
    ],
    xpReward: 100,
    relatedRealWorldAction: 'Complete 30-day foundation challenge',
    checklistItems: [
      'Documents optimized',
      '50+ applications sent',
      '30+ connections made',
      'Practice interviews done',
      'Daily actions tracked'
    ]
  }
}

// A2 Route Progress Metrics
export interface A2RouteProgress {
  userId: string
  currentDay: number
  currentPhase: 'foundation' | 'acceleration' | 'mastery'
  completedTasks: number
  totalTasks: number
  xpEarned: number
  xpTarget: number
  applicationsSubmitted: number
  applicationsTarget: number
  connectionsInitiated: number
  connectionsTarget: number
  interviewsCompleted: number
  interviewsTarget: number
  offersReceived: number
  lastUpdated: string
}

export function getA2DailyTask(day: number): A2DailyTask | undefined {
  return A2_DAILY_TASKS[day]
}

export function getA2RoutePhase(day: number): A2TaskPhase {
  if (day <= 30) {
    return {
      phase: 'foundation',
      startDay: 1,
      endDay: 30,
      milestone: '30-Day Foundation',
      description: 'Build fundamentals: CV, LinkedIn, market research, initial outreach',
      xpTarget: 500,
      tasksCount: 15
    }
  } else if (day <= 60) {
    return {
      phase: 'acceleration',
      startDay: 31,
      endDay: 60,
      milestone: '60-Day Acceleration',
      description: 'Scale actions: More applications, deeper interviews, skill building',
      xpTarget: 500,
      tasksCount: 15
    }
  } else {
    return {
      phase: 'mastery',
      startDay: 61,
      endDay: 90,
      milestone: '90-Day Mastery',
      description: 'Close deals: Negotiate offers, finalize next role',
      xpTarget: 340,
      tasksCount: 10
    }
  }
}

export const A2_TASK_TYPES_INFO = {
  'learning': {
    label: 'Learning',
    color: 'bg-blue-500/20 text-blue-300',
    icon: '📚'
  },
  'practice': {
    label: 'Practice',
    color: 'bg-purple-500/20 text-purple-300',
    icon: '🎯'
  },
  'simulation': {
    label: 'Simulation',
    color: 'bg-pink-500/20 text-pink-300',
    icon: '🎬'
  },
  'market-action': {
    label: 'Real-World Action',
    color: 'bg-green-500/20 text-green-300',
    icon: '🚀'
  },
  'networking': {
    label: 'Networking',
    color: 'bg-cyan-500/20 text-cyan-300',
    icon: '🤝'
  },
  'planning': {
    label: 'Planning',
    color: 'bg-orange-500/20 text-orange-300',
    icon: '📋'
  },
  'certification': {
    label: 'Certification',
    color: 'bg-yellow-500/20 text-yellow-300',
    icon: '🏆'
  },
  'milestone': {
    label: 'Milestone',
    color: 'bg-red-500/20 text-red-300',
    icon: '🎉'
  }
}
