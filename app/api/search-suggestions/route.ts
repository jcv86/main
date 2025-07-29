import { type NextRequest, NextResponse } from "next/server"

interface SearchSuggestion {
  id: string
  title: string
  description: string
  href: string
  category: string
}

const suggestions: SearchSuggestion[] = [
  // Dashboard y Perfil
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Panel principal con resumen de actividades",
    href: "/dashboard",
    category: "Principal",
  },
  {
    id: "profile",
    title: "Mi Perfil",
    description: "Gestiona tu información personal",
    href: "/profile",
    category: "Principal",
  },
  {
    id: "settings",
    title: "Configuración",
    description: "Ajustes de cuenta y preferencias",
    href: "/settings",
    category: "Principal",
  },
  {
    id: "change-password",
    title: "Cambiar Contraseña",
    description: "Actualiza tu contraseña de seguridad",
    href: "/change-password",
    category: "Principal",
  },
  {
    id: "notifications",
    title: "Notificaciones",
    description: "Administra tus notificaciones",
    href: "/notifications",
    category: "Principal",
  },
  {
    id: "dark-theme",
    title: "Tema Oscuro",
    description: "Activa el modo oscuro para una mejor experiencia visual",
    href: "/dark-theme",
    category: "Principal",
  },
  {
    id: "spanish-language",
    title: "Idioma Español",
    description: "Configura el idioma de la aplicación a español",
    href: "/spanish-language",
    category: "Principal",
  },

  // CV Builder
  {
    id: "cv-builder",
    title: "Constructor de CV",
    description: "Crea y edita tu currículum vitae",
    href: "/cv-builder",
    category: "CV y Documentos",
  },
  {
    id: "cv-ai-generator",
    title: "Generador de CV con IA",
    description: "Genera CVs automáticamente con inteligencia artificial",
    href: "/cv-ai-generator",
    category: "CV y Documentos",
  },
  {
    id: "export-cv",
    title: "Exportar CV",
    description: "Exporta tu currículum vitae en diferentes formatos",
    href: "/export-cv",
    category: "CV y Documentos",
  },
  {
    id: "cv-templates",
    title: "Plantillas de CV",
    description: "Elige entre varias plantillas de currículum vitae",
    href: "/cv-templates",
    category: "CV y Documentos",
  },

  // Tests
  {
    id: "personality-test",
    title: "Test de Personalidad",
    description: "Evalúa tu personalidad con el modelo Big Five",
    href: "/personality-test",
    category: "Tests Psicométricos",
  },
  {
    id: "big-five-test",
    title: "Test Big Five",
    description: "Test completo de los cinco grandes factores de personalidad",
    href: "/big-five-test",
    category: "Tests Psicométricos",
  },
  {
    id: "disc-test",
    title: "Test DISC",
    description: "Evalúa tu estilo de comportamiento DISC",
    href: "/disc-test",
    category: "Tests Psicométricos",
  },
  {
    id: "soft-skills-test",
    title: "Test de Habilidades Blandas",
    description: "Evalúa tus competencias interpersonales",
    href: "/soft-skills-test",
    category: "Tests Psicométricos",
  },
  {
    id: "technical-skills-test",
    title: "Test de Habilidades Técnicas",
    description: "Evalúa tus competencias técnicas específicas",
    href: "/technical-skills-test",
    category: "Tests Técnicos",
  },
  {
    id: "skills-assessment",
    title: "Evaluación de Habilidades",
    description: "Evaluación completa de competencias profesionales",
    href: "/skills-assessment",
    category: "Tests Técnicos",
  },
  {
    id: "personality-disc-test",
    title: "Test de Personalidad DISC",
    description: "Análisis psicológico de tu estilo de comportamiento",
    href: "/personality-disc-test",
    category: "Tests Psicométricos",
  },
  {
    id: "professional-profile",
    title: "Perfil Profesional",
    description: "Descubre más sobre tu perfil profesional",
    href: "/professional-profile",
    category: "Tests Psicométricos",
  },

  // Herramientas
  {
    id: "career-coach",
    title: "Coach de Carrera",
    description: "Asistente de IA para orientación profesional",
    href: "/career-coach",
    category: "Herramientas",
  },
  {
    id: "job-search",
    title: "Búsqueda de Empleos",
    description: "Encuentra oportunidades laborales en Chile",
    href: "/job-search",
    category: "Herramientas",
  },
  {
    id: "library",
    title: "Biblioteca",
    description: "Recursos de desarrollo profesional y libros",
    href: "/library",
    category: "Herramientas",
  },
  {
    id: "calendar",
    title: "Calendario",
    description: "Gestiona tus citas y eventos profesionales",
    href: "/calendar",
    category: "Herramientas",
  },
  {
    id: "goals",
    title: "Metas",
    description: "Define y sigue tus objetivos profesionales",
    href: "/goals",
    category: "Herramientas",
  },
  {
    id: "job-alerts",
    title: "Alertas de Trabajo",
    description: "Recibe notificaciones sobre nuevas oportunidades laborales",
    href: "/job-alerts",
    category: "Herramientas",
  },
  {
    id: "career-planning",
    title: "Planificación de Carrera",
    description: "Establece y sigue tus metas de carrera",
    href: "/career-planning",
    category: "Herramientas",
  },
  {
    id: "objective-tracking",
    title: "Seguimiento de Objetivos",
    description: "Monitorea el progreso hacia tus objetivos profesionales",
    href: "/objective-tracking",
    category: "Herramientas",
  },

  // Educación
  {
    id: "udd-careers",
    title: "Carreras UDD",
    description: "Explora las carreras de la Universidad del Desarrollo",
    href: "/udd-careers",
    category: "Educación",
  },
  {
    id: "bachillerato",
    title: "Bachillerato",
    description: "Información sobre programas de bachillerato",
    href: "/bachillerato",
    category: "Educación",
  },
  {
    id: "university-programs",
    title: "Programas de Universidad",
    description: "Descubre más sobre los programas académicos disponibles",
    href: "/university-programs",
    category: "Educación",
  },
  {
    id: "continuing-education",
    title: "Educación Continua",
    description: "Oportunidades para mejorar tus conocimientos y habilidades",
    href: "/continuing-education",
    category: "Educación",
  },
]

