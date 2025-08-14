"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Highlighter, Bookmark, Quote, Copy, Share2, Edit3, Trash2, Save, X, Plus, Star, Tag } from "lucide-react"
import { LibraryService, type UserBookHighlight } from "@/lib/supabase-library"
import { useToast } from "@/hooks/use-toast"

interface HighlightToolbarProps {
  selectedText: string
  bookId: string
  chapterId: string
  chapterTitle: string
  position: { start: number; end: number }
  existingHighlight?: UserBookHighlight
  onHighlightCreated?: (highlight: UserBookHighlight) => void
  onHighlightUpdated?: (highlight: UserBookHighlight) => void
  onHighlightDeleted?: (highlightId: string) => void
  onBookmarkCreated?: () => void
  onQuoteCreated?: () => void
  onClose?: () => void
}

const HIGHLIGHT_COLORS = [
  { name: "Amarillo", value: "yellow", bg: "bg-yellow-200", border: "border-yellow-300" },
  { name: "Verde", value: "green", bg: "bg-green-200", border: "border-green-300" },
  { name: "Azul", value: "blue", bg: "bg-blue-200", border: "border-blue-300" },
  { name: "Rosa", value: "pink", bg: "bg-pink-200", border: "border-pink-300" },
  { name: "Naranja", value: "orange", bg: "bg-orange-200", border: "border-orange-300" },
]

