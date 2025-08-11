// Complete book content management system
export interface BookChapter {
  id: string
  book_id: string
  chapter_number: number
  title: string
  content: string
  reading_time_minutes?: number
  key_points?: string[]
  created_at: string
  updated_at?: string
}

export interface Book {
  id: string
  title: string
  author: string
  description: string
  category: string
  rating: number
  reading_time: string
  pages: number
  published_year: number
  cover_url: string
  tags: string[]
  difficulty: "Fácil" | "Intermedio" | "Avanzado"
  key_topics: string[]
  is_recommended: boolean
  chapters?: BookChapter[]
  progress?: number
  created_at: string
  updated_at: string
}

export interface UserBookProgress {
  id: string
  user_id: string
  book_id: string
  current_page: number
  total_pages: number
  progress_percentage: number
  reading_time_minutes: number
  started_at: string
  last_read_at: string
  created_at: string
  updated_at: string
}

export interface UserBookBookmark {
  id: string
  user_id: string
  book_id: string
  chapter_id?: string
  page_number: number
  chapter_title: string
  note: string
  highlight_text?: string
  bookmark_type: "note" | "highlight" | "bookmark"
  created_at: string
  updated_at?: string
}

export interface ReadingSession {
  book_id: string
  chapter_number: number
  start_time: Date
  end_time?: Date
  pages_read: number
  notes?: string
  focus_score?: number
}

export interface BookSearchFilters {
  category?: string
  difficulty?: string
  rating_min?: number
  tags?: string[]
  author?: string
  is_recommended?: boolean
  search_query?: string
}

export interface BookAnalytics {
  total_reading_time: number
  books_completed: number
  books_in_progress: number
  favorite_categories: string[]
  reading_streak: number
  average_rating: number
  pages_read_today: number
  weekly_goal_progress: number
}

export interface ReadingGoal {
  id: string
  user_id: string
  goal_type: "books_per_month" | "pages_per_day" | "minutes_per_day"
  target_value: number
  current_progress: number
  start_date: string
  end_date: string
  is_active: boolean
}

export interface BookRecommendation {
  book: Book
  score: number
  reasons: string[]
  similarity_books: string[]
}

// Comprehensive book content service
export class BookContentService {
  // Text analysis and processing
  static extractKeyPoints(content: string): string[] {
    const keyPoints: string[] = []

    // Extract bold text (markdown **text**)
    const boldMatches = content.match(/\*\*(.*?)\*\*/g)
    if (boldMatches) {
      boldMatches.forEach((match) => {
        const point = match.replace(/\*\*/g, "").trim()
        if (point.length > 10 && point.length < 200) {
          keyPoints.push(point)
        }
      })
    }

    // Extract numbered lists
    const numberedMatches = content.match(/^\d+\.\s(.+)$/gm)
    if (numberedMatches) {
      numberedMatches.forEach((match) => {
        const point = match.replace(/^\d+\.\s/, "").trim()
        if (point.length > 10) {
          keyPoints.push(point)
        }
      })
    }

    // Extract bullet points
    const bulletMatches = content.match(/^[•·-]\s(.+)$/gm)
    if (bulletMatches) {
      bulletMatches.forEach((match) => {
        const point = match.replace(/^[•·-]\s/, "").trim()
        if (point.length > 10) {
          keyPoints.push(point)
        }
      })
    }

    // Extract sentences with key indicators
    const sentences = content.split(/[.!?]+/)
    sentences.forEach((sentence) => {
      const trimmed = sentence.trim()
      if (
        trimmed.length > 20 &&
        trimmed.length < 200 &&
        (trimmed.toLowerCase().includes("importante") ||
          trimmed.toLowerCase().includes("clave") ||
          trimmed.toLowerCase().includes("fundamental") ||
          trimmed.toLowerCase().includes("esencial"))
      ) {
        keyPoints.push(trimmed)
      }
    })

    return [...new Set(keyPoints)].slice(0, 8) // Remove duplicates and limit to 8
  }

