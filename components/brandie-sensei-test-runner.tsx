"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, AlertTriangle, XCircle, Loader, Download } from "lucide-react"
import {
  TEST_SCENARIOS,
  COHERENCE_AXES,
  getTestScenarios,
  getCoherenceAxes,
  type TestScenario,
  type CoherenceEvaluation,
  detectRedFlags,
  detectCriticalFailure,
} from "@/lib/brandie-coherence-test"

export function BrandieSenseiTestRunner() {
  const [selectedScenario, setSelectedScenario] = useState<TestScenario | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<CoherenceEvaluation | null>(null)
  const [coachResponse, setCoachResponse] = useState<string>("")
  const [testResults, setTestResults] = useState<Record<TestScenario, CoherenceEvaluation | null>>({
    usuario_confundido: null,
    usuario_demandante: null,
    usuario_inseguro: null,
    usuario_informado_desorientado: null,
    usuario_brecha_cultural: null,
  })

  const runTestScenario = async (scenario: TestScenario) => {
    setSelectedScenario(scenario)
    setIsRunning(true)
    setResults(null)
    setCoachResponse("")

    try {
      const testData = TEST_SCENARIOS[scenario]

      // Get coach response
      const coachEndpoint =
        testData.context.pillar === "a1"
          ? "/api/despega/a1-coach"
          : testData.context.pillar === "a3"
          ? "/api/despega/a3-coach"
          : "/api/despega/a4-coach"

      const coachRes = await fetch(coachEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: testData.userMessage,
          context: testData.context,
        }),
      })

      const coachData = await coachRes.json()
      const response = coachData.response

      setCoachResponse(response)

      // Evaluate coherence
      const evaluation = evaluateCoherence(response, testData.context.pillar as "a1" | "a3" | "a4")

      setResults(evaluation)
      setTestResults(prev => ({
        ...prev,
        [scenario]: evaluation,
      }))
    } catch (error) {
      console.error("Error running test:", error)
      setResults({
        rol: "no_cumple",
        limite: "no_cumple",
        pilar: "no_cumple",
        tono: "no_cumple",
        valor: "no_cumple",
        observaciones: { error: "Test failed" },
        redFlags: [],
        pillarCompliance: "no_cumple",
        criticalFailure: true,
        criticalFailureReason: "Test execution error",
        verdict: "falla",
      })
    } finally {
      setIsRunning(false)
    }
  }

  const evaluateCoherence = (response: string, pillar: "a1" | "a3" | "a4"): CoherenceEvaluation => {
    const redFlags = detectRedFlags(response, pillar)
    const critical = detectCriticalFailure(response, {
      rol: "cumple",
      limite: "cumple",
      pilar: "cumple",
      tono: "cumple",
      valor: "cumple",
      observaciones: {},
      redFlags: [],
      pillarCompliance: "cumple",
      criticalFailure: false,
      verdict: "pasa",
    })

    // Simple heuristic scoring
    const hasTranslation = /traducir|patrón|contexto|significa/.test(response.toLowerCase())
    const avoidsPrescription = !/deberías|tienes que|lo correcto|debes/.test(response.toLowerCase())
    const hasValue = response.length > 100
    const adultTone = !/obvio|claro que|por supuesto/.test(response.toLowerCase())

    return {
      rol: hasTranslation ? "cumple" : avoidsPrescription ? "parcial" : "no_cumple",
      limite: avoidsPrescription ? "cumple" : "no_cumple",
      pilar: "cumple",
      tono: adultTone ? "cumple" : "parcial",
      valor: hasValue ? "cumple" : "parcial",
      observaciones: {
        rolNote: hasTranslation ? "Actúa como traductor" : "Falta traducción de patrones",
        limiteNote: avoidsPrescription ? "Evita prescripción" : "DETECTADA PRESCRIPCIÓN",
        valorNote: hasValue ? "Proporciona claridad" : "Respuesta muy breve",
      },
      redFlags,
      pillarCompliance: redFlags.length === 0 ? "cumple" : "no_cumple",
      criticalFailure: critical.hasCritical,
      criticalFailureReason: critical.reason,
      verdict: critical.hasCritical ? "falla" : redFlags.length === 0 ? "pasa" : "pasa_con_advertencias",
    }
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "pasa":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case "pasa_con_advertencias":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "falla":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "pasa":
        return "bg-green-50 border-green-200"
      case "pasa_con_advertencias":
        return "bg-yellow-50 border-yellow-200"
      case "falla":
        return "bg-red-50 border-red-200"
      default:
        return "bg-gray-50"
    }
  }

  const allTestsRun = Object.values(testResults).every(r => r !== null)

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🥋 Brandie Sensei - Test de Coherencia Cruzada
          </CardTitle>
          <CardDescription>
            Audita respuestas del Chat Coach contra los 5 ejes de coherencia DTC
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(TEST_SCENARIOS).map(([key, scenario]) => {
          const result = testResults[key as TestScenario]

          return (
            <Card key={key} className={result ? getVerdictColor(result.verdict) : ""}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{scenario.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{scenario.context.userState}</p>
                    </div>
                    {result && getVerdictIcon(result.verdict)}
                  </div>

                  <Button
                    onClick={() => runTestScenario(key as TestScenario)}
                    disabled={isRunning && selectedScenario === key}
                    variant={result ? "outline" : "default"}
                    className="w-full"
                  >
                    {isRunning && selectedScenario === key ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Corriendo...
                      </>
                    ) : result ? (
                      `Re-testar (${result.verdict})`
                    ) : (
                      "Testar"
                    )}
                  </Button>

                  {result && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="text-xs space-y-1">
                        <p className="font-semibold">Resultado:</p>
                        <div className="grid grid-cols-2 gap-1">
                          {Object.entries({
                            Rol: result.rol,
                            Límite: result.limite,
                            Pilar: result.pilar,
                            Tono: result.tono,
                            Valor: result.valor,
                          }).map(([axis, status]) => (
                            <Badge key={axis} variant={status === "cumple" ? "default" : "secondary"}>
                              {axis}: {status}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {result.redFlags.length > 0 && (
                        <Alert className="bg-red-50 border-red-200">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800">
                            <strong>Red Flags:</strong> {result.redFlags.join(", ")}
                          </AlertDescription>
                        </Alert>
                      )}

                      {result.criticalFailure && (
                        <Alert className="bg-red-100 border-red-300">
                          <XCircle className="h-4 w-4 text-red-700" />
                          <AlertDescription className="text-red-700 font-semibold">
                            FALLA CRÍTICA: {result.criticalFailureReason}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedScenario && results && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado Detallado - {TEST_SCENARIOS[selectedScenario].name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Mensaje del Usuario:</h3>
              <p className="text-sm bg-gray-50 p-4 rounded">{TEST_SCENARIOS[selectedScenario].userMessage}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Respuesta del Coach:</h3>
              <p className="text-sm bg-blue-50 p-4 rounded">{coachResponse}</p>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {Object.entries(COHERENCE_AXES).map(([key, axis]) => {
                const status = results[key as keyof CoherenceEvaluation] as string

                return (
                  <div key={key} className="space-y-2">
                    <div className="font-semibold text-sm">{axis.name}</div>
                    <Badge
                      variant={
                        status === "cumple"
                          ? "default"
                          : status === "parcial"
                          ? "secondary"
                          : "destructive"
                      }
                      className="w-full justify-center"
                    >
                      {status}
                    </Badge>
                  </div>
                )
              })}
            </div>

            {results.redFlags.length > 0 && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription>
                  <strong>Red Flags detectadas:</strong>
                  <ul className="list-disc ml-4 mt-2">
                    {results.redFlags.map((flag, i) => (
                      <li key={i} className="text-sm">
                        {flag}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {allTestsRun && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Todos los Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Descargar Reporte
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
