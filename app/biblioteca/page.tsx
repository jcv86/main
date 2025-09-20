"use client"

import { useState, useEffect } from "react"
import {
  Search,
  BookOpen,
  Star,
  Clock,
  TrendingUp,
  User,
  Tag,
  Heart,
  BookmarkPlus,
  Bookmark,
  ArrowLeft,
  Eye,
  FileText,
  BarChart3,
  Target,
  CheckCircle,
  Circle,
  Play,
  Pause,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"

interface KnowledgeBook {
  id: number
  title: string
  category: string
  content: string
  author: string
  tags: string[]
  slug: string
  read_count: number
  created_at: string
  updated_at: string
  pages?: number
  isbn?: string
  publication_year?: number
  content_length?: number
  reading_time_minutes?: number
}

interface BookStatus {
  book_id: number
  user_email: string
  reading_progress: number
  target_percentage: number
  status: "not_started" | "reading" | "completed" | "paused"
  notes: string
  started_at?: string
  completed_at?: string
  last_read_at?: string
}

interface UserBookmark {
  book_id: number
  user_email: string
  created_at: string
}

export default function BibliotecaPage() {
  const [books, setBooks] = useState<KnowledgeBook[]>([])
  const [filteredBooks, setFilteredBooks] = useState<KnowledgeBook[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [bookmarks, setBookmarks] = useState<UserBookmark[]>([])
  const [bookStatuses, setBookStatuses] = useState<BookStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedBook, setSelectedBook] = useState<KnowledgeBook | null>(null)
  const [sortBy, setSortBy] = useState<string>("popular")
  const [isReading, setIsReading] = useState(false)
  const [showBookDetails, setShowBookDetails] = useState(false)
  const [selectedReadingTarget, setSelectedReadingTarget] = useState<number>(100)
  const [showTargetDialog, setShowTargetDialog] = useState(false)
  const [libraryStats, setLibraryStats] = useState({
    totalBooks: 0,
    totalCategories: 0,
    totalAuthors: 0,
    avgContentLength: 0,
    totalReads: 0,
  })

  const userEmail = "demo@example.com" // In real app, get from auth

  useEffect(() => {
    loadLibrary()
  }, [])

  useEffect(() => {
    filterAndSortBooks()
  }, [books, searchTerm, selectedCategory, sortBy])

  const loadLibrary = async () => {
    try {
      setLoading(true)

      // Load all books with enhanced data
      const { data: booksData, error: booksError } = await supabase
        .from("knowledge_base")
        .select("*")
        .order("created_at", { ascending: false })

      if (booksError) throw booksError

      // Enhance books with calculated data
      const enhancedBooks = (booksData || []).map((book) => ({
        ...book,
        content_length: book.content?.length || 0,
        pages: Math.ceil((book.content?.length || 0) / 2000), // Estimate 2000 chars per page
        reading_time_minutes: Math.ceil((book.content?.length || 0) / 1000), // Estimate 1000 chars per minute
      }))

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("knowledge_base")
        .select("category")
        .order("category")

      if (categoriesError) throw categoriesError

      // Load user bookmarks
      const { data: bookmarksData, error: bookmarksError } = await supabase
        .from("user_bookmarks")
        .select("*")
        .eq("user_email", userEmail)

      if (bookmarksError) console.error("Bookmarks error:", bookmarksError)

      // Load book reading statuses
      const { data: statusData, error: statusError } = await supabase
        .from("user_reading_progress")
        .select("*")
        .eq("user_email", userEmail)

      if (statusError) console.error("Status error:", statusError)

      // Calculate library statistics
      const stats = {
        totalBooks: enhancedBooks.length,
        totalCategories: [...new Set(categoriesData?.map((c) => c.category) || [])].length,
        totalAuthors: [...new Set(enhancedBooks.map((b) => b.author))].length,
        avgContentLength: Math.round(
          enhancedBooks.reduce((sum, book) => sum + (book.content_length || 0), 0) / enhancedBooks.length,
        ),
        totalReads: enhancedBooks.reduce((sum, book) => sum + book.read_count, 0),
      }

      const uniqueCategories = [...new Set(categoriesData?.map((c) => c.category) || [])]

      setBooks(enhancedBooks)
      setCategories(uniqueCategories)
      setBookmarks(bookmarksData || [])
      setBookStatuses(statusData || [])
      setLibraryStats(stats)
    } catch (error) {
      console.error("Error loading library:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortBooks = () => {
    let filtered = books

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((book) => book.category === selectedCategory)
    }

    // Sort books
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => b.read_count - a.read_count)
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
      case "length":
        filtered.sort((a, b) => (b.content_length || 0) - (a.content_length || 0))
        break
      case "pages":
        filtered.sort((a, b) => (b.pages || 0) - (a.pages || 0))
        break
    }

    setFilteredBooks(filtered)
  }

  const handleBookClick = async (book: KnowledgeBook) => {
    setSelectedBook(book)
    setShowBookDetails(true)

    // Increment read count
    try {
      await supabase.rpc("increment_read_count", { book_id: book.id })

      // Update local state
      setBooks((prevBooks) => prevBooks.map((b) => (b.id === book.id ? { ...b, read_count: b.read_count + 1 } : b)))
    } catch (error) {
      console.error("Error incrementing read count:", error)
    }
  }

  const startReading = (targetPercentage = 100) => {
    setSelectedReadingTarget(targetPercentage)
    setShowBookDetails(false)
    setIsReading(true)
    updateBookStatus("reading", targetPercentage)
  }

  const updateBookStatus = async (status: string, targetPercentage?: number) => {
    if (!selectedBook) return

    try {
      const statusData = {
        user_email: userEmail,
        book_id: selectedBook.id,
        status: status,
        target_percentage: targetPercentage || selectedReadingTarget,
        last_read_at: new Date().toISOString(),
      }

      if (status === "reading" && !getBookStatus(selectedBook.id)) {
        statusData.started_at = new Date().toISOString()
      }

      if (status === "completed") {
        statusData.completed_at = new Date().toISOString()
        statusData.reading_progress = targetPercentage || 100
      }

      await supabase.from("user_reading_progress").upsert(statusData)

      // Update local state
      setBookStatuses((prev) => {
        const existing = prev.find((s) => s.book_id === selectedBook.id)
        if (existing) {
          return prev.map((s) => (s.book_id === selectedBook.id ? { ...s, ...statusData } : s))
        } else {
          return [...prev, statusData as BookStatus]
        }
      })
    } catch (error) {
      console.error("Error updating book status:", error)
    }
  }

  const getBookStatus = (bookId: number): BookStatus | undefined => {
    return bookStatuses.find((status) => status.book_id === bookId)
  }

  const toggleBookmark = async (bookId: number) => {
    const isBookmarked = bookmarks.some((b) => b.book_id === bookId)

    try {
      if (isBookmarked) {
        // Remove bookmark
        await supabase.from("user_bookmarks").delete().eq("book_id", bookId).eq("user_email", userEmail)

        setBookmarks((prev) => prev.filter((b) => b.book_id !== bookId))
      } else {
        // Add bookmark
        const { data } = await supabase
          .from("user_bookmarks")
          .insert({
            book_id: bookId,
            user_email: userEmail,
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (data) {
          setBookmarks((prev) => [...prev, data])
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    }
  }

  const isBookmarked = (bookId: number) => {
    return bookmarks.some((b) => b.book_id === bookId)
  }

  const getReadingProgress = (bookId: number) => {
    const status = getBookStatus(bookId)
    return status?.reading_progress || 0
  }

  const getStatusIcon = (bookId: number) => {
    const status = getBookStatus(bookId)
    if (!status) return <Circle className="h-4 w-4 text-gray-400" />

    switch (status.status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "reading":
        return <Play className="h-4 w-4 text-blue-500" />
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusText = (bookId: number) => {
    const status = getBookStatus(bookId)
    if (!status) return "No iniciado"

    switch (status.status) {
      case "completed":
        return `Completado (${status.target_percentage}%)`
      case "reading":
        return `Leyendo (${status.reading_progress}%)`
      case "paused":
        return "Pausado"
      default:
        return "No iniciado"
    }
  }

  const getBooksInProgress = () => {
    return books.filter((book) => {
      const status = getBookStatus(book.id)
      return status && status.status === "reading"
    })
  }

  const getCompletedBooks = () => {
    return books.filter((book) => {
      const status = getBookStatus(book.id)
      return status && status.status === "completed"
    })
  }

  const getBookmarkedBooks = () => {
    return books.filter((book) => isBookmarked(book.id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-100">
        <div className="text-center">
          <BookOpen className="h-12 w-12 animate-pulse mx-auto mb-4 text-blue-600" />
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Cargando biblioteca...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-gray-100">
      {/* Enhanced Header with Statistics */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">📚 Biblioteca de Conocimiento Completa</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Explora nuestra colección completa de libros especializados en desarrollo profesional con contenido integral
        </p>

        {/* Library Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{libraryStats.totalBooks}</div>
              <div className="text-sm text-gray-600">Libros Totales</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{libraryStats.totalCategories}</div>
              <div className="text-sm text-gray-600">Categorías</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{libraryStats.totalAuthors}</div>
              <div className="text-sm text-gray-600">Autores</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(libraryStats.avgContentLength / 1000)}K
              </div>
              <div className="text-sm text-gray-600">Promedio Chars</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{libraryStats.totalReads}</div>
              <div className="text-sm text-gray-600">Lecturas Totales</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="explore" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="explore">Explorar</TabsTrigger>
          <TabsTrigger value="popular">Populares</TabsTrigger>
          <TabsTrigger value="reading">Leyendo ({getBooksInProgress().length})</TabsTrigger>
          <TabsTrigger value="completed">Completados ({getCompletedBooks().length})</TabsTrigger>
          <TabsTrigger value="bookmarks">Guardados ({getBookmarkedBooks().length})</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="space-y-6">
          {/* Enhanced Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por título, autor, contenido, tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[200px]">
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
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Más populares</SelectItem>
                    <SelectItem value="recent">Más recientes</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                    <SelectItem value="author">Por autor</SelectItem>
                    <SelectItem value="length">Por extensión</SelectItem>
                    <SelectItem value="pages">Por páginas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="hover:bg-secondary transition-shadow cursor-pointer group relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{book.category}</Badge>
                      {getStatusIcon(book.id)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleBookmark(book.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {isBookmarked(book.id) ? (
                        <Bookmark className="h-4 w-4 text-blue-600" />
                      ) : (
                        <BookmarkPlus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <CardTitle className="text-lg line-clamp-2" onClick={() => handleBookClick(book)}>
                    {book.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {book.author}
                  </CardDescription>
                </CardHeader>
                <CardContent onClick={() => handleBookClick(book)}>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">{book.content.substring(0, 150)}...</p>

                  {/* Book Metrics */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {book.pages} págs
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {book.reading_time_minutes} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {book.read_count} lecturas
                    </div>
                  </div>

                  {/* Reading Progress */}
                  {getReadingProgress(book.id) > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progreso</span>
                        <span>{getReadingProgress(book.id)}%</span>
                      </div>
                      <Progress value={getReadingProgress(book.id)} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">{getStatusText(book.id)}</div>
                    <div className="flex flex-wrap gap-1">
                      {book.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {book.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{book.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron libros</h3>
                  <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="popular" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books
              .sort((a, b) => b.read_count - a.read_count)
              .slice(0, 12)
              .map((book, index) => (
                <Card key={book.id} className="hover:bg-secondary transition-shadow cursor-pointer relative">
                  <div className="absolute top-4 left-4 z-10">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <CardHeader className="pt-12">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="w-fit">
                        {book.category}
                      </Badge>
                      {getStatusIcon(book.id)}
                    </div>
                    <CardTitle className="text-lg line-clamp-2" onClick={() => handleBookClick(book)}>
                      {book.title}
                    </CardTitle>
                    <CardDescription>{book.author}</CardDescription>
                  </CardHeader>
                  <CardContent onClick={() => handleBookClick(book)}>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{book.content.substring(0, 150)}...</p>
                    <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {book.pages} págs
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {book.reading_time_minutes} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {book.read_count}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">{getStatusText(book.id)}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleBookmark(book.id)
                        }}
                      >
                        {isBookmarked(book.id) ? (
                          <Bookmark className="h-4 w-4 text-blue-600" />
                        ) : (
                          <BookmarkPlus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="reading" className="space-y-6">
          {getBooksInProgress().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getBooksInProgress().map((book) => {
                const status = getBookStatus(book.id)
                return (
                  <Card key={book.id} className="hover:bg-secondary transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{book.category}</Badge>
                        <div className="flex items-center gap-1 text-xs text-blue-600">
                          <Play className="h-3 w-3" />
                          Leyendo
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2" onClick={() => handleBookClick(book)}>
                        {book.title}
                      </CardTitle>
                      <CardDescription>{book.author}</CardDescription>
                    </CardHeader>
                    <CardContent onClick={() => handleBookClick(book)}>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progreso</span>
                          <span>
                            {status?.reading_progress || 0}% de {status?.target_percentage || 100}%
                          </span>
                        </div>
                        <Progress value={status?.reading_progress || 0} className="h-3" />
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{book.content.substring(0, 120)}...</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Última lectura:{" "}
                          {status?.last_read_at ? new Date(status.last_read_at).toLocaleDateString() : "N/A"}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleBookmark(book.id)
                          }}
                        >
                          {isBookmarked(book.id) ? (
                            <Bookmark className="h-4 w-4 text-blue-600" />
                          ) : (
                            <BookmarkPlus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes libros en progreso</h3>
                  <p className="text-gray-600 mb-4">Comienza a leer un libro para verlo aquí</p>
                  <Button onClick={() => document.querySelector('[value="explore"]')?.click()}>
                    Explorar Biblioteca
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {getCompletedBooks().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCompletedBooks().map((book) => {
                const status = getBookStatus(book.id)
                return (
                  <Card key={book.id} className="hover:bg-secondary transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{book.category}</Badge>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Completado
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2" onClick={() => handleBookClick(book)}>
                        {book.title}
                      </CardTitle>
                      <CardDescription>{book.author}</CardDescription>
                    </CardHeader>
                    <CardContent onClick={() => handleBookClick(book)}>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Completado</span>
                          <span>{status?.target_percentage || 100}%</span>
                        </div>
                        <Progress value={100} className="h-3" />
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{book.content.substring(0, 120)}...</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Completado:{" "}
                          {status?.completed_at ? new Date(status.completed_at).toLocaleDateString() : "N/A"}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleBookmark(book.id)
                          }}
                        >
                          {isBookmarked(book.id) ? (
                            <Bookmark className="h-4 w-4 text-blue-600" />
                          ) : (
                            <BookmarkPlus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No has completado ningún libro</h3>
                  <p className="text-gray-600 mb-4">Completa la lectura de un libro para verlo aquí</p>
                  <Button onClick={() => document.querySelector('[value="explore"]')?.click()}>
                    Explorar Biblioteca
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bookmarks" className="space-y-6">
          {getBookmarkedBooks().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getBookmarkedBooks().map((book) => (
                <Card key={book.id} className="hover:bg-secondary transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{book.category}</Badge>
                      <Heart className="h-4 w-4 text-red-500" />
                    </div>
                    <CardTitle className="text-lg line-clamp-2" onClick={() => handleBookClick(book)}>
                      {book.title}
                    </CardTitle>
                    <CardDescription>{book.author}</CardDescription>
                  </CardHeader>
                  <CardContent onClick={() => handleBookClick(book)}>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{book.content.substring(0, 150)}...</p>
                    <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {book.pages} págs
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {book.reading_time_minutes} min
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {book.read_count} lecturas
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">{getStatusText(book.id)}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleBookmark(book.id)
                        }}
                      >
                        <Bookmark className="h-4 w-4 text-blue-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <BookmarkPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes libros guardados</h3>
                  <p className="text-gray-600 mb-4">Guarda libros interesantes para acceder a ellos fácilmente</p>
                  <Button onClick={() => document.querySelector('[value="explore"]')?.click()}>
                    Explorar Biblioteca
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Reading Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Estadísticas de Lectura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Libros completados:</span>
                    <span className="font-medium">{getCompletedBooks().length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Libros en progreso:</span>
                    <span className="font-medium">{getBooksInProgress().length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Libros guardados:</span>
                    <span className="font-medium">{getBookmarkedBooks().length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total de páginas leídas:</span>
                    <span className="font-medium">
                      {getCompletedBooks().reduce((sum, book) => sum + (book.pages || 0), 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Distribución por Categoría
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((category) => {
                    const categoryBooks = books.filter((book) => book.category === category)
                    const percentage = Math.round((categoryBooks.length / books.length) * 100)
                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{category}</span>
                          <span>{categoryBooks.length} libros</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Reading Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objetivos de Lectura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Meta mensual: 5 libros</span>
                      <span>{getCompletedBooks().length}/5</span>
                    </div>
                    <Progress value={(getCompletedBooks().length / 5) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Páginas este mes:</span>
                      <span>{getCompletedBooks().reduce((sum, book) => sum + (book.pages || 0), 0)}</span>
                    </div>
                    <Progress
                      value={Math.min(
                        (getCompletedBooks().reduce((sum, book) => sum + (book.pages || 0), 0) / 500) * 100,
                        100,
                      )}
                      className="h-2"
                    />
                  </div>
                  <div className="text-center">
                    <Button variant="outline" size="sm">
                      Establecer Nueva Meta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Enhanced Book Details Dialog */}
      <Dialog open={showBookDetails} onOpenChange={setShowBookDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl mb-2">{selectedBook?.title}</DialogTitle>
                <DialogDescription className="text-lg">por {selectedBook?.author}</DialogDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => selectedBook && toggleBookmark(selectedBook.id)}>
                {selectedBook && isBookmarked(selectedBook.id) ? (
                  <Bookmark className="h-5 w-5 text-blue-600" />
                ) : (
                  <BookmarkPlus className="h-5 w-5" />
                )}
              </Button>
            </div>
          </DialogHeader>
          {selectedBook && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 flex-wrap">
                <Badge className="text-sm">{selectedBook.category}</Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <FileText className="h-4 w-4" />
                  {selectedBook.pages} páginas
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {selectedBook.reading_time_minutes} min de lectura
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Eye className="h-4 w-4" />
                  {selectedBook.read_count} lecturas
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <BarChart3 className="h-4 w-4" />
                  {selectedBook.content_length?.toLocaleString()} caracteres
                </div>
              </div>

              {/* Current Reading Status */}
              {getBookStatus(selectedBook.id) && (
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-900 mb-2">Estado de Lectura</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-800">{getStatusText(selectedBook.id)}</span>
                    <span className="text-blue-800">{getReadingProgress(selectedBook.id)}%</span>
                  </div>
                  <Progress value={getReadingProgress(selectedBook.id)} className="h-2" />
                </div>
              )}

              <div>
                <h4 className="font-semibold text-lg mb-3">Descripción del libro:</h4>
                <p className="text-gray-700 leading-relaxed text-base">{selectedBook.content.substring(0, 500)}...</p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Tags relacionados:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBook.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Reading Target Selection */}
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-900 mb-3">Selecciona tu objetivo de lectura:</h4>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <Button
                    variant={selectedReadingTarget === 30 ? "default" : "outline"}
                    onClick={() => setSelectedReadingTarget(30)}
                    className="flex flex-col items-center p-4 h-auto"
                  >
                    <div className="text-lg font-bold">30%</div>
                    <div className="text-xs">Lectura Rápida</div>
                    <div className="text-xs text-gray-600">
                      {Math.round((selectedBook.reading_time_minutes || 0) * 0.3)} min
                    </div>
                  </Button>
                  <Button
                    variant={selectedReadingTarget === 60 ? "default" : "outline"}
                    onClick={() => setSelectedReadingTarget(60)}
                    className="flex flex-col items-center p-4 h-auto"
                  >
                    <div className="text-lg font-bold">60%</div>
                    <div className="text-xs">Lectura Completa</div>
                    <div className="text-xs text-gray-600">
                      {Math.round((selectedBook.reading_time_minutes || 0) * 0.6)} min
                    </div>
                  </Button>
                  <Button
                    variant={selectedReadingTarget === 100 ? "default" : "outline"}
                    onClick={() => setSelectedReadingTarget(100)}
                    className="flex flex-col items-center p-4 h-auto"
                  >
                    <div className="text-lg font-bold">100%</div>
                    <div className="text-xs">Lectura Total</div>
                    <div className="text-xs text-gray-600">{selectedBook.reading_time_minutes} min</div>
                  </Button>
                </div>
                <p className="text-sm text-green-800">
                  {selectedReadingTarget === 30 && "Obtén los conceptos clave y ideas principales del libro."}
                  {selectedReadingTarget === 60 && "Comprende a fondo el contenido con ejemplos y aplicaciones."}
                  {selectedReadingTarget === 100 && "Experiencia completa con todos los detalles y ejercicios."}
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1" onClick={() => startReading(selectedReadingTarget)}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Leer {selectedReadingTarget}%
                </Button>
                <Button variant="outline" onClick={() => selectedBook && toggleBookmark(selectedBook.id)}>
                  {isBookmarked(selectedBook.id) ? (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Guardado
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="h-4 w-4 mr-2" />
                      Guardar
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Enhanced Reading View Dialog */}
      <Dialog open={isReading} onOpenChange={() => setIsReading(false)}>
        <DialogContent className="max-w-6xl h-[95vh] flex flex-col p-0 bg-white">
          {/* Fixed Header with Progress */}
          <DialogHeader className="flex-shrink-0 p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => setIsReading(false)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <DialogTitle className="text-xl">{selectedBook?.title}</DialogTitle>
                  <DialogDescription>
                    por {selectedBook?.author} • Objetivo: {selectedReadingTarget}%
                  </DialogDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{selectedBook?.category}</Badge>
                <Button variant="ghost" size="sm" onClick={() => selectedBook && toggleBookmark(selectedBook.id)}>
                  {selectedBook && isBookmarked(selectedBook.id) ? (
                    <Bookmark className="h-4 w-4 text-blue-600" />
                  ) : (
                    <BookmarkPlus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Reading Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progreso de lectura ({selectedReadingTarget}% objetivo)</span>
                <span>{getReadingProgress(selectedBook?.id || 0)}% completado</span>
              </div>
              <Progress value={getReadingProgress(selectedBook?.id || 0)} className="h-3" />
            </div>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-6">
              <div className="py-4">
                <div className="prose prose-lg max-w-none">
                  {selectedBook && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">
                          📖 Contenido del Libro ({selectedReadingTarget}%)
                        </h3>
                        <p className="text-blue-800">
                          {selectedReadingTarget === 30 && "Leyendo los conceptos clave y ideas principales"}
                          {selectedReadingTarget === 60 && "Leyendo contenido completo con ejemplos"}
                          {selectedReadingTarget === 100 && "Leyendo contenido completo con todos los detalles"}
                        </p>
                      </div>

                      <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                        {selectedReadingTarget === 30 &&
                          selectedBook.content.substring(0, Math.floor(selectedBook.content.length * 0.3))}
                        {selectedReadingTarget === 60 &&
                          selectedBook.content.substring(0, Math.floor(selectedBook.content.length * 0.6))}
                        {selectedReadingTarget === 100 && selectedBook.content}
                      </div>

                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="font-semibold text-lg mb-3">🏷️ Tags y Temas:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedBook.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-semibold text-lg mb-3 text-green-900">💡 Próximos Pasos Recomendados:</h4>
                        <ul className="list-disc list-inside space-y-2 text-green-800">
                          <li>Reflexiona sobre cómo estos conceptos se aplican a tu situación actual</li>
                          <li>Identifica 2-3 ideas clave que puedes implementar inmediatamente</li>
                          <li>Crea un plan de acción específico con fechas y métricas</li>
                          <li>Comparte tus aprendizajes con colegas o mentores</li>
                          <li>Programa una revisión en 30 días para evaluar tu progreso</li>
                        </ul>
                      </div>

                      {/* Reading completion actions */}
                      <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
                        <h4 className="font-semibold text-lg mb-3 text-yellow-900">
                          🎯 ¿Completaste tu objetivo de {selectedReadingTarget}%?
                        </h4>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => updateBookStatus("completed", selectedReadingTarget)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marcar como Completado
                          </Button>
                          <Button variant="outline" onClick={() => updateBookStatus("paused")}>
                            <Pause className="h-4 w-4 mr-2" />
                            Pausar Lectura
                          </Button>
                          <Button variant="outline" onClick={() => setShowTargetDialog(true)}>
                            <Target className="h-4 w-4 mr-2" />
                            Cambiar Objetivo
                          </Button>
                        </div>
                      </div>

                      {/* Extra padding at bottom */}
                      <div className="h-20"></div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 p-6 pt-4 border-t bg-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Eye className="h-4 w-4" />
                {selectedBook?.read_count} personas han leído este libro
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsReading(false)}>
                  Cerrar
                </Button>
                <Button onClick={() => updateBookStatus("completed", selectedReadingTarget)}>
                  Completar Lectura ({selectedReadingTarget}%)
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Target Change Dialog */}
      <Dialog open={showTargetDialog} onOpenChange={setShowTargetDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar Objetivo de Lectura</DialogTitle>
            <DialogDescription>Selecciona un nuevo porcentaje objetivo para este libro</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={selectedReadingTarget === 30 ? "default" : "outline"}
                onClick={() => setSelectedReadingTarget(30)}
                className="flex flex-col items-center p-4 h-auto"
              >
                <div className="text-lg font-bold">30%</div>
                <div className="text-xs">Rápida</div>
              </Button>
              <Button
                variant={selectedReadingTarget === 60 ? "default" : "outline"}
                onClick={() => setSelectedReadingTarget(60)}
                className="flex flex-col items-center p-4 h-auto"
              >
                <div className="text-lg font-bold">60%</div>
                <div className="text-xs">Completa</div>
              </Button>
              <Button
                variant={selectedReadingTarget === 100 ? "default" : "outline"}
                onClick={() => setSelectedReadingTarget(100)}
                className="flex flex-col items-center p-4 h-auto"
              >
                <div className="text-lg font-bold">100%</div>
                <div className="text-xs">Total</div>
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowTargetDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  updateBookStatus("reading", selectedReadingTarget)
                  setShowTargetDialog(false)
                }}
              >
                Actualizar Objetivo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
