// Route Generator - Genera rutas personalizadas de 30/60/90 días

import { DiscProfile } from './disc-calculator'

export interface RouteActionItem {
  day: number
  title: string
  description: string
  type: 'learning' | 'practice' | 'networking' | 'planning' | 'milestone'
  resources?: string[]
  timeEstimate: number // minutes
}

export interface PersonalizedRoute {
  route_30days: RouteActionItem[]
  route_60days: RouteActionItem[]
  route_90days: RouteActionItem[]
  milestones: {
    day_30: string
    day_60: string
    day_90: string
  }
  successMetrics: string[]
}

export function generatePersonalizedRoute(
  discProfile: DiscProfile,
  objective: string,
  skills: string[],
  timePerWeek: number
): PersonalizedRoute {
  // Adapt route based on DISC profile
  const isD = discProfile.primary === 'D'
  const isI = discProfile.primary === 'I'
  const isS = discProfile.primary === 'S'
  const isC = discProfile.primary === 'C'

  const route_30days: RouteActionItem[] = [
    // Week 1: Foundation
    {
      day: 1,
      title: 'Define tu visión y roadmap',
      description: 'Crea un documento con tu objetivo, pasos clave y timeline',
      type: 'planning',
      timeEstimate: 120,
      resources: ['Notion Template', 'Goal Setting Framework']
    },
    {
      day: 3,
      title: 'Análisis del mercado y rol objetivo',
      description: 'Investigar empresas, roles similares, salarios, requerimientos',
      type: 'learning',
      timeEstimate: 180,
      resources: ['LinkedIn', 'Glassdoor', 'Industry Reports']
    },
    {
      day: 5,
      title: 'Audit de habilidades actuales',
      description: 'Evalúa qué sabes, qué falta, qué mejorar',
      type: 'planning',
      timeEstimate: 90,
      resources: ['Skills Assessment Tool']
    },
    {
      day: 7,
      title: `Sesión 1: ${isD ? 'Estrategia Agresiva' : isI ? 'Conexiones Clave' : isS ? 'Mentoría' : 'Análisis Profundo'}`,
      description: isD ? 'Identificar puntos de influencia' : isI ? 'Conectar con líderes en el área' : isS ? 'Buscar mentor o coach' : 'Deep dive en la teoría',
      type: 'networking',
      timeEstimate: 60
    },

    // Week 2: Start Learning
    {
      day: 10,
      title: `Iniciar curso/recurso principal para: ${skills[0] || 'habilidad clave'}`,
      description: 'Comenzar con el primer módulo del recurso seleccionado',
      type: 'learning',
      timeEstimate: 120
    },
    {
      day: 12,
      title: 'Crear tu perfil de marca personal',
      description: 'LinkedIn, portafolio, o presencia online relevante',
      type: 'practice',
      timeEstimate: 180
    },
    {
      day: 14,
      title: 'Semana 2: Checkpoint',
      description: 'Revisar progreso, ajustar si es necesario',
      type: 'planning',
      timeEstimate: 60
    },

    // Week 3-4: Practice
    {
      day: 17,
      title: `Proyecto práctico: Aplica ${skills[0] || 'conocimiento nuevo'}`,
      description: 'Crea algo pequeño pero real que demuestre aprendizaje',
      type: 'practice',
      timeEstimate: 240
    },
    {
      day: 21,
      title: 'Networking: Informational interviews',
      description: 'Conecta con 2-3 personas en tu rol objetivo',
      type: 'networking',
      timeEstimate: 120
    },
    {
      day: 28,
      title: 'Hito de 30 días: Revisión completa',
      description: 'Evalúa lo aprendido, ajusta plan para próximos 30 días',
      type: 'milestone',
      timeEstimate: 120
    }
  ]

  const route_60days: RouteActionItem[] = [
    {
      day: 31,
      title: `Profundizar en ${skills[1] || 'segunda habilidad'}`,
      description: 'Nivel intermedio del siguiente área de desarrollo',
      type: 'learning',
      timeEstimate: 180
    },
    {
      day: 35,
      title: 'Proyecto más complejo: Multi-skill',
      description: 'Proyecto que combine las habilidades aprendidas',
      type: 'practice',
      timeEstimate: 300
    },
    {
      day: 42,
      title: 'Participar en comunidad o grupo profesional',
      description: 'Unirse a meetups, grupo de estudio, o comunidad online',
      type: 'networking',
      timeEstimate: 120
    },
    {
      day: 49,
      title: 'Buscar oportunidades: Informar a contactos',
      description: 'Hacer seguimiento a contactos clave sobre tu progreso',
      type: 'networking',
      timeEstimate: 90
    },
    {
      day: 56,
      title: 'Evaluación de candidatura',
      description: 'Si aplica: revisar qué falta para ser candidato competitivo',
      type: 'planning',
      timeEstimate: 120
    },
    {
      day: 59,
      title: 'Hito de 60 días: Mid-course review',
      description: 'Celebra logros, reajusta estrategia para últimos 30 días',
      type: 'milestone',
      timeEstimate: 120
    }
  ]

  const route_90days: RouteActionItem[] = [
    {
      day: 61,
      title: `Especialización: ${skills[2] || 'tercera habilidad'}`,
      description: 'Alcanza nivel avanzado en área complementaria',
      type: 'learning',
      timeEstimate: 200
    },
    {
      day: 70,
      title: 'Proyecto capstone: Portfolio piece',
      description: 'Crea tu mejor trabajo para demostrar competencia',
      type: 'practice',
      timeEstimate: 400
    },
    {
      day: 77,
      title: 'Activación en el mercado',
      description: 'Aplicar a posiciones, hacer pitches a empresas, acelerar networking',
      type: 'networking',
      timeEstimate: 180
    },
    {
      day: 85,
      title: 'Preparación final para el rol',
      description: 'Entrevistas de práctica, revisión técnica, confianza',
      type: 'practice',
      timeEstimate: 150
    },
    {
      day: 89,
      title: 'Hito de 90 días: Celebración y próximos pasos',
      description: 'Evalúa transformación, planifica continuidad',
      type: 'milestone',
      timeEstimate: 120
    }
  ]

  return {
    route_30days,
    route_60days,
    route_90days,
    milestones: {
      day_30: `Has completado el foundation - conoces el rol, tienes plan, iniciaste aprendizaje`,
      day_60: `Tienes habilidades intermedias, proyectos completados, red de contactos establecida`,
      day_90: `Eres candidato competitivo, tienes portfolio, clara oportunidad de cambio`
    },
    successMetrics: [
      'Completar todos los módulos de aprendizaje planificados',
      'Crear 3+ proyectos prácticos que demuestren habilidades',
      'Conectar con 10+ personas en tu área objetivo',
      'Tener oferta de trabajo o clara oportunidad de ascenso',
      'Sentir confianza en tu nueva dirección profesional'
    ]
  }
}
