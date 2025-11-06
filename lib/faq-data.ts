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
  tests: { label: "Tests Psicométricos", icon: "clipboard" },
  biblioteca: { label: "Biblioteca", icon: "book" },
  "coach-ia": { label: "Coach IA", icon: "sparkles" },
  cuenta: { label: "Cuenta y Acceso", icon: "user" },
  empresa: { label: "Empresas", icon: "building" },
  general: { label: "General", icon: "help" },
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: "que-es-dtc",
    question: "¿Qué es Despega Tu Carrera y cómo puede ayudarme?",
    answer:
      "Despega Tu Carrera es la plataforma líder en Chile para desarrollo profesional. Combina tests psicométricos científicos (Despega Cerebral, Mapa de Personalidad, 5 Dimensiones, Brújula Vocacional, Inteligencia Emocional), una biblioteca con más de 120 libros profesionales y coaching personalizado con inteligencia artificial. Te ayudamos a descubrir tu potencial, desarrollar habilidades clave y alcanzar tus objetivos profesionales.",
    category: "general",
    keywords: ["plataforma", "desarrollo profesional", "ayuda", "qué es", "beneficios"],
    relatedIds: ["tests-confiables", "coach-ia-funciona"],
  },
  {
    id: "tests-confiables",
    question: "¿Los tests psicométricos son confiables?",
    answer:
      "Sí, utilizamos tests psicométricos validados científicamente y reconocidos internacionalmente. Nuestros tests incluyen Despega Cerebral (comportamiento laboral), Mapa de Personalidad (tipos de personalidad), 5 Dimensiones (rasgos de personalidad), Brújula Vocacional (orientación vocacional) e Inteligencia Emocional. Miles de empresas y profesionales confían en estas evaluaciones para tomar decisiones informadas.",
    category: "tests",
    keywords: ["confiables", "científicos", "validados", "precisión", "exactitud"],
    relatedIds: ["tiempo-tests", "que-es-dtc"],
  },
  {
    id: "coach-ia-funciona",
    question: "¿Cómo funciona el coaching con inteligencia artificial?",
    answer:
      "Nuestro Coach IA analiza tu perfil psicométrico y te brinda recomendaciones personalizadas 24/7. Utiliza tecnología GPT-4 entrenada con conocimiento de 120+ libros profesionales y 100+ recursos especializados. Recibe consejos sobre desarrollo de carrera, habilidades blandas, liderazgo y crecimiento profesional adaptados específicamente a tu perfil y objetivos.",
    category: "coach-ia",
    keywords: ["coach", "ia", "inteligencia artificial", "personalizado", "funciona", "sofia", "dani"],
    relatedIds: ["biblioteca-incluye", "que-es-dtc"],
  },
  {
    id: "biblioteca-incluye",
    question: "¿Qué incluye la biblioteca profesional?",
    answer:
      "Acceso a más de 120 libros completos sobre desarrollo profesional, liderazgo, inteligencia emocional, productividad, comunicación efectiva y habilidades blandas. Incluye bestsellers como '7 Hábitos de la Gente Altamente Efectiva', 'Inteligencia Emocional', 'Hábitos Atómicos', 'Cómo Ganar Amigos' y muchos más. Además, 100+ recursos web curados del mercado chileno.",
    category: "biblioteca",
    keywords: ["biblioteca", "libros", "contenido", "recursos", "bestsellers"],
    relatedIds: ["es-gratis", "coach-ia-funciona"],
  },
  {
    id: "tiempo-tests",
    question: "¿Cuánto tiempo toma completar los tests?",
    answer:
      "Cada test toma entre 10-20 minutos. Despega Cerebral: 15 min, Mapa de Personalidad: 20 min, 5 Dimensiones: 15 min, Brújula Vocacional: 20 min, Inteligencia Emocional: 15 min, Competencias: 15 min. Puedes tomarlos en cualquier momento y desde cualquier dispositivo. Los resultados están disponibles inmediatamente después de completar cada evaluación.",
    category: "tests",
    keywords: ["tiempo", "duración", "cuánto demora", "minutos", "rápido"],
    relatedIds: ["tests-confiables", "resultados-privados"],
  },
  {
    id: "es-gratis",
    question: "¿Es gratis la plataforma?",
    answer:
      "Sí, Despega Tu Carrera ofrece acceso gratuito a todos sus tests psicométricos, biblioteca completa de libros y coaching básico con IA. Estamos comprometidos con democratizar el acceso al desarrollo profesional en Chile. Planes premium con funcionalidades avanzadas estarán disponibles próximamente.",
    category: "cuenta",
    keywords: ["gratis", "precio", "costo", "pago", "gratuito", "free"],
    relatedIds: ["que-es-dtc", "biblioteca-incluye"],
  },
  {
    id: "para-empresas",
    question: "¿Puedo usar Despega Tu Carrera para mi equipo o empresa?",
    answer:
      "Sí, ofrecemos soluciones para empresas que desean evaluar y desarrollar el talento de sus equipos. Contáctanos para conocer planes corporativos que incluyen evaluaciones masivas, dashboards de equipo, análisis comparativos y coaching especializado para líderes.",
    category: "empresa",
    keywords: ["empresa", "equipo", "corporativo", "negocio", "rrhh", "recursos humanos"],
    relatedIds: ["tests-confiables", "resultados-privados"],
  },
  {
    id: "resultados-privados",
    question: "¿Los resultados de los tests son privados?",
    answer:
      "Absolutamente. Tus resultados son completamente privados y solo tú puedes acceder a ellos. No compartimos información personal con terceros. Puedes descargar tus resultados en PDF o compartirlos voluntariamente cuando lo desees, por ejemplo, en procesos de selección o desarrollo profesional.",
    category: "cuenta",
    keywords: ["privacidad", "privados", "seguridad", "confidencial", "datos"],
    relatedIds: ["es-gratis", "para-empresas"],
  },
  {
    id: "diferencia-sofia-dani",
    question: "¿Cuál es la diferencia entre Sofia y Dani?",
    answer:
      "Sofia y Dani son nuestros dos coaches virtuales con personalidades complementarias. Sofia se especializa en apoyo emocional, motivación y desarrollo personal, con un enfoque empático y cálido. Dani se enfoca en estrategia profesional, planificación de carrera y aspectos técnicos como CV, entrevistas y networking, con un enfoque más estructurado y analítico. El sistema selecciona automáticamente el coach más apropiado según tu consulta.",
    category: "coach-ia",
    keywords: ["sofia", "dani", "diferencia", "coaches", "personalidades"],
    relatedIds: ["coach-ia-funciona", "que-es-dtc"],
  },
  {
    id: "como-empezar",
    question: "¿Cómo empiezo a usar la plataforma?",
    answer:
      "Es muy simple: 1) Crea tu cuenta gratuita, 2) Completa al menos un test psicométrico para que el sistema conozca tu perfil, 3) Explora la biblioteca de libros y recursos, 4) Chatea con Sofia o Dani para recibir recomendaciones personalizadas. No necesitas tarjeta de crédito y puedes empezar inmediatamente.",
    category: "cuenta",
    keywords: ["empezar", "comenzar", "inicio", "primeros pasos", "tutorial"],
    relatedIds: ["es-gratis", "tiempo-tests"],
  },
]
