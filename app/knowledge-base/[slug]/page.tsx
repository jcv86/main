"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, Share2, BookOpen, FileCode, GraduationCap, Library } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
  slug: string
  icon: string
}

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  is_featured: boolean
  category: Category
  created_at: string
}

interface RelatedArticle {
  id: string
  title: string
  slug: string
  excerpt: string
}

const iconMap = {
  FileCode,
  BookOpen,
  GraduationCap,
  Library,
}

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.slug) {
      fetchArticle(params.slug as string)
    }
  }, [params.slug])

  const fetchArticle = async (slug: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/knowledge-base/${slug}`)

      if (!response.ok) {
        throw new Error("Article not found")
      }

      const data = await response.json()
      setArticle(data.article)
      setRelatedArticles(data.relatedArticles || [])
    } catch (error) {
      console.error("Error fetching article:", error)
      setError("No se pudo cargar el artículo")
    } finally {
      setLoading(false)
    }
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(" ").length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const IconComponent = ({ iconName }: { iconName: string }) => {
    const Icon = iconMap[iconName as keyof typeof iconMap] || BookOpen
    return <Icon className="h-5 w-5" />
  }

  const shareArticle = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You could show a toast here
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-24 mb-6"></div>
          <div className="h-12 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-muted rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Artículo no encontrado</h3>
            <p className="text-muted-foreground mb-4">El artículo que buscas no existe o ha sido movido.</p>
            <Link href="/knowledge-base">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a la base de conocimiento
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-6">
        <Link href="/knowledge-base">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la base de conocimiento
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <IconComponent iconName={article.category.icon} />
          <Badge variant="secondary">{article.category.name}</Badge>
          {article.is_featured && <Badge variant="default">Destacado</Badge>}
        </div>

        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

        <p className="text-xl text-muted-foreground mb-6">{article.excerpt}</p>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{getReadingTime(article.content)} min lectura</span>
          </div>
          <span>Actualizado: {formatDate(article.created_at)}</span>
          <Button variant="ghost" size="sm" onClick={shareArticle}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="prose prose-lg max-w-none p-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: article.content.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Artículos Relacionados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedArticles.map((relatedArticle) => (
                  <div key={relatedArticle.id}>
                    <Link
                      href={`/knowledge-base/${relatedArticle.slug}`}
                      className="block hover:text-primary transition-colors"
                    >
                      <h4 className="font-medium line-clamp-2 mb-1">{relatedArticle.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{relatedArticle.excerpt}</p>
                    </Link>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  Ir al Dashboard
                </Button>
              </Link>
              <Link href="/career-coach">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  Consultar Coach IA
                </Button>
              </Link>
              <Link href="/library">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  Explorar Biblioteca
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
