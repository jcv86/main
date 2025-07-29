"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { VoiceSearchButton } from "@/components/voice-search-button"
import { useRouter } from "next/navigation"

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    if (query.length > 2) {
      // Fetch suggestions from API
      fetch(`/api/search-suggestions?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data.suggestions || []))
        .catch(() => setSuggestions([]))
    } else {
      setSuggestions([])
    }
  }, [query])

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setOpen(false)
      setQuery("")
    }
  }

  const handleVoiceTranscript = (transcript: string) => {
    setQuery(transcript)
    handleSearch(transcript)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64 bg-transparent"
        >
          <Search className="mr-2 h-4 w-4" />
          Buscar...
          <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buscar en la plataforma</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tests, herramientas, contenido..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(query)
                }
              }}
              className="pl-8"
            />
          </div>
          <VoiceSearchButton onTranscript={handleVoiceTranscript} />
        </div>
        {suggestions.length > 0 && (
          <div className="mt-2 space-y-1">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleSearch(suggestion)}
              >
                <Search className="mr-2 h-4 w-4" />
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
