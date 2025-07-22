"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  StickyNote,
  Settings,
  ArrowLeft,
  Clock,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import {
  getBookById,
  getReadingProgress,
  updateReadingProgress,
  getBookContent,
  getBookNotes,
  saveBookNote,
  deleteBookNote,
  type Book,
  type ReadingProgress,
  type BookNote,
} from "@/lib/supabase-library"
import Image from "next/image"

export default function BookReaderPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string
  const userId = "00000000-0000-0000-0000-000000000000" // Demo user ID

  const [book, setBook] = useState<Book | null>(null)
  const [progress, setProgress] = useState<ReadingProgress | null>(null)
  const [content, setContent] = useState<string>("")
  const [notes, setNotes] = useState<BookNote[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [loading, setLoading] = useState(true)
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    loadBookData()
  }, [bookId])

  useEffect(() => {
    if (book && currentPage) {
      loadPageContent()
      updateProgress()
    }
  }, [currentPage, book])

  const loadBookData = async () => {
    try {
      setLoading(true)

      // Load book details
      const { data: bookData, error: bookError } = await getBookById(bookId)
      if (bookError || !bookData) {
        toast({
          title: "Error",
          description: "No se pudo cargar el libro",
          variant: "destructive",
        })
        router.push("/library")
        return
      }
      setBook(bookData)

      // Load reading progress
      const { data: progressData } = await getReadingProgress(userId, bookId)
      if (progressData) {
        setProgress(progressData)
        setCurrentPage(progressData.current_page)
      }

      // Load notes
      const { data: notesData } = await getBookNotes(userId, bookId)
      if (notesData) {
        setNotes(notesData)
      }
    } catch (error) {
      console.error("Error loading book data:", error)
      toast({
        title: "Error",
        description: "Error al cargar los datos del libro",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadPageContent = async () => {
    if (!book) return

    try {
      const { data: contentData } = await getBookContent(bookId, currentPage)
      if (contentData) {
        setContent(contentData)
      }

      // Check if current page is bookmarked
      const pageBookmark = notes.find((note) => note.page_number === currentPage)
      setIsBookmarked(!!pageBookmark)
    } catch (error) {
      console.error("Error loading page content:", error)
    }
  }

  const updateProgress = async () => {
    if (!book || !progress) return

    const newProgress = Math.round((currentPage / book.pages) * 100)

    try {
      await updateReadingProgress(userId, bookId, {
        current_page: currentPage,
        progress: newProgress,
        last_read_at: new Date().toISOString(),
        reading_time_minutes: (progress.reading_time_minutes || 0) + 1,
      })

      setProgress((prev) =>
        prev
          ? {
              ...prev,
              current_page: currentPage,
              progress: newProgress,
              last_read_at: new Date().toISOString(),
            }
          : null,
      )
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  const goToNextPage = () => {
    if (book && currentPage < book.pages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const toggleBookmark = async () => {
    try {
      if (isBookmarked) {
        // Remove bookmark
        const bookmark = notes.find((note) => note.page_number === currentPage)
        if (bookmark) {
          await deleteBookNote(bookmark.id)
          setNotes((prev) => prev.filter((note) => note.id !== bookmark.id))
          setIsBookmarked(false)
          toast({
            title: "Marcador eliminado",
            description: `Marcador removido de la página ${currentPage}`,
          })
        }
      } else {
        // Add bookmark
        const { data: noteData } = await saveBookNote(userId, bookId, currentPage, `Marcador en página ${currentPage}`)
        if (noteData) {
          setNotes((prev) => [...prev, noteData])
          setIsBookmarked(true)
          toast({
            title: "Marcador agregado",
            description: `Página ${currentPage} marcada`,
          })
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el marcador",
        variant: "destructive",
      })
    }
  }

  const saveNote = async () => {
    if (!newNote.trim()) return

    try {
      const { data: noteData } = await saveBookNote(userId, bookId, currentPage, newNote, `Página ${currentPage}`)

      if (noteData) {
        setNotes((prev) => [...prev, noteData])
        setNewNote("")
        toast({
          title: "Nota guardada",
          description: `Nota agregada a la página ${currentPage}`,
        })
      }
    } catch (error) {
      console.error("Error saving note:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la nota",
        variant: "destructive",
      })
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      await deleteBookNote(noteId)
      setNotes((prev) => prev.filter((note) => note.id !== noteId))
      toast({
        title: "Nota eliminada",
        description: "La nota ha sido eliminada",
      })
    } catch (error) {
      console.error("Error deleting note:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la nota",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando libro...</p>
        </div>
      </div>
    )
  }

  if (!book || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Libro no encontrado</h3>
          <p className="text-gray-600 mb-4">No se pudo cargar el libro solicitado.</p>
          <Button onClick={() => router.push("/library")}>Volver a la biblioteca</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <Button variant="ghost" size="sm" onClick={() => router.push("/library")} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a biblioteca
            </Button>

            <div className="flex items-start space-x-4">
              <div className="relative w-16 h-20 flex-shrink-0">
                <Image
                  src={book.cover_url || "/placeholder.svg"}
                  alt={book.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">{book.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                <div className="flex items-center mt-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{book.rating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progreso de lectura</span>
                  <span>{progress.progress}%</span>
                </div>
                <Progress value={progress.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Página actual</p>
                  <p className="font-medium">
                    {currentPage} de {book.pages}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Tiempo estimado</p>
                  <p className="font-medium">{book.reading_time}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  Tiempo leído: {Math.floor((progress.reading_time_minutes || 0) / 60)}h{" "}
                  {(progress.reading_time_minutes || 0) % 60}m
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Mis Notas y Marcadores</h3>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {notes.map((note) => (
                  <Card key={note.id} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Bookmark className="h-3 w-3 text-blue-600" />
                          <span className="text-xs text-gray-500">Página {note.page_number}</span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-3">{note.content}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNote(note.id)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                      >
                        ×
                      </Button>
                    </div>
                  </Card>
                ))}
                {notes.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay notas aún. Agrega marcadores y notas mientras lees.
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => setShowSidebar(!showSidebar)}>
                <Settings className="h-4 w-4" />
              </Button>
              <div className="text-sm text-gray-600">
                Página {currentPage} de {book.pages}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleBookmark}
                className={isBookmarked ? "text-blue-600" : "text-gray-400"}
              >
                {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <StickyNote className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Nota - Página {currentPage}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Escribe tu nota aquí..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={4}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setNewNote("")}>
                        Cancelar
                      </Button>
                      <Button onClick={saveNote} disabled={!newNote.trim()}>
                        Guardar Nota
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Reading Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full">
            <Card className="min-h-[600px]">
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={goToPreviousPage} disabled={currentPage <= 1}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="flex items-center space-x-4">
              <Progress value={progress.progress} className="w-32 h-2" />
              <span className="text-sm text-gray-600">{progress.progress}%</span>
            </div>

            <Button variant="outline" onClick={goToNextPage} disabled={currentPage >= book.pages}>
              Siguiente
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
