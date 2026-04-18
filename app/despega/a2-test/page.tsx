"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { CanonRulesEngine } from "@/lib/canon-rules-engine"

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

  const testC1 = () => {
    testPhase("C1 Insights", "/api/canon/c1-openai-insights", { c1Responses: mockC1Responses })
  }

  const testA1 = () => {
    testPhase("A1 Coaching", "/api/canon/a1-openai-coaching", { 
      a1Profile: mockA1Profile, 
      c1Context: mockC1Responses 
    })
  }

  const testC2 = () => {
    const generatedRoute = CanonRulesEngine.generateRoute(
      mockC2Responses as any,
      mockA1Profile,
      mockC1Responses
    )
    testPhase("C2 Route", "/api/canon/c2-openai-route-enhancement", {
      c2Responses: mockC2Responses,
      generatedRoute: generatedRoute,
      a1Profile: mockA1Profile
    })
  }

  const runFullTest = async () => {
    setIsRunning(true)
    setResults({})

    // Test C1 → OpenAI
    await testPhase("C1 Insights", "/api/canon/c1-openai-insights", { c1Responses: mockC1Responses })

    // Test A1 → OpenAI
    await testPhase("A1 Coaching", "/api/canon/a1-openai-coaching", { 
      a1Profile: mockA1Profile, 
      c1Context: mockC1Responses 
    })

    // Test C2 → Route Enhancement
    // First generate the route using CANON rules engine
    const generatedRoute = CanonRulesEngine.generateRoute(
      mockC2Responses as any,
      mockA1Profile,
      mockC1Responses
    )

    await testPhase("C2 Route", "/api/canon/c2-openai-route-enhancement", {
      c2Responses: mockC2Responses,
      generatedRoute: generatedRoute,
      a1Profile: mockA1Profile
    })

    setIsRunning(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            CANON A2 - Test Completo
          </h1>
          <p className="text-lg text-muted/60 dark:text-muted/40">
            Prueba el flujo completo: C1 → A1 → C2 con OpenAI integrado
          </p>
        </div>

        {/* Control Panel */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue to-blue-700 text-white rounded-t-lg">
            <CardTitle>Panel de Control</CardTitle>
            <CardDescription className="text-blue/10">
              Haz clic para probar cada fase del flujo CANON
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button 
                  onClick={testC1}
                  disabled={isRunning}
                  className="h-12 text-base font-semibold"
                >
                  {results["C1 Insights"]?.status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Test C1 → OpenAI
                    </>
                  ) : (
                    "Test C1 → OpenAI"
                  )}
                </Button>
                <Button 
                  onClick={testA1}
                  disabled={isRunning}
                  className="h-12 text-base font-semibold"
                >
                  {results["A1 Coaching"]?.status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Test A1 → OpenAI
                    </>
                  ) : (
                    "Test A1 → OpenAI"
                  )}
                </Button>
                <Button 
                  onClick={testC2}
                  disabled={isRunning}
                  className="h-12 text-base font-semibold"
                >
                  {results["C2 Route"]?.status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Test C2 → OpenAI
                    </>
                  ) : (
                    "Test C2 → OpenAI"
                  )}
                </Button>
              </div>
              <Button 
                onClick={runFullTest}
                disabled={isRunning}
                size="lg"
                className="h-14 text-lg font-bold bg-gradient-to-r from-blue to-blue-700 hover:from-blue hover:to-blue-800"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Ejecutando Prueba Completa...
                  </>
                ) : (
                  <>
                    ▶ Ejecutar Prueba Completa CANON
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {Object.keys(results).length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="C1 Insights" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="C1 Insights">C1 Insights</TabsTrigger>
                  <TabsTrigger value="A1 Coaching">A1 Coaching</TabsTrigger>
                  <TabsTrigger value="C2 Route">C2 Route</TabsTrigger>
                </TabsList>

                {Object.entries(results).map(([key, result]) => (
                  <TabsContent key={key} value={key} className="mt-6">
                    <div className="space-y-4">
                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        {result.status === "loading" && (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin text-blue" />
                            <Badge variant="outline">Cargando...</Badge>
                          </>
                        )}
                        {result.status === "success" && (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-green" />
                            <Badge variant="outline" className="bg-green/5 text-green-700">Éxito</Badge>
                          </>
                        )}
                        {result.status === "error" && (
                          <>
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <Badge variant="outline" className="bg-red-50 text-red-700">Error</Badge>
                          </>
                        )}
                      </div>

                      {/* Result Data */}
                      {result.data && (
                        <div className="bg-muted/5 dark:bg-background p-4 rounded-[28px] overflow-auto max-h-96">
                          <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </div>
                      )}

                      {/* Error Message */}
                      {result.error && (
                        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 p-4 rounded-[28px]">
                          <p className="font-semibold mb-1">Error:</p>
                          <p className="text-sm">{result.error}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