  // Reading time calculations
  static calculateReadingTime(content: string): number {
    const wordsPerMinute = 200 // Average reading speed in Spanish
    const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  static estimateChapterTime(content: string): number {
    // More accurate estimation considering complexity
    const words = content.split(/\s+/).filter((word) => word.length > 0)
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim().length > 0)

    // Base reading speed
    let wordsPerMinute = 200

    // Adjust for complexity
    const avgWordsPerSentence = words.length / sentences.length
    const avgSentencesPerParagraph = sentences.length / paragraphs.length

    // Complex text (long sentences, technical terms)
    if (avgWordsPerSentence > 20) wordsPerMinute -= 20
    if (avgSentencesPerParagraph > 8) wordsPerMinute -= 10

    // Count complex words (>7 characters)
    const complexWords = words.filter((word) => word.length > 7).length
    const complexityRatio = complexWords / words.length
    if (complexityRatio > 0.3) wordsPerMinute -= 15

    return Math.ceil(words.length / Math.max(wordsPerMinute, 120))
  }

  // Content search and analysis
  static searchInContent(content: string, query: string): { found: boolean; matches: string[] } {
    const normalizedContent = content.toLowerCase()
    const normalizedQuery = query.toLowerCase()
    const found = normalizedContent.includes(normalizedQuery)

    if (!found) return { found: false, matches: [] }

    // Find context around matches
    const sentences = content.split(/[.!?]+/)
    const matches = sentences
      .filter((sentence) => sentence.toLowerCase().includes(normalizedQuery))
      .map((sentence) => sentence.trim())
      .slice(0, 3)

    return { found, matches }
  }

  static getDifficultyScore(content: string): number {
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const words = content.split(/\s+/).filter((w) => w.length > 0)

    // Calculate metrics
    const avgSentenceLength = words.length / sentences.length
    const complexWords = words.filter((word) => word.length > 7).length
    const complexWordPercentage = (complexWords / words.length) * 100

    // Technical terms indicators
    const technicalTerms = words.filter(
      (word) => word.includes("ción") || word.includes("dad") || word.includes("ismo") || word.length > 12,
    ).length
    const technicalPercentage = (technicalTerms / words.length) * 100

    // Calculate difficulty (1-10 scale)
    let difficulty = 1

    if (avgSentenceLength > 15) difficulty += 1
    if (avgSentenceLength > 20) difficulty += 1
    if (avgSentenceLength > 25) difficulty += 1

    if (complexWordPercentage > 25) difficulty += 1
    if (complexWordPercentage > 35) difficulty += 1
    if (complexWordPercentage > 45) difficulty += 1

    if (technicalPercentage > 10) difficulty += 1
    if (technicalPercentage > 15) difficulty += 1

    return Math.min(difficulty, 10)
  }

  // Reading progress and navigation
  static calculateProgress(currentPage: number, totalPages: number): number {
    if (totalPages === 0) return 0
    return Math.round((currentPage / totalPages) * 100)
  }

  static getNextChapter(chapters: BookChapter[], currentChapter: number): BookChapter | null {
    return chapters.find((chapter) => chapter.chapter_number === currentChapter + 1) || null
  }

  static getPreviousChapter(chapters: BookChapter[], currentChapter: number): BookChapter | null {
    return chapters.find((chapter) => chapter.chapter_number === currentChapter - 1) || null
  }

  static getChapterByNumber(chapters: BookChapter[], chapterNumber: number): BookChapter | null {
    return chapters.find((chapter) => chapter.chapter_number === chapterNumber) || null
  }

