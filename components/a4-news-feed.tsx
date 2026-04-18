"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp, Search, Bookmark, Share2, Calendar, Tag, Eye, MessageCircle, ArrowRight } from "lucide-react"
import { markNewsAsRead, toggleSaveNews, trackA4Engagement } from "@/lib/supabase/a4-queries"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"

interface NewsItem {
  id: string
  title: string
  content: string
  category: string
  relevance_score: number
  source: string
  published_at: string
  created_at: string
}

interface A4NewsFeedProps {
  items: NewsItem[]
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, { badge: string; bg: string }> = {
    "Mercado Laboral": { badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", bg: "bg-blue-50/50" },
    "Industrias": { badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300", bg: "bg-purple-50/50" },
    "Economía": { badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", bg: "bg-green-50/50" },
    "Tendencias": { badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300", bg: "bg-orange-50/50" },
    "Tech": { badge: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300", bg: "bg-cyan-50/50" },
    "Finanzas": { badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300", bg: "bg-yellow-50/50" },
  }
  return colors[category] || { badge: "bg-muted/10 text-gray-800 dark:bg-muted/90/30 dark:text-muted/30", bg: "bg-muted/5/50" }
}

const getRelevanceIcon = (score: number) => {
  if (score >= 80) return "🔥"
  if (score >= 60) return "📈"
  if (score >= 40) return "📰"
  return "💡"
}

const getRelevanceBadge = (score: number) => {
  if (score >= 80) return { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300", label: "Crítico" }
  if (score >= 60) return { color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300", label: "Alto" }
  if (score >= 40) return { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", label: "Medio" }
  return { color: "bg-muted/10 text-gray-800 dark:bg-muted/90/30 dark:text-muted/30", label: "Bajo" }
}

export function A4NewsFeed({ items }: A4NewsFeedProps) {
  const { user } = useAuthRedirect()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(items.map(item => item.category))]

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (date.toDateString() === today.toDateString()) return "Hoy"
      if (date.toDateString() === yesterday.toDateString()) return "Ayer"
      return date.toLocaleDateString("es-CL", { month: "short", day: "numeric" })
    } catch {
      return "Fecha desconocida"
    }
  }

  const handleSave = async (itemId: string) => {
    if (!user) return
    
    const newState = !savedItems.has(itemId)
    setSavedItems(prev => {
      const newSet = new Set(prev)
      if (newState) {
        newSet.add(itemId)
      } else {
        newSet.delete(itemId)
      }
      return newSet
    })
    
    await toggleSaveNews(user.id, itemId, newState)
    await trackA4Engagement(user.id, "save_news", { completed: true, metadata: { news_id: itemId } })
  }

  const handleNewsClick = async (itemId: string) => {
    if (!user) return
    await markNewsAsRead(user.id, itemId)
    await trackA4Engagement(user.id, "view_news", { completed: true, metadata: { news_id: itemId } })
  }

  const relevanceBadge = (score: number) => getRelevanceBadge(score)

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[28px] bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xl">
            {getRelevanceIcon(75)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">Noticias del Mercado Laboral</h2>
            <p className="text-sm text-muted-foreground">
              Tendencias, oportunidades y contexto sobre el mercado laboral chileno
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-muted/30 border-0">
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
              Todas ({items.length})
            </Button>
            {categories.map(cat => {
              const count = items.filter(i => i.category === cat).length
              return (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat} ({count})
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* News List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Noticias ({filteredItems.length})
          </h3>
          <Badge variant="outline" className="text-xs">
            Ordenadas por relevancia
          </Badge>
        </div>
        
        <div className="space-y-3">
          {filteredItems.length > 0 ? (
            filteredItems.sort((a, b) => b.relevance_score - a.relevance_score).map(item => {
              const catColor = getCategoryColor(item.category)
              const relBadge = relevanceBadge(item.relevance_score)
              
              return (
                <Card
                  key={item.id}
                  className={`hover:shadow-md transition-all cursor-pointer group border-l-4 ${catColor.bg} hover:border-l-primary`}
                  onClick={() => handleNewsClick(item.id)}
                >
                  <CardContent className="py-4">
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        {/* Top Row: Title and Relevance */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="font-semibold group-hover:text-purple transition text-base">
                              {item.title}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
                              {item.content.substring(0, 150)}...
                            </div>
                          </div>
                          <span className="text-3xl flex-shrink-0 opacity-70 group-hover:opacity-100">
                            {getRelevanceIcon(item.relevance_score)}
                          </span>
                        </div>

                        {/* Badges Row */}
                        <div className="flex items-center gap-2 flex-wrap pt-2">
                          <Badge className={`${catColor.badge} text-xs font-medium`}>
                            {item.category}
                          </Badge>
                          <Badge className={`${relBadge.color} text-xs font-medium`}>
                            {relBadge.label} ({Math.round(item.relevance_score)}%)
                          </Badge>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {mounted && formatDate(item.published_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {item.source}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSave(item.id)
                          }}
                        >
                          <Bookmark
                            className={`w-4 h-4 ${
                              savedItems.has(item.id)
                                ? "fill-primary text-purple"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                          <Share2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-purple" 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleNewsClick(item.id)
                          }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
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

      {/* Footer Stats */}
      <div className="grid grid-cols-3 gap-4 py-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-0">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{items.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Noticias disponibles</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border-0">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{savedItems.size}</div>
            <p className="text-xs text-muted-foreground mt-1">Guardadas</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-0">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-green-600">{categories.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Categorías</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default A4NewsFeed
