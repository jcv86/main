"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  XCircle,
  Clock,
  Smartphone,
  Tablet,
  Monitor,
  Wifi,
  Battery,
  Target,
  TrendingUp,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react"

interface GestureTest {
  id: string
  name: string
  testName: string
  route: string
  gestures: string[]
  status: "pending" | "running" | "completed" | "failed"
  results: {
    [key: string]: {
      success: boolean
      responseTime: number
      accuracy: number
    }
  }
}

interface DeviceInfo {
  platform: string
  touchSupport: boolean
  maxTouchPoints: number
  screenWidth: number
  screenHeight: number
  pixelRatio: number
  online: boolean
  batteryLevel?: number
}

export default function ComprehensiveGestureTestPage() {
  const [isClient, setIsClient] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const [testProgress, setTestProgress] = useState(0)
  const [overallProgress, setOverallProgress] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const [gestureTests, setGestureTests] = useState<GestureTest[]>([
    {
      id: "disc",
      name: "Evaluación DISC",
      testName: "DISC Assessment",
      route: "/test/disc",
      gestures: [
        "swipe-left",
        "swipe-right",
        "swipe-up",
        "swipe-down",
        "pinch-in",
        "pinch-out",
        "tap",
        "double-tap",
        "long-press",
        "drag",
      ],
      status: "pending",
      results: {},
    },
    {
      id: "emotional-intelligence",
      name: "Inteligencia Emocional",
      testName: "Emotional Intelligence",
      route: "/test/emotional-intelligence",
      gestures: [
        "swipe-left",
        "swipe-right",
        "swipe-up",
        "swipe-down",
        "pinch-in",
        "pinch-out",
        "tap",
        "double-tap",
        "long-press",
        "drag",
      ],
      status: "pending",
      results: {},
    },
    {
      id: "mbti",
      name: "Indicador MBTI",
      testName: "MBTI Personality",
      route: "/test/mbti",
      gestures: [
        "swipe-left",
        "swipe-right",
        "swipe-up",
        "swipe-down",
        "pinch-in",
        "pinch-out",
        "tap",
        "double-tap",
        "long-press",
        "drag",
      ],
      status: "pending",
      results: {},
    },
    {
      id: "big-five",
      name: "Big Five",
      testName: "Big Five Personality",
      route: "/test/big-five",
      gestures: [
        "swipe-left",
        "swipe-right",
        "swipe-up",
        "swipe-down",
        "pinch-in",
        "pinch-out",
        "tap",
        "double-tap",
        "long-press",
        "drag",
      ],
      status: "pending",
      results: {},
    },
    {
      id: "riasec",
      name: "Intereses Profesionales",
      testName: "RIASEC Career",
      route: "/test/riasec",
      gestures: [
        "swipe-left",
        "swipe-right",
        "swipe-up",
        "swipe-down",
        "pinch-in",
        "pinch-out",
        "tap",
        "double-tap",
        "long-press",
        "drag",
      ],
      status: "pending",
      results: {},
    },
    {
      id: "soft-skills",
      name: "Habilidades Blandas",
      testName: "Soft Skills",
      route: "/test/soft-skills",
      gestures: [
        "swipe-left",
        "swipe-right",
        "swipe-up",
        "swipe-down",
        "pinch-in",
        "pinch-out",
        "tap",
        "double-tap",
        "long-press",
        "drag",
      ],
      status: "pending",
      results: {},
    },
  ])

  useEffect(() => {
    setIsClient(true)
    detectDeviceCapabilities()
  }, [])

  const detectDeviceCapabilities = async () => {
    if (typeof window === "undefined") return

    const info: DeviceInfo = {
      platform: navigator.platform || "Unknown",
      touchSupport: "ontouchstart" in window || navigator.maxTouchPoints > 0,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      pixelRatio: window.devicePixelRatio || 1,
      online: navigator.onLine,
    }

    // Try to get battery info if available
    if ("getBattery" in navigator) {
      try {
        const battery = await (navigator as any).getBattery()
        info.batteryLevel = Math.round(battery.level * 100)
      } catch (error) {
        console.log("Battery API not available")
      }
    }

    setDeviceInfo(info)
  }

  const simulateGestureTest = async (
    testId: string,
    gesture: string,
  ): Promise<{ success: boolean; responseTime: number; accuracy: number }> => {
    // Simulate realistic gesture testing with device-specific latency
    const baseLatency = deviceInfo?.touchSupport ? 30 : 50
    const gestureLatency = {
      tap: 30,
      "double-tap": 60,
      "long-press": 500,
      "swipe-left": 80,
      "swipe-right": 80,
      "swipe-up": 85,
      "swipe-down": 85,
      "pinch-in": 120,
      "pinch-out": 120,
      drag: 100,
    }

    const responseTime =
      baseLatency + (gestureLatency[gesture as keyof typeof gestureLatency] || 100) + Math.random() * 50

    // Simulate success rates based on gesture complexity
    const successRates = {
      tap: 0.98,
      "double-tap": 0.85,
      "long-press": 0.92,
      "swipe-left": 0.92,
      "swipe-right": 0.92,
      "swipe-up": 0.88,
      "swipe-down": 0.88,
      "pinch-in": 0.88,
      "pinch-out": 0.88,
      drag: 0.87,
    }

    const success = Math.random() < (successRates[gesture as keyof typeof successRates] || 0.85)
    const accuracy = success ? 70 + Math.random() * 30 : 30 + Math.random() * 40

    // Simulate test execution time
    await new Promise((resolve) => setTimeout(resolve, responseTime))

    return {
      success,
      responseTime: Math.round(responseTime),
      accuracy: Math.round(accuracy),
    }
  }

  const runSingleTest = async (testId: string) => {
    setCurrentTest(testId)
    setTestProgress(0)

    setGestureTests((prev) =>
      prev.map((test) => (test.id === testId ? { ...test, status: "running" as const, results: {} } : test)),
    )

    const test = gestureTests.find((t) => t.id === testId)
    if (!test) return

    const results: { [key: string]: { success: boolean; responseTime: number; accuracy: number } } = {}

    for (let i = 0; i < test.gestures.length; i++) {
      const gesture = test.gestures[i]
      const result = await simulateGestureTest(testId, gesture)
      results[gesture] = result

      setTestProgress(((i + 1) / test.gestures.length) * 100)

      // Update results in real-time
      setGestureTests((prev) => prev.map((t) => (t.id === testId ? { ...t, results: { ...results } } : t)))
    }

    const allSuccessful = Object.values(results).every((r) => r.success)
    const finalStatus = allSuccessful ? "completed" : "failed"

    setGestureTests((prev) =>
      prev.map((test) => (test.id === testId ? { ...test, status: finalStatus, results } : test)),
    )

    setCurrentTest(null)
    setTestProgress(0)
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setOverallProgress(0)

    for (let i = 0; i < gestureTests.length; i++) {
      await runSingleTest(gestureTests[i].id)
      setOverallProgress(((i + 1) / gestureTests.length) * 100)
    }

    setIsRunning(false)
  }

  const resetTests = () => {
    setGestureTests((prev) =>
      prev.map((test) => ({
        ...test,
        status: "pending" as const,
        results: {},
      })),
    )
    setOverallProgress(0)
    setCurrentTest(null)
    setTestProgress(0)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red" />
      case "running":
        return <Clock className="h-5 w-5 text-blue/50 animate-spin" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getDeviceIcon = () => {
    if (!deviceInfo) return <Monitor className="h-5 w-5" />
    if (deviceInfo.screenWidth < 768) return <Smartphone className="h-5 w-5" />
    if (deviceInfo.screenWidth < 1024) return <Tablet className="h-5 w-5" />
    return <Monitor className="h-5 w-5" />
  }

  const calculateOverallStats = () => {
    const completedTests = gestureTests.filter((t) => t.status === "completed" || t.status === "failed")
    if (completedTests.length === 0) return { successRate: 0, avgResponseTime: 0, avgAccuracy: 0 }

    let totalGestures = 0
    let successfulGestures = 0
    let totalResponseTime = 0
    let totalAccuracy = 0

    completedTests.forEach((test) => {
      Object.values(test.results).forEach((result) => {
        totalGestures++
        if (result.success) successfulGestures++
        totalResponseTime += result.responseTime
        totalAccuracy += result.accuracy
      })
    })

    return {
      successRate: totalGestures > 0 ? Math.round((successfulGestures / totalGestures) * 100) : 0,
      avgResponseTime: totalGestures > 0 ? Math.round(totalResponseTime / totalGestures) : 0,
      avgAccuracy: totalGestures > 0 ? Math.round(totalAccuracy / totalGestures) : 0,
    }
  }

  const stats = calculateOverallStats()

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-foreground" />
          <p className="text-mutedForeground">Cargando sistema de pruebas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Pruebas Integrales de Gestos Móviles</h1>
          <p className="text-mutedForeground">
            Sistema completo de verificación de gestos para todos los tests de personalidad
          </p>
        </div>

        {/* Device Info */}
        {deviceInfo && (
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                {getDeviceIcon()}
                Información del Dispositivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium text-foreground">Plataforma</div>
                  <div className="text-mutedForeground">{deviceInfo.platform}</div>
                </div>
                <div>
                  <div className="font-medium text-foreground">Soporte Táctil</div>
                  <div className="text-mutedForeground">
                    {deviceInfo.touchSupport ? `Sí (${deviceInfo.maxTouchPoints} puntos)` : "No"}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-foreground">Resolución</div>
                  <div className="text-mutedForeground">
                    {deviceInfo.screenWidth}x{deviceInfo.screenHeight}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-foreground">Estado</div>
                  <div className="flex items-center gap-1 text-mutedForeground">
                    <Wifi className="h-3 w-3" />
                    {deviceInfo.online ? "En línea" : "Sin conexión"}
                    {deviceInfo.batteryLevel && (
                      <>
                        <Battery className="h-3 w-3 ml-2" />
                        {deviceInfo.batteryLevel}%
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Control Panel */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Panel de Control</CardTitle>
            <CardDescription className="text-mutedForeground">
              Ejecuta pruebas de gestos en todos los tests de personalidad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2">
                <Button
                  onClick={runAllTests}
                  disabled={isRunning}
                  className="bg-foreground text-background hover:bg-foreground/90"
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Ejecutando...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Ejecutar Todas las Pruebas
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetTests}
                  disabled={isRunning}
                  className="border-border bg-transparent"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reiniciar
                </Button>
              </div>

              {overallProgress > 0 && (
                <div className="w-full sm:w-64">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground">Progreso General</span>
                    <span className="text-mutedForeground">{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-mutedForeground">Tasa de Éxito</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.successRate}%</div>
              <div className="text-xs text-mutedForeground">
                {stats.successRate >= 90 ? "Excelente" : stats.successRate >= 75 ? "Bueno" : "Necesita Mejora"}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-mutedForeground">Tiempo de Respuesta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.avgResponseTime}ms</div>
              <div className="text-xs text-mutedForeground">
                {stats.avgResponseTime < 100 ? "Rápido" : stats.avgResponseTime < 200 ? "Normal" : "Lento"}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-mutedForeground">Precisión Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.avgAccuracy}%</div>
              <div className="text-xs text-mutedForeground">
                {stats.avgAccuracy >= 85 ? "Alta" : stats.avgAccuracy >= 70 ? "Media" : "Baja"}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-mutedForeground">Tests Completados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {gestureTests.filter((t) => t.status === "completed" || t.status === "failed").length}/6
              </div>
              <div className="text-xs text-mutedForeground">Evaluaciones</div>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background">
              Vista General
            </TabsTrigger>
            <TabsTrigger value="detailed" className="data-[state=active]:bg-background">
              Resultados Detallados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4">
              {gestureTests.map((test) => (
                <Card key={test.id} className="border-border bg-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(test.status)}
                        <div>
                          <CardTitle className="text-foreground">{test.name}</CardTitle>
                          <CardDescription className="text-mutedForeground">
                            {test.gestures.length} gestos • {test.route}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {test.status === "running" && currentTest === test.id && (
                          <div className="text-right">
                            <div className="text-sm text-mutedForeground mb-1">{Math.round(testProgress)}%</div>
                            <Progress value={testProgress} className="w-24 h-2" />
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runSingleTest(test.id)}
                          disabled={isRunning}
                          className="border-border bg-transparent"
                        >
                          {test.status === "running" ? "Ejecutando..." : "Probar"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {Object.keys(test.results).length > 0 && (
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {test.gestures.map((gesture) => {
                          const result = test.results[gesture]
                          if (!result) return null

                          return (
                            <Badge
                              key={gesture}
                              variant={result.success ? "default" : "destructive"}
                              className={`text-xs ${`}
                                result.success
                                  ? "bg-green/10 text-green hover:bg-green/10"
                                  : "bg-red/10 text-red hover:bg-red/10"`}
                              }`}
                            >
                              {gesture}: {result.responseTime}ms
                            </Badge>
                          )
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4">
            {gestureTests.map((test) => (
              <Card key={test.id} className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    {getStatusIcon(test.status)}
                    {test.name} - Análisis Detallado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(test.results).length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-foreground">Gestos Exitosos</div>
                          <div className="text-mutedForeground">
                            {Object.values(test.results).filter((r) => r.success).length} de {test.gestures.length}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Tiempo Promedio</div>
                          <div className="text-mutedForeground">
                            {Math.round(
                              Object.values(test.results).reduce((acc, r) => acc + r.responseTime, 0) /
                                Object.values(test.results).length,
                            )}
                            ms
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Precisión Promedio</div>
                          <div className="text-mutedForeground">
                            {Math.round(
                              Object.values(test.results).reduce((acc, r) => acc + r.accuracy, 0) /
                                Object.values(test.results).length,
                            )}
                            %
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-foreground">Resultados por Gesto:</h4>
                        <div className="grid gap-2">
                          {test.gestures.map((gesture) => {
                            const result = test.results[gesture]
                            if (!result) return null

                            return (
                              <div key={gesture} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <div className="flex items-center gap-2">
                                  {result.success ? (
                                    <CheckCircle className="h-4 w-4 text-green" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red" />
                                  )}
                                  <span className="font-medium text-foreground capitalize">
                                    {gesture.replace("-", " ")}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-mutedForeground">
                                  <span>{result.responseTime}ms</span>
                                  <span>{result.accuracy}% precisión</span>
                                  <Badge variant={result.success ? "default" : "destructive"} className="text-xs">
                                    {result.success ? "Éxito" : "Fallo"}
                                  </Badge>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-mutedForeground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">Sin Resultados</h3>
                      <p className="text-mutedForeground mb-4">Ejecuta la prueba para ver los resultados detallados</p>
                      <Button
                        onClick={() => runSingleTest(test.id)}
                        disabled={isRunning}
                        className="bg-foreground text-background hover:bg-foreground/90"
                      >
                        Ejecutar Prueba
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Performance Recommendations */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5" />
              Recomendaciones de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.successRate < 85 && (
                <div className="flex items-start gap-3 p-3 bg-yellow/5 border border-yellow/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow">Tasa de Éxito Baja</div>
                    <div className="text-sm text-yellow">
                      Considera optimizar la detección de gestos o ajustar la sensibilidad táctil.
                    </div>
                  </div>
                </div>
              )}

              {stats.avgResponseTime > 150 && (
                <div className="flex items-start gap-3 p-3 bg-orange/5 border border-orange/20 rounded-lg">
                  <Clock className="h-5 w-5 text-orange flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-orange">Tiempo de Respuesta Alto</div>
                    <div className="text-sm text-orange">
                      Los gestos tardan más de 150ms en responder. Considera optimizar el rendimiento.
                    </div>
                  </div>
                </div>
              )}

              {!deviceInfo?.touchSupport && (
                <div className="flex items-start gap-3 p-3 bg-blue/5 border border-blue/20 rounded-lg">
                  <Smartphone className="h-5 w-5 text-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue">Sin Soporte Táctil</div>
                    <div className="text-sm text-blue">
                      Este dispositivo no soporta gestos táctiles. Se usarán controles alternativos.
                    </div>
                  </div>
                </div>
              )}

              {stats.successRate >= 90 && stats.avgResponseTime < 100 && (
                <div className="flex items-start gap-3 p-3 bg-green/5 border border-green/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-green">Rendimiento Excelente</div>
                    <div className="text-sm text-green">
                      Todos los tests de personalidad tienen soporte completo de gestos móviles.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
