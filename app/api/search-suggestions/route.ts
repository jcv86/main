import { type NextRequest, NextResponse } from "next/server"

const suggestions = [
  // Páginas principales
  { title: "Dashboard", href: "/dashboard", category: "Páginas" },
  { title: "CV Builder", href: "/cv-builder", category: "Páginas" },
  { title: "Búsqueda de Empleo", href: "/job-search", category: "Páginas" },
  { title: "Coach de Carrera", href: "/career-coach", category: "Páginas" },
  { title: "Simulador de Entrevistas", href: "/interview-simulator", category: "Páginas" },
  { title: "Biblioteca", href: "/library", category: "Páginas" },
  { title: "Calendario", href: "/calendar", category: "Páginas" },
  { title: "Metas", href: "/goals", category: "Páginas" },

  // Tests psicométricos
  { title: "Test de Personalidad", href: "/personality-test", category: "Tests" },
  { title: "Test DISC", href: "/disc-test", category: "Tests" },
  { title: "Big Five", href: "/big-five-test", category: "Tests" },
  { title: "Habilidades Blandas", href: "/soft-skills-test", category: "Tests" },
  { title: "Habilidades Técnicas", href: "/technical-skills-test", category: "Tests" },
  { title: "Test Adaptativo", href: "/adaptive-skills-test", category: "Tests" },

  // Educación
  { title: "Carreras UDD", href: "/udd-careers", category: "Educación" },
  { title: "Bachillerato", href: "/bachillerato", category: "Educación" },

  // Herramientas
  { title: "Generador de CV con IA", href: "/cv-ai-generator", category: "Herramientas" },
  { title: "Sistema Mirix", href: "/mirix", category: "Herramientas" },
  { title: "Configuración", href: "/settings", category: "Configuración" },
  { title: "Perfil", href: "/profile", category: "Configuración" },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.toLowerCase() || ""

  if (!query) {
    return NextResponse.json({ suggestions: suggestions.slice(0, 10) })
  }

  const filtered = suggestions.filter(
    (item) => item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query),
  )

  return NextResponse.json({ suggestions: filtered.slice(0, 10) })
}
