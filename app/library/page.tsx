"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BookOpen,
  Clock,
  Star,
  Search,
  TrendingUp,
  Award,
  Zap,
  Users,
  BookMarked,
  Library,
  Flame,
  Brain,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"
import { LibraryService } from "@/lib/supabase-library"

interface Book {
  id: string
  title: string
  author: string
  description: string
  category: string
  rating?: number
  reading_time?: string
  pages?: number
  published_year?: number
  cover_url?: string
  cover_image?: string
  tags?: string[]
  is_recommended?: boolean
  difficulty: "Fácil" | "Intermedio" | "Avanzado" | "Principiante"
  key_topics?: string[]
  estimated_reading_time?: number
}

interface UserProgress {
  book_id: string
  percentage: number
  current_page: number
  total_pages: number
  last_read_at: string
}

interface UserStats {
  books_read: number
  total_reading_time: number
  reading_streak: number
  points: number
  level: number
}

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch books from database
  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch books from database
        const booksData = await LibraryService.getBooks()

        // Normalize book data to ensure all required fields exist
        const normalizedBooks = (booksData || []).map((book) => ({
          ...book,
          rating: book.rating || 4.0,
          reading_time:
            book.reading_time ||
            `${Math.ceil((book.estimated_reading_time || 240) / 60)}h ${(book.estimated_reading_time || 240) % 60}min`,
          pages: book.pages || Math.ceil((book.estimated_reading_time || 240) * 2.5),
          published_year: book.published_year || 2020,
          cover_url:
            book.cover_url ||
            book.cover_image ||
            "/placeholder.svg?height=400&width=300&text=Book&bg=3b82f6&color=white",
          tags: book.tags || ["Desarrollo", "Carrera"],
          is_recommended: book.is_recommended || false,
          key_topics: book.key_topics || ["Desarrollo Personal", "Productividad"],
          difficulty: (book.difficulty === "Principiante" ? "Fácil" : book.difficulty) as
            | "Fácil"
            | "Intermedio"
            | "Avanzado",
        }))

        setBooks(normalizedBooks)

        // Mock user progress and stats for now (would come from user session)
        const mockProgress: UserProgress[] = []
        const mockStats: UserStats = {
          books_read: 0,
          total_reading_time: 0,
          reading_streak: 0,
          points: 0,
          level: 1,
        }

        setUserProgress(mockProgress)
        setUserStats(mockStats)
      } catch (err) {
        console.error("Error fetching library data:", err)
        setError("Error al cargar la biblioteca. Por favor, intenta de nuevo.")

        // Set empty arrays as fallback
        setBooks([])
        setUserProgress([])
        setUserStats({
          books_read: 0,
          total_reading_time: 0,
          reading_streak: 0,
          points: 0,
          level: 1,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLibraryData()
  }, [])

  const getProgressForBook = (bookId: string) => {
    return userProgress.find((p) => p.book_id === bookId)
  }

  const filteredBooks = (books || []).filter((book) => {
    if (!book) return false

    const matchesSearch =
      (book.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.author || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.tags || []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (book.key_topics || []).some((topic) => topic.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || book.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getBooksByStatus = (status: "reading" | "completed" | "not-started") => {
    return (filteredBooks || []).filter((book) => {
      if (!book) return false

      const progress = getProgressForBook(book.id)
      if (status === "reading") return progress && progress.percentage > 0 && progress.percentage < 100
      if (status === "completed") return progress && progress.percentage >= 100
      if (status === "not-started") return !progress || progress.percentage === 0
      return false
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-100 text-green-800 border-green-200"
      case "Intermedio":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Avanzado":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Productividad":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Liderazgo":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Desarrollo Personal":
        return "bg-pink-100 text-pink-800 border-pink-200"
      case "Comunicación":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "Emprendimiento":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Habilidades Blandas":
        return "bg-teal-100 text-teal-800 border-teal-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatReadingTime = (minutes: number) => {
    if (!minutes || minutes === 0) return "0min"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  const getStatusBadge = (book: Book) => {
    const progress = getProgressForBook(book.id)
    if (!progress || progress.percentage === 0) {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
          <Zap className="w-3 h-3 mr-1" />
          Por leer
        </Badge>
      )
    }
    if (progress.percentage >= 100) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <Award className="w-3 h-3 mr-1" />
          Completado
        </Badge>
      )
    }
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
        <BookOpen className="w-3 h-3 mr-1" />
        Leyendo
      </Badge>
    )
  }

  const getActionButton = (book: Book) => {
    const progress = getProgressForBook(book.id)
    if (!progress || progress.percentage === 0) {
      return (
        <Button asChild className="w-full">
          <Link href={`/library/reader/${book.id}`}>
            <BookOpen className="w-4 h-4 mr-2" />
            Comenzar a leer
          </Link>
        </Button>
      )
    }
    if (progress.percentage >= 100) {
      return (
        <Button asChild variant="outline" className="w-full bg-transparent">
          <Link href={`/library/reader/${book.id}`}>
            <BookMarked className="w-4 h-4 mr-2" />
            Releer
          </Link>
        </Button>
      )
    }
    return (
      <Button asChild className="w-full">
        <Link href={`/library/reader/${book.id}`}>
          <TrendingUp className="w-4 h-4 mr-2" />
          Continuar ({progress.percentage}%)
        </Link>
      </Button>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-sm border-0">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Error al cargar la biblioteca</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-red-200 hover:bg-red-50"
            >
              Intentar de nuevo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
            <Library className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Biblioteca de Desarrollo
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Descubre libros cuidadosamente seleccionados para impulsar tu carrera y desarrollo personal
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2">
            <Brain className="w-4 h-4 mr-2" />
            Integrado con Mirix Memory
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Lightbulb className="w-4 h-4 mr-2" />
            Captura insights mientras lees
          </Badge>
        </div>
      </div>

      {/* User Stats */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500 rounded-full shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Libros Leídos</p>
                  <p className="text-2xl font-bold text-blue-900">{userStats.books_read}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-500 rounded-full shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Tiempo Total</p>
                  <p className="text-2xl font-bold text-green-900">{formatReadingTime(userStats.total_reading_time)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-500 rounded-full shadow-lg">
                  <Flame className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-600">Racha de Lectura</p>
                  <p className="text-2xl font-bold text-orange-900">{userStats.reading_streak} días</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500 rounded-full shadow-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Nivel {userStats.level}</p>
                  <p className="text-2xl font-bold text-purple-900">{userStats.points} pts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card className="shadow-sm border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por título, autor, etiquetas o temas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 border-gray-200">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="Productividad">📈 Productividad</SelectItem>
                <SelectItem value="Liderazgo">👑 Liderazgo</SelectItem>
                <SelectItem value="Desarrollo Personal">🌱 Desarrollo Personal</SelectItem>
                <SelectItem value="Comunicación">💬 Comunicación</SelectItem>
                <SelectItem value="Emprendimiento">🚀 Emprendimiento</SelectItem>
                <SelectItem value="Habilidades Blandas">🤝 Habilidades Blandas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full md:w-48 border-gray-200">
                <SelectValue placeholder="Dificultad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las dificultades</SelectItem>
                <SelectItem value="Fácil">🟢 Fácil</SelectItem>
                <SelectItem value="Intermedio">🟡 Intermedio</SelectItem>
                <SelectItem value="Avanzado">🔴 Avanzado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Books Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger
            value="all"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
          >
            <BookOpen className="h-4 w-4" />
            Todos ({(filteredBooks || []).length})
          </TabsTrigger>
          <TabsTrigger
            value="reading"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
          >
            <TrendingUp className="h-4 w-4" />
            Leyendo ({getBooksByStatus("reading").length})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
          >
            <Award className="h-4 w-4" />
            Completados ({getBooksByStatus("completed").length})
          </TabsTrigger>
          <TabsTrigger
            value="not-started"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
          >
            <Zap className="h-4 w-4" />
            Por Leer ({getBooksByStatus("not-started").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {(filteredBooks || []).length === 0 ? (
            <Card className="shadow-sm border-0">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay libros disponibles</h3>
                <p className="text-gray-600 mb-4">
                  {books.length === 0
                    ? "La biblioteca está vacía. Los libros se añadirán próximamente."
                    : "No se encontraron libros que coincidan con los filtros seleccionados."}
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedDifficulty("all")
                  }}
                  variant="outline"
                  className="border-gray-200 hover:bg-gray-50"
                >
                  Limpiar filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => {
                if (!book) return null

                const progress = getProgressForBook(book.id)
                return (
                  <Card
                    key={book.id}
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md bg-white"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-2">
                          <Badge className={getCategoryColor(book.category || "Desarrollo")}>
                            {book.category || "Desarrollo"}
                          </Badge>
                          <Badge className={getDifficultyColor(book.difficulty || "Intermedio")}>
                            {book.difficulty || "Intermedio"}
                          </Badge>
                        </div>
                        {book.is_recommended && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Top
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {book.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        por {book.author} • {book.published_year || 2020}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">{book.description}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{book.rating || 4.0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{book.reading_time || "4h"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{book.pages || 200}p</span>
                        </div>
                      </div>

                      {progress && progress.percentage > 0 && (
                        <div className="space-y-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 font-medium">Progreso de lectura</span>
                            <span className="font-bold text-blue-600">{progress.percentage}%</span>
                          </div>
                          <Progress value={progress.percentage} className="h-2 bg-blue-100" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>
                              Página {progress.current_page} de {progress.total_pages}
                            </span>
                            <span>Última lectura: {new Date(progress.last_read_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700">Temas clave:</p>
                        <div className="flex flex-wrap gap-1">
                          {(book.key_topics || ["Desarrollo Personal"]).slice(0, 3).map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs bg-gray-50">
                              {topic}
                            </Badge>
                          ))}
                          {(book.key_topics || []).length > 3 && (
                            <Badge variant="outline" className="text-xs bg-gray-50">
                              +{(book.key_topics || []).length - 3} más
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">{getActionButton(book)}</div>

                      <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                        {getStatusBadge(book)}
                        <div className="flex gap-1">
                          {(book.tags || ["Desarrollo"]).slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reading">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getBooksByStatus("reading").length === 0 ? (
              <div className="col-span-full">
                <Card className="shadow-sm border-0">
                  <CardContent className="p-12 text-center">
                    <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay libros en progreso</h3>
                    <p className="text-gray-600">Comienza a leer un libro para verlo aquí.</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              getBooksByStatus("reading").map((book) => {
                if (!book) return null

                const progress = getProgressForBook(book.id)!
                return (
                  <Card
                    key={book.id}
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-white"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          <BookOpen className="w-3 h-3 mr-1" />
                          En Progreso
                        </Badge>
                        <Badge className={getDifficultyColor(book.difficulty || "Intermedio")}>
                          {book.difficulty || "Intermedio"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {book.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">por {book.author}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 font-medium">Progreso de lectura</span>
                          <span className="font-bold text-blue-600">{progress.percentage}%</span>
                        </div>
                        <Progress value={progress.percentage} className="h-3 bg-blue-100" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>
                            Página {progress.current_page} de {progress.total_pages}
                          </span>
                          <span>Última lectura: {new Date(progress.last_read_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{book.rating || 4.0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{book.reading_time || "4h"}</span>
                        </div>
                      </div>

                      <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 shadow-md">
                        <Link href={`/library/reader/${book.id}`}>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Continuar Leyendo
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getBooksByStatus("completed").length === 0 ? (
              <div className="col-span-full">
                <Card className="shadow-sm border-0">
                  <CardContent className="p-12 text-center">
                    <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay libros completados</h3>
                    <p className="text-gray-600">Completa la lectura de un libro para verlo aquí.</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              getBooksByStatus("completed").map((book) => {
                if (!book) return null

                const progress = getProgressForBook(book.id)!
                return (
                  <Card
                    key={book.id}
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-green-200 bg-gradient-to-br from-green-50/50 to-white"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <Award className="w-3 h-3 mr-1" />
                          Completado
                        </Badge>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-medium">{book.rating || 4.0}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-green-600 transition-colors">
                        {book.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">por {book.author}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                        <div className="text-sm text-green-800 space-y-1">
                          <p className="font-medium flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Lectura completada
                          </p>
                          <p>Finalizado: {new Date(progress.last_read_at).toLocaleDateString()}</p>
                          <p>Páginas leídas: {progress.total_pages}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700">Temas dominados:</p>
                        <div className="flex flex-wrap gap-1">
                          {(book.key_topics || ["Desarrollo Personal"]).slice(0, 4).map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs bg-green-50 border-green-200">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          asChild
                          variant="outline"
                          className="flex-1 bg-transparent border-green-200 hover:bg-green-50"
                        >
                          <Link href={`/library/reader/${book.id}`}>
                            <BookMarked className="w-4 h-4 mr-2" />
                            Releer
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-3 bg-transparent border-green-200 hover:bg-green-50"
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="not-started">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getBooksByStatus("not-started").length === 0 ? (
              <div className="col-span-full">
                <Card className="shadow-sm border-0">
                  <CardContent className="p-12 text-center">
                    <Zap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay libros por leer</h3>
                    <p className="text-gray-600">Todos los libros disponibles ya han sido iniciados.</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              getBooksByStatus("not-started").map((book) => {
                if (!book) return null

                return (
                  <Card
                    key={book.id}
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md bg-white"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-2">
                          <Badge className={getCategoryColor(book.category || "Desarrollo")}>
                            {book.category || "Desarrollo"}
                          </Badge>
                          <Badge className={getDifficultyColor(book.difficulty || "Intermedio")}>
                            {book.difficulty || "Intermedio"}
                          </Badge>
                        </div>
                        {book.is_recommended && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Recomendado
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {book.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        por {book.author} • {book.published_year || 2020}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">{book.description}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{book.rating || 4.0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{book.reading_time || "4h"}</span>
                        </div>
                        <span>{book.pages || 200} páginas</span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700">Aprenderás sobre:</p>
                        <div className="flex flex-wrap gap-1">
                          {(book.key_topics || ["Desarrollo Personal"]).slice(0, 3).map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs bg-gray-50">
                              {topic}
                            </Badge>
                          ))}
                          {(book.key_topics || []).length > 3 && (
                            <Badge variant="outline" className="text-xs bg-gray-50">
                              +{(book.key_topics || []).length - 3} más
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button asChild className="w-full shadow-md">
                        <Link href={`/library/reader/${book.id}`}>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Comenzar a Leer
                        </Link>
                      </Button>

                      <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                          <Zap className="w-3 h-3 mr-1" />
                          Listo para comenzar
                        </Badge>
                        <div className="flex gap-1">
                          {(book.tags || ["Desarrollo"]).slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
