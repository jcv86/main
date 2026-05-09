// Mock data for A3 Dashboard - DTC Entrenamiento Intensivo
// This will be replaced with real Supabase data later

export interface Milestone {
  id: string
  title: string
  completed: boolean
  xp: number
}

export interface Module {
  id: string
  level: number
  title: string
  status: 'available' | 'in_progress' | 'completed' | 'locked'
  xp: number
  maxXp: number
  progress: number
  description: string
  milestones?: Milestone[]
  unlockText?: string
  icon?: string
}

export interface Skill {
  id: string
  name: string
  value: number
  maxValue: number
  description: string
}

export interface Badge {
  id: string
  title: string
  description: string
  unlocked: boolean
  icon: string
}

export interface DashboardState {
  currentLevel: string
  progressPct: number
  totalXp: number
  maxXp: number
  nextMilestone: string
  nextReward: string
  completedModules: number
  totalModules: number
  skills: Skill[]
  modules: Module[]
  badges: Badge[]
}

// Mock data - simulating a user with some progress
export const mockDashboardData: DashboardState = {
  currentLevel: 'Auditoría Inicial',
  progressPct: 12,
  totalXp: 120,
  maxXp: 1000,
  nextMilestone: 'Completar Entrevista 0',
  nextReward: 'Desbloqueas Método STAR + CV Inteligente + Análisis de Vacante',
  completedModules: 1,
  totalModules: 9,
  
  skills: [
    {
      id: 'presencia',
      name: 'Presencia',
      value: 35,
      maxValue: 100,
      description: 'Cámara, luz, postura y entorno'
    },
    {
      id: 'claridad',
      name: 'Claridad',
      value: 10,
      maxValue: 100,
      description: 'Capacidad de responder con foco'
    },
    {
      id: 'estructura',
      name: 'Estructura',
      value: 0,
      maxValue: 100,
      description: 'Orden narrativo y Método STAR'
    },
    {
      id: 'preparacion',
      name: 'Preparación',
      value: 25,
      maxValue: 100,
      description: 'CV, vacante y contexto'
    },
    {
      id: 'manejo-presion',
      name: 'Manejo de Presión',
      value: 0,
      maxValue: 100,
      description: 'Preguntas difíciles y simulación'
    }
  ],
  
  modules: [
    // NIVEL 1: Auditoría Inicial
    {
      id: 'auditoria-inicial',
      level: 1,
      title: 'Entrevista 0 / Auditoría Inicial',
      status: 'in_progress',
      xp: 40,
      maxXp: 100,
      progress: 60,
      description: 'Revisa cámara, luz, audio, fondo y presencia antes de practicar.',
      icon: 'video',
      milestones: [
        { id: 'm1', title: 'Cámara lista', completed: true, xp: 10 },
        { id: 'm2', title: 'Audio listo', completed: true, xp: 10 },
        { id: 'm3', title: 'Luz y fondo revisados', completed: true, xp: 10 },
        { id: 'm4', title: 'Presencia revisada', completed: false, xp: 10 },
        { id: 'm5', title: 'Feedback inicial generado', completed: false, xp: 40 }
      ]
    },
    
    // NIVEL 2: Herramientas de Preparación
    {
      id: 'metodo-star',
      level: 2,
      title: 'Método STAR',
      status: 'locked',
      xp: 0,
      maxXp: 120,
      progress: 0,
      description: 'Construye respuestas con situación, tarea, acción y resultado.',
      icon: 'star',
      unlockText: 'Completa Entrevista 0 para desbloquear.'
    },
    {
      id: 'cv-inteligente',
      level: 2,
      title: 'CV Inteligente',
      status: 'locked',
      xp: 0,
      maxXp: 120,
      progress: 0,
      description: 'Prepara un CV alineado a evidencia y formato ATS.',
      icon: 'document',
      unlockText: 'Completa Entrevista 0 para desbloquear.'
    },
    {
      id: 'analisis-vacante',
      level: 2,
      title: 'Análisis de Vacante',
      status: 'locked',
      xp: 0,
      maxXp: 120,
      progress: 0,
      description: 'Analiza una oferta laboral y detecta coincidencias, brechas y focos de entrevista.',
      icon: 'target',
      unlockText: 'Completa Entrevista 0 para desbloquear.'
    },
    {
      id: 'analisis-multicanal',
      level: 2,
      title: 'Análisis Multicanal',
      status: 'locked',
      xp: 0,
      maxXp: 120,
      progress: 0,
      description: 'Conecta empresa, cargo, CV, LinkedIn y contexto antes de entrevistar.',
      icon: 'network',
      unlockText: 'Completa Entrevista 0 para desbloquear.'
    },
    
    // NIVEL 3: Entrenamientos Progresivos
    {
      id: 'entrevista-guiada',
      level: 3,
      title: 'Entrevista Guiada',
      status: 'locked',
      xp: 0,
      maxXp: 120,
      progress: 0,
      description: 'Practica con ayuda paso a paso y feedback formativo.',
      icon: 'help',
      unlockText: 'Completa 2 herramientas de preparación para desbloquear.'
    },
    {
      id: 'entrevista-estructurada',
      level: 3,
      title: 'Entrevista Estructurada',
      status: 'locked',
      xp: 0,
      maxXp: 120,
      progress: 0,
      description: 'Responde preguntas por competencia con estructura y evidencia.',
      icon: 'list',
      unlockText: 'Completa 2 herramientas de preparación para desbloquear.'
    },
    {
      id: 'entrevista-desafiante',
      level: 3,
      title: 'Entrevista Desafiante',
      status: 'locked',
      xp: 0,
      maxXp: 120,
      progress: 0,
      description: 'Entrena preguntas difíciles, presión y manejo de incomodidad.',
      icon: 'zap',
      unlockText: 'Completa 2 herramientas de preparación para desbloquear.'
    },
    {
      id: 'entrevista-conversacional',
      level: 3,
      title: 'Entrevista Conversacional',
      status: 'locked',
      xp: 0,
      maxXp: 120,
      progress: 0,
      description: 'Simula una conversación más natural, flexible y realista.',
      icon: 'chat',
      unlockText: 'Completa 2 herramientas de preparación para desbloquear.'
    },
    
    // NIVEL 4: Simulación Real
    {
      id: 'simulacion-completa',
      level: 4,
      title: 'Simulación Completa',
      status: 'locked',
      xp: 0,
      maxXp: 150,
      progress: 0,
      description: 'Simulación end-to-end que replica una entrevista real con todos los desafíos.',
      icon: 'target',
      unlockText: 'Completa 2 entrenamientos progresivos para desbloquear.'
    }
  ],
  
  badges: [
    {
      id: 'entorno-preparado',
      title: 'Entorno Preparado',
      description: 'Completaste la revisión básica de cámara, luz, audio y presencia.',
      unlocked: true,
      icon: 'camera'
    },
    {
      id: 'respuesta-estructurada',
      title: 'Respuesta Estructurada',
      description: 'Creaste tu primera respuesta STAR completa.',
      unlocked: false,
      icon: 'star'
    },
    {
      id: 'cv-modo-ats',
      title: 'CV en Modo ATS',
      description: 'Preparaste un CV alineado a estándares de Applicant Tracking System.',
      unlocked: false,
      icon: 'document'
    },
    {
      id: 'preparacion-contextual',
      title: 'Preparación Contextual',
      description: 'Realizaste análisis profundo de empresa, cargo y vacante.',
      unlocked: false,
      icon: 'analyze'
    },
    {
      id: 'primera-simulacion',
      title: 'Primera Simulación',
      description: 'Completaste tu primera simulación de entrevista.',
      unlocked: false,
      icon: 'play'
    },
    {
      id: 'manejo-presion',
      title: 'Manejo de Presión',
      description: 'Superaste la entrevista desafiante con éxito.',
      unlocked: false,
      icon: 'fire'
    },
    {
      id: 'mejora-detectada',
      title: 'Mejora Detectada',
      description: 'El análisis IA detectó mejora significativa en tu desempeño.',
      unlocked: false,
      icon: 'trending-up'
    },
    {
      id: 'listo-para-real',
      title: 'Listo para Entrevista Real',
      description: 'Alcanzaste el umbral mínimo de preparación para entrevistas reales.',
      unlocked: false,
      icon: 'target'
    }
  ]
}
