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

const mockNoticias: Noticia[] = [
  {
    id: '1',
    title: 'El Futuro del Trabajo: IA y Automatización en 2026',
    description: 'Análisis de cómo la IA está transformando los roles laborales. Empresas buscan profesionales que comprendan y trabajen con IA, no contra ella.',
    category: 'Tecnología',
    relevance: 95,
    source: 'TechCrunch',
    url: '#',
    timestamp: '2 horas atrás'
  },
  {
    id: '2',
    title: 'Tendencias de Liderazgo 2026: Inteligencia Emocional + Datos',
    description: 'Los mejores líderes ahora combinan empatía con análisis de datos. El cambio de mentalidad que necesita la próxima generación de ejecutivos.',
    category: 'Liderazgo',
    relevance: 88,
    source: 'McKinsey',
    url: '#',
    timestamp: '5 horas atrás'
  },
  {
    id: '3',
    title: 'Mercado Laboral Chileno: Crecimiento en Tech y Sostenibilidad',
    description: 'Chile lidera en startups de IA en Latinoamérica. Demanda de roles en machine learning, prompt engineering, y compliance ESG.',
    category: 'Mercado Local',
    relevance: 92,
    source: 'El Mercurio',
    url: '#',
    timestamp: '1 día atrás'
  },
  {
    id: '4',
    title: 'Certificaciones Que Importan En 2026',
    description: 'Estudio: las certificaciones en IA y data literacy tienen 3x más valor que MBA tradicionales. El tiempo de capacitación se reduce a 3-6 meses.',
    category: 'Educación',
    relevance: 85,
    source: 'LinkedIn Learning',
    url: '#',
    timestamp: '2 días atrás'
  },
  {
    id: '5',
    title: 'Startups que Contratan Talento Diverso',
    description: 'Top 20 startups chilenas contratando senior profiles con mentalidad emprendedora. Roles en product, engineering, y growth disponibles.',
    category: 'Oportunidades',
    relevance: 78,
    source: 'Platanus',
    url: '#',
    timestamp: '3 días atrás'
  }
]

export function NoticiasFeed() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading from API
    const timer = setTimeout(() => {
      setNoticias(mockNoticias)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

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
    if (score >= 90) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    if (score >= 80) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    if (score >= 70) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Tecnología': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Liderazgo': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Mercado Local': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Educación': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'Oportunidades': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    }
    return colors[category] || 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {noticias.map((noticia) => (
        <Card
          key={noticia.id}
          className="border-l-4 border-l-cyan-500 hover:shadow-lg transition-all duration-300 dark:hover:bg-slate-800/50"
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
                  className={saved.has(noticia.id) ? 'text-cyan-600' : ''}
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

            <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">
              {noticia.title}
            </h3>
            <p className="text-slate-700 dark:text-slate-300 mb-3">
              {noticia.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {noticia.source} • {noticia.timestamp}
              </div>
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                Leer Más
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {noticias.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">No hay noticias disponibles en este momento</p>
        </div>
      )}
    </div>
  )
}
