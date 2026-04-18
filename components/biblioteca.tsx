"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, ExternalLink, Filter, BookOpen } from "lucide-react"
import {
  getBibliotecaResources,
  getBibliotecaCategories,
  saveResource,
  getUserSavedResources,
} from "@/lib/supabase/a4-queries"
import { useSession } from "@/components/session-wrapper"

export function Biblioteca() {
  const { user } = useSession()
  const [resources, setResources] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
    loadSavedResources()
  }, [])

  useEffect(() => {
    loadResources()
  }, [selectedCategory])

  const loadCategories = async () => {
    try {
      const cats = await getBibliotecaCategories()
      setCategories(cats)
    } catch (error) {
      console.error("[v0] Error loading categories:", error)
    }
  }

  const loadSavedResources = async () => {
    if (!user?.email) return
    try {
      const savedRes = await getUserSavedResources(user.email)
      const savedIds: Set<string> = new Set(savedRes.map((r) => r.resource_id as string))
      setSaved(savedIds)
    } catch (error) {
      console.error("[v0] Error loading saved resources:", error)
    }
  }

  const loadResources = async () => {
    setLoading(true)
    try {
      const res = await getBibliotecaResources(selectedCategory || undefined, undefined, 50)
      setResources(res)
    } catch (error) {
      console.error("[v0] Error loading resources:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (resourceId: string, resourceType: string) => {
    if (!user?.email) return

    const newSaved = new Set(saved)
    if (newSaved.has(resourceId)) {
      newSaved.delete(resourceId)
    } else {
      newSaved.add(resourceId)
      await saveResource(user.email, resourceId, resourceType)
    }
    setSaved(newSaved)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-0 bg-gradient-to-br from-blue-500/5 to-blue-500/10 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue dark:text-blue/40" />
            </div>
            <div>
              <CardTitle>Biblioteca Curada</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Recursos verificados para complementar tu aprendizaje
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Category Filter */}
      {categories.length > 0 && (
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-3 py-1 rounded-[20px] text-sm transition-colors ${
                  selectedCategory === ""
                    ? "bg-purple text-purple-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Todos
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-[20px] text-sm transition-colors ${
                    selectedCategory === category
                      ? "bg-purple text-purple-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {loading && (
          <Card className="col-span-full border-0 bg-card/70 backdrop-blur-sm">
            <CardContent className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
            </CardContent>
          </Card>
        )}

        {!loading && resources.length === 0 && (
          <Card className="col-span-full border-0 bg-card/70 backdrop-blur-sm">
            <CardContent className="py-8 text-center text-muted-foreground">
              No se encontraron recursos en esta categoría.
            </CardContent>
          </Card>
        )}

        {resources.map((resource) => (
          <Card key={resource.id} className="border-0 bg-card/70 backdrop-blur-sm hover:bg-card/90 transition-colors flex flex-col">
            <CardContent className="pt-6 flex-1 flex flex-col">
              <div className="flex-1 space-y-3 mb-4">
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="font-semibold text-sm line-clamp-2 text-balance flex-1">{resource.title}</h3>
                    <Badge variant="secondary" className="text-xs flex-shrink-0 mt-0.5">
                      {resource.type || "Recurso"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3">{resource.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {resource.tags?.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {resource.author && (
                  <p className="text-xs text-muted-foreground">Por: {resource.author}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(resource.url, "_blank")}
                  className="flex-1 text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Acceder
                </Button>

                <Button
                  size="sm"
                  variant={saved.has(resource.id) ? "default" : "outline"}
                  onClick={() => handleSave(resource.id, resource.type)}
                  className="text-xs px-3"
                >
                  <Bookmark
                    className={`w-3 h-3 ${saved.has(resource.id) ? "fill-current" : ""}`}
                  />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
