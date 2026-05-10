'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Share2, Eye, TrendingUp, AlertCircle, Zap } from 'lucide-react'

interface NewsAnalysis {
  id: string
  titulo: string
  excerpt: string
  source: string
  published_at: string
  categoria: string
  relevance_score: number
  delta_estrategico: string
  capa_2_delta: string
  capa_3_nivel_energia: string
  capa_4_descuento_mercado: string
  capa_5_tension_narrativa: string
  capa_6_ritmo_narrativo: string
  capa_7_impacto_plazo: string
  weak_signals?: string[]
}

interface Props {
  news: NewsAnalysis
  onEngagement?: (type: 'read' | 'save' | 'share', newsId: string) => void
}

export function A4NewsCard7Layers({ news, onEngagement }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(!isSaved)
    onEngagement?.('save', news.id)
  }

  const handleShare = () => {
    onEngagement?.('share', news.id)
    if (navigator.share) {
      navigator.share({
        title: news.titulo,
        text: news.excerpt,
        url: window.location.href,
      })
    }
  }

  const handleRead = () => {
    setExpanded(!expanded)
    onEngagement?.('read', news.id)
  }

  const getRelevanceColor = (score: number) => {
    if (score >= 8) return 'bg-red/50/20 text-red dark:text-red/40 border-red/30'
    if (score >= 6) return 'bg-orange/50/20 text-orange dark:text-orange/40 border-orange/30'
    if (score >= 4) return 'bg-orange/20 text-yellow dark:text-yellow/40 border-yellow/30'
    return 'bg-blue/50/20 text-blue dark:text-blue/40 border-blue/30'
  }

  const getCategoryEmoji = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'mercado laboral': return ''
      case 'industrias': return '🏭'
      case 'economía': return ''
      case 'tendencias globales': return '🌍'
      default: return '📰'
    }
  }

  return (
    <Card className={`border-0 bg-card/70 backdrop-blur-sm hover:shadow-md transition-all ${expanded ? 'ring-1 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {getCategoryEmoji(news.categoria)} {news.categoria}
                </Badge>
                <Badge className={`text-xs font-bold ${getRelevanceColor(news.relevance_score)}`}>
                  {news.relevance_score}/10
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-balance leading-tight">{news.titulo}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">{news.source}</span>
            <span>•</span>
            <span>{new Date(news.published_at).toLocaleDateString('es-CL')}</span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{news.excerpt}</p>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          <div className="border-t pt-4 space-y-3">
            {/* Capa 1: Qué cambió */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-purple flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                Capa 1: Qué cambió
              </h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">{news.delta_estrategico}</p>
            </div>

            {/* Capa 2: Impacto Delta */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-purple flex items-center gap-2">
                <AlertCircle className="w-3 h-3" />
                Capa 2: Impacto potencial
              </h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">{news.capa_2_delta}</p>
            </div>

            {/* Capa 3: Nivel de Energía */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-purple flex items-center gap-2">
                <Zap className="w-3 h-3" />
                Capa 3: Nivel de energía
              </h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">{news.capa_3_nivel_energia}</p>
            </div>

            {/* Capa 4: Descuento Mercado */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-purple">Capa 4: Descuento del mercado</h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">{news.capa_4_descuento_mercado}</p>
            </div>

            {/* Capa 5: Tensión Narrativa */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-purple">Capa 5: Tensión narrativa</h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">{news.capa_5_tension_narrativa}</p>
            </div>

            {/* Capa 6: Ritmo Narrativo */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-purple">Capa 6: Ritmo narrativo</h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">{news.capa_6_ritmo_narrativo}</p>
            </div>

            {/* Capa 7: Impacto Plazo */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-purple">Capa 7: Impacto a plazo</h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">{news.capa_7_impacto_plazo}</p>
            </div>

            {/* Weak Signals */}
            {news.weak_signals && news.weak_signals.length > 0 && (
              <div className="space-y-2 border-t pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wide text-amber-600">Señales débiles emergentes</h4>
                <div className="flex flex-wrap gap-1">
                  {news.weak_signals.map((signal, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {signal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}

      <div className="flex items-center justify-between px-4 py-3 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRead}
          className="text-xs"
        >
          <Eye className="w-4 h-4 mr-1" />
          {expanded ? 'Colapsar' : 'Ver análisis'}
        </Button>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className={isSaved ? 'text-red' : ''}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
