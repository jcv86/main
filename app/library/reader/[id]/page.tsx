"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, BookOpen, Clock, Star, Home, List, Award } from "lucide-react"
import Link from "next/link"
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
  const [content, setContent] = useState<BookContent[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [progress, setProgress] = useState<ReadingProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [showChapterList, setShowChapterList] = useState(false)

  useEffect(() => {
    if (bookId) {
      loadBookData()
    }
  }, [bookId])

  useEffect(() => {
    if (book && content.length > 0) {
      updateProgress()
    }
  }, [currentPage, book, content])

  const loadBookData = async () => {
    try {
      setLoading(true)
      const [bookData, contentData, progressData] = await Promise.all([
        getBook(bookId),
        getBookContent(bookId),
        getReadingProgress("demo-user", bookId),
      ])

      if (!bookData) {
        router.push("/library")
        return
      }

      setBook(bookData)
      setContent(contentData.sort((a, b) => a.chapter_number - b.chapter_number))
      setProgress(progressData)

      // Set current page from progress or start at page 1
      if (progressData && progressData.current_page > 0) {
        setCurrentPage(progressData.current_page)
      }
    } catch (error) {
      console.error("Error loading book data:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async () => {
    if (!book || content.length === 0) return

    const progressPercentage = Math.round((currentPage / book.total_pages) * 100)

    try {
      const updatedProgress = await updateReadingProgress("demo-user", bookId, currentPage, progressPercentage)
      setProgress(updatedProgress)

      // Check if book is completed
      if (progressPercentage >= 100) {
        await completeBook("demo-user", bookId)
      }
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= book!.total_pages) {
      setCurrentPage(page)
    }
  }

  const goToChapter = (chapterNumber: number) => {
    const chapter = content.find((c) => c.chapter_number === chapterNumber)
    if (chapter) {
      setCurrentPage(chapter.page_number)
      setShowChapterList(false)
    }
  }

  const getCurrentChapter = () => {
    return content.find((c) => c.page_number === currentPage)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "fácil":
        return "bg-green-100 text-green-800"
      case "intermedio":
        return "bg-yellow-100 text-yellow-800"
      case "avanzado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Productividad: "bg-blue-100 text-blue-800",
      Liderazgo: "bg-purple-100 text-purple-800",
      "Habilidades Blandas": "bg-green-100 text-green-800",
      "Desarrollo Personal": "bg-orange-100 text-orange-800",
      Negocios: "bg-red-100 text-red-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando libro...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!book || content.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Libro no encontrado</h3>
          <p className="text-gray-600 mb-4">El libro que buscas no está disponible.</p>
          <Link href="/library">
            <Button>Volver a la Biblioteca</Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentChapter = getCurrentChapter()
  const progressPercentage = Math.round((currentPage / book.total_pages) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/library">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Biblioteca
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="font-semibold text-lg">{book.title}</h1>
                <p className="text-sm text-gray-600">por {book.author}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => setShowChapterList(!showChapterList)}>
                <List className="h-4 w-4 mr-2" />
                Capítulos
              </Button>

              <div className="text-sm text-gray-600">
                Página {currentPage} de {book.total_pages}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progreso de lectura</span>
              <span className="text-sm font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chapter List Sidebar */}
          {showChapterList && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Capítulos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {content.map((chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => goToChapter(chapter.chapter_number)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          currentPage === chapter.page_number
                            ? "bg-blue-50 border-blue-200 text-blue-900"
                            : "hover:bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="font-medium text-sm">Capítulo {chapter.chapter_number}</div>
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2">{chapter.title}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className={showChapterList ? "lg:col-span-3" : "lg:col-span-4"}>
            {/* Book Info Card */}
            {currentPage === 1 && (
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={getCategoryColor(book.category)}>{book.category}</Badge>
                    <Badge variant="outline" className={getDifficultyColor(book.difficulty)}>
                      {book.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {book.reading_time}
                    </Badge>
                    <Badge variant="outline">
                      <Star className="h-3 w-3 mr-1" />
                      {book.rating}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{book.title}</CardTitle>
                  <CardDescription className="text-lg">por {book.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>

                  {progressPercentage >= 100 && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-medium text-green-900">¡Felicitaciones!</span>
                      </div>
                      <p className="text-green-700 mt-1">Has completado este libro. +100 puntos ganados.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Chapter Content */}
            {currentChapter && (
              <Card>
                <CardContent className="p-8">
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentChapter.content }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <Button variant="outline" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Página {currentPage} de {book.total_pages}
                </span>
              </div>

              <Button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= book.total_pages}>
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
