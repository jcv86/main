"use client"

import { useState, useEffect } from "react"
import { Search, BookOpen, Clock, Star, TrendingUp, Award, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getBooksWithProgress,
  getRecommendedBooks,
  getReadingStats,
  type BookWithProgress,
} from "@/lib/supabase-library"
import Link from "next/link"
import Image from "next/image"

export default function LibraryPage() {
  const [books, setBooks] = useState<BookWithProgress[]>([])
  const [recommendedBooks, setRecommendedBooks] = useState<BookWithProgress[]>([])
  const [filteredBooks, setFilteredBooks] = useState<BookWithProgress[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [readingStats, setReadingStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  const userId = "00000000-0000-0000-0000-000000000000" // Demo user ID

  useEffect(() => {
    loadLibraryData()
  }, [])

  const loadLibraryData = async () => {
    try {
      setLoading(true)

      // Load all data in parallel
      const [booksResult, recommendedResult, statsResult] = await Promise.all([
        getBooksWithProgress(userId),
        getRecommendedBooks(userId),
        getReadingStats(userId),
      ])

      if (booksResult.data) {
        setBooks(booksResult.data)
        setFilteredBooks(booksResult.data)
      }

      if (recommendedResult.data) {
        setRecommendedBooks(recommendedResult.data)
      }

      if (statsResult.data) {
        setReadingStats(statsResult.data)
      }
    } catch (error) {
      console.error("Error loading library data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = books

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((book) => book.category === selectedCategory)
    }

    // Filter by difficulty
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((book) => book.difficulty === selectedDifficulty)
    }

    setFilteredBooks(filtered)
  }, [books, searchQuery, selectedCategory, selectedDifficulty])

  const categories = Array.from(new Set(books.map((book) => book.category)))
  const difficulties = Array.from(new Set(books.map((book) => book.difficulty)))

  const handleImageError = (bookId: string) => {
    setImageErrors((prev) => new Set(prev).add(bookId))
  }

  const getImageSrc = (book: BookWithProgress) => {
    if (imageErrors.has(book.id)) {
      return `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(book.title)}`
    }
    return book.cover_url
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Principiante":
        return "bg-green-100 text-green-800"
      case "Intermedio":
        return "bg-yellow-100 text-yellow-800"
      case "Avanzado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reading":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "reading":
        return "Leyendo"
      case "completed":
        return "Completado"
      case "paused":
        return "Pausado"
      default:
        return "No iniciado"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando biblioteca...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Biblioteca</h1>
        <p className="text-gray-600">Explora y gestiona tu colección de libros de desarrollo profesional</p>
      </div>

      {/* Reading Stats */}
      {readingStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Libros</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readingStats.total_books}</div>
              <p className="text-xs text-muted-foreground">libros disponibles</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readingStats.books_in_progress}</div>
              <p className="text-xs text-muted-foreground">libros leyendo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completados</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readingStats.books_completed}</div>
              <p className="text-xs text-muted-foreground">libros terminados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor(readingStats.total_reading_time / 60)}h</div>
              <p className="text-xs text-muted-foreground">tiempo de lectura</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">Todos los Libros</TabsTrigger>
          <TabsTrigger value="recommended">Recomendados</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar libros, autores o temas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
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
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full sm:w-[180px]">
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
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="group hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="p-0">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                    <Image
                      src={getImageSrc(book) || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={() => handleImageError(book.id)}
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge className={getDifficultyColor(book.difficulty)}>{book.difficulty}</Badge>
                      {book.is_recommended && (
                        <Badge variant="secondary">
                          <Star className="h-3 w-3 mr-1" />
                          Recomendado
                        </Badge>
                      )}
                    </div>
                    {book.progress > 0 && (
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black/50 rounded-lg p-2">
                          <div className="flex items-center justify-between text-white text-xs mb-1">
                            <span>Progreso</span>
                            <span>{book.progress}%</span>
                          </div>
                          <Progress value={book.progress} className="h-1" />
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm leading-tight line-clamp-2">{book.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{book.author}</p>
                      </div>
                      <div className="flex items-center ml-2">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">{book.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{book.reading_time}</span>
                      <span>{book.pages} páginas</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {book.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {book.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{book.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Badge className={getStatusColor(book.reading_status)}>
                        {getStatusText(book.reading_status)}
                      </Badge>
                      <Link href={`/library/reader/${book.id}`}>
                        <Button size="sm" variant="outline">
                          {book.progress > 0 ? "Continuar" : "Leer"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron libros</h3>
              <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda o explora diferentes categorías.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommended" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Libros Recomendados para Ti</h2>
            <p className="text-gray-600">
              Basado en tu perfil profesional y objetivos de carrera en el mercado chileno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendedBooks.map((book) => (
              <Card key={book.id} className="group hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="p-0">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                    <Image
                      src={getImageSrc(book) || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={() => handleImageError(book.id)}
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge className={getDifficultyColor(book.difficulty)}>{book.difficulty}</Badge>
                      <Badge variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        Recomendado
                      </Badge>
                    </div>
                    {book.progress > 0 && (
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black/50 rounded-lg p-2">
                          <div className="flex items-center justify-between text-white text-xs mb-1">
                            <span>Progreso</span>
                            <span>{book.progress}%</span>
                          </div>
                          <Progress value={book.progress} className="h-1" />
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm leading-tight line-clamp-2">{book.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{book.author}</p>
                      </div>
                      <div className="flex items-center ml-2">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">{book.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2">{book.description}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{book.reading_time}</span>
                      <span>{book.pages} páginas</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {book.key_topics.slice(0, 2).map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {book.key_topics.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{book.key_topics.length - 2}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Badge className={getStatusColor(book.reading_status)}>
                        {getStatusText(book.reading_status)}
                      </Badge>
                      <Link href={`/library/reader/${book.id}`}>
                        <Button size="sm">{book.progress > 0 ? "Continuar" : "Comenzar"}</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {recommendedBooks.length === 0 && (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recomendaciones disponibles</h3>
              <p className="text-gray-600">
                Completa tu perfil profesional para recibir recomendaciones personalizadas.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
