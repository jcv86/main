import { createClient } from "@/lib/supabase"

export interface Book {
  id: string
  title: string
  author: string
  description: string
  cover_image: string
  category: string
  difficulty: "Fácil" | "Intermedio" | "Avanzado"
  estimated_reading_time: number
  pages?: number
  published_year?: number
  rating?: number
  tags: string[]
  key_topics?: string[]
  is_recommended: boolean
  is_featured?: boolean
  created_at: string
  updated_at: string
}

export interface BookChapter {
  id: string
  book_id: string
  chapter_number: number
  title: string
  content: string
  created_at: string
}

export interface UserBookProgress {
  id: string
  user_id: string
  book_id: string
  current_chapter: number
  progress_percentage: number
  reading_time_minutes?: number
  last_read_at: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface UserBookBookmark {
  id: string
  user_id: string
  book_id: string
  chapter_id: string
  position: number
  note?: string
  created_at: string
}

export interface BookWithProgress extends Book {
  progress?: UserBookProgress
}

export class LibraryService {
  private supabase = createClient()

  async ensureUserProfile(userId: string, userEmail?: string): Promise<void> {
    try {
      // Check if profile exists
      const { data: existingProfile } = await this.supabase.from("profiles").select("id").eq("id", userId).single()

      if (!existingProfile) {
        // Create profile if it doesn't exist
        const { error } = await this.supabase.from("profiles").insert({
          id: userId,
          email: userEmail || `${userId}@example.com`,
          full_name: userEmail || "User",
          role: "user",
        })

        if (error && error.code !== "23505") {
          // Ignore duplicate key errors
          console.warn("Could not create user profile:", error.message)
        }
      }
    } catch (error) {
      console.warn("Error ensuring user profile:", error)
    }
  }

  async getBooks(): Promise<Book[]> {
    try {
      const { data, error } = await this.supabase
        .from("library_books")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching books:", error)
        return this.getFallbackBooks()
      }

      return data || this.getFallbackBooks()
    } catch (error) {
      console.error("Error in getBooks:", error)
      return this.getFallbackBooks()
    }
  }

  async getFeaturedBooks(): Promise<Book[]> {
    try {
      const { data, error } = await this.supabase
        .from("library_books")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(6)

      if (error) {
        console.error("Error fetching featured books:", error)
        return this.getFallbackBooks().slice(0, 3)
      }

      return data || this.getFallbackBooks().slice(0, 3)
    } catch (error) {
      console.error("Error in getFeaturedBooks:", error)
      return this.getFallbackBooks().slice(0, 3)
    }
  }

