import type { PromptCategoryId } from "./prompt-categories"

export interface MasterPrompt {
  prompt_id: string
  categoria: PromptCategoryId
  nivel: "basico" | "intermedio" | "avanzado"
  tono: "sofia" | "dani" | "hibrido"
  entrada_usuario: string
  respuesta_sofia?: string
  respuesta_dani?: string
  metricas_esperadas: {
    engagement_rate: number // percentage
    satisfaccion_promedio: number // 1-5 stars
    acciones_completadas: number // percentage
  }
  keywords: string[]
}

// Parte I — Bloques Narrativos Estructurados
// Categoría 1: Autoconocimiento y Propósito Profesional

export const MASTER_PROMPT_BANK: MasterPrompt[] = [
  // === AUTOCONOCIMIENTO Y PROPÓSITO ===
  {
    prompt_id: "auto_001",
    categoria: "autoconocimiento_proposito",
    nivel: "basico",
    tono: "hibrido",
    entrada_usuario: "Me siento perdido con mi carrera, ¿cómo descubro qué me gusta realmente?",
    respuesta_sofia:
      "Es normal sentirse así al comienzo. Te propongo tres pasos: 1) reflexiona sobre las tareas que más disfrutas, 2) identifica momentos donde te sientes más motivado, y 3) usa el test de autoconocimiento de DespegarTuCarrera.",
    respuesta_dani:
      "Analicemos de forma práctica. 1) Lista tus principales logros, 2) identifica patrones y 3) cruza los resultados con áreas laborales. Puedo ayudarte a generar una matriz comparativa.",
    metricas_esperadas: {
      engagement_rate: 75,
      satisfaccion_promedio: 4.5,
      acciones_completadas: 68,
    },
    keywords: ["perdido", "carrera", "descubrir", "propósito", "motivación"],
  },
  {
    prompt_id: "auto_002",
    categoria: "autoconocimiento_proposito",
    nivel: "basico",
    tono: "hibrido",
    entrada_usuario: "No sé si estoy en la carrera correcta",
    respuesta_sofia:
      "Esa duda es común. Evalúa qué te atrae, proyección y coherencia con tus valores. Si dos de los tres no se cumplen, puede ser momento de explorar nuevas opciones.",
    respuesta_dani:
      "Usemos un enfoque analítico. 1) Define tu situación actual, 2) identifica habilidades transferibles. Te puedo guiar con un plan de reconversión profesional.",
    metricas_esperadas: {
      engagement_rate: 60,
      satisfaccion_promedio: 4.3,
      acciones_completadas: 55,
    },
    keywords: ["duda", "carrera correcta", "cambio", "reconversión"],
  },
  {
    prompt_id: "auto_003",
    categoria: "autoconocimiento_proposito",
    nivel: "intermedio",
    tono: "sofia",
    entrada_usuario: "¿Cómo identifico mis fortalezas reales?",
    respuesta_sofia:
      "Tus fortalezas están donde combinas habilidad natural + disfrute. Te sugiero: 1) Pide feedback a personas cercanas, 2) Revisa tus logros pasados, 3) Haz nuestro test DISC o Big Five para obtener un perfil objetivo.",
    metricas_esperadas: {
      engagement_rate: 70,
      satisfaccion_promedio: 4.6,
      acciones_completadas: 72,
    },
    keywords: ["fortalezas", "habilidades", "talentos", "perfil"],
  },
  {
    prompt_id: "auto_004",
    categoria: "autoconocimiento_proposito",
    nivel: "intermedio",
    tono: "dani",
    entrada_usuario: "¿Qué habilidades son más valoradas en el mercado actual?",
    respuesta_dani:
      "Según datos 2025: 1) Pensamiento crítico y resolución de problemas, 2) Adaptabilidad y aprendizaje continuo, 3) Comunicación efectiva, 4) Competencias digitales básicas. Te puedo ayudar a mapear cuáles tienes y cuáles desarrollar.",
    metricas_esperadas: {
      engagement_rate: 65,
      satisfaccion_promedio: 4.4,
      acciones_completadas: 60,
    },
    keywords: ["habilidades", "mercado", "demanda", "competencias"],
  },

  // === CV, LINKEDIN Y MARCA PERSONAL ===
  {
    prompt_id: "cv_001",
    categoria: "cv_linkedin_marca",
    nivel: "basico",
    tono: "dani",
    entrada_usuario: "Quiero mejorar mi CV pero no sé por dónde partir",
    respuesta_dani:
      "Perfecto. Haz esto: 1) Define el cargo objetivo, 2) Revisa tu CV actual y elimina datos irrelevantes (como RUT o dirección), 3) Añade logros medibles. ¿Quieres que te muestre cómo hacerlo?",
    metricas_esperadas: {
      engagement_rate: 75,
      satisfaccion_promedio: 4.5,
      acciones_completadas: 70,
    },
    keywords: ["cv", "curriculum", "mejorar", "optimizar"],
  },
  {
    prompt_id: "cv_002",
    categoria: "cv_linkedin_marca",
    nivel: "intermedio",
    tono: "dani",
    entrada_usuario: "¿Cómo hago que mi perfil de LinkedIn destaque?",
    respuesta_dani:
      "LinkedIn es tu vitrina profesional. Prioriza: 1) Foto profesional, 2) Titular claro con tu propuesta de valor, 3) Resumen que cuente tu historia, 4) Logros cuantificables en experiencia. ¿Revisamos tu perfil actual?",
    metricas_esperadas: {
      engagement_rate: 80,
      satisfaccion_promedio: 4.7,
      acciones_completadas: 75,
    },
    keywords: ["linkedin", "perfil", "destacar", "visibilidad"],
  },
  {
    prompt_id: "cv_003",
    categoria: "cv_linkedin_marca",
    nivel: "avanzado",
    tono: "dani",
    entrada_usuario: "¿Cómo construyo mi marca personal?",
    respuesta_dani:
      "Tu marca personal es cómo te perciben profesionalmente. Pasos: 1) Define tu propuesta de valor única, 2) Identifica tu audiencia objetivo, 3) Crea contenido consistente, 4) Networking estratégico. ¿En qué industria quieres posicionarte?",
    metricas_esperadas: {
      engagement_rate: 70,
      satisfaccion_promedio: 4.6,
      acciones_completadas: 65,
    },
    keywords: ["marca personal", "branding", "posicionamiento", "reputación"],
  },

  // === ENTREVISTAS Y COMUNICACIÓN ===
  {
    prompt_id: "entrevista_001",
    categoria: "entrevistas_comunicacion",
    nivel: "basico",
    tono: "sofia",
    entrada_usuario: "Me cuesta responder preguntas en entrevistas",
    respuesta_sofia:
      "Respira, es normal. Podemos practicar. Te haré tres preguntas típicas (¿háblame de ti, fortalezas/debilidades?) y te daré feedback después. ¿Empezamos?",
    metricas_esperadas: {
      engagement_rate: 85,
      satisfaccion_promedio: 4.8,
      acciones_completadas: 80,
    },
    keywords: ["entrevista", "preguntas", "nervios", "práctica"],
  },
  {
    prompt_id: "entrevista_002",
    categoria: "entrevistas_comunicacion",
    nivel: "intermedio",
    tono: "dani",
    entrada_usuario: "Quiero practicar una entrevista para un cargo de analista financiero",
    respuesta_dani:
      "Excelente. Configuré una simulación enfocada en análisis de datos y pensamiento crítico. Te haré 5 preguntas y luego recibirás tu score por competencia.",
    metricas_esperadas: {
      engagement_rate: 90,
      satisfaccion_promedio: 4.9,
      acciones_completadas: 85,
    },
    keywords: ["simulador", "entrevista", "práctica", "cargo específico"],
  },
  {
    prompt_id: "entrevista_003",
    categoria: "entrevistas_comunicacion",
    nivel: "basico",
    tono: "sofia",
    entrada_usuario: '¿Cómo respondo "cuéntame sobre ti"?',
    respuesta_sofia:
      "Esa pregunta es tu elevator pitch. Estructura: 1) Quién eres profesionalmente, 2) Logro relevante, 3) Por qué te interesa este cargo. Hazlo en 60-90 segundos. ¿Quieres que practiquemos?",
    metricas_esperadas: {
      engagement_rate: 75,
      satisfaccion_promedio: 4.6,
      acciones_completadas: 70,
    },
    keywords: ["cuéntame sobre ti", "elevator pitch", "presentación"],
  },

  // === CRECIMIENTO PROFESIONAL Y AUMENTO SALARIAL ===
  {
    prompt_id: "crecimiento_001",
    categoria: "crecimiento_salarial",
    nivel: "intermedio",
    tono: "dani",
    entrada_usuario: "Quiero pedir un aumento de sueldo pero me da miedo",
    respuesta_dani:
      "Es totalmente válido sentirlo. Ensayemos cómo podrías plantearlo. Primero, enfócate en logros concretos, luego revisa rangos salariales del mercado, 3) elige el momento de evaluación. Te puedo generar una plantilla para estructurar la conversación con ejemplos.",
    metricas_esperadas: {
      engagement_rate: 80,
      satisfaccion_promedio: 4.7,
      acciones_completadas: 75,
    },
    keywords: ["aumento", "sueldo", "negociación", "salario"],
  },
  {
    prompt_id: "crecimiento_002",
    categoria: "crecimiento_salarial",
    nivel: "basico",
    tono: "sofia",
    entrada_usuario: "¿Cómo sé si estoy listo para un ascenso?",
    respuesta_sofia:
      "Buena pregunta. Señales clave: 1) Ya haces tareas del siguiente nivel, 2) Recibes feedback positivo consistente, 3) Has logrado resultados medibles. ¿Quieres que analicemos tu situación actual?",
    metricas_esperadas: {
      engagement_rate: 70,
      satisfaccion_promedio: 4.5,
      acciones_completadas: 65,
    },
    keywords: ["ascenso", "promoción", "crecimiento", "siguiente nivel"],
  },
  {
    prompt_id: "crecimiento_003",
    categoria: "crecimiento_salarial",
    nivel: "avanzado",
    tono: "dani",
    entrada_usuario: "¿Cómo negocio mi salario en una oferta de trabajo?",
    respuesta_dani:
      "Negociación estratégica: 1) Investiga rangos del mercado para tu cargo, 2) Conoce tu valor (experiencia + habilidades), 3) No des el primer número, 4) Considera el paquete completo (beneficios, bonos). ¿Tienes una oferta en mano?",
    metricas_esperadas: {
      engagement_rate: 85,
      satisfaccion_promedio: 4.8,
      acciones_completadas: 80,
    },
    keywords: ["negociación", "oferta", "salario", "compensación"],
  },

  // === REINVENCIÓN Y TRANSICIÓN DE CARRERA ===
  {
    prompt_id: "transicion_001",
    categoria: "reinvencion_transicion",
    nivel: "intermedio",
    tono: "sofia",
    entrada_usuario: "No me gusta mi carrera, ¿debería cambiarme?",
    respuesta_sofia:
      "Esa pregunta muestra autoconocimiento. Veamos juntos: ¿es el contenido o el entorno laboral? Si quieres, puedo ayudarte a mapear opciones en base a tu perfil y ver rutas de reconversión según tu industria.",
    metricas_esperadas: {
      engagement_rate: 75,
      satisfaccion_promedio: 4.6,
      acciones_completadas: 70,
    },
    keywords: ["cambio de carrera", "reconversión", "transición", "insatisfacción"],
  },
  {
    prompt_id: "transicion_002",
    categoria: "reinvencion_transicion",
    nivel: "avanzado",
    tono: "dani",
    entrada_usuario: "¿Cómo hago un cambio de industria sin experiencia?",
    respuesta_dani:
      "Analicémoslo estratégicamente. Primero define qué te motiva, luego identifica habilidades transferibles y revisa las áreas donde puedes reinsertarte. Te puedo sugerir rutas de reconversión según tu industria.",
    metricas_esperadas: {
      engagement_rate: 80,
      satisfaccion_promedio: 4.7,
      acciones_completadas: 75,
    },
    keywords: ["cambio de industria", "sin experiencia", "habilidades transferibles"],
  },
  {
    prompt_id: "transicion_003",
    categoria: "reinvencion_transicion",
    nivel: "intermedio",
    tono: "sofia",
    entrada_usuario: "Tengo 30 años y quiero estudiar otra carrera",
    respuesta_sofia:
      "Nunca es tarde para reinventarse. Muchas personas exitosas han cambiado de rumbo a los 30+. Primero, validemos si necesitas una carrera completa o certificaciones específicas. ¿Qué área te atrae?",
    metricas_esperadas: {
      engagement_rate: 70,
      satisfaccion_promedio: 4.5,
      acciones_completadas: 65,
    },
    keywords: ["reinvención", "estudiar", "nueva carrera", "30 años"],
  },

  // === PROMPTS ADICIONALES PARA COMPLETAR 50+ ===

  // Autoconocimiento adicionales
  {
    prompt_id: "auto_005",
    categoria: "autoconocimiento_proposito",
    nivel: "basico",
    tono: "sofia",
    entrada_usuario: "¿Qué es el propósito profesional?",
    respuesta_sofia:
      'Tu propósito profesional es la intersección entre lo que te apasiona, lo que se te da bien y lo que el mundo necesita. Es tu "por qué" trabajas más allá del dinero.',
    metricas_esperadas: {
      engagement_rate: 65,
      satisfaccion_promedio: 4.4,
      acciones_completadas: 60,
    },
    keywords: ["propósito", "significado", "vocación"],
  },
  {
    prompt_id: "auto_006",
    categoria: "autoconocimiento_proposito",
    nivel: "intermedio",
    tono: "dani",
    entrada_usuario: "¿Cómo descubro mis valores profesionales?",
    respuesta_dani:
      "Tus valores son tu brújula. Ejercicio: 1) Lista 10 momentos donde te sentiste realizado, 2) Identifica patrones comunes, 3) Prioriza tus top 5 valores. ¿Empezamos?",
    metricas_esperadas: {
      engagement_rate: 70,
      satisfaccion_promedio: 4.5,
      acciones_completadas: 65,
    },
    keywords: ["valores", "principios", "brújula profesional"],
  },
  {
    prompt_id: "auto_007",
    categoria: "autoconocimiento_proposito",
    nivel: "avanzado",
    tono: "sofia",
    entrada_usuario: "¿Cómo alinear mi trabajo con mi propósito de vida?",
    respuesta_sofia:
      "Esa es una pregunta profunda. Primero identifica tu propósito personal, luego busca roles donde puedas expresarlo. No siempre es cambiar de trabajo, a veces es cambiar cómo lo haces.",
    metricas_esperadas: {
      engagement_rate: 75,
      satisfaccion_promedio: 4.7,
      acciones_completadas: 70,
    },
    keywords: ["alineación", "propósito de vida", "sentido", "realización"],
  },

  // CV y LinkedIn adicionales
  {
    prompt_id: "cv_004",
    categoria: "cv_linkedin_marca",
    nivel: "basico",
    tono: "dani",
    entrada_usuario: "¿Qué pongo en mi CV si no tengo experiencia?",
    respuesta_dani:
      "Sin experiencia formal, destaca: 1) Proyectos académicos relevantes, 2) Voluntariados, 3) Habilidades técnicas, 4) Logros cuantificables en cualquier contexto. ¿Qué cargo buscas?",
    metricas_esperadas: {
      engagement_rate: 80,
      satisfaccion_promedio: 4.6,
      acciones_completadas: 75,
    },
    keywords: ["sin experiencia", "primer empleo", "recién egresado"],
  },
  {
    prompt_id: "cv_005",
    categoria: "cv_linkedin_marca",
    nivel: "intermedio",
    tono: "dani",
    entrada_usuario: "¿Cómo adapto mi CV para cada oferta?",
    respuesta_dani:
      "Personalización es clave. Para cada oferta: 1) Lee bien la descripción, 2) Identifica palabras clave, 3) Ajusta tu resumen y experiencia para reflejar esas competencias. Te puedo ayudar con un ejemplo.",
    metricas_esperadas: {
      engagement_rate: 75,
      satisfaccion_promedio: 4.5,
      acciones_completadas: 70,
    },
    keywords: ["personalizar cv", "adaptar", "palabras clave", "ATS"],
  },
  {
    prompt_id: "cv_006",
    categoria: "cv_linkedin_marca",
    nivel: "avanzado",
    tono: "dani",
    entrada_usuario: "¿Cómo uso LinkedIn para conseguir trabajo?",
    respuesta_dani:
      'LinkedIn es networking activo: 1) Optimiza tu perfil con palabras clave, 2) Conecta con reclutadores de tu industria, 3) Comenta y comparte contenido relevante, 4) Usa "Open to Work". ¿Cuál es tu industria objetivo?',
    metricas_esperadas: {
      engagement_rate: 85,
      satisfaccion_promedio: 4.8,
      acciones_completadas: 80,
    },
    keywords: ["linkedin", "networking", "búsqueda activa", "reclutadores"],
  },

  // Entrevistas adicionales
  {
    prompt_id: "entrevista_004",
    categoria: "entrevistas_comunicacion",
    nivel: "intermedio",
    tono: "sofia",
    entrada_usuario: "¿Cómo manejo los nervios en una entrevista?",
    respuesta_sofia:
      "Los nervios son normales. Técnicas: 1) Respiración profunda antes de entrar, 2) Prepara respuestas a preguntas comunes, 3) Recuerda que es una conversaci����n, no un interrogatorio. ¿Quieres practicar?",
    metricas_esperadas: {
      engagement_rate: 80,
      satisfaccion_promedio: 4.7,
      acciones_completadas: 75,
    },
    keywords: ["nervios", "ansiedad", "entrevista", "calma"],
  },
  {
    prompt_id: "entrevista_005",
    categoria: "entrevistas_comunicacion",
    nivel: "avanzado",
    tono: "dani",
    entrada_usuario: "¿Cómo respondo preguntas de casos en entrevistas?",
    respuesta_dani:
      "Casos requieren estructura. Usa el método: 1) Clarifica el problema, 2) Estructura tu análisis, 3) Propón soluciones con pros/contras, 4) Recomienda una opción. ¿Quieres un caso de práctica?",
    metricas_esperadas: {
      engagement_rate: 85,
      satisfaccion_promedio: 4.8,
      acciones_completadas: 80,
    },
    keywords: ["case interview", "casos", "consultoría", "análisis"],
  },
  {
    prompt_id: "entrevista_006",
    categoria: "entrevistas_comunicacion",
    nivel: "basico",
    tono: "sofia",
    entrada_usuario: "¿Qué preguntas debo hacer al entrevistador?",
    respuesta_sofia:
      "Hacer preguntas muestra interés. Buenas opciones: 1) ¿Cómo es un día típico en este rol?, 2) ¿Qué esperan lograr en los primeros 90 días?, 3) ¿Cómo es la cultura del equipo? Evita preguntar sobre salario en primera entrevista.",
    metricas_esperadas: {
      engagement_rate: 70,
      satisfaccion_promedio: 4.5,
      acciones_completadas: 65,
    },
    keywords: ["preguntas al entrevistador", "curiosidad", "interés"],
  },

  // Crecimiento adicionales
  {
    prompt_id: "crecimiento_004",
    categoria: "crecimiento_salarial",
    nivel: "basico",
    tono: "dani",
    entrada_usuario: "¿Cómo pido feedback a mi jefe?",
    respuesta_dani:
      'Pedir feedback es profesional. Enfoque: "Me gustaría conocer tu perspectiva sobre mi desempeño y áreas de mejora. ¿Podríamos agendar 15 minutos?" Sé específico sobre qué quieres feedback.',
    metricas_esperadas: {
      engagement_rate: 70,
      satisfaccion_promedio: 4.5,
      acciones_completadas: 65,
    },
    keywords: ["feedback", "retroalimentación", "mejora", "desempeño"],
  },
  {
    prompt_id: "crecimiento_005",
    categoria: "crecimiento_salarial",
    nivel: "intermedio",
    tono: "sofia",
    entrada_usuario: "¿Cómo desarrollo habilidades de liderazgo?",
    respuesta_sofia:
      "El liderazgo se practica: 1) Toma iniciativa en proyectos, 2) Aprende a delegar y confiar, 3) Desarrolla escucha activa, 4) Busca mentoría. No necesitas un cargo para liderar.",
    metricas_esperadas: {
      engagement_rate: 75,
      satisfaccion_promedio: 4.6,
      acciones_completadas: 70,
    },
    keywords: ["liderazgo", "líder", "desarrollo", "habilidades blandas"],
  },
  {
    prompt_id: "crecimiento_006",
    categoria: "crecimiento_salarial",
    nivel: "avanzado",
    tono: "dani",
    entrada_usuario: "¿Cómo construyo un plan de desarrollo profesional?",
    respuesta_dani:
      "Plan estructurado: 1) Define tu meta a 3-5 años, 2) Identifica gaps de habilidades, 3) Establece hitos trimestrales, 4) Busca recursos (cursos, mentores, proyectos). ¿Cuál es tu meta?",
    metricas_esperadas: {
      engagement_rate: 80,
      satisfaccion_promedio: 4.7,
      acciones_completadas: 75,
    },
    keywords: ["plan de desarrollo", "carrera", "metas", "crecimiento"],
  },

  // Transición adicionales
  {
    prompt_id: "transicion_004",
    categoria: "reinvencion_transicion",
    nivel: "basico",
    tono: "sofia",
    entrada_usuario: "¿Es normal querer cambiar de carrera?",
    respuesta_sofia:
      "Totalmente normal. El promedio de personas cambia de carrera 3-7 veces en su vida. Lo importante es hacerlo con estrategia, no por impulso. ¿Qué te motiva a considerar el cambio?",
    metricas_esperadas: {
      engagement_rate: 65,
      satisfaccion_promedio: 4.4,
      acciones_completadas: 60,
    },
    keywords: ["cambio", "normal", "dudas", "validación"],
  },
  {
    prompt_id: "transicion_005",
    categoria: "reinvencion_transicion",
    nivel: "intermedio",
    tono: "dani",
    entrada_usuario: "¿Qué certificaciones me ayudan a cambiar de industria?",
    respuesta_dani:
      "Depende de tu objetivo. Para tech: Google Certificates, AWS. Para gestión: PMP, Scrum. Para datos: Google Data Analytics. Primero define tu industria objetivo y te sugiero rutas específicas.",
    metricas_esperadas: {
      engagement_rate: 75,
      satisfaccion_promedio: 4.6,
      acciones_completadas: 70,
    },
    keywords: ["certificaciones", "cursos", "capacitación", "upskilling"],
  },
  {
    prompt_id: "transicion_006",
    categoria: "reinvencion_transicion",
    nivel: "avanzado",
    tono: "dani",
    entrada_usuario: "¿Cómo explico un gap laboral en mi CV?",
    respuesta_dani:
      'Honestidad con contexto positivo. Si fue por: 1) Estudios: "Invertí en mi desarrollo profesional", 2) Personal: "Período de crecimiento personal", 3) Búsqueda: "Búsqueda estratégica del rol correcto". Enfócate en lo que aprendiste.',
    metricas_esperadas: {
      engagement_rate: 80,
      satisfaccion_promedio: 4.7,
      acciones_completadas: 75,
    },
    keywords: ["gap laboral", "explicar", "pausa", "desempleo"],
  },

  // Prompts de seguimiento y profundización
  {
    prompt_id: "seguimiento_001",
    categoria: "autoconocimiento_proposito",
    nivel: "intermedio",
    tono: "sofia",
    entrada_usuario: "¿Cómo sé si estoy en el camino correcto?",
    respuesta_sofia:
      "Señales de estar en el camino correcto: 1) Sientes que creces, 2) Tus valores se alinean con tu trabajo, 3) Tienes más días buenos que malos. No tiene que ser perfecto, pero sí significativo.",
    metricas_esperadas: {
      engagement_rate: 70,
      satisfaccion_promedio: 4.5,
      acciones_completadas: 65,
    },
    keywords: ["camino correcto", "validación", "dirección", "señales"],
  },
  {
    prompt_id: "seguimiento_002",
    categoria: "crecimiento_salarial",
    nivel: "intermedio",
    tono: "dani",
    entrada_usuario: "¿Cuándo es el mejor momento para pedir un aumento?",
    respuesta_dani:
      "Timing estratégico: 1) Después de un logro importante, 2) En ciclo de evaluaciones anuales, 3) Cuando asumes más responsabilidades, 4) Nunca en crisis de la empresa. Prepara tu caso con datos.",
    metricas_esperadas: {
      engagement_rate: 75,
      satisfaccion_promedio: 4.6,
      acciones_completadas: 70,
    },
    keywords: ["timing", "momento", "aumento", "estrategia"],
  },
  {
    prompt_id: "seguimiento_003",
    categoria: "cv_linkedin_marca",
    nivel: "avanzado",
    tono: "dani",
    entrada_usuario: "¿Cómo mido el impacto de mi marca personal?",
    respuesta_dani:
      "Métricas de marca personal: 1) Crecimiento de conexiones relevantes, 2) Engagement en contenido, 3) Mensajes de reclutadores, 4) Invitaciones a eventos/charlas. Trackea mensualmente.",
    metricas_esperadas: {
      engagement_rate: 70,
      satisfaccion_promedio: 4.5,
      acciones_completadas: 65,
    },
    keywords: ["métricas", "impacto", "medición", "resultados"],
  },
]

