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
import { VoiceSearchButton } from "@/components/voice-search-button"
import {
  Search,
  FileText,
  Briefcase,
  Brain,
  User,
  MessageSquare,
  BookOpen,
  Calendar,
  Target,
  GraduationCap,
  Settings,
} from "lucide-react"

const searchItems = [
  {
    group: "Páginas",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: Search },
      { title: "CV Builder", href: "/cv-builder", icon: FileText },
      { title: "Búsqueda de Empleo", href: "/job-search", icon: Briefcase },
      { title: "Coach de Carrera", href: "/career-coach", icon: MessageSquare },
      { title: "Biblioteca", href: "/library", icon: BookOpen },
      { title: "Calendario", href: "/calendar", icon: Calendar },
      { title: "Metas", href: "/goals", icon: Target },
    ],
  },
  {
    group: "Tests",
    items: [
      { title: "Test de Personalidad", href: "/personality-test", icon: Brain },
      { title: "Test DISC", href: "/disc-test", icon: User },
      { title: "Big Five", href: "/big-five-test", icon: Brain },
      { title: "Habilidades Blandas", href: "/soft-skills-test", icon: MessageSquare },
      { title: "Habilidades Técnicas", href: "/technical-skills-test", icon: Settings },
    ],
  },
  {
    group: "Educación",
    items: [
      { title: "Carreras UDD", href: "/udd-careers", icon: GraduationCap },
      { title: "Bachillerato", href: "/bachillerato", icon: BookOpen },
    ],
  },
]

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
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

  const handleSelect = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  const handleVoiceTranscript = (transcript: string) => {
    setQuery(transcript)
  }

  const filteredItems = searchItems
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64 bg-transparent"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Buscar...</span>
        <span className="inline-flex lg:hidden">Buscar...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder="Buscar páginas, tests, herramientas..."
            value={query}
            onValueChange={setQuery}
            className="flex-1"
          />
          <VoiceSearchButton onTranscript={handleVoiceTranscript} />
        </div>
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          {filteredItems.map((group, index) => (
            <div key={group.group}>
              <CommandGroup heading={group.group}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.href}
                    onSelect={() => handleSelect(item.href)}
                    className="flex items-center space-x-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {index < filteredItems.length - 1 && <CommandSeparator />}
            </div>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
