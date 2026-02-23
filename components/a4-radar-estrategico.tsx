'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, TrendingUp, TrendingDown, Radio, Zap } from 'lucide-react'

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
  const [economicData, setEconomicData] = useState<EconomicData | null>(null)
  const [signals, setSignals] = useState<RadarSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch economic data
        const [bcRes, ineRes] = await Promise.all([
          fetch('/rest/banco-central-data'),
          fetch('/rest/ine-employment'),
        ])

        if (!bcRes.ok || !ineRes.ok) throw new Error('Failed to fetch data')

        const bcData = await bcRes.json()
        const ineData = await ineRes.json()

        const combined: EconomicData = {
          imacec: bcData.imacec,
          ipc: bcData.ipc,
          tpm: bcData.tpm,
          unemployment_rate: ineData.unemployment_rate,
          insight: bcData.insight,
        }

        setEconomicData(combined)

        // Generate signals based on data
        const generatedSignals: RadarSignal[] = []

        // Structural signal (IMACEC contraction)
        if (combined.imacec.variation_monthly < -0.3) {
          generatedSignals.push({
            type: 'structural',
            intensity: 'high',
            sector: 'Economía General',
            description: 'Contracción económica detectada (-0.5% mensual)',
            opportunity: 'Revisar exposición a sectores cíclicos. Oportunidad en defensivos.',
          })
        }

        // Tactical signal (Inflation pressure)
        if (combined.ipc.variation_annual > 3.5) {
          generatedSignals.push({
            type: 'tactical',
            intensity: 'medium',
            sector: 'Inflación',
            description: `Presión inflacionaria elevada (${combined.ipc.variation_annual}% anual)`,
            opportunity: 'Proteger poder adquisitivo. Aumentar liquidez en UF.',
          })
        }

        // Contextual signal (Employment)
        if (combined.unemployment_rate > 7.5) {
          generatedSignals.push({
            type: 'contextual',
            intensity: 'medium',
            sector: 'Mercado Laboral',
            description: `Desempleo elevado (${combined.unemployment_rate}%). Competencia por posiciones.`,
            opportunity: 'Diferenciar con skills únicos. Networking estratégico clave.',
          })
        }

        // Rate signal
        if (combined.tpm.value > 8) {
          generatedSignals.push({
            type: 'tactical',
            intensity: 'high',
            sector: 'Tasas',
            description: `TPM elevada (${combined.tpm.value}%). Crédito presionado.`,
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
  }, [])

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high':
        return 'bg-red-500/20 text-red-700 dark:text-red-300'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
      case 'low':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
      default:
        return 'bg-gray-500/20'
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
        <h2 className="text-2xl font-bold">Radar Estratégico</h2>
        <Badge variant="outline">Actualizado hoy</Badge>
      </div>

      {/* Loading */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Insight */}
      {!loading && economicData && (
        <>
          <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-300">
              {economicData.insight}
            </AlertDescription>
          </Alert>

          {/* Economic Snapshot */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground">IMACEC</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{economicData.imacec.value}</div>
                <p className={`text-xs mt-1 ${economicData.imacec.variation_monthly < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {economicData.imacec.variation_monthly > 0 ? '+' : ''}
                  {economicData.imacec.variation_monthly}% mes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground">IPC</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{economicData.ipc.value}</div>
                <p className={`text-xs mt-1 ${economicData.ipc.variation_annual > 3.5 ? 'text-red-600' : 'text-green-600'}`}>
                  +{economicData.ipc.variation_annual}% anual
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground">TPM</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{economicData.tpm.value}%</div>
                <p className={`text-xs mt-1 ${economicData.tpm.variation > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {economicData.tpm.variation > 0 ? '+' : ''}
                  {economicData.tpm.variation}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground">Desempleo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{economicData.unemployment_rate}%</div>
                <p className="text-xs mt-1 text-muted-foreground">Mercado laboral</p>
              </CardContent>
            </Card>
          </div>

          {/* Signals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Señales Detectadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {signals.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin señales críticas en este momento.</p>
              ) : (
                signals.map((signal, idx) => (
                  <div key={idx} className="border-l-4 border-l-yellow-500 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getIntensityColor(signal.intensity)}>
                        {getIntensityIcon(signal.intensity)}
                        <span className="ml-1">{signal.intensity.toUpperCase()}</span>
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground">{signal.type}</span>
                      <span className="text-xs font-medium">{signal.sector}</span>
                    </div>
                    <p className="text-sm font-medium mb-1">{signal.description}</p>
                    <p className="text-sm text-muted-foreground italic">
                      💡 <strong>Oportunidad:</strong> {signal.opportunity}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Expansion Button */}
          {!expanded && (
            <Button
              onClick={() => setExpanded(true)}
              variant="outline"
              className="w-full"
            >
              Ver Análisis Completo
            </Button>
          )}

          {/* Extended Analysis */}
          {expanded && (
            <Card>
              <CardHeader>
                <CardTitle>Análisis Estratégico Profundo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Qué está pasando realmente</h3>
                  <p className="text-sm text-muted-foreground">
                    La economía enfrenta presiones simultáneas: contracción en actividad (-0.5% IMACEC), inflación elevada (+4.1%), tasas altas (TPM 8.25%) y desempleo creciente (7.8%). No es un ciclo normal. Es reposicionamiento.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Implicancia para ti</h3>
                  <p className="text-sm text-muted-foreground">
                    En este contexto, tu capacidad de pivotear rápido es crítica. Las industrias defensivas ganando peso. El talento escaso en sectores que crecen. Tu especialización importa más.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Acciones concretas</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Mapear sectores defensivos vs expuestos en tu industria</li>
                    <li>Identificar skills en escasez en tu mercado laboral local</li>
                    <li>Fortalecer red en empresas anti-cíclicas</li>
                    <li>Revisar exposición financiera personal</li>
                  </ul>
                </div>

                <Button
                  onClick={() => setExpanded(false)}
                  variant="outline"
                  className="w-full"
                >
                  Colapsar
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
