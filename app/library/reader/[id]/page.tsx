"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  ArrowLeft,
  Settings,
  Star,
  Clock,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react"
import Link from "next/link"
import { getBookById, getBookContent, updateReadingProgress, getUserBookmarks } from "@/lib/supabase-library"
import type { Book, BookContent } from "@/lib/supabase-library"

export default function BookReaderPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string

  const [book, setBook] = useState<Book | null>(null)
  const [content, setContent] = useState<BookContent[]>([])
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [readingProgress, setReadingProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [fontSize, setFontSize] = useState(16)
  const [showSettings, setShowSettings] = useState(false)

  const userId = "demo-user-id" // In a real app, this would come from auth context

  useEffect(() => {
    const loadBookData = async () => {
      if (!bookId) return

      try {
        const [bookData, contentData, bookmarksData] = await Promise.all([
          getBookById(bookId),
          getBookContent(bookId),
          getUserBookmarks(userId, bookId),
        ])

        setBook(bookData)
        setContent(contentData)
        setBookmarks(bookmarksData)

        // Calculate reading progress
        if (contentData.length > 0) {
          const progress = Math.round((currentPage / contentData.length) * 100)
          setReadingProgress(progress)
        }
      } catch (error) {
        console.error("Error loading book data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBookData()
  }, [bookId, userId, currentPage])

  useEffect(() => {
    // Update reading progress when page changes
    if (content.length > 0) {
      const progress = Math.round(((currentPage + 1) / content.length) * 100)
      setReadingProgress(progress)

      // Save progress to database
      updateReadingProgress(userId, bookId, progress, currentPage + 1)
    }
  }, [currentPage, content.length, userId, bookId])

  const handleNextPage = () => {
    if (currentPage < content.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleBookmark = async () => {
    // In a real app, this would save to database
    console.log("Bookmark added for page:", currentPage + 1)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!book || content.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Libro no encontrado</h2>
          <p className="text-gray-600 mb-6">El libro que buscas no está disponible o ha sido movido.</p>
          <Link href="/library">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la Biblioteca
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentContent = content[currentPage]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/library">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Biblioteca
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="font-semibold text-lg">{book.title}</h1>
                <p className="text-sm text-gray-600">por {book.author}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleBookmark}>
                {/* Bookmark Icon */}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progreso de lectura</span>
              <span>{readingProgress}% completado</span>
            </div>
            <Progress value={readingProgress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="min-h-[600px]">
                <CardContent className="p-8">
                  {/* Settings Panel */}
                  {showSettings && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium mb-3">Configuración de lectura</h3>
                      <div className="flex items-center gap-4">
                        <label className="text-sm">Tamaño de fuente:</label>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => setFontSize(Math.max(12, fontSize - 2))}>
                            A-
                          </Button>
                          <span className="text-sm w-8 text-center">{fontSize}px</span>
                          <Button variant="outline" size="sm" onClick={() => setFontSize(Math.min(24, fontSize + 2))}>
                            A+
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Chapter Title */}
                  <div className="mb-6">
                    <Badge variant="outline" className="mb-2">
                      Capítulo {currentContent.chapter_number}
                    </Badge>
                    <h2 className="text-2xl font-bold text-gray-900">{currentContent.title}</h2>
                  </div>

                  {/* Content */}
                  <div
                    className="prose prose-gray max-w-none leading-relaxed"
                    style={{ fontSize: `${fontSize}px` }}
                    dangerouslySetInnerHTML={{ __html: currentContent.content }}
                  />

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-12 pt-6 border-t">
                    <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 0}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Anterior
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>
                        Página {currentPage + 1} de {content.length}
                      </span>
                    </div>

                    <Button onClick={handleNextPage} disabled={currentPage === content.length - 1}>
                      Siguiente
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Book Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{book.title}</CardTitle>
                    <CardDescription>por {book.author}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{book.rating} estrellas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{book.reading_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{book.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">{book.publication_year}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Table of Contents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contenido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {content.map((chapter, index) => (
                      <button
                        key={chapter.id}
                        onClick={() => setCurrentPage(index)}
                        className={`w-full text-left p-2 rounded text-sm transition-colors ${
                          index === currentPage ? "bg-blue-100 text-blue-900 font-medium" : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="font-medium">{chapter.title}</div>
                        <div className="text-xs text-gray-500">Capítulo {chapter.chapter_number}</div>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                {/* Bookmarks */}
                {bookmarks.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Marcadores</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {bookmarks.map((bookmark) => (
                        <button
                          key={bookmark.id}
                          onClick={() => setCurrentPage(bookmark.page_number - 1)}
                          className="w-full text-left p-2 rounded text-sm hover:bg-gray-100 transition-colors"
                        >
                          <div className="font-medium">Página {bookmark.page_number}</div>
                          {bookmark.note && <div className="text-xs text-gray-500 mt-1">{bookmark.note}</div>}
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Acciones</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/library">
                      <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                        <Home className="h-4 w-4 mr-2" />
                        Volver a Biblioteca
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-transparent"
                      onClick={handleBookmark}
                    >
                      {/* Bookmark Icon */}
                      Agregar Marcador
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
