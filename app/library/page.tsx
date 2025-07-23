"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Star, Search, TrendingUp, Award } from "lucide-react"
import Link from "next/link"
import {
  getBooks,
  getCategories,
  getBooksByCategory,
  searchBooks,
  getReadingStats,
  getUserStats,
  getReadingProgress,
  type Book,
  type ReadingStats,
  type UserStats,
} from "@/lib/supabase-library"

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [readingStats, setReadingStats] = useState<ReadingStats | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [readingProgress, setReadingProgress] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (selectedCategory === "all") {
      loadBooks()
    } else {
      loadBooksByCategory(selectedCategory)
    }
  }, [selectedCategory])

  useEffect(() => {
    if (searchQuery) {
      handleSearch()
    } else if (selectedCategory === "all") {
      loadBooks()
    } else {
      loadBooksByCategory(selectedCategory)
    }
  }, [searchQuery])

  const loadInitialData = async () => {
    try {
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

      // Load reading progress for each book
      const progressData: { [key: string]: number } = {}
      for (const book of booksData) {
        const progress = await getReadingProgress("demo-user", book.id)
        if (progress) {
          progressData[book.id] = progress.progress_percentage
        }
      }
      setReadingProgress(progressData)
    } catch (error) {
      console.error("Error loading library data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadBooks = async () => {
    try {
      const data = await getBooks()
      setBooks(data)
    } catch (error) {
      console.error("Error loading books:", error)
    }
  }

  const loadBooksByCategory = async (category: string) => {
    try {
      const data = await getBooksByCategory(category)
      setBooks(data)
    } catch (error) {
      console.error("Error loading books by category:", error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      const data = await searchBooks(searchQuery)
      setBooks(data)
    } catch (error) {
      console.error("Error searching books:", error)
    }
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

  const getCategoryColor = (category: string) => {
    const colors = {
      Productividad: "bg-blue-100 text-blue-800",
      Liderazgo: "bg-purple-100 text-purple-800",
      "Habilidades Blandas": "bg-green-100 text-green-800",
      "Desarrollo Personal": "bg-orange-100 text-orange-800",
      Negocios: "bg-red-100 text-red-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 Biblioteca de Desarrollo</h1>
        <p className="text-xl text-gray-600">Descubre libros que transformarán tu carrera profesional</p>
      </div>

      {/* Stats Cards */}
      {(readingStats || userStats) && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Libros Leídos</p>
                  <p className="text-2xl font-bold text-gray-900">{readingStats?.books_read || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tiempo de Lectura</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round((readingStats?.total_reading_time || 0) / 60)}h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Racha de Lectura</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats?.reading_streak || 0} días</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Puntos</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats?.points || 0}</p>
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="all">Todos</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs md:text-sm">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <Card key={book.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={getCategoryColor(book.category)}>{book.category}</Badge>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{book.rating}</span>
                </div>
              </div>
              <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
              <CardDescription className="text-sm text-gray-600">por {book.author}</CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-gray-700 mb-4 line-clamp-3">{book.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {book.reading_time}
                </Badge>
                <Badge variant="outline" className={`text-xs ${getDifficultyColor(book.difficulty)}`}>
                  {book.difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {book.total_pages} capítulos
                </Badge>
              </div>

              {/* Reading Progress */}
              {readingProgress[book.id] && readingProgress[book.id] > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progreso</span>
                    <span className="text-sm font-medium">{readingProgress[book.id]}%</span>
                  </div>
                  <Progress value={readingProgress[book.id]} className="h-2" />
                </div>
              )}

              <Link href={`/library/reader/${book.id}`}>
                <Button className="w-full">
                  {readingProgress[book.id] && readingProgress[book.id] > 0 ? "Continuar Leyendo" : "Comenzar a Leer"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron libros</h3>
          <p className="text-gray-600">
            {searchQuery
              ? `No hay libros que coincidan con "${searchQuery}"`
              : "No hay libros disponibles en esta categoría"}
          </p>
        </div>
      )}
    </div>
  )
}
