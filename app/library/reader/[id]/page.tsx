"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Settings,
  Bookmark,
  RotateCcw,
  Type,
  Palette,
  Sun,
  Moon,
} from "lucide-react"
import Link from "next/link"

interface Book {
  id: string
  title: string
  author: string
  content: string[]
  totalPages: number
}

export default function BookReaderPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [book, setBook] = useState<Book | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [fontSize, setFontSize] = useState(16)
  const [theme, setTheme] = useState("light")
  const [showSettings, setShowSettings] = useState(false)
  const [mounted, setMounted] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push("/auth/login")
      return
    }

    if (mounted && user) {
      // Simular carga del libro
      const loadBook = async () => {
        // En una implementación real, aquí cargarías el archivo ePub
        const sampleBook: Book = {
          id: params.id as string,
          title: "Atomic Habits",
          author: "James Clear",
          content: [
            "Capítulo 1: Los Fundamentos de los Hábitos\n\nLos hábitos son los intereses compuestos de la mejora personal. De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican a medida que los repites.\n\nParecen hacer poca diferencia en un día cualquiera y, sin embargo, el impacto que entregan a lo largo de los meses y años puede ser enorme. Solo cuando miramos hacia atrás, dos, cinco o quizás diez años después, el valor de los buenos hábitos y el costo de los malos se vuelve asombrosamente aparente.\n\nEsto puede ser difícil de apreciar en la vida diaria. A menudo descartamos los pequeños cambios porque no parecen importar mucho en el momento. Si ahorras un poco de dinero ahora, sigues sin ser millonario. Si vas al gimnasio tres días seguidos, sigues fuera de forma. Si estudias chino durante una hora esta noche, aún no hablas el idioma.\n\nHacemos algunos cambios, pero los resultados nunca parecen llegar rápidamente y así volvemos a nuestras viejas rutinas.",

            "Capítulo 2: Cómo Tus Hábitos Moldean Tu Identidad\n\nExisten tres niveles en los que puede ocurrir el cambio. Puedes imaginar que son como las capas de una cebolla.\n\nEl primer nivel es cambiar tus resultados. Este nivel se trata de cambiar lo que obtienes. La mayoría de las metas que te fijas están en este nivel. Quiero perder peso, quiero publicar un libro, quiero ganar el campeonato.\n\nEl segundo nivel es cambiar tu proceso. Este nivel se trata de cambiar tus hábitos y sistemas. La mayoría de los hábitos que construyes están en este nivel. Implemento una nueva rutina en el gimnasio, declutter mi escritorio para un mejor flujo de trabajo, desarrollo una práctica de meditación.\n\nEl nivel más profundo es cambiar tu identidad. Este nivel se trata de cambiar tus creencias: tu visión del mundo, tu autoimagen, tus juicios sobre ti mismo y otros. La mayoría de las creencias, suposiciones y sesgos que tienes están en este nivel.\n\nLos resultados son sobre lo que obtienes. Los procesos son sobre lo que haces. La identidad es sobre lo que crees.",

            "Capítulo 3: Cómo Construir Mejores Hábitos en 4 Simples Pasos\n\nEn 1898, un psicólogo llamado Edward Thorndike realizó un experimento que cambiaría la forma en que pensamos sobre cómo se forman los hábitos.\n\nThorndike estaba interesado en estudiar el comportamiento animal, así que construyó un laberinto llamado 'caja rompecabezas'. Colocó un gato dentro de la caja. El gato podía escapar, pero solo si presionaba una palanca, tiraba de una cuerda y pisaba una plataforma en la secuencia correcta. Al principio, el gato se movía frenéticamente, arañando las paredes y olfateando los rincones. Eventualmente, el gato presionó la palanca por accidente, la puerta se abrió y el animal escapó.\n\nThorndike repitió este experimento una y otra vez con el mismo gato. Al principio, el animal tardó mucho tiempo en escapar. Pero después de unas pocas pruebas, el gato aprendió a presionar la palanca, tirar de la cuerda y pisar la plataforma en secuencia. Después de veinte a treinta intentos, el gato podía escapar en unos pocos segundos.\n\nDurante el curso de cada experimento, el gato estaba pasando por un proceso simple de prueba y error.",
          ],
          totalPages: 3,
        }

        setBook(sampleBook)
      }

      loadBook()
    }
  }, [mounted, user, loading, router, params.id])

  // Show loading state
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Cargando libro...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!user || !book) {
    return null
  }

  const nextPage = () => {
    if (book && currentPage < book.totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (page: number) => {
    if (book && page >= 1 && page <= book.totalPages) {
      setCurrentPage(page)
    }
  }

  const progress = (currentPage / book.totalPages) * 100

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Header */}
      <div
        className={`sticky top-0 z-50 border-b ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/library">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Biblioteca
                </Button>
              </Link>
              <div>
                <h1 className="font-semibold">{book.title}</h1>
                <p className="text-sm text-muted-foreground">por {book.author}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {book.totalPages}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{Math.round(progress)}% completado</span>
              <span>~{Math.round((book.totalPages - currentPage) * 5)} min restantes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Settings Sidebar */}
          {showSettings && (
            <Card className="w-80 h-fit">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-semibold">Configuración de Lectura</h3>

                {/* Font Size */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Type className="h-4 w-4 mr-2" />
                    Tamaño de Fuente
                  </label>
                  <Slider
                    value={[fontSize]}
                    onValueChange={(value) => setFontSize(value[0])}
                    max={24}
                    min={12}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>12px</span>
                    <span>{fontSize}px</span>
                    <span>24px</span>
                  </div>
                </div>

                {/* Theme */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Palette className="h-4 w-4 mr-2" />
                    Tema
                  </label>
                  <div className="flex space-x-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("light")}
                      className="flex-1"
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Claro
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                      className="flex-1"
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Oscuro
                    </Button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Acciones Rápidas</label>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Marcar Página
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reiniciar Progreso
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Content */}
          <div className="flex-1 max-w-4xl mx-auto">
            <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : ""}>
              <CardContent className="p-8">
                <div
                  ref={contentRef}
                  className="prose prose-lg max-w-none"
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: 1.6,
                    color: theme === "dark" ? "#e5e7eb" : "#374151",
                  }}
                >
                  <div className="whitespace-pre-line">{book.content[currentPage - 1]}</div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button variant="outline" onClick={prevPage} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              <div className="flex items-center space-x-2">
                {Array.from({ length: book.totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className="w-10 h-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button variant="outline" onClick={nextPage} disabled={currentPage === book.totalPages}>
                Siguiente
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
