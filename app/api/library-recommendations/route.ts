import { type NextRequest, NextResponse } from "next/server"

interface RecommendationRequest {
  userId: string
  userLevel: number
  booksRead: number
  readingTime: number
}

interface AIRecommendation {
  book: any
  reason: string
  priority: "high" | "medium" | "low"
  expectedBenefit: string
}

// Curated recommendations based on user profile
const getCuratedRecommendations = (userLevel: number, booksRead: number): AIRecommendation[] => {
  const allBooks = [
    {
      id: "1",
      title: "Hábitos Atómicos",
      author: "James Clear",
      category: "Productividad",
      difficulty: "Intermedio",
      rating: 4.8,
      reading_time: "4h 30min",
      cover_url: "/books/atomic-habits.jpg",
      is_recommended: true,
    },
    {
      id: "2",
      title: "Trabajo Profundo",
      author: "Cal Newport",
      category: "Productividad",
      difficulty: "Intermedio",
      rating: 4.7,
      reading_time: "3h 5min",
      cover_url: "/books/deep-work.jpg",
      is_recommended: true,
    },
    {
      id: "3",
      title: "Los 7 Hábitos de la Gente Altamente Efectiva",
      author: "Stephen R. Covey",
      category: "Liderazgo",
      difficulty: "Intermedio",
      rating: 4.6,
      reading_time: "5h 15min",
      cover_url: "/books/7-habits.jpg",
      is_recommended: true,
    },
    {
      id: "4",
      title: "De Buena a Grandiosa",
      author: "Jim Collins",
      category: "Negocios",
      difficulty: "Avanzado",
      rating: 4.7,
      reading_time: "4h 50min",
      cover_url: "/books/good-to-great.jpg",
      is_recommended: true,
    },
    {
      id: "5",
      title: "Conversaciones Cruciales",
      author: "Kerry Patterson, Joseph Grenny, Ron McMillan, Al Switzler",
      category: "Habilidades Blandas",
      difficulty: "Intermedio",
      rating: 4.6,
      reading_time: "3h 40min",
      cover_url: "/books/crucial-conversations.jpg",
      is_recommended: true,
    },
  ]

  const recommendations: AIRecommendation[] = []

  // Beginner recommendations (Level 1-2, 0-2 books read)
  if (userLevel <= 2 || booksRead <= 2) {
    recommendations.push({
      book: allBooks[0], // Hábitos Atómicos
      reason: "Perfecto para comenzar tu desarrollo profesional con fundamentos sólidos",
      priority: "high",
      expectedBenefit: "Aprenderás a construir hábitos productivos que impulsarán tu carrera en Chile",
    })

    recommendations.push({
      book: allBooks[2], // 7 Hábitos
      reason: "Principios fundamentales de efectividad personal muy valorados en empresas chilenas",
      priority: "high",
      expectedBenefit: "Desarrollarás una mentalidad proactiva esencial para el mercado laboral chileno",
    })

    recommendations.push({
      book: allBooks[4], // Conversaciones Cruciales
      reason: "Habilidades de comunicación críticas para el ambiente laboral chileno",
      priority: "medium",
      expectedBenefit: "Mejorarás tu capacidad de comunicación en contextos profesionales chilenos",
    })
  }
  // Intermediate recommendations (Level 3-4, 3-5 books read)
  else if (userLevel <= 4 || booksRead <= 5) {
    recommendations.push({
      book: allBooks[1], // Trabajo Profundo
      reason: "Esencial para destacar en el competitivo mercado tech chileno",
      priority: "high",
      expectedBenefit: "Desarrollarás la capacidad de concentración valorada en startups chilenas",
    })

    recommendations.push({
      book: allBooks[3], // De Buena a Grandiosa
      reason: "Principios de liderazgo aplicables en empresas chilenas en crecimiento",
      priority: "medium",
      expectedBenefit: "Comprenderás cómo las empresas chilenas exitosas logran la excelencia",
    })

    recommendations.push({
      book: allBooks[0], // Hábitos Atómicos (if not read)
      reason: "Complementa tu desarrollo con sistemas de mejora continua",
      priority: "medium",
      expectedBenefit: "Optimizarás tu productividad personal para el mercado chileno",
    })
  }
  // Advanced recommendations (Level 5+, 6+ books read)
  else {
    recommendations.push({
      book: allBooks[3], // De Buena a Grandiosa
      reason: "Momento ideal para enfocarte en liderazgo y gestión empresarial",
      priority: "high",
      expectedBenefit: "Desarrollarás habilidades de liderazgo para roles senior en Chile",
    })

    recommendations.push({
      book: allBooks[1], // Trabajo Profundo
      reason: "Perfecciona tu capacidad de trabajo de alto valor en la economía del conocimiento",
      priority: "medium",
      expectedBenefit: "Maximizarás tu impacto profesional en roles de alta responsabilidad",
    })

    recommendations.push({
      book: allBooks[4], // Conversaciones Cruciales
      reason: "Habilidades avanzadas de comunicación para liderazgo efectivo",
      priority: "medium",
      expectedBenefit: "Liderarás equipos y proyectos complejos con comunicación efectiva",
    })
  }

  return recommendations.slice(0, 3) // Return top 3 recommendations
}

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json()
    const { userId, userLevel, booksRead, readingTime } = body

    // Use curated recommendations since AI SDK is removed
    const recommendations = getCuratedRecommendations(userLevel, booksRead)

    return NextResponse.json({
      success: true,
      recommendations,
      source: "curated",
    })
  } catch (error) {
    console.error("Error generating recommendations:", error)

    // Fallback to curated recommendations
    const fallbackRecommendations = getCuratedRecommendations(3, 2)

    return NextResponse.json({
      success: true,
      recommendations: fallbackRecommendations,
      source: "fallback",
    })
  }
}
