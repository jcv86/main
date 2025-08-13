"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
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
  Clock,
  Menu,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Headphones,
} from "lucide-react"
import Link from "next/link"
import { LibraryService, type Book, type BookChapter, type UserBookProgress } from "@/lib/supabase-library"
import { useToast } from "@/hooks/use-toast"
import { TTSControls } from "@/components/tts-controls"

export default function BookReaderPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const bookId = params.id as string

  const [book, setBook] = useState<Book | null>(null)
  const [chapters, setChapters] = useState<BookChapter[]>([])
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [progress, setProgress] = useState<UserBookProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [readingTime, setReadingTime] = useState(0)
  const [isReading, setIsReading] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [showTTS, setShowTTS] = useState(false)

  // Load book data
  useEffect(() => {
    const loadBookData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load book details
        const bookData = await LibraryService.getBookById(bookId)
        if (!bookData) {
          setError("Libro no encontrado")
          return
        }
        setBook(bookData)

        // Load chapters
        const chaptersData = await LibraryService.getBookChapters(bookId)
        setChapters(chaptersData)

        // Load user progress
        const progressData = await LibraryService.getUserBookProgress(bookId)
        if (progressData) {
          setProgress(progressData)
          setCurrentChapterIndex(Math.max(0, (progressData.current_chapter || 1) - 1))
          setReadingTime(progressData.reading_time_minutes || 0)
        }

        // Check if current chapter is bookmarked
        const bookmarks = await LibraryService.getUserBookmarks(bookId)
        const currentChapter = chaptersData[currentChapterIndex]
        if (currentChapter) {
          setIsBookmarked(bookmarks.some((b) => b.chapter_id === currentChapter.id))
        }
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
  }, [bookId, currentChapterIndex])

  // Reading timer
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isReading && startTime) {
      interval = setInterval(() => {
        const now = new Date()
        const sessionTime = Math.floor((now.getTime() - startTime.getTime()) / 1000 / 60) // minutes
        setReadingTime((prev) => prev + (sessionTime > 0 ? 1 : 0))
      }, 60000) // Update every minute
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isReading, startTime])

  // Auto-save progress
  useEffect(() => {
    const saveProgress = async () => {
      if (!book || chapters.length === 0) return

      const progressPercentage = Math.round(((currentChapterIndex + 1) / chapters.length) * 100)

      try {
        await LibraryService.updateBookProgress(bookId, {
          current_chapter: currentChapterIndex + 1,
          progress_percentage: progressPercentage,
          reading_time_minutes: readingTime,
          last_read_at: new Date().toISOString(),
          completed_at: progressPercentage >= 100 ? new Date().toISOString() : undefined,
        })

        setProgress((prev) => ({
          ...prev,
          id: prev?.id || "",
          user_id: prev?.user_id || "",
          book_id: bookId,
          current_chapter: currentChapterIndex + 1,
          progress_percentage: progressPercentage,
          reading_time_minutes: readingTime,
          last_read_at: new Date().toISOString(),
          completed_at: progressPercentage >= 100 ? new Date().toISOString() : undefined,
        }))
      } catch (error) {
        console.error("Error saving progress:", error)
      }
    }

    const debounceTimer = setTimeout(saveProgress, 2000)
    return () => clearTimeout(debounceTimer)
  }, [bookId, currentChapterIndex, readingTime, book, chapters.length])

  const toggleReading = () => {
    if (isReading) {
      setIsReading(false)
      setStartTime(null)
    } else {
      setIsReading(true)
      setStartTime(new Date())
    }
  }

  const resetReadingTime = () => {
    setReadingTime(0)
    toast({
      title: "Tiempo reiniciado",
      description: "El tiempo de lectura se ha reiniciado a 0 minutos.",
    })
  }

  const toggleBookmark = async () => {
    const currentChapter = chapters[currentChapterIndex]
    if (!currentChapter) return

    try {
      if (isBookmarked) {
        await LibraryService.removeBookmark(bookId, currentChapter.id)
        setIsBookmarked(false)
        toast({
          title: "Marcador eliminado",
          description: "Se eliminó el marcador de este capítulo.",
        })
      } else {
        await LibraryService.addBookmark(bookId, currentChapter.id, currentChapter.title, "Marcador del capítulo")
        setIsBookmarked(true)
        toast({
          title: "Marcador añadido",
          description: "Se añadió un marcador a este capítulo.",
        })
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

  const goToChapter = (index: number) => {
    if (index >= 0 && index < chapters.length) {
      setCurrentChapterIndex(index)
    }
  }

  const formatReadingTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Cargando libro...</p>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar el libro</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button asChild variant="outline">
              <Link href="/library">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a la biblioteca
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (chapters.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Contenido no disponible</h3>
            <p className="text-gray-600 mb-4">Este libro aún no tiene capítulos disponibles.</p>
            <Button asChild variant="outline">
              <Link href="/library">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a la biblioteca
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentChapter = chapters[currentChapterIndex]
  const progressPercentage = Math.round(((currentChapterIndex + 1) / chapters.length) * 100)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/library">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Biblioteca
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900 truncate max-w-xs">{book.title}</h1>
                <p className="text-sm text-gray-500">por {book.author}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Reading Timer */}
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatReadingTime(readingTime)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleReading}
                  className={isReading ? "text-green-600" : "text-gray-600"}
                >
                  {isReading ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={resetReadingTime}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Progress */}
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {currentChapterIndex + 1} de {chapters.length}
                </span>
                <div className="w-24">
                  <Progress value={progressPercentage} className="h-2" />
                </div>
                <span className="text-sm font-medium text-gray-900">{progressPercentage}%</span>
              </div>

              {/* TTS Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTTS(!showTTS)}
                className={showTTS ? "text-blue-600" : "text-gray-600"}
              >
                <Headphones className="w-4 h-4" />
              </Button>

              {/* Bookmark */}
              <Button variant="ghost" size="sm" onClick={toggleBookmark}>
                {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-blue-600" /> : <Bookmark className="w-4 h-4" />}
              </Button>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="sm:hidden">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Capítulos</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ScrollArea className="h-[calc(100vh-120px)]">
                      <div className="space-y-2">
                        {chapters.map((chapter, index) => (
                          <Button
                            key={chapter.id}
                            variant={index === currentChapterIndex ? "default" : "ghost"}
                            className="w-full justify-start text-left h-auto p-3"
                            onClick={() => goToChapter(index)}
                          >
                            <div>
                              <div className="font-medium text-sm">{chapter.title}</div>
                              <div className="text-xs text-gray-500 mt-1">Capítulo {index + 1}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="sm:hidden px-4 pb-2">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>
              Capítulo {currentChapterIndex + 1} de {chapters.length}
            </span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-1" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-80 border-r border-gray-200 bg-gray-50">
          <div className="sticky top-20 h-[calc(100vh-80px)]">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Capítulos</h2>
                <div className="text-sm text-gray-600">
                  {chapters.length} capítulos • {formatReadingTime(book.estimated_reading_time)}
                </div>
              </div>

              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-2">
                  {chapters.map((chapter, index) => (
                    <Button
                      key={chapter.id}
                      variant={index === currentChapterIndex ? "default" : "ghost"}
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => goToChapter(index)}
                    >
                      <div>
                        <div className="font-medium text-sm line-clamp-2">{chapter.title}</div>
                        <div className="text-xs text-gray-500 mt-1">Capítulo {index + 1}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* TTS Controls */}
            {showTTS && (
              <div className="mb-8">
                <TTSControls text={currentChapter.content} title={`Audio: ${currentChapter.title}`} />
              </div>
            )}

            {/* Chapter Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="text-xs">
                  Capítulo {currentChapterIndex + 1} de {chapters.length}
                </Badge>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToChapter(currentChapterIndex - 1)}
                    disabled={currentChapterIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToChapter(currentChapterIndex + 1)}
                    disabled={currentChapterIndex === chapters.length - 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentChapter.title}</h1>
            </div>

            {/* Chapter Content */}
            <div className="prose prose-lg max-w-none">
              <div
                className="text-gray-800 leading-relaxed"
                style={{ lineHeight: "1.8", fontSize: "18px" }}
                dangerouslySetInnerHTML={{
                  __html: currentChapter.content.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>"),
                }}
              />
            </div>

            {/* Navigation Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  {currentChapterIndex > 0 && (
                    <Button variant="outline" onClick={() => goToChapter(currentChapterIndex - 1)}>
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Capítulo anterior
                    </Button>
                  )}
                </div>
                <div>
                  {currentChapterIndex < chapters.length - 1 && (
                    <Button onClick={() => goToChapter(currentChapterIndex + 1)}>
                      Siguiente capítulo
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>

              {currentChapterIndex === chapters.length - 1 && (
                <div className="mt-8 text-center">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">¡Felicitaciones!</h3>
                    <p className="text-green-700 mb-4">Has completado la lectura de "{book.title}"</p>
                    <div className="flex items-center justify-center space-x-4">
                      <Button asChild>
                        <Link href="/library">Volver a la biblioteca</Link>
                      </Button>
                      <Button variant="outline" onClick={() => goToChapter(0)}>
                        Releer desde el inicio
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
