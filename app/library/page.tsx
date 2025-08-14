"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Search, Clock, Star, TrendingUp, Award, Target, BookmarkIcon, PlayCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { libraryService, type Book, type BookWithProgress } from "@/lib/supabase-library"

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([])
  const [recentBooks, setRecentBooks] = useState<BookWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [userStats, setUserStats] = useState({
    booksStarted: 0,
    booksCompleted: 0,
    totalBookmarks: 0,
    averageProgress: 0,
    currentlyReading: 0,
  })

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        setLoading(true)

        // Fetch all books
        const allBooks = await libraryService.getBooks()
        setBooks(allBooks)

        // Fetch featured books
        const featured = await libraryService.getFeaturedBooks()
        setFeaturedBooks(featured)

        // Fetch user's recent books (using demo user)
        const recent = await libraryService.getUserRecentBooks("demo-user-id", 5)
        setRecentBooks(recent)

        // Fetch user stats (using demo user)
        const stats = await libraryService.getUserStats("demo-user-id")
        setUserStats(stats)
      } catch (error) {
        console.error("Error fetching library data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLibraryData()
  }, [])

  // Filter books based on search and filters
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || book.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  // Get unique categories and difficulties
  const categories = Array.from(new Set(books.map((book) => book.category)))
  const difficulties = Array.from(new Set(books.map((book) => book.difficulty)))

  const formatReadingTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-8 w-12" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Books Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Biblioteca de Desarrollo Profesional</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre libros cuidadosamente seleccionados para impulsar tu carrera y desarrollo personal
          </p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userStats.booksStarted}</div>
              <div className="text-sm text-gray-600">Libros Iniciados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userStats.booksCompleted}</div>
              <div className="text-sm text-gray-600">Completados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <BookmarkIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userStats.totalBookmarks}</div>
              <div className="text-sm text-gray-600">Marcadores</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userStats.averageProgress}%</div>
              <div className="text-sm text-gray-600">Progreso Promedio</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{userStats.currentlyReading}</div>
              <div className="text-sm text-gray-600">Leyendo Ahora</div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Reading Section */}
        {recentBooks.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Continuar Leyendo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentBooks.map((book) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <div className="relative w-16 h-20 flex-shrink-0">
                        <Image
                          src={book.cover_image || "/placeholder.svg"}
                          alt={book.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
                        <p className="text-sm text-gray-600 truncate">{book.author}</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Progreso</span>
                            <span>{book.progress?.progress_percentage || 0}%</span>
                          </div>
                          <Progress value={book.progress?.progress_percentage || 0} className="h-2" />
                        </div>
                        <Button asChild size="sm" className="mt-3 w-full">
                          <Link href={`/library/reader/${book.id}`}>
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Continuar
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <TabsList className="grid w-full sm:w-auto grid-cols-3">
              <TabsTrigger value="all">Todos los Libros</TabsTrigger>
              <TabsTrigger value="featured">Destacados</TabsTrigger>
              <TabsTrigger value="categories">Por Categoría</TabsTrigger>
            </TabsList>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar libros..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las dificultades</option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="relative w-full h-48 mb-4">
                      <Image
                        src={book.cover_image || "/placeholder.svg"}
                        alt={book.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
                      <p className="text-sm text-gray-600">{book.author}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{book.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {book.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {book.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatReadingTime(book.estimated_reading_time)}
                      </div>
                      {book.rating && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{book.rating}</span>
                        </div>
                      )}
                      <Button asChild className="w-full mt-4">
                        <Link href={`/library/reader/${book.id}`}>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Leer Ahora
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBooks.map((book) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <div className="relative w-20 h-28 flex-shrink-0">
                        <Image
                          src={book.cover_image || "/placeholder.svg"}
                          alt={book.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{book.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                        <p className="text-xs text-gray-500 line-clamp-3 mb-3">{book.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {book.category}
                          </Badge>
                          {book.rating && (
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600 ml-1">{book.rating}</span>
                            </div>
                          )}
                        </div>
                        <Button asChild size="sm" className="w-full">
                          <Link href={`/library/reader/${book.id}`}>
                            <BookOpen className="w-4 h-4 mr-2" />
                            Leer
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            {categories.map((category) => {
              const categoryBooks = books.filter((book) => book.category === category)
              return (
                <div key={category} className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryBooks.slice(0, 4).map((book) => (
                      <Card key={book.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="relative w-full h-40 mb-3">
                            <Image
                              src={book.cover_image || "/placeholder.svg"}
                              alt={book.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <h4 className="font-medium text-gray-900 line-clamp-2 mb-1">{book.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="outline" className="text-xs">
                              {book.difficulty}
                            </Badge>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatReadingTime(book.estimated_reading_time)}
                            </div>
                          </div>
                          <Button asChild size="sm" className="w-full">
                            <Link href={`/library/reader/${book.id}`}>
                              <BookOpen className="w-4 h-4 mr-2" />
                              Leer
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {categoryBooks.length > 4 && (
                    <div className="text-center">
                      <Button variant="outline">Ver todos los libros de {category}</Button>
                    </div>
                  )}
                </div>
              )
            })}
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {filteredBooks.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron libros</h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar tus filtros de búsqueda o explora diferentes categorías.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedDifficulty("all")
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
