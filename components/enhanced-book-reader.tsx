"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  X,
  Bookmark,
  Settings,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  StickyNote,
  Clock,
  Maximize,
  Minimize,
  Type,
  Palette,
  Save,
} from "lucide-react"

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

interface EnhancedBookReaderProps {
  book: Book
  isOpen: boolean
  onClose: () => void
  onBookmark: (bookId: number) => void
  isBookmarked: boolean
}

interface ReadingSettings {
  fontSize: number
  fontFamily: string
  theme: "light" | "dark" | "sepia"
  lineHeight: number
  wordsPerPage: number
}

interface ReadingNote {
  id: string
  page: number
  position: number
  text: string
  note: string
  timestamp: string
}

export default function EnhancedBookReader({
  book,
  isOpen,
  onClose,
  onBookmark,
  isBookmarked,
}: EnhancedBookReaderProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [readingProgress, setReadingProgress] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const [readingTime, setReadingTime] = useState(0)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)

  const [settings, setSettings] = useState<ReadingSettings>({
    fontSize: 16,
    fontFamily: "serif",
    theme: "light",
    lineHeight: 1.6,
    wordsPerPage: 300,
  })

  const [notes, setNotes] = useState<ReadingNote[]>([])
  const [newNote, setNewNote] = useState("")
  const [selectedText, setSelectedText] = useState("")

  const contentRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  // Dividir contenido en páginas
  const words = book.content.split(/\s+/)
  const pages = []
  for (let i = 0; i < words.length; i += settings.wordsPerPage) {
    pages.push(words.slice(i, i + settings.wordsPerPage).join(" "))
  }

  useEffect(() => {
    setTotalPages(pages.length)
    setReadingProgress((currentPage / pages.length) * 100)
  }, [currentPage, pages.length])

  useEffect(() => {
    if (isReading && sessionStartTime) {
      timerRef.current = setInterval(() => {
        setReadingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isReading, sessionStartTime])

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const startReading = () => {
    setIsReading(true)
    setSessionStartTime(new Date())
    toast({
      title: "Sesión de lectura iniciada",
      description: "El cronómetro está corriendo. ¡Disfruta la lectura!",
    })
  }

  const pauseReading = () => {
    setIsReading(false)
    toast({
      title: "Lectura pausada",
      description: `Has leído durante ${Math.floor(readingTime / 60)} minutos y ${readingTime % 60} segundos.`,
    })
  }

  const resetTimer = () => {
    setReadingTime(0)
    setSessionStartTime(null)
    setIsReading(false)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim())
      setShowNotes(true)
    }
  }

  const addNote = () => {
    if (newNote.trim() || selectedText.trim()) {
      const note: ReadingNote = {
        id: Date.now().toString(),
        page: currentPage,
        position: readingProgress,
        text: selectedText,
        note: newNote,
        timestamp: new Date().toISOString(),
      }
      setNotes([...notes, note])
      setNewNote("")
      setSelectedText("")
      setShowNotes(false)
      toast({
        title: "Nota guardada",
        description: "Tu nota ha sido guardada exitosamente.",
      })
    }
  }

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId))
    toast({
      title: "Nota eliminada",
      description: "La nota ha sido eliminada.",
    })
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const getThemeClasses = () => {
    switch (settings.theme) {
      case "dark":
        return "bg-gray-900 text-gray-100"
      case "sepia":
        return "bg-amber-50 text-amber-900"
      default:
        return "bg-white text-gray-900"
    }
  }

  const getFontFamilyClass = () => {
    switch (settings.fontFamily) {
      case "sans":
        return "font-sans"
      case "mono":
        return "font-mono"
      default:
        return "font-serif"
    }
  }

  // Navegación por teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          prevPage()
          break
        case "ArrowRight":
          e.preventDefault()
          nextPage()
          break
        case "Escape":
          e.preventDefault()
          onClose()
          break
        case "f":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            toggleFullscreen()
          }
          break
        case " ":
          e.preventDefault()
          if (isReading) {
            pauseReading()
          } else {
            startReading()
          }
          break
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyPress)
    }

    return () => {
      document.removeEventListener("keydown", handleKeyPress)
    }
  }, [isOpen, currentPage, totalPages, isReading])

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`${isFullscreen ? "max-w-full h-full" : "max-w-4xl h-[90vh]"} p-0 ${getThemeClasses()}`}
      >
        {/* Header */}
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
          <div className="flex-1">
            <DialogTitle className="text-lg font-semibold line-clamp-1">{book.title}</DialogTitle>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{book.category}</Badge>
            <Button variant="ghost" size="sm" onClick={() => onBookmark(book.id)}>
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current text-yellow-500" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Panel de Configuraciones */}
          {showSettings && (
            <div className="w-80 border-r p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Configuración de Lectura</h3>

              <div className="space-y-6">
                {/* Tamaño de Fuente */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Tamaño de Fuente</label>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={([value]) => setSettings({ ...settings, fontSize: value })}
                    min={12}
                    max={24}
                    step={1}
                    className="mb-2"
                  />
                  <span className="text-sm text-muted-foreground">{settings.fontSize}px</span>
                </div>

                {/* Familia de Fuente */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Tipo de Fuente</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["serif", "sans", "mono"].map((font) => (
                      <Button
                        key={font}
                        variant={settings.fontFamily === font ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSettings({ ...settings, fontFamily: font })}
                        className="capitalize"
                      >
                        <Type className="h-4 w-4 mr-1" />
                        {font}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Tema */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Tema</label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={settings.theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, theme: "light" })}
                    >
                      <Sun className="h-4 w-4 mr-1" />
                      Claro
                    </Button>
                    <Button
                      variant={settings.theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, theme: "dark" })}
                    >
                      <Moon className="h-4 w-4 mr-1" />
                      Oscuro
                    </Button>
                    <Button
                      variant={settings.theme === "sepia" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, theme: "sepia" })}
                    >
                      <Palette className="h-4 w-4 mr-1" />
                      Sepia
                    </Button>
                  </div>
                </div>

                {/* Interlineado */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Interlineado</label>
                  <Slider
                    value={[settings.lineHeight]}
                    onValueChange={([value]) => setSettings({ ...settings, lineHeight: value })}
                    min={1.2}
                    max={2.0}
                    step={0.1}
                    className="mb-2"
                  />
                  <span className="text-sm text-muted-foreground">{settings.lineHeight.toFixed(1)}</span>
                </div>

                {/* Palabras por Página */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Palabras por Página</label>
                  <Slider
                    value={[settings.wordsPerPage]}
                    onValueChange={([value]) => setSettings({ ...settings, wordsPerPage: value })}
                    min={200}
                    max={500}
                    step={50}
                    className="mb-2"
                  />
                  <span className="text-sm text-muted-foreground">{settings.wordsPerPage} palabras</span>
                </div>
              </div>
            </div>
          )}

          {/* Panel de Notas */}
          {showNotes && (
            <div className="w-80 border-r p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Notas</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowNotes(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Agregar Nueva Nota */}
              <div className="space-y-3 mb-6">
                {selectedText && (
                  <div className="p-2 bg-muted rounded text-sm">
                    <strong>Texto seleccionado:</strong>
                    <p className="mt-1 italic">"{selectedText}"</p>
                  </div>
                )}
                <Textarea
                  placeholder="Escribe tu nota aquí..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <Button onClick={addNote} size="sm" className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Nota
                </Button>
              </div>

              {/* Lista de Notas */}
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Página {note.page}</span>
                      <Button variant="ghost" size="sm" onClick={() => deleteNote(note.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    {note.text && <p className="text-sm italic mb-2 p-2 bg-muted rounded">"{note.text}"</p>}
                    <p className="text-sm">{note.note}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(note.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {notes.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay notas aún. Selecciona texto para agregar una nota.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Contenido Principal */}
          <div className="flex-1 flex flex-col">
            {/* Barra de Progreso y Cronómetro */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-mono">{formatTime(readingTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={isReading ? pauseReading : startReading}
                      className="flex items-center gap-1"
                    >
                      {isReading ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isReading ? "Pausar" : "Iniciar"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={resetTimer}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowNotes(!showNotes)}>
                    <StickyNote className="h-4 w-4" />
                    Notas ({notes.length})
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={readingProgress} className="flex-1" />
                <span className="text-sm text-muted-foreground">
                  {Math.round(readingProgress)}% • Página {currentPage} de {totalPages}
                </span>
              </div>
            </div>

            {/* Contenido del Libro */}
            <div className="flex-1 overflow-y-auto p-6">
              <div
                ref={contentRef}
                className={`max-w-3xl mx-auto ${getFontFamilyClass()}`}
                style={{
                  fontSize: `${settings.fontSize}px`,
                  lineHeight: settings.lineHeight,
                }}
                onMouseUp={handleTextSelection}
              >
                <div className="prose prose-lg max-w-none">
                  {pages[currentPage - 1]?.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Navegación */}
            <div className="p-4 border-t">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm">Ir a página:</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => goToPage(Number.parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1 text-sm border rounded text-center"
                  />
                  <span className="text-sm text-muted-foreground">de {totalPages}</span>
                </div>

                <Button
                  variant="outline"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 bg-transparent"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Atajos de Teclado */}
        <div className="px-4 py-2 border-t text-xs text-muted-foreground">
          <span>Atajos: </span>
          <span className="font-mono">← →</span> navegar • <span className="font-mono">Espacio</span> iniciar/pausar •{" "}
          <span className="font-mono">Ctrl+F</span> pantalla completa • <span className="font-mono">Esc</span> cerrar
        </div>
      </DialogContent>
    </Dialog>
  )
}
