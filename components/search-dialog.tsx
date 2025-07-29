"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Clock, TrendingUp, MessageCircle, Loader2 } from "lucide-react"
import { VoiceSearchButton } from "@/components/voice-search-button"
import { cn } from "@/lib/utils"

interface SearchSuggestion {
  id: string
  text: string
  category: "recent" | "popular" | "career" | "skills"
  frequency?: number
}

interface SearchResult {
  id: string
  title: string
  content: string
  type: "conversation" | "session" | "topic"
  sessionId?: string
  relevance: number
  timestamp?: string
}

interface SearchDialogProps {
  trigger?: React.ReactNode
  onResultSelect?: (result: SearchResult) => void
  onSearchExecute?: (query: string) => void
  placeholder?: string
}

export function SearchDialog({
  trigger,
  onResultSelect,
  onSearchExecute,
  placeholder = "Buscar en tus conversaciones...",
}: SearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isVoiceActive, setIsVoiceActive] = useState(false)

  // Cargar sugerencias al abrir el diálogo
  useEffect(() => {
    if (isOpen) {
      loadSuggestions()
    }
  }, [isOpen])

  // Ejecutar búsqueda cuando cambia la query
  useEffect(() => {
    if (query.trim().length > 2) {
      executeSearch(query)
    } else {
      setResults([])
    }
  }, [query])

  const loadSuggestions = async () => {
    try {
      const response = await fetch("/api/search-suggestions")
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      }
    } catch (error) {
      console.error("Error cargando sugerencias:", error)
      // Sugerencias por defecto
      setSuggestions([
        { id: "1", text: "desarrollo profesional", category: "career" },
        { id: "2", text: "cambio de carrera", category: "career" },
        { id: "3", text: "habilidades técnicas", category: "skills" },
        { id: "4", text: "entrevista de trabajo", category: "career" },
        { id: "5", text: "networking", category: "career" },
      ])
    }
  }

  const executeSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      // Simular búsqueda (reemplazar con API real)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Resultados simulados
      const mockResults: SearchResult[] = [
        {
          id: "1",
          title: "Conversación sobre desarrollo profesional",
          content: `Hablamos sobre cómo mejorar tus habilidades de ${searchQuery} y las oportunidades de crecimiento...`,
          type: "conversation",
          sessionId: "session-1",
          relevance: 0.95,
          timestamp: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          title: "Sesión de coaching profesional",
          content: `En esta sesión exploramos estrategias para ${searchQuery} y definimos objetivos claros...`,
          type: "session",
          sessionId: "session-2",
          relevance: 0.87,
          timestamp: "2024-01-14T15:45:00Z",
        },
      ]

      setResults(mockResults)
      onSearchExecute?.(searchQuery)
    } catch (error) {
      console.error("Error en búsqueda:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
  }

  const handleResultClick = (result: SearchResult) => {
    onResultSelect?.(result)
    setIsOpen(false)
  }

  const handleVoiceTranscript = (transcript: string, isFinal: boolean) => {
    if (isFinal) {
      setQuery(transcript)
      setIsVoiceActive(false)
    } else {
      // Mostrar transcripción en tiempo real
      setQuery(transcript)
    }
  }

  const handleVoiceError = (error: string) => {
    console.error("Error de voz:", error)
    setIsVoiceActive(false)
  }

  const getCategoryIcon = (category: SearchSuggestion["category"]) => {
    switch (category) {
      case "recent":
        return <Clock className="h-3 w-3" />
      case "popular":
        return <TrendingUp className="h-3 w-3" />
      case "career":
        return <MessageCircle className="h-3 w-3" />
      case "skills":
        return <Search className="h-3 w-3" />
      default:
        return <Search className="h-3 w-3" />
    }
  }

  const getCategoryLabel = (category: SearchSuggestion["category"]) => {
    switch (category) {
      case "recent":
        return "Recientes"
      case "popular":
        return "Populares"
      case "career":
        return "Carrera"
      case "skills":
        return "Habilidades"
      default:
        return "General"
    }
  }

  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text

    const regex = new RegExp(`(${searchTerm})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Hace menos de una hora"
    if (diffInHours < 24) return `Hace ${diffInHours} horas`
    if (diffInHours < 48) return "Ayer"
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Buscar en tus conversaciones</DialogTitle>
          <DialogDescription>
            Encuentra conversaciones anteriores, temas específicos o consejos del coach profesional
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className={cn("pl-10 pr-4", isVoiceActive && "ring-2 ring-red-500 ring-opacity-50")}
                autoFocus
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <VoiceSearchButton
              onTranscript={handleVoiceTranscript}
              onError={handleVoiceError}
              size="default"
              variant="outline"
            />
          </div>

          <ScrollArea className="h-[400px]">
            {/* Resultados de búsqueda */}
            {query.trim().length > 2 && results.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">Resultados ({results.length})</h3>
                {results.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{highlightSearchTerm(result.title, query)}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {result.type === "conversation"
                          ? "Conversación"
                          : result.type === "session"
                            ? "Sesión"
                            : "Tema"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{highlightSearchTerm(result.content, query)}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Relevancia: {Math.round(result.relevance * 100)}%</span>
                      {result.timestamp && <span>{formatTimestamp(result.timestamp)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mensaje cuando no hay resultados */}
            {query.trim().length > 2 && results.length === 0 && !isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron resultados para "{query}"</p>
                <p className="text-sm mt-2">Intenta con términos diferentes o más generales</p>
              </div>
            )}

            {/* Sugerencias */}
            {query.trim().length <= 2 && suggestions.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground">Sugerencias de búsqueda</h3>

                {/* Agrupar sugerencias por categoría */}
                {["recent", "popular", "career", "skills"].map((category) => {
                  const categorySuggestions = suggestions.filter((s) => s.category === category)
                  if (categorySuggestions.length === 0) return null

                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        {getCategoryIcon(category as SearchSuggestion["category"])}
                        {getCategoryLabel(category as SearchSuggestion["category"])}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {categorySuggestions.map((suggestion) => (
                          <Badge
                            key={suggestion.id}
                            variant="outline"
                            className="cursor-pointer hover:bg-muted transition-colors"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion.text}
                            {suggestion.frequency && (
                              <span className="ml-1 text-xs opacity-60">({suggestion.frequency})</span>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Estado inicial */}
            {query.trim().length === 0 && suggestions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Comienza a escribir para buscar</p>
                <p className="text-sm mt-2">O usa el botón de voz para buscar hablando</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
