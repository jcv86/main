"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"

interface TestResult {
  phase: string
  status: "loading" | "success" | "error"
  data?: any
  error?: string
}

export default function A2TestPage() {
  const [results, setResults] = useState<Record<string, TestResult>>({})
  const [isRunning, setIsRunning] = useState(false)

  // Mock data for testing
  const mockC1Responses = {
    1: "Soy un profesional con 10 años en tech, busco pasar de individual contributor a líder",
    2: "Inseguridad sobre si realmente tengo capacidad de liderazgo",
    3: "Tengo 45 minutos diarios disponibles",
    4: "Prefiero videos cortos + articles",
    5: "Necesito un mentor que me guíe paso a paso",
    6: "Trabajo en una startup, ambiente rápido y competitivo",
    7: "Quiero que en 90 días haya liderado un proyecto importante"
  }

  const mockA1Profile = "D" // Dominante - rápido, decisivo

  const mockC2Responses = {
    tiempo_disponible_diario_minutos: 45,
    energia_nivel_actual: 7,
    barreras_principales: ["confianza"],
    formato_preferido: "mixto",
    soporte_necesario: "mentor",
    contexto_vida: "Trabajo en startup, busco promoción",
    metrica_exito: "Liderar proyecto de 3 personas exitosamente",
    expectativa_30_dias: "Claridad sobre mi estilo de liderazgo",
    expectativa_90_dias: "Posición de líder en la empresa"
  }

  const testPhase = async (phaseName: string, endpoint: string, payload: any) => {
    setResults(prev => ({
      ...prev,
      [phaseName]: { phase: phaseName, status: "loading" }
    }))

    try {
      console.log(`[v0] Testing ${phaseName}...`)
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log(`[v0] ${phaseName} success:`, data)

      setResults(prev => ({
        ...prev,
        [phaseName]: {
          phase: phaseName,
          status: "success",
          data: data
        }
      }))
    } catch (error) {
      console.error(`[v0] ${phaseName} error:`, error)
      setResults(prev => ({
        ...prev,
        [phaseName]: {
          phase: phaseName,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error"
        }
      }))
    }
  }

  const runFullTest = async () => {
    setIsRunning(true)
    setResults({})

    // Test C1 → OpenAI Insights
    await testPhase("C1 Insights", "/api/canon/c1-openai-insights", {
      c1Responses: mockC1Responses
    })

    // Test A1 → OpenAI Coaching
    await testPhase("A1 Coaching", "/api/canon/a1-openai-coaching", {
      a1Profile: mockA1Profile,
      c1Context: mockC1Responses
    })

    // Test C2 → Route Enhancement
    await testPhase("C2 Route", "/api/canon/c2-openai-route-enhancement", {
      c2Responses: mockC2Responses,
      a1Profile: mockA1Profile
    })

    setIsRunning(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            CANON A2 - Test Completo
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Prueba el flujo completo: C1 → A1 → C2 con OpenAI integrado
          </p>
        </div>

        {/* Control Panel */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Panel de Control</CardTitle>
            <CardDescription>Haz clic para probar cada fase del flujo CANON</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => testPhase("C1 Insights", "/api/canon/c1-openai-insights", { c1Responses: mockC1Responses })}
                disabled={isRunning}
                className="h-12"
              >
                {results["C1 Insights"]?.status === "loading" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : results["C1 Insights"]?.status === "success" ? (
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                ) : null}
                Test C1 → OpenAI
              </Button>

              <Button
                onClick={() => testPhase("A1 Coaching", "/api/canon/a1-openai-coaching", { a1Profile: mockA1Profile, c1Context: mockC1Responses })}
                disabled={isRunning}
                className="h-12"
              >
                {results["A1 Coaching"]?.status === "loading" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : results["A1 Coaching"]?.status === "success" ? (
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                ) : null}
                Test A1 → OpenAI
              </Button>

              <Button
                onClick={() => testPhase("C2 Route", "/api/canon/c2-openai-route-enhancement", { c2Responses: mockC2Responses, a1Profile: mockA1Profile })}
                disabled={isRunning}
                className="h-12"
              >
                {results["C2 Route"]?.status === "loading" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : results["C2 Route"]?.status === "success" ? (
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                ) : null}
                Test C2 → OpenAI
              </Button>
            </div>

            <Button onClick={runFullTest} disabled={isRunning} className="w-full h-12 bg-blue-600 hover:bg-blue-700" size="lg">
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ejecutando prueba completa...
                </>
              ) : (
                "▶ Ejecutar Prueba Completa CANON"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {Object.keys(results).length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Resultados</h2>
            <Tabs defaultValue={Object.keys(results)[0]} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="C1 Insights">C1 Insights</TabsTrigger>
                <TabsTrigger value="A1 Coaching">A1 Coaching</TabsTrigger>
                <TabsTrigger value="C2 Route">C2 Route</TabsTrigger>
              </TabsList>

              {Object.entries(results).map(([key, result]) => (
                <TabsContent key={key} value={key}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{key}</CardTitle>
                        {result.status === "success" && (
                          <Badge className="bg-green-100 text-green-800">Exitoso</Badge>
                        )}
                        {result.status === "error" && (
                          <Badge className="bg-red-100 text-red-800">Error</Badge>
                        )}
                        {result.status === "loading" && (
                          <Badge className="bg-blue-100 text-blue-800">Procesando...</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {result.status === "loading" && (
                        <div className="flex items-center gap-3 text-blue-600">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Cargando...</span>
                        </div>
                      )}

                      {result.status === "error" && (
                        <div className="flex items-start gap-3 text-red-600 bg-red-50 dark:bg-red-950 p-4 rounded">
                          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Error:</p>
                            <p className="text-sm">{result.error}</p>
                          </div>
                        </div>
                      )}

                      {result.status === "success" && result.data && (
                        <div className="space-y-4">
                          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-50">Respuesta OpenAI:</h3>
                            <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                              {result.data.insights || result.data.coaching || result.data.masterInsight || JSON.stringify(result.data, null, 2)}
                            </div>
                          </div>

                          {result.data.route && (
                            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-50">Ruta Generada:</h3>
                              <pre className="text-xs overflow-auto text-slate-700 dark:text-slate-300">
                                {JSON.stringify(result.data.route, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
