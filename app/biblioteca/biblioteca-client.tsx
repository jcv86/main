"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/session-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Target, User, BookOpen, BookMarked, CheckCircle, Filter, TrendingUp, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Book {
  id: string
  title: string
  author: string
  slug?: string
  content?: string
  tags?: string[]
  read_count?: number
  category?: string
  language?: string
  source_type?: "libro_original" | "recurso_chileno"
}

function getContentQualityBadge(book: Book) {
  const readCount = book.read_count || 0
  if (readCount > 100) return { label: "Muy Popular", color: "bg-green/50 text-white" }
  if (readCount > 50) return { label: "Popular", color: "bg-blue/50 text-white" }
  return { label: "Nuevo", color: "bg-muted/50 text-white" }
}

export default function BibliotecaPage() {
  const { user } = useSession()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTag, setSelectedTag] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("popularity")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [resourceSection, setResourceSection] = useState<"libros" | "recursos" | "todos">("todos")
  const router = useRouter()

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await fetch("/api/books")
        if (!response.ok) throw new Error("Failed to fetch books")
        const data = await response.json()
        console.log("[v0] Successfully fetched", data.length, "books from database")
        setBooks(data)
      } catch (error) {
        console.error("[v0] Error loading books:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBooks()
  }, [])

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.email) {
        console.log("[v0] No user email available, skipping profile load")
        loadStarterBooks()
        return
      }

      try {
        setLoadingProfile(true)
        console.log("[v0] Loading user profile for:", user.email)

        const response = await fetch(`/api/test-results`)
        if (!response.ok) {
          console.log("[v0] No test results found for user")
          loadStarterBooks()
          return
        }

        const results = await response.json()
        console.log("[v0] User test results:", results)

        const resultsArray = Array.isArray(results) ? results : [results]
        const discResult = resultsArray.find((r: any) => r.test_type === "disc")

        if (discResult?.results) {
          setUserProfile(discResult.results)
          console.log("[v0] User DISC profile loaded:", discResult.results)
        } else {
          loadStarterBooks()
        }
      } catch (error) {
        console.error("[v0] Error loading user profile:", error)
        loadStarterBooks()
      } finally {
        setLoadingProfile(false)
      }
    }

    const loadStarterBooks = () => {
      if (books.length === 0) return

      console.log("[v0] Loading starter books for users without test results")

      const starterTags = ["autoconocimiento", "propósito", "carrera", "habilidades-blandas", "objetivos", "liderazgo"]
      const filtered = books.filter((book) => {
        if (!Array.isArray(book.tags)) return false
        return book.tags.some((tag) => starterTags.includes(tag.toLowerCase()))
      })

      const sorted = filtered.sort((a, b) => (b.read_count || 0) - (a.read_count || 0)).slice(0, 6)

      console.log("[v0] Loaded", sorted.length, "starter books")
      setRecommendedBooks(sorted)
    }

    loadUserProfile()
  }, [user?.email, books])

  useEffect(() => {
    if (!userProfile || books.length === 0) {
      return
    }

    console.log("[v0] Filtering books for user profile...")

    const scores = userProfile.scores || {}
    const dominantType = Object.entries(scores).reduce((a: any, b: any) => (a[1] > b[1] ? a : b))[0]

    console.log("[v0] User dominant DISC type:", dominantType)

    const discTagsMap: Record<string, string[]> = {
      D: ["liderazgo", "éxito", "productividad", "objetivos", "disciplina", "transformación"],
      I: ["comunicación", "relaciones", "habilidades-blandas", "autoayuda", "psicología"],
      S: ["hábitos", "concentración", "resiliencia", "mindfulness", "autocuidado"],
      C: ["planificación", "gestión-de-proyectos", "metodología", "exito"],
    }

    const relevantTags = discTagsMap[dominantType] || []
    console.log("[v0] Relevant tags for profile:", relevantTags)

    const filtered = books.filter((book) => {
      if (!Array.isArray(book.tags)) return false
      return book.tags.some((tag) => relevantTags.includes(tag.toLowerCase()))
    })

    console.log("[v0] Filtered", filtered.length, "recommended books")

    const sorted = filtered.sort((a, b) => (b.read_count || 0) - (a.read_count || 0)).slice(0, 6)

    setRecommendedBooks(sorted)
  }, [userProfile, books])

  // Separate books from Chilean resources FIRST
  const originalBooks = books.filter((b) => b.source_type === "libro_original")
  const chileanResources = books.filter((b) => b.source_type === "recurso_chileno")

  // Stats should only count BOOKS, not Chilean resources (which are surveys/databases)
  const stats = {
    totalBooks: originalBooks.length,
    totalResources: chileanResources.length,
    completed: originalBooks.filter((b) => b.content && b.content.length > 500).length,
    categories: [...new Set(originalBooks.map((b) => b.category).filter(Boolean))].length,
    authors: [...new Set(originalBooks.map((b) => b.author))].length,
    avgReading: Math.round(originalBooks.reduce((sum, b) => sum + (b.read_count || 0), 0) / (originalBooks.length || 1)),
  }

  const allTags = [...new Set(books.flatMap((b) => b.tags || []))].sort()
  const popularTags = allTags.slice(0, 15)

  const getFilteredBooks = () => {
    let booksToFilter = books
    if (resourceSection === "libros") booksToFilter = originalBooks
    if (resourceSection === "recursos") booksToFilter = chileanResources

    return booksToFilter
      .filter((book) => {
        const matchesSearch =
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === "all" || book.category === selectedCategory
        const matchesTag = !selectedTag || (book.tags && book.tags.includes(selectedTag))
        const matchesLanguage = selectedLanguage === "all" || book.language === selectedLanguage
        return matchesSearch && matchesCategory && matchesTag && matchesLanguage
      })
      .sort((a, b) => {
        if (sortBy === "popularity") return (b.read_count || 0) - (a.read_count || 0)
        if (sortBy === "title") return a.title.localeCompare(b.title)
        if (sortBy === "author") return a.author.localeCompare(b.author)
        return 0
      })
  }

  const filteredBooks = getFilteredBooks()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-background">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-purple400400">Biblioteca Digital</h1>
              <p className="text-muted-foreground dark:text-muted/30 font-medium">
                {user
                  ? `Hola ${user.email?.split("@")[0]}, aquí están tus recursos personalizados`
                  : "Descubre recursos valiosos para tu crecimiento personal y profesional"}
              </p>
            </div>
          </div>
        </div>

      {/* Personalized Recommendations Section */}
      {user && (
        <Card className="mb-8 border-2 border-blue/20 dark:border-blue bg-background">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-blue dark:text-blue/40" />
                <div>
                  <CardTitle className="text-xl text-foreground">
                    {userProfile ? "Recomendados para Tu Perfil" : "Comienza Tu Viaje Profesional"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1">
                    {userProfile
                      ? `Basado en tu perfil ${Object.entries(userProfile.scores || {})
                          .reduce((a: any, b: any) => (a[1] > b[1] ? a : b))[0]
                          .toString()
                          .toUpperCase()}, estos libros te ayudarán a potenciar tus fortalezas`
                      : "Libros esenciales para comenzar tu desarrollo. Completa el Test de Perfil Cerebral para recomendaciones personalizadas."}
                  </p>
                </div>
              </div>
              {!userProfile && (
                <Button
                  onClick={() => router.push("/test/disc")}
                  className="bg-blue hover:bg-blue dark:bg-blue/50 dark:hover:bg-blue"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Hacer Test DISC
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loadingProfile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse bg-background dark:bg-card">
                    <CardHeader className="pb-3">
                      <div className="h-4 bg-muted/20 dark:bg-muted/70 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted/20 dark:bg-muted/70 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-muted/20 dark:bg-muted/70 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : recommendedBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedBooks.map((book) => {
                  const qualityBadge = getContentQualityBadge(book)
                  return (
                    <Card
                      key={book.id}
                      className="hover:shadow-lg transition-shadow duration-200 bg-card dark:bg-card border border-muted/20 dark:border-card"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge
                            variant="default"
                            className={
                              userProfile ? "bg-blue dark:bg-blue/50" : "bg-purple dark:bg-purple/50"
                            }
                          >
                            <Target className="h-3 w-3 mr-1" />
                            {userProfile ? "Para ti" : "Recomendado"}
                          </Badge>
                          <Badge className={qualityBadge.color}>{qualityBadge.label}</Badge>
                        </div>
                        <CardTitle className="text-base leading-tight text-foreground">{book.title}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground dark:text-muted-foreground">
                          <User className="h-4 w-4 mr-1" />
                          {book.author}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-3 line-clamp-2">
                          {book.content ? book.content.substring(0, 100) + "..." : "Sin descripción disponible"}
                        </p>

                        {Array.isArray(book.tags) && book.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {book.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <Button
                          className="w-full"
                          size="sm"
                          onClick={() => router.push(`/biblioteca/${book.slug || book.id}`)}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Leer ahora
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground dark:text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground dark:text-muted-foreground">No hay recomendaciones disponibles en este momento</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resource Section Tabs */}
      <Tabs
        value={resourceSection}
        onValueChange={(value) => setResourceSection(value as "libros" | "recursos" | "todos")}
        className="mb-8"
      >
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="todos" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Todos ({books.length})
          </TabsTrigger>
          <TabsTrigger value="libros" className="flex items-center gap-2">
            📚 Libros ({originalBooks.length})
          </TabsTrigger>
          <TabsTrigger value="recursos" className="flex items-center gap-2">
            📋 Recursos ({chileanResources.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Libros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BookMarked className="h-5 w-5 text-blue" />
              <span className="text-2xl font-bold">{stats.totalBooks}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Libros Completos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green" />
              <span className="text-2xl font-bold">{stats.completed}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Recursos Chilenos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-purple" />
              <span className="text-2xl font-bold">{stats.totalResources}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-orange" />
              <span className="text-2xl font-bold">{stats.categories}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Autores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red" />
              <span className="text-2xl font-bold">{stats.authors}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar libros, autores, temas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Idiomas</SelectItem>
              <SelectItem value="español">Español</SelectItem>
              <SelectItem value="english">English</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {[...new Set(books.map((b) => b.category).filter(Boolean))].map((cat) => (
                <SelectItem key={cat} value={cat!}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Más populares" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Más populares</SelectItem>
              <SelectItem value="title">Título A-Z</SelectItem>
              <SelectItem value="author">Autor A-Z</SelectItem>
            </SelectContent>
          </Select>

          {(selectedTag || selectedLanguage !== "all") && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedTag("")
                setSelectedLanguage("all")
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </div>

        {/* Popular Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Tags populares:</span>
          {popularTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className="cursor-pointer hover:bg-blue/10"
              onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
            >
              {tag} ({books.filter((b) => b.tags && b.tags.includes(tag)).length})
            </Badge>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {["all", "completed", "popular", "recent", "favorites"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab ? "text-blue border-b-2 border-blue" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "all" && `Todos (${books.length})`}
            {tab === "completed" && `Completos (${stats.completed})`}
            {tab === "popular" && `Populares (${books.filter((b) => (b.read_count || 0) > 10).length})`}
            {tab === "recent" && `Recientes (${books.length})`}
            {tab === "favorites" && "Favoritos (0)"}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando biblioteca...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No se encontraron libros que coincidan con tu búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => {
            const qualityBadge = getContentQualityBadge(book)
            return (
              <Card
                key={book.id}
                className="hover:shadow-lg transition-shadow duration-200 bg-card dark:bg-card border border-muted/20 dark:border-card"
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    {book.category && <Badge variant="outline">{book.category}</Badge>}
                    <Badge className={qualityBadge.color}>{qualityBadge.label}</Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight text-foreground">{book.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground dark:text-muted-foreground">
                    <User className="h-4 w-4 mr-1" />
                    {book.author}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-4 line-clamp-3">
                    {book.content ? book.content.substring(0, 250) + "..." : "Sin descripción disponible"}
                  </p>

                  {Array.isArray(book.tags) && book.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {book.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => router.push(`/biblioteca/${book.slug || book.id}`)}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Leer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
      </div>
    </div>
  )
}
