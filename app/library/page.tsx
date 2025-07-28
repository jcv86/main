"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Star, Search, Filter, X, TrendingUp, Target, Award, Zap } from "lucide-react"
import Link from "next/link"

interface Book {
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
  difficulty: string
  key_topics: string[]
  is_recommended: boolean
  is_free: boolean
  created_at: string
  updated_at: string
}

interface BookProgress {
  user_id: string
  book_id: string
  current_chapter: number
  progress_percentage: number
  total_chapters: number
  reading_time_minutes: number
  started_at: string
  last_read_at: string
  created_at: string
  updated_at: string
}

interface UserReadingStats {
  user_id: string
  books_read: number
  total_reading_time: number
  reading_streak: number
  points: number
  level: number
  created_at: string
  updated_at: string
}

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [progress, setProgress] = useState<BookProgress[]>([])
  const [stats, setStats] = useState<UserReadingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Mock data - in a real app, this would come from your API
  useEffect(() => {
    const mockBooks: Book[] = [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        title: "Hábitos Atómicos",
        author: "James Clear",
        description:
          "Un método fácil y comprobado para crear buenos hábitos y eliminar los malos. Aprende cómo pequeños cambios pueden generar resultados extraordinarios en tu vida personal y profesional.",
        category: "Productividad",
        rating: 4.8,
        reading_time: "4h 30min",
        pages: 8,
        published_year: 2018,
        cover_url: "/placeholder.svg?height=400&width=300&text=Hábitos%20Atómicos&bg=3b82f6&color=white",
        tags: ["Hábitos", "Productividad", "Autoayuda", "Comportamiento"],
        difficulty: "Intermedio",
        key_topics: [
          "Formación de hábitos",
          "Productividad personal",
          "Cambio de comportamiento",
          "Sistemas vs objetivos",
        ],
        is_recommended: true,
        is_free: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        title: "Los 7 Hábitos de la Gente Altamente Efectiva",
        author: "Stephen R. Covey",
        description:
          "Lecciones poderosas de cambio personal que han inspirado a millones de personas. Un enfoque holístico para resolver problemas personales y profesionales.",
        category: "Liderazgo",
        rating: 4.6,
        reading_time: "6h 15min",
        pages: 7,
        published_year: 1989,
        cover_url: "/placeholder.svg?height=400&width=300&text=7%20Hábitos&bg=1f2937&color=white",
        tags: ["Liderazgo", "Efectividad", "Desarrollo Personal", "Principios"],
        difficulty: "Intermedio",
        key_topics: ["Liderazgo personal", "Efectividad", "Principios de vida", "Interdependencia"],
        is_recommended: true,
        is_free: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        title: "Trabajo Profundo",
        author: "Cal Newport",
        description:
          "Reglas para el éxito enfocado en un mundo distraído. Desarrolla la habilidad más valiosa del siglo XXI: la capacidad de concentrarse sin distracciones.",
        category: "Productividad",
        rating: 4.7,
        reading_time: "4h 45min",
        pages: 6,
        published_year: 2016,
        cover_url: "/placeholder.svg?height=400&width=300&text=Trabajo%20Profundo&bg=1f2937&color=white",
        tags: ["Concentración", "Productividad", "Trabajo", "Enfoque"],
        difficulty: "Intermedio",
        key_topics: ["Trabajo profundo", "Concentración", "Productividad cognitiva", "Distracción digital"],
        is_recommended: true,
        is_free: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440004",
        title: "Inteligencia Emocional",
        author: "Daniel Goleman",
        description:
          "Por qué puede importar más que el coeficiente intelectual. Estrategias para aumentar tu EQ y mejorar tus habilidades interpersonales.",
        category: "Habilidades Blandas",
        rating: 4.4,
        reading_time: "3h 50min",
        pages: 6,
        published_year: 1995,
        cover_url: "/placeholder.svg?height=400&width=300&text=Inteligencia%20Emocional&bg=10b981&color=white",
        tags: ["Inteligencia Emocional", "Habilidades Blandas", "Comunicación", "Autoconciencia"],
        difficulty: "Intermedio",
        key_topics: ["Inteligencia emocional", "Autoconciencia", "Habilidades sociales", "Autorregulación"],
        is_recommended: true,
        is_free: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440005",
        title: "Lean In",
        author: "Sheryl Sandberg",
        description:
          "Las mujeres, el trabajo y la voluntad de liderar en el mundo profesional moderno. Un llamado a la acción para que las mujeres alcancen su potencial completo.",
        category: "Liderazgo",
        rating: 4.5,
        reading_time: "5h 20min",
        pages: 6,
        published_year: 2013,
        cover_url: "/placeholder.svg?height=400&width=300&text=Lean%20In&bg=ec4899&color=white",
        tags: ["Liderazgo", "Carrera", "Género", "Empoderamiento"],
        difficulty: "Fácil",
        key_topics: ["Liderazgo femenino", "Desarrollo profesional", "Igualdad de género", "Ambición"],
        is_recommended: false,
        is_free: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    const mockProgress: BookProgress[] = [
      {
        user_id: "550e8400-e29b-41d4-a716-446655440000",
        book_id: "550e8400-e29b-41d4-a716-446655440001",
        current_chapter: 2,
        progress_percentage: 65,
        total_chapters: 8,
        reading_time_minutes: 180,
        started_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        last_read_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: "550e8400-e29b-41d4-a716-446655440000",
        book_id: "550e8400-e29b-41d4-a716-446655440004",
        current_chapter: 5,
        progress_percentage: 80,
        total_chapters: 6,
        reading_time_minutes: 240,
        started_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        last_read_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: "550e8400-e29b-41d4-a716-446655440000",
        book_id: "550e8400-e29b-41d4-a716-446655440002",
        current_chapter: 7,
        progress_percentage: 100,
        total_chapters: 7,
        reading_time_minutes: 375,
        started_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        last_read_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        user_id: "550e8400-e29b-41d4-a716-446655440000",
        book_id: "550e8400-e29b-41d4-a716-446655440005",
        current_chapter: 2,
        progress_percentage: 35,
        total_chapters: 6,
        reading_time_minutes: 95,
        started_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        last_read_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    const mockStats: UserReadingStats = {
      user_id: "550e8400-e29b-41d4-a716-446655440000",
      books_read: 5,
      total_reading_time: 890,
      reading_streak: 12,
      points: 1250,
      level: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setBooks(mockBooks)
    setProgress(mockProgress)
    setStats(mockStats)
    setLoading(false)
  }, [])

  // Get book progress
  const getBookProgress = (bookId: string) => {
    return progress.find((p) => p.book_id === bookId)
  }

  // Filter books based on search and filters
  const filteredBooks = useMemo(() => {
    let filtered = books

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((book) => book.category === categoryFilter)
    }

    // Difficulty filter
    if (difficultyFilter !== "all") {
      filtered = filtered.filter((book) => book.difficulty === difficultyFilter)
    }

    return filtered
  }, [books, searchTerm, categoryFilter, difficultyFilter])

  // Get books by tab
  const getBooksByTab = (tab: string) => {
    switch (tab) {
      case "in-progress":
        return filteredBooks.filter((book) => {
          const bookProgress = getBookProgress(book.id)
          return bookProgress && bookProgress.progress_percentage > 0 && bookProgress.progress_percentage < 100
        })
      case "completed":
        return filteredBooks.filter((book) => {
          const bookProgress = getBookProgress(book.id)
          return bookProgress && bookProgress.progress_percentage === 100
        })
      case "recommended":
        return filteredBooks.filter((book) => book.is_recommended)
      default:
        return filteredBooks
    }
  }

  // Get unique categories and difficulties
  const categories = [...new Set(books.map((book) => book.category))]
  const difficulties = [...new Set(books.map((book) => book.difficulty))]

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Hace menos de 1 hora"
    if (diffInHours < 24) return `Hace ${diffInHours} horas`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "Hace 1 día"
    if (diffInDays < 7) return `Hace ${diffInDays} días`

    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks === 1) return "Hace 1 semana"
    return `Hace ${diffInWeeks} semanas`
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-100 text-green-800"
      case "Intermedio":
        return "bg-yellow-100 text-yellow-800"
      case "Avanzado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Productividad":
        return "bg-blue-100 text-blue-800"
      case "Liderazgo":
        return "bg-purple-100 text-purple-800"
      case "Habilidades Blandas":
        return "bg-green-100 text-green-800"
      case "Carrera":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setCategoryFilter("all")
    setDifficultyFilter("all")
  }

  const hasActiveFilters = searchTerm || categoryFilter !== "all" || difficultyFilter !== "all"

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Biblioteca de Desarrollo Profesional</h1>
        <p className="text-gray-600">Descubre libros que transformarán tu carrera y desarrollo personal</p>
      </div>

      {/* Stats Dashboard */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Libros Leídos</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.books_read}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Tiempo Total</p>
                  <p className="text-2xl font-bold text-green-900">
                    {Math.floor(stats.total_reading_time / 60)}h {stats.total_reading_time % 60}m
                  </p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Racha de Lectura</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.reading_streak} días</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Nivel</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.level}</p>
                  <p className="text-xs text-purple-600">{stats.points} puntos</p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por título, autor, descripción o etiquetas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
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
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Dificultad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las dificultades</SelectItem>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="px-3 bg-transparent">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Todos ({getBooksByTab("all").length})
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            En Progreso ({getBooksByTab("in-progress").length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Completados ({getBooksByTab("completed").length})
          </TabsTrigger>
          <TabsTrigger value="recommended" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Recomendados ({getBooksByTab("recommended").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <BookGrid books={getBooksByTab("all")} progress={progress} />
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          <BookGrid books={getBooksByTab("in-progress")} progress={progress} />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <BookGrid books={getBooksByTab("completed")} progress={progress} />
        </TabsContent>

        <TabsContent value="recommended" className="mt-6">
          <BookGrid books={getBooksByTab("recommended")} progress={progress} />
        </TabsContent>
      </Tabs>
    </div>
  )

  function BookGrid({ books, progress }: { books: Book[]; progress: BookProgress[] }) {
    if (books.length === 0) {
      return (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron libros</h3>
          <p className="text-gray-500 mb-4">
            {hasActiveFilters ? "Intenta ajustar tus filtros de búsqueda" : "No hay libros disponibles en esta sección"}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Limpiar filtros
            </Button>
          )}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => {
          const bookProgress = getBookProgress(book.id)
          const isCompleted = bookProgress?.progress_percentage === 100
          const isInProgress =
            bookProgress && bookProgress.progress_percentage > 0 && bookProgress.progress_percentage < 100

          return (
            <Card key={book.id} className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {book.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 mt-1">por {book.author}</CardDescription>
                  </div>
                  {book.is_recommended && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 ml-2">
                      <Star className="h-3 w-3 mr-1" />
                      Recomendado
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className={getCategoryColor(book.category)}>{book.category}</Badge>
                  <Badge className={getDifficultyColor(book.difficulty)}>{book.difficulty}</Badge>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 mb-3">{book.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{book.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{book.reading_time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{book.pages} cap.</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {bookProgress && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {isCompleted ? "Completado" : `Progreso: ${bookProgress.progress_percentage}%`}
                      </span>
                      <span className="text-xs text-gray-500">
                        Cap. {bookProgress.current_chapter}/{bookProgress.total_chapters}
                      </span>
                    </div>
                    <Progress value={bookProgress.progress_percentage} className="h-2 mb-2" />
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>
                        {Math.floor(bookProgress.reading_time_minutes / 60)}h {bookProgress.reading_time_minutes % 60}m
                        leído
                      </span>
                      <span>Última lectura: {formatTimeAgo(bookProgress.last_read_at)}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {isCompleted ? (
                    <Button asChild className="flex-1">
                      <Link href={`/library/reader/${book.id}`}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Releer
                      </Link>
                    </Button>
                  ) : isInProgress ? (
                    <Button asChild className="flex-1">
                      <Link href={`/library/reader/${book.id}`}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Continuar Leyendo
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild className="flex-1">
                      <Link href={`/library/reader/${book.id}`}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Comenzar a Leer
                      </Link>
                    </Button>
                  )}
                </div>

                {book.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {book.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {book.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{book.tags.length - 3} más
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }
}
