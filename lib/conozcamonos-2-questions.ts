// Conozcámonos 2 - Preguntas sobre objetivos y desafíos específicos

export interface Conozcamonos2Question {
  id: number
  section: 'paso1' | 'paso2'
  question: string
  type: 'select' | 'text' | 'checkbox'
  options?: string[]
  placeholder?: string
  maxLength?: number
  required: boolean
}

export const CONOZCAMONOS_2_QUESTIONS: Conozcamonos2Question[] = [
  // PASO 1: Objetivo Específico
  {
    id: 1,
    section: 'paso1',
    question: '¿Cuál es tu objetivo profesional principal en los próximos 90 días?',
    type: 'text',
    placeholder: 'Ej: Conseguir un ascenso, cambiar de trabajo, desarrollar una habilidad...',
    maxLength: 300,
    required: true,
  },
  {
    id: 2,
    section: 'paso1',
    question: '¿Qué sector o industria te interesa?',
    type: 'select',
    options: [
      'Tecnología',
      'Finanzas',
      'Marketing y Publicidad',
      'Recursos Humanos',
      'Ventas',
      'Educación',
      'Consultoría',
      'Emprendimiento',
      'Otro'
    ],
    required: true,
  },
  {
    id: 3,
    section: 'paso1',
    question: '¿Qué rol específico buscas?',
    type: 'text',
    placeholder: 'Ej: Product Manager, Analista de Datos, Gerente de Proyectos...',
    maxLength: 200,
    required: true,
  },
  {
    id: 4,
    section: 'paso1',
    question: '¿Cuáles son las principales habilidades que necesitas desarrollar?',
    type: 'checkbox',
    options: [
      'Liderazgo',
      'Comunicación',
      'Análisis de datos',
      'Negociación',
      'Gestión de proyectos',
      'Pensamiento estratégico',
      'Inteligencia emocional',
      'Programación',
      'Otro'
    ],
    required: true,
  },

  // PASO 2: Estrategia de Acción
  {
    id: 5,
    section: 'paso2',
    question: '¿Cuántas horas por semana puedes dedicar a tu desarrollo?',
    type: 'select',
    options: [
      'Menos de 5 horas',
      '5-10 horas',
      '10-15 horas',
      '15-20 horas',
      '20+ horas'
    ],
    required: true,
  },
  {
    id: 6,
    section: 'paso2',
    question: '¿Prefieres aprender a través de:',
    type: 'checkbox',
    options: [
      'Cursos online',
      'Libros',
      'Mentoría',
      'Experiencia práctica',
      'Comunidades y networking',
      'Certificaciones',
      'Talleres presenciales'
    ],
    required: true,
  },
  {
    id: 7,
    section: 'paso2',
    question: '¿Cuáles son tus principales barreras para el cambio?',
    type: 'checkbox',
    options: [
      'Falta de tiempo',
      'Falta de recursos económicos',
      'Falta de confianza en mis habilidades',
      'Miedo al fracaso',
      'Falta de claridad sobre qué aprender',
      'Responsabilidades familiares',
      'No sé por dónde empezar'
    ],
    required: true,
  },
  {
    id: 8,
    section: 'paso2',
    question: '¿Cómo prefieres que se estructure tu plan de 90 días?',
    type: 'select',
    options: [
      'Estructura flexible - Yo decido el ritmo',
      'Plan estructurado - Pasos claros cada semana',
      'Híbrido - Estructura flexible con hitos clave',
      'Intensivo - Máxima dedicación los primeros 30 días'
    ],
    required: true,
  }
]
