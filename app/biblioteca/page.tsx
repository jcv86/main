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
import {
  BookOpen,
  Clock,
  User,
  Star,
  Search,
  Filter,
  Bookmark,
  TrendingUp,
  Target,
  Award,
  BarChart3,
  Users,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  BookmarkIcon,
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

      // Cargar libros desde la base de datos
      const response = await fetch("/api/books")
      if (response.ok) {
        const booksData = await response.json()

        // Transformar los datos para incluir campos calculados
        const transformedBooks = booksData.map((book: any) => ({
          ...book,
          pages: Math.ceil(book.content.length / 200), // Estimar páginas basado en la longitud del contenido
          reading_time: Math.ceil(book.content.length / 1000), // Estimar tiempo de lectura
          characters: book.content.length,
        }))

        setBooks(transformedBooks)

        // Calcular estadísticas
        const mockStats: LibraryStats = {
          total_books: transformedBooks.length,
          categories: new Set(transformedBooks.map((b: Book) => b.category)).size,
          authors: new Set(transformedBooks.map((b: Book) => b.author)).size,
          total_reads: transformedBooks.reduce((sum: number, book: Book) => sum + book.read_count, 0),
          avg_characters: Math.round(
            transformedBooks.reduce((sum: number, book: Book) => sum + book.characters, 0) / transformedBooks.length,
          ),
        }
        setStats(mockStats)
      }

      // Cargar progreso del usuario y marcadores
      await loadUserData()
    } catch (error) {
      console.error("Error cargando datos de la biblioteca:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar la biblioteca. Usando datos de ejemplo.",
        variant: "destructive",
      })

      // Datos de respaldo de ejemplo
      loadExampleData()
    } finally {
      setLoading(false)
    }
  }

  const loadUserData = async () => {
    // Cargar progreso de lectura del usuario
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
    setBookmarks([1, 3, 5])
  }

  const loadExampleData = () => {
    const exampleBooks: Book[] = [
      {
        id: 1,
        title: "Trabajo Profundo: Reglas para el Éxito Enfocado en un Mundo Distraído",
        author: "Cal Newport",
        category: "Productividad",
        content:
          "El trabajo profundo son actividades profesionales realizadas en un estado de concentración libre de distracciones que llevan las capacidades cognitivas al límite. Estos esfuerzos crean nuevo valor, mejoran tu habilidad, y son difíciles de replicar...",
        tags: ["productividad", "enfoque", "concentración"],
        slug: "trabajo-profundo-exito-enfocado",
        read_count: 1247,
        created_at: "2024-01-15",
        updated_at: "2024-01-20",
        pages: 45,
        reading_time: 180,
        characters: 8950,
      },
      {
        id: 2,
        title: "Hábitos Atómicos: Una Manera Fácil y Comprobada de Construir Buenos Hábitos",
        author: "James Clear",
        category: "Desarrollo Personal",
        content:
          "Los cambios que parecen pequeños e insignificantes al principio se convertirán en resultados extraordinarios si estás dispuesto a mantenerlos durante años...",
        tags: ["hábitos", "cambio de comportamiento", "automejora"],
        slug: "habitos-atomicos-construir-buenos",
        read_count: 2156,
        created_at: "2024-01-10",
        updated_at: "2024-01-18",
        pages: 38,
        reading_time: 152,
        characters: 7600,
      },
    ]

    setBooks(exampleBooks)

    const exampleStats: LibraryStats = {
      total_books: exampleBooks.length,
      categories: new Set(exampleBooks.map((b) => b.category)).size,
      authors: new Set(exampleBooks.map((b) => b.author)).size,
      total_reads: exampleBooks.reduce((sum, book) => sum + book.read_count, 0),
      avg_characters: Math.round(exampleBooks.reduce((sum, book) => sum + book.characters, 0) / exampleBooks.length),
    }
    setStats(exampleStats)
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 Biblioteca de Desarrollo Profesional</h1>
          <p className="text-lg text-gray-600">
            Explora, aprende y crece con nuestra colección completa de libros de desarrollo profesional
          </p>
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
                <div className="text-2xl font-bold text-gray-900">{stats.total_reads}</div>
                <div className="text-sm text-gray-600">Total Lecturas</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold text-gray-900">{stats.avg_characters}</div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBooks.map((book) => {
                const progress = getBookProgress(book.id)
                return (
                  <Card key={book.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{book.title}</CardTitle>
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
                            {book.read_count} lecturas
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart3 className="h-4 w-4" />
                            {book.characters} chars
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
          </TabsContent>

          {/* Pestaña Populares */}
          <TabsContent value="populares">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">📈 Libros Más Populares</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books
                  .sort((a, b) => b.read_count - a.read_count)
                  .slice(0, 6)
                  .map((book, index) => {
                    const progress = getBookProgress(book.id)
                    return (
                      <Card key={book.id} className="relative">
                        <div className="absolute -top-2 -left-2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg">{book.title}</CardTitle>
                          <CardDescription>{book.author}</CardDescription>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{book.category}</Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Star className="h-4 w-4 text-yellow-500" />
                              {book.read_count} lecturas
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

              {/* Objetivos de Lectura */}
              <Card>
                <CardHeader>
                  <CardTitle>Objetivos de Lectura</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <div className="text-2xl font-bold text-blue-900">3</div>
                        <div className="text-sm text-blue-700">Libros este mes</div>
                        <div className="text-xs text-blue-600 mt-1">2/3 completados</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <div className="text-2xl font-bold text-green-900">30</div>
                        <div className="text-sm text-green-700">Min por día</div>
                        <div className="text-xs text-green-600 mt-1">25/30 promedio</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <div className="text-2xl font-bold text-purple-900">10</div>
                        <div className="text-sm text-purple-700">Páginas por día</div>
                        <div className="text-xs text-purple-600 mt-1">8/10 promedio</div>
                      </div>
                    </div>
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
