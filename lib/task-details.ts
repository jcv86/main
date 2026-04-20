// Task Details Database - Comprehensive breakdowns for each task
// Contains step-by-step instructions, examples, resources, and tips

export interface TaskStep {
  stepNumber: number
  title: string
  description: string
  duration: string // e.g., "15 min"
  tips?: string[]
  example?: string
}

export interface TaskResource {
  title: string
  type: 'template' | 'article' | 'course' | 'tool' | 'video' | 'framework'
  url: string
  duration?: string
  description?: string
}

export interface TaskDetail {
  day: number
  title: string
  fullDescription: string
  objective: string
  steps: TaskStep[]
  resources: TaskResource[]
  expectedOutput?: string
  commonMistakes?: string[]
  successCriteria?: string[]
}

export const TASK_DETAILS: Record<number, TaskDetail> = {
  // Day 1: Define vision and roadmap
  1: {
    day: 1,
    title: 'Define tu visión y roadmap',
    fullDescription: 'Crea un documento estructurado con tu objetivo profesional, los hitos clave para lograrlo y un timeline realista. Este será tu brújula para los próximos 90 días.',
    objective: 'Tener claridad total sobre qué quieres lograr y cómo lo vas a conseguir',
    steps: [
      {
        stepNumber: 1,
        title: 'Escribe tu visión profesional',
        description: 'Define dónde quieres estar en 3 años. Sé específico: industria, rol, empresa, ubicación.',
        duration: '10 min',
        tips: [
          'Piensa en qué tipo de trabajo te emociona',
          'Considera tu salario objetivo',
          'Visualiza un día típico en ese rol'
        ],
        example: 'Ej: "Product Manager en una startup tech de LatAm, liderando un equipo de 5 personas, con salario de $80k USD"'
      },
      {
        stepNumber: 2,
        title: 'Define los 3 hitos de 90 días',
        description: 'Identifica qué necesitas lograr en los días 30, 60 y 90 para acercarte a tu visión.',
        duration: '15 min',
        tips: [
          'Cada hito debe ser medible',
          'Deben ser progresivos',
          'Asegúrate de que son alcanzables'
        ],
        example: 'Día 30: CV actualizado + Perfil LinkedIn optimizado\nDía 60: 10 entrevistas completadas\nDía 90: Oferta de trabajo en mano'
      },
      {
        stepNumber: 3,
        title: 'Crea tu timeline de acciones',
        description: 'Desglosaa en acciones concretas qué harás cada semana para cumplir los hitos.',
        duration: '20 min',
        tips: [
          'Sé realista con tu tiempo disponible',
          'Deja espacios de buffer',
          'Prioriza las acciones de mayor impacto'
        ]
      }
    ],
    resources: [
      {
        title: 'Goal Setting Template en Notion',
        type: 'template',
        url: 'https://www.notion.so/templates/goal-setting',
        duration: '30 min setup',
        description: 'Plantilla lista para usar con secciones de visión, hitos y timeline'
      },
      {
        title: 'Goal Setting Framework',
        type: 'framework',
        url: 'https://www.smartsheet.com/content/smart-goal-setting',
        description: 'Framework SMART para definir objetivos efectivos'
      },
      {
        title: 'Roadmap Template - Miro',
        type: 'tool',
        url: 'https://miro.com/templates/product-roadmap/',
        description: 'Visualiza tu roadmap de forma colaborativa'
      }
    ],
    expectedOutput: 'Documento de 1-2 páginas con visión clara, 3 hitos específicos y timeline de acciones',
    commonMistakes: [
      'Hacer objetivos muy vagas o genéricas',
      'No desglosarlos en acciones semanales',
      'Ser demasiado ambicioso sin considerar tiempo real disponible'
    ],
    successCriteria: [
      '✓ Visión escrita y clara',
      '✓ 3 hitos con fechas específicas',
      '✓ Acciones semanales identificadas',
      '✓ Documentado en Notion o herramienta similar'
    ]
  },

  // Day 3: Market and role analysis
  3: {
    day: 3,
    title: 'Análisis del mercado y rol objetivo',
    fullDescription: 'Investiga el mercado laboral para tu rol objetivo. Entiende qué se busca, cuáles son los salarios, competencias necesarias y empresas relevantes.',
    objective: 'Tener data clara sobre tu rol objetivo para poder posicionarte correctamente',
    steps: [
      {
        stepNumber: 1,
        title: 'Investiga el rol objetivo',
        description: 'Busca 5-10 ofertas de trabajo para el rol que quieres. Analiza qué piden, nivel de experiencia y requisitos.',
        duration: '30 min',
        tips: [
          'Usa LinkedIn, Indeed, Glassdoor',
          'Guarda 3-4 ofertas como referencia',
          'Nota las skills más mencionadas'
        ]
      },
      {
        stepNumber: 2,
        title: 'Investiga salarios y beneficios',
        description: 'Consulta plataformas de salary research para entender el rango salarial del rol en tu región.',
        duration: '15 min',
        tips: [
          'Revisa múltiples fuentes',
          'Considera el nivel de experiencia',
          'Ten en cuenta la ubicación'
        ]
      },
      {
        stepNumber: 3,
        title: 'Identifica empresas relevantes',
        description: 'Crea una lista de 20-30 empresas donde te gustaría trabajar y que están buscando tu rol.',
        duration: '20 min',
        tips: [
          'Prioriza empresas en crecimiento',
          'Revisa sus páginas de careers',
          'Sigue a los recruiters en LinkedIn'
        ]
      }
    ],
    resources: [
      {
        title: 'LinkedIn - Buscar ofertas de trabajo',
        type: 'tool',
        url: 'https://www.linkedin.com/jobs/',
        description: 'Plataforma principal para buscar oportunidades'
      },
      {
        title: 'Glassdoor - Salary Research',
        type: 'tool',
        url: 'https://www.glassdoor.com',
        description: 'Investiga salarios, reviews de empresas y entrevistas'
      },
      {
        title: 'LinkedIn Salary Tool',
        type: 'tool',
        url: 'https://www.linkedin.com/salary/',
        description: 'Data de salarios filtrada por rol, ubicación y empresa'
      }
    ],
    expectedOutput: 'Documento con análisis de 10+ ofertas, rango salarial investigado y lista de 20-30 empresas objetivo',
    successCriteria: [
      '✓ Ofertas analizadas de múltiples fuentes',
      '✓ Rango salarial documentado',
      '✓ Lista de empresas objetivo creada',
      '✓ Skills requeridas listadas'
    ]
  },

  // Day 5: Skills audit
  5: {
    day: 5,
    title: 'Audit de habilidades actuales',
    fullDescription: 'Evalúa honestamente qué habilidades tienes hoy vs. qué se necesita para tu rol objetivo. Identifica los gaps principales.',
    objective: 'Tener claridad sobre qué skills desarrollar prioritariamente',
    steps: [
      {
        stepNumber: 1,
        title: 'Lista tus habilidades actuales',
        description: 'Haz un inventario de todas las habilidades técnicas y blandas que tienes ahora.',
        duration: '20 min',
        tips: [
          'Se honesto/a',
          'Incluye tanto skills técnicas como blandas',
          'Califica cada una de 1-5'
        ]
      },
      {
        stepNumber: 2,
        title: 'Compara con el rol objetivo',
        description: 'Toma las ofertas que analizaste en el día 3 e identifica qué skills piden que tú no tienes.',
        duration: '15 min',
        tips: [
          'Prioriza los gaps más críticos',
          'Algunos skills puedes aprenderlos en 30 días',
          'Otros requieren más tiempo'
        ]
      },
      {
        stepNumber: 3,
        title: 'Define tu plan de desarrollo',
        description: 'Para los 3-5 skills principales que necesitas, define cómo los desarrollarás en 90 días.',
        duration: '25 min',
        tips: [
          'Algunos se pueden aprender haciendo',
          'Otros requieren cursos formales',
          'Combina teoría y práctica'
        ]
      }
    ],
    resources: [
      {
        title: 'Skills Assessment Tool',
        type: 'tool',
        url: 'https://www.linkedin.com/learning/topics/skills-assessment',
        description: 'Pruebas para auto-evaluar tus habilidades'
      },
      {
        title: 'Udemy - Skill Development Courses',
        type: 'course',
        url: 'https://www.udemy.com',
        description: 'Miles de cursos para desarrollar skills específicas'
      }
    ],
    expectedOutput: 'Documento con skills actuales vs. requeridos y plan de desarrollo para 3-5 skills principales',
    successCriteria: [
      '✓ Skills actuales mapeados',
      '✓ Gaps identificados',
      '✓ Plan de desarrollo creado',
      '✓ Timeline de aprendizaje definido'
    ]
  }
}

// Get task details by day number
export function getTaskDetail(day: number): TaskDetail | undefined {
  return TASK_DETAILS[day]
}

// Get all available days with details
export function getAvailableDays(): number[] {
  return Object.keys(TASK_DETAILS).map(Number).sort((a, b) => a - b)
}
