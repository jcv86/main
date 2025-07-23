"use client"

import { useState, useEffect } from "react"
import { Search, BookOpen, Clock, Star, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import {
  getBooks,
  getUserReadingStats,
  mockBooks,
  mockUserStats,
  type Book,
  type UserReadingStats,
} from "@/lib/supabase-library"

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [userStats, setUserStats] = useState<UserReadingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [showRecommended, setShowRecommended] = useState(false)

  useEffect(() => {
    loadLibraryData()
  }, [])

  useEffect(() => {
    filterBooks()
  }, [books, searchQuery, selectedCategory, selectedDifficulty, showRecommended])

  const loadLibraryData = async () => {
    try {
      setLoading(true)

      // Load books
      const { data: booksData, error: booksError } = await getBooks()
      if (booksError || !booksData) {
        // Fallback to mock data
        setBooks(mockBooks)
      } else {
        setBooks(booksData)
      }

      // Load user stats
      const { data: statsData, error: statsError } = await getUserReadingStats("demo-user")
      if (statsError || !statsData) {
        // Fallback to mock stats
        setUserStats(mockUserStats)
      } else {
        setUserStats(statsData)
      }
    } catch (error) {
      console.error("Error loading library data:", error)
      // Use mock data as fallback
      setBooks(mockBooks)
      setUserStats(mockUserStats)
    } finally {
      setLoading(false)
    }
  }

  const filterBooks = () => {
    let filtered = books

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
          book.key_topics.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((book) => book.category === selectedCategory)
    }

    // Difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((book) => book.difficulty === selectedDifficulty)
    }

    // Recommended filter
    if (showRecommended) {
      filtered = filtered.filter((book) => book.is_recommended)
    }

    setFilteredBooks(filtered)
  }

  const getCategories = () => {
    const categories = [...new Set(books.map((book) => book.category))]
    return categories.sort()
  }

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Productividad":
        return "bg-blue-100 text-blue-800"
      case "Liderazgo":
        return "bg-purple-100 text-purple-800"
      case "Habilidades Blandas":
        return "bg-green-100 text-green-800"
      case "Desarrollo Personal":
        return "bg-pink-100 text-pink-800"
      case "Negocios":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Biblioteca de Desarrollo Profesional</h1>
          <p className="text-gray-600">
            Descubre libros que transformarán tu carrera y desarrollo personal. {books.length} libros disponibles.
          </p>
        </div>

        {/* User Stats */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Libros Leídos</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.books_read}</div>
                <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tiempo de Lectura</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.floor(userStats.total_reading_time / 60)}h</div>
                <p className="text-xs text-muted-foreground">{userStats.total_reading_time % 60}min adicionales</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nivel de Lectura</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Nivel {userStats.level}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Progress value={(userStats.points % 500) / 5} className="flex-1" />
                  <span className="text-xs text-muted-foreground">{userStats.points} pts</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por título, autor, tema..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
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
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Dificultad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las dificultades</SelectItem>
                  <SelectItem value="Fácil">Fácil</SelectItem>
                  <SelectItem value="Intermedio">Intermedio</SelectItem>
                  <SelectItem value="Avanzado">Avanzado</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={showRecommended ? "default" : "outline"}
                onClick={() => setShowRecommended(!showRecommended)}
                className="w-full sm:w-auto"
              >
                <Star className="h-4 w-4 mr-2" />
                Recomendados
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredBooks.length} {filteredBooks.length === 1 ? "libro encontrado" : "libros encontrados"}
          </p>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron libros</h3>
            <p className="text-gray-600 mb-4">Intenta ajustar tus filtros de búsqueda</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedDifficulty("all")
                setShowRecommended(false)
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Link key={book.id} href={`/library/reader/${book.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="p-4">
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={book.cover_url || "/placeholder.svg"}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                    <CardDescription className="line-clamp-1">{book.author}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>

                      <div className="flex flex-wrap gap-1">
                        <Badge className={getCategoryColor(book.category)} variant="secondary">
                          {book.category}
                        </Badge>
                        <Badge className={getDifficultyColor(book.difficulty)} variant="secondary">
                          {book.difficulty}
                        </Badge>
                        {book.is_recommended && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1" />
                            Recomendado
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {book.reading_time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {book.rating}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {book.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {book.tags.length > 3 && (
                          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            +{book.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
