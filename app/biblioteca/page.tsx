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
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedBook, setSelectedBook] = useState<KnowledgeBook | null>(null)
  const [sortBy, setSortBy] = useState<string>("popular")
  const [isReading, setIsReading] = useState(false)

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

      // Load all books
      const { data: booksData, error: booksError } = await supabase.from("knowledge_base").select("*")

      if (booksError) throw booksError

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

      const uniqueCategories = [...new Set(categoriesData?.map((c) => c.category) || [])]

      setBooks(booksData || [])
      setCategories(uniqueCategories)
      setBookmarks(bookmarksData || [])
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
    }

    setFilteredBooks(filtered)
  }

  const handleBookClick = async (book: KnowledgeBook) => {
    setSelectedBook(book)

    // Increment read count
    try {
      await supabase.rpc("increment_read_count", { book_id: book.id })

      // Update local state
      setBooks((prevBooks) => prevBooks.map((b) => (b.id === book.id ? { ...b, read_count: b.read_count + 1 } : b)))
    } catch (error) {
      console.error("Error incrementing read count:", error)
    }
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

  const getPopularBooks = () => {
    return books.sort((a, b) => b.read_count - a.read_count).slice(0, 6)
  }

  const getRecentBooks = () => {
    return books.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6)
  }

  const getBookmarkedBooks = () => {
    return books.filter((book) => isBookmarked(book.id))
  }

  const startReading = () => {
    setIsReading(true)
  }

  const stopReading = () => {
    setIsReading(false)
  }

  const generateBookSummary = (book: KnowledgeBook) => {
    // Generate a comprehensive summary based on the book's content and category
    const summaries: { [key: string]: string } = {
      Liderazgo: `**Resumen Ejecutivo:**

Este libro explora los principios fundamentales del liderazgo efectivo en el mundo moderno. ${book.title} presenta un enfoque integral para desarrollar habilidades de liderazgo que trascienden los métodos tradicionales.

**Conceptos Clave:**

• **Liderazgo Auténtico**: La importancia de liderar desde la autenticidad personal y los valores propios
• **Inteligencia Emocional**: Cómo gestionar las emociones propias y de otros para crear equipos más efectivos
• **Comunicación Efectiva**: Técnicas para transmitir visión, inspirar y motivar a los equipos
• **Toma de Decisiones**: Marcos para tomar decisiones difíciles bajo presión e incertidumbre
• **Desarrollo de Equipos**: Estrategias para construir equipos de alto rendimiento y cultura organizacional

**Aplicaciones Prácticas:**

1. **Autoevaluación de Liderazgo**: Herramientas para identificar fortalezas y áreas de mejora
2. **Plan de Desarrollo Personal**: Metodología para crear un plan de crecimiento como líder
3. **Técnicas de Coaching**: Cómo desarrollar y mentorear a otros líderes
4. **Gestión del Cambio**: Estrategias para liderar organizaciones a través de transformaciones

**Lecciones Principales:**

- El liderazgo efectivo comienza con el autoconocimiento y la autenticidad
- La capacidad de inspirar y motivar es más importante que la autoridad formal
- Los mejores líderes son aquellos que desarrollan a otros líderes
- La adaptabilidad y la resiliencia son características esenciales del liderazgo moderno

**Impacto en tu Carrera:**

Este libro te proporcionará las herramientas necesarias para:
- Desarrollar tu estilo de liderazgo único y auténtico
- Mejorar tu capacidad de influir positivamente en otros
- Construir equipos más comprometidos y productivos
- Navegar desafíos organizacionales complejos con confianza`,

      Productividad: `**Resumen Ejecutivo:**

${book.title} presenta un sistema integral para maximizar la productividad personal y profesional. Este libro combina principios de gestión del tiempo, formación de hábitos y optimización de procesos para ayudarte a lograr más con menos esfuerzo.

**Conceptos Fundamentales:**

• **Gestión de Energía vs. Tiempo**: Cómo optimizar tu energía natural para máximo rendimiento
• **Principio de Pareto**: Identificar el 20% de actividades que generan el 80% de resultados
• **Flujo de Trabajo**: Crear sistemas que minimicen la fricción y maximicen la eficiencia
• **Eliminación de Distracciones**: Técnicas para mantener el foco en lo verdaderamente importante
• **Automatización Inteligente**: Usar tecnología y sistemas para reducir trabajo repetitivo

**Metodologías Clave:**

1. **Técnica Pomodoro Avanzada**: Gestión de tiempo en bloques con descansos estratégicos
2. **Matriz de Eisenhower**: Priorización basada en urgencia e importancia
3. **Getting Things Done (GTD)**: Sistema completo de organización y seguimiento
4. **Batching**: Agrupar tareas similares para mayor eficiencia
5. **Review Semanal**: Proceso de reflexión y planificación continua

**Herramientas Prácticas:**

- Templates para planificación diaria, semanal y mensual
- Checklists para optimizar rutinas matutinas y vespertinas
- Sistemas de seguimiento de hábitos y metas
- Técnicas de delegación efectiva
- Métodos para medir y mejorar la productividad

**Transformación Personal:**

Al aplicar estos principios, experimentarás:
- Mayor claridad sobre tus prioridades y objetivos
- Reducción significativa del estrés y la sobrecarga
- Más tiempo libre para actividades que realmente importan
- Sensación de control y progreso constante hacia tus metas
- Mejor equilibrio entre vida personal y profesional

**Plan de Implementación:**

El libro incluye un plan de 30 días para implementar gradualmente estos sistemas, asegurando que los cambios sean sostenibles y se conviertan en hábitos permanentes.`,

      "Desarrollo de Carrera": `**Resumen Ejecutivo:**

${book.title} es una guía completa para navegar y acelerar tu desarrollo profesional en el mercado laboral actual. Este libro combina estrategias tradicionales de carrera con enfoques modernos adaptados a la economía digital.

**Pilares del Desarrollo Profesional:**

• **Autoconocimiento Profundo**: Identificar fortalezas, valores y pasiones para alinear carrera con propósito
• **Construcción de Marca Personal**: Desarrollar una reputación profesional sólida y diferenciada
• **Networking Estratégico**: Crear y mantener relaciones profesionales valiosas y auténticas
• **Aprendizaje Continuo**: Mantenerse relevante a través de la actualización constante de habilidades
• **Negociación y Comunicación**: Habilidades esenciales para avanzar en cualquier carrera

**Estrategias de Crecimiento:**

1. **Mapeo de Carrera**: Herramientas para visualizar y planificar tu trayectoria profesional
2. **Desarrollo de Habilidades**: Framework para identificar y desarrollar competencias clave
3. **Gestión de Oportunidades**: Cómo identificar, evaluar y aprovechar oportunidades de crecimiento
4. **Transiciones Profesionales**: Navegar cambios de industria, función o nivel jerárquico
5. **Emprendimiento Interno**: Actuar como emprendedor dentro de organizaciones establecidas

**Herramientas de Carrera:**

- Templates para CV y LinkedIn optimizados
- Guías para entrevistas de trabajo efectivas
- Frameworks para evaluación de oportunidades
- Planes de desarrollo de habilidades personalizados
- Estrategias de negociación salarial

**Mentalidad de Crecimiento:**

El libro enfatiza la importancia de:
- Adoptar una mentalidad de crecimiento continuo
- Ver los desafíos como oportunidades de aprendizaje
- Construir resiliencia para superar obstáculos profesionales
- Mantener curiosidad y apertura a nuevas posibilidades
- Equilibrar ambición con bienestar personal

**Resultados Esperados:**

Al aplicar estos principios, lograrás:
- Mayor claridad sobre tu dirección profesional
- Aceleración en tu progreso de carrera
- Mejor posicionamiento en el mercado laboral
- Red profesional más sólida y valiosa
- Confianza para tomar decisiones de carrera importantes`,

      Comunicación: `**Resumen Ejecutivo:**

${book.title} explora las dimensiones de la comunicación efectiva en contextos profesionales y personales. Este libro presenta técnicas avanzadas para mejorar tu capacidad de conectar, influir y colaborar con otros.

**Fundamentos de Comunicación:**

• **Escucha Activa**: Técnicas para comprender verdaderamente lo que otros comunican
• **Comunicación No Verbal**: El poder del lenguaje corporal, tono y presencia
• **Adaptación de Mensaje**: Ajustar comunicación según audiencia y contexto
• **Storytelling**: Usar narrativas para hacer mensajes más memorables e impactantes
• **Comunicación Digital**: Navegar la comunicación en entornos virtuales y remotos

**Habilidades Avanzadas:**

1. **Presentaciones Impactantes**: Crear y entregar presentaciones que inspiren acción
2. **Negociación Colaborativa**: Técnicas para llegar a acuerdos win-win
3. **Manejo de Conflictos**: Transformar desacuerdos en oportunidades de crecimiento
4. **Feedback Constructivo**: Dar y recibir retroalimentación de manera efectiva
5. **Comunicación Intercultural**: Navegar diferencias culturales en comunicación

**Aplicaciones Prácticas:**

- Frameworks para estructurar conversaciones difíciles
- Técnicas para comunicar ideas complejas de manera simple
- Estrategias para construir rapport y confianza rápidamente
- Métodos para manejar objeciones y resistencia
- Herramientas para comunicación en crisis

**Transformación Personal:**

Dominar estas habilidades te permitirá:
- Construir relaciones más profundas y significativas
- Influir positivamente en decisiones importantes
- Resolver conflictos de manera constructiva
- Liderar equipos con mayor efectividad
- Avanzar más rápidamente en tu carrera profesional

**Impacto a Largo Plazo:**

La comunicación efectiva es la base de prácticamente todo éxito profesional y personal. Este libro te proporciona las herramientas para convertirte en un comunicador excepcional.`,
    }

    // Return category-specific summary or generate a general one
    return (
      summaries[book.category] ||
      `**Resumen del Libro:**

${book.content}

**Conceptos Clave:**

Este libro aborda temas fundamentales en ${book.category.toLowerCase()}, proporcionando insights valiosos y estrategias prácticas para el crecimiento profesional y personal.

**Aplicación Práctica:**

Las ideas presentadas en este libro pueden aplicarse inmediatamente en tu vida profesional, ayudándote a desarrollar nuevas habilidades y perspectivas que impulsarán tu carrera.

**Valor para tu Desarrollo:**

Al estudiar este material, ganarás una comprensión más profunda de ${book.category.toLowerCase()} y cómo aplicar estos principios para lograr mejores resultados en tu trabajo y vida personal.`
    )
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
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">📚 Biblioteca de Conocimiento</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explora nuestra colección de {books.length} libros especializados en desarrollo profesional
        </p>
      </div>

      <Tabs defaultValue="explore" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="explore">Explorar</TabsTrigger>
          <TabsTrigger value="popular">Populares</TabsTrigger>
          <TabsTrigger value="recent">Recientes</TabsTrigger>
          <TabsTrigger value="bookmarks">Guardados ({getBookmarkedBooks().length})</TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar libros por título, autor, contenido..."
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
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Más populares</SelectItem>
                    <SelectItem value="recent">Más recientes</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                    <SelectItem value="author">Por autor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="hover:bg-secondary transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="outline">{book.category}</Badge>
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
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">{book.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Eye className="h-4 w-4" />
                      {book.read_count} lecturas
                    </div>
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
            {getPopularBooks().map((book, index) => (
              <Card key={book.id} className="hover:bg-secondary transition-shadow cursor-pointer relative">
                <div className="absolute top-4 left-4 z-10">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <CardHeader className="pt-12">
                  <Badge variant="outline" className="w-fit">
                    {book.category}
                  </Badge>
                  <CardTitle className="text-lg line-clamp-2" onClick={() => handleBookClick(book)}>
                    {book.title}
                  </CardTitle>
                  <CardDescription>{book.author}</CardDescription>
                </CardHeader>
                <CardContent onClick={() => handleBookClick(book)}>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">{book.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {book.read_count} lecturas
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
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getRecentBooks().map((book) => (
              <Card key={book.id} className="hover:bg-secondary transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{book.category}</Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      Nuevo
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2" onClick={() => handleBookClick(book)}>
                    {book.title}
                  </CardTitle>
                  <CardDescription>{book.author}</CardDescription>
                </CardHeader>
                <CardContent onClick={() => handleBookClick(book)}>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">{book.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <TrendingUp className="h-4 w-4" />
                      {book.read_count} lecturas
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
            ))}
          </div>
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
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{book.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <TrendingUp className="h-4 w-4" />
                        {book.read_count} lecturas
                      </div>
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
      </Tabs>

      {/* Book Detail Dialog */}
      <Dialog open={!!selectedBook && !isReading} onOpenChange={() => setSelectedBook(null)}>
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
              <div className="flex items-center gap-4">
                <Badge className="text-sm">{selectedBook.category}</Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Eye className="h-4 w-4" />
                  {selectedBook.read_count} lecturas
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  Agregado {new Date(selectedBook.created_at).toLocaleDateString()}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-3">Sobre este libro:</h4>
                <p className="text-gray-700 leading-relaxed text-base">{selectedBook.content}</p>
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

              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1" onClick={startReading}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Leer Ahora
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

      {/* Reading View Dialog - Fixed Layout */}
      <Dialog open={isReading} onOpenChange={stopReading}>
        <DialogContent className="max-w-6xl h-[95vh] flex flex-col p-0 bg-white">
          {/* Fixed Header */}
          <DialogHeader className="flex-shrink-0 p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={stopReading}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <DialogTitle className="text-xl">{selectedBook?.title}</DialogTitle>
                  <DialogDescription>por {selectedBook?.author}</DialogDescription>
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
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-6">
              <div className="py-4">
                <div className="prose prose-lg max-w-none">
                  {selectedBook && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">📖 Resumen del Libro</h3>
                        <p className="text-blue-800">{selectedBook.content}</p>
                      </div>

                      <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                        {generateBookSummary(selectedBook)}
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

                      {/* Extra padding at bottom to ensure buttons are not covered */}
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
                <Button variant="outline" onClick={stopReading}>
                  Cerrar
                </Button>
                <Button onClick={() => selectedBook && toggleBookmark(selectedBook.id)}>
                  {selectedBook && isBookmarked(selectedBook.id) ? "Guardado" : "Guardar Libro"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
