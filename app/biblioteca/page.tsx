"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, Filter, Clock, User, TrendingUp, Star, Bookmark, Eye, Heart, X, Tag } from "lucide-react"

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
}

export default function BibliotecaPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTag, setSelectedTag] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("popularity")
  const [activeTab, setActiveTab] = useState("all")

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
        console.error("Error loading books:", error)
        // Datos de respaldo mejorados
        setBooks([
          {
            id: 1,
            title: "Organízate con Eficacia",
            author: "David Allen",
            category: "Productividad",
            content: `Organízate con Eficacia (Getting Things Done) es un sistema revolucionario de gestión del tiempo y la productividad que ha transformado la vida de millones de personas en todo el mundo.

**El Problema Fundamental:**
Nuestra mente no está diseñada para recordar tareas y compromisos. Cuando intentamos mantener todo en nuestra cabeza, experimentamos estrés constante y perdemos claridad mental.

**Los Cinco Pasos del Método GTD:**

**1. Capturar**
- Recopila todo lo que llame tu atención en bandejas de entrada confiables
- Usa herramientas como libretas, aplicaciones o grabadoras de voz
- El objetivo es sacar todo de tu mente y ponerlo en un sistema externo

**2. Aclarar**
- Procesa cada elemento de tus bandejas de entrada
- Pregúntate: "¿Es accionable?"
- Si no es accionable: elimínalo, archívalo o ponlo en "algún día/tal vez"
- Si es accionable: define la siguiente acción específica

**3. Organizar**
- Coloca los elementos accionables en las listas apropiadas
- Usa contextos como @llamadas, @ordenador, @recados
- Mantén un calendario solo para citas y compromisos con fecha específica

**4. Reflexionar**
- Revisa semanalmente todo tu sistema
- Actualiza listas, proyectos y compromisos
- Mantén tu sistema actualizado y confiable

**5. Comprometerse**
- Usa tu sistema para tomar decisiones sobre qué hacer
- Confía en tu sistema para elegir la siguiente acción
- Actúa con confianza sabiendo que no se te olvida nada

GTD no es solo un sistema de productividad, es una forma de vida que te permite estar presente y enfocado en lo que realmente importa.`,
            tags: ["productividad", "organización", "gestión del tiempo", "gtd", "eficiencia"],
            slug: "organizate-con-eficacia",
            read_count: 2847,
            created_at: "2024-01-15T00:00:00Z",
            updated_at: "2024-01-20T00:00:00Z",
          },
          {
            id: 2,
            title: "Inteligencia Emocional",
            author: "Daniel Goleman",
            category: "Psicología",
            content: `La Inteligencia Emocional es la capacidad de reconocer, entender y manejar nuestras propias emociones, así como reconocer, entender e influir en las emociones de otros.

**Los Cinco Componentes de la Inteligencia Emocional:**

**1. Autoconciencia Emocional**
- Reconocer y entender tus propias emociones
- Ser consciente de cómo tus emociones afectan tus pensamientos y comportamiento
- Conocer tus fortalezas y limitaciones emocionales
- Tener confianza en ti mismo basada en el autoconocimiento

**2. Autorregulación**
- Manejar efectivamente las emociones disruptivas e impulsos
- Mantener estándares de honestidad e integridad
- Asumir responsabilidad por tu desempeño personal
- Ser flexible en el manejo del cambio

**3. Motivación**
- Estar impulsado a lograr por el simple placer del logro
- Tener un fuerte impulso para mejorar el desempeño
- Mostrar compromiso con los objetivos del grupo u organización
- Estar listo para actuar en oportunidades y ser optimista incluso frente al fracaso

**4. Empatía**
- Entender las emociones de otros y mostrar interés activo en sus preocupaciones
- Anticipar, reconocer y satisfacer las necesidades de los clientes
- Ayudar a desarrollar las habilidades de otros
- Leer las corrientes políticas y redes sociales de una organización

**5. Habilidades Sociales**
- Ser efectivo en liderar el cambio
- Ser persuasivo y usar habilidades de comunicación efectivas
- Ser experto en construir y liderar equipos
- Manejar disputas y negociar resoluciones

La inteligencia emocional es más predictiva del éxito en la vida que el CI tradicional, y afortunadamente, puede desarrollarse a cualquier edad con práctica y dedicación.`,
            tags: ["inteligencia emocional", "psicología", "liderazgo", "relaciones", "autoconciencia"],
            slug: "inteligencia-emocional",
            read_count: 3156,
            created_at: "2024-01-10T00:00:00Z",
            updated_at: "2024-01-18T00:00:00Z",
          },
          {
            id: 3,
            title: "Los 7 Hábitos de la Gente Altamente Efectiva",
            author: "Stephen R. Covey",
            category: "Desarrollo Personal",
            content: `Los 7 Hábitos de la Gente Altamente Efectiva presenta un enfoque holístico, integrado y centrado en principios para resolver problemas personales y profesionales.

**Paradigmas y Principios:**
Los paradigmas son mapas mentales que determinan cómo vemos el mundo. Los principios son leyes naturales universales que gobiernan la efectividad humana.

**Los 7 Hábitos:**

**VICTORIA PRIVADA (Independencia)**

**Hábito 1: Ser Proactivo**
- Toma responsabilidad de tu vida y decisiones
- Enfócate en tu Círculo de Influencia, no en tu Círculo de Preocupación
- Usa lenguaje proactivo: "Yo puedo", "Yo elegiré", "Yo prefiero"
- Responde basándote en valores, no en condiciones o sentimientos

**Hábito 2: Comenzar con el Fin en Mente**
- Define claramente tu misión y visión personal
- Crea una declaración de misión personal basada en principios
- Visualiza tu funeral: ¿qué te gustaría que dijeran de ti?
- Todos los logros se crean mentalmente antes que físicamente

**Hábito 3: Poner Primero lo Primero**
- Gestiona tu tiempo basándote en principios, no en prioridades
- Enfócate en actividades del Cuadrante II (importante pero no urgente)
- Aprende a decir "no" a lo bueno para decir "sí" a lo mejor
- Organiza y ejecuta alrededor de prioridades

Los 7 hábitos no son técnicas de personalidad superficiales, sino principios fundamentales de efectividad humana que, cuando se practican consistentemente, se convierten en la base del carácter.`,
            tags: ["desarrollo personal", "liderazgo", "efectividad", "hábitos", "principios"],
            slug: "7-habitos-gente-altamente-efectiva",
            read_count: 4521,
            created_at: "2024-01-05T00:00:00Z",
            updated_at: "2024-01-15T00:00:00Z",
          },
          {
            id: 4,
            title: "Cómo Ganar Amigos e Influir sobre las Personas",
            author: "Dale Carnegie",
            category: "Comunicación",
            content: `Este libro clásico enseña técnicas fundamentales para manejar personas, hacer que te aprecien, ganar a la gente a tu manera de pensar y ser un líder.

**PARTE I: TÉCNICAS FUNDAMENTALES PARA TRATAR CON LA GENTE**

**Principio 1: No Critiques, No Condenes, No Te Quejes**
- La crítica es inútil porque pone a la persona a la defensiva
- La crítica hiere el orgullo, lastima el sentido de importancia
- En lugar de criticar, trata de entender por qué hacen lo que hacen

**Principio 2: Demuestra Aprecio Honesto y Sincero**
- El deseo más profundo del ser humano es sentirse importante
- Aprecia genuinamente las buenas cualidades de otros
- Sé específico en tus elogios y hazlos inmediatamente

**Principio 3: Despierta en la Otra Persona un Deseo Vehemente**
- Habla de lo que la otra persona quiere
- Muestra cómo pueden obtener lo que desean
- Conecta tus ideas con sus motivaciones

Los principios de Carnegie siguen siendo relevantes porque se basan en necesidades humanas fundamentales que no cambian con el tiempo: el deseo de sentirse importante, comprendido y apreciado.`,
            tags: ["comunicación", "relaciones interpersonales", "liderazgo", "influencia", "habilidades sociales"],
            slug: "como-ganar-amigos-influir-personas",
            read_count: 5234,
            created_at: "2024-01-12T00:00:00Z",
            updated_at: "2024-01-22T00:00:00Z",
          },
          {
            id: 5,
            title: "Hábitos Atómicos",
            author: "James Clear",
            category: "Desarrollo Personal",
            content: `Los cambios que parecen pequeños e insignificantes al principio se convertirán en resultados extraordinarios si estás dispuesto a mantenerlos durante años. Este es el poder de los hábitos atómicos.

**Las Cuatro Leyes del Cambio de Comportamiento:**

**1ª Ley: Hazlo Obvio**
- Usa intenciones de implementación: "Haré [COMPORTAMIENTO] a las [TIEMPO] en [LUGAR]"
- Usa el apilamiento de hábitos: "Después de [HÁBITO ACTUAL], haré [NUEVO HÁBITO]"
- Diseña tu ambiente para hacer obvios los buenos hábitos
- Usa señales visuales para activar los comportamientos deseados

**2ª Ley: Hazlo Atractivo**
- Usa el agrupamiento de tentaciones: combina acciones que quieres hacer con acciones que necesitas hacer
- Únete a una cultura donde tu comportamiento deseado sea normal
- Crea un ritual de motivación antes de hábitos difíciles
- Resalta los beneficios de evitar malos hábitos

**3ª Ley: Hazlo Fácil**
- Reduce la fricción para buenos hábitos y aumenta la fricción para malos hábitos
- Usa la Regla de los Dos Minutos: escala los hábitos hasta que tomen menos de dos minutos
- Prepara tu ambiente para hacer más fáciles las acciones futuras
- Usa la tecnología para automatizar buenos hábitos

**4ª Ley: Hazlo Satisfactorio**
- Usa refuerzo: date recompensas inmediatas por buenos hábitos
- Haz que "no hacer nada" sea disfrutable para hábitos que quieres evitar
- Usa un rastreador de hábitos para visualizar tu progreso
- Nunca falles dos veces: regresa rápidamente después de errores

El secreto para obtener resultados que duren es nunca dejar de hacer mejoras. Es notable lo que puedes construir si simplemente no paras.`,
            tags: ["hábitos", "cambio de comportamiento", "automejora", "sistemas", "identidad"],
            slug: "habitos-atomicos",
            read_count: 6789,
            created_at: "2024-01-08T00:00:00Z",
            updated_at: "2024-01-25T00:00:00Z",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  // Calcular estadísticas - CORREGIDO: agregando valores iniciales para reduce
  const stats: BookStats = useMemo(() => {
    if (books.length === 0) {
      return {
        totalBooks: 0,
        totalCategories: 0,
        totalAuthors: 0,
        averageReadCount: 0,
        mostPopularCategory: "",
        recentBooks: 0,
      }
    }

    const categories = [...new Set(books.map((book) => book.category))]
    const authors = [...new Set(books.map((book) => book.author))]
    const totalReadCount = books.reduce((sum, book) => sum + (book.read_count || 0), 0)
    const averageReadCount = Math.round(totalReadCount / books.length)

    // Encontrar categoría más popular - CORREGIDO: manejando array vacío
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

    return {
      totalBooks: books.length,
      totalCategories: categories.length,
      totalAuthors: authors.length,
      averageReadCount,
      mostPopularCategory,
      recentBooks,
    }
  }, [books])

  // Obtener todas las categorías únicas
  const categories = useMemo(() => {
    if (books.length === 0) return []
    return [...new Set(books.map((book) => book.category))].sort()
  }, [books])

  // Obtener todos los tags únicos con frecuencia - CORREGIDO: manejando array vacío
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
      .slice(0, 20) // Top 20 tags más populares
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
      default:
        return filteredBooks
    }
  }

  const displayBooks = getBooksByTab(activeTab)

  // Función para manejar click en tag
  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag("") // Deseleccionar si ya está seleccionado
    } else {
      setSelectedTag(tag)
      setActiveTab("all") // Cambiar a la pestaña "all" para mostrar resultados
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <Filter className="h-8 w-8 text-green-600" />
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
              <User className="h-8 w-8 text-purple-600" />
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
                <p className="text-sm font-medium text-gray-600">Promedio de Lecturas</p>
                <p className="text-2xl font-bold">{stats.averageReadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos ({filteredBooks.length})</TabsTrigger>
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
              {displayBooks.map((book) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">{book.category}</Badge>
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
                      <Button className="flex-1" size="sm">
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
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
