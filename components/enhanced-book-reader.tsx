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
      Leadership: `**Los 7 Hábitos de la Gente Altamente Efectiva**

**Resumen Ejecutivo:**
Stephen Covey presenta un enfoque basado en principios para la efectividad personal e interpersonal. Los siete hábitos representan un paradigma de efectividad basado en principios universales del carácter humano.

**Los Siete Hábitos:**

**Hábitos de la Victoria Privada:**
1. **Ser Proactivo**: Tomar responsabilidad de tu vida y respuestas
2. **Comenzar con el Fin en Mente**: Definir tu misión y visión personal
3. **Poner Primero lo Primero**: Priorizar y ejecutar basado en principios

**Hábitos de la Victoria Pública:**
4. **Pensar Ganar-Ganar**: Buscar beneficio mutuo en todas las interacciones
5. **Buscar Primero Entender, Luego Ser Entendido**: Practicar la escucha empática
6. **Sinergizar**: Combinar fortalezas para crear algo mejor

**Hábito de Renovación:**
7. **Afilar la Sierra**: Renovación equilibrada en las cuatro dimensiones de la vida

**Principios Fundamentales:**

• **Paradigmas y Principios**: Cómo vemos el mundo determina cómo actuamos
• **El Continuum de Madurez**: Progresión de dependencia a independencia a interdependencia
• **La Cuenta Bancaria Emocional**: Construir confianza a través de pequeños actos de consideración
• **Liderazgo vs. Administración**: Hacer las cosas correctas vs. hacer las cosas bien

**Aplicaciones Prácticas:**

- Desarrollar una declaración de misión personal
- Usar la matriz de administración del tiempo
- Practicar la escucha empática en todas las conversaciones
- Buscar terceras alternativas en conflictos
- Crear planes de renovación personal

**Impacto en el Liderazgo:**

Estos hábitos te permitirán:
- Liderar desde adentro hacia afuera
- Construir relaciones basadas en confianza
- Crear soluciones sinérgicas a problemas complejos
- Mantener un equilibrio sostenible entre efectividad y bienestar`,

      Productivity: `**Deep Work: Reglas para el Éxito Enfocado en un Mundo Distraído**

**Resumen Ejecutivo:**
En la economía actual, la capacidad de enfocarse sin distracción en una tarea cognitivamente demandante es cada vez más valiosa. Cal Newport define el "trabajo profundo" como actividades profesionales realizadas en un estado de concentración libre de distracciones que llevan las capacidades cognitivas al límite.

**Conceptos Clave:**

• **Trabajo Profundo vs. Trabajo Superficial**: Distinguir entre actividades que crean valor y aquellas que son logísticas y no cognitivamente demandantes
• **La Hipótesis del Trabajo Profundo**: La capacidad de realizar trabajo profundo se está volviendo cada vez más rara y valiosa
• **Filosofías de Trabajo Profundo**: Monástica, bimodal, rítmica y periodística
• **Las Cuatro Disciplinas**: Enfocarse en lo importante, actuar sobre medidas de liderazgo, mantener un marcador convincente, y crear una cadencia de responsabilidad

**Estrategias Prácticas:**

1. **Rituales de Trabajo Profundo**: Crear rutinas específicas para maximizar la concentración
2. **Arquitectura de Atención**: Diseñar el entorno físico y digital para minimizar distracciones
3. **Entrenamiento de Concentración**: Ejercicios para fortalecer la capacidad de atención sostenida
4. **Drenaje de lo Superficial**: Identificar y minimizar el trabajo que no agrega valor

**Implementación:**

- Programar bloques específicos de tiempo para trabajo profundo
- Crear rituales que señalen el inicio del trabajo concentrado
- Eliminar o minimizar las fuentes de distracción digital
- Desarrollar la capacidad de trabajar sin estimulación constante

**Impacto en tu Carrera:**

El dominio del trabajo profundo te permitirá:
- Producir trabajo de mayor calidad en menos tiempo
- Desarrollar habilidades valiosas más rápidamente
- Crear valor económico significativo en tu campo
- Diferenciarte en un mercado laboral cada vez más competitivo`,

      "Personal Development": `**Atomic Habits: Un Método Fácil y Comprobado para Construir Buenos Hábitos**

**Resumen Ejecutivo:**
Los cambios que parecen pequeños e insignificantes al principio se convertirán en resultados extraordinarios si estás dispuesto a mantenerlos durante años. James Clear presenta un sistema completo para la formación de hábitos basado en cuatro leyes fundamentales.

**Las Cuatro Leyes del Cambio de Comportamiento:**

• **Hacerlo Obvio**: Diseñar el entorno para que los buenos hábitos sean visibles
• **Hacerlo Atractivo**: Usar el agrupamiento de tentaciones y encontrar formas de hacer los hábitos atractivos
• **Hacerlo Fácil**: Reducir la fricción para los buenos hábitos y aumentarla para los malos
• **Hacerlo Satisfactorio**: Usar refuerzo inmediato y seguimiento de hábitos

**Conceptos Fundamentales:**

1. **El Poder del 1%**: Mejoras marginales compuestas a lo largo del tiempo
2. **Sistemas vs. Objetivos**: Enfocarse en el proceso, no solo en los resultados
3. **Identidad y Hábitos**: Cambiar quién eres, no solo lo que haces
4. **El Plateau de Potencial Latente**: Por qué los cambios parecen no funcionar al principio

**Estrategias Prácticas:**

- **Apilamiento de Hábitos**: Vincular nuevos hábitos a rutinas existentes
- **Diseño del Entorno**: Modificar el contexto para facilitar buenos comportamientos
- **La Regla de los 2 Minutos**: Hacer que los nuevos hábitos tomen menos de dos minutos
- **Seguimiento de Hábitos**: Usar métricas simples para mantener la consistencia

**Aplicación Inmediata:**

1. Identifica los hábitos que refuerzan la identidad que deseas
2. Comienza con cambios increíblemente pequeños
3. Diseña tu entorno para el éxito
4. Celebra las pequeñas victorias para reforzar el comportamiento

**Transformación a Largo Plazo:**

Este sistema te ayudará a:
- Construir hábitos duraderos sin depender de la motivación
- Romper malos hábitos de manera sistemática
- Crear un sistema de mejora continua
- Alinear tus acciones diarias con tus objetivos a largo plazo`,

      Communication: `**Comunicación No Violenta: Un Lenguaje de Vida**

**Resumen Ejecutivo:**
Marshall Rosenberg presenta un proceso de comunicación que nos ayuda a intercambiar la información necesaria para resolver conflictos y diferencias de manera pacífica. La CNV se basa en habilidades de lenguaje y comunicación que fortalecen nuestra capacidad de seguir siendo humanos, incluso en condiciones difíciles.

**Los Cuatro Componentes de la CNV:**

1. **Observación**: Observar sin evaluar, describir sin interpretar
2. **Sentimientos**: Expresar emociones sin culpar o juzgar
3. **Necesidades**: Identificar las necesidades humanas universales detrás de los sentimientos
4. **Peticiones**: Hacer peticiones específicas y realizables

**Principios Fundamentales:**

• **Lenguaje de Vida vs. Lenguaje de Muerte**: Comunicación que conecta vs. comunicación que separa
• **Responsabilidad por Nuestros Sentimientos**: Reconocer que otros no "causan" nuestras emociones
• **El Poder de la Empatía**: Escuchar los sentimientos y necesidades detrás de las palabras
• **Expresión Honesta**: Comunicar nuestras necesidades sin exigir

**Obstáculos Comunes:**

- Comunicación moralizante y juicios
- Hacer comparaciones que generan miseria
- Negar responsabilidad por nuestras acciones
- Comunicar nuestros deseos como exigencias

**Aplicaciones Prácticas:**

1. **En el Trabajo**: Dar retroalimentación constructiva, resolver conflictos de equipo
2. **En Relaciones Personales**: Expresar necesidades sin culpar, escuchar con empatía
3. **En la Educación**: Crear ambientes de aprendizaje seguros y conectados
4. **En Conflictos Sociales**: Mediar disputas, construir puentes entre grupos

**Proceso de Transformación:**

- Desarrollar un vocabulario de sentimientos y necesidades
- Practicar la observación sin evaluación
- Aprender a hacer peticiones claras y específicas
- Cultivar la empatía hacia uno mismo y otros

**Beneficios a Largo Plazo:**

La CNV te ayudará a:
- Crear conexiones más profundas y auténticas
- Resolver conflictos de manera constructiva
- Expresar tu autenticidad sin herir a otros
- Contribuir a un mundo más compasivo y conectado`,

      "Team Management": `**Las Cinco Disfunciones de un Equipo**

**Resumen Ejecutivo:**
Patrick Lencioni identifica las cinco disfunciones más comunes que impiden que los equipos trabajen de manera efectiva. Presenta un modelo cohesivo para construir equipos que funcionen como una unidad cohesiva.

**Las Cinco Disfunciones:**

1. **Ausencia de Confianza**: Los miembros del equipo no se sienten seguros siendo vulnerables entre sí
2. **Temor al Conflicto**: Los equipos que carecen de confianza son incapaces de tener debates apasionados sobre ideas
3. **Falta de Compromiso**: Sin conflicto, es difícil que los miembros del equipo se comprometan con las decisiones
4. **Evitar la Responsabilidad**: Sin compromiso, los miembros del equipo evitan responsabilizarse mutuamente
5. **Falta de Atención a los Resultados**: Cuando los equipos no se responsabilizan mutuamente, tienden a poner sus necesidades individuales por encima de los objetivos colectivos

**Construyendo Confianza:**

• **Vulnerabilidad**: Los líderes deben modelar la vulnerabilidad primero
• **Ejercicios de Construcción de Confianza**: Actividades que revelan fortalezas, debilidades y experiencias
• **Credibilidad**: Demostrar competencia, carácter y cuidado
• **Tiempo**: La confianza se construye a través de experiencias compartidas

**Dominando el Conflicto:**

- Distinguir entre conflicto productivo e improductivo
- Crear seguridad para el desacuerdo
- Usar técnicas para extraer conflicto cuando sea necesario
- Reconocer que el conflicto es esencial para la innovación

**Logrando Compromiso:**

1. **Claridad**: Asegurar que todos entiendan las decisiones
2. **Buy-in**: Crear oportunidades para que todos contribuyan
3. **Fechas Límite**: Establecer plazos claros para las decisiones
4. **Peor Escenario**: Discutir qué pasaría si la decisión es incorrecta

**Abrazando la Responsabilidad:**

- Establecer estándares claros de comportamiento
- Crear sistemas de responsabilidad mutua
- Abordar problemas de rendimiento rápidamente
- Recompensar comportamientos que apoyan los objetivos del equipo

**Enfocándose en Resultados:**

• **Objetivos Colectivos**: Definir claramente qué constituye el éxito del equipo
• **Métricas**: Usar indicadores específicos y medibles
• **Recompensas**: Alinear incentivos individuales con objetivos de equipo
• **Consecuencias**: Establecer consecuencias claras por no alcanzar resultados

**Implementación Práctica:**

1. Evaluar a tu equipo usando el modelo de cinco disfunciones
2. Comenzar con la construcción de confianza como base
3. Trabajar progresivamente a través de cada disfunción
4. Usar herramientas y ejercicios específicos para cada área
5. Medir el progreso regularmente y ajustar el enfoque

**Liderazgo de Equipos Efectivos:**

Como líder, debes:
- Modelar la vulnerabilidad y la autenticidad
- Facilitar conflictos productivos
- Forzar claridad y cierre en decisiones
- Confrontar comportamientos que socavan al equipo
- Mantener el enfoque en resultados colectivos

Este modelo proporciona un marco práctico para transformar cualquier grupo de individuos en un equipo cohesivo y de alto rendimiento.`,
    }

    return (
      summaries[book.category] ||
      book.content ||
      `Este es un libro valioso sobre ${book.category.toLowerCase()} que te ayudará a desarrollar nuevas habilidades y perspectivas profesionales.`
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
                      <p className="text-blue-800">{generateBookSummary(book)}</p>
                    </div>

                    <div className="whitespace-pre-line text-gray-800 leading-relaxed">{book.content}</div>

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
