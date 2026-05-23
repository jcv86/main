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
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-white">Descubre Quién Eres Realmente</h1>
          <p className="text-lg text-purple/10">Tu viaje de 90 días comienza aquí. 5 fases. 1 insight que lo cambia todo.</p>
        </div>

        {/* Main Test Button */}
        <Card className="bg-background">
          <CardContent className="pt-8 pb-8">
            <Button 
              onClick={runTest} 
              disabled={loading}
              className="w-full h-14 bg-background"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Generando tus insights personalizados...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-3" />
                  Comenzar Mi Viaje de Descubrimiento
                </>
              )}
            </Button>
            <p className="text-center text-sm text-purple/20 mt-3">
              Responde 41 preguntas → obtén un plan personalizado de 90 días
            </p>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="bg-[rgba(80,160,170,0.5)]/20 border-[rgb(80,160,170)]/50/50">
            <CardContent className="pt-6 flex gap-3">
              <AlertCircle className="w-6 h-6 text-[rgb(80,160,170)] flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="font-semibold text-[rgb(80,160,170)]/10">Test Fallido</p>
                <p className="text-[rgb(80,160,170)]/20 text-sm mt-1">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Display */}
        {results && (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <Card className="bg-muted/90/50 border-muted/70">
              <CardHeader>
                <CardTitle className="text-green/40 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Métricas de Rendimiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-muted/80 rounded">
                    <p className="text-xs text-muted-foreground">Tiempo Total</p>
                    <p className="text-lg font-bold text-white">{results.performance.total_ms}ms</p>
                  </div>
                  <div className="p-3 bg-muted/80 rounded">
                    <p className="text-xs text-muted-foreground">Promedio Fase</p>
                    <p className="text-lg font-bold text-white">{results.performance.avg_phase_ms}ms</p>
                  </div>
                  <div className="p-3 bg-muted/80 rounded">
                    <p className="text-xs text-muted-foreground">Fases</p>
                    <p className="text-lg font-bold text-white">{results.validation.insights_generated}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* A1 Insights */}
            <Card className="bg-muted/90/50 border-blue/50/30">
              <CardHeader>
                <CardTitle className="text-blue/40">Fase 1: Quién Eres Realmente (Despega Cerebral)</CardTitle>
                <CardDescription className="text-blue/20">
                  Tu patrón natural de comportamiento - descubierto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted/10 leading-relaxed whitespace-pre-wrap text-base font-medium">
                  {results.results.a1_insights}
                </p>
              </CardContent>
            </Card>

            {/* A2 Insights */}
            <Card className="bg-muted/90/50 border-green/30">
              <CardHeader>
                <CardTitle className="text-emerald-400">Fase 2: Tu Camino Claro (Ruta 90 Días)</CardTitle>
                <CardDescription className="text-emerald-200">
                  Exactamente qué hacer para lograr tu objetivo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted/10 leading-relaxed whitespace-pre-wrap text-base font-medium">
                  {results.results.a2_insights}
                </p>
              </CardContent>
            </Card>

            {/* A3 Insights */}
            <Card className="bg-muted/90/50 border-orange/30">
              <CardHeader>
                <CardTitle className="text-orange/40">Fase 3: Feedback Honesto (Entrenamientos)</CardTitle>
                <CardDescription className="text-orange/20">
                  Lo que está bien + lo que necesitas cambiar para ser líder
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted/10 leading-relaxed whitespace-pre-wrap text-base font-medium">
                  {results.results.a3_insights}
                </p>
              </CardContent>
            </Card>

            {/* A4 Insights */}
            <Card className="bg-muted/90/50 border-purple/50/30">
              <CardHeader>
                <CardTitle className="text-purple/40">Fase 4: Tu Momento Ahora (Contexto de Mercado)</CardTitle>
                <CardDescription className="text-purple/20">
                  Por qué ahora es tu mejor momento para actuar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted/10 leading-relaxed whitespace-pre-wrap text-base font-medium">
                  {results.results.a4_insights}
                </p>
              </CardContent>
            </Card>

            {/* Brain Chain - The Master Insight */}
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="text-2xl bg-background">
                  Tu Insight Maestro: El Que Lo Cambia Todo
                </CardTitle>
                <CardDescription className="text-purple/20">
                  Una verdad poderosa que conecta los 3 Pilares
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/90/70 p-6 rounded-lg border-2 border-purple/40/50">
                  <p className="text-muted/10 leading-relaxed whitespace-pre-wrap text-lg font-bold text-center">
                    "{results.results.brain_chain}"
                  </p>
                </div>
                <div className="mt-4 p-4 bg-purple/50 rounded flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple/30 flex-shrink-0" />
                  <span className="text-sm text-purple/10">
                    Este es el insight que te guía en cada decisión los próximos 90 días
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Validation Summary */}
            <Card className="bg-muted/90/50 border-muted/70">
              <CardHeader>
                <CardTitle>Resumen de Validación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/85">Todas las fases completadas</span>
                  <Badge className={results.validation.all_phases_completed ? 'bg-green' : 'bg-[rgba(80,160,170,0.5)]'}>
                    {results.validation.all_phases_completed ? 'EXITOSO' : 'FALLIDO'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/85">Cadena BRAIN conectada</span>
                  <Badge className={results.validation.brain_connected ? 'bg-green' : 'bg-[rgba(80,160,170,0.5)]'}>
                    {results.validation.brain_connected ? 'EXITOSO' : 'FALLIDO'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/85">Tiempo de respuesta API</span>
                  <Badge variant={results.performance.total_ms < 10000 ? 'default' : 'destructive'}>
                    {results.performance.total_ms}ms
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions */}
        <Card className="bg-muted/90/50 border-muted/70">
          <CardHeader>
            <CardTitle>Cómo Funciona Tu Viaje de Descubrimiento</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/85 space-y-3">
            <p className="font-semibold text-muted/10">4 Fases. 1 Insight Maestro. Tu Transformación Comienza.</p>
            <div className="space-y-2 text-muted-foreground">
              <p><span className="text-blue/30 font-semibold">Fase 1:</span> Descubrimos quién eres realmente (tu patrón natural)</p>
              <p><span className="text-emerald-300 font-semibold">Fase 2:</span> Creamos tu camino claro (qué hacer cada 30 días)</p>
              <p><span className="text-orange/30 font-semibold">Fase 3:</span> Te preparamos (feedback honesto sobre lo que necesitas cambiar)</p>
              <p><span className="text-purple/30 font-semibold">Fase 4:</span> Te mostramos tu momento (por qué ahora es tu oportunidad)</p>
              <p className="pt-2"><span className="text-pink-300 font-semibold">Insight Maestro:</span> Una verdad que une los 3 Pilares y te guía cada día</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
