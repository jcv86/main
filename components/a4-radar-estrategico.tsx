'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, TrendingUp, TrendingDown, Radio, Zap, BookOpen, Target } from 'lucide-react'
import { getWeakSignals } from '@/lib/supabase/a4-queries'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'

interface EconomicData {
  imacec: { value: number; variation_monthly: number; variation_annual: number }
  ipc: { value: number; variation_monthly: number; variation_annual: number }
  tpm: { value: number; variation: number }
  unemployment_rate: number
  insight: string
}

interface RadarSignal {
  type: 'structural' | 'tactical' | 'contextual'
  intensity: 'low' | 'medium' | 'high'
  sector: string
  description: string
  opportunity: string
}

export function A4RadarEstrategico() {
  const { user } = useAuthRedirect()
  const [economicData, setEconomicData] = useState<EconomicData | null>(null)
  const [signals, setSignals] = useState<RadarSignal[]>([])
  const [weakSignals, setWeakSignals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      try {
        // Fetch weak signals from database
        const dbSignals = await getWeakSignals(user.id, 5)
        setWeakSignals(dbSignals)

        // Fetch economic data (mock for now)
        const mockEconomicData: EconomicData = {
          imacec: { value: 103.5, variation_monthly: -0.5, variation_annual: 2.1 },
          ipc: { value: 104.2, variation_monthly: 0.3, variation_annual: 4.1 },
          tpm: { value: 8.25, variation: 0.5 },
          unemployment_rate: 7.8,
          insight: 'La economía chilena enfrenta presiones simultáneas: contracción económica (-0.5% IMACEC), inflación moderada (+4.1% IPC) y tasas de interés elevadas. En este contexto, es crítico fortalecer tu posición laboral con especialización en sectores defensivos.',
        }

        setEconomicData(mockEconomicData)

        // Generate signals based on data
        const generatedSignals: RadarSignal[] = []

        if (mockEconomicData.imacec.variation_monthly < -0.3) {
          generatedSignals.push({
            type: 'structural',
            intensity: 'high',
            sector: 'Economía General',
            description: 'Contracción económica detectada (-0.5% mensual)',
            opportunity: 'Revisar exposición a sectores cíclicos. Oportunidad en defensivos y tech.',
          })
        }

        if (mockEconomicData.ipc.variation_annual > 3.5) {
          generatedSignals.push({
            type: 'tactical',
            intensity: 'medium',
            sector: 'Inflación',
            description: `Presión inflacionaria moderada (${mockEconomicData.ipc.variation_annual}% anual)`,
            opportunity: 'Proteger poder adquisitivo. Aumentar ingresos en términos reales.',
          })
        }

        if (mockEconomicData.unemployment_rate > 7.5) {
          generatedSignals.push({
            type: 'contextual',
            intensity: 'medium',
            sector: 'Mercado Laboral',
            description: `Desempleo moderado (${mockEconomicData.unemployment_rate}%). Competencia por posiciones.`,
            opportunity: 'Diferenciar con skills únicos. Networking estratégico clave.',
          })
        }

        if (mockEconomicData.tpm.value > 8) {
          generatedSignals.push({
            type: 'tactical',
            intensity: 'high',
            sector: 'Tasas',
            description: `TPM elevada (${mockEconomicData.tpm.value}%). Crédito presionado.`,
            opportunity: 'Mejorar cash flow. Reducir deuda. Fondo de emergencia crítico.',
          })
        }

        setSignals(generatedSignals)
      } catch (error) {
        console.error('[v0] Error loading radar data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high':
        return 'bg-[rgba(80,160,170,0.5)]/20 text-[rgb(80,160,170)] dark:text-[rgb(80,160,170)]/30 border-[rgb(80,160,170)]/30'
      case 'medium':
        return 'bg-orange/20 text-yellow dark:text-yellow/20 border-yellow/30'
      case 'low':
        return 'bg-blue/20 text-blue dark:text-blue-200 border-blue/30'
      default:
        return 'bg-muted/20'
    }
  }

  const getIntensityIcon = (intensity: string) => {
    switch (intensity) {
      case 'high':
        return <AlertTriangle className="w-4 h-4" />
      case 'medium':
        return <Radio className="w-4 h-4" />
      case 'low':
        return <Zap className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Radar Estratégico Diario</h2>
          <p className="text-sm text-muted-foreground mt-1">Análisis estructurado del contexto económico actual</p>
        </div>
        <Badge variant="outline">Actualizado hoy</Badge>
      </div>

      {/* Loading */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-purple/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Insight */}
      {!loading && economicData && (
        <>
          <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-300">
              {economicData.insight}
            </AlertDescription>
          </Alert>

          {/* Economic Snapshot */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Indicadores Económicos</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 bg-background">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">IMACEC</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue">{economicData.imacec.value}</div>
                  <p className={`text-xs mt-2 font-medium ${economicData.imacec.variation_monthly < 0 ? 'text-[rgb(80,160,170)]' : 'text-green'}`}>
                    {economicData.imacec.variation_monthly > 0 ? '+' : ''}
                    {economicData.imacec.variation_monthly}% mes
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Actividad económica</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-background">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">IPC</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange">{economicData.ipc.value}</div>
                  <p className={`text-xs mt-2 font-medium ${economicData.ipc.variation_annual > 3.5 ? 'text-[rgb(80,160,170)]' : 'text-green'}`}>
                    +{economicData.ipc.variation_annual}% anual
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Inflación</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-background">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">TPM</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple">{economicData.tpm.value}%</div>
                  <p className={`text-xs mt-2 font-medium ${economicData.tpm.variation > 0 ? 'text-[rgb(80,160,170)]' : 'text-green'}`}>
                    {economicData.tpm.variation > 0 ? '+' : ''}
                    {economicData.tpm.variation}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Tasa de interés</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-background">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">Desempleo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green">{economicData.unemployment_rate}%</div>
                  <p className="text-xs mt-2 text-muted-foreground font-medium">Mercado laboral</p>
                  <p className="text-xs text-muted-foreground mt-1">Competencia moderada</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Key Signals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Señales Estratégicas Detectadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {signals.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin señales críticas en este momento.</p>
              ) : (
                signals.map((signal, idx) => (
                  <div key={idx} className={`border-l-4 border-l-amber-500 pl-4 py-3 rounded-r bg-muted/30 ${getIntensityColor(signal.intensity)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={`border ${getIntensityColor(signal.intensity).split(' ')[0]}`}>
                        {getIntensityIcon(signal.intensity)}
                        <span className="ml-1 font-medium">{signal.intensity.toUpperCase()}</span>
                      </Badge>
                      <span className="text-xs font-semibold text-muted-foreground">{signal.type}</span>
                      <span className="text-xs font-semibold">{signal.sector}</span>
                    </div>
                    <p className="text-sm font-semibold mb-1">{signal.description}</p>
                    <div className="flex items-start gap-2 text-sm">
                      <Target className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-purple" />
                      <p className="text-muted-foreground">
                        <strong>Acción:</strong> {signal.opportunity}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Weak Signals */}
          {weakSignals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange" />
                  Señales Débiles Emergentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {weakSignals.slice(0, 3).map((signal, idx) => (
                  <div key={idx} className="border-l-4 border-l-yellow-500 pl-4 py-2 bg-yellow/5/30 dark:bg-yellow/10">
                    <p className="text-sm font-medium">{signal.senal}</p>
                    <p className="text-xs text-muted-foreground mt-1">{signal.descripcion}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {signal.timeframe_activacion}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Probabilidad: {Math.round((signal.probabilidad_activacion || 0) * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Expansion Button */}
          {!expanded && (
            <Button
              onClick={() => setExpanded(true)}
              variant="outline"
              className="w-full"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Ver Análisis Completo
            </Button>
          )}

          {/* Extended Analysis */}
          {expanded && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Análisis Estratégico Profundo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingDown className="w-4 h-4" />
                      Qué está pasando realmente
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      La economía chilena enfrenta un patrón de presiones simultáneas: contracción en actividad económica (-0.5% IMACEC), inflación moderada (+4.1%), tasas de interés elevadas (TPM 8.25%) y desempleo creciente (7.8%). No es un ciclo normal. Es reposicionamiento estructural.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Implicancia para tu carrera
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      En este contexto, tu capacidad de pivotear rápido es crítica. Las industrias defensivas ganando peso. El talento escaso en sectores que crecen. Tu especialización importa más. Los salarios se polarizando: presión en posiciones junior, primas para especialistas.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Acciones Concretas Prioritarias</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue/5/50 dark:bg-blue/20 p-4 rounded-[28px] border border-blue/20 dark:border-blue">
                      <p className="text-xs font-semibold text-blue dark:text-blue/40 mb-2">ESTA SEMANA</p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Mapear 5 sectores defensivos en tu industria</li>
                        <li>Identificar 3 skills en escasez laboral</li>
                        <li>Revisar tu exposición financiera personal</li>
                      </ul>
                    </div>
                    <div className="bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-[28px] border border-amber-200 dark:border-amber-800">
                      <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">PRÓXIMAS 2 SEMANAS</p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Fortalecer red en empresas anti-cíclicas</li>
                        <li>Comenzar certificación en skill escaso</li>
                        <li>Crear fondo de emergencia de 6 meses</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setExpanded(false)}
                  variant="outline"
                  className="w-full"
                >
                  Colapsar análisis
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
