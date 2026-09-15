export interface FAQItem {
  id: string
  question: string
  answer: string
  category: FAQCategory
  keywords: string[]
  relatedIds?: string[]
}

export type FAQCategory = "tests" | "biblioteca" | "coach-ia" | "cuenta" | "empresa" | "general"

export const FAQ_CATEGORIES: Record<FAQCategory, { label: string; icon: string }> = {
  tests: { label: "A1 · Autoconocimiento", icon: "clipboard" },
  biblioteca: { label: "A2 · Tu Ruta", icon: "book" },
  "coach-ia": { label: "Vera", icon: "sparkles" },
  cuenta: { label: "Cuenta y Acceso", icon: "user" },
  empresa: { label: "Instituciones", icon: "building" },
  general: { label: "General", icon: "help" },
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: "que-es-dtc",
    question: "¿Qué es Despega Tu Carrera?",
    answer:
      "Despega Tu Carrera es un recorrido de desarrollo profesional conectado en cuatro etapas. A1 ayuda a observar tu punto de partida e identidad profesional; A2 organiza una ruta de 90 días; A3 permite practicar situaciones reales; y A4 incorpora señales y contexto de mercado. El objetivo es ayudarte a tomar decisiones con más evidencia, no prometerte un empleo ni decidir por ti.",
    category: "general",
    keywords: ["qué es", "desarrollo profesional", "a1", "a2", "a3", "a4", "evidencia"],
    relatedIds: ["como-funciona-90-dias", "quien-es-vera"],
  },
  {
    id: "que-es-a1",
    question: "¿Qué hace A1 · Despega Cerebral?",
    answer:
      "A1 reúne respuestas y evidencia del usuario para construir una lectura de su identidad profesional y sus patrones. No es un diagnóstico clínico ni una verdad definitiva sobre la persona: es una base de trabajo que luego se conecta con la ruta, la práctica y el contexto de mercado.",
    category: "tests",
    keywords: ["a1", "despega cerebral", "autoconocimiento", "identidad", "perfil"],
    relatedIds: ["que-es-dtc", "privacidad-datos"],
  },
  {
    id: "como-funciona-90-dias",
    question: "¿Qué significa la ruta de 90 días de A2?",
    answer:
      "A2 organiza el trabajo profesional en una ruta de hasta 90 días con etapas, actividades y revisiones. La ruta se conecta con la evidencia disponible del recorrido y puede retomarse desde la cuenta. Los 90 días describen la estructura de la ruta; no son una garantía de conseguir trabajo ni de lograr un resultado específico en ese plazo.",
    category: "biblioteca",
    keywords: ["a2", "90 días", "ruta", "misiones", "progreso"],
    relatedIds: ["que-es-dtc", "guardar-progreso"],
  },
  {
    id: "que-es-a3",
    question: "¿Qué se practica en A3 · Entrenamiento?",
    answer:
      "A3 está diseñado para practicar antes del momento real. Incluye ejercicios y simulaciones relacionados con comunicación, entrevistas y decisiones profesionales. El foco es producir evidencia de práctica y aprendizaje que pueda conectarse con el resto del recorrido.",
    category: "general",
    keywords: ["a3", "entrenamiento", "entrevista", "práctica", "simulación"],
    relatedIds: ["que-es-dtc", "quien-es-vera"],
  },
  {
    id: "que-es-a4",
    question: "¿Qué aporta A4 · Radar Estratégico?",
    answer:
      "A4 incorpora señales y contexto de mercado para que la persona pueda revisar sus decisiones con una mirada más amplia. DTC busca distinguir datos, contexto e inferencias; no reemplaza asesoría financiera, legal ni decisiones personales del usuario.",
    category: "general",
    keywords: ["a4", "radar", "mercado", "señales", "contexto"],
    relatedIds: ["que-es-dtc", "quien-es-vera"],
  },
  {
    id: "quien-es-vera",
    question: "¿Quién es Vera y cómo usa mi contexto?",
    answer:
      "Vera es el coach con IA de DTC. Para preguntas simples puede responder con un camino rápido; cuando una consulta requiere contexto personal, puede usar evidencia disponible del recorrido A1–A4 mediante herramientas del servidor. Vera debe distinguir evidencia de inferencias, preguntar cuando falta contexto y dejar la decisión final en tus manos.",
    category: "coach-ia",
    keywords: ["vera", "coach", "ia", "contexto", "evidencia", "análisis profundo"],
    relatedIds: ["vera-inventa", "privacidad-datos"],
  },
  {
    id: "vera-inventa",
    question: "¿Vera puede decidir por mí o inventar información sobre mi perfil?",
    answer:
      "No debería hacerlo. La política de Vera exige no inventar hechos sobre el usuario o el mercado y separar lo observado de lo inferido. En decisiones profesionales, su función es ayudarte a revisar criterios, trade-offs y evidencia; la decisión final pertenece al usuario.",
    category: "coach-ia",
    keywords: ["vera", "decisión", "inventar", "inferencia", "agencia"],
    relatedIds: ["quien-es-vera", "que-es-dtc"],
  },
  {
    id: "guardar-progreso",
    question: "¿Puedo salir y retomar mi progreso después?",
    answer:
      "Sí. El recorrido usa estado persistido para que puedas volver a la etapa correspondiente. Además, existen controles de acceso que evitan saltar directamente a contenido futuro cuando todavía no corresponde según el progreso registrado.",
    category: "cuenta",
    keywords: ["progreso", "guardar", "retomar", "sesión", "ruta"],
    relatedIds: ["como-funciona-90-dias", "como-acceder"],
  },
  {
    id: "como-acceder",
    question: "¿Cómo accedo actualmente a Despega Tu Carrera?",
    answer:
      "El acceso actual se gestiona mediante el piloto e invitaciones autorizadas. Si ya tienes acceso puedes iniciar sesión; si todavía no lo tienes, puedes solicitar información o contactar al equipo desde la página de acceso. DTC no publica actualmente un plan comercial de autoservicio con precio o garantía estándar.",
    category: "cuenta",
    keywords: ["acceso", "invitación", "piloto", "precio", "cuenta"],
    relatedIds: ["guardar-progreso", "instituciones"],
  },
  {
    id: "privacidad-datos",
    question: "¿Cómo se protege mi información dentro del recorrido?",
    answer:
      "Las áreas privadas requieren autenticación y los datos principales del recorrido están protegidos con controles de propiedad y políticas de acceso en la base de datos. Algunos procesos técnicos del servidor y administradores autorizados pueden acceder cuando es necesario para operar y proteger el servicio. La política de privacidad publicada contiene el marco aplicable al tratamiento de datos.",
    category: "cuenta",
    keywords: ["privacidad", "datos", "seguridad", "rls", "acceso"],
    relatedIds: ["quien-es-vera", "como-acceder"],
  },
  {
    id: "instituciones",
    question: "¿DTC puede evaluarse con una universidad, empresa u otra institución?",
    answer:
      "Sí, mediante un piloto acotado y acordado caso a caso. Antes de escalar se define qué se quiere aprender, la población, la duración, los resguardos y las métricas observables. DTC no publica resultados institucionales, ahorros, rankings ni retornos sobre inversión sin evidencia verificable que los respalde.",
    category: "empresa",
    keywords: ["universidad", "empresa", "institución", "piloto", "b2b"],
    relatedIds: ["como-acceder", "que-es-dtc"],
  },
  {
    id: "garantiza-empleo",
    question: "¿Despega Tu Carrera garantiza que voy a conseguir trabajo?",
    answer:
      "No. DTC puede ayudarte a comprender mejor tu punto de partida, organizar una ruta, practicar y revisar evidencia, pero no garantiza empleo, ascensos, aumentos de sueldo ni resultados profesionales específicos. Las decisiones y resultados dependen de múltiples factores fuera del control de la plataforma.",
    category: "general",
    keywords: ["empleo", "garantía", "resultado", "trabajo", "ascenso"],
    relatedIds: ["que-es-dtc", "como-funciona-90-dias"],
  },
  {
    id: "es-clinico",
    question: "¿DTC reemplaza evaluación psicológica, terapia o asesoría profesional regulada?",
    answer:
      "No. Despega Tu Carrera es una herramienta de desarrollo profesional y no un servicio clínico. Tampoco reemplaza asesoría legal, financiera, médica u otra asesoría profesional regulada. Cuando una situación lo requiera, corresponde acudir al profesional adecuado.",
    category: "general",
    keywords: ["psicología", "terapia", "clínico", "asesoría", "límites"],
    relatedIds: ["que-es-a1", "garantiza-empleo"],
  },
]

export function getFAQsByCategory(category: FAQCategory): FAQItem[] {
  return FAQ_DATA.filter((faq) => faq.category === category)
}

export function searchFAQs(query: string): FAQItem[] {
  const q = query.toLowerCase().trim()
  if (!q) return FAQ_DATA

  return FAQ_DATA.filter(
    (faq) =>
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.keywords.some((keyword) => keyword.toLowerCase().includes(q)),
  )
}

export function getRelatedFAQs(faq: FAQItem): FAQItem[] {
  if (!faq.relatedIds?.length) return []
  return faq.relatedIds
    .map((id) => FAQ_DATA.find((item) => item.id === id))
    .filter((item): item is FAQItem => Boolean(item))
}
