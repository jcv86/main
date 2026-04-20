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
  },

  // Day 6: Quick action session
  6: {
    day: 6,
    title: 'Sesión 1: Acción Rápida',
    fullDescription: 'Primera sesión de acción rápida. Ejecuta 3 acciones concretas para avanzar en tu búsqueda.',
    objective: 'Generar momentum completando acciones específicas',
    steps: [
      {
        stepNumber: 1,
        title: 'Contacta 3 personas en tu red',
        description: 'Llama, envía mensaje o correo a 3 personas de tu red que trabajan en roles o empresas de interés.',
        duration: '15 min',
        tips: [
          'Sé directo/a pero amable',
          'Pide 15 minutos de su tiempo',
          'Menciona por qué les escribes específicamente'
        ],
        example: 'Ej: "Hola María, vi que trabajas en [empresa]. Estoy haciendo transición a [rol] y me gustaría aprender de tu experiencia. ¿Podemos tomar un café virtual?"'
      },
      {
        stepNumber: 2,
        title: 'Aplica a 2 posiciones',
        description: 'Encuentra 2 posiciones que encajen con tu perfil y aplica personalizando tu CV.',
        duration: '20 min',
        tips: [
          'Personaliza el CV para cada posición',
          'Subraya cómo tus skills encajan',
          'Revisa que todo esté sin errores'
        ]
      },
      {
        stepNumber: 3,
        title: 'Conecta con 5 recruiters en LinkedIn',
        description: 'Busca recruiters especializados en tu rol y envía mensajes personalizados.',
        duration: '15 min',
        tips: [
          'Sé específico/a sobre el rol que buscas',
          'Adjunta tu perfil o CV',
          'Destaca qué te hace único/a'
        ]
      }
    ],
    resources: [
      {
        title: 'LinkedIn - Recruiter Search',
        type: 'tool',
        url: 'https://www.linkedin.com/search/results/people/?keywords=recruiter',
        description: 'Encuentra recruiters en tu industria'
      },
      {
        title: 'Email Templates for Job Search',
        type: 'template',
        url: 'https://www.notion.so/templates/job-search-templates',
        description: 'Templates de mensajes profesionales'
      }
    ],
    expectedOutput: '3 conexiones iniciadas, 2 aplicaciones completadas, 5 recruiters contactados',
    successCriteria: [
      '✓ 3 conversaciones iniciadas',
      '✓ 2 aplicaciones enviadas',
      '✓ 5 recruiters conectados',
      '✓ Mensajes personalizados'
    ]
  },

  // Day 7: Week 1 checkpoint
  7: {
    day: 7,
    title: 'Semana 1: Checkpoint',
    fullDescription: 'Pausa para revisar tu progreso de la primera semana. Analiza qué funcionó, qué no, y ajusta tu estrategia.',
    objective: 'Consolidar aprendizajes y optimizar tu enfoque',
    steps: [
      {
        stepNumber: 1,
        title: 'Revisa tus métricas de la semana',
        description: 'Cuenta: conexiones iniciadas, aplicaciones enviadas, respuestas recibidas, reuniones agendadas.',
        duration: '10 min',
        tips: [
          'Sé honesto/a con los números',
          'Identifica qué canales funcionan mejor',
          'Nota la tasa de respuesta'
        ]
      },
      {
        stepNumber: 2,
        title: 'Análisis: qué funcionó',
        description: 'Identifica qué acciones generaron respuestas positivas. ¿LinkedIn? ¿Networking? ¿Aplicaciones directas?',
        duration: '15 min',
        tips: [
          'Analiza qué tipo de mensajes tuvieron respuesta',
          'Qué empresas mostraron interés',
          'Qué skills destacaste mejor'
        ]
      },
      {
        stepNumber: 3,
        title: 'Plan de optimización para semana 2',
        description: 'Basado en lo que funcionó, planifica cómo optimizarás tus esfuerzos en la semana 2.',
        duration: '20 min',
        tips: [
          'Dedica más tiempo a lo que funciona',
          'Reduce o elimina lo que no funciona',
          'Experimenta con variaciones'
        ]
      }
    ],
    resources: [
      {
        title: 'Job Search Tracking Spreadsheet',
        type: 'template',
        url: 'https://www.notion.so/templates/job-tracker',
        description: 'Plantilla para rastrear todas tus acciones'
      }
    ],
    expectedOutput: 'Documento con métricas de la semana, análisis de qué funcionó, y plan optimizado para semana 2',
    successCriteria: [
      '✓ Métricas documentadas',
      '✓ Análisis completado',
      '✓ Plan de optimización definido',
      '✓ Cambios para semana 2 identificados'
    ]
  },

  // Day 10: Main course/resource start
  10: {
    day: 10,
    title: 'Inicia curso/recurso principal para Liderazgo',
    fullDescription: 'Comienza con el curso principal que elegiste para desarrollar tu skill más crítica. Destina tiempo regular para completarlo.',
    objective: 'Iniciar aprendizaje formal de tu skill principal',
    steps: [
      {
        stepNumber: 1,
        title: 'Elige tu curso/recurso principal',
        description: 'Decide cuál es el curso o recurso que te ayudará más a alcanzar tu objetivo. Debe estar alineado con tu skill crítica.',
        duration: '15 min',
        tips: [
          'Elige algo con buenas reviews',
          'Que sea completable en 90 días',
          'Preferiblemente con certificado'
        ]
      },
      {
        stepNumber: 2,
        title: 'Configura tu plan de estudio',
        description: 'Define cuántas horas semanales dedicarás y cómo las distribuirás.',
        duration: '10 min',
        tips: [
          'Sé realista con tu disponibilidad',
          'Mejor 1 hora diaria que 7 horas un día',
          'Vincula con tu calendario laboral'
        ]
      },
      {
        stepNumber: 3,
        title: 'Completa el primer módulo/semana',
        description: 'No esperes. Comienza hoy mismo con el primer módulo.',
        duration: '60 min',
        tips: [
          'Toma notas',
          'Completa ejercicios prácticos',
          'Relaciona con tu rol objetivo'
        ]
      }
    ],
    resources: [
      {
        title: 'LinkedIn Learning - Leadership Courses',
        type: 'course',
        url: 'https://www.linkedin.com/learning/topics/leadership',
        duration: '2-4 weeks',
        description: 'Cursos de liderazgo estructurados'
      },
      {
        title: 'Udemy - Executive Presence',
        type: 'course',
        url: 'https://www.udemy.com/course/executive-presence/',
        duration: '4 hours',
        description: 'Curso sobre presencia ejecutiva'
      },
      {
        title: 'Coursera - Management Fundamentals',
        type: 'course',
        url: 'https://www.coursera.org/learn/management',
        duration: '4-6 weeks',
        description: 'Curso de fundamentos de gestión con certificado'
      }
    ],
    expectedOutput: 'Primer módulo/semana del curso completado con notas y reflexiones',
    successCriteria: [
      '✓ Curso elegido y registrado',
      '✓ Plan de estudio definido',
      '✓ Primer módulo completado',
      '✓ Notas tomadas'
    ]
  },

  // Day 12: Personal branding profile
  12: {
    day: 12,
    title: 'Crear tu perfil de marca personal',
    fullDescription: 'Desarrolla una narrativa clara sobre quién eres, qué valor aportas y hacia dónde vas profesionalmente.',
    objective: 'Tener una marca personal consistente en LinkedIn y otros canales',
    steps: [
      {
        stepNumber: 1,
        title: 'Define tu "elevator pitch"',
        description: 'Crea un resumen de 30 segundos que explique quién eres, qué haces y hacia dónde vas.',
        duration: '20 min',
        tips: [
          'Hazlo memorable',
          'Enfócate en el valor que das',
          'Practica frente al espejo',
          'Debe sonar natural, no robótico'
        ],
        example: 'Ej: "Soy Product Manager con 5 años de experiencia en SaaS. Me especializo en llevar productos desde idea a 100k usuarios. Busco liderar el producto en una startup en crecimiento acelerado de LatAm."'
      },
      {
        stepNumber: 2,
        title: 'Construye tu narrativa en LinkedIn',
        description: 'Actualiza tu headline, resumen y experiencias en LinkedIn con tu narrativa clara.',
        duration: '45 min',
        tips: [
          'Headline debe ser catchy',
          'Resumen: 2-3 párrafos máximo',
          'Destaca logros cuantitativos',
          'Incluye palabras clave relevantes'
        ]
      },
      {
        stepNumber: 3,
        title: 'Crea contenido de muestra',
        description: 'Escribe o cuartea 2-3 posts en LinkedIn que muestren tu expertise.',
        duration: '30 min',
        tips: [
          'Sé auténtico/a',
          'Comparte aprendizajes reales',
          'Engaña al debate sano',
          'Usa formato: pregunta, idea, insight'
        ]
      }
    ],
    resources: [
      {
        title: 'LinkedIn Profile Optimization Guide',
        type: 'article',
        url: 'https://business.linkedin.com/talent-solutions/recruiter-tips/how-to-optimize-linkedin-profile',
        description: 'Guía oficial de LinkedIn'
      },
      {
        title: 'Personal Branding Workbook - Notion',
        type: 'template',
        url: 'https://www.notion.so/templates/personal-branding',
        description: 'Workbook para definir tu marca'
      }
    ],
    expectedOutput: 'Elevator pitch definido, LinkedIn actualizado con narrativa clara, 2-3 posts publicados',
    successCriteria: [
      '✓ Elevator pitch escrito y practicado',
      '✓ LinkedIn headline y resumen actualizados',
      '✓ Posts publicados',
      '✓ Narrativa consistente en todos lados'
    ]
  },

  // Day 14: Week 2 checkpoint
  14: {
    day: 14,
    title: 'Semana 2: Checkpoint',
    fullDescription: 'Segunda revisión de progreso. Evaluá el impacto de tu marca personal y optimiza nuevamente.',
    objective: 'Mantener momentum y ajustar estrategia basado en resultados',
    steps: [
      {
        stepNumber: 1,
        title: 'Revisa métricas de semana 2',
        description: 'Conexiones adicionales, respuestas a posts, mensajes de recruiters, entrevistas agendadas.',
        duration: '10 min',
        tips: [
          'Compara con semana 1',
          'Identifica tendencias',
          'Nota qué tipo de contactos responden'
        ]
      },
      {
        stepNumber: 2,
        title: 'Analiza impacto de tu marca personal',
        description: 'Mide cuántas nuevas conexiones llegaron por tu perfil actualizado. ¿Mejoró engagement?',
        duration: '15 min',
        tips: [
          'Revisa LinkedIn analytics',
          'Cuenta nuevas conexiones',
          'Analiza comentarios en posts'
        ]
      },
      {
        stepNumber: 3,
        title: 'Ajusta tu estrategia',
        description: 'Basado en las métricas, decide: qué seguir haciendo, qué cambiar, qué acelerar.',
        duration: '20 min',
        tips: [
          'Sé data-driven',
          'No abandones lo que funciona',
          'Itera y experimenta'
        ]
      }
    ],
    resources: [
      {
        title: 'Progress Tracker Template',
        type: 'template',
        url: 'https://www.notion.so/templates/progress-tracker',
        description: 'Plantilla para rastrear KPIs'
      }
    ],
    expectedOutput: 'Análisis completo de semana 2 con métricas comparativas y plan de acción para semana 3',
    successCriteria: [
      '✓ Métricas comparadas',
      '✓ Impacto de marca medido',
      '✓ Nuevos ajustes definidos',
      '✓ Plan para semana 3 listo'
    ]
  },

  // Day 17: Practical project - Apply leadership
  17: {
    day: 17,
    title: 'Proyecto práctico: Aplica Liderazgo',
    fullDescription: 'Ejecuta un pequeño proyecto o iniciativa que demuestre las habilidades de liderazgo que estás desarrollando. Puede ser en tu trabajo actual o voluntariado.',
    objective: 'Aplicar habilidades de liderazgo en contexto real',
    steps: [
      {
        stepNumber: 1,
        title: 'Identifica una iniciativa o proyecto',
        description: 'Encuentra algo en tu trabajo o comunidad donde puedas liderar (mejorar un proceso, coordinar un equipo, dirigir un proyecto pequeño).',
        duration: '30 min',
        tips: [
          'Elige algo realista de completar en 2-3 semanas',
          'Debe involucrar a otras personas',
          'Busca impacto medible'
        ],
        example: 'Ej: Liderar la implementación de una nueva herramienta de team, reorganizar un proceso departamental, o coordinar un proyecto de voluntariado'
      },
      {
        stepNumber: 2,
        title: 'Define objetivos y equipo',
        description: 'Documenta qué quieres lograr, quién está involucrado, y cómo medirás éxito.',
        duration: '45 min',
        tips: [
          'Comunica claramente el objetivo',
          'Define roles y responsabilidades',
          'Establece timeline y milestones'
        ]
      },
      {
        stepNumber: 3,
        title: 'Ejecuta aplicando 3 principios de liderazgo',
        description: 'Durante el proyecto, aplica 3 conceptos que aprendiste (comunicación clara, delegación, resolución de conflictos, etc.).',
        duration: '6-8 hours total',
        tips: [
          'Documenta cómo aplicas cada principio',
          'Solicita feedback de tu equipo',
          'Reflexiona sobre qué funcionó'
        ]
      },
      {
        stepNumber: 4,
        title: 'Documenta y reflexiona',
        description: 'Escribe un caso de estudio de lo que aprendiste liderando este proyecto.',
        duration: '30 min',
        tips: [
          'Incluye desafíos y cómo los superaste',
          'Resultados concretos',
          'Qué harías diferente'
        ]
      }
    ],
    resources: [
      {
        title: 'Project Leadership Checklist',
        type: 'template',
        url: 'https://www.notion.so/templates/project-leadership',
        description: 'Checklist para liderar proyectos'
      },
      {
        title: 'Harvard Business Review - Leadership Lessons',
        type: 'article',
        url: 'https://hbr.org/topic/leadership',
        description: 'Artículos sobre liderazgo práctico'
      }
    ],
    expectedOutput: 'Proyecto completado con documentación de aprendizajes y caso de estudio de liderazgo',
    successCriteria: [
      '✓ Proyecto ejecutado exitosamente',
      '✓ 3 principios de liderazgo aplicados',
      '✓ Feedback del equipo recopilado',
      '✓ Documento de reflexión completado'
    ]
  },

  // Day 21: Networking - Informational interviews
  21: {
    day: 21,
    title: 'Networking: Informational interviews',
    fullDescription: 'Realiza 2-3 informational interviews con profesionales en tu rol objetivo. El objetivo es aprender, no pedir trabajo.',
    objective: 'Construir relaciones y aprender del mercado',
    steps: [
      {
        stepNumber: 1,
        title: 'Prepara tu lista de preguntas',
        description: 'Desarrolla 8-10 preguntas que quieras hacer para aprender sobre el rol, industria, y trayectoria profesional.',
        duration: '30 min',
        tips: [
          'Sé específico/a',
          'Evita preguntas que puedas responder en Google',
          'Incluye preguntas personales sobre su carrera'
        ],
        example: 'Ej: "¿Cuáles fueron los 3 mayores cambios en tu rol en los últimos 2 años?" o "¿Qué skill te habría gustado desarrollar antes?"'
      },
      {
        stepNumber: 2,
        title: 'Contacta 3-5 personas para entrevistas',
        description: 'Alcanza personas en LinkedIn o a través de referidos. Solicita 20-30 minutos de su tiempo.',
        duration: '30 min',
        tips: [
          'Sé respetuoso del tiempo',
          'Explica por qué quieres hablar con ellos',
          'Ofrece flexibilidad en horarios',
          'Remite a un link de calendario'
        ]
      },
      {
        stepNumber: 3,
        title: 'Realiza las informational interviews',
        description: 'Conduce 2-3 conversaciones de calidad. Escucha más que hablas, toma notas detalladas.',
        duration: '60 min total',
        tips: [
          'Sé puntual y profesional',
          'Apaga notificaciones',
          'Haz seguimiento de lo que dicen',
          'Al final, pregunta si pueden referirte a otros'
        ]
      },
      {
        stepNumber: 4,
        title: 'Seguimiento y gratitud',
        description: 'Envía thank you notes personalizadas a cada persona. Menciona algo específico que aprendiste.',
        duration: '30 min',
        tips: [
          'Envía dentro de 24 horas',
          'Sé específico/a en la gratitud',
          'Ofrece valor si puedes (conexiones, artículos, etc.)'
        ]
      }
    ],
    resources: [
      {
        title: 'Informational Interview Guide',
        type: 'article',
        url: 'https://www.thebalancecareers.com/informational-interview-questions-2061616',
        description: 'Guía completa de entrevistas informativas'
      },
      {
        title: 'LinkedIn - How to Request an Informational Interview',
        type: 'article',
        url: 'https://business.linkedin.com/talent-solutions/recruiter-tips',
        description: 'Tips de LinkedIn para solicitar entrevistas'
      }
    ],
    expectedOutput: '2-3 informational interviews completadas, notas documentadas, thank you notes enviadas',
    successCriteria: [
      '✓ 2-3 entrevistas realizadas',
      '✓ Preguntas de calidad respondidas',
      '✓ Insights documentados',
      '✓ Relaciones iniciadas',
      '✓ Thank you notes enviadas'
    ]
  },

  // Day 28: 30-day milestone - Complete review
  28: {
    day: 28,
    title: 'Hito de 30 días: Revisión completa',
    fullDescription: 'Evaluación completa de tus 30 días. Mide progreso, celebra logros, y planifica los próximos 60 días con lo aprendido.',
    objective: 'Consolidar aprendizajes y planificar siguiente fase',
    steps: [
      {
        stepNumber: 1,
        title: 'Revisa tu estado inicial vs. actual',
        description: 'Compara dónde estabas el Día 1 vs. donde estás hoy en: skills, red, aplicaciones, entrevistas, marca personal.',
        duration: '30 min',
        tips: [
          'Sé brutal con la honestidad',
          'Documenta cambios cuantitativos',
          'Nota cambios en mentalidad/confianza'
        ]
      },
      {
        stepNumber: 2,
        title: 'Analiza qué funcionó mejor',
        description: 'Identifica las 3 acciones o estrategias que generaron mayor ROI (retorno en inversión de tiempo).',
        duration: '30 min',
        tips: [
          'Mira qué canales trajeron entrevistas',
          'Qué hizo que te conectaras con decisores',
          'Qué actividades te motivaron más'
        ]
      },
      {
        stepNumber: 3,
        title: 'Celebra tus logros',
        description: 'Haz una lista de TODO lo que lograste. Desde skills desarrollados hasta relaciones construidas. Celebra apropiadamente.',
        duration: '30 min',
        tips: [
          'No subestimes lo alcanzado',
          'Comparte logros con mentores/amigos',
          'Reconoce tu esfuerzo'
        ]
      },
      {
        stepNumber: 4,
        title: 'Planifica los próximos 60 días',
        description: 'Basado en lo aprendido, planifica una estrategia mejorada para los próximos 60 días. ¿Qué harías diferente? ¿Qué acelerarías?',
        duration: '90 min',
        tips: [
          'Sé más ambicioso/a con lo que sabes funciona',
          'Identifica nuevas oportunidades',
          'Define nuevos objetivos',
          'Planifica recursos necesarios'
        ]
      }
    ],
    resources: [
      {
        title: 'Quarterly Review Template',
        type: 'template',
        url: 'https://www.notion.so/templates/quarterly-review',
        description: 'Template para revisión de período'
      },
      {
        title: 'Goal Setting for Next Quarter',
        type: 'framework',
        url: 'https://www.notion.so/templates/goal-setting',
        description: 'Framework para definir objetivos nuevos'
      }
    ],
    expectedOutput: 'Documento completo de revisión de 30 días + plan detallado para próximos 60 días',
    successCriteria: [
      '✓ Comparación inicial vs. final documentada',
      '✓ 3 estrategias ganadores identificadas',
      '✓ Logros celebrados y reconocidos',
      '✓ Plan 60 días definido',
      '✓ Nuevos objetivos claros'
    ]
  }
}

// Get task details by day number
export function getTaskDetail(day: number): TaskDetail | undefined {
  return TASK_DETAILS[day]
}

// Get all available days with details
export function getAvailableDays(): number[] {
  return Object.keys(TASK_DETAILS).map(Number)
}
  return Object.keys(TASK_DETAILS).map(Number).sort((a, b) => a - b)
}
