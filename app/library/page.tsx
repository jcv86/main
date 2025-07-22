"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Search, Filter, Star, Clock, User, Calendar, TrendingUp, Award, Target } from "lucide-react"
import Link from "next/link"
import { getAllBooks, getRecommendedBooks, getUserReadingStats } from "@/lib/supabase-library"
import type { Book, ReadingStats } from "@/lib/supabase-library"

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([])
  const [readingStats, setReadingStats] = useState<ReadingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const userId = "demo-user-id" // In a real app, this would come from auth context

  useEffect(() => {
    const loadLibraryData = async () => {
      try {
        const [allBooks, recommended, stats] = await Promise.all([
          getAllBooks(),
          getRecommendedBooks(userId),
          getUserReadingStats(userId),
        ])

        setBooks(allBooks)
        setRecommendedBooks(recommended)
        setReadingStats(stats)
      } catch (error) {
        console.error("Error loading library data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadLibraryData()
  }, [userId])

  const categories = ["all", "Productividad", "Liderazgo", "Habilidades Blandas", "Desarrollo Personal", "Negocios"]

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Biblioteca Digital</h1>
        <p className="text-gray-600">Accede a libros especializados en desarrollo profesional y crecimiento personal</p>
      </div>

      {/* Reading Stats */}
      {readingStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Libros Leídos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readingStats.books_read}</div>
              <p className="text-xs text-muted-foreground">este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo de Lectura</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readingStats.total_reading_time}h</div>
              <p className="text-xs text-muted-foreground">total acumulado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readingStats.average_progress}%</div>
              <p className="text-xs text-muted-foreground">en libros activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Racha de Lectura</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readingStats.reading_streak}</div>
              <p className="text-xs text-muted-foreground">días consecutivos</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="recommended" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recommended">Recomendados para Ti</TabsTrigger>
          <TabsTrigger value="all">Toda la Biblioteca</TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendedBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {book.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{book.rating}</span>
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
                      <span className="text-sm text-gray-600">{book.reading_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600">{book.difficulty}</span>
                    </div>
                  </div>
                  <Link href={`/library/reader/${book.id}`}>
                    <Button className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Comenzar a Leer
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar libros por título o autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "Todas las categorías" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {book.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{book.rating}</span>
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
                      <span className="text-sm text-gray-600">{book.reading_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-gray-600">{book.publication_year}</span>
                    </div>
                  </div>
                  <Link href={`/library/reader/${book.id}`}>
                    <Button variant="outline" className="w-full bg-transparent">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Leer Ahora
                    </Button>
                  </Link>
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
      </Tabs>

      {/* Call to Action */}
      <div className="mt-12">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">¿Buscas algo específico?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Nuestro sistema de recomendaciones personalizado puede sugerir libros basados en tus objetivos de carrera
              y resultados de evaluaciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/personality-test">
                <Button size="lg">Hacer Test de Personalidad</Button>
              </Link>
              <Link href="/career-coach">
                <Button variant="outline" size="lg">
                  Hablar con Coach IA
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
