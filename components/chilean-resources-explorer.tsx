"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ExternalLink } from "lucide-react"

interface Resource {
  id: string
  name: string
  category: string
  description: string
  base_url: string
  owner: string
  relevance_score: number
  tags: string[]
}

const CATEGORIES = [
  "Competencias Laborales",
  "Datos Laborales",
  "Conectividad",
  "Educación Superior",
  "Educación Escolar",
  "Empleo",
  "Mercado Laboral",
  "Información General",
]

export function ChileanResourcesExplorer() {
  const [resources, setResources] = useState<Resource[]>([])
  const [filteredResources, setFilteredResources] = useState<Resource[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchResources()
  }, [])

  useEffect(() => {
    filterResources()
  }, [resources, selectedCategory, searchTerm])

  async function fetchResources() {
    try {
      setLoading(true)
      const { data } = await supabase
        .from("biblioteca")
        .select("*")
        .eq("source_type", "public_data")
        .order("relevance_score", { ascending: false })

      if (data) {
        setResources(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching resources:", error)
    } finally {
      setLoading(false)
    }
  }

  function filterResources() {
    let filtered = resources

    if (selectedCategory) {
      filtered = filtered.filter((r) => r.category === selectedCategory)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.description?.toLowerCase().includes(term) ||
          r.tags?.some((t) => t.toLowerCase().includes(term)),
      )
    }

    setFilteredResources(filtered)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar recursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            size="sm"
          >
            Todos
          </Button>
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Cargando recursos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{resource.name}</CardTitle>
                    <CardDescription>{resource.category}</CardDescription>
                  </div>
                  <div className="text-sm font-semibold text-blue">
                    {(resource.relevance_score * 100).toFixed(0)}%
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">{resource.description}</p>
                <div className="text-xs text-muted-foreground">Por: {resource.owner}</div>
                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue/10 dark:bg-blue text-blue dark:text-blue-300 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <Button size="sm" className="w-full" onClick={() => window.open(resource.base_url, "_blank")}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visitar Recurso
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredResources.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No se encontraron recursos que coincidan con tu búsqueda.</div>
      )}
    </div>
  )
}