  async getBookById(id: string): Promise<Book | null> {
    try {
      const { data, error } = await this.supabase.from("library_books").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching book:", error)
        return this.getFallbackBooks().find((book) => book.id === id) || null
      }

      return data
    } catch (error) {
      console.error("Error in getBookById:", error)
      return this.getFallbackBooks().find((book) => book.id === id) || null
    }
  }

  async getBookChapters(bookId: string): Promise<BookChapter[]> {
    try {
      const { data, error } = await this.supabase
        .from("book_chapters")
        .select("*")
        .eq("book_id", bookId)
        .order("chapter_number", { ascending: true })

      if (error) {
        console.error("Error fetching chapters:", error)
        return this.getFallbackChapters(bookId)
      }

      return data || this.getFallbackChapters(bookId)
    } catch (error) {
      console.error("Error in getBookChapters:", error)
      return this.getFallbackChapters(bookId)
    }
  }

  async getChapter(chapterId: string): Promise<BookChapter | null> {
    try {
      const { data, error } = await this.supabase.from("book_chapters").select("*").eq("id", chapterId).single()

      if (error) {
        console.error("Error fetching chapter:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in getChapter:", error)
      return null
    }
  }

  async getUserBookProgress(bookId: string): Promise<UserBookProgress | null> {
    try {
      // For demo purposes, we'll use a demo user ID
      const userId = "demo-user-id"

      // Ensure user profile exists first
      await this.ensureUserProfile(userId)

      const { data, error } = await this.supabase
        .from("user_book_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("book_id", bookId)
        .single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "not found"
        console.error("Error fetching user book progress:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in getUserBookProgress:", error)
      return null
    }
  }

  async updateBookProgress(bookId: string, progressData: Partial<UserBookProgress>): Promise<UserBookProgress | null> {
    try {
      // For demo purposes, we'll use a demo user ID
      const userId = "demo-user-id"

      // Ensure user profile exists first
      await this.ensureUserProfile(userId)

      const { data, error } = await this.supabase
        .from("user_book_progress")
        .upsert({
          user_id: userId,
          book_id: bookId,
          ...progressData,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("Error updating user book progress:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in updateBookProgress:", error)
      return null
    }
  }

  async getUserBookmarks(bookId: string): Promise<UserBookBookmark[]> {
    try {
      // For demo purposes, we'll use a demo user ID
      const userId = "demo-user-id"

      // Ensure user profile exists first
      await this.ensureUserProfile(userId)

      const { data, error } = await this.supabase
        .from("user_book_bookmarks")
        .select("*")
        .eq("user_id", userId)
        .eq("book_id", bookId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching user bookmarks:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getUserBookmarks:", error)
      return []
    }
  }

  async addBookmark(bookId: string, chapterId: string, title: string, note?: string): Promise<UserBookBookmark | null> {
    try {
      // For demo purposes, we'll use a demo user ID
      const userId = "demo-user-id"

      // Ensure user profile exists first
      await this.ensureUserProfile(userId)

      const { data, error } = await this.supabase
        .from("user_book_bookmarks")
        .insert({
          user_id: userId,
          book_id: bookId,
          chapter_id: chapterId,
          position: 0,
          note: note || title,
        })
        .select()
        .single()

      if (error) {
        console.error("Error adding bookmark:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in addBookmark:", error)
      return null
    }
  }

  async removeBookmark(bookId: string, chapterId: string): Promise<boolean> {
    try {
      // For demo purposes, we'll use a demo user ID
      const userId = "demo-user-id"

      const { error } = await this.supabase
        .from("user_book_bookmarks")
        .delete()
        .eq("user_id", userId)
        .eq("book_id", bookId)
        .eq("chapter_id", chapterId)

      if (error) {
        console.error("Error removing bookmark:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error in removeBookmark:", error)
      return false
    }
  }

  async getUserRecentBooks(userId: string, limit = 5): Promise<BookWithProgress[]> {
    try {
      // Ensure user profile exists first
      await this.ensureUserProfile(userId)

      // First get the user's progress records
      const { data: progressData, error: progressError } = await this.supabase
        .from("user_book_progress")
        .select("*")
        .eq("user_id", userId)
        .order("last_read_at", { ascending: false })
        .limit(limit)

      if (progressError) {
        console.error("Error fetching user progress:", progressError)
        return []
      }

      if (!progressData || progressData.length === 0) {
        return []
      }

      // Then get the book details for each progress record
      const bookIds = progressData.map((p) => p.book_id)
      const { data: booksData, error: booksError } = await this.supabase
        .from("library_books")
        .select("*")
        .in("id", bookIds)

      if (booksError) {
        console.error("Error fetching books:", booksError)
        return []
      }

      // Combine the data
      const booksWithProgress: BookWithProgress[] = (booksData || []).map((book) => {
        const progress = progressData.find((p) => p.book_id === book.id)
        return {
          ...book,
          progress,
        }
      })

      // Sort by last_read_at
      return booksWithProgress.sort((a, b) => {
        const aTime = a.progress?.last_read_at || ""
        const bTime = b.progress?.last_read_at || ""
        return new Date(bTime).getTime() - new Date(aTime).getTime()
      })
    } catch (error) {
      console.error("Error in getUserRecentBooks:", error)
      return []
    }
  }

  async getUserStats(userId: string): Promise<{
    booksStarted: number
    booksCompleted: number
    totalBookmarks: number
    averageProgress: number
    currentlyReading: number
  }> {
    try {
      // Ensure user profile exists first
      await this.ensureUserProfile(userId)

      // Get reading progress stats
      const { data: progressData, error: progressError } = await this.supabase
        .from("user_book_progress")
        .select("*")
        .eq("user_id", userId)

      if (progressError) {
        console.error("Error fetching progress stats:", progressError)
      }

      // Get bookmarks count
      const { data: bookmarksData, error: bookmarksError } = await this.supabase
        .from("user_book_bookmarks")
        .select("id")
        .eq("user_id", userId)

      if (bookmarksError) {
        console.error("Error fetching bookmarks stats:", bookmarksError)
      }

      const booksStarted = progressData?.length || 0
      const booksCompleted = progressData?.filter((p) => p.progress_percentage >= 100).length || 0
      const totalBookmarks = bookmarksData?.length || 0
      const averageProgress =
        booksStarted > 0 ? progressData?.reduce((sum, p) => sum + p.progress_percentage, 0) / booksStarted : 0

      return {
        booksStarted,
        booksCompleted,
        totalBookmarks,
        averageProgress: Math.round(averageProgress * 10) / 10,
        currentlyReading: booksStarted - booksCompleted,
      }
    } catch (error) {
      console.error("Error in getUserStats:", error)
      return {
        booksStarted: 0,
        booksCompleted: 0,
        totalBookmarks: 0,
        averageProgress: 0,
        currentlyReading: 0,
      }
    }
  }

  async getRecentActivity(userId: string, limit = 10): Promise<any[]> {
    try {
      // Ensure user profile exists first
      await this.ensureUserProfile(userId)

      // Get recent progress updates
      const { data: progressData, error: progressError } = await this.supabase
        .from("user_book_progress")
        .select("*")
        .eq("user_id", userId)
        .order("last_read_at", { ascending: false })
        .limit(limit)

      if (progressError) {
        console.error("Error fetching recent progress:", progressError)
        return []
      }

      if (!progressData || progressData.length === 0) {
        return []
      }

      // Get book details for the progress records
      const bookIds = progressData.map((p) => p.book_id)
      const { data: booksData, error: booksError } = await this.supabase
        .from("library_books")
        .select("id, title, author, cover_image")
        .in("id", bookIds)

      if (booksError) {
        console.error("Error fetching books for activity:", booksError)
        return []
      }

      // Create activity records
      const activities = progressData.map((progress) => {
        const book = booksData?.find((b) => b.id === progress.book_id)
        return {
          id: progress.id,
          type: "reading",
          title: `Continued reading "${book?.title || "Unknown Book"}"`,
          description: `Chapter ${progress.current_chapter} • ${Math.round(progress.progress_percentage)}% complete`,
          timestamp: progress.last_read_at,
          book: book,
        }
      })

      return activities
    } catch (error) {
      console.error("Error in getRecentActivity:", error)
      return []
    }
  }

  private getFallbackBooks(): Book[] {
    return [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        title: "Hábitos Atómicos",
        author: "James Clear",
        description: "Un método sencillo y comprobado para desarrollar buenos hábitos y eliminar los malos.",
        cover_image: "/books/atomic-habits.jpg",
        category: "Desarrollo Personal",
        difficulty: "Intermedio",
        estimated_reading_time: 240,
        pages: 320,
        published_year: 2018,
        rating: 4.8,
        tags: ["hábitos", "productividad", "autoayuda"],
        key_topics: ["Formación de hábitos", "Cambio de comportamiento", "Productividad personal"],
        is_recommended: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        title: "Inteligencia Emocional",
        author: "Daniel Goleman",
        description: "Por qué es más importante que el cociente intelectual.",
        cover_image: "/books/emotional-intelligence.jpg",
        category: "Psicología",
        difficulty: "Intermedio",
        estimated_reading_time: 300,
        pages: 352,
        published_year: 1995,
        rating: 4.5,
        tags: ["inteligencia emocional", "psicología", "liderazgo"],
        key_topics: ["Autoconciencia", "Autorregulación", "Empatía", "Habilidades sociales"],
        is_recommended: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        title: "Lean In",
        author: "Sheryl Sandberg",
        description: "Las mujeres, el trabajo y la voluntad de liderar.",
        cover_image: "/books/lean-in.jpg",
        category: "Liderazgo",
        difficulty: "Intermedio",
        estimated_reading_time: 250,
        pages: 240,
        published_year: 2013,
        rating: 4.4,
        tags: ["liderazgo femenino", "carrera profesional", "igualdad"],
        key_topics: ["Liderazgo femenino", "Desarrollo profesional", "Igualdad de género"],
        is_recommended: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
  }

  private getFallbackChapters(bookId: string): BookChapter[] {
    const chapters: Record<string, BookChapter[]> = {
      "550e8400-e29b-41d4-a716-446655440001": [
        {
          id: "550e8400-e29b-41d4-a716-446655440101",
          book_id: bookId,
          chapter_number: 1,
          title: "El Sorprendente Poder de los Hábitos Atómicos",
          content: `Es muy fácil sobrestimar la importancia de un momento definitorio y subestimar el valor de hacer pequeñas mejoras diariamente. Con demasiada frecuencia, nos convencemos de que el cambio masivo requiere una acción masiva.

Pero aquí está la cosa: si puedes mejorar solo un 1% cada día durante un año, terminarás siendo 37 veces mejor al final del año. Por el contrario, si empeoras un 1% cada día durante un año, caerás casi a cero.

Los pequeños cambios a menudo parecen no hacer diferencia hasta que cruzas un umbral crítico. Los resultados más poderosos de cualquier sistema compuesto se retrasan. Necesitas ser paciente.

Un avión que sale de Los Ángeles hacia Nueva York y ajusta su rumbo solo 3.5 grados hacia el sur terminará aterrizando en Washington D.C. en lugar de Nueva York. Un pequeño cambio en la dirección puede llevar a un destino muy diferente.

De manera similar, un pequeño cambio en tus hábitos diarios puede guiar tu vida hacia un destino completamente diferente. Hacer una elección que es un 1% mejor o un 1% peor parece insignificante en el momento, pero a lo largo de los años estas elecciones determinan la diferencia entre quien eres y quien podrías ser.

El éxito es el producto de los hábitos diarios, no de transformaciones de una sola vez.`,
          created_at: new Date().toISOString(),
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440102",
          book_id: bookId,
          chapter_number: 2,
          title: "Cómo Tus Hábitos Moldean Tu Identidad (y Viceversa)",
          content: `¿Por qué es tan fácil repetir los malos hábitos y tan difícil formar buenos? Pocas cosas pueden tener un impacto más poderoso en tu vida que mejorar tus hábitos diarios. Y sin embargo, es probable que para mañana hagas lo mismo que hiciste hoy, la semana que viene hagas lo mismo que hiciste esta semana, y el próximo mes hagas lo mismo que hiciste este mes.

¿Por qué es tan fácil repetir estos patrones cuando sabemos que deberíamos cambiar? ¿Por qué elegimos ver otro episodio cuando sabemos que deberíamos apagar la televisión? ¿Por qué comemos la dona cuando sabemos que deberíamos comer la fruta?

Cambiar nuestros hábitos es desafiante por dos razones: (1) tratamos de cambiar la cosa equivocada y (2) tratamos de cambiar nuestros hábitos de la manera equivocada.

En este capítulo, abordaré el primer punto. En los siguientes capítulos, abordaré el segundo.

La primera capa es cambiar tus resultados. Este nivel se trata de cambiar lo que obtienes: perder peso, publicar un libro, ganar un campeonato. La mayoría de las metas que te fijas están asociadas con este nivel de cambio.

La segunda capa es cambiar tu proceso. Este nivel se trata de cambiar tus hábitos y sistemas: implementar una nueva rutina en el gimnasio, despejar tu escritorio para un mejor flujo de trabajo, desarrollar una práctica de meditación. La mayoría de los hábitos que construyes están asociados con este nivel.

La tercera y más profunda capa es cambiar tu identidad. Este nivel se trata de cambiar tus creencias: tu visión del mundo, tu autoimagen, tus juicios sobre ti mismo y otros. La mayoría de las creencias, suposiciones y sesgos que tienes están asociados con este nivel.`,
          created_at: new Date().toISOString(),
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440103",
          book_id: bookId,
          chapter_number: 3,
          title: "Cómo Construir Mejores Hábitos en 4 Pasos Simples",
          content: `En 1898, un psicólogo llamado Edward Thorndike realizó un experimento que cambiaría la forma en que pensamos sobre la formación de hábitos.

Thorndike estaba interesado en estudiar el comportamiento animal, así que construyó un laberinto llamado "caja rompecabezas". Colocó un gato dentro de la caja, que estaba diseñada para que el gato pudiera escapar a través de una puerta, pero solo si presionaba una palanca en la secuencia correcta.

Al principio, cada gato se movía alrededor de la caja al azar. Arañaba las paredes, mordía los barrotes, metía sus patas a través de las aberturas. Después de unos minutos de esto, presionaría accidentalmente la palanca, la puerta se abriría, y el gato escaparía.

Thorndike realizó este experimento una y otra vez con muchos gatos. Y descubrió algo fascinante. Cuando un gato era colocado en la caja por segunda vez, realizaba las mismas acciones aleatorias que antes. Pero esta vez, escapaba un poco más rápido. Después de dos o tres intentos más, el gato había aprendido a escapar en unos pocos segundos.

Durante cada intento, las acciones inútiles ocurrían con menos frecuencia y las acciones útiles se volvían más comunes. El gato estaba formando una asociación entre presionar la palanca y recibir la recompensa de escapar.

Este experimento sentó las bases para lo que conocemos como la Ley del Efecto, que establece que "las respuestas que producen un efecto satisfactorio en una situación particular se vuelven más probables de ocurrir nuevamente en esa situación, y las respuestas que producen un efecto incómodo se vuelven menos probables de ocurrir nuevamente en esa situación."

Los hábitos son bucles de retroalimentación confiables que resuelven los problemas recurrentes en nuestras vidas.`,
          created_at: new Date().toISOString(),
        },
      ],
      "550e8400-e29b-41d4-a716-446655440002": [
        {
          id: "550e8400-e29b-41d4-a716-446655440201",
          book_id: bookId,
          chapter_number: 1,
          title: "¿Para Qué Sirven las Emociones?",
          content: `La mente emocional es mucho más rápida que la mente racional, entrando en acción sin detenerse ni un momento a considerar lo que está haciendo. Su rapidez excluye la reflexión deliberada que es el sello distintivo de la mente pensante.

En los momentos más críticos de nuestras vidas, dependemos tanto de nuestros sentimientos como de nuestros pensamientos, y a menudo más de los primeros. Hemos llegado tan lejos como especie precisamente debido a la notable eficacia de nuestras emociones para guiarnos a través de las decisiones importantes.

Las emociones, entonces, importan para la racionalidad. En la danza entre el sentimiento y el pensamiento, la facultad emocional guía nuestras decisiones momento a momento, trabajando de la mano con la mente racional y capacitando o incapacitando al pensamiento mismo.

De manera similar, la mente pensante desempeña un papel ejecutivo en nuestras emociones, excepto en aquellos momentos en que las emociones se salen de control y la mente emocional toma las riendas.

En cierto sentido, tenemos dos mentes: una que piensa y otra que siente. Estas dos formas fundamentalmente diferentes de conocimiento interactúan para construir nuestra vida mental. Una, la mente racional, es el modo de comprensión del que somos típicamente conscientes: más prominente en la conciencia, reflexiva, capaz de ponderar y reflexionar.

Pero junto a ese existe otro sistema de conocimiento: impulsivo y poderoso, aunque a veces ilógico: la mente emocional.

La dicotomía emocional/racional se aproxima a la distinción popular entre "corazón" y "cabeza"; saber que algo está bien "en tu corazón" es un tipo diferente de convicción, de alguna manera un tipo más profundo de certeza, que pensar lo mismo con tu mente racional.`,
          created_at: new Date().toISOString(),
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440202",
          book_id: bookId,
          chapter_number: 2,
          title: "Anatomía de un Secuestro Emocional",
          content: `Fue un día de agosto sofocante en 1963, el mismo día en que Martin Luther King Jr. pronunció su discurso "Tengo un sueño" ante una multitud de manifestantes por los derechos civiles en Washington. Ese día, Richard Robles, un ladrón de carrera de veinte años, decidió robar un apartamento en el Upper East Side de Manhattan.

Robles había elegido cuidadosamente el apartamento de las hermanas Wylie, creyendo que estarían fuera. Pero Janice Wylie, de veintiún años, estaba en casa. Robles la ató, pero luego entró en pánico al darse cuenta de que ella podría identificarlo. En un momento de terror, la mató.

Luego llegó Emily Hoffert, la compañera de cuarto de Janice. Robles la mató también.

Más tarde, Robles confesaría que no había tenido la intención de lastimar a nadie; había entrado en pánico. Pero en ese momento crucial, su mente emocional había tomado el control, secuestrando su racionalidad.

Este es un ejemplo extremo de lo que podríamos llamar un "secuestro emocional": momentos en los que la mente emocional toma el control, abrumando a la mente racional.

El término secuestro emocional proviene de la comprensión de que el centro emocional del cerebro, la amígdala, puede proclamar una emergencia antes de que los centros superiores del cerebro, la neocorteza, hayan tenido completamente la oportunidad de comprender qué está sucediendo.

En un secuestro emocional, la amígdala proclama una emergencia y recluta el resto del cerebro para su agenda urgente. El secuestro ocurre en un instante, desencadenando esta reacción crucial antes de que la neocorteza, la mente pensante, haya tenido la oportunidad de vislumbrar completamente lo que está sucediendo, y mucho menos decidir si es una buena respuesta.

El sello distintivo de tal secuestro es que una vez que pasa el momento, las personas no tienen idea de lo que les pasó.`,
          created_at: new Date().toISOString(),
        },
      ],
      "550e8400-e29b-41d4-a716-446655440003": [
        {
          id: "550e8400-e29b-41d4-a716-446655440301",
          book_id: bookId,
          chapter_number: 1,
          title: "La Brecha de Ambición en el Liderazgo",
          content: `Un mundo verdaderamente igualitario sería aquel donde las mujeres dirigieran la mitad de nuestros países y empresas, y los hombres dirigieran la mitad de nuestros hogares. Creo que este es el objetivo al que deberíamos aspirar.

Pero hoy, estamos muy lejos de este objetivo. De los 195 países independientes del mundo, solo diecisiete están dirigidos por mujeres. Las mujeres ocupan solo el 20 por ciento de los escaños en los parlamentos a nivel mundial. En el sector corporativo, las mujeres ocupan solo el 21 por ciento de los puestos de alta dirección a nivel mundial.

En Estados Unidos, las mujeres han obtenido el 57 por ciento de los títulos universitarios y el 53 por ciento de los doctorados durante la última década. Sin embargo, solo representan el 14 por ciento de los puestos ejecutivos, el 17 por ciento de los miembros de las juntas directivas y el 18 por ciento de los miembros del Congreso.

Esta brecha de liderazgo es aún más sorprendente en el sector sin fines de lucro, donde las mujeres representan el 75 por ciento de la fuerza laboral pero solo el 23 por ciento de los presidentes de organizaciones y el 29 por ciento de los presidentes de juntas directivas.

Las barreras que impiden que las mujeres alcancen posiciones de liderazgo son reales y están bien documentadas. Pero también creo que necesitamos reconocer que las mujeres mismas pueden estar contribuyendo inadvertidamente a estas estadísticas.

Mi argumento es que las mujeres enfrentan barreras reales en el lugar de trabajo, pero también que debemos reconocer que a veces nosotras mismas nos frenamos. Nos subestimamos. No nos postulamos para trabajos y oportunidades. No nos sentamos a la mesa.

Internalizamos los mensajes negativos que recibimos a lo largo de nuestras vidas: los mensajes que dicen que está mal ser ambiciosa, que es mejor ser querida que respetada, que lograr el éxito profesional de alguna manera nos hace menos femeninas.

Necesitamos cambiar la conversación de lo que las mujeres no pueden hacer a lo que pueden hacer.`,
          created_at: new Date().toISOString(),
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440302",
          book_id: bookId,
          chapter_number: 2,
          title: "Siéntate a la Mesa",
          content: `Hace varios años, fui invitada a hablar en una conferencia junto con un hombre muy prominente en tecnología. Después de nuestras presentaciones, nos sentamos para una sesión de preguntas y respuestas. El primer estudiante que se acercó al micrófono comenzó dirigiéndose al hombre: "Esta pregunta es para ambos, pero comenzaré con usted..."

Luego hizo su pregunta. El hombre respondió. Luego, en lugar de dirigirse a mí, el estudiante hizo una pregunta de seguimiento... solo al hombre. Después de que el hombre respondió, el estudiante dijo "gracias" y se alejó.

Fue como si yo no estuviera allí.

Después, varias personas se acercaron a mí y dijeron: "No puedo creer que ese estudiante te ignorara completamente". Pero aquí está la cosa: yo tampoco había hecho nada para insertar mi voz en la conversación.

Esta experiencia me enseñó algo importante sobre la diferencia entre cómo los hombres y las mujeres se acercan a las oportunidades profesionales.

Los hombres tienden a sobrestimar sus habilidades y desempeño, y las mujeres tienden a subestimarlas. Cuando los hombres tienen éxito, lo atribuyen a sus habilidades inherentes. Cuando las mujeres tienen éxito, lo atribuyen a la suerte, el trabajo duro y la ayuda de otros.

Los hombres se postulan para trabajos cuando cumplen con el 60 por ciento de las calificaciones. Las mujeres se postulan solo cuando cumplen con el 100 por ciento de las calificaciones.

¿Qué explica esta diferencia? Hay muchos factores, pero creo que uno de los más importantes es que las mujeres sistemáticamente subestiman sus propias habilidades.

Si las mujeres fueran más agresivas al buscar oportunidades de liderazgo, más mujeres alcanzarían posiciones de liderazgo. Y el mundo sería un lugar mejor.

Pero "sentarse a la mesa" no es solo sobre ser más agresiva. También se trata de tener la confianza para creer que perteneces allí.`,
          created_at: new Date().toISOString(),
        },
      ],
    }

    return chapters[bookId] || []
  }
}

// Export singleton instance
export const libraryService = new LibraryService()

// Also export the class for direct instantiation if needed

// Default export
export default libraryService
