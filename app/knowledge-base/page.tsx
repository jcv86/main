"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, BookOpen, FileCode, GraduationCap, Library, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  articles: { count: number }[]
}

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  is_featured: boolean
  category: Category
  created_at: string
}

const iconMap = {
  FileCode,
  BookOpen,
  GraduationCap,
  Library,
}

export default function KnowledgeBasePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchArticles()
  }, [])

  useEffect(() => {
    if (searchTerm || selectedCategory) {
      searchArticles()
    } else {
      fetchArticles()
    }
  }, [searchTerm, selectedCategory])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/knowledge-base/categories")
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/knowledge-base")
      const data = await response.json()
      const allArticles = data.articles || []
      setArticles(allArticles)
      setFeaturedArticles(allArticles.filter((article: Article) => article.is_featured))
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setLoading(false)
    }
  }

  const searchArticles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (selectedCategory) params.append("category", selectedCategory)

      const response = await fetch(`/api/knowledge-base?${params}`)
      const data = await response.json()
      setArticles(data.articles || [])
    } catch (error) {
      console.error("Error searching articles:", error)
    } finally {
      setLoading(false)
    }
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(" ").length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const IconComponent = ({ iconName }: { iconName: string }) => {
    const Icon = iconMap[iconName as keyof typeof iconMap] || BookOpen
    return <Icon className="h-6 w-6" />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Base de Conocimiento</h1>
        <p className="text-xl text-muted-foreground">Recursos, guías y documentación para tu desarrollo profesional</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar en la base de conocimiento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Todas las categorías
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.slug ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.slug)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Articles */}
      {!searchTerm && !selectedCategory && featuredArticles.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Artículos Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent iconName={article.category.icon} />
                    <Badge variant="secondary">{article.category.name}</Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{article.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{getReadingTime(article.excerpt)} min lectura</span>
                    </div>
                    <Link href={`/knowledge-base/${article.slug}`}>
                      <Button size="sm">
                        Leer más
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Categories Overview */}
      {!searchTerm && !selectedCategory && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Explorar por Categoría</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent iconName={category.icon} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription>{category.articles?.[0]?.count || 0} artículos</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => setSelectedCategory(category.slug)}
                  >
                    Explorar categoría
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Articles List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {selectedCategory
              ? `${categories.find((c) => c.slug === selectedCategory)?.name || "Categoría"}`
              : searchTerm
                ? `Resultados para "${searchTerm}"`
                : "Todos los Artículos"}
          </h2>
          {(searchTerm || selectedCategory) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory(null)
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-24"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent iconName={article.category.icon} />
                    <Badge variant="secondary">{article.category.name}</Badge>
                    {article.is_featured && <Badge variant="default">Destacado</Badge>}
                  </div>
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{article.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{getReadingTime(article.excerpt)} min lectura</span>
                    </div>
                    <Link href={`/knowledge-base/${article.slug}`}>
                      <Button size="sm">
                        Leer más
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron artículos</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory
                  ? "Intenta con otros términos de búsqueda o explora diferentes categorías."
                  : "Aún no hay artículos disponibles en la base de conocimiento."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
