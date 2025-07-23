"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Search, Filter, Clock, User, Star, TrendingUp, Award, Play, CheckCircle, Gift } from "lucide-react"
import Link from "next/link"
import { getLibraryBooks } from "@/lib/database"
import { useEffect } from "react"

interface Book {
  id: string
  title: string
  author: string
  description: string
  category: string
  rating: number
  readingTime: string
  pages: number
  publishedYear: number
  coverUrl: string
  tags: string[]
  progress: number
  isRecommended: boolean
  difficulty: string
  keyTopics: string[]
  isFree?: boolean
}

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recommended")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const { data } = await getLibraryBooks()
        if (data) {
          // Mark "Los 7 Hábitos" as free
          const booksWithFree = data.map((book: Book) => ({
            ...book,
            isFree: book.title.includes("7 Habits") || book.title.includes("7 Hábitos"),
          }))
          setBooks(booksWithFree)
        }
      } catch (error) {
        console.error("Error loading books:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBooks()
  }, [])

  const categories = Array.from(new Set(books.map((book) => book.category)))
  const difficulties = Array.from(new Set(books.map((book) => book.difficulty)))

  const filteredAndSortedBooks = useMemo(() => {
    let filtered = books

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query) ||
          book.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          book.keyTopics.some((topic) => topic.toLowerCase().includes(query)),
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((book) => book.category === selectedCategory)
    }

    // Apply difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((book) => book.difficulty === selectedDifficulty)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recommended":
          return b.isRecommended ? 1 : -1
        case "rating":
          return b.rating - a.rating
        case "title":
          return a.title.localeCompare(b.title)
        case "author":
          return a.author.localeCompare(b.author)
        case "newest":
          return b.publishedYear - a.publishedYear
        case "progress":
          return b.progress - a.progress
        default:
          return 0
      }
    })

    return filtered
  }, [books, searchQuery, selectedCategory, selectedDifficulty, sortBy])

  // Get only top 3 recommended books for the recommendation section
  const topRecommendedBooks = useMemo(() => {
    return books
      .filter((book) => book.isRecommended)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3)
  }, [books])

  const stats = {
    totalBooks: books.length,
    completedBooks: books.filter((book) => book.progress === 100).length,
    inProgressBooks: books.filter((book) => book.progress > 0 && book.progress < 100).length,
    averageRating: books.reduce((acc, book) => acc + book.rating, 0) / books.length || 0,
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Biblioteca de Desarrollo Profesional</h1>
        </div>
        <p className="text-gray-600">
          Descubre libros cuidadosamente seleccionados para impulsar tu crecimiento profesional y personal.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Libros</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Libros Completados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedBooks}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Progreso</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgressBooks}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Play className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Calificación Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Recommendations Section - Limited to 3 books */}
      {topRecommendedBooks.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Libros Recomendados para Ti
            </CardTitle>
            <CardDescription>
              Nuestras mejores recomendaciones basadas en tu perfil y objetivos profesionales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {topRecommendedBooks.map((book) => (
                <Card key={book.id} className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {book.category}
                      </Badge>
                      <div className="flex items-center gap-2">
                        {book.isFree && (
                          <Badge variant="default" className="bg-green-600 text-white text-xs">
                            <Gift className="w-3 h-3 mr-1" />
                            GRATIS
                          </Badge>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{book.rating}</span>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">por {book.author}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{book.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-600">{book.readingTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">{book.difficulty}</span>
                      </div>
                    </div>

                    {book.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progreso</span>
                          <span>{book.progress}%</span>
                        </div>
                        <Progress value={book.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Link href={`/library/reader/${book.id}`} className="flex-1">
                        <Button className="w-full">
                          <BookOpen className="h-4 w-4 mr-2" />
                          {book.progress > 0 ? "Continuar Leyendo" : "Comenzar a Leer"}
                        </Button>
                      </Link>
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <Award className="h-4 w-4 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Buscar y Filtrar Libros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por título, autor, tema..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Dificultad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Dificultades</SelectItem>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recomendados</SelectItem>
                <SelectItem value="rating">Calificación</SelectItem>
                <SelectItem value="title">Título</SelectItem>
                <SelectItem value="author">Autor</SelectItem>
                <SelectItem value="newest">Más Recientes</SelectItem>
                <SelectItem value="progress">Progreso</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {filteredAndSortedBooks.length} libro{filteredAndSortedBooks.length !== 1 ? "s" : ""} encontrado
          {filteredAndSortedBooks.length !== 1 ? "s" : ""}
        </h2>
      </div>

      {/* Books Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAndSortedBooks.map((book) => (
          <Card key={book.id} className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs">
                  {book.category}
                </Badge>
                <div className="flex items-center gap-2">
                  {book.isFree && (
                    <Badge variant="default" className="bg-green-600 text-white text-xs">
                      <Gift className="w-3 h-3 mr-1" />
                      GRATIS
                    </Badge>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{book.rating}</span>
                  </div>
                </div>
              </div>
              <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
              <CardDescription className="text-sm text-gray-600">por {book.author}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{book.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">{book.readingTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">{book.difficulty}</span>
                </div>
              </div>

              {book.progress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progreso</span>
                    <span>{book.progress}%</span>
                  </div>
                  <Progress value={book.progress} className="h-2" />
                </div>
              )}

              <div className="space-y-2 mb-4">
                <div className="text-sm font-medium">Temas clave:</div>
                <div className="flex flex-wrap gap-1">
                  {book.keyTopics.slice(0, 2).map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {book.keyTopics.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{book.keyTopics.length - 2} más
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/library/reader/${book.id}`} className="flex-1">
                  <Button className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {book.progress > 0 ? "Continuar Leyendo" : "Comenzar a Leer"}
                  </Button>
                </Link>
                {book.isRecommended && (
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Award className="h-4 w-4 text-yellow-600" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedBooks.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron libros</h3>
            <p className="text-gray-600 mb-4">Intenta ajustar tus filtros de búsqueda para encontrar más resultados.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedDifficulty("all")
                setSortBy("recommended")
              }}
            >
              Limpiar Filtros
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recommended Reading Path */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Ruta de Lectura Recomendada
          </CardTitle>
          <CardDescription>Una secuencia sugerida de libros para maximizar tu desarrollo profesional</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                1
              </div>
              <h4 className="font-semibold mb-1">Fundamentos</h4>
              <p className="text-sm text-gray-600">Comienza con hábitos y mentalidad</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                2
              </div>
              <h4 className="font-semibold mb-1">Habilidades</h4>
              <p className="text-sm text-gray-600">Desarrolla competencias específicas</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                3
              </div>
              <h4 className="font-semibold mb-1">Liderazgo</h4>
              <p className="text-sm text-gray-600">Avanza hacia roles de liderazgo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
