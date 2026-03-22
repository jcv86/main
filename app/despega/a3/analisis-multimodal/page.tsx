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
    <div className="max-w-6xl mx-auto space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-6 h-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Análisis Multimodal
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Feedback detallado sobre postura, tono de voz, gestos y coherencia emocional
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950">
          <CardContent className="pt-4 flex gap-3">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 dark:text-red-100">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 mt-1"
              >
                Descartar
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Type Selection - Prominent */}
      <div>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Tipo de Entrenamiento
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {entrenamillentoTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setEntrenamillentoType(type.id)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                entrenamillentoType === type.id
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 shadow-md'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-start gap-2">
                {entrenamillentoType === type.id && (
                  <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${entrenamillentoType === type.id ? 'text-blue-900 dark:text-blue-100' : 'text-slate-900 dark:text-slate-100'}`}>
                    {type.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{type.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="capture" className="w-full">
        <TabsList className="grid w-full grid-cols-4 text-xs h-10">
          <TabsTrigger value="capture" className="text-xs px-2">Capturar</TabsTrigger>
          <TabsTrigger value="results" disabled={!activeSession} className="text-xs px-2">
            Resultados
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs px-2">Resumen</TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs px-2">Avanzado</TabsTrigger>
        </TabsList>

        {/* Capture Tab */}
        <TabsContent value="capture" className="mt-4">
          <VideoRecorder
            entrenamillentoType={entrenamillentoType}
            onUploadComplete={sessionId => {
              setActiveSession(sessionId)
              setTimeout(() => {
                document.querySelector('[value="results"]')?.dispatchEvent(new Event('click'))
              }, 100)
            }}
            onError={setError}
          />
        </TabsContent>

        {/* Results Tab */}
        {activeSession && (
          <TabsContent value="results">
            <AnalysisResults sessionId={activeSession} />
          </TabsContent>
        )}

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <MultimodalAnalyticsDashboard />
        </TabsContent>

        {/* Advanced Analytics Tab */}
        <TabsContent value="advanced">
          <AdvancedAnalyticsReporting />
        </TabsContent>
      </Tabs>
    </div>
  )
}
