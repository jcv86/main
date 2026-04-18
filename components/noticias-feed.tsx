"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp, Bookmark, Share2, Search, Filter } from "lucide-react"
import {
  getNoticiasPaginated,
  getNoticiasByCategory,
  searchNoticias,
} from "@/lib/supabase/a4-queries"

export function NoticiasFeed() {
  const [noticias, setNoticias] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [saved, setSaved] = useState<Set<string>>(new Set())

  const itemsPerPage = 10

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadNoticias()
  }, [page, selectedCategory, searchQuery])

  const loadCategories = async () => {
    try {
      // Set default categories
      const defaultCategories = [
        "Tecnología",
        "Negocios",
        "Innovación",
        "Desarrollo",
        "Educación",
        "Emprendimiento",
      ]
      setCategories(defaultCategories)
    } catch (error) {
      console.error("[v0] Error loading categories:", error)
    }
  }

  const loadNoticias = async () => {
    setLoading(true)
    try {
      let result
      if (searchQuery) {
        const searchResults = await searchNoticias(searchQuery)
        result = {
          noticias: searchResults,
          total: searchResults.length,
        }
      } else {
        result = await getNoticiasPaginated(page, itemsPerPage)
      }
      setNoticias(result.noticias)
      setTotal(result.total)
    } catch (error) {
      console.error("[v0] Error loading noticias:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = (newsId: string) => {
    const newSaved = new Set(saved)
    if (newSaved.has(newsId)) {
      newSaved.delete(newsId)
    } else {
      newSaved.add(newsId)
    }
    setSaved(newSaved)
  }

  const handleShare = (newsId: string, title: string) => {
    if (navigator.share) {
      navigator.share({
        title: "Despega A4",
        text: title,
      })
    }
  }

  const totalPages = Math.ceil(total / itemsPerPage)

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardContent className="pt-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar noticias..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="pl-10"
            />
          </div>

          {categories.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <button
                onClick={() => {
                  setSelectedCategory("")
                  setPage(1)
                }}
                className={`px-3 py-1 rounded-[20px] text-sm transition-colors ${
                  selectedCategory === ""
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Todas
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    setPage(1)
                  }}
                  className={`px-3 py-1 rounded-[20px] text-sm transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* News List */}
      <div className="space-y-3">
        {loading && (
          <Card className="border-0 bg-card/70 backdrop-blur-sm">
            <CardContent className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </CardContent>
          </Card>
        )}

        {!loading && noticias.length === 0 && (
          <Card className="border-0 bg-card/70 backdrop-blur-sm">
            <CardContent className="py-8 text-center text-muted-foreground">
              No se encontraron noticias.
            </CardContent>
          </Card>
        )}

        {noticias.map((noticia) => (
          <Card key={noticia.id} className="border-0 bg-card/70 backdrop-blur-sm hover:bg-card/90 transition-colors">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-lg line-clamp-2 text-balance">{noticia.title}</h3>
                    <Badge variant="secondary" className="flex-shrink-0 text-xs">
                      {noticia.category || "General"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{noticia.content}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>📰 {noticia.source}</span>
                  {noticia.published_at && (
                    <span>
                      {new Date(noticia.published_at).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Leer (+1)
                  </Button>

                  <Button
                    size="sm"
                    variant={saved.has(noticia.id) ? "default" : "outline"}
                    onClick={() => handleSave(noticia.id)}
                    className="text-xs"
                  >
                    <Bookmark
                      className={`w-3 h-3 mr-1 ${saved.has(noticia.id) ? "fill-current" : ""}`}
                    />
                    Guardar
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShare(noticia.id, noticia.title)}
                    className="text-xs"
                  >
                    <Share2 className="w-3 h-3 mr-1" />
                    Compartir (+2)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {!searchQuery && totalPages > 1 && (
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            size="sm"
          >
            ← Anterior
          </Button>

          <div className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </div>

          <Button
            variant="outline"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            size="sm"
          >
            Siguiente →
          </Button>
        </div>
      )}
    </div>
  )
}
