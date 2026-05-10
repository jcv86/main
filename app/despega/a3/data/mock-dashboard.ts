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

export interface DashboardState {
  totalXp: number
  maxXp: number
  modules: Module[]
  moduleStates?: { [key: string]: 'locked' | 'available' | 'in_progress' | 'completed' }
  completedModuleIds?: string[]
}

// Mock data - default state; real values come from /api/a3/user-progress
export const mockDashboardData: DashboardState = {
  totalXp: 0,
  maxXp: 280, // 70 per level x 4 levels

  modules: [
    // NIVEL 1: Auditoría Inicial
    {
      id: 'auditoria-inicial',
      level: 1,
      title: 'Entrevista 0 / Auditoría Inicial',
      status: 'completed',
      xp: 70,
      maxXp: 70,
      progress: 100,
      description: 'Auditoría completa: ambiente, presencia, audio y primer feedback. Tu coach te guía a través de una evaluación profesional antes de entrenar con simulaciones intensivas.',
      icon: 'video',
      milestones: [
        { id: 'm1', title: 'Auditoría de Entorno', completed: true, xp: 10 },
        { id: 'm2', title: 'Validación de Presencia', completed: true, xp: 10 },
        { id: 'm3', title: 'Prueba de Audio/Cámara', completed: true, xp: 10 },
        { id: 'm4', title: 'Pitch Inicial', completed: true, xp: 40 }
      ]
    },
    
    // NIVEL 2: Herramientas de Preparación
    {
      id: 'metodo-star',
      level: 2,
      title: 'Método STAR',
      status: 'available',
      xp: 0,
      maxXp: 120,
      progress: 0,
      description: 'Construye respuestas con situación, tarea, acción y resultado.',
      icon: 'star'
    },
    {
      id: 'cv-inteligente',
      level: 2,
      title: 'CV Inteligente',
      status: 'available',
      xp: 0,
      maxXp: 120,
      progress: 0,
      description: 'Prepara un CV alineado a evidencia y formato ATS.',
      icon: 'document'
    },
    {
      id: 'analisis-vacante',
      level: 2,
      title: 'Análisis de Vacante',
      status: 'available',
      xp: 0,
      maxXp: 120,
      progress: 0,
      description: 'Analiza una oferta laboral y detecta coincidencias, brechas y focos de entrevista.',
      icon: 'target'
    },
    {
      id: 'analisis-multicanal',
      level: 2,
      title: 'Análisis Multicanal',
      status: 'available',
      xp: 0,
      maxXp: 120,
      progress: 0,
      description: 'Conecta empresa, cargo, CV, LinkedIn y contexto antes de entrevistar.',
      icon: 'network'
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
  
  // Audit completed - Level 2 unlocked
  completedModuleIds: ['auditoria-inicial'],
  
  moduleStates: {
    'auditoria-inicial': 'completed',
    'metodo-star': 'available',
    'cv-inteligente': 'available',
    'analisis-vacante': 'available',
    'analisis-multicanal': 'available',
    'entrenamiento-guiado': 'locked',
    'entrenamiento-estructurado': 'locked',
    'entrenamiento-desafiante': 'locked',
    'entrenamiento-conversacional': 'locked',
    'simulacion-real': 'locked',
  },
}
