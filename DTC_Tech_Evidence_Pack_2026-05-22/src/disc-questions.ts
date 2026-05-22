// A1 ORIGEN - 28 Preguntas Base "Más/Menos/Como Yo"
// Basadas en el modelo conductual para diagnóstico Despega Cerebral
// Formato: El usuario elige entre Más (soy así), Menos (no soy así), Como yo (es relativo)

export interface A1Question {
  id: number
  text: string
  category: 'dominancia' | 'influencia' | 'estabilidad' | 'conciencia'
  trait: string
}

export const A1_PREGUNTAS_BASE: A1Question[] = [
  // DOMINANCIA - Tendencia a dirigir, decidir rápido, enfrentar desafíos
  { 
    id: 1, 
    text: "Tomo decisiones rápidamente, incluso sin tener toda la información",
    category: 'dominancia',
    trait: 'rapidez_decisión'
  },
  { 
    id: 2, 
    text: "Prefiero estar en control de mis proyectos y decisiones",
    category: 'dominancia',
    trait: 'necesidad_control'
  },
  { 
    id: 3, 
    text: "Me energiza competir y ganar en lo que hago",
    category: 'dominancia',
    trait: 'competitividad'
  },
  { 
    id: 4, 
    text: "Me gusta desafiar el status quo y proponer nuevas ideas",
    category: 'dominancia',
    trait: 'desafío_normas'
  },
  { 
    id: 5, 
    text: "Enfrento conflictos de frente sin evitarlos",
    category: 'dominancia',
    trait: 'dirección_conflictos'
  },
  { 
    id: 6, 
    text: "Soy directo en mis palabras, a veces sin filtro",
    category: 'dominancia',
    trait: 'franqueza'
  },
  { 
    id: 7, 
    text: "Me motiva liderar personas y proyectos",
    category: 'dominancia',
    trait: 'orientación_liderazgo'
  },

  // INFLUENCIA - Tendencia a inspirar, conectar, comunicar
  { 
    id: 8, 
    text: "Disfruto conocer gente nueva y hacer conexiones",
    category: 'influencia',
    trait: 'sociabilidad'
  },
  { 
    id: 9, 
    text: "Tengo mucha energía y la contagio a otros",
    category: 'influencia',
    trait: 'energía_contagio'
  },
  { 
    id: 10, 
    text: "Prefiero hablar y persuadir antes que analizar datos",
    category: 'influencia',
    trait: 'estilo_comunicación'
  },
  { 
    id: 11, 
    text: "Me gusta ser el foco de atención en grupos",
    category: 'influencia',
    trait: 'visibilidad'
  },
  { 
    id: 12, 
    text: "Soy optimista y encuentro lo positivo en todo",
    category: 'influencia',
    trait: 'optimismo'
  },
  { 
    id: 13, 
    text: "Busco reconocimiento y elogios por mi trabajo",
    category: 'influencia',
    trait: 'búsqueda_reconocimiento'
  },
  { 
    id: 14, 
    text: "Prefiero un ambiente dinámico y variado al trabajo repetitivo",
    category: 'influencia',
    trait: 'rechazo_monotonía'
  },

  // ESTABILIDAD - Tendencia a apoyar, colaborar, mantener
  { 
    id: 15, 
    text: "Valoro la estabilidad y previsibilidad",
    category: 'estabilidad',
    trait: 'valor_estabilidad'
  },
  { 
    id: 16, 
    text: "Soy paciente y puedo esperar a que las cosas se desarrollen",
    category: 'estabilidad',
    trait: 'paciencia'
  },
  { 
    id: 17, 
    text: "Me gusta trabajar en equipo y colaborar",
    category: 'estabilidad',
    trait: 'orientación_equipo'
  },
  { 
    id: 18, 
    text: "Prefiero cambios graduales antes que transformaciones abruptas",
    category: 'estabilidad',
    trait: 'ritmo_cambio'
  },
  { 
    id: 19, 
    text: "Soy buen oyente y me gusta ayudar a otros",
    category: 'estabilidad',
    trait: 'empatía'
  },
  { 
    id: 20, 
    text: "Las relaciones personales son más importantes que los logros individuales",
    category: 'estabilidad',
    trait: 'prioridad_relaciones'
  },
  { 
    id: 21, 
    text: "Soy leal y cumplo mis compromisos",
    category: 'estabilidad',
    trait: 'lealtad'
  },

  // CONCIENCIA - Tendencia a analizar, verificar, cumplir
  { 
    id: 22, 
    text: "Analizo datos e información antes de decidir",
    category: 'conciencia',
    trait: 'análisis_previo'
  },
  { 
    id: 23, 
    text: "Soy detallista y me preocupa que todo esté correcto",
    category: 'conciencia',
    trait: 'atención_detalles'
  },
  { 
    id: 24, 
    text: "Prefiero seguir procesos establecidos y reglas",
    category: 'conciencia',
    trait: 'cumplimiento_normas'
  },
  { 
    id: 25, 
    text: "Cuestiono lo que no tiene lógica clara",
    category: 'conciencia',
    trait: 'espíritu_crítico'
  },
  { 
    id: 26, 
    text: "Me motiva hacer trabajo de alta calidad, aunque tome más tiempo",
    category: 'conciencia',
    trait: 'excelencia'
  },
  { 
    id: 27, 
    text: "Prefiero trabajar en tareas complejas que requieren concentración",
    category: 'conciencia',
    trait: 'profundidad'
  },
  { 
    id: 28, 
    text: "Soy cauteloso y analizo riesgos antes de actuar",
    category: 'conciencia',
    trait: 'análisis_riesgos'
  },
]