  // Time and formatting utilities
  static formatReadingTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      if (remainingMinutes === 0) {
        return `${hours}h`
      }
      return `${hours}h ${remainingMinutes}min`
    }
  }

  static formatTimeRemaining(currentPage: number, totalPages: number, totalReadingTime: string): string {
    const progress = currentPage / totalPages
    const remainingProgress = 1 - progress

    // Parse total reading time (e.g., "4h 30min")
    const timeMatch = totalReadingTime.match(/(?:(\d+)h\s*)?(?:(\d+)min)?/)
    if (!timeMatch) return "Tiempo desconocido"

    const hours = Number.parseInt(timeMatch[1] || "0")
    const minutes = Number.parseInt(timeMatch[2] || "0")
    const totalMinutes = hours * 60 + minutes
    const remainingMinutes = Math.round(totalMinutes * remainingProgress)

    return this.formatReadingTime(remainingMinutes)
  }

  // Book filtering and search
  static filterBooks(books: Book[], filters: BookSearchFilters): Book[] {
    let filteredBooks = [...books]

    if (filters.category) {
      filteredBooks = filteredBooks.filter((book) => book.category === filters.category)
    }

    if (filters.difficulty) {
      filteredBooks = filteredBooks.filter((book) => book.difficulty === filters.difficulty)
    }

    if (filters.rating_min) {
      filteredBooks = filteredBooks.filter((book) => book.rating >= filters.rating_min)
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredBooks = filteredBooks.filter((book) => filters.tags!.some((tag) => book.tags.includes(tag)))
    }

    if (filters.author) {
      filteredBooks = filteredBooks.filter((book) => book.author.toLowerCase().includes(filters.author!.toLowerCase()))
    }

    if (filters.is_recommended !== undefined) {
      filteredBooks = filteredBooks.filter((book) => book.is_recommended === filters.is_recommended)
    }

    if (filters.search_query) {
      const query = filters.search_query.toLowerCase()
      filteredBooks = filteredBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query) ||
          book.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          book.key_topics.some((topic) => topic.toLowerCase().includes(query)),
      )
    }

    return filteredBooks
  }

  // Recommendation system
  static getRecommendations(
    books: Book[],
    userPreferences: {
      categories: string[]
      difficulty: string
      completed_books: string[]
      favorite_tags: string[]
      reading_goals: string[]
    },
  ): BookRecommendation[] {
    const availableBooks = books.filter((book) => !userPreferences.completed_books.includes(book.id))

    const recommendations: BookRecommendation[] = availableBooks.map((book) => {
      let score = 0
      const reasons: string[] = []

      // Category preference
      if (userPreferences.categories.includes(book.category)) {
        score += 30
        reasons.push(`Coincide con tu interés en ${book.category}`)
      }

      // Difficulty match
      if (userPreferences.difficulty === "any" || book.difficulty === userPreferences.difficulty) {
        score += 20
        if (book.difficulty === userPreferences.difficulty) {
          reasons.push(`Nivel de dificultad apropiado (${book.difficulty})`)
        }
      }

      // Tag overlap
      const tagOverlap = book.tags.filter((tag) => userPreferences.favorite_tags.includes(tag)).length
      if (tagOverlap > 0) {
        score += tagOverlap * 10
        reasons.push(`Temas de interés: ${book.tags.slice(0, 2).join(", ")}`)
      }

      // High rating bonus
      if (book.rating >= 4.5) {
        score += 15
        reasons.push(`Altamente valorado (${book.rating}/5)`)
      }

      // Recommended books bonus
      if (book.is_recommended) {
        score += 10
        reasons.push("Recomendado por expertos")
      }

      // Recent publication bonus
      if (book.published_year >= 2015) {
        score += 5
        reasons.push("Contenido actualizado")
      }

      return {
        book,
        score,
        reasons: reasons.slice(0, 3),
        similarity_books: [],
      }
    })

    return recommendations.sort((a, b) => b.score - a.score).slice(0, 6)
  }

  // Analytics and statistics
  static generateReadingAnalytics(
    progress: UserBookProgress[],
    books: Book[],
    bookmarks: UserBookBookmark[],
  ): BookAnalytics {
    const bookMap = new Map(books.map((book) => [book.id, book]))

    // Basic metrics
    const totalReadingTime = progress.reduce((sum, p) => sum + p.reading_time_minutes, 0)
    const booksCompleted = progress.filter((p) => p.progress_percentage >= 100).length
    const booksInProgress = progress.filter((p) => p.progress_percentage > 0 && p.progress_percentage < 100).length

    // Category analysis
    const categoryCount = new Map<string, number>()
    progress.forEach((p) => {
      const book = bookMap.get(p.book_id)
      if (book) {
        categoryCount.set(book.category, (categoryCount.get(book.category) || 0) + 1)
      }
    })

    const favoriteCategories = Array.from(categoryCount.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category)

    // Reading streak calculation
    const sortedProgress = progress.sort(
      (a, b) => new Date(b.last_read_at).getTime() - new Date(a.last_read_at).getTime(),
    )

    let readingStreak = 0
    const today = new Date()

    for (const p of sortedProgress) {
      const lastRead = new Date(p.last_read_at)
      const daysDiff = Math.floor((today.getTime() - lastRead.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff <= readingStreak + 1) {
        readingStreak = Math.max(readingStreak, daysDiff === 0 ? 1 : readingStreak + 1)
      } else {
        break
      }
    }

    // Average rating
    const ratedBooks = progress.map((p) => bookMap.get(p.book_id)).filter((book): book is Book => book !== undefined)

    const averageRating =
      ratedBooks.length > 0 ? ratedBooks.reduce((sum, book) => sum + book.rating, 0) / ratedBooks.length : 0

    // Today's reading
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayProgress = progress.filter((p) => new Date(p.last_read_at) >= todayStart)
    const pagesToday = todayProgress.reduce((sum, p) => sum + p.current_page, 0)

    return {
      total_reading_time: totalReadingTime,
      books_completed: booksCompleted,
      books_in_progress: booksInProgress,
      favorite_categories: favoriteCategories,
      reading_streak: readingStreak,
      average_rating: Math.round(averageRating * 10) / 10,
      pages_read_today: pagesToday,
      weekly_goal_progress: 0, // Would need goal data to calculate
    }
  }

  // Reading session management
  static createReadingSession(bookId: string, chapterNumber: number): ReadingSession {
    return {
      book_id: bookId,
      chapter_number: chapterNumber,
      start_time: new Date(),
      pages_read: 0,
    }
  }

  static endReadingSession(
    session: ReadingSession,
    pagesRead: number,
    notes?: string,
    focusScore?: number,
  ): ReadingSession {
    return {
      ...session,
      end_time: new Date(),
      pages_read: pagesRead,
      notes,
      focus_score: focusScore,
    }
  }

  static calculateReadingSpeed(session: ReadingSession): number {
    if (!session.end_time || session.pages_read === 0) return 0

    const durationMinutes = (session.end_time.getTime() - session.start_time.getTime()) / (1000 * 60)
    return Math.round((session.pages_read / durationMinutes) * 100) / 100
  }

  // Utility functions
  static getUniqueCategories(books: Book[]): string[] {
    return [...new Set(books.map((book) => book.category))].sort()
  }

  static getUniqueTags(books: Book[]): string[] {
    return [...new Set(books.flatMap((book) => book.tags))].sort()
  }

  static getUniqueAuthors(books: Book[]): string[] {
    return [...new Set(books.map((book) => book.author))].sort()
  }

  static getDifficultyLevels(): Array<{ value: string; label: string; description: string }> {
    return [
      {
        value: "Fácil",
        label: "Principiante",
        description: "Conceptos básicos, lenguaje accesible",
      },
      {
        value: "Intermedio",
        label: "Intermedio",
        description: "Requiere conocimientos previos",
      },
      {
        value: "Avanzado",
        label: "Avanzado",
        description: "Conceptos complejos, terminología especializada",
      },
    ]
  }

  // Content validation
  static validateBookData(book: Partial<Book>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!book.title || book.title.trim().length === 0) {
      errors.push("El título es requerido")
    }

    if (!book.author || book.author.trim().length === 0) {
      errors.push("El autor es requerido")
    }

    if (!book.description || book.description.trim().length < 50) {
      errors.push("La descripción debe tener al menos 50 caracteres")
    }

    if (!book.category || book.category.trim().length === 0) {
      errors.push("La categoría es requerida")
    }

    if (book.rating !== undefined && (book.rating < 0 || book.rating > 5)) {
      errors.push("La calificación debe estar entre 0 y 5")
    }

    if (book.pages !== undefined && book.pages <= 0) {
      errors.push("El número de páginas debe ser mayor a 0")
    }

    if (
      book.published_year !== undefined &&
      (book.published_year < 1000 || book.published_year > new Date().getFullYear())
    ) {
      errors.push("El año de publicación no es válido")
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  // Export/Import utilities
  static exportBookProgress(progress: UserBookProgress[], books: Book[]): string {
    const bookMap = new Map(books.map((book) => [book.id, book]))

    const exportData = progress.map((p) => {
      const book = bookMap.get(p.book_id)
      return {
        book_title: book?.title || "Unknown",
        book_author: book?.author || "Unknown",
        current_page: p.current_page,
        total_pages: p.total_pages,
        progress_percentage: p.progress_percentage,
        reading_time_minutes: p.reading_time_minutes,
        started_at: p.started_at,
        last_read_at: p.last_read_at,
      }
    })

    return JSON.stringify(exportData, null, 2)
  }

  static generateReadingReport(analytics: BookAnalytics, progress: UserBookProgress[], books: Book[]): string {
    const bookMap = new Map(books.map((book) => [book.id, book]))

    let report = `# Reporte de Lectura\n\n`
    report += `## Resumen General\n`
    report += `- **Libros completados:** ${analytics.books_completed}\n`
    report += `- **Libros en progreso:** ${analytics.books_in_progress}\n`
    report += `- **Tiempo total de lectura:** ${this.formatReadingTime(analytics.total_reading_time)}\n`
    report += `- **Racha de lectura:** ${analytics.reading_streak} días\n`
    report += `- **Calificación promedio:** ${analytics.average_rating}/5\n\n`

    report += `## Categorías Favoritas\n`
    analytics.favorite_categories.forEach((category, index) => {
      report += `${index + 1}. ${category}\n`
    })

    report += `\n## Progreso Detallado\n`
    progress.forEach((p) => {
      const book = bookMap.get(p.book_id)
      if (book) {
        report += `- **${book.title}** por ${book.author}: ${p.progress_percentage}% completado\n`
      }
    })

    return report
  }
}

// Default book data for the application
export const defaultBooks: Book[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "Hábitos Atómicos",
    author: "James Clear",
    description:
      "Un método fácil y comprobado para crear buenos hábitos y eliminar los malos. James Clear revela estrategias prácticas que te enseñarán exactamente cómo formar buenos hábitos, romper los malos y dominar los pequeños comportamientos que llevan a resultados notables.",
    category: "Productividad",
    rating: 4.8,
    reading_time: "4h 30min",
    pages: 320,
    published_year: 2018,
    cover_url: "/placeholder.svg?height=400&width=300&text=Hábitos%20Atómicos&bg=3b82f6&color=white",
    tags: ["Hábitos", "Productividad", "Autoayuda", "Comportamiento"],
    difficulty: "Intermedio",
    key_topics: ["Formación de hábitos", "Productividad personal", "Cambio de comportamiento", "Sistemas vs objetivos"],
    is_recommended: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    title: "Los 7 Hábitos de la Gente Altamente Efectiva",
    author: "Stephen R. Covey",
    description:
      "Lecciones poderosas de cambio personal que han inspirado a millones de personas. Covey presenta un enfoque holístico, integrado y centrado en principios para resolver problemas personales y profesionales.",
    category: "Liderazgo",
    rating: 4.6,
    reading_time: "6h 15min",
    pages: 432,
    published_year: 1989,
    cover_url: "/placeholder.svg?height=400&width=300&text=7%20Hábitos&bg=1f2937&color=white",
    tags: ["Liderazgo", "Efectividad", "Desarrollo Personal", "Principios"],
    difficulty: "Intermedio",
    key_topics: ["Liderazgo personal", "Efectividad", "Principios de vida", "Interdependencia"],
    is_recommended: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    title: "Inteligencia Emocional",
    author: "Daniel Goleman",
    description:
      "Por qué puede importar más que el coeficiente intelectual. Goleman argumenta que nuestras emociones juegan un papel mucho mayor en el pensamiento, la toma de decisiones y el éxito individual que tradicionalmente se ha reconocido.",
    category: "Habilidades Blandas",
    rating: 4.7,
    reading_time: "5h 20min",
    pages: 384,
    published_year: 1995,
    cover_url: "/placeholder.svg?height=400&width=300&text=Inteligencia%20Emocional&bg=10b981&color=white",
    tags: ["Inteligencia Emocional", "Psicología", "Relaciones", "Autoconciencia"],
    difficulty: "Intermedio",
    key_topics: ["Autoconciencia emocional", "Autorregulación", "Empatía", "Habilidades sociales"],
    is_recommended: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Content constants
export const READING_SPEEDS = {
  SLOW: 150, // words per minute
  AVERAGE: 200, // words per minute
  FAST: 250, // words per minute
  VERY_FAST: 300, // words per minute
}

export const DIFFICULTY_THRESHOLDS = {
  EASY: 3,
  INTERMEDIATE: 6,
  ADVANCED: 8,
}

export const BOOKMARK_TYPES = {
  NOTE: "note",
  HIGHLIGHT: "highlight",
  BOOKMARK: "bookmark",
} as const

export const CATEGORIES = [
  "Productividad",
  "Liderazgo",
  "Habilidades Blandas",
  "Desarrollo Personal",
  "Negocios",
  "Psicología",
  "Comunicación",
  "Innovación",
  "Estrategia",
  "Gestión del Tiempo",
]

export const POPULAR_TAGS = [
  "Hábitos",
  "Productividad",
  "Liderazgo",
  "Comunicación",
  "Inteligencia Emocional",
  "Desarrollo Personal",
  "Autoayuda",
  "Psicología",
  "Negocios",
  "Estrategia",
  "Innovación",
  "Gestión",
  "Motivación",
  "Éxito",
  "Relaciones",
]
