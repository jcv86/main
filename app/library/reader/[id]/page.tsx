"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  Settings,
  Moon,
  Sun,
  Palette,
  StickyNote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  getBookById,
  getBookContent,
  getReadingProgress,
  updateReadingProgress,
  saveBookmark,
  getBookmarks,
  type BookNote,
} from "@/lib/supabase-library"

interface ReaderSettings {
  fontSize: number
  fontFamily: string
  theme: "light" | "dark" | "sepia"
  lineHeight: number
  margin: number
}

export default function BookReaderPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const bookId = params.id as string

  const [book, setBook] = useState<any>(null)
  const [content, setContent] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [progress, setProgress] = useState(0)
  const [bookmarks, setBookmarks] = useState<BookNote[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [loadingContent, setLoadingContent] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 16,
    fontFamily: "serif",
    theme: "light",
    lineHeight: 1.6,
    margin: 20,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.id && bookId) {
      loadBook()
      loadBookmarks()
      loadReadingProgress()
    }
  }, [user?.id, bookId])

  useEffect(() => {
    if (user?.id && bookId && currentPage) {
      loadContent()
    }
  }, [user?.id, bookId, currentPage])

  const loadBook = async () => {
    try {
      const { data: bookData, error: bookError } = await getBookById(bookId)
      if (bookError) {
        setError("Error cargando libro")
        return
      }
      setBook(bookData)
      setTotalPages(bookData?.pages || 320) // Default to 320 pages for Atomic Habits
    } catch (err) {
      console.error("Error loading book:", err)
      setError("Error cargando libro")
    }
  }

  const loadContent = async () => {
    setLoadingContent(true)
    try {
      const { data: contentData, error: contentError } = await getBookContent(bookId, currentPage)
      if (contentError) {
        setError("Error cargando contenido")
        return
      }
      setContent(contentData || "")
    } catch (err) {
      console.error("Error loading content:", err)
      setError("Error cargando contenido")
    } finally {
      setLoadingContent(false)
    }
  }

  const loadReadingProgress = async () => {
    if (!user?.id) return
    try {
      const { data: progressData } = await getReadingProgress(user.id, bookId)
      if (progressData) {
        setCurrentPage(progressData.current_page || 1)
        setProgress(progressData.progress || 0)
      }
    } catch (err) {
      console.error("Error loading progress:", err)
    }
  }

  const loadBookmarks = async () => {
    if (!user?.id) return
    try {
      const { data: bookmarksData } = await getBookmarks(user.id, bookId)
      setBookmarks(bookmarksData || [])
    } catch (err) {
      console.error("Error loading bookmarks:", err)
    }
  }

  const updateProgress = async (newPage: number) => {
    if (!user?.id || !book) return
    const newProgress = Math.round((newPage / totalPages) * 100)
    try {
      await updateReadingProgress(user.id, bookId, {
        current_page: newPage,
        progress: newProgress,
        reading_status: newProgress >= 100 ? "completed" : "reading",
      })
      setProgress(newProgress)
    } catch (err) {
      console.error("Error updating progress:", err)
    }
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    updateProgress(page)
  }

  const addBookmark = async () => {
    if (!user?.id) return
    try {
      await saveBookmark(user.id, bookId, currentPage, noteText || `Marcador en página ${currentPage}`)
      setNoteText("")
      loadBookmarks()
    } catch (err) {
      console.error("Error saving bookmark:", err)
    }
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

  const getFontFamily = () => {
    switch (settings.fontFamily) {
      case "sans":
        return "font-sans"
      case "mono":
        return "font-mono"
      default:
        return "font-serif"
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando lector...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error cargando libro</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push("/library")}>Volver a la Biblioteca</Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getThemeClasses()}`}>
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/library")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Biblioteca
              </Button>
              {book && (
                <div>
                  <h1 className="font-semibold text-lg">{book.title}</h1>
                  <p className="text-sm text-muted-foreground">por {book.author}</p>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                Página {currentPage} de {totalPages}
              </Badge>
              <Progress value={progress} className="w-32" />
              <span className="text-sm text-muted-foreground">{progress}%</span>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Panel */}
          {showSettings && (
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Configuración
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tamaño de fuente</label>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={([value]) => setSettings({ ...settings, fontSize: value })}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground">{settings.fontSize}px</span>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Familia de fuente</label>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="serif">Serif</option>
                    <option value="sans">Sans Serif</option>
                    <option value="mono">Monospace</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tema</label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={settings.theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, theme: "light" })}
                    >
                      <Sun className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={settings.theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, theme: "dark" })}
                    >
                      <Moon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={settings.theme === "sepia" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({ ...settings, theme: "sepia" })}
                    >
                      <Palette className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Interlineado</label>
                  <Slider
                    value={[settings.lineHeight]}
                    onValueChange={([value]) => setSettings({ ...settings, lineHeight: value })}
                    min={1.2}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground">{settings.lineHeight}</span>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Marcadores</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {bookmarks.map((bookmark) => (
                      <div
                        key={bookmark.id}
                        className="p-2 border rounded cursor-pointer hover:bg-muted"
                        onClick={() => goToPage(bookmark.page_number)}
                      >
                        <div className="text-sm font-medium">Página {bookmark.page_number}</div>
                        {bookmark.content && (
                          <div className="text-xs text-muted-foreground truncate">{bookmark.content}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Content */}
          <div className={`${showSettings ? "lg:col-span-3" : "lg:col-span-4"}`}>
            <Card className="min-h-[600px]">
              <CardContent className="p-0">
                {/* Reading Area */}
                <div
                  className={`p-8 ${getFontFamily()}`}
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    lineHeight: settings.lineHeight,
                    margin: `${settings.margin}px`,
                  }}
                >
                  {loadingContent ? (
                    <div className="flex items-center justify-center h-96">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
                  )}
                </div>

                {/* Navigation Controls */}
                <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t p-4">
                  <div className="flex items-center justify-between">
                    <Button variant="outline" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Anterior
                    </Button>

                    <div className="flex items-center space-x-4">
                      <Button variant="outline" size="sm" onClick={() => setShowNotes(!showNotes)}>
                        <StickyNote className="h-4 w-4 mr-2" />
                        Nota
                      </Button>
                      <Button variant="outline" size="sm" onClick={addBookmark}>
                        <Bookmark className="h-4 w-4 mr-2" />
                        Marcar
                      </Button>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Ir a página:</span>
                        <input
                          type="number"
                          min="1"
                          max={totalPages}
                          value={currentPage}
                          onChange={(e) => goToPage(Number.parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-1 border rounded text-center"
                        />
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>

                  {/* Notes Section */}
                  {showNotes && (
                    <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                      <Textarea
                        placeholder="Escribe una nota para esta página..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="mb-2"
                      />
                      <Button size="sm" onClick={addBookmark} disabled={!noteText.trim()}>
                        Guardar Nota
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
