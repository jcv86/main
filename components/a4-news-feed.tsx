"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp, Search, Bookmark, Share2, Calendar, Tag } from "lucide-react"
import Link from "next/link"

interface NewsItem {
  id: string
  titulo: string
  resumen: string
  contenido?: string
  imagen_url?: string
  fuente: string
  categoria: string
  relevancia_score: number
  publicado_en: string
  etiquetas: string[]
  en_destacado: boolean
}

interface A4NewsFeedProps {
  items: NewsItem[]
  onSave?: (itemId: string) => void
}

const getCategoryColor = (categoria: string) => {
  const colors: Record<string, string> = {
    "Tech": "bg-blue-100 text-blue-800",
    "Finanzas": "bg-green-100 text-green-800",
    "Retail": "bg-orange-100 text-orange-800",
    "Recursos": "bg-purple-100 text-purple-800",
    "Carrera": "bg-pink-100 text-pink-800",
    "Economia": "bg-yellow-100 text-yellow-800",
  }
  return colors[categoria] || "bg-gray-100 text-gray-800"
}

const getRelevanceIcon = (score: number) => {
  if (score >= 80) return "🔥" // Hot
  if (score >= 60) return "📈" // Trending
  if (score >= 40) return "📰" // News
  return "💡" // Insight
}

export function A4NewsFeed({ items, onSave }: A4NewsFeedProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredItems = items.filter(item => {
    const matchesSearch = item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.resumen.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || item.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(items.map(item => item.categoria))]

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-CL")
    } catch {
      return "Fecha desconocida"
    }
  }

  const handleSave = (itemId: string) => {
    setSavedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
    onSave?.(itemId)
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl">
            📰
          </div>
          <div>
            <h2 className="text-2xl font-bold">Centro de Noticias Profesionales</h2>
            <p className="text-sm text-muted-foreground">
              Mantente actualizado con tendencias, oportunidades y contexto del mercado
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Busca noticias, tendencias, oportunidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Todas
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured News */}
      {items.some(item => item.en_destacado) && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Destacado
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {items
              .filter(item => item.en_destacado)
              .slice(0, 2)
              .map(item => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {item.imagen_url && (
                    <div className="h-40 bg-gray-200 overflow-hidden">
                      <img
                        src={item.imagen_url}
                        alt={item.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge className={getCategoryColor(item.categoria)}>
                        {item.categoria}
                      </Badge>
                      <span className="text-xl">{getRelevanceIcon(item.relevancia_score)}</span>
                    </div>
                    <div>
                      <div className="font-bold text-base">{item.titulo}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.resumen}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {mounted && formatDate(item.publicado_en)}
                      </span>
                      <span>{item.fuente}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSave(item.id)}
                      >
                        <Bookmark
                          className={`w-4 h-4 mr-1 ${
                            savedItems.has(item.id) ? "fill-current" : ""
                          }`}
                        />
                        Guardar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* News List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Noticias ({filteredItems.length})
        </h3>
        <div className="space-y-3">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <Card
                key={item.id}
                className="hover:shadow-md transition-all cursor-pointer group"
              >
                <CardContent className="py-4">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium group-hover:text-primary transition">
                            {item.titulo}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {item.resumen}
                          </div>
                        </div>
                        <span className="text-2xl flex-shrink-0">
                          {getRelevanceIcon(item.relevancia_score)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="outline" className={getCategoryColor(item.categoria)}>
                          {item.categoria}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {mounted && formatDate(item.publicado_en)}
                        </span>
                        <span className="text-xs text-muted-foreground">{item.fuente}</span>
                      </div>

                      {item.etiquetas.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {item.etiquetas.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              <Tag className="w-2 h-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSave(item.id)}
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            savedItems.has(item.id)
                              ? "fill-current text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <div className="text-muted-foreground">
                  No se encontraron noticias que coincidan con tu búsqueda.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default A4NewsFeed
