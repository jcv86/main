'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VideoRecorder } from '@/components/multimodal/video-recorder'
import { AnalysisResults } from '@/components/multimodal/analysis-results'
import { MultimodalAnalyticsDashboard } from '@/components/multimodal/analytics-dashboard'
import { AdvancedAnalyticsReporting } from '@/components/multimodal/advanced-analytics'
import { AlertCircle, Check, Zap } from 'lucide-react'
import { ModuleCompletionScreen } from '@/components/module-completion-screen'

export default function MultimodalAnalysisPage() {
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [entrenamillentoType, setEntrenamillentoType] = useState('entrevista-basica')
  const [isCompleted, setIsCompleted] = useState(false)

  const entrenamillentoTypes = [
    { id: 'entrevista-basica', label: 'Básica', desc: 'Presentación' },
    { id: 'entrevista-conductual', label: 'Conductual', desc: 'STAR' },
    { id: 'entrevista-tecnica', label: 'Técnica', desc: 'Problem-solving' },
    { id: 'presentacion-ejecutiva', label: 'Ejecutiva', desc: 'Pitch' }
  ]

  if (isCompleted) {
    return <ModuleCompletionScreen moduleId="analisis-multimodal" moduleName="Análisis Multimodal" xpEarned={120} />
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      {/* Header - Enhanced with pillar color (orange) */}
      <div className="rounded-[20px] bg-gradient-to-r from-training/10 to-training/5 border border-training/20 rounded-lg p-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-training/20 border border-training/30 flex items-center justify-center">
            <Zap className="w-6 h-6 text-training" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Análisis Multimodal
            </h1>
            <p className="text-sm text-muted-foreground">
              Feedback detallado sobre postura, tono de voz, gestos y coherencia emocional
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert - Training/Orange color */}
      {error && (
        <Card className="border-training/40 bg-training/10">
          <CardContent className="pt-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-training flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-training">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-xs text-training/70 hover:text-training mt-2 font-medium"
              >
                Descartar
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Type Selection - Better contrast with orange */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
          Tipo de Entrenamiento
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {entrenamillentoTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setEntrenamillentoType(type.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                entrenamillentoType === type.id
                  ? 'border-training bg-training/15 shadow-lg shadow-training/20'
                  : 'border-border/50 bg-card hover:border-training/50 hover:bg-card/80'
              }`}
            >
              <div className="flex items-start gap-2">
                {entrenamillentoType === type.id && (
                  <Check className="w-5 h-5 text-training mt-0.5 flex-shrink-0 font-bold" />
                )}
                <div className="flex-1 text-left">
                  <p className={`font-bold text-sm transition-colors ${
                    entrenamillentoType === type.id 
                      ? 'text-training' 
                      : 'text-foreground'
                  }`}>
                    {type.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{type.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="capture" className="w-full">
        <TabsList className="grid w-full grid-cols-4 text-sm h-12 bg-card border-2 border-training/40 rounded-lg">
          <TabsTrigger 
            value="capture" 
            className="data-[state=active]:bg-training/20 data-[state=active]:text-training data-[state=active]:border-b-2 data-[state=active]:border-training"
          >
            Capturar
          </TabsTrigger>
          <TabsTrigger 
            value="results" 
            disabled={!activeSession}
            className="data-[state=active]:bg-training/20 data-[state=active]:text-training data-[state=active]:border-b-2 data-[state=active]:border-training disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Resultados
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="data-[state=active]:bg-training/20 data-[state=active]:text-training data-[state=active]:border-b-2 data-[state=active]:border-training"
          >
            Resumen
          </TabsTrigger>
          <TabsTrigger 
            value="advanced"
            className="data-[state=active]:bg-training/20 data-[state=active]:text-training data-[state=active]:border-b-2 data-[state=active]:border-training"
          >
            Avanzado
          </TabsTrigger>
        </TabsList>

        {/* Capture Tab */}
        <TabsContent value="capture" className="mt-6">
          <VideoRecorder
            entrenamillentoType={entrenamillentoType}
            onUploadComplete={sessionId => {
              setActiveSession(sessionId)
              setTimeout(() => {
                const resultsTab = document.querySelector('[value="results"]') as HTMLElement
                resultsTab?.click()
              }, 100)
            }}
            onError={setError}
          />
        </TabsContent>

        {/* Results Tab */}
        {activeSession && (
          <TabsContent value="results" className="mt-6">
            <AnalysisResults sessionId={activeSession} />
          </TabsContent>
        )}

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          <MultimodalAnalyticsDashboard />
        </TabsContent>

        {/* Advanced Analytics Tab */}
        <TabsContent value="advanced" className="mt-6">
          <AdvancedAnalyticsReporting />
        </TabsContent>
      </Tabs>
    </div>
  )
}
