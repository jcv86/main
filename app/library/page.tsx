"use client"

import { useState, useEffect } from "react"
import { Search, BookOpen, Clock, Star, TrendingUp, Award, Target, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getBooksWithProgress,
  getRecommendedBooks,
  getReadingStats,
  validateBookCoverUrl,
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
  const [selectedStatus, setSelectedStatus] = useState("all")
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
          book.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
          book.key_topics.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase())),
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

    // Filter by reading status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((book) => book.reading_status === selectedStatus)
    }

    setFilteredBooks(filtered)
  }, [books, searchQuery, selectedCategory, selectedDifficulty, selectedStatus])

  const categories = Array.from(new Set(books.map((book) => book.category)))
  const difficulties = Array.from(new Set(books.map((book) => book.difficulty)))

  const handleImageError = (bookId: string) => {
    setImageErrors((prev) => new Set(prev).add(bookId))
  }

  const getImageSrc = (book: BookWithProgress) => {
    if (imageErrors.has(book.id)) {
      return validateBookCoverUrl(book.id)
    }
    return book.cover_url || validateBookCoverUrl(book.id)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Principiante":
        return "bg-green-100 text-green-800 border-green-200"
      case "Intermedio":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Avanzado":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reading":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "paused":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedDifficulty("all")
    setSelectedStatus("all")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Books Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="p-0">
                <Skeleton className="aspect-[3/4] w-full rounded-t-lg" />
              </CardHeader>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-24 mb-4" />
                <div className="flex gap-1 mb-4">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
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
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Libros</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readingStats.total_books}</div>
              <p className="text-xs text-muted-foreground">libros disponibles</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{readingStats.books_in_progress}</div>
              <p className="text-xs text-muted-foreground">libros leyendo</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completados</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{readingStats.books_completed}</div>
              <p className="text-xs text-muted-foreground">libros terminados</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {Math.floor(readingStats.total_reading_time / 60)}h
              </div>
              <p className="text-xs text-muted-foreground">tiempo de lectura</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">Todos los Libros</TabsTrigger>
          <TabsTrigger value="recommended">Recomendados para Ti</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar libros, autores, temas o conceptos clave..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
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
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="not_started">No iniciado</SelectItem>
                    <SelectItem value="reading">Leyendo</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="paused">Pausado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery ||
              selectedCategory !== "all" ||
              selectedDifficulty !== "all" ||
              selectedStatus !== "all") && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Filtros activos:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    <Search className="h-3 w-3" />"{searchQuery}"
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    <Filter className="h-3 w-3" />
                    {selectedCategory}
                  </Badge>
                )}
                {selectedDifficulty !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    <Filter className="h-3 w-3" />
                    {selectedDifficulty}
                  </Badge>
                )}
                {selectedStatus !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    <Filter className="h-3 w-3" />
                    {getStatusText(selectedStatus)}
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="p-0">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                    <Image
                      src={getImageSrc(book) || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={() => handleImageError(book.id)}
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      <Badge className={getDifficultyColor(book.difficulty)} variant="outline">
                        {book.difficulty}
                      </Badge>
                      {book.is_recommended && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Star className="h-3 w-3 mr-1" />
                          Recomendado
                        </Badge>
                      )}
                    </div>
                    {book.progress > 0 && (
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2">
                          <div className="flex items-center justify-between text-white text-xs mb-1">
                            <span>Progreso</span>
                            <span>{book.progress}%</span>
                          </div>
                          <Progress value={book.progress} className="h-1 bg-white/20" />
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-1">{book.title}</h3>
                        <p className="text-xs text-gray-600">{book.author}</p>
                      </div>
                      <div className="flex items-center ml-2">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">{book.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{book.reading_time}</span>
                      </div>
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
                      <Badge className={getStatusColor(book.reading_status)} variant="outline">
                        {getStatusText(book.reading_status)}
                      </Badge>
                      <Link href={`/library/reader/${book.id}`}>
                        <Button size="sm" className="text-xs">
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
              <p className="text-gray-600 mb-4">
                Intenta ajustar tus filtros de búsqueda o explora diferentes categorías.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommended" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Libros Recomendados para Ti</h2>
            <p className="text-gray-600">
              Basado en tu perfil profesional, objetivos de carrera y el mercado laboral chileno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendedBooks.map((book) => (
              <Card key={book.id} className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="p-0">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                    <Image
                      src={getImageSrc(book) || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={() => handleImageError(book.id)}
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      <Badge className={getDifficultyColor(book.difficulty)} variant="outline">
                        {book.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        <Star className="h-3 w-3 mr-1" />
                        Recomendado
                      </Badge>
                    </div>
                    {book.progress > 0 && (
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2">
                          <div className="flex items-center justify-between text-white text-xs mb-1">
                            <span>Progreso</span>
                            <span>{book.progress}%</span>
                          </div>
                          <Progress value={book.progress} className="h-1 bg-white/20" />
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-1">{book.title}</h3>
                        <p className="text-xs text-gray-600">{book.author}</p>
                      </div>
                      <div className="flex items-center ml-2">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">{book.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2">{book.description}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{book.reading_time}</span>
                      </div>
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
                      <Badge className={getStatusColor(book.reading_status)} variant="outline">
                        {getStatusText(book.reading_status)}
                      </Badge>
                      <Link href={`/library/reader/${book.id}`}>
                        <Button size="sm" className="text-xs">
                          {book.progress > 0 ? "Continuar" : "Comenzar"}
                        </Button>
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
              <p className="text-gray-600 mb-4">
                Completa tu perfil profesional y realiza algunas evaluaciones para recibir recomendaciones
                personalizadas.
              </p>
              <div className="flex gap-2 justify-center">
                <Link href="/profile">
                  <Button variant="outline">Completar Perfil</Button>
                </Link>
                <Link href="/skills-assessment">
                  <Button>Hacer Evaluación</Button>
                </Link>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
