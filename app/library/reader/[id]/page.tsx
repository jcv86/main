"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookmarkPlus,
  StickyNote,
  Plus,
  Edit,
  Trash2,
  Menu,
  Clock,
  Target,
  Moon,
  Sun,
  Minus,
  Calendar,
  MapPin,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Settings,
  SkipForward,
  SkipBack,
  Headphones,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Chapter {
  id: string
  title: string
  content: string
  page_start: number
  page_end: number
  reading_time: number
}

interface Bookmarks {
  id: string
  chapter_id: string
  chapter_title: string
  position: number
  selected_text: string
  note?: string
  created_at: string
  page_number: number
}

interface Note {
  id: string
  chapter_id: string
  chapter_title: string
  title: string
  content: string
  selected_text?: string
  position?: number
  created_at: string
  updated_at: string
  page_number: number
}

interface ReadingProgress {
  current_chapter: number
  current_position: number
  progress_percentage: number
  time_spent: number
  last_read: string
  bookmarks_count: number
  notes_count: number
}

interface Book {
  id: string
  title: string
  author: string
  description: string
  cover_url: string
  total_pages: number
  total_chapters: number
  estimated_reading_time: number
}

interface TTSSettings {
  voice: string
  rate: number
  pitch: number
  volume: number
  enabled: boolean
}

