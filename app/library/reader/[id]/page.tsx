"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Menu,
  Bookmark,
  BookmarkCheck,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Clock,
  Eye,
  Target,
  ArrowLeft,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { libraryService, type Book, type BookChapter, type UserBookProgress } from "@/lib/supabase-library"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"
import { useToast } from "@/hooks/use-toast"

// Demo user UUID - using a proper UUID format
const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000"

export default function BookReaderPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const bookId = params.id as string

  // State
  const [book, setBook] = useState<Book | null>(null)
  const [chapters, setChapters] = useState<BookChapter[]>([])
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [progress, setProgress] = useState<UserBookProgress | null>(null)
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readingTime, setReadingTime] = useState(0)
  const [isReading, setIsReading] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [lineHeight, setLineHeight] = useState(1.6)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Refs
  const readingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Get current chapter content for TTS
  const currentChapter = chapters[currentChapterIndex]
  const currentChapterContent = currentChapter?.content || ""

  // Text-to-Speech
  const {
    isPlaying,
    isPaused,
    isMuted,
    rate,
    pitch,
    volume,
    play,
    pause,
    resume,
    stop,
    toggleMute,
    setRate,
    setPitch,
    setVolume,
  } = useTextToSpeech(currentChapterContent)

  // Load book data
  useEffect(() => {
    const loadBookData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load book details
        const bookData = await libraryService.getBookById(bookId)
        if (!bookData) {
          setError("Libro no encontrado")
          return
        }
        setBook(bookData)

        // Load chapters
        const chaptersData = await libraryService.getBookChapters(bookId)
        setChapters(chaptersData)

        // Load user progress
        const progressData = await libraryService.getUserBookProgress(bookId, DEMO_USER_ID)
        setProgress(progressData)

        // Set current chapter based on progress
        if (progressData && progressData.current_chapter > 0) {
          const chapterIndex = chaptersData.findIndex((ch) => ch.chapter_number === progressData.current_chapter)
          if (chapterIndex >= 0) {
            setCurrentChapterIndex(chapterIndex)
          }
        }

        // Load bookmarks
        const bookmarksData = await libraryService.getUserBookmarks(bookId, DEMO_USER_ID)
        const bookmarkedChapterIds = bookmarksData.map((b) => b.chapter_id)
        setBookmarks(bookmarkedChapterIds)
      } catch (err) {
        console.error("Error loading book data:", err)
        setError("Error al cargar el libro")
      } finally {
        setLoading(false)
      }
    }

    if (bookId) {
      loadBookData()
    }
  }, [bookId])

  // Reading timer
  useEffect(() => {
    if (isReading) {
      readingTimerRef.current = setInterval(() => {
        setReadingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (readingTimerRef.current) {
        clearInterval(readingTimerRef.current)
      }
    }

    return () => {
      if (readingTimerRef.current) {
        clearInterval(readingTimerRef.current)
      }
    }
  }, [isReading])

  // Auto-save progress
  useEffect(() => {
    const saveProgress = async () => {
      if (book && chapters.length > 0 && currentChapterIndex >= 0) {
        const currentChapter = chapters[currentChapterIndex]
        const progressPercentage = Math.round(((currentChapterIndex + 1) / chapters.length) * 100)

        await libraryService.updateBookProgress(
          bookId,
          {
            current_chapter: currentChapter.chapter_number,
            progress_percentage: progressPercentage,
            reading_time_minutes: Math.floor(readingTime / 60),
            last_read_at: new Date().toISOString(),
          },
          DEMO_USER_ID,
        )
      }
    }

    // Save progress every 30 seconds while reading
    const interval = setInterval(saveProgress, 30000)
    return () => clearInterval(interval)
  }, [book, chapters, currentChapterIndex, readingTime, bookId])

  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1)
      stop() // Stop TTS when changing chapters
    }
  }

  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1)
      stop() // Stop TTS when changing chapters
    }
  }

  const handleChapterSelect = (index: number) => {
    setCurrentChapterIndex(index)
    setSidebarOpen(false)
    stop() // Stop TTS when changing chapters
  }

  const toggleBookmark = async () => {
    if (!currentChapter) return

    const isBookmarked = bookmarks.includes(currentChapter.id)

    try {
      if (isBookmarked) {
        // Remove bookmark
        const success = await libraryService.removeBookmark(bookId, currentChapter.id, DEMO_USER_ID)
        if (success) {
          setBookmarks(bookmarks.filter((id) => id !== currentChapter.id))
          toast({
            title: "Marcador eliminado",
            description: "Se eliminó el marcador de este capítulo.",
          })
        }
      } else {
        // Add bookmark
        const bookmark = await libraryService.addBookmark(
          bookId,
          currentChapter.id,
          currentChapter.title,
          undefined,
          DEMO_USER_ID,
        )
        if (bookmark) {
          setBookmarks([...bookmarks, currentChapter.id])
          toast({
            title: "Marcador añadido",
            description: "Se añadió un marcador a este capítulo.",
          })
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el marcador.",
        variant: "destructive",
      })
    }
  }

  const toggleReading = () => {
    setIsReading(!isReading)
  }

  const handleTTSPlay = () => {
    if (currentChapter && currentChapter.content) {
      if (isPaused) {
        resume()
      } else {
        play()
      }
    }
  }

  const handleTTSPause = () => {
    pause()
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Cargando libro...</p>
        </div>
      </div>
    )
  }

  if (error || !book || !currentChapter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Error</h3>
            <p className="text-red-600 mb-4">{error || "No se pudo cargar el libro"}</p>
            <Button onClick={() => router.push("/library")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la Biblioteca
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const progressPercentage = Math.round(((currentChapterIndex + 1) / chapters.length) * 100)
  const isBookmarked = bookmarks.includes(currentChapter.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/library")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Biblioteca
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900 truncate max-w-xs">{book.title}</h1>
                <p className="text-sm text-gray-600">{book.author}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Reading Timer */}
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatTime(readingTime)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleReading}
                  className={isReading ? "text-green-600" : "text-gray-600"}
                >
                  {isReading ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>

              {/* TTS Controls */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={isPlaying ? handleTTSPause : handleTTSPlay}
                  disabled={!currentChapter?.content}
                  className={isPlaying ? "text-blue-600" : "text-gray-600"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className={isMuted ? "text-red-600" : "text-gray-600"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>

              {/* Settings */}
              <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Configuración de Lectura</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    {/* Font Size */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tamaño de Fuente</label>
                      <Slider
                        value={[fontSize]}
                        onValueChange={(value) => setFontSize(value[0])}
                        min={12}
                        max={24}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>12px</span>
                        <span>{fontSize}px</span>
                        <span>24px</span>
                      </div>
                    </div>

                    {/* Line Height */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Espaciado de Línea</label>
                      <Slider
                        value={[lineHeight]}
                        onValueChange={(value) => setLineHeight(value[0])}
                        min={1.2}
                        max={2.0}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>1.2</span>
                        <span>{lineHeight.toFixed(1)}</span>
                        <span>2.0</span>
                      </div>
                    </div>

                    {/* TTS Settings */}
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Configuración de Voz</h4>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Velocidad</label>
                        <Slider
                          value={[rate]}
                          onValueChange={(value) => setRate(value[0])}
                          min={0.5}
                          max={2.0}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0.5x</span>
                          <span>{rate.toFixed(1)}x</span>
                          <span>2.0x</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tono</label>
                        <Slider
                          value={[pitch]}
                          onValueChange={(value) => setPitch(value[0])}
                          min={0.5}
                          max={2.0}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0.5</span>
                          <span>{pitch.toFixed(1)}</span>
                          <span>2.0</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Volumen</label>
                        <Slider
                          value={[volume]}
                          onValueChange={(value) => setVolume(value[0])}
                          min={0}
                          max={1}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0%</span>
                          <span>{Math.round(volume * 100)}%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sidebar Toggle */}
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Índice</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-full mt-6">
                    <div className="space-y-2">
                      {chapters.map((chapter, index) => (
                        <Button
                          key={chapter.id}
                          variant={index === currentChapterIndex ? "default" : "ghost"}
                          className="w-full justify-start text-left h-auto p-3"
                          onClick={() => handleChapterSelect(index)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                {chapter.chapter_number}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{chapter.title}</p>
                              {bookmarks.includes(chapter.id) && (
                                <BookmarkCheck className="w-3 h-3 text-blue-600 mt-1" />
                              )}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 sm:px-6 lg:px-8 pb-2">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">
              {progressPercentage}% • Capítulo {currentChapter.chapter_number} de {chapters.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Chapter Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Badge variant="outline">Capítulo {currentChapter.chapter_number}</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleBookmark}
                  className={isBookmarked ? "text-blue-600" : "text-gray-400"}
                >
                  {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handlePreviousChapter} disabled={currentChapterIndex === 0}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextChapter}
                  disabled={currentChapterIndex === chapters.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{currentChapter.title}</h1>
          </div>

          {/* Chapter Content */}
          <div className="p-6">
            <div
              ref={contentRef}
              className="prose prose-gray max-w-none"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
              }}
            >
              {currentChapter.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Chapter Navigation */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousChapter}
                disabled={currentChapterIndex === 0}
                className="flex items-center space-x-2 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Capítulo {currentChapter.chapter_number} de {chapters.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(((currentChapterIndex + 1) / chapters.length) * 100)}% completado
                </p>
              </div>

              <Button
                variant="outline"
                onClick={handleNextChapter}
                disabled={currentChapterIndex === chapters.length - 1}
                className="flex items-center space-x-2 bg-transparent"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Reading Stats */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Estadísticas de Lectura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{formatTime(readingTime)}</div>
                <div className="text-sm text-gray-600">Tiempo de Lectura</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{currentChapter.chapter_number}</div>
                <div className="text-sm text-gray-600">Capítulo Actual</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{progressPercentage}%</div>
                <div className="text-sm text-gray-600">Progreso</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <BookmarkCheck className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{bookmarks.length}</div>
                <div className="text-sm text-gray-600">Marcadores</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