export function HighlightToolbar({
  selectedText,
  bookId,
  chapterId,
  chapterTitle,
  position,
  existingHighlight,
  onHighlightCreated,
  onHighlightUpdated,
  onHighlightDeleted,
  onBookmarkCreated,
  onQuoteCreated,
  onClose,
}: HighlightToolbarProps) {
  const { toast } = useToast()
  const [selectedColor, setSelectedColor] = useState(existingHighlight?.color || "yellow")
  const [note, setNote] = useState(existingHighlight?.note || "")
  const [isEditing, setIsEditing] = useState(!existingHighlight)
  const [loading, setLoading] = useState(false)
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [showBookmarkForm, setShowBookmarkForm] = useState(false)
  const [quoteContext, setQuoteContext] = useState("")
  const [quoteTags, setQuoteTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [bookmarkNote, setBookmarkNote] = useState("")

  const handleCreateHighlight = async () => {
    if (!selectedText.trim()) return

    try {
      setLoading(true)
      const highlight = await LibraryService.addHighlight(
        bookId,
        chapterId,
        selectedText,
        position.start,
        position.end,
        selectedColor,
        note.trim() || undefined,
      )

      onHighlightCreated?.(highlight)
      toast({
        title: "Subrayado creado",
        description: "El texto ha sido subrayado exitosamente.",
      })
      onClose?.()
    } catch (error) {
      console.error("Error creating highlight:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el subrayado.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateHighlight = async () => {
    if (!existingHighlight) return

    try {
      setLoading(true)
      await LibraryService.updateHighlight(existingHighlight.id, {
        color: selectedColor,
        note: note.trim() || undefined,
      })

      const updatedHighlight = {
        ...existingHighlight,
        color: selectedColor,
        note: note.trim() || undefined,
      }

      onHighlightUpdated?.(updatedHighlight)
      setIsEditing(false)
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
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteHighlight = async () => {
    if (!existingHighlight) return

    try {
      setLoading(true)
      await LibraryService.removeHighlight(existingHighlight.id)
      onHighlightDeleted?.(existingHighlight.id)
      toast({
        title: "Subrayado eliminado",
        description: "El subrayado ha sido eliminado.",
      })
      onClose?.()
    } catch (error) {
      console.error("Error deleting highlight:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el subrayado.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBookmark = async () => {
    try {
      setLoading(true)
      await LibraryService.addBookmark(bookId, chapterId, chapterTitle, bookmarkNote.trim() || undefined)
      onBookmarkCreated?.()
      setShowBookmarkForm(false)
      setBookmarkNote("")
      toast({
        title: "Marcador creado",
        description: "Se ha añadido un marcador a este capítulo.",
      })
    } catch (error) {
      console.error("Error creating bookmark:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el marcador.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateQuote = async () => {
    try {
      setLoading(true)
      await LibraryService.addQuote(bookId, chapterId, selectedText, quoteContext.trim() || undefined, quoteTags)
      onQuoteCreated?.()
      setShowQuoteForm(false)
      setQuoteContext("")
      setQuoteTags([])
      toast({
        title: "Cita guardada",
        description: "La cita ha sido añadida a tu colección.",
      })
    } catch (error) {
      console.error("Error creating quote:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la cita.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(selectedText)
      toast({
        title: "Texto copiado",
        description: "El texto ha sido copiado al portapapeles.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo copiar el texto.",
        variant: "destructive",
      })
    }
  }

  const handleShareText = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: chapterTitle,
          text: selectedText,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copy
      handleCopyText()
    }
  }

  const addTag = () => {
    if (newTag.trim() && !quoteTags.includes(newTag.trim())) {
      setQuoteTags([...quoteTags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setQuoteTags(quoteTags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md">
      {/* Selected Text Preview */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Texto seleccionado:</p>
        <div className="bg-gray-50 p-2 rounded text-sm max-h-20 overflow-y-auto">
          "{selectedText.length > 100 ? selectedText.substring(0, 100) + "..." : selectedText}"
        </div>
      </div>

      {/* Color Selection */}
      {(isEditing || !existingHighlight) && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Color del subrayado:</p>
          <div className="flex gap-2">
            {HIGHLIGHT_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`w-8 h-8 rounded-full ${color.bg} ${color.border} border-2 ${
                  selectedColor === color.value ? "ring-2 ring-blue-500" : ""
                } hover:scale-110 transition-transform`}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Note Input */}
      {(isEditing || !existingHighlight) && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Nota (opcional):</p>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Añade una nota a este subrayado..."
            className="text-sm"
            rows={2}
          />
        </div>
      )}

      {/* Existing Highlight Info */}
      {existingHighlight && !isEditing && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-4 h-4 rounded ${
                HIGHLIGHT_COLORS.find((c) => c.value === existingHighlight.color)?.bg || "bg-yellow-200"
              }`}
            />
            <span className="text-sm font-medium">Subrayado existente</span>
          </div>
          {existingHighlight.note && (
            <div className="bg-gray-50 p-2 rounded text-sm">
              <p className="text-gray-600">Nota:</p>
              <p>{existingHighlight.note}</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Primary Actions */}
        <div className="flex gap-2">
          {existingHighlight ? (
            <>
              {isEditing ? (
                <>
                  <Button onClick={handleUpdateHighlight} disabled={loading} size="sm" className="flex-1">
                    <Save className="w-4 h-4 mr-1" />
                    Guardar
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="flex-1">
                    <Edit3 className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button onClick={handleDeleteHighlight} variant="destructive" size="sm" disabled={loading}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </>
          ) : (
            <Button onClick={handleCreateHighlight} disabled={loading} className="flex-1">
              <Highlighter className="w-4 h-4 mr-2" />
              Subrayar
            </Button>
          )}
        </div>

        <Separator />

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Popover open={showBookmarkForm} onOpenChange={setShowBookmarkForm}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-1" />
                Marcar
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <h4 className="font-medium">Crear Marcador</h4>
                <Textarea
                  value={bookmarkNote}
                  onChange={(e) => setBookmarkNote(e.target.value)}
                  placeholder="Nota del marcador (opcional)..."
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button onClick={handleCreateBookmark} disabled={loading} size="sm" className="flex-1">
                    <Bookmark className="w-4 h-4 mr-1" />
                    Crear
                  </Button>
                  <Button onClick={() => setShowBookmarkForm(false)} variant="outline" size="sm">
                    Cancelar
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={showQuoteForm} onOpenChange={setShowQuoteForm}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Quote className="w-4 h-4 mr-1" />
                Citar
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <h4 className="font-medium">Guardar Cita</h4>
                <div className="bg-gray-50 p-2 rounded text-sm max-h-16 overflow-y-auto">
                  "{selectedText.length > 80 ? selectedText.substring(0, 80) + "..." : selectedText}"
                </div>
                <Textarea
                  value={quoteContext}
                  onChange={(e) => setQuoteContext(e.target.value)}
                  placeholder="Contexto o reflexión (opcional)..."
                  rows={2}
                />
                <div>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Añadir etiqueta..."
                      size="sm"
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                    />
                    <Button onClick={addTag} size="sm" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {quoteTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {quoteTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                          <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateQuote} disabled={loading} size="sm" className="flex-1">
                    <Star className="w-4 h-4 mr-1" />
                    Guardar
                  </Button>
                  <Button onClick={() => setShowQuoteForm(false)} variant="outline" size="sm">
                    Cancelar
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={handleCopyText} variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-1" />
            Copiar
          </Button>

          <Button onClick={handleShareText} variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-1" />
            Compartir
          </Button>
        </div>

        {onClose && (
          <>
            <Separator />
            <Button onClick={onClose} variant="ghost" size="sm" className="w-full">
              <X className="w-4 h-4 mr-1" />
              Cerrar
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
