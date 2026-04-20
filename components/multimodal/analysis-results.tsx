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
      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue" />
          <div className="text-center">
            <p className="font-semibold">Analyzing your interview...</p>
            <p className="text-sm text-muted-foreground">This may take 2-5 minutes</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Analysis not available yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="border-2 border-blue/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tu Puntuación General</span>
            <Badge className="bg-blue">{analysis.overall_score}/100</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={analysis.overall_score} className="h-3" />
        </CardContent>
      </Card>

      {/* Visual Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Análisis Visual</CardTitle>
          <CardDescription>Postura, contacto visual, gestos y expresiones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background">
              <p className="text-sm text-muted-foreground mb-2">Postura</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{analysis.visual_analysis.posture_quality}</span>
                <span className="text-muted-foreground">/100</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{analysis.visual_analysis.posture_feedback}</p>
            </div>

            <div className="bg-background">
              <p className="text-sm text-muted-foreground mb-2">Contacto Visual</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{analysis.visual_analysis.eye_contact}</span>
                <span className="text-muted-foreground">/100</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{analysis.visual_analysis.eye_contact_feedback}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Análisis de Audio</CardTitle>
          <CardDescription>Tono, claridad, velocidad y confianza</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background">
              <p className="text-sm text-muted-foreground mb-2">Tono & Claridad</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">
                  {Math.round((analysis.audio_analysis.tone_quality + analysis.audio_analysis.clarity) / 2)}
                </span>
                <span className="text-muted-foreground">/100</span>
              </div>
            </div>

            <div className="bg-background">
              <p className="text-sm text-muted-foreground mb-2">Confianza</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{analysis.audio_analysis.confidence_level}</span>
                <span className="text-muted-foreground">/100</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Velocidad del Habla</p>
              <p className="font-semibold">{analysis.audio_analysis.speech_pace} PPM</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Palabras de Relleno</p>
              <p className="font-semibold">{analysis.audio_analysis.filler_words}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coherence */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Coherencia (Visual + Audio)</CardTitle>
          <CardDescription>Alineación entre lenguaje verbal y corporal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-muted/5 rounded-lg">
            <span className="text-sm font-medium">Alineación Visual-Audio</span>
            <Badge className="bg-yellow">{analysis.coherence_analysis.visual_audio_alignment}%</Badge>
          </div>
          <p className="text-sm text-muted">{analysis.coherence_analysis.message_consistency}</p>
        </CardContent>
      </Card>

      {/* Key Strengths */}
      <Card className="border-2 border-green/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green">
            <CheckCircle2 className="w-5 h-5" />
            Fortalezas Principales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.key_strengths.map((strength: string, i: number) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-green font-bold">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Areas for Improvement */}
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

      {/* Personalized Recommendations */}
      <Card className="border-2 border-blue/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue">
            <TrendingUp className="w-5 h-5" />
            Recomendaciones Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {analysis.personalized_recommendations.map((rec: string, i: number) => (
            <div key={i} className="flex gap-3 p-3 bg-blue/5 rounded-lg">
              <span className="font-bold text-blue flex-shrink-0">{i + 1}.</span>
              <p className="text-sm text-muted">{rec}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Detailed Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Feedback Detallado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted leading-relaxed">{analysis.detailed_feedback}</p>
        </CardContent>
      </Card>
    </div>
  )
}
