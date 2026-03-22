'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VideoRecorder } from '@/components/multimodal/video-recorder'
import { AnalysisResults } from '@/components/multimodal/analysis-results'
import { MultimodalAnalyticsDashboard } from '@/components/multimodal/analytics-dashboard'
import { AdvancedAnalyticsReporting } from '@/components/multimodal/advanced-analytics'
import { AlertCircle } from 'lucide-react'

export default function MultimodalAnalysisPage() {
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [entrenamillentoType, setEntrenamillentoType] = useState('entrevista-basica')

  const entrenamillentoTypes = [
    { id: 'entrevista-basica', label: 'Entrevista Básica', desc: 'Respuestas simples y presentación' },
    { id: 'entrevista-conductual', label: 'Entrevista Conductual', desc: 'Historias STAR' },
    { id: 'entrevista-tecnica', label: 'Entrevista Técnica', desc: 'Conceptos y problema-solving' },
    { id: 'presentacion-ejecutiva', label: 'Presentación Ejecutiva', desc: 'Pitch o deck' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Análisis Multimodal
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Visual, voz, y lenguaje corporal
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-sm text-red-600 hover:text-red-700 mt-1"
              >
                Descartar
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="capture" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="capture">Capturar</TabsTrigger>
          <TabsTrigger value="results" disabled={!activeSession}>
            Resultados
          </TabsTrigger>
          <TabsTrigger value="analytics">Resumen</TabsTrigger>
          <TabsTrigger value="advanced">Avanzado</TabsTrigger>
        </TabsList>

        {/* Capture Tab */}
        <TabsContent value="capture" className="space-y-6">
          {/* Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Tipo de Entrenamiento</CardTitle>
              <CardDescription>
                Selecciona el tipo de entrevista que vas a practicar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {entrenamillentoTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setEntrenamillentoType(type.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      entrenamillentoType === type.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium text-sm">{type.label}</p>
                    <p className="text-xs text-gray-600 mt-1">{type.desc}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Video Recorder */}
          <VideoRecorder
            entrenamillentoType={entrenamillentoType}
            onUploadComplete={sessionId => {
              setActiveSession(sessionId)
              // Auto-switch to results tab
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
