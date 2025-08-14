"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Search,
  Bookmark,
  Highlighter,
  FileText,
  Quote,
  Edit3,
  Trash2,
  Save,
  X,
  ChevronRight,
  Filter,
  Tag,
  Eye,
  EyeOff,
  Heart,
} from "lucide-react"
import {
  LibraryService,
  type BookSearchResult,
  type UserBookBookmark,
  type UserBookHighlight,
  type UserBookNote,
  type UserBookQuote,
} from "@/lib/supabase-library"
import { useToast } from "@/hooks/use-toast"

interface ReadingSidebarProps {
  bookId: string
  chapterId: string
  onNavigateToResult?: (chapterId: string, position: number) => void
  onNavigateToBookmark?: (chapterId: string) => void
}

const HIGHLIGHT_COLORS = [
  { name: "Amarillo", value: "yellow", bg: "bg-yellow-200", text: "text-yellow-800" },
  { name: "Verde", value: "green", bg: "bg-green-200", text: "text-green-800" },
  { name: "Azul", value: "blue", bg: "bg-blue-200", text: "text-blue-800" },
  { name: "Rosa", value: "pink", bg: "bg-pink-200", text: "text-pink-800" },
  { name: "Naranja", value: "orange", bg: "bg-orange-200", text: "text-orange-800" },
]

