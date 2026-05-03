'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VideoRecorder } from '@/components/multimodal/video-recorder'
import { AnalysisResults } from '@/components/multimodal/analysis-results'
import { MultimodalAnalyticsDashboard } from '@/components/multimodal/analytics-dashboard'
import { AdvancedAnalyticsReporting } from '@/components/multimodal/advanced-analytics'
import { AlertCircle, Check, Zap } from 'lucide-react'

export default function MultimodalAnalysisPage() {
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [entrenamillentoType, setEntrenamillentoType] = useState('entrevista-basica')

  const entrenamillentoTypes = [
    { id: 'entrevista-basica', label: 'Básica', desc: 'Presentación' },
    { id: 'entrevista-conductual', label: 'Conductual', desc: 'STAR' },
    { id: 'entrevista-tecnica', label: 'Técnica', desc: 'Problem-solving' },
    { id: 'presentacion-ejecutiva', label: 'Ejecutiva', desc: 'Pitch' }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      {/* Header - Enhanced with pillar color (purple) */}
      <div className="bg-gradient-to-r from-ritual/10 to-ritual/5 border border-ritual/20 rounded-lg p-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-ritual/20 border border-ritual/30 flex items-center justify-center">
            <Zap className="w-6 h-6 text-ritual" />
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

      {/* Error Alert - Ritual/Purple color */}
      {error && (
        <Card className="border-ritual/40 bg-ritual/10">
          <CardContent className="pt-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-ritual flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-ritual">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-xs text-ritual/70 hover:text-ritual mt-2 font-medium"
              >
                Descartar
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Type Selection - Better contrast with purple */}
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
                  ? 'border-ritual bg-ritual/15 shadow-lg shadow-ritual/20'
                  : 'border-border/50 bg-card hover:border-ritual/50 hover:bg-card/80'
              }`}
            >
              <div className="flex items-start gap-2">
                {entrenamillentoType === type.id && (
                  <Check className="w-5 h-5 text-ritual mt-0.5 flex-shrink-0 font-bold" />
                )}
                <div className="flex-1 text-left">
                  <p className={`font-bold text-sm transition-colors ${
                    entrenamillentoType === type.id 
                      ? 'text-ritual' 
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
        <TabsList className="grid w-full grid-cols-4 text-sm h-12 bg-card border border-border/50">
          <TabsTrigger 
            value="capture" 
            className="data-[state=active]:bg-ritual/20 data-[state=active]:text-ritual data-[state=active]:border-b-2 data-[state=active]:border-ritual"
          >
            Capturar
          </TabsTrigger>
          <TabsTrigger 
            value="results" 
            disabled={!activeSession}
            className="data-[state=active]:bg-ritual/20 data-[state=active]:text-ritual data-[state=active]:border-b-2 data-[state=active]:border-ritual disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Resultados
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="data-[state=active]:bg-ritual/20 data-[state=active]:text-ritual data-[state=active]:border-b-2 data-[state=active]:border-ritual"
          >
            Resumen
          </TabsTrigger>
          <TabsTrigger 
            value="advanced"
            className="data-[state=active]:bg-ritual/20 data-[state=active]:text-ritual data-[state=active]:border-b-2 data-[state=active]:border-ritual"
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
