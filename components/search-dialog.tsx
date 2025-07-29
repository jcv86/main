"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VoiceSearchButton } from "@/components/voice-search-button"
import {
  Search,
  FileText,
  BrainCircuit,
  BookOpen,
  Target,
  Calendar,
  Briefcase,
  GraduationCap,
  MessageSquare,
  BarChart3,
  Settings,
  User,
  Zap,
} from "lucide-react"

const searchItems = [
  {
    group: "Páginas",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: BarChart3, keywords: ["inicio", "panel", "resumen"] },
      { name: "Constructor CV", href: "/cv-builder", icon: FileText, keywords: ["curriculum", "cv", "hoja de vida"] },
      {
        name: "Tests de Personalidad",
        href: "/personality-test",
        icon: BrainCircuit,
        keywords: ["personalidad", "test", "psicológico"],
      },
      {
        name: "Evaluación de Habilidades",
        href: "/skills-assessment",
        icon: Target,
        keywords: ["habilidades", "competencias", "evaluación"],
      },
      {
        name: "Coach Profesional",
        href: "/career-coach",
        icon: MessageSquare,
        keywords: ["coach", "orientación", "consejería"],
      },
      { name: "Búsqueda de Empleos", href: "/job-search", icon: Briefcase, keywords: ["trabajo", "empleo", "ofertas"] },
      { name: "Biblioteca", href: "/library", icon: BookOpen, keywords: ["libros", "recursos", "lectura"] },
      {
        name: "Carreras UDD",
        href: "/udd-careers",
        icon: GraduationCap,
        keywords: ["universidad", "carreras", "estudios"],
      },
      { name: "Calendario", href: "/calendar", icon: Calendar, keywords: ["eventos", "fechas", "agenda"] },
      { name: "Metas", href: "/goals", icon: Target, keywords: ["objetivos", "metas", "propósitos"] },
    ],
  },
  {
    group: "Configuración",
    items: [
      { name: "Perfil", href: "/profile", icon: User, keywords: ["perfil", "cuenta", "información personal"] },
      {
        name: "Configuración",
        href: "/settings",
        icon: Settings,
        keywords: ["ajustes", "configuración", "preferencias"],
      },
    ],
  },
]

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
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        try {
          const response = await fetch(`/api/search-suggestions?q=${encodeURIComponent(query)}`)
          if (response.ok) {
            const data = await response.json()
            setSuggestions(data.suggestions || [])
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error)
        }
      } else {
        setSuggestions([])
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSelect = (href: string) => {
    setOpen(false)
    setQuery("")
    router.push(href)
  }

  const handleVoiceTranscript = (transcript: string) => {
    setQuery(transcript)
  }

  const filteredItems = searchItems.flatMap((group) =>
    group.items.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.keywords.some((keyword) => keyword.toLowerCase().includes(query.toLowerCase())),
    ),
  )

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2 bg-transparent"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Buscar...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder="Buscar páginas, funciones..."
            value={query}
            onValueChange={setQuery}
            className="flex-1"
          />
          <VoiceSearchButton onTranscript={handleVoiceTranscript} className="ml-2" />
        </div>
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>

          {suggestions.length > 0 && (
            <>
              <CommandGroup heading="Sugerencias">
                {suggestions.map((suggestion, index) => (
                  <CommandItem key={index} onSelect={() => setQuery(suggestion)}>
                    <Zap className="mr-2 h-4 w-4" />
                    {suggestion}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {searchItems.map((group) => {
            const groupItems = group.items.filter(
              (item) =>
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.keywords.some((keyword) => keyword.toLowerCase().includes(query.toLowerCase())),
            )

            if (groupItems.length === 0) return null

            return (
              <CommandGroup key={group.group} heading={group.group}>
                {groupItems.map((item) => (
                  <CommandItem key={item.href} onSelect={() => handleSelect(item.href)}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.name}</span>
                    {item.keywords.some((keyword) => keyword.toLowerCase().includes(query.toLowerCase())) && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Coincidencia
                      </Badge>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}
