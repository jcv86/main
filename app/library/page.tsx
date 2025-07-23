"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Clock, Star, Search, Filter, Trophy, Target, Flame, BookMarked } from "lucide-react"
import Link from "next/link"
import {
  getBooks,
  searchBooks,
  getCategories,
  getBooksByCategory,
  getReadingStats,
  getUserStats,
  type Book,
  type ReadingStats,
  type UserStats,
} from "@/lib/supabase-library"

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [readingStats, setReadingStats] = useState<ReadingStats | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterBooks()
  }, [books, selectedCategory, searchQuery])

  const loadData = async () => {
    try {
      setLoading(true)
      const [booksData, categoriesData, statsData, userStatsData] = await Promise.all([
        getBooks(),
        getCategories(),
        getReadingStats("demo-user"),
        getUserStats("demo-user"),
      ])

      setBooks(booksData)
      setCategories(categoriesData)
      setReadingStats(statsData)
      setUserStats(userStatsData)
    } catch (error) {
      console.error("Error loading library data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterBooks = async () => {
    let filtered = books

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = await getBooksByCategory(selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = await searchBooks(searchQuery)
      if (selectedCategory !== "all") {
        filtered = filtered.filter((book) => book.category === selectedCategory)
      }
    }

    setFilteredBooks(filtered)
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "fácil":
        return "bg-green-100 text-green-800"
      case "intermedio":
        return "bg-yellow-100 text-yellow-800"
      case "avanzado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <BookOpen className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-lg text-gray-600">Cargando biblioteca...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 Biblioteca Digital</h1>
        <p className="text-xl text-gray-600">Descubre libros que transformarán tu carrera profesional</p>
      </div>

      {/* Stats Cards */}
      {(readingStats || userStats) && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{readingStats?.books_read || 0}</p>
                  <p className="text-sm text-gray-600">Libros Completados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{readingStats?.average_progress || 0}%</p>
                  <p className="text-sm text-gray-600">Progreso Promedio</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Flame className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{userStats?.reading_streak || 0}</p>
                  <p className="text-sm text-gray-600">Días Consecutivos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.floor((readingStats?.total_reading_time || 0) / 60)}h
                  </p>
                  <p className="text-sm text-gray-600">Tiempo Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar libros por título, autor o tema..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todos los Libros</TabsTrigger>
          <TabsTrigger value="free">Libros Gratuitos</TabsTrigger>
          <TabsTrigger value="recommended">Recomendados</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {book.category}
                    </Badge>
                    {book.is_free && <Badge className="bg-green-100 text-green-800 text-xs">GRATIS</Badge>}
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">por {book.author}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">{book.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{book.rating}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {book.reading_time}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getDifficultyColor(book.difficulty)}>{book.difficulty}</Badge>
                    <span className="text-sm text-gray-600">{book.total_pages} páginas</span>
                  </div>

                  <Link href={`/library/reader/${book.id}`}>
                    <Button className="w-full">
                      <BookMarked className="h-4 w-4 mr-2" />
                      Leer Ahora
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="free" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks
              .filter((book) => book.is_free)
              .map((book) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {book.category}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 text-xs">GRATIS</Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">por {book.author}</CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">{book.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{book.rating}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {book.reading_time}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <Badge className={getDifficultyColor(book.difficulty)}>{book.difficulty}</Badge>
                      <span className="text-sm text-gray-600">{book.total_pages} páginas</span>
                    </div>

                    <Link href={`/library/reader/${book.id}`}>
                      <Button className="w-full">
                        <BookMarked className="h-4 w-4 mr-2" />
                        Leer Ahora
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="recommended" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks
              .filter((book) => book.rating >= 4.5)
              .map((book) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow duration-200 border-yellow-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {book.category}
                      </Badge>
                      <div className="flex gap-1">
                        {book.is_free && <Badge className="bg-green-100 text-green-800 text-xs">GRATIS</Badge>}
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">⭐ RECOMENDADO</Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">por {book.author}</CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">{book.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{book.rating}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {book.reading_time}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <Badge className={getDifficultyColor(book.difficulty)}>{book.difficulty}</Badge>
                      <span className="text-sm text-gray-600">{book.total_pages} páginas</span>
                    </div>

                    <Link href={`/library/reader/${book.id}`}>
                      <Button className="w-full">
                        <BookMarked className="h-4 w-4 mr-2" />
                        Leer Ahora
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredBooks.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron libros</h3>
          <p className="text-gray-600">
            {searchQuery || selectedCategory !== "all"
              ? "Intenta ajustar tus filtros de búsqueda"
              : "No hay libros disponibles en este momento"}
          </p>
        </div>
      )}
    </div>
  )
}
