"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { VoiceSearchButton } from "@/components/voice-search-button"
import { Search, MessageSquare, Clock, Mic, Loader2, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

interface SearchResult {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: string
  sessionId: string
  snippet: string
  relevanceScore?: number
}

interface SearchResponse {
  results: SearchResult[]
  totalCount: number
  query: string
  searchType?: "text" | "voice"
  voiceQuery?: string
}

interface SearchDialogProps {
  userId: string | null
  currentSessionId: string
  onResultClick: (sessionId: string, messageId: string) => void
}

export function SearchDialog({ userId, currentSessionId, onResultClick }: SearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [searchType, setSearchType] = useState<"text" | "voice">("text")
  const [voiceQuery, setVoiceQuery] = useState("")
  const [isVoiceActive, setIsVoiceActive] = useState(false)

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("")
      setResults([])
      setTotalCount(0)
      setSearchType("text")
      setVoiceQuery("")
      setIsVoiceActive(false)
    }
  }, [isOpen])

  const performSearch = async (searchQuery: string, type: "text" | "voice" = "text") => {
    if (!searchQuery.trim() || !userId) return

    setIsSearching(true)
    setSearchType(type)

    try {
      const params = new URLSearchParams({
        action: "search",
        query: searchQuery.trim(),
        limit: "20",
      })

      if (currentSessionId) {
        params.append("sessionId", currentSessionId)
      }

      const response = await fetch(`/api/career-coach?${params}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: SearchResponse = await response.json()

      setResults(data.results || [])
      setTotalCount(data.totalCount || 0)

      if (type === "voice" && data.voiceQuery) {
        setVoiceQuery(data.voiceQuery)
      }

      if (data.results.length === 0) {
        toast.info(`No se encontraron resultados para "${searchQuery}"`)
      } else {
        toast.success(`Se encontraron ${data.results.length} resultado${data.results.length !== 1 ? "s" : ""}`)
      }
    } catch (error) {
      console.error("Error searching conversations:", error)
      toast.error("Error al buscar en las conversaciones")
      setResults([])
      setTotalCount(0)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query, "text")
  }

  const handleVoiceTranscript = (transcript: string) => {
    setQuery(transcript)
    setIsVoiceActive(false)
    // Auto-search after voice input
    setTimeout(() => {
      performSearch(transcript, "voice")
    }, 100)
  }

  const handleVoiceStart = () => {
    setIsVoiceActive(true)
  }

  const handleVoiceEnd = () => {
    setIsVoiceActive(false)
  }

  const handleResultClick = (result: SearchResult) => {
    onResultClick(result.sessionId, result.id)
    setIsOpen(false)
    toast.success("Navegando al mensaje encontrado")
  }

  const highlightQuery = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text

    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  const formatResultTime = (timestamp: string) => {
    return format(new Date(timestamp), "dd MMM, HH:mm", { locale: es })
  }

  const getRoleIcon = (role: "user" | "assistant") => {
    return role === "user" ? "👤" : "🤖"
  }

  const getRoleBadgeVariant = (role: "user" | "assistant") => {
    return role === "user" ? "secondary" : "outline"
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar en Conversaciones
            {totalCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {totalCount} resultado{totalCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isVoiceActive ? "Escuchando... Habla claramente" : "Buscar mensajes, temas, o palabras clave..."
                }
                disabled={isSearching || isVoiceActive}
                className="pr-12"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setQuery("")}
                >
                  ×
                </Button>
              )}
            </div>

            {/* Voice Search Button */}
            <VoiceSearchButton
              onTranscript={handleVoiceTranscript}
              onStart={handleVoiceStart}
              onEnd={handleVoiceEnd}
              disabled={isSearching || !userId}
              size="default"
            />

            {/* Search Button */}
            <Button type="submit" disabled={!query.trim() || isSearching || isVoiceActive}>
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </form>

          {/* Voice Input Status */}
          {isVoiceActive && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <Mic className="h-4 w-4" />
                Escuchando... Habla claramente para buscar
              </div>
            </div>
          )}

          {/* Search Type Indicator */}
          {searchType === "voice" && voiceQuery && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mic className="h-4 w-4" />
              <span>Búsqueda por voz:</span>
              <Badge variant="outline">"{voiceQuery}"</Badge>
            </div>
          )}

          {/* No User Warning */}
          {!userId && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-yellow-700">
                <AlertCircle className="h-4 w-4" />
                Inicia sesión para buscar en tu historial de conversaciones
              </div>
            </div>
          )}

          <Separator />

          {/* Search Results */}
          <ScrollArea className="h-96">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Buscando...</span>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-3">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getRoleIcon(result.role)}</span>
                        <Badge variant={getRoleBadgeVariant(result.role)} className="text-xs">
                          {result.role === "user" ? "Tú" : "AI Coach"}
                        </Badge>
                        {result.sessionId === currentSessionId && (
                          <Badge variant="secondary" className="text-xs">
                            Sesión actual
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatResultTime(result.timestamp)}
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed">{highlightQuery(result.snippet || result.content, query)}</p>

                    {result.relevanceScore && (
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">Relevancia:</span>
                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${result.relevanceScore * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : query && !isSearching ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">No se encontraron resultados</p>
                <p className="text-xs text-muted-foreground">
                  Intenta con diferentes palabras clave o usa la búsqueda por voz
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">Busca en tu historial de conversaciones</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge
                    variant="outline"
                    className="cursor-pointer text-xs"
                    onClick={() => setQuery("desarrollo profesional")}
                  >
                    desarrollo profesional
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer text-xs"
                    onClick={() => setQuery("entrevista trabajo")}
                  >
                    entrevista trabajo
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer text-xs" onClick={() => setQuery("salario Chile")}>
                    salario Chile
                  </Badge>
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Search Tips */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              💡 <strong>Consejos de búsqueda:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Usa palabras clave específicas como "CV", "entrevista", "salario"</li>
              <li>Prueba la búsqueda por voz haciendo clic en el micrófono</li>
              <li>Los resultados se ordenan por relevancia y fecha</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
