"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BookOpen,
  Clock,
  Star,
  Search,
  Award,
  Target,
  Bookmark,
  StickyNote,
  Play,
  CheckCircle,
  BarChart3,
  Brain,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

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
  progress: number
  is_recommended: boolean
  difficulty: string
  key_topics: string[]
  bookmarks_count?: number
  notes_count?: number
  last_read?: string
  current_chapter?: string
  time_spent?: number
  status?: "not_started" | "in_progress" | "completed"
}

interface ReadingStats {
  total_books: number
  completed_books: number
  in_progress_books: number
  total_pages_read: number
  total_time_spent: number
  current_streak: number
  level: number
  points: number
}

interface AIRecommendation {
  book: Book
  reason: string
  priority: "high" | "medium" | "low"
  expectedBenefit: string
}

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [readingStats, setReadingStats] = useState<ReadingStats | null>(null)
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadLibraryData()
    loadAIRecommendations()
  }, [])

  useEffect(() => {
    filterBooks()
  }, [books, searchQuery, selectedCategory, selectedDifficulty])

  const loadLibraryData = async () => {
    try {
      // Mock data with reading progress
      const mockBooks: Book[] = [
        {
          id: "1",
          title: "Hábitos Atómicos",
          author: "James Clear",
          description: "Un método fácil y comprobado para crear buenos hábitos y eliminar los malos.",
          category: "Productividad",
          rating: 4.8,
          reading_time: "4h 30min",
          pages: 320,
          published_year: 2018,
          cover_url: "/books/atomic-habits.jpg",
          tags: ["Hábitos", "Productividad", "Autoayuda"],
          progress: 65,
          is_recommended: true,
          difficulty: "Intermedio",
          key_topics: ["Formación de hábitos", "Productividad personal", "Cambio de comportamiento"],
          bookmarks_count: 8,
          notes_count: 12,
          last_read: "2024-01-15T10:30:00Z",
          current_chapter: "Capítulo 8: Cómo hacer que un hábito sea irresistible",
          time_spent: 180,
          status: "in_progress",
        },
        {
          id: "2",
          title: "Los 7 Hábitos de la Gente Altamente Efectiva",
          author: "Stephen R. Covey",
          description: "Lecciones poderosas de cambio personal que han inspirado a millones de personas.",
          category: "Liderazgo",
          rating: 4.6,
          reading_time: "6h 15min",
          pages: 432,
          published_year: 1989,
          cover_url: "/books/7-habits.jpg",
          tags: ["Liderazgo", "Efectividad", "Desarrollo Personal"],
          progress: 100,
          is_recommended: false,
          difficulty: "Intermedio",
          key_topics: ["Liderazgo personal", "Efectividad", "Principios de vida"],
          bookmarks_count: 15,
          notes_count: 23,
          last_read: "2024-01-10T14:20:00Z",
          current_chapter: "Completado",
          time_spent: 375,
          status: "completed",
        },
        {
          id: "3",
          title: "Lean In",
          author: "Sheryl Sandberg",
          description: "Las mujeres, el trabajo y la voluntad de liderar en el mundo profesional moderno.",
          category: "Liderazgo",
          rating: 4.5,
          reading_time: "5h 20min",
          pages: 368,
          published_year: 2013,
          cover_url: "/books/lean-in.jpg",
          tags: ["Liderazgo", "Carrera", "Género"],
          progress: 35,
          is_recommended: true,
          difficulty: "Intermedio",
          key_topics: ["Liderazgo femenino", "Desarrollo profesional", "Igualdad de género"],
          bookmarks_count: 4,
          notes_count: 7,
          last_read: "2024-01-12T16:45:00Z",
          current_chapter: "Capítulo 4: Es una jungla ahí afuera",
          time_spent: 95,
          status: "in_progress",
        },
        {
          id: "4",
          title: "Trabajo Profundo",
          author: "Cal Newport",
          description: "Reglas para el éxito enfocado en un mundo distraído.",
          category: "Productividad",
          rating: 4.7,
          reading_time: "4h 45min",
          pages: 304,
          published_year: 2016,
          cover_url: "/books/deep-work.jpg",
          tags: ["Concentración", "Productividad", "Trabajo"],
          progress: 0,
          is_recommended: false,
          difficulty: "Avanzado",
          key_topics: ["Trabajo profundo", "Concentración", "Productividad cognitiva"],
          bookmarks_count: 0,
          notes_count: 0,
          status: "not_started",
        },
        {
          id: "5",
          title: "Inteligencia Emocional 2.0",
          author: "Travis Bradberry",
          description: "Estrategias para aumentar tu EQ y mejorar tus habilidades interpersonales.",
          category: "Habilidades Blandas",
          rating: 4.4,
          reading_time: "3h 50min",
          pages: 280,
          published_year: 2009,
          cover_url: "/books/emotional-intelligence.jpg",
          tags: ["Inteligencia Emocional", "Habilidades Blandas", "Comunicación"],
          progress: 80,
          is_recommended: true,
          difficulty: "Intermedio",
          key_topics: ["Inteligencia emocional", "Autoconciencia", "Habilidades sociales"],
          bookmarks_count: 6,
          notes_count: 9,
          last_read: "2024-01-14T09:15:00Z",
          current_chapter: "Capítulo 12: Habilidades sociales avanzadas",
          time_spent: 200,
          status: "in_progress",
        },
        {
          id: "6",
          title: "The Lean Startup",
          author: "Eric Ries",
          description: "Cómo los emprendedores de hoy usan la innovación continua para crear negocios exitosos.",
          category: "Emprendimiento",
          rating: 4.3,
          reading_time: "5h 10min",
          pages: 336,
          published_year: 2011,
          cover_url: "/books/lean-startup.jpg",
          tags: ["Emprendimiento", "Startup", "Innovación"],
          progress: 0,
          is_recommended: false,
          difficulty: "Intermedio",
          key_topics: ["Metodología lean", "Validación de productos", "Innovación"],
          bookmarks_count: 0,
          notes_count: 0,
          status: "not_started",
        },
        {
          id: "7",
          title: "Mindset",
          author: "Carol S. Dweck",
          description: "La nueva psicología del éxito y cómo desarrollar una mentalidad de crecimiento.",
          category: "Desarrollo Personal",
          rating: 4.6,
          reading_time: "4h 20min",
          pages: 276,
          published_year: 2006,
          cover_url: "/books/mindset.jpg",
          tags: ["Mentalidad", "Crecimiento", "Psicología"],
          progress: 0,
          is_recommended: true,
          difficulty: "Intermedio",
          key_topics: ["Mentalidad de crecimiento", "Resiliencia", "Aprendizaje"],
          bookmarks_count: 0,
          notes_count: 0,
          status: "not_started",
        },
        {
          id: "8",
          title: "El Poder del Ahora",
          author: "Eckhart Tolle",
          description: "Una guía hacia la iluminación espiritual y la presencia consciente.",
          category: "Desarrollo Personal",
          rating: 4.4,
          reading_time: "3h 45min",
          pages: 236,
          published_year: 1997,
          cover_url: "/books/power-of-now.jpg",
          tags: ["Mindfulness", "Espiritualidad", "Presente"],
          progress: 0,
          is_recommended: false,
          difficulty: "Avanzado",
          key_topics: ["Mindfulness", "Conciencia", "Presencia"],
          bookmarks_count: 0,
          notes_count: 0,
          status: "not_started",
        },
        {
          id: "9",
          title: "De Buena a Grandiosa",
          author: "Jim Collins",
          description: "Por qué algunas empresas dan el salto... y otras no.",
          category: "Liderazgo",
          rating: 4.5,
          reading_time: "5h 30min",
          pages: 300,
          published_year: 2001,
          cover_url: "/books/good-to-great.jpg",
          tags: ["Liderazgo", "Empresa", "Excelencia"],
          progress: 0,
          is_recommended: true,
          difficulty: "Intermedio",
          key_topics: ["Liderazgo empresarial", "Transformación", "Excelencia"],
          bookmarks_count: 0,
          notes_count: 0,
          status: "not_started",
        },
        {
          id: "10",
          title: "La Semana Laboral de 4 Horas",
          author: "Timothy Ferriss",
          description: "Escapa de la rutina de 9-5, vive en cualquier lugar y únete a los nuevos ricos.",
          category: "Productividad",
          rating: 4.2,
          reading_time: "4h 50min",
          pages: 308,
          published_year: 2007,
          cover_url: "/books/4-hour-workweek.jpg",
          tags: ["Productividad", "Libertad", "Emprendimiento"],
          progress: 0,
          is_recommended: false,
          difficulty: "Intermedio",
          key_topics: ["Automatización", "Outsourcing", "Libertad financiera"],
          bookmarks_count: 0,
          notes_count: 0,
          status: "not_started",
        },
        {
          id: "11",
          title: "Conversaciones Cruciales",
          author: "Kerry Patterson",
          description: "Herramientas para hablar cuando las apuestas son altas.",
          category: "Habilidades Blandas",
          rating: 4.7,
          reading_time: "4h 15min",
          pages: 284,
          published_year: 2002,
          cover_url: "/books/crucial-conversations.jpg",
          tags: ["Comunicación", "Conversaciones", "Habilidades Blandas"],
          progress: 0,
          is_recommended: true,
          difficulty: "Intermedio",
          key_topics: ["Comunicación efectiva", "Resolución de conflictos", "Diálogo"],
          bookmarks_count: 0,
          notes_count: 0,
          status: "not_started",
        },
        {
          id: "12",
          title: "De Cero a Uno",
          author: "Peter Thiel",
          description: "Notas sobre startups, o cómo construir el futuro.",
          category: "Emprendimiento",
          rating: 4.4,
          reading_time: "3h 30min",
          pages: 224,
          published_year: 2014,
          cover_url: "/books/zero-to-one.jpg",
          tags: ["Emprendimiento", "Startup", "Innovación"],
          progress: 0,
          is_recommended: true,
          difficulty: "Avanzado",
          key_topics: ["Innovación", "Monopolios", "Tecnología"],
          bookmarks_count: 0,
          notes_count: 0,
          status: "not_started",
        },
      ]

      const mockStats: ReadingStats = {
        total_books: mockBooks.length,
        completed_books: mockBooks.filter((book) => book.status === "completed").length,
        in_progress_books: mockBooks.filter((book) => book.status === "in_progress").length,
        total_pages_read: mockBooks.reduce((sum, book) => sum + Math.floor((book.pages * book.progress) / 100), 0),
        total_time_spent: mockBooks.reduce((sum, book) => sum + (book.time_spent || 0), 0),
        current_streak: 12,
        level: 3,
        points: 1250,
      }

      setBooks(mockBooks)
      setReadingStats(mockStats)
      setLoading(false)
    } catch (error) {
      console.error("Error loading library data:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar la biblioteca. Intenta nuevamente.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const loadAIRecommendations = async () => {
    setLoadingRecommendations(true)
    try {
      const response = await fetch("/api/library-recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "demo-user",
          userLevel: 3,
          booksRead: 2,
          readingTime: 850,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setAiRecommendations(data.recommendations)
      }
    } catch (error) {
      console.error("Error loading AI recommendations:", error)
    } finally {
      setLoadingRecommendations(false)
    }
  }

  const filterBooks = () => {
    let filtered = books

    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((book) => book.category === selectedCategory)
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((book) => book.difficulty === selectedDifficulty)
    }

    setFilteredBooks(filtered)
  }

  const getCategories = () => {
    const categories = Array.from(new Set(books.map((book) => book.category)))
    return categories
  }

  const getDifficulties = () => {
    const difficulties = Array.from(new Set(books.map((book) => book.difficulty)))
    return difficulties
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatLastRead = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Ayer"
    if (diffDays < 7) return `Hace ${diffDays} días`
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`
    return `Hace ${Math.ceil(diffDays / 30)} meses`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in_progress":
        return <Play className="h-4 w-4 text-blue-600" />
      default:
        return <BookOpen className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "in_progress":
        return "En progreso"
      default:
        return "No iniciado"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando biblioteca...</p>
        </div>
      </div>
    )
  }

  const inProgressBooks = filteredBooks.filter((book) => book.status === "in_progress")
  const completedBooks = filteredBooks.filter((book) => book.status === "completed")
  const notStartedBooks = filteredBooks.filter((book) => book.status === "not_started")

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Biblioteca de Desarrollo Profesional</h1>
        <p className="text-gray-600">Expande tus conocimientos con libros especializados para tu carrera</p>
      </div>

      {/* Reading Stats */}
      {readingStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Libros Completados</p>
                  <p className="text-2xl font-bold text-green-600">{readingStats.completed_books}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Progreso</p>
                  <p className="text-2xl font-bold text-blue-600">{readingStats.in_progress_books}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Páginas Leídas</p>
                  <p className="text-2xl font-bold text-purple-600">{readingStats.total_pages_read.toLocaleString()}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Racha Actual</p>
                  <p className="text-2xl font-bold text-orange-600">{readingStats.current_streak} días</p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Recommendations */}
      {aiRecommendations.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Recomendaciones Personalizadas con IA
            </CardTitle>
            <CardDescription>
              Libros seleccionados específicamente para tu perfil y objetivos profesionales en Chile
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingRecommendations ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Generando recomendaciones con IA...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiRecommendations.map((recommendation, index) => (
                  <Card key={index} className="border-2 border-blue-100 hover:border-blue-200 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <img
                          src={recommendation.book.cover_url || "/placeholder.svg"}
                          alt={recommendation.book.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{recommendation.book.title}</h4>
                          <p className="text-xs text-gray-600 mb-2">{recommendation.book.author}</p>
                          <Badge className={getPriorityColor(recommendation.priority)}>
                            {recommendation.priority === "high"
                              ? "Alta Prioridad"
                              : recommendation.priority === "medium"
                                ? "Media Prioridad"
                                : "Baja Prioridad"}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">¿Por qué este libro?</p>
                          <p className="text-xs text-gray-600">{recommendation.reason}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Beneficio esperado:</p>
                          <p className="text-xs text-gray-600">{recommendation.expectedBenefit}</p>
                        </div>
                      </div>
                      <Link href={`/library/reader/${recommendation.book.id}`}>
                        <Button size="sm" className="w-full mt-3">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Comenzar Lectura
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar libros por título, autor o tema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {getCategories().map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Dificultad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las dificultades</SelectItem>
            {getDifficulties().map((difficulty) => (
              <SelectItem key={difficulty} value={difficulty}>
                {difficulty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Books Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos ({filteredBooks.length})</TabsTrigger>
          <TabsTrigger value="in_progress">En Progreso ({inProgressBooks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completados ({completedBooks.length})</TabsTrigger>
          <TabsTrigger value="not_started">Por Leer ({notStartedBooks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={book.cover_url || "/placeholder.svg"}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg leading-tight">{book.title}</h3>
                        {getStatusIcon(book.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm ml-1">{book.rating}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {book.difficulty}
                        </Badge>
                        {book.is_recommended && (
                          <Badge className="text-xs bg-blue-100 text-blue-800">Recomendado</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress Section */}
                  {book.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progreso</span>
                        <span className="text-sm text-gray-600">{book.progress}%</span>
                      </div>
                      <Progress value={book.progress} className="h-2 mb-2" />
                      {book.current_chapter && <p className="text-xs text-gray-600 mb-1">{book.current_chapter}</p>}
                      {book.last_read && (
                        <p className="text-xs text-gray-500">Última lectura: {formatLastRead(book.last_read)}</p>
                      )}
                    </div>
                  )}

                  {/* Reading Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">Tiempo</span>
                      </div>
                      <p className="text-sm font-medium">
                        {book.time_spent ? formatTime(book.time_spent) : book.reading_time}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Bookmark className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">Marcadores</span>
                      </div>
                      <p className="text-sm font-medium">{book.bookmarks_count || 0}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <StickyNote className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">Notas</span>
                      </div>
                      <p className="text-sm font-medium">{book.notes_count || 0}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{book.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {book.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Link href={`/library/reader/${book.id}`}>
                    <Button className="w-full">
                      {book.progress > 0 ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Continuar Leyendo
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Comenzar Lectura
                        </>
                      )}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="in_progress">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={book.cover_url || "/placeholder.svg"}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg leading-tight">{book.title}</h3>
                        <Play className="h-4 w-4 text-blue-600" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                      <Badge className="text-xs bg-blue-100 text-blue-800">En Progreso</Badge>
                    </div>
                  </div>

                  {/* Enhanced Progress Section */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progreso de Lectura</span>
                      <span className="text-sm font-bold text-blue-600">{book.progress}%</span>
                    </div>
                    <Progress value={book.progress} className="h-3 mb-3" />
                    <div className="space-y-1">
                      {book.current_chapter && (
                        <p className="text-xs text-gray-700 font-medium">{book.current_chapter}</p>
                      )}
                      {book.last_read && (
                        <p className="text-xs text-gray-500">Última lectura: {formatLastRead(book.last_read)}</p>
                      )}
                      {book.time_spent && (
                        <p className="text-xs text-gray-500">Tiempo invertido: {formatTime(book.time_spent)}</p>
                      )}
                    </div>
                  </div>

                  {/* Reading Activity */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Bookmark className="h-3 w-3 text-blue-600" />
                        <span className="text-xs text-blue-700">Marcadores</span>
                      </div>
                      <p className="text-sm font-bold text-blue-800">{book.bookmarks_count || 0}</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <StickyNote className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-700">Notas</span>
                      </div>
                      <p className="text-sm font-bold text-green-800">{book.notes_count || 0}</p>
                    </div>
                  </div>

                  <Link href={`/library/reader/${book.id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Play className="h-4 w-4 mr-2" />
                      Continuar Leyendo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={book.cover_url || "/placeholder.svg"}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg leading-tight">{book.title}</h3>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                      <Badge className="text-xs bg-green-100 text-green-800">Completado</Badge>
                    </div>
                  </div>

                  {/* Completion Stats */}
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">¡Libro Completado!</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div>
                        <p className="text-xs text-green-700">Tiempo Total</p>
                        <p className="text-sm font-bold text-green-800">{formatTime(book.time_spent || 0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-700">Páginas</p>
                        <p className="text-sm font-bold text-green-800">{book.pages}</p>
                      </div>
                    </div>
                  </div>

                  {/* Knowledge Captured */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Bookmark className="h-3 w-3 text-blue-600" />
                        <span className="text-xs text-blue-700">Marcadores</span>
                      </div>
                      <p className="text-sm font-bold text-blue-800">{book.bookmarks_count || 0}</p>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <StickyNote className="h-3 w-3 text-purple-600" />
                        <span className="text-xs text-purple-700">Notas</span>
                      </div>
                      <p className="text-sm font-bold text-purple-800">{book.notes_count || 0}</p>
                    </div>
                  </div>

                  <Link href={`/library/reader/${book.id}`}>
                    <Button variant="outline" className="w-full bg-transparent">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Revisar Contenido
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="not_started">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notStartedBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={book.cover_url || "/placeholder.svg"}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg leading-tight">{book.title}</h3>
                        {book.is_recommended && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {book.difficulty}
                        </Badge>
                        {book.is_recommended && (
                          <Badge className="text-xs bg-yellow-100 text-yellow-800">Recomendado</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">Duración</span>
                      </div>
                      <p className="text-sm font-medium">{book.reading_time}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <BookOpen className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">Páginas</span>
                      </div>
                      <p className="text-sm font-medium">{book.pages}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{book.description}</p>

                  {/* Key Topics */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Temas clave:</p>
                    <div className="flex flex-wrap gap-1">
                      {book.key_topics.slice(0, 3).map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Link href={`/library/reader/${book.id}`}>
                    <Button className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Comenzar Lectura
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