const commonSuggestions = [
  "crear cv",
  "test de personalidad",
  "buscar trabajo",
  "evaluar habilidades",
  "coach profesional",
  "biblioteca de recursos",
  "carreras universitarias",
  "planificar objetivos",
  "calendario de eventos",
  "configurar perfil",
  "cambiar contraseña",
  "notificaciones",
  "tema oscuro",
  "idioma español",
  "exportar cv",
  "descargar certificado",
  "compartir perfil",
  "estadísticas de progreso",
  "recomendaciones personalizadas",
  "feedback de entrevistas",
]

const categoryKeywords = {
  cv: ["curriculum", "hoja de vida", "resume", "plantilla", "formato"],
  personality: ["personalidad", "psicológico", "comportamiento", "carácter"],
  skills: ["habilidades", "competencias", "destrezas", "capacidades"],
  jobs: ["trabajo", "empleo", "ofertas", "vacantes", "oportunidades"],
  education: ["educación", "universidad", "carrera", "estudios", "académico"],
  coaching: ["coach", "orientación", "consejería", "mentoría", "guía"],
  planning: ["planificación", "objetivos", "metas", "calendario", "agenda"],
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.toLowerCase() || ""

  if (query.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  // Filter suggestions based on query
  const filteredSuggestions = suggestions.filter((suggestion) =>
    `${suggestion.title} ${suggestion.description} ${suggestion.category}`.toLowerCase().includes(query),
  )

  // Add category-based suggestions
  const categorySuggestions: string[] = []
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    if (keywords.some((keyword) => keyword.includes(query))) {
      switch (category) {
        case "cv":
          categorySuggestions.push("crear curriculum vitae", "descargar cv en pdf", "plantillas de cv")
          break
        case "personality":
          categorySuggestions.push("test de personalidad DISC", "análisis psicológico", "perfil profesional")
          break
        case "skills":
          categorySuggestions.push("evaluación de competencias", "test de habilidades técnicas", "certificaciones")
          break
        case "jobs":
          categorySuggestions.push("ofertas de trabajo en Chile", "búsqueda de empleo", "alertas de trabajo")
          break
        case "education":
          categorySuggestions.push("carreras universitarias", "programas de estudio", "educación continua")
          break
        case "coaching":
          categorySuggestions.push("orientación profesional", "coach de carrera", "mentoría personalizada")
          break
        case "planning":
          categorySuggestions.push("planificación de carrera", "establecer metas", "seguimiento de objetivos")
          break
      }
    }
  })

  // Combine and deduplicate suggestions
  const allSuggestions = [...new Set([...filteredSuggestions.map((s) => s.title), ...categorySuggestions])]

  // Limit to top 8 suggestions
  const suggestionsResult = allSuggestions.slice(0, 8).map((title) => suggestions.find((s) => s.title === title))

  return NextResponse.json({ suggestions: suggestionsResult })
}
