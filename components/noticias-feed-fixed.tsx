'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, Bookmark, Share2, ExternalLink } from 'lucide-react'

interface Noticia {
  id: string
  title: string
  description: string
  category: string
  relevance: number
  source: string
  url: string
  timestamp: string
}

export function NoticiasFeed() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas')

  const categories = ['Todas', 'Tecnología', 'Mercado Local', 'Liderazgo', 'Educación', 'Oportunidades']

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        setLoading(true)
        setError(null)
        const categoryParam = selectedCategory !== 'Todas' ? `&category=${selectedCategory}` : ''
        const url = `/api/noticias/feed?limit=10${categoryParam}&minRelevance=80`
        console.log('[v0] Fetching noticias from:', url)
        
        const response = await fetch(url)
        console.log('[v0] Response status:', response.status)
        
        if (!response.ok) throw new Error(`API error: ${response.status}`)
        
        const result = await response.json()
        console.log('[v0] Noticias fetched from DB:', result.data?.length || 0, 'items')
        console.log('[v0] Source:', result.source)
        
        let noticiasData = result.data || []
        
        // If we don't have enough noticias from DB, supplement with RSS
        if (noticiasData.length < 5) {
          console.log('[v0] Not enough noticias from DB, fetching RSS feeds...')
          try {
            const rssResponse = await fetch('/api/noticias/rss?limit=10')
            if (rssResponse.ok) {
              const rssResult = await rssResponse.json()
              console.log('[v0] RSS feed items fetched:', rssResult.data?.length || 0)
              noticiasData = [...noticiasData, ...(rssResult.data || [])]
            }
          } catch (rssError) {
            console.warn('[v0] RSS feed fetch failed, using DB results only:', rssError)
          }
        }
        
        // Remove duplicates by title and URL (more robust deduplication)
        const seenTitles = new Set()
        const seenUrls = new Set()
        noticiasData = noticiasData.filter(n => {
          // Normalize title for comparison
          const normalizedTitle = n.title?.toLowerCase().trim() || ''
          const normalizedUrl = n.url?.toLowerCase().trim() || ''
          
          // Check if title or URL already seen
          if (seenTitles.has(normalizedTitle) || seenUrls.has(normalizedUrl)) {
            console.log('[v0] Duplicate removed:', n.title)
            return false
          }
          
          seenTitles.add(normalizedTitle)
          seenUrls.add(normalizedUrl)
          return true
        }).slice(0, 10)
        
        setNoticias(noticiasData)
      } catch (err) {
        console.error('[v0] Error fetching noticias:', err)
        setError('No se pudieron cargar las noticias')
        setNoticias([])
      } finally {
        setLoading(false)
      }
    }

    fetchNoticias()
  }, [selectedCategory])

  const handleSave = (id: string) => {
    const newSaved = new Set(saved)
    if (newSaved.has(id)) {
      newSaved.delete(id)
    } else {
      newSaved.add(id)
    }
    setSaved(newSaved)
  }

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return 'bg-red/10 text-red dark:bg-red/30 dark:text-red/30'
    if (score >= 80) return 'bg-orange/10 text-orange dark:bg-orange/30 dark:text-orange/30'
    if (score >= 70) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
    return 'bg-yellow/10 text-yellow dark:bg-yellow/30 dark:text-yellow-200'
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Tecnología': 'bg-blue/10 text-blue dark:bg-blue/30 dark:text-blue-200',
      'Liderazgo': 'bg-purple/10 text-purple dark:bg-purple/30 dark:text-purple-200',
      'Mercado Local': 'bg-green/10 text-green dark:bg-green/30 dark:text-green/30',
      'Educación': 'bg-blue/10 text-blue dark:bg-blue/30 dark:text-indigo-300',
      'Oportunidades': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    }
    return colors[category] || 'bg-muted/10 text-secondary dark:bg-transparent/30 dark:text-white/85'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={selectedCategory === cat ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? 'bg-cyan hover:bg-cyan' : ''}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red/10 dark:bg-red/30 text-red dark:text-red/30 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* News Cards */}
      {noticias.map((noticia) => (
        <Card
          key={noticia.id}
          className="border-l-4 border-l-cyan-500 hover:shadow-lg transition-all duration-300 dark:hover:bg-muted/80/50"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex gap-2">
                <Badge className={getRelevanceColor(noticia.relevance)}>
                  {noticia.relevance}% Relevancia
                </Badge>
                <Badge className={getCategoryColor(noticia.category)} variant="outline">
                  {noticia.category}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleSave(noticia.id)}
                  className={saved.has(noticia.id) ? 'text-cyan' : ''}
                >
                  <Bookmark className={`w-4 h-4 ${saved.has(noticia.id) ? 'fill-current' : ''}`} />
                </Button>
                <Button size="sm" variant="ghost" asChild>
                  <a href={noticia.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-2 text-muted/90 dark:text-muted/10">
              {noticia.title}
            </h3>
            <p className="text-muted-foreground dark:text-white/85 mb-3">
              {noticia.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {noticia.source} • {noticia.timestamp}
              </div>
              <Button 
                size="sm" 
                className="bg-cyan hover:bg-cyan"
                onClick={() => window.open(noticia.url, '_blank')}
              >
                Leer Más
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {noticias.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground dark:text-muted-foreground">No hay noticias disponibles en este momento</p>
        </div>
      )}
    </div>
  )
}
