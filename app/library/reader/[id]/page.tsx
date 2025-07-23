"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, BookOpen, Clock, Star, Bookmark, Menu, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  getBookById,
  getBookChapters,
  updateUserBookProgress,
  type Book,
  type BookChapter,
  type UserBookProgress,
} from "@/lib/supabase-library"

// Mock data for development
const mockBooks: Book[] = [
  {
    id: "1",
    title: "Hábitos Atómicos",
    author: "James Clear",
    description: "Una guía práctica para formar buenos hábitos y romper los malos.",
    category: "Productividad",
    rating: 4.8,
    reading_time: "4h 30min",
    pages: 8,
    published_year: 2018,
    cover_url: "/placeholder.svg?height=400&width=300&text=Hábitos%20Atómicos&bg=3b82f6&color=white",
    tags: ["Hábitos", "Productividad", "Autoayuda"],
    difficulty: "Intermedio",
    key_topics: ["Formación de hábitos", "Productividad personal", "Cambio de comportamiento"],
    is_recommended: true,
    is_free: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Trabajo Profundo",
    author: "Cal Newport",
    description: "Reglas para el éxito enfocado en un mundo distraído.",
    category: "Productividad",
    rating: 4.7,
    reading_time: "4h 45min",
    pages: 6,
    published_year: 2016,
    cover_url: "/placeholder.svg?height=400&width=300&text=Trabajo%20Profundo&bg=1f2937&color=white",
    tags: ["Concentración", "Productividad", "Trabajo"],
    difficulty: "Intermedio",
    key_topics: ["Trabajo profundo", "Concentración", "Productividad cognitiva"],
    is_recommended: true,
    is_free: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockChapters: { [key: string]: BookChapter[] } = {
  "1": [
    {
      id: "ch-1-1",
      book_id: "1",
      chapter_number: 1,
      title: "Los Fundamentos: Por qué los pequeños cambios marcan una gran diferencia",
      content: `
        <div class="chapter-content">
          <h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 1: Los Fundamentos</h1>
          <p class="text-lg mb-6 text-gray-700"><strong>Los hábitos son el interés compuesto de la superación personal.</strong> De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican a medida que los repites.</p>
          
          <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🚀 El poder de los pequeños cambios</h2>
          <p class="mb-4 text-gray-700">Si puedes mejorar tan solo un <strong>1% cada día</strong> durante un año, terminarás siendo treinta y siete veces mejor al final del período.</p>
          
          <div class="bg-blue-50 border-l-4 border-blue-500 p-6 my-6 rounded-r-lg">
            <h3 class="text-lg font-semibold text-blue-900 mb-3">📊 La matemática del 1%</h3>
            <ul class="list-disc list-inside text-blue-800 space-y-2">
              <li><strong>1% mejor cada día:</strong> 1.01^365 = 37.78</li>
              <li><strong>1% peor cada día:</strong> 0.99^365 = 0.03</li>
            </ul>
          </div>
          
          <blockquote class="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-gray-50 rounded-r-lg italic text-lg text-gray-800">
            "El éxito es el producto de hábitos diarios, no de transformaciones de una sola vez."
          </blockquote>
          
          <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🎯 El Valle de la Desilusión</h2>
          <p class="mb-4 text-gray-700">Los hábitos a menudo parecen no marcar diferencia hasta que cruzas un umbral crítico y desbloqueas un nuevo nivel de rendimiento.</p>
          <p class="mb-4 text-gray-700">Esto es una de las razones principales por las que es tan difícil construir hábitos que perduren. Las personas hacen algunos pequeños cambios, no ven resultados tangibles, y deciden parar.</p>
        </div>
      `,
      estimated_reading_minutes: 35,
      created_at: new Date().toISOString(),
    },
    {
      id: "ch-1-2",
      book_id: "1",
      chapter_number: 2,
      title: "Cómo Funcionan Tus Hábitos",
      content: `
        <div class="chapter-content">
          <h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 2: Cómo Funcionan Tus Hábitos</h1>
          <p class="text-lg mb-6 text-gray-700">Un hábito es una rutina o comportamiento que se realiza regularmente y, en muchos casos, automáticamente.</p>
          
          <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🔄 El Bucle del Hábito</h2>
          <p class="mb-4 text-gray-700">Todos los hábitos siguen el mismo patrón de cuatro pasos:</p>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
            <h3 class="text-lg font-semibold text-blue-900 mb-4">🎯 Los 4 Pasos del Hábito</h3>
            <ol class="list-decimal list-inside text-blue-800 space-y-2">
              <li><strong>Señal:</strong> El desencadenante que inicia el comportamiento</li>
              <li><strong>Anhelo:</strong> La fuerza motivacional detrás de cada hábito</li>
              <li><strong>Respuesta:</strong> El hábito real que realizas</li>
              <li><strong>Recompensa:</strong> El beneficio que obtienes del hábito</li>
            </ol>
          </div>
          
          <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🔧 Las Cuatro Leyes del Cambio de Comportamiento</h2>
          
          <div class="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
            <h3 class="text-lg font-semibold text-green-900 mb-4">✅ Cómo Crear un Buen Hábito</h3>
            <ul class="list-disc list-inside text-green-800 space-y-2">
              <li><strong>1ª Ley (Señal):</strong> Hazlo obvio</li>
              <li><strong>2ª Ley (Anhelo):</strong> Hazlo atractivo</li>
              <li><strong>3ª Ley (Respuesta):</strong> Hazlo fácil</li>
              <li><strong>4ª Ley (Recompensa):</strong> Hazlo satisfactorio</li>
            </ul>
          </div>
        </div>
      `,
      estimated_reading_minutes: 30,
      created_at: new Date().toISOString(),
    },
    {
      id: "ch-1-3",
      book_id: "1",
      chapter_number: 3,
      title: "La Primera Ley: Hazlo Obvio",
      content: `
        <div class="chapter-content">
          <h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 3: La Primera Ley - Hazlo Obvio</h1>
          <p class="text-lg mb-6 text-gray-700">El proceso de cambio de comportamiento siempre comienza con la conciencia. Necesitas ser consciente de tus hábitos antes de poder cambiarlos.</p>
          
          <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">👁️ El Poder de la Conciencia</h2>
          <p class="mb-4 text-gray-700">Muchos de nuestros hábitos diarios se realizan de forma automática. Hasta que no hagas lo inconsciente consciente, dirigirá tu vida.</p>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
            <h3 class="text-lg font-semibold text-blue-900 mb-4">📝 Ejercicio: El Registro de Hábitos</h3>
            <p class="text-blue-800 mb-3">Haz una lista de tus hábitos diarios. Para cada hábito, clasifícalo como:</p>
            <ul class="list-disc list-inside text-blue-800 space-y-2">
              <li><strong>Positivo (+):</strong> Un buen hábito</li>
              <li><strong>Negativo (-):</strong> Un mal hábito</li>
              <li><strong>Neutral (=):</strong> Un hábito neutro</li>
            </ul>
          </div>
          
          <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🔗 Apilamiento de Hábitos</h2>
          <p class="mb-4 text-gray-700">La fórmula del apilamiento de hábitos es:</p>
          
          <blockquote class="border-l-4 border-purple-500 pl-6 py-4 my-6 bg-purple-50 rounded-r-lg text-center text-lg font-semibold text-purple-900">
            "Después de [HÁBITO ACTUAL], yo haré [NUEVO HÁBITO]."
          </blockquote>
          
          <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🏠 Diseño del Entorno</h2>
          <p class="mb-4 text-gray-700">El entorno es la mano invisible que da forma al comportamiento humano.</p>
          
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-6">
            <h3 class="text-lg font-semibold text-yellow-900 mb-4">💡 Ejemplos de "Hazlo Obvio"</h3>
            <ul class="list-disc list-inside text-yellow-800 space-y-2">
              <li><strong>Leer más:</strong> Coloca un libro en tu almohada cada mañana</li>
              <li><strong>Hacer ejercicio:</strong> Prepara tu ropa de gimnasio la noche anterior</li>
              <li><strong>Comer saludable:</strong> Coloca frutas en un lugar visible</li>
              <li><strong>Beber más agua:</strong> Llena una botella de agua y ponla en tu escritorio</li>
            </ul>
          </div>
        </div>
      `,
      estimated_reading_minutes: 32,
      created_at: new Date().toISOString(),
    },
  ],
  "2": [
    {
      id: "ch-2-1",
      book_id: "2",
      chapter_number: 1,
      title: "Introducción al Trabajo Profundo",
      content: `
        <div class="chapter-content">
          <h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 1: Introducción al Trabajo Profundo</h1>
          <p class="text-lg mb-6 text-gray-700">El trabajo profundo es la habilidad de enfocarse sin distracción en una tarea cognitivamente demandante.</p>
          <p class="mb-4 text-gray-700">En nuestra economía actual, esta habilidad se está volviendo cada vez más valiosa y cada vez más rara.</p>
          
          <h2 class="text-2xl font-semibold mb-4 text-gray-900">🎯 Definición de Trabajo Profundo</h2>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
            <p class="text-gray-800 font-medium">Trabajo Profundo: Actividades profesionales realizadas en un estado de concentración libre de distracciones que empujan tus capacidades cognitivas a su límite.</p>
          </div>
          
          <p class="mb-4 text-gray-700">Estos esfuerzos crean nuevo valor, mejoran tu habilidad, y son difíciles de replicar.</p>
        </div>
      `,
      estimated_reading_minutes: 25,
      created_at: new Date().toISOString(),
    },
  ],
}

export default function BookReaderPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string

  const [book, setBook] = useState<Book | null>(null)
  const [chapters, setChapters] = useState<BookChapter[]>([])
  const [currentChapter, setCurrentChapter] = useState<BookChapter | null>(null)
  const [userProgress, setUserProgress] = useState<UserBookProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (bookId) {
      loadBookData()
    }
  }, [bookId])

  const loadBookData = async () => {
    try {
      setLoading(true)

      // Try to find book in mock data first (for development)
      let bookData = mockBooks.find((b) => b.id === bookId)
      let chaptersData = mockChapters[bookId] || []

      if (!bookData) {
        // Try to load from Supabase
        const { data: supabaseBook, error: bookError } = await getBookById(bookId)
        if (!bookError && supabaseBook) {
          bookData = supabaseBook
        }
      }

      if (!bookData) {
        console.error("Book not found for ID:", bookId)
        setLoading(false)
        return
      }

      setBook(bookData)

      // Load chapters
      if (chaptersData.length === 0) {
        const { data: supabaseChapters, error: chaptersError } = await getBookChapters(bookId)
        if (!chaptersError && supabaseChapters) {
          chaptersData = supabaseChapters
        }
      }

      if (chaptersData.length === 0) {
        // Create a default chapter if none exist
        chaptersData = [
          {
            id: `default-${bookId}`,
            book_id: bookId,
            chapter_number: 1,
            title: "Introducción",
            content: `
              <div class="chapter-content">
                <h1 class="text-3xl font-bold mb-6 text-gray-900">Introducción</h1>
                <p class="text-lg mb-6 text-gray-700">Bienvenido a "${bookData.title}" por ${bookData.author}.</p>
                <p class="mb-4 text-gray-700">${bookData.description}</p>
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                  <h3 class="text-lg font-semibold text-blue-900 mb-4">📚 Sobre este libro</h3>
                  <ul class="list-disc list-inside text-blue-800 space-y-2">
                    <li><strong>Categoría:</strong> ${bookData.category}</li>
                    <li><strong>Dificultad:</strong> ${bookData.difficulty}</li>
                    <li><strong>Tiempo de lectura:</strong> ${bookData.reading_time}</li>
                    <li><strong>Año de publicación:</strong> ${bookData.published_year}</li>
                  </ul>
                </div>
              </div>
            `,
            estimated_reading_minutes: 15,
            created_at: new Date().toISOString(),
          },
        ]
      }

      setChapters(chaptersData)
      setCurrentChapter(chaptersData[0])

      // Load user progress (mock for now)
      const mockProgress: UserBookProgress = {
        id: "1",
        user_id: "demo-user",
        book_id: bookId,
        progress_percentage: 25,
        current_chapter: 1,
        total_chapters: chaptersData.length,
        reading_time_minutes: 45,
        started_at: new Date().toISOString(),
        last_read_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setUserProgress(mockProgress)
    } catch (error) {
      console.error("Error loading book data:", error)
    } finally {
      setLoading(false)
    }
  }

  const navigateToChapter = (chapterNumber: number) => {
    const chapter = chapters.find((c) => c.chapter_number === chapterNumber)
    if (chapter) {
      setCurrentChapter(chapter)
      setSidebarOpen(false)

      // Update progress
      if (userProgress) {
        const newProgress = {
          ...userProgress,
          current_chapter: chapterNumber,
          progress_percentage: Math.round((chapterNumber / chapters.length) * 100),
          last_read_at: new Date().toISOString(),
        }
        setUserProgress(newProgress)

        // Update in database (would work with real auth)
        updateUserBookProgress("demo-user", bookId, {
          current_chapter: chapterNumber,
          progress_percentage: newProgress.progress_percentage,
        })
      }
    }
  }

  const goToPreviousChapter = () => {
    if (currentChapter && currentChapter.chapter_number > 1) {
      navigateToChapter(currentChapter.chapter_number - 1)
    }
  }

  const goToNextChapter = () => {
    if (currentChapter && currentChapter.chapter_number < chapters.length) {
      navigateToChapter(currentChapter.chapter_number + 1)
    }
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
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="h-96" />
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-12 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-8" />
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!book || !currentChapter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Libro no encontrado</h3>
          <p className="text-gray-600 mb-4">El libro que buscas no existe o no está disponible</p>
          <Link href="/library">
            <Button>Volver a la biblioteca</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/library">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Biblioteca
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="hidden md:block">
                <h1 className="font-semibold text-gray-900">{book.title}</h1>
                <p className="text-sm text-gray-600">{book.author}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {userProgress && (
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm text-gray-600">Progreso:</span>
                  <Progress value={userProgress.progress_percentage} className="w-24" />
                  <span className="text-sm font-medium">{userProgress.progress_percentage}%</span>
                </div>
              )}

              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden bg-transparent">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Tabla de Contenidos</SheetTitle>
                    <SheetDescription>Navega por los capítulos del libro</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <TableOfContents
                      chapters={chapters}
                      currentChapter={currentChapter}
                      onChapterSelect={navigateToChapter}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={book.cover_url || "/placeholder.svg"}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-lg">{book.title}</CardTitle>
                <CardDescription>{book.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getCategoryColor(book.category)}>{book.category}</Badge>
                    <Badge className={getDifficultyColor(book.difficulty)}>{book.difficulty}</Badge>
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

                  {userProgress && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Progreso</span>
                        <span>{userProgress.progress_percentage}%</span>
                      </div>
                      <Progress value={userProgress.progress_percentage} />
                    </div>
                  )}

                  <Separator />

                  <TableOfContents
                    chapters={chapters}
                    currentChapter={currentChapter}
                    onChapterSelect={navigateToChapter}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      Capítulo {currentChapter.chapter_number}: {currentChapter.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Clock className="h-4 w-4" />
                      {currentChapter.estimated_reading_minutes} min de lectura
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentChapter.content }}
                />

                {/* Navigation */}
                <div className="flex items-center justify-between mt-12 pt-8 border-t">
                  <Button
                    variant="outline"
                    onClick={goToPreviousChapter}
                    disabled={currentChapter.chapter_number === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>

                  <span className="text-sm text-gray-600">
                    {currentChapter.chapter_number} de {chapters.length}
                  </span>

                  <Button onClick={goToNextChapter} disabled={currentChapter.chapter_number === chapters.length}>
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function TableOfContents({
  chapters,
  currentChapter,
  onChapterSelect,
}: {
  chapters: BookChapter[]
  currentChapter: BookChapter
  onChapterSelect: (chapterNumber: number) => void
}) {
  return (
    <div>
      <h4 className="font-medium text-sm text-gray-900 mb-3">Tabla de Contenidos</h4>
      <div className="space-y-1">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => onChapterSelect(chapter.chapter_number)}
            className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
              currentChapter.id === chapter.id
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-400 mt-0.5 flex-shrink-0">{chapter.chapter_number}</span>
              <span className="line-clamp-2">{chapter.title}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
