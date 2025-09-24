"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import EnhancedBookReader from "@/components/enhanced-book-reader"
import QuickBookAccess from "@/components/quick-book-access"
import EnhancedSearchAlgorithm from "@/components/enhanced-search-algorithm"
import {
  BookOpen,
  Clock,
  User,
  Star,
  Search,
  Filter,
  Bookmark,
  TrendingUp,
  BarChart3,
  Users,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  BookmarkIcon,
  RefreshCw,
  Zap,
} from "lucide-react"

interface Book {
  id: number
  title: string
  author: string
  category: string
  content: string
  tags: string[]
  slug: string
  read_count: number
  created_at: string
  updated_at: string
  pages: number
  reading_time: number
  characters: number
  difficulty_level?: string
  estimated_read_time?: number
}

interface ReadingProgress {
  book_id: number
  reading_progress: number
  target_percentage: number
  status: "not_started" | "reading" | "completed" | "paused"
  reading_time_minutes: number
  started_at?: string
  completed_at?: string
  last_read_at?: string
}

interface LibraryStats {
  total_books: number
  categories: number
  authors: number
  total_reads: number
  avg_characters: number
}

export default function BibliotecaPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [readingProgress, setReadingProgress] = useState<ReadingProgress[]>([])
  const [bookmarks, setBookmarks] = useState<number[]>([])
  const [stats, setStats] = useState<LibraryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("popular")
  const [activeTab, setActiveTab] = useState("explorar")

  // Estado del lector de libros
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isReaderOpen, setIsReaderOpen] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    loadLibraryData()
  }, [])

  const loadLibraryData = async () => {
    try {
      setLoading(true)
      console.log("Cargando datos de la biblioteca...")

      // Cargar libros desde la base de datos
      const response = await fetch("/api/books")
      if (response.ok) {
        const booksData = await response.json()
        console.log("Libros cargados desde API:", booksData.length)

        // Transformar los datos para incluir campos calculados
        const transformedBooks = booksData.map((book: any) => ({
          ...book,
          pages: Math.ceil(book.content.length / 200), // 200 caracteres por página
          reading_time: Math.ceil(book.content.length / 1000), // 1000 caracteres = 1 minuto
          characters: book.content.length,
          // Mapear campos si vienen con nombres diferentes
          difficulty_level: book.difficulty_level || "intermedio",
          estimated_read_time: book.estimated_read_time || Math.ceil(book.content.length / 1000),
        }))

        setBooks(transformedBooks)

        // Calcular estadísticas reales
        const realStats: LibraryStats = {
          total_books: transformedBooks.length,
          categories: new Set(transformedBooks.map((b: Book) => b.category)).size,
          authors: new Set(transformedBooks.map((b: Book) => b.author)).size,
          total_reads: transformedBooks.reduce((sum: number, book: Book) => sum + book.read_count, 0),
          avg_characters: Math.round(
            transformedBooks.reduce((sum: number, book: Book) => sum + book.characters, 0) / transformedBooks.length,
          ),
        }
        setStats(realStats)

        toast({
          title: "Biblioteca cargada",
          description: `Se cargaron ${transformedBooks.length} libros exitosamente.`,
        })
      } else {
        throw new Error("Error en la respuesta de la API")
      }

      // Cargar progreso del usuario y marcadores
      await loadUserData()
    } catch (error) {
      console.error("Error cargando datos de la biblioteca:", error)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar a la base de datos. Mostrando datos de ejemplo.",
        variant: "destructive",
      })

      // Datos de respaldo completos si falla la API
      loadFallbackData()
    } finally {
      setLoading(false)
    }
  }

  const loadFallbackData = () => {
    // Datos de respaldo más completos cuando falla la conexión
    const fallbackBooks: Book[] = [
      {
        id: 1,
        title: "Organízate con Eficacia",
        author: "David Allen",
        category: "Productividad",
        content: `Organízate con Eficacia (Getting Things Done) es un sistema revolucionario de gestión del tiempo y la productividad que ha transformado la vida de millones de personas en todo el mundo.

**El Problema Fundamental:**
Nuestra mente no está diseñada para recordar tareas y compromisos. Cuando intentamos mantener todo en nuestra cabeza, experimentamos estrés constante y perdemos claridad mental.

**Los Cinco Pasos del Método GTD:**

**1. Capturar**
- Recopila todo lo que llame tu atención en bandejas de entrada confiables
- Usa herramientas como libretas, aplicaciones o grabadoras de voz
- El objetivo es sacar todo de tu mente y ponerlo en un sistema externo

**2. Aclarar**
- Procesa cada elemento de tus bandejas de entrada
- Pregúntate: "¿Es accionable?"
- Si no es accionable: elimínalo, archívalo o ponlo en "algún día/tal vez"
- Si es accionable: define la siguiente acción específica

**3. Organizar**
- Coloca los elementos accionables en las listas apropiadas
- Usa contextos como @llamadas, @ordenador, @recados
- Mantén un calendario solo para citas y compromisos con fecha específica

**4. Reflexionar**
- Revisa semanalmente todo tu sistema
- Actualiza listas, proyectos y compromisos
- Mantén tu sistema actualizado y confiable

**5. Comprometerse**
- Usa tu sistema para tomar decisiones sobre qué hacer
- Confía en tu sistema para elegir la siguiente acción
- Actúa con confianza sabiendo que no se te olvida nada

GTD no es solo un sistema de productividad, es una forma de vida que te permite estar presente y enfocado en lo que realmente importa.`,
        tags: ["productividad", "organización", "gestión del tiempo", "gtd", "eficiencia"],
        slug: "organizate-con-eficacia",
        read_count: 2847,
        created_at: "2024-01-15T00:00:00Z",
        updated_at: "2024-01-20T00:00:00Z",
        pages: 45,
        reading_time: 9,
        characters: 8950,
        difficulty_level: "intermedio",
        estimated_read_time: 540,
      },
      {
        id: 2,
        title: "Inteligencia Emocional",
        author: "Daniel Goleman",
        category: "Psicología",
        content: `La Inteligencia Emocional es la capacidad de reconocer, entender y manejar nuestras propias emociones, así como reconocer, entender e influir en las emociones de otros.

**Los Cinco Componentes de la Inteligencia Emocional:**

**1. Autoconciencia Emocional**
- Reconocer y entender tus propias emociones
- Ser consciente de cómo tus emociones afectan tus pensamientos y comportamiento
- Conocer tus fortalezas y limitaciones emocionales
- Tener confianza en ti mismo basada en el autoconocimiento

**2. Autorregulación**
- Manejar efectivamente las emociones disruptivas e impulsos
- Mantener estándares de honestidad e integridad
- Asumir responsabilidad por tu desempeño personal
- Ser flexible en el manejo del cambio

**3. Motivación**
- Estar impulsado a lograr por el simple placer del logro
- Tener un fuerte impulso para mejorar el desempeño
- Mostrar compromiso con los objetivos del grupo u organización
- Estar listo para actuar en oportunidades y ser optimista incluso frente al fracaso

**4. Empatía**
- Entender las emociones de otros y mostrar interés activo en sus preocupaciones
- Anticipar, reconocer y satisfacer las necesidades de los clientes
- Ayudar a desarrollar las habilidades de otros
- Leer las corrientes políticas y redes sociales de una organización

**5. Habilidades Sociales**
- Ser efectivo en liderar el cambio
- Ser persuasivo y usar habilidades de comunicación efectivas
- Ser experto en construir y liderar equipos
- Manejar disputas y negociar resoluciones

La inteligencia emocional es más predictiva del éxito en la vida que el CI tradicional, y afortunadamente, puede desarrollarse a cualquier edad con práctica y dedicación.`,
        tags: ["inteligencia emocional", "psicología", "liderazgo", "relaciones", "autoconciencia"],
        slug: "inteligencia-emocional",
        read_count: 3156,
        created_at: "2024-01-10T00:00:00Z",
        updated_at: "2024-01-18T00:00:00Z",
        pages: 38,
        reading_time: 8,
        characters: 7600,
        difficulty_level: "intermedio",
        estimated_read_time: 480,
      },
      {
        id: 3,
        title: "Los 7 Hábitos de la Gente Altamente Efectiva",
        author: "Stephen R. Covey",
        category: "Desarrollo Personal",
        content: `Los 7 Hábitos de la Gente Altamente Efectiva presenta un enfoque holístico, integrado y centrado en principios para resolver problemas personales y profesionales.

**Paradigmas y Principios:**
Los paradigmas son mapas mentales que determinan cómo vemos el mundo. Los principios son leyes naturales universales que gobiernan la efectividad humana.

**Los 7 Hábitos:**

**VICTORIA PRIVADA (Independencia)**

**Hábito 1: Ser Proactivo**
- Toma responsabilidad de tu vida y decisiones
- Enfócate en tu Círculo de Influencia, no en tu Círculo de Preocupación
- Usa lenguaje proactivo: "Yo puedo", "Yo elegiré", "Yo prefiero"
- Responde basándote en valores, no en condiciones o sentimientos

**Hábito 2: Comenzar con el Fin en Mente**
- Define claramente tu misión y visión personal
- Crea una declaración de misión personal basada en principios
- Visualiza tu funeral: ¿qué te gustaría que dijeran de ti?
- Todos los logros se crean mentalmente antes que físicamente

**Hábito 3: Poner Primero lo Primero**
- Gestiona tu tiempo basándote en principios, no en prioridades
- Enfócate en actividades del Cuadrante II (importante pero no urgente)
- Aprende a decir "no" a lo bueno para decir "sí" a lo mejor
- Organiza y ejecuta alrededor de prioridades

Los 7 hábitos no son técnicas de personalidad superficiales, sino principios fundamentales de efectividad humana que, cuando se practican consistentemente, se convierten en la base del carácter.`,
        tags: ["desarrollo personal", "liderazgo", "efectividad", "hábitos", "principios"],
        slug: "7-habitos-gente-altamente-efectiva",
        read_count: 4521,
        created_at: "2024-01-05T00:00:00Z",
        updated_at: "2024-01-15T00:00:00Z",
        pages: 42,
        reading_time: 8,
        characters: 8400,
        difficulty_level: "intermedio",
        estimated_read_time: 504,
      },
      {
        id: 4,
        title: "Cómo Ganar Amigos e Influir sobre las Personas",
        author: "Dale Carnegie",
        category: "Comunicación",
        content: `Este libro clásico enseña técnicas fundamentales para manejar personas, hacer que te aprecien, ganar a la gente a tu manera de pensar y ser un líder.

**PARTE I: TÉCNICAS FUNDAMENTALES PARA TRATAR CON LA GENTE**

**Principio 1: No Critiques, No Condenes, No Te Quejes**
- La crítica es inútil porque pone a la persona a la defensiva
- La crítica hiere el orgullo, lastima el sentido de importancia
- En lugar de criticar, trata de entender por qué hacen lo que hacen

**Principio 2: Demuestra Aprecio Honesto y Sincero**
- El deseo más profundo del ser humano es sentirse importante
- Aprecia genuinamente las buenas cualidades de otros
- Sé específico en tus elogios y hazlos inmediatamente

**Principio 3: Despierta en la Otra Persona un Deseo Vehemente**
- Habla de lo que la otra persona quiere
- Muestra cómo pueden obtener lo que desean
- Conecta tus ideas con sus motivaciones

**PARTE II: SEIS MANERAS DE AGRADAR A LA GENTE**

**Principio 1: Interésate Genuinamente en Otras Personas**
- Muestra interés real en los demás y sus vidas
- Haz preguntas sobre sus intereses y experiencias
- Recuerda detalles importantes sobre las personas

Los principios de Carnegie siguen siendo relevantes porque se basan en necesidades humanas fundamentales que no cambian con el tiempo: el deseo de sentirse importante, comprendido y apreciado.`,
        tags: ["comunicación", "relaciones interpersonales", "liderazgo", "influencia", "habilidades sociales"],
        slug: "como-ganar-amigos-influir-personas",
        read_count: 5234,
        created_at: "2024-01-12T00:00:00Z",
        updated_at: "2024-01-22T00:00:00Z",
        pages: 40,
        reading_time: 8,
        characters: 8000,
        difficulty_level: "principiante",
        estimated_read_time: 480,
      },
      {
        id: 5,
        title: "Hábitos Atómicos",
        author: "James Clear",
        category: "Desarrollo Personal",
        content: `Los cambios que parecen pequeños e insignificantes al principio se convertirán en resultados extraordinarios si estás dispuesto a mantenerlos durante años. Este es el poder de los hábitos atómicos.

**Las Cuatro Leyes del Cambio de Comportamiento:**

**1ª Ley: Hazlo Obvio**
- Usa intenciones de implementación: "Haré [COMPORTAMIENTO] a las [TIEMPO] en [LUGAR]"
- Usa el apilamiento de hábitos: "Después de [HÁBITO ACTUAL], haré [NUEVO HÁBITO]"
- Diseña tu ambiente para hacer obvios los buenos hábitos
- Usa señales visuales para activar los comportamientos deseados

**2ª Ley: Hazlo Atractivo**
- Usa el agrupamiento de tentaciones: combina acciones que quieres hacer con acciones que necesitas hacer
- Únete a una cultura donde tu comportamiento deseado sea normal
- Crea un ritual de motivación antes de hábitos difíciles
- Resalta los beneficios de evitar malos hábitos

**3ª Ley: Hazlo Fácil**
- Reduce la fricción para buenos hábitos y aumenta la fricción para malos hábitos
- Usa la Regla de los Dos Minutos: escala los hábitos hasta que tomen menos de dos minutos
- Prepara tu ambiente para hacer más fáciles las acciones futuras
- Usa la tecnología para automatizar buenos hábitos

**4ª Ley: Hazlo Satisfactorio**
- Usa refuerzo: date recompensas inmediatas por buenos hábitos
- Haz que "no hacer nada" sea disfrutable para hábitos que quieres evitar
- Usa un rastreador de hábitos para visualizar tu progreso
- Nunca falles dos veces: regresa rápidamente después de errores

El secreto para obtener resultados que duren es nunca dejar de hacer mejoras. Es notable lo que puedes construir si simplemente no paras.`,
        tags: ["hábitos", "cambio de comportamiento", "automejora", "sistemas", "identidad"],
        slug: "habitos-atomicos",
        read_count: 6789,
        created_at: "2024-01-08T00:00:00Z",
        updated_at: "2024-01-25T00:00:00Z",
        pages: 36,
        reading_time: 7,
        characters: 7200,
        difficulty_level: "intermedio",
        estimated_read_time: 432,
      },
    ]

    setBooks(fallbackBooks)

    const fallbackStats: LibraryStats = {
      total_books: fallbackBooks.length,
      categories: new Set(fallbackBooks.map((b) => b.category)).size,
      authors: new Set(fallbackBooks.map((b) => b.author)).size,
      total_reads: fallbackBooks.reduce((sum, book) => sum + book.read_count, 0),
      avg_characters: Math.round(fallbackBooks.reduce((sum, book) => sum + book.characters, 0) / fallbackBooks.length),
    }
    setStats(fallbackStats)
  }

  const loadUserData = async () => {
    // Cargar progreso de lectura del usuario (simulado)
    const mockProgress: ReadingProgress[] = [
      {
        book_id: 1,
        reading_progress: 100,
        target_percentage: 100,
        status: "completed",
        reading_time_minutes: 180,
        completed_at: "2024-01-20",
      },
      {
        book_id: 2,
        reading_progress: 65,
        target_percentage: 100,
        status: "reading",
        reading_time_minutes: 98,
        started_at: "2024-01-18",
        last_read_at: "2024-01-25",
      },
      {
        book_id: 3,
        reading_progress: 30,
        target_percentage: 60,
        status: "reading",
        reading_time_minutes: 45,
        started_at: "2024-01-22",
        last_read_at: "2024-01-24",
      },
    ]

    setReadingProgress(mockProgress)
    setBookmarks([1, 3, 5, 7, 9])
  }

  const refreshLibrary = async () => {
    await loadLibraryData()
  }

  const getBookProgress = (bookId: number) => {
    return readingProgress.find((p) => p.book_id === bookId)
  }

  const isBookmarked = (bookId: number) => {
    return bookmarks.includes(bookId)
  }

  const toggleBookmark = async (bookId: number) => {
    try {
      const isCurrentlyBookmarked = isBookmarked(bookId)

      if (isCurrentlyBookmarked) {
        setBookmarks((prev) => prev.filter((id) => id !== bookId))
        toast({
          title: "Marcador eliminado",
          description: "El libro se ha eliminado de tus guardados.",
        })
      } else {
        setBookmarks((prev) => [...prev, bookId])
        toast({
          title: "Libro guardado",
          description: "El libro se ha añadido a tus guardados.",
        })
      }
    } catch (error) {
      console.error("Error cambiando marcador:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el marcador.",
        variant: "destructive",
      })
    }
  }

  const setReadingGoal = async (bookId: number, percentage: 30 | 60 | 100) => {
    try {
      // Actualizar estado local
      setReadingProgress((prev) =>
        prev.map((p) => (p.book_id === bookId ? { ...p, target_percentage: percentage } : p)),
      )

      // Si no existe progreso, crearlo
      if (!getBookProgress(bookId)) {
        const newProgress: ReadingProgress = {
          book_id: bookId,
          reading_progress: 0,
          target_percentage: percentage,
          status: "not_started",
          reading_time_minutes: 0,
        }
        setReadingProgress((prev) => [...prev, newProgress])
      }

      toast({
        title: "Objetivo actualizado",
        description: `Objetivo de lectura establecido en ${percentage}%`,
      })
    } catch (error) {
      console.error("Error estableciendo objetivo de lectura:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el objetivo de lectura.",
        variant: "destructive",
      })
    }
  }

  const openBookReader = (book: Book) => {
    setSelectedBook(book)
    setIsReaderOpen(true)

    // Actualizar contador de lecturas
    setBooks((prev) => prev.map((b) => (b.id === book.id ? { ...b, read_count: b.read_count + 1 } : b)))
  }

  const closeBookReader = () => {
    setIsReaderOpen(false)
    setSelectedBook(null)
  }

  const handleBookmarkFromReader = (bookId: number) => {
    toggleBookmark(bookId)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "reading":
        return <PlayCircle className="h-4 w-4 text-blue-600" />
      case "paused":
        return <PauseCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <BookOpen className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "reading":
        return "Leyendo"
      case "paused":
        return "Pausado"
      default:
        return "No iniciado"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "principiante":
        return "bg-green-100 text-green-800"
      case "intermedio":
        return "bg-yellow-100 text-yellow-800"
      case "avanzado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.read_count - a.read_count
      case "recent":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case "title":
        return a.title.localeCompare(b.title)
      case "author":
        return a.author.localeCompare(b.author)
      default:
        return 0
    }
  })

  const getBooksByStatus = (status: string) => {
    return books.filter((book) => {
      const progress = getBookProgress(book.id)
      return progress?.status === status
    })
  }

  const getBookmarkedBooks = () => {
    return books.filter((book) => isBookmarked(book.id))
  }

  const categories = Array.from(new Set(books.map((book) => book.category)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-lg text-gray-600">Cargando biblioteca...</p>
            <p className="text-sm text-gray-500 mt-2">Conectando con la base de datos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 Biblioteca de Desarrollo Profesional</h1>
              <p className="text-lg text-gray-600">
                Explora, aprende y crece con nuestra colección completa de libros de desarrollo profesional
              </p>
            </div>
            <div className="flex items-center gap-2">
              <QuickBookAccess
                books={books}
                onBookSelect={openBookReader}
                trigger={
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Zap className="h-4 w-4" />
                    Acceso Rápido
                  </Button>
                }
              />
              <EnhancedSearchAlgorithm
                books={books}
                onBookSelect={openBookReader}
                trigger={
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Search className="h-4 w-4" />
                    Búsqueda IA
                  </Button>
                }
              />
              <Button onClick={refreshLibrary} variant="outline" className="flex items-center gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Tarjetas de Estadísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-gray-900">{stats.total_books}</div>
                <div className="text-sm text-gray-600">Total Libros</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Filter className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-gray-900">{stats.categories}</div>
                <div className="text-sm text-gray-600">Categorías</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-gray-900">{stats.authors}</div>
                <div className="text-sm text-gray-600">Autores</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold text-gray-900">{stats.total_reads.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Lecturas</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold text-gray-900">{stats.avg_characters.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Promedio Caracteres</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Búsqueda y Filtros */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por título, autor o etiquetas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Más populares</SelectItem>
                  <SelectItem value="recent">Más recientes</SelectItem>
                  <SelectItem value="title">Título A-Z</SelectItem>
                  <SelectItem value="author">Autor A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Mostrando {sortedBooks.length} de {books.length} libros
              {searchTerm && ` para "${searchTerm}"`}
              {selectedCategory !== "all" && ` en ${selectedCategory}`}
            </div>
          </CardContent>
        </Card>

        {/* Pestañas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="explorar">Explorar</TabsTrigger>
            <TabsTrigger value="populares">Populares</TabsTrigger>
            <TabsTrigger value="leyendo">Leyendo</TabsTrigger>
            <TabsTrigger value="completados">Completados</TabsTrigger>
            <TabsTrigger value="guardados">Guardados</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          </TabsList>

          {/* Pestaña Explorar */}
          <TabsContent value="explorar">
            {sortedBooks.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No se encontraron libros con los filtros actuales</p>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("all")
                    }}
                  >
                    Limpiar Filtros
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedBooks.map((book) => {
                  const progress = getBookProgress(book.id)
                  return (
                    <Card key={book.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2 line-clamp-2">{book.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4" />
                              {book.author}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBookmark(book.id)}
                            className={isBookmarked(book.id) ? "text-yellow-600" : "text-gray-400"}
                          >
                            <BookmarkIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{book.category}</Badge>
                          {book.difficulty_level && (
                            <Badge className={getDifficultyColor(book.difficulty_level)}>{book.difficulty_level}</Badge>
                          )}
                          {progress && (
                            <div className="flex items-center gap-1">
                              {getStatusIcon(progress.status)}
                              <span className="text-xs text-gray-600">{getStatusText(progress.status)}</span>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Barra de Progreso */}
                          {progress && progress.reading_progress > 0 && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progreso</span>
                                <span>
                                  {progress.reading_progress}% de {progress.target_percentage}%
                                </span>
                              </div>
                              <Progress
                                value={(progress.reading_progress / progress.target_percentage) * 100}
                                className="h-2"
                              />
                            </div>
                          )}

                          {/* Información del Libro */}
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {book.pages} páginas
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {book.reading_time} min
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              {book.read_count.toLocaleString()} lecturas
                            </div>
                            <div className="flex items-center gap-1">
                              <BarChart3 className="h-4 w-4" />
                              {book.characters.toLocaleString()} chars
                            </div>
                          </div>

                          {/* Etiquetas */}
                          <div className="flex flex-wrap gap-1">
                            {book.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {book.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{book.tags.length - 3}
                              </Badge>
                            )}
                          </div>

                          {/* Selección de Objetivo de Lectura */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Objetivo de Lectura:</label>
                            <div className="flex gap-2">
                              {[30, 60, 100].map((percentage) => (
                                <Button
                                  key={percentage}
                                  variant={progress?.target_percentage === percentage ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setReadingGoal(book.id, percentage as 30 | 60 | 100)}
                                  className="flex-1"
                                >
                                  {percentage}%
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Botones de Acción */}
                          <div className="flex gap-2">
                            <Button className="flex-1" onClick={() => openBookReader(book)}>
                              <PlayCircle className="h-4 w-4 mr-2" />
                              {progress?.status === "completed" ? "Releer" : "Leer"}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => toggleBookmark(book.id)}>
                              <BookOpen className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Pestaña Populares */}
          <TabsContent value="populares">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">📈 Libros Más Populares</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books
                  .sort((a, b) => b.read_count - a.read_count)
                  .slice(0, 9)
                  .map((book, index) => {
                    const progress = getBookProgress(book.id)
                    return (
                      <Card key={book.id} className="relative">
                        <div className="absolute -top-2 -left-2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                          <CardDescription>{book.author}</CardDescription>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{book.category}</Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Star className="h-4 w-4 text-yellow-500" />
                              {book.read_count.toLocaleString()} lecturas
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {progress && progress.reading_progress > 0 && (
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Tu progreso</span>
                                <span>{progress.reading_progress}%</span>
                              </div>
                              <Progress value={progress.reading_progress} className="h-2" />
                            </div>
                          )}
                          <Button className="w-full" onClick={() => openBookReader(book)}>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Leer Ahora
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            </div>
          </TabsContent>

          {/* Pestaña Leyendo */}
          <TabsContent value="leyendo">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">📖 Libros que Estás Leyendo</h3>
              {getBooksByStatus("reading").length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No tienes libros en progreso</p>
                    <Button className="mt-4" onClick={() => setActiveTab("explorar")}>
                      Explorar Biblioteca
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getBooksByStatus("reading").map((book) => {
                    const progress = getBookProgress(book.id)!
                    return (
                      <Card key={book.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{book.title}</CardTitle>
                          <CardDescription>{book.author}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Progreso</span>
                                <span>
                                  {progress.reading_progress}% de {progress.target_percentage}%
                                </span>
                              </div>
                              <Progress
                                value={(progress.reading_progress / progress.target_percentage) * 100}
                                className="h-3"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>Tiempo leído: {progress.reading_time_minutes} min</div>
                              <div>
                                Última lectura:{" "}
                                {progress.last_read_at ? new Date(progress.last_read_at).toLocaleDateString() : "N/A"}
                              </div>
                            </div>
                            <Button className="w-full" onClick={() => openBookReader(book)}>
                              <PlayCircle className="h-4 w-4 mr-2" />
                              Continuar Leyendo
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Pestaña Completados */}
          <TabsContent value="completados">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">✅ Libros Completados</h3>
              {getBooksByStatus("completed").length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Aún no has completado ningún libro</p>
                    <Button className="mt-4" onClick={() => setActiveTab("explorar")}>
                      Comenzar a Leer
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getBooksByStatus("completed").map((book) => {
                    const progress = getBookProgress(book.id)!
                    return (
                      <Card key={book.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{book.title}</CardTitle>
                              <CardDescription>{book.author}</CardDescription>
                            </div>
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="text-sm text-gray-600">
                              Completado:{" "}
                              {progress.completed_at ? new Date(progress.completed_at).toLocaleDateString() : "N/A"}
                            </div>
                            <div className="text-sm text-gray-600">
                              Tiempo total: {progress.reading_time_minutes} minutos
                            </div>
                            <Progress value={100} className="h-2" />
                            <div className="flex gap-2">
                              <Button variant="outline" className="flex-1 bg-transparent">
                                <Star className="h-4 w-4 mr-2" />
                                Reseñar
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1 bg-transparent"
                                onClick={() => openBookReader(book)}
                              >
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Releer
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Pestaña Guardados */}
          <TabsContent value="guardados">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">🔖 Libros Guardados</h3>
              {getBookmarkedBooks().length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Bookmark className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No tienes libros guardados</p>
                    <Button className="mt-4" onClick={() => setActiveTab("explorar")}>
                      Explorar y Guardar
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getBookmarkedBooks().map((book) => {
                    const progress = getBookProgress(book.id)
                    return (
                      <Card key={book.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{book.title}</CardTitle>
                              <CardDescription>{book.author}</CardDescription>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleBookmark(book.id)}
                              className="text-yellow-600"
                            >
                              <BookmarkIcon className="h-4 w-4" />
                            </Button>
                          </div>
                          <Badge variant="secondary">{book.category}</Badge>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {progress && progress.reading_progress > 0 && (
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Progreso</span>
                                  <span>{progress.reading_progress}%</span>
                                </div>
                                <Progress value={progress.reading_progress} className="h-2" />
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                              <div>{book.pages} páginas</div>
                              <div>{book.reading_time} min</div>
                            </div>
                            <Button className="w-full" onClick={() => openBookReader(book)}>
                              <PlayCircle className="h-4 w-4 mr-2" />
                              {progress?.status === "completed" ? "Releer" : "Leer"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Pestaña Estadísticas */}
          <TabsContent value="estadisticas">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">📊 Estadísticas de Lectura</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-gray-900">
                      {readingProgress.filter((p) => p.status === "completed").length}
                    </div>
                    <div className="text-sm text-gray-600">Libros Completados</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <PlayCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-gray-900">
                      {readingProgress.filter((p) => p.status === "reading").length}
                    </div>
                    <div className="text-sm text-gray-600">Leyendo Actualmente</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold text-gray-900">
                      {readingProgress.reduce((sum, p) => sum + p.reading_time_minutes, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Minutos Totales</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Bookmark className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold text-gray-900">{bookmarks.length}</div>
                    <div className="text-sm text-gray-600">Libros Guardados</div>
                  </CardContent>
                </Card>
              </div>

              {/* Progreso por Categoría */}
              <Card>
                <CardHeader>
                  <CardTitle>Progreso por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map((category) => {
                      const categoryBooks = books.filter((b) => b.category === category)
                      const categoryProgress = categoryBooks.map((b) => getBookProgress(b.id)).filter(Boolean)
                      const avgProgress =
                        categoryProgress.length > 0
                          ? categoryProgress.reduce((sum, p) => sum + p!.reading_progress, 0) / categoryProgress.length
                          : 0

                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{category}</span>
                            <span>{Math.round(avgProgress)}% promedio</span>
                          </div>
                          <Progress value={avgProgress} className="h-2" />
                          <div className="text-xs text-gray-600">
                            {categoryBooks.length} libros •{" "}
                            {categoryProgress.filter((p) => p!.status === "completed").length} completados
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Lector de Libros Mejorado */}
        {selectedBook && (
          <EnhancedBookReader
            book={selectedBook}
            isOpen={isReaderOpen}
            onClose={closeBookReader}
            onBookmark={handleBookmarkFromReader}
            isBookmarked={isBookmarked(selectedBook.id)}
          />
        )}
      </div>
    </div>
  )
}
