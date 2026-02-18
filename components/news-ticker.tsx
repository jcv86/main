'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  url: string
}

export function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch('/api/despega/a4-news-feed?limit=5')
        if (response.ok) {
          const result = await response.json()
          if (result.data && result.data.length > 0) {
            const formattedNews = result.data.slice(0, 3).map((article: any) => ({
              id: article.id || article.url,
              title: article.title,
              url: article.url,
            }))
            setNews(formattedNews)
          }
        }
      } catch (error) {
        console.error('[v0] Error loading news ticker:', error)
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [])

  // Cambiar noticia cada 8 segundos (estático)
  useEffect(() => {
    if (news.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [news.length])

  if (loading || news.length === 0) {
    return null
  }

  const currentNews = news[currentIndex]

  return (
    <div className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white border-b border-slate-700">
      <div className="flex items-center gap-4 px-6 py-3 h-14 max-w-7xl mx-auto">
        {/* Label */}
        <div className="flex items-center gap-2 flex-shrink-0 font-semibold whitespace-nowrap text-sm">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <span className="text-slate-300">MERCADO</span>
        </div>
        
        {/* Noticia actual - estática */}
        <div className="flex-1 min-w-0">
          <Link
            href={currentNews.url || '/despega/a4/noticias'}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-slate-100 hover:text-blue-400 transition-colors text-sm line-clamp-2 leading-snug"
          >
            {currentNews.title}
          </Link>
        </div>

        {/* Indicadores */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex gap-1">
            {news.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-blue-400 w-3' : 'bg-slate-600 hover:bg-slate-500'
                }`}
                aria-label={`Go to news ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Link a todas las noticias */}
        <Link
          href="/despega/a4/noticias"
          className="flex-shrink-0 text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors whitespace-nowrap"
        >
          Ver todas →
        </Link>
      </div>
    </div>
  )
}
