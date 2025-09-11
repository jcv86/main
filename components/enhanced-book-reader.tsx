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

  // Reading settings
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

      // Update reading time every minute
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
      console.error("Error loading reading progress:", error)
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
      console.error("Error starting reading session:", error)
    }
  }

  const endReadingSession = async () => {
    if (sessionId) {
      try {
        await supabase.rpc("end_reading_session", {
          p_session_id: sessionId,
        })
      } catch (error) {
        console.error("Error ending reading session:", error)
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
      console.error("Error updating progress:", error)
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
      console.error("Error saving notes:", error)
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
      console.error("Error submitting review:", error)
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
      const utterance = new SpeechSynthesisUtterance(generateBookSummary(book))
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
      setIsTextToSpeech(true)
    }
  }

  const generateBookSummary = (book: KnowledgeBook) => {
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

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[95vh] flex flex-col p-0">
        {/* Enhanced Header with Progress */}
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

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Progreso de lectura</span>
              <span>{currentProgress}%</span>
            </div>
            <Progress value={currentProgress} className="h-2" />
          </div>
        </DialogHeader>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Reading Content */}
          <div className="flex-1 flex flex-col">
            <ScrollArea ref={scrollAreaRef} className="flex-1 px-6" onScrollCapture={handleScroll}>
              <div className="py-6">
                <div
                  className={`prose prose-lg max-w-none ${isDarkMode ? "prose-invert" : ""}`}
                  style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
                >
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">📖 Resumen del Libro</h3>
                      <p className="text-blue-800">{book.content}</p>
                    </div>

                    <div className="whitespace-pre-line text-gray-800 leading-relaxed">{generateBookSummary(book)}</div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg mb-3">🏷️ Tags y Temas:</h4>
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

          {/* Side Panel for Notes */}
          <div className="w-80 border-l bg-gray-50 flex flex-col">
            <Tabs defaultValue="notes" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
                <TabsTrigger value="notes">Notas</TabsTrigger>
                <TabsTrigger value="stats">Estadísticas</TabsTrigger>
              </TabsList>

              <TabsContent value="notes" className="flex-1 p-4 space-y-4">
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

              <TabsContent value="stats" className="flex-1 p-4 space-y-4">
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

        {/* Enhanced Footer */}
        <div className="flex-shrink-0 p-4 border-t bg-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setIsAutoScroll(!isAutoScroll)}>
                {isAutoScroll ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                Auto-scroll
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

        {/* Settings Dialog */}
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
                  <label className="text-sm font-medium mb-2 block">Velocidad de auto-scroll</label>
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

        {/* Review Dialog */}
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