export function ReadingSidebar({ bookId, chapterId, onNavigateToResult, onNavigateToBookmark }: ReadingSidebarProps) {
  const { toast } = useToast()

  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  // Data state
  const [bookmarks, setBookmarks] = useState<UserBookBookmark[]>([])
  const [highlights, setHighlights] = useState<UserBookHighlight[]>([])
  const [notes, setNotes] = useState<UserBookNote[]>([])
  const [quotes, setQuotes] = useState<UserBookQuote[]>([])

  // Filter state
  const [highlightColorFilter, setHighlightColorFilter] = useState<string>("all")
  const [notePrivacyFilter, setNotePrivacyFilter] = useState<string>("all")
  const [quoteFavoriteFilter, setQuoteFavoriteFilter] = useState<string>("all")

  // Edit state
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [editingNoteContent, setEditingNoteContent] = useState("")
  const [editingHighlight, setEditingHighlight] = useState<string | null>(null)
  const [editingHighlightNote, setEditingHighlightNote] = useState("")

  // Load data
  useEffect(() => {
    loadBookmarks()
    loadHighlights()
    loadNotes()
    loadQuotes()
  }, [bookId])

  const loadBookmarks = async () => {
    try {
      const data = await LibraryService.getUserBookmarks(bookId)
      setBookmarks(data)
    } catch (error) {
      console.error("Error loading bookmarks:", error)
    }
  }

  const loadHighlights = async () => {
    try {
      const data = await LibraryService.getAllUserHighlights(bookId)
      setHighlights(data)
    } catch (error) {
      console.error("Error loading highlights:", error)
    }
  }

  const loadNotes = async () => {
    try {
      const chapterNotes = await LibraryService.getChapterNotes(bookId, chapterId)
      setNotes(chapterNotes)
    } catch (error) {
      console.error("Error loading notes:", error)
    }
  }

  const loadQuotes = async () => {
    try {
      const data = await LibraryService.getUserQuotes(bookId)
      setQuotes(data)
    } catch (error) {
      console.error("Error loading quotes:", error)
    }
  }

  // Search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    try {
      setSearchLoading(true)
      const results = await LibraryService.searchInBook(bookId, searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error("Error searching:", error)
      toast({
        title: "Error",
        description: "No se pudo realizar la búsqueda.",
        variant: "destructive",
      })
    } finally {
      setSearchLoading(false)
    }
  }

  // Note management
  const handleUpdateNote = async (noteId: string) => {
    try {
      await LibraryService.updateNote(noteId, editingNoteContent)
      await loadNotes()
      setEditingNote(null)
      setEditingNoteContent("")
      toast({
        title: "Nota actualizada",
        description: "Los cambios han sido guardados.",
      })
    } catch (error) {
      console.error("Error updating note:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la nota.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      await LibraryService.removeNote(noteId)
      await loadNotes()
      toast({
        title: "Nota eliminada",
        description: "La nota ha sido eliminada.",
      })
    } catch (error) {
      console.error("Error deleting note:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la nota.",
        variant: "destructive",
      })
    }
  }

  // Highlight management
  const handleUpdateHighlight = async (highlightId: string) => {
    try {
      await LibraryService.updateHighlight(highlightId, { note: editingHighlightNote.trim() || undefined })
      await loadHighlights()
      setEditingHighlight(null)
      setEditingHighlightNote("")
      toast({
        title: "Subrayado actualizado",
        description: "Los cambios han sido guardados.",
      })
    } catch (error) {
      console.error("Error updating highlight:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el subrayado.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteHighlight = async (highlightId: string) => {
    try {
      await LibraryService.removeHighlight(highlightId)
      await loadHighlights()
      toast({
        title: "Subrayado eliminado",
        description: "El subrayado ha sido eliminado.",
      })
    } catch (error) {
      console.error("Error deleting highlight:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el subrayado.",
        variant: "destructive",
      })
    }
  }

  // Bookmark management
  const handleDeleteBookmark = async (bookmarkId: string, chapterId: string) => {
    try {
      await LibraryService.removeBookmark(bookId, chapterId)
      await loadBookmarks()
      toast({
        title: "Marcador eliminado",
        description: "El marcador ha sido eliminado.",
      })
    } catch (error) {
      console.error("Error deleting bookmark:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el marcador.",
        variant: "destructive",
      })
    }
  }

  // Quote management
  const handleToggleFavoriteQuote = async (quoteId: string) => {
    try {
      await LibraryService.toggleFavoriteQuote(quoteId)
      await loadQuotes()
    } catch (error) {
      console.error("Error toggling favorite quote:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la cita.",
        variant: "destructive",
      })
    }
  }

  // Filtered data
  const filteredHighlights = highlights.filter((highlight) => {
    if (highlightColorFilter !== "all" && highlight.color !== highlightColorFilter) return false
    return true
  })

  const filteredNotes = notes.filter((note) => {
    if (notePrivacyFilter === "private" && !note.is_private) return false
    if (notePrivacyFilter === "public" && note.is_private) return false
    return true
  })

  const filteredQuotes = quotes.filter((quote) => {
    if (quoteFavoriteFilter === "favorites" && !quote.is_favorite) return false
    return true
  })

  const favoriteQuotes = quotes.filter((quote) => quote.is_favorite)

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Herramientas de Lectura</h3>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search" className="text-xs">
              <Search className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="text-xs">
              <Bookmark className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="highlights" className="text-xs">
              <Highlighter className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">
              <FileText className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="search" className="space-y-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar en el libro..."
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch} disabled={searchLoading} size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>

                <ScrollArea className="h-64">
                  {searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((result, index) => (
                        <div
                          key={index}
                          className="p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
                          onClick={() => onNavigateToResult?.(result.chapter_id, result.position)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-blue-600">{result.chapter_title}</span>
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">...{result.context}...</p>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery && !searchLoading ? (
                    <p className="text-sm text-gray-500 text-center py-8">No se encontraron resultados</p>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-8">Ingresa un término para buscar en el libro</p>
                  )}
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="bookmarks" className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Marcadores ({bookmarks.length})</span>
              </div>

              <ScrollArea className="h-64">
                {bookmarks.length > 0 ? (
                  <div className="space-y-2">
                    {bookmarks.map((bookmark) => (
                      <div key={bookmark.id} className="p-2 border border-gray-200 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <button
                            onClick={() => onNavigateToBookmark?.(bookmark.chapter_id)}
                            className="text-xs font-medium text-blue-600 hover:underline flex-1 text-left"
                          >
                            {bookmark.chapter_title}
                          </button>
                          <Button
                            onClick={() => handleDeleteBookmark(bookmark.id, bookmark.chapter_id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        {bookmark.note && <p className="text-xs text-gray-600">{bookmark.note}</p>}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(bookmark.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">No hay marcadores</p>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="highlights" className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Subrayados ({filteredHighlights.length})</span>
                <Select value={highlightColorFilter} onValueChange={setHighlightColorFilter}>
                  <SelectTrigger className="w-20 h-6 text-xs">
                    <Filter className="w-3 h-3" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {HIGHLIGHT_COLORS.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded ${color.bg}`} />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-64">
                {filteredHighlights.length > 0 ? (
                  <div className="space-y-2">
                    {filteredHighlights.map((highlight) => (
                      <div key={highlight.id} className="p-2 border border-gray-200 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className={`w-3 h-3 rounded ${
                              HIGHLIGHT_COLORS.find((c) => c.value === highlight.color)?.bg || "bg-yellow-200"
                            }`}
                          />
                          <span className="text-xs text-gray-500">
                            {new Date(highlight.created_at).toLocaleDateString()}
                          </span>
                          <div className="ml-auto flex gap-1">
                            <Button
                              onClick={() => {
                                setEditingHighlight(highlight.id)
                                setEditingHighlightNote(highlight.note || "")
                              }}
                              variant="ghost"
                              size="sm"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            <Button onClick={() => handleDeleteHighlight(highlight.id)} variant="ghost" size="sm">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-xs text-gray-800 mb-2 line-clamp-3">"{highlight.selected_text}"</p>

                        {editingHighlight === highlight.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editingHighlightNote}
                              onChange={(e) => setEditingHighlightNote(e.target.value)}
                              placeholder="Nota del subrayado..."
                              rows={2}
                              className="text-xs"
                            />
                            <div className="flex gap-1">
                              <Button onClick={() => handleUpdateHighlight(highlight.id)} size="sm" className="flex-1">
                                <Save className="w-3 h-3 mr-1" />
                                Guardar
                              </Button>
                              <Button onClick={() => setEditingHighlight(null)} variant="outline" size="sm">
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          highlight.note && (
                            <p className="text-xs text-gray-600 bg-gray-50 p-1 rounded">{highlight.note}</p>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">No hay subrayados</p>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Notas ({filteredNotes.length})</span>
                <Select value={notePrivacyFilter} onValueChange={setNotePrivacyFilter}>
                  <SelectTrigger className="w-20 h-6 text-xs">
                    <Filter className="w-3 h-3" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <EyeOff className="w-3 h-3" />
                        Privadas
                      </div>
                    </SelectItem>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        Públicas
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-64">
                {filteredNotes.length > 0 ? (
                  <div className="space-y-2">
                    {filteredNotes.map((note) => (
                      <div key={note.id} className="p-2 border border-gray-200 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {note.is_private ? (
                              <EyeOff className="w-3 h-3 text-gray-400" />
                            ) : (
                              <Eye className="w-3 h-3 text-blue-500" />
                            )}
                            <span className="text-xs text-gray-500">
                              {new Date(note.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              onClick={() => {
                                setEditingNote(note.id)
                                setEditingNoteContent(note.content)
                              }}
                              variant="ghost"
                              size="sm"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            <Button onClick={() => handleDeleteNote(note.id)} variant="ghost" size="sm">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {editingNote === note.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editingNoteContent}
                              onChange={(e) => setEditingNoteContent(e.target.value)}
                              rows={3}
                              className="text-xs"
                            />
                            <div className="flex gap-1">
                              <Button onClick={() => handleUpdateNote(note.id)} size="sm" className="flex-1">
                                <Save className="w-3 h-3 mr-1" />
                                Guardar
                              </Button>
                              <Button onClick={() => setEditingNote(null)} variant="outline" size="sm">
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-800">{note.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">No hay notas</p>
                )}
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Floating Quotes Section */}
      {favoriteQuotes.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Quote className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Citas Favoritas</span>
            <Badge variant="secondary" className="text-xs">
              {favoriteQuotes.length}
            </Badge>
          </div>

          <ScrollArea className="h-32">
            <div className="space-y-2">
              {favoriteQuotes.slice(0, 3).map((quote) => (
                <div key={quote.id} className="p-2 bg-white rounded border border-purple-200">
                  <p className="text-xs text-gray-800 line-clamp-2 mb-1">"{quote.quote_text}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {quote.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button onClick={() => handleToggleFavoriteQuote(quote.id)} variant="ghost" size="sm">
                      <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {quotes.length > favoriteQuotes.length && (
            <div className="mt-2 text-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Ver todas las citas ({quotes.length})
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Todas las Citas</h4>
                      <Select value={quoteFavoriteFilter} onValueChange={setQuoteFavoriteFilter}>
                        <SelectTrigger className="w-24 h-6 text-xs">
                          <Filter className="w-3 h-3" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="favorites">Favoritas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {filteredQuotes.map((quote) => (
                          <div key={quote.id} className="p-2 border border-gray-200 rounded">
                            <p className="text-xs text-gray-800 mb-2 line-clamp-3">"{quote.quote_text}"</p>
                            {quote.context && (
                              <p className="text-xs text-gray-600 mb-2 bg-gray-50 p-1 rounded">{quote.context}</p>
                            )}
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1">
                                {quote.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    <Tag className="w-2 h-2 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <Button onClick={() => handleToggleFavoriteQuote(quote.id)} variant="ghost" size="sm">
                                <Heart
                                  className={`w-3 h-3 ${
                                    quote.is_favorite ? "fill-red-500 text-red-500" : "text-gray-400"
                                  }`}
                                />
                              </Button>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(quote.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
