'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Loader2, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react'

interface AnalysisResultsProps {
  sessionId: string
}

export function AnalysisResults({ sessionId }: AnalysisResultsProps) {
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState<any>(null)
  const [status, setStatus] = useState('pending')

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/multimodal/status?sessionId=${sessionId}`)
        if (!response.ok) {
          console.error('[v0] Status API error:', response.status, response.statusText)
          setLoading(false)
          return
        }
        const data = await response.json()

        setStatus(data.status)
        if (data.analysis) {
          setAnalysis(data.analysis)
          setLoading(false)
        } else if (data.status === 'completed') {
          setLoading(false)
        }
      } catch (error) {
        console.error('[v0] Error checking status:', error)
      }
    }

    const interval = setInterval(checkStatus, 3000)
    checkStatus()

    return () => clearInterval(interval)
  }, [sessionId])

  if (loading) {
    return (
      <Card className="border-training/20">
        <CardContent className="pt-6 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-training" />
          <div className="text-center">
            <p className="font-bold">Analizando tu entrevista...</p>
            <p className="text-sm text-muted-foreground">Esto puede tomar 2-5 minutos</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card className="border-training/20">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">El análisis no está disponible aún</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Score - Training color */}
      <Card className="border-2 border-training/30 bg-gradient-to-r from-training/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tu Puntuación General</span>
            <Badge className="bg-training text-white font-bold">{analysis.overall_score}/100</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={analysis.overall_score} className="h-3" />
        </CardContent>
      </Card>

      {/* Visual Analysis - Ritual color accents */}
      <Card className="border-training/20">
        <CardHeader>
          <CardTitle className="text-lg text-training">Análisis Visual</CardTitle>
          <CardDescription>Postura, contacto visual, gestos y expresiones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-training/5 border border-training/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Postura</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-training">{analysis.visual_analysis.posture_quality}</span>
                <span className="text-muted-foreground">/100</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{analysis.visual_analysis.posture_feedback}</p>
            </div>

            <div className="bg-training/5 border border-training/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Contacto Visual</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-training">{analysis.visual_analysis.eye_contact}</span>
                <span className="text-muted-foreground">/100</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{analysis.visual_analysis.eye_contact_feedback}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio Analysis - Ritual color accents */}
      <Card className="border-training/20">
        <CardHeader>
          <CardTitle className="text-lg text-training">Análisis de Audio</CardTitle>
          <CardDescription>Tono, claridad, velocidad y confianza</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-training/5 border border-training/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Tono & Claridad</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-training">
                  {Math.round((analysis.audio_analysis.tone_quality + analysis.audio_analysis.clarity) / 2)}
                </span>
                <span className="text-muted-foreground">/100</span>
              </div>
            </div>

            <div className="bg-training/5 border border-training/10 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Confianza</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-training">{analysis.audio_analysis.confidence_level}</span>
                <span className="text-muted-foreground">/100</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm border-t border-border/30 pt-4">
            <div>
              <p className="text-muted-foreground mb-1 font-medium">Velocidad del Habla</p>
              <p className="font-bold text-training">{analysis.audio_analysis.speech_pace} PPM</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 font-medium">Palabras de Relleno</p>
              <p className="font-bold text-training">{analysis.audio_analysis.filler_words}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coherence - Ritual color */}
      <Card className="border-training/20">
        <CardHeader>
          <CardTitle className="text-lg text-training">Coherencia (Visual + Audio)</CardTitle>
          <CardDescription>Alineación entre lenguaje verbal y corporal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-training/5 border border-training/10 rounded-lg">
            <span className="text-sm font-bold">Alineación Visual-Audio</span>
            <Badge className="bg-training text-white font-bold">{analysis.coherence_analysis.visual_audio_alignment}%</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{analysis.coherence_analysis.message_consistency}</p>
        </CardContent>
      </Card>

      {/* Key Strengths - Ritual accent */}
      <Card className="border-2 border-training/30 bg-training/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-training">
            <CheckCircle2 className="w-5 h-5" />
            Fortalezas Principales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.key_strengths.map((strength: string, i: number) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-training font-bold">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Areas for Improvement - Orange accent */}
      <Card className="border-2 border-orange/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange">
            <AlertCircle className="w-5 h-5" />
            Áreas a Mejorar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.areas_for_improvement.map((area: string, i: number) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-orange font-bold">•</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Personalized Recommendations - Ritual color */}
      <Card className="border-2 border-training/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-training">
            <TrendingUp className="w-5 h-5" />
            Recomendaciones Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {analysis.personalized_recommendations.map((rec: string, i: number) => (
            <div key={i} className="flex gap-3 p-3 bg-training/5 border border-training/10 rounded-lg">
              <span className="font-bold text-training flex-shrink-0">{i + 1}.</span>
              <p className="text-sm text-muted-foreground">{rec}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Detailed Feedback */}
      <Card className="border-training/20">
        <CardHeader>
          <CardTitle className="text-lg text-training">Feedback Detallado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{analysis.detailed_feedback}</p>
        </CardContent>
      </Card>
    </div>
  )
}
