'use client'

import { useEffect, useState } from 'react'
import { RadarEstrategico } from '@/components/radar-estrategico-system'
import { getPersonalizedRadarData } from '@/lib/linkedin/radar-personalization'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, AlertCircle } from 'lucide-react'

interface PersonalizationData {
  user_id: string
  industry: string
  seniority_level: string
  headline: string
  user_skills: string[]
  market_trending_skills: string[]
  skills_gap: string[]
  total_market_jobs: number
  relevant_companies: string[]
}

export function PersonalizedRadarSystem() {
  const [personalization, setPersonalization] = useState<PersonalizationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPersonalization()
  }, [])

  const loadPersonalization = async () => {
    try {
      setLoading(true)
      const data = await getPersonalizedRadarData()
      
      if (data) {
        setPersonalization(data)
        console.log('[v0] Personalization loaded:', data.industry)
      } else {
        console.log('[v0] No personalization data, using default radar')
        setError('Sincroniza tu perfil de LinkedIn para personalizar tu Radar')
      }
    } catch (err) {
      console.error('[v0] Error loading personalization:', err)
      setError('Error al cargar tu perfil de LinkedIn')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-cyan/50" />
        <span className="ml-2 text-muted/40">Personalizando tu Radar...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Personalization Info Card */}
      {personalization && (
        <Card className="bg-background">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Tu Radar Personalizado</CardTitle>
                <p className="text-sm text-muted/40 mt-1">
                  Basado en: <span className="text-cyan/30 font-semibold">{personalization.headline}</span>
                </p>
              </div>
              <Badge variant="outline" className="bg-cyan/50/10 text-cyan/30 border-cyan/50/30">
                {personalization.industry}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Market Jobs Available */}
              <div className="bg-background/50 p-3 rounded-[28px] border border-muted/70/50">
                <p className="text-xs text-muted/40 mb-1">Ofertas en tu industria</p>
                <p className="text-2xl font-bold text-cyan/40">{personalization.total_market_jobs}</p>
              </div>

              {/* Skills Mastered */}
              <div className="bg-background/50 p-3 rounded-[28px] border border-muted/70/50">
                <p className="text-xs text-muted/40 mb-1">Skills dominados</p>
                <p className="text-2xl font-bold text-teal-400">{personalization.user_skills.length}</p>
              </div>

              {/* Skills to Learn */}
              <div className="bg-background/50 p-3 rounded-[28px] border border-muted/70/50">
                <p className="text-xs text-muted/40 mb-1">Skills demandados</p>
                <p className="text-2xl font-bold text-amber-400">{personalization.market_trending_skills.length}</p>
              </div>

              {/* Seniority Level */}
              <div className="bg-background/50 p-3 rounded-[28px] border border-muted/70/50">
                <p className="text-xs text-muted/40 mb-1">Nivel profesional</p>
                <p className="text-sm font-bold text-muted/30 capitalize">{personalization.seniority_level}</p>
              </div>
            </div>

            {/* Top Skills to Learn */}
            {personalization.skills_gap.length > 0 && (
              <div className="border-t border-muted/70/50 pt-4">
                <p className="text-xs text-muted/40 mb-2">Skills emergentes en tu industria:</p>
                <div className="flex flex-wrap gap-2">
                  {personalization.skills_gap.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Top Companies Hiring */}
            {personalization.relevant_companies.length > 0 && (
              <div className="border-t border-muted/70/50 pt-4">
                <p className="text-xs text-muted/40 mb-2">Top empresas contratando:</p>
                <p className="text-sm text-muted/30">
                  {personalization.relevant_companies.join(' • ')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !personalization && (
        <Card className="bg-amber-900/20 border-amber-500/30">
          <CardContent className="pt-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Radar Component with Personalization Context */}
      <RadarEstrategico personalizationContext={personalization} />
    </div>
  )
}
