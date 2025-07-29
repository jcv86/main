"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { VoiceSearchButton } from "@/components/voice-search-button"
import { Search, Clock, MessageSquare, User, Bot, Loader2, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

interface SearchResult {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  session_id: string
  snippet: string
  relevanceScore: number
}

interface SearchResponse {
  results: SearchResult[]
  totalCount: number
  query: string
  searchType?: "voice" | "text"
  voiceQuery?: string
}

interface SearchSuggestion {
  text: string
  type: "keyword" | "topic" | "recent" | "popular"
  frequency: number
  category?: string
}

interface SuggestionResponse {
  suggestions: SearchSuggestion[]
  categories: string[]
}

interface SearchDialogProps {
  userId: string | null
  currentSessionId: string
  onResultClick?: (sessionId: string, messageId: string) => void
}

export function SearchDialog({ userId, currentSessionId, onResultClick }: SearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [searchType, setSearchType] = useState<"voice" | "text">("text")
  const [isVoiceInput, setIsVoiceInput] = useState(false)

  // Load suggestions when dialog opens
  useEffect(() => {
    if (isOpen && userId) {
      loadSuggestions()
    }
  }, [isOpen, userId])

  // Search when query changes (debounced)
  useEffect(() => {
    if (query.trim().length >= 2) {
      const timeoutId = setTimeout(() => {
        performSearch(query)
      }, 300)
      return () => clearTimeout(timeoutId)
    } else {
      setResults([])
      setTotalCount(0)
    }
  }, [query])

  const loadSuggestions = async () => {
    if (!userId) return

    setIsLoadingSuggestions(true)
    try {
      const response = await fetch(`/api/search-suggestions?userId=${userId}&query=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data: SuggestionResponse = await response.json()
        setSuggestions(data.suggestions.slice(0, 8)) // Limit to 8 suggestions
      }
    } catch (error) {
      console.error("Error loading suggestions:", error)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const performSearch = async (searchQuery: string, type: "voice" | "text" = "text") => {
    if (!searchQuery.trim() || !userId) return

    setIsSearching(true)
    setSearchType(type)

    try {
      const response = await fetch("/api/career-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: type === "voice" ? "voice-search" : "search",
          query: searchQuery.trim(),
          userId,
          searchSessionId: currentSessionId,
          limit: 20,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: SearchResponse = await response.json()
      setResults(data.results || [])
      setTotalCount(data.totalCount || 0)

      if (data.results.length === 0) {
        toast.info(`No se encontraron resultados para "${searchQuery}"`)
      } else {
        toast.success(`Se encontraron ${data.totalCount} resultado${data.totalCount !== 1 ? "s" : ""}`)
      }
    } catch (error) {
      console.error("Error searching:", error)
      toast.error("Error al realizar la búsqueda")
      setResults([])
      setTotalCount(0)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
    performSearch(suggestion.text)
  }

  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result.session_id, result.id)
    setIsOpen(false)
    toast.success("Navegando al mensaje encontrado")
  }

  const handleVoiceTranscript = (transcript: string) => {
    setQuery(transcript)
    setIsVoiceInput(false)
    // Auto-search with voice transcript
    setTimeout(() => {
      performSearch(transcript, "voice")
    }, 100)
  }

  const handleVoiceStart = () => {
    setIsVoiceInput(true)
  }

  const handleVoiceEnd = () => {
    setIsVoiceInput(false)
  }

  const handleVoiceError = (error: string) => {
    setIsVoiceInput(false)
    toast.error(error)
  }

  const formatSnippet = (snippet: string, query: string) => {
    if (!query) return snippet

    const regex = new RegExp(`(${query})`, "gi")
    return snippet.replace(regex, "**$1**")
  }

  const getRoleIcon = (role: "user" | "assistant") => {
    return role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />
  }

  const getRoleBadge = (role: "user" | "assistant") => {
    return (
      <Badge variant={role === "user" ? "default" : "secondary"} className="text-xs">
        {role === "user" ? "Tú" : "AI Coach"}
      </Badge>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar en Conversaciones
            {searchType === "voice" && (
              <Badge variant="outline" className="text-xs">
                Búsqueda por Voz
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isVoiceInput ? "Escuchando... Habla claramente" : "Buscar mensajes, temas, consejos..."}
              disabled={isVoiceInput}
              className="pr-10"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          <VoiceSearchButton
            onTranscript={handleVoiceTranscript}
            onStart={handleVoiceStart}
            onEnd={handleVoiceEnd}
            onError={handleVoiceError}
            disabled={isSearching}
            size="default"
          />
        </div>

        {/* Voice Input Status */}
        {isVoiceInput && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span>Escuchando... Habla claramente para buscar</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-h-0">
          {!userId ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Inicia sesión para buscar en tu historial de conversaciones</p>
            </div>
          ) : query.trim().length === 0 ? (
            <div>
              <h3 className="text-sm font-medium mb-3">Sugerencias de Búsqueda</h3>
              {isLoadingSuggestions ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Cargando sugerencias...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{suggestion.text}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {suggestion.category && (
                          <Badge variant="outline" className="text-xs">
                            {suggestion.category}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.type === "popular"
                            ? "Popular"
                            : suggestion.type === "recent"
                              ? "Reciente"
                              : suggestion.type === "topic"
                                ? "Tema"
                                : "Palabra clave"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No hay sugerencias disponibles</p>
              )}
            </div>
          ) : (
            <div>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">
                  Resultados de búsqueda
                  {totalCount > 0 && <span className="text-muted-foreground ml-1">({totalCount})</span>}
                </h3>
                {query && (
                  <Badge variant="outline" className="text-xs">
                    "{query}"
                  </Badge>
                )}
              </div>

              {/* Results */}
              <ScrollArea className="h-[400px]">
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
                        className="p-3 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getRoleIcon(result.role)}
                            {getRoleBadge(result.role)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(result.timestamp, "dd MMM, HH:mm", { locale: es })}
                          </div>
                        </div>

                        <p className="text-sm leading-relaxed mb-2">
                          {formatSnippet(result.snippet, query)
                            .split("**")
                            .map((part, index) =>
                              index % 2 === 1 ? (
                                <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
                                  {part}
                                </mark>
                              ) : (
                                part
                              ),
                            )}
                        </p>

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Sesión {result.session_id.split("-").pop()?.slice(0, 8)}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            Relevancia: {Math.round(result.relevanceScore)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : query.trim().length >= 2 ? (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">No se encontraron resultados</p>
                    <p className="text-sm text-muted-foreground">Intenta con términos diferentes o más generales</p>
                  </div>
                ) : null}
              </ScrollArea>
            </div>
          )}
        </div>

        <Separator />

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Busca en tu historial de conversaciones</span>
            <span>Usa el micrófono para búsqueda por voz</span>
          </div>
          {currentSessionId && <span>Sesión actual: {currentSessionId.split("-").pop()?.slice(0, 8)}</span>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
