'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ArrowLeft, Search, Bookmark, BookmarkCheck, TrendingUp } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export default function A4NoticiasPage() {
  const [loading, setLoading] = useState(true)
  const [news, setNews] = useState<any[]>([])
  const [filteredNews, setFilteredNews] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set())
  const supabase = createClient()

  useEffect(() => {
    loadNews()
  }, [])

  useEffect(() => {
    filterNews()
  }, [searchQuery, news])

  const loadNews = async () => {
    const { data } = await supabase
      .from('biblioteca')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(30)

    if (data) {
      setNews(data)
      setFilteredNews(data)
    }
    setLoading(false)
  }

  const filterNews = () => {
    if (!searchQuery) {
      setFilteredNews(news)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = news.filter(item =>
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.key_topics?.some((t: string) => t.toLowerCase().includes(query))
    )
    setFilteredNews(filtered)
  }

  const toggleSave = (itemId: string) => {
    setSavedItems(prev => {
      const newSet = new Set(prev)
      newSet.has(itemId) ? newSet.delete(itemId) : newSet.add(itemId)
      return newSet
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/despega/a4" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver a A4
          </Link>
          <div className="flex items-start gap-4 mb-8">
            <div className="p-3 bg-primary/10 rounded-lg">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Noticias del Mercado</h1>
              <p className="text-muted-foreground">Tendencias, cambios industriales y oportunidades emergentes en tiempo real</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar noticias, industrias, tendencias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No hay noticias que coincidan con tu búsqueda</p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Limpiar búsqueda
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredNews.map((item) => (
              <Card key={item.id} className="group border-0 bg-card/70 hover:bg-card backdrop-blur-sm transition-all duration-300 hover:shadow-md overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Image */}
                    {item.cover_url && (
                      <div className="hidden md:block flex-shrink-0">
                        <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={item.cover_url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.category && (
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                        )}
                        {item.difficulty && (
                          <Badge variant="outline" className="text-xs">
                            {item.difficulty}
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      {item.key_topics && item.key_topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.key_topics.slice(0, 3).map((topic: string, idx: number) => (
                            <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {item.created_at && formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: es })}
                        </span>
                        <div className="flex gap-2">
                          {item.url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="text-primary hover:text-primary"
                            >
                              <a href={item.url} target="_blank" rel="noopener noreferrer">
                                Leer más
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSave(item.id)}
                            className="w-10 h-10 p-0"
                          >
                            {savedItems.has(item.id) ? (
                              <BookmarkCheck className="w-5 h-5 text-primary fill-primary" />
                            ) : (
                              <Bookmark className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
