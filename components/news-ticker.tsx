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

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch('/api/despega/a4-news-feed?limit=10')
        if (response.ok) {
          const result = await response.json()
          if (result.data && result.data.length > 0) {
            const formattedNews = result.data.map((article: any) => ({
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

  if (loading || news.length === 0) {
    return null
  }

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden">
      <div className="flex items-center gap-4 px-4 py-3 h-12">
        <div className="flex items-center gap-2 flex-shrink-0 font-semibold whitespace-nowrap">
          <TrendingUp className="w-4 h-4" />
          <span>NOTICIAS</span>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="inline-flex gap-8 animate-scroll whitespace-nowrap">
            {/* Duplicamos las noticias para efecto de scroll infinito */}
            {[...news, ...news].map((item, idx) => (
              <Link
                key={`${item.id}-${idx}`}
                href={item.url || '/despega/a4/noticias'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-100 transition-colors text-sm truncate"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/despega/a4/noticias"
          className="flex-shrink-0 text-sm font-semibold hover:text-blue-100 transition-colors whitespace-nowrap"
        >
          Ver Todas →
        </Link>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
