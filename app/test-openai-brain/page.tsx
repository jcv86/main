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
          <h1 className="text-4xl font-bold text-white">OpenAI Brain Cycle Validation</h1>
          <p className="text-purple-200">Test that OpenAI is providing insights throughout A1→A4 cycle with the Brain system</p>
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
                  Running A1-A4 OpenAI Test...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Test OpenAI Insights Across A1→A4
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
                <p className="font-semibold text-red-100">Test Failed</p>
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
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-800 rounded">
                    <p className="text-xs text-slate-400">Total Time</p>
                    <p className="text-lg font-bold text-white">{results.performance.total_ms}ms</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded">
                    <p className="text-xs text-slate-400">Avg Phase</p>
                    <p className="text-lg font-bold text-white">{results.performance.avg_phase_ms}ms</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded">
                    <p className="text-xs text-slate-400">Phases</p>
                    <p className="text-lg font-bold text-white">{results.validation.insights_generated}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* A1 Insights */}
            <Card className="bg-slate-900/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400">A1: DISC Profile Insights</CardTitle>
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
                <CardTitle className="text-emerald-400">A2: Route Strategy Insights</CardTitle>
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
                <CardTitle className="text-orange-400">A3: Training Feedback</CardTitle>
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
                <CardTitle className="text-purple-400">A4: Strategic Context Insights</CardTitle>
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
                  🧠 BRAIN: Master Insight Chain
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Consolidated meta-insight connecting all 4 phases ({results.performance.phases.brain}ms)
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
                    This insight guides the entire journey, connecting A1 (who they are) → A2 (where they go) → A3 (how they practice) → A4 (what they know)
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Validation Summary */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle>Validation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">All phases completed</span>
                  <Badge className={results.validation.all_phases_completed ? 'bg-green-600' : 'bg-red-600'}>
                    {results.validation.all_phases_completed ? 'PASSED' : 'FAILED'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Brain chain connected</span>
                  <Badge className={results.validation.brain_connected ? 'bg-green-600' : 'bg-red-600'}>
                    {results.validation.brain_connected ? 'PASSED' : 'FAILED'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">API response time</span>
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
            <CardTitle className="text-sm">How This Test Works</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-300 space-y-2">
            <p>1. <strong>A1 Phase:</strong> OpenAI analyzes DISC profile from test responses</p>
            <p>2. <strong>A2 Phase:</strong> OpenAI generates strategic route insights for 90-day plan</p>
            <p>3. <strong>A3 Phase:</strong> OpenAI coaches on interview response (training feedback)</p>
            <p>4. <strong>A4 Phase:</strong> OpenAI connects market trends to career strategy</p>
            <p>5. <strong>BRAIN Phase:</strong> OpenAI synthesizes meta-insight that ties everything together</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
