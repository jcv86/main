"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Menu,
  X,
  ChevronRight,
  Home,
  FileText,
  Database,
  Code,
  Zap,
  Settings,
  BookOpen,
  Download,
  ExternalLink,
  AlertCircle,
  HelpCircle,
} from "lucide-react"
import ReactMarkdown from "react-markdown"

const generateId = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/[áàäâ]/g, "a")
    .replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i")
    .replace(/[óòöô]/g, "o")
    .replace(/[úùüû]/g, "u")
    .replace(/ñ/g, "n")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
}

const extractHeadings = (markdown: string) => {
  const headingRegex = /^##\s+(.+)$/gm
  const headings: { id: string; title: string; icon: any }[] = []
  let match

  const getIcon = (title: string) => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes("arquitectura") || lowerTitle.includes("general")) return Home
    if (lowerTitle.includes("test") || lowerTitle.includes("psicométrico")) return BookOpen
    if (lowerTitle.includes("base") || lowerTitle.includes("datos")) return Database
    if (lowerTitle.includes("api") || lowerTitle.includes("endpoint")) return Code
    if (lowerTitle.includes("componente")) return Zap
    if (lowerTitle.includes("librería") || lowerTitle.includes("utilidad")) return Code
    if (lowerTitle.includes("ia") || lowerTitle.includes("inteligencia")) return Zap
    if (lowerTitle.includes("admin") || lowerTitle.includes("cron") || lowerTitle.includes("variable")) return Settings
    if (lowerTitle.includes("pregunta") || lowerTitle.includes("operacional")) return HelpCircle
    return FileText
  }

  while ((match = headingRegex.exec(markdown)) !== null) {
    const fullTitle = match[1].trim()
    const cleanTitle = fullTitle.replace(/\*\*/g, "").replace(/__/g, "").trim()
    const id = generateId(cleanTitle)

    headings.push({
      id,
      title: cleanTitle,
      icon: getIcon(cleanTitle),
    })
  }

  return headings
}

interface DocumentationViewerProps {
  type?: "tecnica" | "funcional" | "operacional"
}

export function DocumentationViewer({ type = "tecnica" }: DocumentationViewerProps) {
  const [content, setContent] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sections = useMemo(() => {
    if (!content) return []
    return extractHeadings(content)
  }, [content])

  const config = {
    tecnica: {
      title: "Documentación Técnica",
      subtitle: "DespegarTuCarrera - Versión 2025.1.1.04-SUPREMO",
      endpoint: "/api/documentation",
      filename: "DOCUMENTACION-COMPLETA-DTC.md",
    },
    funcional: {
      title: "Documentación Funcional",
      subtitle: "Guía para Usuarios y Stakeholders",
      endpoint: "/api/documentation/funcional",
      filename: "DOCUMENTACION-FUNCIONAL-DTC.md",
    },
    operacional: {
      title: "Preguntas Operacionales",
      subtitle: "Preguntas Técnicas y de Negocio para Juan",
      endpoint: "/api/documentation/operacional",
      filename: "PREGUNTAS-OPERACIONALES-DTC.md",
    },
  }

  const currentConfig = config[type]

  useEffect(() => {
    fetch(currentConfig.endpoint)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.text()
      })
      .then((text) => {
        setContent(text)
        setLoading(false)
        setError(null)
      })
      .catch((err) => {
        console.error("[v0] Error loading documentation:", err)
        setError(err.message || "Failed to load documentation")
        setLoading(false)
      })
  }, [type, currentConfig.endpoint])

  const filteredContent = searchTerm
    ? content
        .split("\n")
        .filter((line) => line.toLowerCase().includes(searchTerm.toLowerCase()))
        .join("\n")
    : content

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const downloadMarkdown = () => {
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = currentConfig.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href")

    if (href && href.startsWith("#")) {
      e.preventDefault()

      const targetId = decodeURIComponent(href.substring(1))
      const element = document.getElementById(targetId)
      if (element) {
        setActiveSection(targetId)
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando documentación...</p>
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error al cargar la documentación</h2>
          <p className="text-muted-foreground mb-4">{error || "No se pudo cargar el contenido"}</p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-80" : "w-0"} transition-all duration-300 border-r bg-card overflow-hidden`}>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Documentación DTC</h2>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en documentación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-4 space-y-1">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => scrollToSection(section.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {section.title}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
              )
            })}
          </div>
        </ScrollArea>

        <div className="p-4 border-t space-y-2">
          <Button variant="outline" className="w-full bg-transparent" onClick={downloadMarkdown}>
            <Download className="h-4 w-4 mr-2" />
            Descargar MD
          </Button>
          <Button variant="outline" className="w-full bg-transparent" asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ir a la App
            </a>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold">{currentConfig.title}</h1>
              <p className="text-sm text-muted-foreground">{currentConfig.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{content.split("\n").length} líneas</span>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <ReactMarkdown
              className="prose prose-slate dark:prose-invert max-w-none prose-pre:my-4 prose-pre:bg-slate-950 prose-pre:text-slate-50 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:border prose-pre:border-slate-800"
              components={{
                code({ node, inline, className, children, ...props }) {
                  if (inline) {
                    return (
                      <code
                        className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  }

                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
                h1: ({ node, ...props }) => (
                  <h1 id={generateId(props.children?.toString() || "")} className="scroll-mt-20" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 id={generateId(props.children?.toString() || "")} className="scroll-mt-20" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 id={generateId(props.children?.toString() || "")} className="scroll-mt-20" {...props} />
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="min-w-full divide-y divide-border" {...props} />
                  </div>
                ),
                a: ({ node, ...props }) => (
                  <a className="text-primary hover:underline cursor-pointer" onClick={handleLinkClick} {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />
                ),
                ul: ({ node, ...props }) => <ul className="list-disc list-inside my-4 space-y-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside my-4 space-y-2" {...props} />,
                li: ({ node, ...props }) => <li className="ml-4" {...props} />,
              }}
            >
              {filteredContent}
            </ReactMarkdown>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
