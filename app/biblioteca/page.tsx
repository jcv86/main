"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BookOpen,
  Search,
  Filter,
  Clock,
  User,
  TrendingUp,
  Star,
  Bookmark,
  Eye,
  Heart,
  X,
  Tag,
  CheckCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"

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
}

interface BookStats {
  totalBooks: number
  totalCategories: number
  totalAuthors: number
  averageReadCount: number
  mostPopularCategory: string
  recentBooks: number
  completeBooks: number
}

export default function BibliotecaPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTag, setSelectedTag] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("popularity")
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()

  // Cargar libros desde la API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/books")
        const data = await response.json()

        // Transformar datos para asegurar compatibilidad
        const transformedBooks = data.map((book: any) => ({
          id: book.id,
          title: book.title || "Sin título",
          author: book.author || "Autor desconocido",
          category: book.category || "General",
          content: book.content || "",
          tags: Array.isArray(book.tags) ? book.tags : [],
          slug: book.slug || "",
          read_count: book.read_count || 0,
          created_at: book.created_at || new Date().toISOString(),
          updated_at: book.updated_at || new Date().toISOString(),
        }))

        setBooks(transformedBooks)
      } catch (error) {
        console.error("Error al cargar libros:", error)
        setBooks([])
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  // Determinar si un libro está completo (más de 10,000 caracteres indica contenido completo)
  const isBookComplete = (book: Book) => {
    return book.content && book.content.length > 10000
  }

  // Calcular estadísticas
  const stats: BookStats = useMemo(() => {
    if (books.length === 0) {
      return {
        totalBooks: 0,
        totalCategories: 0,
        totalAuthors: 0,
        averageReadCount: 0,
        mostPopularCategory: "",
        recentBooks: 0,
        completeBooks: 0,
      }
    }

    const categories = [...new Set(books.map((book) => book.category))]
    const authors = [...new Set(books.map((book) => book.author))]
    const totalReadCount = books.reduce((sum, book) => sum + (book.read_count || 0), 0)
    const averageReadCount = Math.round(totalReadCount / books.length)

    // Encontrar categoría más popular
    const categoryCount = books.reduce(
      (acc, book) => {
        const category = book.category || "General"
        acc[category] = (acc[category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const categoryEntries = Object.entries(categoryCount)
    const mostPopularCategory =
      categoryEntries.length > 0 ? categoryEntries.reduce((a, b) => (a[1] > b[1] ? a : b))[0] : ""

    // Libros recientes (últimos 30 días)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentBooks = books.filter((book) => new Date(book.created_at) > thirtyDaysAgo).length

    // Libros completos (más de 10,000 caracteres)
    const completeBooks = books.filter(isBookComplete).length

    return {
      totalBooks: books.length,
      totalCategories: categories.length,
      totalAuthors: authors.length,
      averageReadCount,
      mostPopularCategory,
      recentBooks,
      completeBooks,
    }
  }, [books])

  // Obtener todas las categorías únicas
  const categories = useMemo(() => {
    if (books.length === 0) return []
    return [...new Set(books.map((book) => book.category))].sort()
  }, [books])

  // Obtener todos los tags únicos con frecuencia
  const allTags = useMemo(() => {
    if (books.length === 0) return []

    const tagCount = books.reduce(
      (acc, book) => {
        if (Array.isArray(book.tags)) {
          book.tags.forEach((tag) => {
            acc[tag] = (acc[tag] || 0) + 1
          })
        }
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
  }, [books])

  // Filtrar libros
  const filteredBooks = useMemo(() => {
    let filtered = [...books]

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term) ||
          book.category.toLowerCase().includes(term) ||
          (Array.isArray(book.tags) && book.tags.some((tag) => tag.toLowerCase().includes(term))) ||
          book.content.toLowerCase().includes(term),
      )
    }

    // Filtrar por categoría
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((book) => book.category === selectedCategory)
    }

    // Filtrar por tag seleccionado
    if (selectedTag) {
      filtered = filtered.filter((book) => Array.isArray(book.tags) && book.tags.includes(selectedTag))
    }

    // Ordenar
    switch (sortBy) {
      case "popularity":
        filtered.sort((a, b) => (b.read_count || 0) - (a.read_count || 0))
        break
      case "recent":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "author":
        filtered.sort((a, b) => a.author.localeCompare(b.author))
        break
      case "complete":
        filtered.sort((a, b) => b.content.length - a.content.length)
        break
    }

    return filtered
  }, [books, searchTerm, selectedCategory, selectedTag, sortBy])

  // Filtrar por pestañas
  const getBooksByTab = (tab: string) => {
    switch (tab) {
      case "popular":
        return filteredBooks.filter((book) => (book.read_count || 0) > 1000)
      case "recent":
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return filteredBooks.filter((book) => new Date(book.created_at) > thirtyDaysAgo)
      case "favorites":
        return filteredBooks.filter((book) => (book.read_count || 0) > 2000)
      case "complete":
        return filteredBooks.filter(isBookComplete)
      default:
        return filteredBooks
    }
  }

  const displayBooks = getBooksByTab(activeTab)

  // Función para manejar click en tag
  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag("")
    } else {
      setSelectedTag(tag)
      setActiveTab("all")
    }
  }

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedTag("")
    setActiveTab("all")
  }

  const estimateReadingTime = (content: string) => {
    if (!content) return 0
    const wordsPerMinute = 200
    const wordCount = content.split(" ").length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const getContentQualityBadge = (book: Book) => {
    const length = book.content?.length || 0
    if (length > 20000) {
      return { label: "Completo", color: "bg-green-100 text-green-800 border-green-300" }
    } else if (length > 10000) {
      return { label: "Extenso", color: "bg-blue-100 text-blue-800 border-blue-300" }
    } else if (length > 5000) {
      return { label: "Medio", color: "bg-yellow-100 text-yellow-800 border-yellow-300" }
    } else {
      return { label: "Resumen", color: "bg-gray-100 text-gray-800 border-gray-300" }
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Biblioteca de Desarrollo Profesional</h1>
        <p className="text-gray-600">Descubre recursos valiosos para tu crecimiento personal y profesional</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Libros</p>
                <p className="text-2xl font-bold">{stats.totalBooks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Libros Completos</p>
                <p className="text-2xl font-bold">{stats.completeBooks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Filter className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categorías</p>
                <p className="text-2xl font-bold">{stats.totalCategories}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Autores</p>
                <p className="text-2xl font-bold">{stats.totalAuthors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Promedio Lecturas</p>
                <p className="text-2xl font-bold">{stats.averageReadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar libros, autores, temas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las categorías" />
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
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Más populares</SelectItem>
                <SelectItem value="recent">Más recientes</SelectItem>
                <SelectItem value="alphabetical">Alfabético</SelectItem>
                <SelectItem value="author">Por autor</SelectItem>
                <SelectItem value="complete">Más completos</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
              Limpiar filtros
            </Button>
          </div>

          {/* Filtros activos */}
          {(selectedTag || selectedCategory !== "all" || searchTerm) && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm text-gray-600">Filtros activos:</span>
              {selectedTag && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedTag("")}>
                  Tag: {selectedTag}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory("all")}>
                  Categoría: {selectedCategory}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {searchTerm && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm("")}>
                  Búsqueda: {searchTerm}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
            </div>
          )}

          {/* Tags populares */}
          {allTags.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Tags populares:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 15).map(([tag, count]) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag} ({count})
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todos ({filteredBooks.length})</TabsTrigger>
          <TabsTrigger value="complete">
            <CheckCircle className="h-4 w-4 mr-1" />
            Completos ({filteredBooks.filter(isBookComplete).length})
          </TabsTrigger>
          <TabsTrigger value="popular">
            Populares ({filteredBooks.filter((book) => (book.read_count || 0) > 1000).length})
          </TabsTrigger>
          <TabsTrigger value="recent">Recientes ({stats.recentBooks})</TabsTrigger>
          <TabsTrigger value="favorites">
            Favoritos ({filteredBooks.filter((book) => (book.read_count || 0) > 2000).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {displayBooks.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron libros</h3>
                <p className="text-gray-500 mb-4">Intenta ajustar tus filtros o términos de búsqueda</p>
                <Button onClick={clearFilters}>Limpiar todos los filtros</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayBooks.map((book) => {
                const qualityBadge = getContentQualityBadge(book)
                return (
                  <Card key={book.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-2">
                          <Badge variant="outline">{book.category}</Badge>
                          <Badge className={qualityBadge.color}>{qualityBadge.label}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Eye className="h-4 w-4 mr-1" />
                          {book.read_count || 0}
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">{book.title}</CardTitle>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-1" />
                        {book.author}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {book.content ? book.content.substring(0, 150) + "..." : "Sin descripción disponible"}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {estimateReadingTime(book.content)} min lectura
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          4.5
                        </div>
                      </div>

                      {Array.isArray(book.tags) && book.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {book.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs cursor-pointer hover:bg-blue-100 transition-colors"
                              onClick={() => handleTagClick(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
                          {book.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{book.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          size="sm"
                          onClick={() => router.push(`/biblioteca/${book.slug || book.id}`)}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Leer
                        </Button>
                        <Button variant="outline" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
