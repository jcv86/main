'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Loader2, CheckCircle2, AlertCircle, Zap } from 'lucide-react'

export default function TestOpenAIInsightsPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runTest = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/test/validate-a1-a4-openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Test failed')
      }

      const data = await response.json()
      console.log('[v0] Test results:', data)
      setResults(data)
    } catch (err: any) {
      console.error('[v0] Test error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-white">Validación del Ciclo BRAIN de OpenAI</h1>
          <p className="text-purple-200">Verifica que OpenAI proporcione insights en todo el ciclo A1→A4 con el sistema BRAIN</p>
        </div>

        {/* Main Test Button */}
        <Card className="bg-purple-900/30 border-purple-500/50">
          <CardContent className="pt-6">
            <Button 
              onClick={runTest} 
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Ejecutando test A1-A4 de OpenAI...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Validar Insights de OpenAI A1→A4
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="bg-red-900/20 border-red-500/50">
            <CardContent className="pt-6 flex gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="font-semibold text-red-100">Test Fallido</p>
                <p className="text-red-200 text-sm mt-1">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Display */}
        {results && (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Métricas de Rendimiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-800 rounded">
                    <p className="text-xs text-slate-400">Tiempo Total</p>
                    <p className="text-lg font-bold text-white">{results.performance.total_ms}ms</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded">
                    <p className="text-xs text-slate-400">Promedio Fase</p>
                    <p className="text-lg font-bold text-white">{results.performance.avg_phase_ms}ms</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded">
                    <p className="text-xs text-slate-400">Fases</p>
                    <p className="text-lg font-bold text-white">{results.validation.insights_generated}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* A1 Insights */}
            <Card className="bg-slate-900/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400">A1: Insights del Perfil DISC</CardTitle>
                <CardDescription className="text-blue-200">
                  {results.performance.phases.a1}ms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-100 leading-relaxed whitespace-pre-wrap text-sm">
                  {results.results.a1_insights}
                </p>
              </CardContent>
            </Card>

            {/* A2 Insights */}
            <Card className="bg-slate-900/50 border-emerald-500/30">
              <CardHeader>
                <CardTitle className="text-emerald-400">A2: Insights de Estrategia de Ruta</CardTitle>
                <CardDescription className="text-emerald-200">
                  {results.performance.phases.a2}ms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-100 leading-relaxed whitespace-pre-wrap text-sm">
                  {results.results.a2_insights}
                </p>
              </CardContent>
            </Card>

            {/* A3 Insights */}
            <Card className="bg-slate-900/50 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-orange-400">A3: Feedback de Entrenamientos</CardTitle>
                <CardDescription className="text-orange-200">
                  {results.performance.phases.a3}ms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-100 leading-relaxed whitespace-pre-wrap text-sm">
                  {results.results.a3_insights}
                </p>
              </CardContent>
            </Card>

            {/* A4 Insights */}
            <Card className="bg-slate-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">A4: Insights de Contexto Estratégico</CardTitle>
                <CardDescription className="text-purple-200">
                  {results.performance.phases.a4}ms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-100 leading-relaxed whitespace-pre-wrap text-sm">
                  {results.results.a4_insights}
                </p>
              </CardContent>
            </Card>

            {/* Brain Chain - The Master Insight */}
            <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-400/50">
              <CardHeader>
                <CardTitle className="text-2xl bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  🧠 BRAIN: Cadena de Insight Maestro
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Insight consolidado que conecta las 4 fases ({results.performance.phases.brain}ms)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/30">
                  <p className="text-slate-100 leading-relaxed whitespace-pre-wrap text-base font-semibold">
                    {results.results.brain_chain}
                  </p>
                </div>
                <div className="mt-4 p-3 bg-slate-800/50 rounded flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-slate-300">
                    Este insight guía todo el viaje, conectando A1 (quién eres) → A2 (dónde vas) → A3 (cómo practicas) → A4 (qué sabes)
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Validation Summary */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle>Resumen de Validación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Todas las fases completadas</span>
                  <Badge className={results.validation.all_phases_completed ? 'bg-green-600' : 'bg-red-600'}>
                    {results.validation.all_phases_completed ? 'EXITOSO' : 'FALLIDO'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Cadena BRAIN conectada</span>
                  <Badge className={results.validation.brain_connected ? 'bg-green-600' : 'bg-red-600'}>
                    {results.validation.brain_connected ? 'EXITOSO' : 'FALLIDO'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Tiempo de respuesta API</span>
                  <Badge variant={results.performance.total_ms < 10000 ? 'default' : 'destructive'}>
                    {results.performance.total_ms}ms
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm">Cómo Funciona Este Test</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-300 space-y-2">
            <p>1. <strong>Fase A1:</strong> OpenAI analiza el perfil DISC desde respuestas del test</p>
            <p>2. <strong>Fase A2:</strong> OpenAI genera insights de estrategia para plan de 90 días</p>
            <p>3. <strong>Fase A3:</strong> OpenAI entrena la respuesta de entrevista (feedback)</p>
            <p>4. <strong>Fase A4:</strong> OpenAI conecta tendencias del mercado con estrategia de carrera</p>
            <p>5. <strong>Fase BRAIN:</strong> OpenAI sintetiza el insight maestro que une todo</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
