"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, ChevronLeft, ChevronRight, ArrowLeft, Clock, Star, CheckCircle, Trophy, Target } from "lucide-react"
import { toast } from "sonner"
import {
  getBook,
  getBookContent,
  getReadingProgress,
  updateReadingProgress,
  completeBook,
  type Book,
  type BookContent,
  type ReadingProgress,
} from "@/lib/supabase-library"

export default function BookReaderPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string

  const [book, setBook] = useState<Book | null>(null)
  const [chapters, setChapters] = useState<BookContent[]>([])
  const [currentChapter, setCurrentChapter] = useState(0)
  const [progress, setProgress] = useState<ReadingProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    if (bookId) {
      loadBookData()
    }
  }, [bookId])

  const loadBookData = async () => {
    try {
      setLoading(true)
      const [bookData, chaptersData, progressData] = await Promise.all([
        getBook(bookId),
        getBookContent(bookId),
        getReadingProgress("demo-user", bookId),
      ])

      if (!bookData) {
        toast.error("Libro no encontrado")
        router.push("/library")
        return
      }

      setBook(bookData)
      setChapters(chaptersData)
      setProgress(progressData)

      // Set current chapter based on progress
      if (progressData && progressData.current_page > 1) {
        const chapterIndex = Math.min(progressData.current_page - 1, chaptersData.length - 1)
        setCurrentChapter(chapterIndex)
      }
    } catch (error) {
      console.error("Error loading book data:", error)
      toast.error("Error al cargar el libro")
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (chapterIndex: number) => {
    if (!book) return

    const currentPage = chapterIndex + 1
    const progressPercentage = Math.round((currentPage / chapters.length) * 100)

    try {
      const updatedProgress = await updateReadingProgress("demo-user", bookId, currentPage, progressPercentage)
      setProgress(updatedProgress)
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  const goToNextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      const nextChapter = currentChapter + 1
      setCurrentChapter(nextChapter)
      updateProgress(nextChapter)
    }
  }

  const goToPreviousChapter = () => {
    if (currentChapter > 0) {
      const prevChapter = currentChapter - 1
      setCurrentChapter(prevChapter)
      updateProgress(prevChapter)
    }
  }

  const handleCompleteBook = async () => {
    if (!book) return

    try {
      setCompleting(true)
      const success = await completeBook("demo-user", bookId)

      if (success) {
        toast.success("¡Felicitaciones! Has completado el libro", {
          description: "Has ganado 100 puntos por completar este libro",
          duration: 5000,
        })

        // Update progress to 100%
        const completedProgress = await updateReadingProgress("demo-user", bookId, book.total_pages, 100)
        setProgress(completedProgress)
      } else {
        toast.error("Error al completar el libro")
      }
    } catch (error) {
      console.error("Error completing book:", error)
      toast.error("Error al completar el libro")
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <BookOpen className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-lg text-gray-600">Cargando libro...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!book || chapters.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Libro no disponible</h3>
          <p className="text-gray-600 mb-4">No se pudo cargar el contenido del libro</p>
          <Button onClick={() => router.push("/library")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la Biblioteca
          </Button>
        </div>
      </div>
    )
  }

  const currentChapterData = chapters[currentChapter]
  const progressPercentage = progress?.progress_percentage || 0
  const isCompleted = progressPercentage === 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/library")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Biblioteca
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">{book.title}</h1>
                <p className="text-sm text-gray-600">por {book.author}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Capítulo {currentChapter + 1} de {chapters.length}
                </p>
                <p className="text-xs text-gray-600">{progressPercentage}% completado</p>
              </div>
              <div className="w-32">
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Book Info Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{book.title}</CardTitle>
                  <p className="text-lg text-gray-600 mb-4">por {book.author}</p>

                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{book.rating}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {book.reading_time}
                    </div>
                    <Badge variant="secondary">{book.category}</Badge>
                    {book.is_free && <Badge className="bg-green-100 text-green-800">GRATIS</Badge>}
                  </div>

                  <p className="text-gray-700">{book.description}</p>
                </div>

                {isCompleted && (
                  <div className="ml-6 text-center">
                    <div className="bg-green-100 rounded-full p-4 mb-2">
                      <Trophy className="h-8 w-8 text-green-600 mx-auto" />
                    </div>
                    <Badge className="bg-green-100 text-green-800">¡COMPLETADO!</Badge>
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Chapter Content */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{currentChapterData.title}</span>
                <Badge variant="outline">Capítulo {currentChapterData.chapter_number}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: currentChapterData.content }}
              />
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="outline" onClick={goToPreviousChapter} disabled={currentChapter === 0}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Capítulo Anterior
            </Button>

            <div className="flex items-center space-x-4">
              {currentChapter === chapters.length - 1 && !isCompleted && (
                <Button onClick={handleCompleteBook} disabled={completing} className="bg-green-600 hover:bg-green-700">
                  {completing ? (
                    <>
                      <Target className="h-4 w-4 mr-2 animate-spin" />
                      Completando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completar Libro
                    </>
                  )}
                </Button>
              )}
            </div>

            <Button variant="outline" onClick={goToNextChapter} disabled={currentChapter === chapters.length - 1}>
              Siguiente Capítulo
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Chapter Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Índice de Capítulos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {chapters.map((chapter, index) => (
                  <Button
                    key={chapter.id}
                    variant={index === currentChapter ? "default" : "ghost"}
                    className="justify-start h-auto p-3"
                    onClick={() => {
                      setCurrentChapter(index)
                      updateProgress(index)
                    }}
                  >
                    <div className="text-left">
                      <div className="font-medium">Capítulo {chapter.chapter_number}</div>
                      <div className="text-sm text-gray-600 truncate">{chapter.title}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
