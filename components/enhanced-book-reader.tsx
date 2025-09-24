"use client"

import { useState, useEffect, useRef } from "react"
import {
  ArrowLeft,
  Bookmark,
  BookmarkPlus,
  Clock,
  Star,
  Settings,
  Sun,
  Moon,
  Minus,
  Plus,
  Play,
  Pause,
  Volume2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

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

interface ReadingProgress {
  progress_percentage: number
  reading_time_minutes: number
  last_read_at: string
  notes?: string
}

interface BookReview {
  rating: number
  review_text: string
  is_recommended: boolean
}

interface EnhancedBookReaderProps {
  book: KnowledgeBook
  isOpen: boolean
  onClose: () => void
  onBookmark: (bookId: number) => void
  isBookmarked: boolean
}

export default function EnhancedBookReader({
  book,
  isOpen,
  onClose,
  onBookmark,
  isBookmarked,
}: EnhancedBookReaderProps) {
  const [readingProgress, setReadingProgress] = useState<ReadingProgress | null>(null)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [notes, setNotes] = useState("")
  const [review, setReview] = useState<BookReview>({ rating: 0, review_text: "", is_recommended: true })
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)

  // Configuraciones de lectura
  const [fontSize, setFontSize] = useState(16)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isAutoScroll, setIsAutoScroll] = useState(false)
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(1)
  const [isTextToSpeech, setIsTextToSpeech] = useState(false)

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const userEmail = "demo@example.com"

  useEffect(() => {
    if (isOpen && book) {
      loadReadingProgress()
      startReadingSession()
      startTimeRef.current = new Date()

      // Actualizar tiempo de lectura cada minuto
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 60000)
          setReadingTime(elapsed)
        }
      }, 60000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (sessionId && startTimeRef.current) {
        endReadingSession()
      }
    }
  }, [isOpen, book])

  useEffect(() => {
    if (isAutoScroll && scrollAreaRef.current) {
      const scrollInterval = setInterval(() => {
        const scrollArea = scrollAreaRef.current?.querySelector("[data-radix-scroll-area-viewport]")
        if (scrollArea) {
          scrollArea.scrollTop += autoScrollSpeed
        }
      }, 50)

      return () => clearInterval(scrollInterval)
    }
  }, [isAutoScroll, autoScrollSpeed])

  const loadReadingProgress = async () => {
    try {
      const { data, error } = await supabase
        .from("user_reading_progress")
        .select("*")
        .eq("user_email", userEmail)
        .eq("book_id", book.id)
        .single()

      if (data) {
        setReadingProgress(data)
        setCurrentProgress(data.progress_percentage)
        setNotes(data.notes || "")
      }
    } catch (error) {
      console.error("Error cargando progreso de lectura:", error)
    }
  }

  const startReadingSession = async () => {
    try {
      const { data, error } = await supabase.rpc("start_reading_session", {
        p_user_email: userEmail,
        p_book_id: book.id,
      })

      if (data) {
        setSessionId(data)
      }
    } catch (error) {
      console.error("Error iniciando sesión de lectura:", error)
    }
  }

  const endReadingSession = async () => {
    if (sessionId) {
      try {
        await supabase.rpc("end_reading_session", {
          p_session_id: sessionId,
        })
      } catch (error) {
        console.error("Error terminando sesión de lectura:", error)
      }
    }
  }

  const updateProgress = async (progress: number) => {
    try {
      await supabase.rpc("update_reading_progress", {
        p_user_email: userEmail,
        p_book_id: book.id,
        p_progress: progress,
        p_reading_time: readingTime,
      })

      setCurrentProgress(progress)
    } catch (error) {
      console.error("Error actualizando progreso:", error)
    }
  }

  const saveNotes = async () => {
    try {
      await supabase.from("user_reading_progress").upsert({
        user_email: userEmail,
        book_id: book.id,
        notes: notes,
        progress_percentage: currentProgress,
        reading_time_minutes: readingTime,
      })
    } catch (error) {
      console.error("Error guardando notas:", error)
    }
  }

  const submitReview = async () => {
    try {
      await supabase.from("book_reviews").upsert({
        user_email: userEmail,
        book_id: book.id,
        rating: review.rating,
        review_text: review.review_text,
        is_recommended: review.is_recommended,
      })

      setShowReviewDialog(false)
    } catch (error) {
      console.error("Error enviando reseña:", error)
    }
  }

  const handleScroll = () => {
    const scrollArea = scrollAreaRef.current?.querySelector("[data-radix-scroll-area-viewport]")
    if (scrollArea) {
      const scrollPercentage = Math.round(
        (scrollArea.scrollTop / (scrollArea.scrollHeight - scrollArea.clientHeight)) * 100,
      )
      if (scrollPercentage > currentProgress) {
        updateProgress(Math.min(scrollPercentage, 100))
      }
    }
  }

  const toggleTextToSpeech = () => {
    if (isTextToSpeech) {
      speechSynthesis.cancel()
      setIsTextToSpeech(false)
    } else {
      const utterance = new SpeechSynthesisUtterance(book.content)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.lang = "es-ES"
      speechSynthesis.speak(utterance)
      setIsTextToSpeech(true)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[95vh] flex flex-col p-0">
        {/* Encabezado Mejorado con Progreso */}
        <DialogHeader className="flex-shrink-0 p-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <DialogTitle className="text-lg">{book.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-4">
                  <span>por {book.author}</span>
                  <Badge variant="secondary">{book.category}</Badge>
                  <div className="flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3" />
                    {readingTime} min leídos
                  </div>
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowSettingsDialog(true)}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onBookmark(book.id)}>
                {isBookmarked ? <Bookmark className="h-4 w-4 text-blue-600" /> : <BookmarkPlus className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Barra de Progreso */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Progreso de lectura</span>
              <span>{currentProgress}%</span>
            </div>
            <Progress value={currentProgress} className="h-2" />
          </div>
        </DialogHeader>

        {/* Área de Contenido Principal */}
        <div className="flex-1 flex overflow-hidden">
          {/* Contenido de Lectura */}
          <div className="flex-1 flex flex-col">
            <ScrollArea ref={scrollAreaRef} className="flex-1 px-6" onScrollCapture={handleScroll}>
              <div className="py-6">
                <div
                  className={`prose prose-lg max-w-none ${isDarkMode ? "prose-invert" : ""}`}
                  style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
                >
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">📖 Contenido del Libro</h3>
                      <p className="text-blue-800">
                        Explora los conceptos clave y aplicaciones prácticas de este libro.
                      </p>
                    </div>

                    <div className="whitespace-pre-line text-gray-800 leading-relaxed">{book.content}</div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg mb-3">🏷️ Etiquetas y Temas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {book.tags.map((tag, index) => (
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

                    <div className="h-20"></div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Panel Lateral para Notas */}
          <div className="w-80 border-l bg-gray-50 flex flex-col">
            <Tabs defaultValue="notas" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
                <TabsTrigger value="notas">Notas</TabsTrigger>
                <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
              </TabsList>

              <TabsContent value="notas" className="flex-1 p-4 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Mis Notas</h4>
                  <Textarea
                    placeholder="Escribe tus notas y reflexiones aquí..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <Button onClick={saveNotes} className="w-full mt-2" size="sm">
                    Guardar Notas
                  </Button>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Progreso Manual</h4>
                  <Slider
                    value={[currentProgress]}
                    onValueChange={(value) => updateProgress(value[0])}
                    max={100}
                    step={5}
                    className="mb-2"
                  />
                  <p className="text-sm text-gray-600">Progreso: {currentProgress}%</p>
                </div>
              </TabsContent>

              <TabsContent value="estadisticas" className="flex-1 p-4 space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Tiempo de lectura:</span>
                        <span className="text-sm font-medium">{readingTime} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Progreso:</span>
                        <span className="text-sm font-medium">{currentProgress}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Lecturas totales:</span>
                        <span className="text-sm font-medium">{book.read_count}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={() => setShowReviewDialog(true)} className="w-full" variant="outline">
                  <Star className="h-4 w-4 mr-2" />
                  Escribir Reseña
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Pie de Página Mejorado */}
        <div className="flex-shrink-0 p-4 border-t bg-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setIsAutoScroll(!isAutoScroll)}>
                {isAutoScroll ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                Auto-desplazamiento
              </Button>

              <Button variant="ghost" size="sm" onClick={toggleTextToSpeech}>
                <Volume2 className="h-4 w-4" />
                {isTextToSpeech ? "Pausar" : "Escuchar"}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cerrar
              </Button>
              <Button onClick={() => onBookmark(book.id)}>{isBookmarked ? "Guardado" : "Guardar Libro"}</Button>
            </div>
          </div>
        </div>

        {/* Diálogo de Configuraciones */}
        <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Configuración de Lectura</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Tamaño de fuente</label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setFontSize(Math.max(12, fontSize - 2))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm w-12 text-center">{fontSize}px</span>
                  <Button variant="outline" size="sm" onClick={() => setFontSize(Math.min(24, fontSize + 2))}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tema</label>
                <div className="flex gap-2">
                  <Button variant={!isDarkMode ? "default" : "outline"} size="sm" onClick={() => setIsDarkMode(false)}>
                    <Sun className="h-4 w-4 mr-1" />
                    Claro
                  </Button>
                  <Button variant={isDarkMode ? "default" : "outline"} size="sm" onClick={() => setIsDarkMode(true)}>
                    <Moon className="h-4 w-4 mr-1" />
                    Oscuro
                  </Button>
                </div>
              </div>

              {isAutoScroll && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Velocidad de auto-desplazamiento</label>
                  <Slider
                    value={[autoScrollSpeed]}
                    onValueChange={(value) => setAutoScrollSpeed(value[0])}
                    max={5}
                    min={0.5}
                    step={0.5}
                  />
                  <p className="text-xs text-gray-600 mt-1">Velocidad: {autoScrollSpeed}x</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Diálogo de Reseña */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Escribir Reseña</DialogTitle>
              <DialogDescription>Comparte tu opinión sobre este libro</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Calificación</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button key={star} variant="ghost" size="sm" onClick={() => setReview({ ...review, rating: star })}>
                      <Star
                        className={`h-5 w-5 ${
                          star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Reseña</label>
                <Textarea
                  placeholder="¿Qué te pareció este libro?"
                  value={review.review_text}
                  onChange={(e) => setReview({ ...review, review_text: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={submitReview}>Enviar Reseña</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}