// Función para buscar prompts por categoría
export function getPromptsByCategory(category: PromptCategoryId): MasterPrompt[] {
  return MASTER_PROMPT_BANK.filter((p) => p.categoria === category)
}

// Función para buscar prompts por nivel
export function getPromptsByLevel(level: "basico" | "intermedio" | "avanzado"): MasterPrompt[] {
  return MASTER_PROMPT_BANK.filter((p) => p.nivel === level)
}

// Función para buscar prompts por keywords
export function searchPrompts(query: string): MasterPrompt[] {
  const lowerQuery = query.toLowerCase()
  return MASTER_PROMPT_BANK.filter(
    (p) => p.keywords.some((k) => k.includes(lowerQuery)) || p.entrada_usuario.toLowerCase().includes(lowerQuery),
  )
}

// Función para obtener prompt por ID
export function getPromptById(promptId: string): MasterPrompt | undefined {
  return MASTER_PROMPT_BANK.find((p) => p.prompt_id === promptId)
}

// Estadísticas del banco de prompts
export function getPromptBankStats() {
  return {
    total: MASTER_PROMPT_BANK.length,
    byCategory: {
      autoconocimiento: getPromptsByCategory("autoconocimiento_proposito").length,
      cv_linkedin: getPromptsByCategory("cv_linkedin_marca").length,
      entrevistas: getPromptsByCategory("entrevistas_comunicacion").length,
      crecimiento: getPromptsByCategory("crecimiento_salarial").length,
      transicion: getPromptsByCategory("reinvencion_transicion").length,
    },
    byLevel: {
      basico: getPromptsByLevel("basico").length,
      intermedio: getPromptsByLevel("intermedio").length,
      avanzado: getPromptsByLevel("avanzado").length,
    },
    byTone: {
      sofia: MASTER_PROMPT_BANK.filter((p) => p.tono === "sofia").length,
      dani: MASTER_PROMPT_BANK.filter((p) => p.tono === "dani").length,
      hibrido: MASTER_PROMPT_BANK.filter((p) => p.tono === "hibrido").length,
    },
  }
}