export default function BookReaderPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const bookId = params.id as string

  // Book and content state
  const [book, setBook] = useState<Book | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [currentChapter, setCurrentChapter] = useState(0)
  const [readingProgress, setReadingProgress] = useState<ReadingProgress | null>(null)

  // Bookmarks and notes state
  const [bookmarks, setBookmarks] = useState<Bookmarks[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedText, setSelectedText] = useState("")
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null)

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false)
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [showTTSSettings, setShowTTSSettings] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [bookmarkNote, setBookmarkNote] = useState("")

  // Reading settings
  const [fontSize, setFontSize] = useState(16)
  const [darkMode, setDarkMode] = useState(false)
  const [lineHeight, setLineHeight] = useState(1.6)

  // Text-to-Speech state
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [sentences, setSentences] = useState<string[]>([])
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [ttsSettings, setTTSSettings] = useState<TTSSettings>({
    voice: "",
    rate: 1,
    pitch: 1,
    volume: 0.8,
    enabled: true,
  })
  const [ttsSupported, setTTSSupported] = useState(true)

  // Refs
  const contentRef = useRef<HTMLDivElement>(null)
  const readingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const isStoppingRef = useRef(false)

  useEffect(() => {
    loadBookData()
    startReadingTimer()
    initializeTTS()

    return () => {
      if (readingTimerRef.current) {
        clearInterval(readingTimerRef.current)
      }
      cleanupTTS()
    }
  }, [bookId])

  useEffect(() => {
    updateReadingProgress()
  }, [currentChapter])

  useEffect(() => {
    if (chapters[currentChapter]) {
      prepareTTSContent()
    }
  }, [currentChapter, chapters])

  const initializeTTS = () => {
    try {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        speechSynthesisRef.current = window.speechSynthesis

        // Load voices
        const loadVoices = () => {
          try {
            const voices = speechSynthesisRef.current?.getVoices() || []
            setAvailableVoices(voices)

            // Set default voice (prefer Spanish voices)
            const spanishVoice = voices.find((voice) => voice.lang.startsWith("es"))
            const englishVoice = voices.find((voice) => voice.lang.startsWith("en"))
            const defaultVoice = spanishVoice || englishVoice || voices[0]

            if (defaultVoice && !ttsSettings.voice) {
              setTTSSettings((prev) => ({ ...prev, voice: defaultVoice.name }))
            }
          } catch (error) {
            console.error("Error loading voices:", error)
            setTTSSupported(false)
          }
        }

        loadVoices()

        // Some browsers need this event to load voices
        if (speechSynthesisRef.current.onvoiceschanged !== undefined) {
          speechSynthesisRef.current.onvoiceschanged = loadVoices
        }
      } else {
        setTTSSupported(false)
      }
    } catch (error) {
      console.error("Error initializing TTS:", error)
      setTTSSupported(false)
    }
  }

  const prepareTTSContent = () => {
    if (!chapters[currentChapter]) return

    const content = chapters[currentChapter].content
    // Split content into sentences for better TTS control
    const sentenceArray = content
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => s + ".")

    setSentences(sentenceArray)
    setCurrentSentenceIndex(0)
  }

  const cleanupTTS = () => {
    try {
      isStoppingRef.current = true
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel()
      }
      if (currentUtteranceRef.current) {
        currentUtteranceRef.current.onend = null
        currentUtteranceRef.current.onerror = null
        currentUtteranceRef.current = null
      }
      setIsPlaying(false)
      setIsPaused(false)
      removeHighlight()
    } catch (error) {
      console.error("Error cleaning up TTS:", error)
    }
  }

  const startTTS = () => {
    if (!ttsSupported || !speechSynthesisRef.current || !ttsSettings.enabled || sentences.length === 0) {
      if (!ttsSupported) {
        toast({
          title: "Función no disponible",
          description: "Tu navegador no soporta síntesis de voz",
          variant: "destructive",
        })
      }
      return
    }

    try {
      // Cancel any ongoing speech first
      cleanupTTS()
      isStoppingRef.current = false

      setIsPlaying(true)
      setIsPaused(false)
      speakFromSentence(currentSentenceIndex)
    } catch (error) {
      console.error("Error starting TTS:", error)
      setIsPlaying(false)
      toast({
        title: "Error de síntesis de voz",
        description: "No se pudo iniciar la reproducción de voz",
        variant: "destructive",
      })
    }
  }

  const speakFromSentence = (startIndex: number) => {
    if (!speechSynthesisRef.current || startIndex >= sentences.length || isStoppingRef.current) {
      setIsPlaying(false)
      setCurrentSentenceIndex(0)
      return
    }

    try {
      const utterance = new SpeechSynthesisUtterance(sentences[startIndex])

      // Find the selected voice or use default
      let selectedVoice = availableVoices.find((voice) => voice.name === ttsSettings.voice)

      // Fallback to any available voice if the selected one isn't available
      if (!selectedVoice && availableVoices.length > 0) {
        selectedVoice = availableVoices[0]
        setTTSSettings((prev) => ({ ...prev, voice: selectedVoice!.name }))
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice
      }

      utterance.rate = ttsSettings.rate
      utterance.pitch = ttsSettings.pitch
      utterance.volume = ttsSettings.volume

      utterance.onstart = () => {
        if (!isStoppingRef.current) {
          setCurrentSentenceIndex(startIndex)
          highlightCurrentSentence(startIndex)
        }
      }

      utterance.onend = () => {
        if (!isStoppingRef.current && isPlaying && !isPaused) {
          const nextIndex = startIndex + 1
          if (nextIndex < sentences.length) {
            speakFromSentence(nextIndex)
          } else {
            // Chapter finished, move to next chapter if available
            if (currentChapter < chapters.length - 1) {
              setCurrentChapter((prev) => prev + 1)
              toast({
                title: "Capítulo completado",
                description: "Continuando con el siguiente capítulo",
              })
            } else {
              setIsPlaying(false)
              setCurrentSentenceIndex(0)
              removeHighlight()
              toast({
                title: "Lectura completada",
                description: "Has terminado de escuchar el libro",
              })
            }
          }
        }
      }

      utterance.onerror = (event) => {
        // Handle different types of TTS errors more gracefully
        console.error("TTS Error:", event.error)

        // Don't show error toasts for common interruption errors
        const silentErrors = ["canceled", "interrupted", "aborted", "network"]

        if (!silentErrors.includes(event.error) && !isStoppingRef.current) {
          toast({
            title: "Error de síntesis de voz",
            description: `Error durante la reproducción: ${event.error}`,
            variant: "destructive",
          })
        }

        // Reset state only if we're not intentionally stopping
        if (!isStoppingRef.current) {
          setIsPlaying(false)
          setIsPaused(false)
          removeHighlight()
        }
      }

      // Store the current utterance so we can cancel it if needed
      currentUtteranceRef.current = utterance

      // Speak the utterance
      speechSynthesisRef.current.speak(utterance)
    } catch (error) {
      console.error("Error in speakFromSentence:", error)
      setIsPlaying(false)
      if (!isStoppingRef.current) {
        toast({
          title: "Error de síntesis de voz",
          description: "No se pudo reproducir el texto seleccionado",
          variant: "destructive",
        })
      }
    }
  }

  const pauseTTS = () => {
    try {
      if (speechSynthesisRef.current && isPlaying && !isStoppingRef.current) {
        speechSynthesisRef.current.pause()
        setIsPaused(true)
      }
    } catch (error) {
      console.error("Error pausing TTS:", error)
      stopTTS()
    }
  }

  const resumeTTS = () => {
    try {
      if (speechSynthesisRef.current && isPaused && !isStoppingRef.current) {
        speechSynthesisRef.current.resume()
        setIsPaused(false)
      }
    } catch (error) {
      console.error("Error resuming TTS:", error)
      // If resume fails, try to restart from current sentence
      stopTTS()
      setTimeout(() => startTTS(), 100)
    }
  }

  const stopTTS = () => {
    cleanupTTS()
  }

  const skipForward = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      const nextIndex = currentSentenceIndex + 1
      setCurrentSentenceIndex(nextIndex)

      if (isPlaying) {
        cleanupTTS()
        isStoppingRef.current = false
        setIsPlaying(true)
        speakFromSentence(nextIndex)
      }
    }
  }

  const skipBackward = () => {
    if (currentSentenceIndex > 0) {
      const prevIndex = currentSentenceIndex - 1
      setCurrentSentenceIndex(prevIndex)

      if (isPlaying) {
        cleanupTTS()
        isStoppingRef.current = false
        setIsPlaying(true)
        speakFromSentence(prevIndex)
      }
    }
  }

  const highlightCurrentSentence = (index: number) => {
    removeHighlight()

    if (contentRef.current) {
      const textContent = contentRef.current.textContent || ""
      const sentence = sentences[index]
      if (sentence && textContent.includes(sentence.replace(".", ""))) {
        contentRef.current.style.backgroundColor = darkMode ? "#1f2937" : "#fef3c7"
      }
    }
  }

  const removeHighlight = () => {
    if (contentRef.current) {
      contentRef.current.style.backgroundColor = "transparent"
    }
  }

  const loadBookData = async () => {
    try {
      // Mock book data
      const mockBook: Book = {
        id: bookId,
        title: "Hábitos Atómicos",
        author: "James Clear",
        description: "Un método fácil y comprobado para crear buenos hábitos y eliminar los malos.",
        cover_url: "/books/atomic-habits.jpg",
        total_pages: 320,
        total_chapters: 20,
        estimated_reading_time: 270,
      }

      const mockChapters: Chapter[] = [
        {
          id: "1",
          title: "Los fundamentos: Por qué los pequeños cambios generan una gran diferencia",
          content: `Los hábitos son el interés compuesto del autodesarrollo. De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican conforme los repites. Parecen generar poca diferencia en un día determinado y, sin embargo, el impacto que producen a lo largo de los meses y años puede ser enorme.

Es solo cuando miramos hacia atrás —dos, cinco o quizás diez años después— que el valor de los buenos hábitos y el costo de los malos se vuelve asombrosamente evidente.

Lamentablemente, los hábitos lentos del cambio también hace que sea fácil dejar que los malos hábitos se deslicen. Si comes una hamburguesa poco saludable hoy, la báscula no se moverá mucho. Si trabajas hasta tarde esta noche e ignoras a tu familia, ellos te perdonarán. Si pospones tu proyecto por un día más, siempre habrá mañana para ponerte al día.

Un solo error no arruinará tu vida, de la misma manera que una sola decisión inteligente no te catapultará al éxito. Pero conforme las decisiones se acumulan, también lo hacen los resultados de tus decisiones.

Los hábitos son una espada de doble filo. Los malos hábitos pueden reducirte tanto como los buenos hábitos pueden elevarte, razón por la cual entender los detalles es crucial.

Pequeños cambios a menudo parecen no generar diferencia hasta que cruzas un umbral crítico. Los resultados más poderosos de cualquier proceso de cambio compuesto se retrasan. Necesitas ser paciente.

Un cubo de hielo permanece como cubo de hielo a -6°C, -5°C, -4°C, -3°C, -2°C, -1°C. No es hasta que llega a 0°C que comienza a derretirse. Un grado de diferencia, aparentemente pequeño e insignificante, ha desencadenado una transformación enorme.

Los avances a menudo son el resultado de muchas acciones previas, que construyen el potencial requerido para desencadenar un cambio mayor. Esto es similar a como los átomos se acumulan en una reacción nuclear, lentamente al principio, luego todo a la vez en una explosión masiva.

Bambú que crece en China puede crecer hasta 90 pies en seis semanas, pero durante los primeros cinco años, apenas se ve crecimiento sobre el suelo. Durante esos cinco años, una extensa red de raíces se extiende bajo tierra. El trabajo no fue inútil, simplemente no era visible.

Los hábitos funcionan de la misma manera. Puedes trabajar durante años para cambiar y no ver nada. Pero si te mantienes en ello, puedes lograr resultados extraordinarios.`,
          page_start: 1,
          page_end: 16,
          reading_time: 12,
        },
        {
          id: "2",
          title: "Cómo tus hábitos moldean tu identidad (y viceversa)",
          content: `¿Por qué es tan fácil repetir los malos hábitos y tan difícil formar buenos? Pocas cosas pueden tener un impacto más poderoso en tu vida que mejorar tus hábitos diarios. Y sin embargo es probable que este tiempo el próximo año estarás haciendo las mismas cosas que estás haciendo hoy.

¿Por qué es tan difícil el cambio?

Cambiamos a tres niveles: cambio de resultados, cambio de procesos y cambio de identidad.

El primer nivel es cambiar tus resultados. Este nivel se preocupa por cambiar tus resultados: perder peso, publicar un libro, ganar un campeonato. La mayoría de las metas que te fijas están en este nivel.

El segundo nivel es cambiar tu proceso. Este nivel se preocupa por cambiar tus hábitos y sistemas: implementar una nueva rutina en el gimnasio, decluttering tu escritorio para un mejor flujo de trabajo, desarrollar una práctica de meditación. La mayoría de los hábitos que construyes están en este nivel.

El tercer y más profundo nivel es cambiar tu identidad. Este nivel se preocupa por cambiar tus creencias: tu visión del mundo, tu autoimagen, tus juicios sobre ti mismo y otros. La mayoría de las creencias, suposiciones y sesgos que tienes están en este nivel.

Los resultados son sobre lo que obtienes. Los procesos son sobre lo que haces. La identidad es sobre lo que crees.

Cuando se trata de construir hábitos que duran —cuando se trata de construir un sistema de 1 por ciento de mejoras— el problema no es que un nivel sea "mejor" o "peor" que otro. Todos los niveles de cambio son útiles a su manera. El problema es la dirección del cambio.

Muchas personas comienzan el proceso de cambiar sus hábitos enfocándose en lo que quieren lograr. Esto los lleva a hábitos basados en resultados. La alternativa es construir hábitos basados en identidad. Con este enfoque, comenzamos enfocándonos en quién deseamos convertirnos.

Imagina dos personas resistiendo un cigarrillo. Cuando se les ofrece un humo, la primera persona dice: "No, gracias. Estoy tratando de dejar de fumar". Suena como una respuesta razonable, pero esta persona todavía cree que es un fumador que está tratando de ser algo más. Espera que su comportamiento cambie mientras se aferra a la misma creencia.

La segunda persona declina diciendo: "No, gracias. No soy fumador". Es una pequeña diferencia, pero esta declaración proviene de una identidad diferente. Ya no se ven a sí mismos como fumadores.

La mayoría de las personas ni siquiera consideran el cambio de identidad cuando se proponen mejorar. Solo piensan: "Quiero ser delgado" o "Quiero ser fuerte" o "Quiero ser inteligente". Todas estas son metas basadas en resultados.

Deberías estar mucho más preocupado por tu identidad actual que por tus resultados actuales. Si tienes las mismas creencias que antes, entonces es natural que vuelvas a tus viejos hábitos.

El objetivo no es leer un libro, el objetivo es convertirse en lector.
El objetivo no es correr un maratón, el objetivo es convertirse en corredor.
El objetivo no es aprender un instrumento, el objetivo es convertirse en músico.

Tus comportamientos son usualmente un reflejo de tu identidad. Lo que haces es una indicación del tipo de persona que crees que eres —ya sea consciente o inconscientemente.`,
          page_start: 33,
          page_end: 48,
          reading_time: 18,
        },
      ]

      const mockProgress: ReadingProgress = {
        current_chapter: 0,
        current_position: 0,
        progress_percentage: 65,
        time_spent: 180,
        last_read: "2024-01-15T10:30:00Z",
        bookmarks_count: 8,
        notes_count: 12,
      }

      const mockBookmarks: Bookmarks[] = [
        {
          id: "1",
          chapter_id: "1",
          chapter_title: "Los fundamentos",
          position: 150,
          selected_text: "Los hábitos son el interés compuesto del autodesarrollo",
          note: "Concepto clave - los hábitos se acumulan con el tiempo",
          created_at: "2024-01-10T14:20:00Z",
          page_number: 3,
        },
        {
          id: "2",
          chapter_id: "1",
          chapter_title: "Los fundamentos",
          position: 890,
          selected_text:
            "Un cubo de hielo permanece como cubo de hielo a -6°C, -5°C, -4°C, -3°C, -2°C, -1°C. No es hasta que llega a 0°C que comienza a derretirse.",
          note: "Excelente metáfora sobre los puntos de inflexión",
          created_at: "2024-01-11T09:15:00Z",
          page_number: 8,
        },
      ]

      const mockNotes: Note[] = [
        {
          id: "1",
          chapter_id: "1",
          chapter_title: "Los fundamentos",
          title: "Reflexión sobre el interés compuesto",
          content:
            "Me parece fascinante cómo Clear conecta el concepto financiero del interés compuesto con el desarrollo personal. Esto me hace pensar en cómo pequeñas acciones diarias en mi carrera profesional pueden acumularse para generar grandes resultados a largo plazo.",
          selected_text: "Los hábitos son el interés compuesto del autodesarrollo",
          position: 150,
          created_at: "2024-01-10T14:25:00Z",
          updated_at: "2024-01-10T14:25:00Z",
          page_number: 3,
        },
      ]

      setBook(mockBook)
      setChapters(mockChapters)
      setReadingProgress(mockProgress)
      setBookmarks(mockBookmarks)
      setNotes(mockNotes)
    } catch (error) {
      console.error("Error loading book data:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar el libro. Intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  const startReadingTimer = () => {
    readingTimerRef.current = setInterval(() => {
      setReadingProgress((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          time_spent: prev.time_spent + 1,
        }
      })
    }, 60000)
  }

  const updateReadingProgress = () => {
    if (!readingProgress) return

    const newProgress = {
      ...readingProgress,
      current_chapter: currentChapter,
      current_position: 0,
      progress_percentage: Math.round(((currentChapter + 1) / chapters.length) * 100),
      last_read: new Date().toISOString(),
    }

    setReadingProgress(newProgress)
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString().trim()
      setSelectedText(selectedText)

      const range = selection.getRangeAt(0)
      setSelectionRange({ start: range.startOffset, end: range.endOffset })
    }
  }

  const createBookmark = async () => {
    if (!selectedText) {
      toast({
        title: "Error",
        description: "Selecciona texto para crear un marcador",
        variant: "destructive",
      })
      return
    }

    const newBookmark: Bookmarks = {
      id: Date.now().toString(),
      chapter_id: chapters[currentChapter].id,
      chapter_title: chapters[currentChapter].title,
      position: selectionRange?.start || 0,
      selected_text: selectedText,
      note: bookmarkNote,
      created_at: new Date().toISOString(),
      page_number: chapters[currentChapter].page_start + Math.floor(currentChapter * 2),
    }

    setBookmarks((prev) => [...prev, newBookmark])
    setReadingProgress((prev) => (prev ? { ...prev, bookmarks_count: prev.bookmarks_count + 1 } : prev))

    setShowBookmarkDialog(false)
    setSelectedText("")
    setBookmarkNote("")
    setSelectionRange(null)

    toast({
      title: "Marcador creado",
      description: "El marcador se ha guardado exitosamente",
    })
  }

  const createNote = async () => {
    if (!newNoteTitle.trim()) {
      toast({
        title: "Error",
        description: "El título de la nota es requerido",
        variant: "destructive",
      })
      return
    }

    const newNote: Note = {
      id: Date.now().toString(),
      chapter_id: chapters[currentChapter].id,
      chapter_title: chapters[currentChapter].title,
      title: newNoteTitle,
      content: newNoteContent,
      selected_text: selectedText || undefined,
      position: selectionRange?.start || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      page_number: chapters[currentChapter].page_start + Math.floor(currentChapter * 2),
    }

    setNotes((prev) => [...prev, newNote])
    setReadingProgress((prev) => (prev ? { ...prev, notes_count: prev.notes_count + 1 } : prev))

    setShowNoteDialog(false)
    setNewNoteTitle("")
    setNewNoteContent("")
    setSelectedText("")
    setSelectionRange(null)

    toast({
      title: "Nota creada",
      description: "La nota se ha guardado exitosamente",
    })
  }

  const updateNote = async () => {
    if (!editingNote || !newNoteTitle.trim()) return

    const updatedNote: Note = {
      ...editingNote,
      title: newNoteTitle,
      content: newNoteContent,
      updated_at: new Date().toISOString(),
    }

    setNotes((prev) => prev.map((note) => (note.id === editingNote.id ? updatedNote : note)))

    setEditingNote(null)
    setNewNoteTitle("")
    setNewNoteContent("")
    setShowNoteDialog(false)

    toast({
      title: "Nota actualizada",
      description: "Los cambios se han guardado exitosamente",
    })
  }

  const deleteBookmark = (bookmarkId: string) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== bookmarkId))
    setReadingProgress((prev) => (prev ? { ...prev, bookmarks_count: prev.bookmarks_count - 1 } : prev))

    toast({
      title: "Marcador eliminado",
      description: "El marcador se ha eliminado exitosamente",
    })
  }

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId))
    setReadingProgress((prev) => (prev ? { ...prev, notes_count: prev.notes_count - 1 } : prev))

    toast({
      title: "Nota eliminada",
      description: "La nota se ha eliminado exitosamente",
    })
  }

  const jumpToBookmark = (bookmark: Bookmarks) => {
    const chapterIndex = chapters.findIndex((chapter) => chapter.id === bookmark.chapter_id)
    if (chapterIndex !== -1) {
      setCurrentChapter(chapterIndex)
      setSidebarOpen(false)

      toast({
        title: "Navegando al marcador",
        description: `Capítulo: ${bookmark.chapter_title}`,
      })
    }
  }

  const jumpToNote = (note: Note) => {
    const chapterIndex = chapters.findIndex((chapter) => chapter.id === note.chapter_id)
    if (chapterIndex !== -1) {
      setCurrentChapter(chapterIndex)
      setSidebarOpen(false)

      toast({
        title: "Navegando a la nota",
        description: `Capítulo: ${note.chapter_title}`,
      })
    }
  }

  const nextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(currentChapter + 1)
      stopTTS()
    }
  }

  const previousChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1)
      stopTTS()
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!book || chapters.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Cargando libro...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <div
        className={`sticky top-0 z-40 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{book.title}</h1>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>por {book.author}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Text-to-Speech Controls */}
            <div className="flex items-center space-x-1 mr-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={skipBackward}
                disabled={!ttsSupported || !ttsSettings.enabled || currentSentenceIndex === 0}
                title="Retroceder oración"
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={isPlaying ? (isPaused ? resumeTTS : pauseTTS) : startTTS}
                disabled={!ttsSupported || !ttsSettings.enabled}
                title={isPlaying ? (isPaused ? "Reanudar" : "Pausar") : "Reproducir"}
              >
                {isPlaying && !isPaused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={stopTTS}
                disabled={!ttsSupported || (!isPlaying && !isPaused)}
                title="Detener"
              >
                <Square className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={skipForward}
                disabled={!ttsSupported || !ttsSettings.enabled || currentSentenceIndex >= sentences.length - 1}
                title="Avanzar oración"
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTTSSettings(true)}
                disabled={!ttsSupported}
                title="Configuración de voz"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Reading Controls */}
            <Button variant="ghost" size="sm" onClick={() => setFontSize(Math.max(12, fontSize - 2))}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{fontSize}px</span>
            <Button variant="ghost" size="sm" onClick={() => setFontSize(Math.min(24, fontSize + 2))}>
              <Plus className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Navegación y Notas</SheetTitle>
                  <SheetDescription>Capítulos, marcadores y notas del libro</SheetDescription>
                </SheetHeader>

                <Tabs defaultValue="chapters" className="mt-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="chapters">Capítulos</TabsTrigger>
                    <TabsTrigger value="bookmarks">Marcadores</TabsTrigger>
                    <TabsTrigger value="notes">Notas</TabsTrigger>
                  </TabsList>

                  <TabsContent value="chapters" className="mt-4">
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-2">
                        {chapters.map((chapter, index) => (
                          <Card
                            key={chapter.id}
                            className={`p-3 cursor-pointer transition-colors ${
                              index === currentChapter ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                            }`}
                            onClick={() => {
                              setCurrentChapter(index)
                              setSidebarOpen(false)
                              stopTTS()
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm mb-1">Capítulo {index + 1}</h4>
                                <p className="text-xs text-gray-600 line-clamp-2">{chapter.title}</p>
                                <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {chapter.reading_time}m
                                  </span>
                                  <span>
                                    Págs. {chapter.page_start}-{chapter.page_end}
                                  </span>
                                </div>
                              </div>
                              {index === currentChapter && (
                                <Badge variant="secondary" className="ml-2">
                                  Actual
                                </Badge>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="bookmarks" className="mt-4">
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-3">
                        {bookmarks.map((bookmark) => (
                          <Card key={bookmark.id} className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-blue-600 mb-1">{bookmark.chapter_title}</p>
                                <p className="text-xs text-gray-600 italic mb-2">"{bookmark.selected_text}"</p>
                                {bookmark.note && <p className="text-xs text-gray-700 mb-2">{bookmark.note}</p>}
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(bookmark.created_at)}</span>
                                  <MapPin className="h-3 w-3 ml-2" />
                                  <span>Pág. {bookmark.page_number}</span>
                                </div>
                              </div>
                              <div className="flex space-x-1 ml-2">
                                <Button variant="ghost" size="sm" onClick={() => jumpToBookmark(bookmark)}>
                                  <Target className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteBookmark(bookmark.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                        {bookmarks.length === 0 && (
                          <p className="text-center text-gray-500 text-sm py-8">
                            No hay marcadores aún. Selecciona texto y crea tu primer marcador.
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="notes" className="mt-4">
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-3">
                        {notes.map((note) => (
                          <Card key={note.id} className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm mb-1">{note.title}</h4>
                                <p className="text-xs text-blue-600 mb-2">{note.chapter_title}</p>
                                {note.selected_text && (
                                  <p className="text-xs text-gray-600 italic mb-2">"{note.selected_text}"</p>
                                )}
                                <p className="text-xs text-gray-700 mb-2 line-clamp-3">{note.content}</p>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(note.updated_at)}</span>
                                  <MapPin className="h-3 w-3 ml-2" />
                                  <span>Pág. {note.page_number}</span>
                                </div>
                              </div>
                              <div className="flex space-x-1 ml-2">
                                <Button variant="ghost" size="sm" onClick={() => jumpToNote(note)}>
                                  <Target className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingNote(note)
                                    setNewNoteTitle(note.title)
                                    setNewNoteContent(note.content)
                                    setShowNoteDialog(true)
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteNote(note.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                        {notes.length === 0 && (
                          <p className="text-center text-gray-500 text-sm py-8">
                            No hay notas aún. Crea tu primera nota para guardar tus reflexiones.
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Progress Bar */}
        {readingProgress && (
          <div className="px-4 pb-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>
                Capítulo {currentChapter + 1} de {chapters.length}
              </span>
              <span>{readingProgress.progress_percentage}% completado</span>
            </div>
            <Progress value={readingProgress.progress_percentage} className="h-1" />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Capítulo {currentChapter + 1}: {chapters[currentChapter].title}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {chapters[currentChapter].reading_time} min de lectura
              </span>
              <span>
                Páginas {chapters[currentChapter].page_start}-{chapters[currentChapter].page_end}
              </span>
              {readingProgress && (
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(readingProgress.time_spent)} leído
                </span>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedText) {
                  setShowBookmarkDialog(true)
                } else {
                  toast({
                    title: "Selecciona texto",
                    description: "Selecciona texto para crear un marcador",
                    variant: "destructive",
                  })
                }
              }}
            >
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Marcador
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingNote(null)
                setNewNoteTitle("")
                setNewNoteContent("")
                setShowNoteDialog(true)
              }}
            >
              <StickyNote className="h-4 w-4 mr-2" />
              Nota
            </Button>
          </div>
        </div>

        {/* TTS Status */}
        {isPlaying && ttsSupported && (
          <div
            className={`mb-4 p-3 rounded-lg ${darkMode ? "bg-blue-900/20 border-blue-800" : "bg-blue-50 border-blue-200"} border`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Headphones className="h-4 w-4 text-blue-600" />
                <span className={`text-sm ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
                  Reproduciendo: Oración {currentSentenceIndex + 1} de {sentences.length}
                </span>
              </div>
              <Badge variant={isPaused ? "secondary" : "default"}>{isPaused ? "Pausado" : "Reproduciendo"}</Badge>
            </div>
          </div>
        )}

        {/* Reading Content */}
        <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <div className="p-8">
            <div
              ref={contentRef}
              className={`prose max-w-none ${darkMode ? "prose-invert" : ""}`}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                color: darkMode ? "#e5e7eb" : "#374151",
              }}
              onMouseUp={handleTextSelection}
            >
              {chapters[currentChapter].content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={previousChapter}
            disabled={currentChapter === 0}
            className="flex items-center space-x-2 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Capítulo anterior</span>
          </Button>

          <div className="text-center">
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Capítulo {currentChapter + 1} de {chapters.length}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={nextChapter}
            disabled={currentChapter === chapters.length - 1}
            className="flex items-center space-x-2 bg-transparent"
          >
            <span>Siguiente capítulo</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* TTS Settings Dialog */}
      <Dialog open={showTTSSettings} onOpenChange={setShowTTSSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configuración de Síntesis de Voz</DialogTitle>
            <DialogDescription>Personaliza la experiencia de lectura en voz alta</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Voz</label>
              <Select
                value={ttsSettings.voice}
                onValueChange={(value) => setTTSSettings((prev) => ({ ...prev, voice: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una voz" />
                </SelectTrigger>
                <SelectContent>
                  {availableVoices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Velocidad: {ttsSettings.rate.toFixed(1)}x</label>
              <Slider
                value={[ttsSettings.rate]}
                onValueChange={([value]) => setTTSSettings((prev) => ({ ...prev, rate: value }))}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tono: {ttsSettings.pitch.toFixed(1)}</label>
              <Slider
                value={[ttsSettings.pitch]}
                onValueChange={([value]) => setTTSSettings((prev) => ({ ...prev, pitch: value }))}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Volumen: {Math.round(ttsSettings.volume * 100)}%</label>
              <Slider
                value={[ttsSettings.volume]}
                onValueChange={([value]) => setTTSSettings((prev) => ({ ...prev, volume: value }))}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Habilitar síntesis de voz</label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTTSSettings((prev) => ({ ...prev, enabled: !prev.enabled }))}
              >
                {ttsSettings.enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>

            {!ttsSupported && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Tu navegador no soporta síntesis de voz o la función no está disponible.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Bookmark Dialog */}
      <Dialog open={showBookmarkDialog} onOpenChange={setShowBookmarkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Marcador</DialogTitle>
            <DialogDescription>Guarda este fragmento para referencia futura</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Texto seleccionado:</label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-sm italic text-gray-600">"{selectedText}"</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Nota (opcional):</label>
              <Textarea
                placeholder="Añade una nota personal sobre este marcador..."
                value={bookmarkNote}
                onChange={(e) => setBookmarkNote(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowBookmarkDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={createBookmark}>Crear Marcador</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingNote ? "Editar Nota" : "Crear Nota"}</DialogTitle>
            <DialogDescription>
              {editingNote ? "Modifica tu nota existente" : "Crea una nueva nota para este capítulo"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedText && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Texto seleccionado:</label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-sm italic text-gray-600">"{selectedText}"</p>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Título:</label>
              <Input
                placeholder="Título de la nota..."
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Contenido:</label>
              <Textarea
                placeholder="Escribe tu nota aquí..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={5}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNoteDialog(false)
                  setEditingNote(null)
                  setNewNoteTitle("")
                  setNewNoteContent("")
                }}
              >
                Cancelar
              </Button>
              <Button onClick={editingNote ? updateNote : createNote}>
                {editingNote ? "Actualizar Nota" : "Crear Nota"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
