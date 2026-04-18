"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"

interface EconomicIndicator {
  name: string
  value: string | number
  unit: string
  change: number
  interpretation: string
  importance: string
}

interface ChileEnNumerosProps {
  indicators?: EconomicIndicator[]
  isLoading?: boolean
}

export function ChileEnNumeros({ 
  indicators = [
    {
      name: "IPC",
      value: 0.6,
      unit: "%",
      change: 0.2,
      interpretation: "Presión inflacionaria mayor a la esperada. Puede influir en tasas, costo de vida y decisiones de consumo/contratación.",
      importance: "Crítico"
    },
    {
      name: "TPM",
      value: 6.25,
      unit: "%",
      change: 0,
      interpretation: "Tasa de referencia sin cambios. Mantiene presión sobre créditos y deuda.",
      importance: "Alto"
    },
    {
      name: "Dólar Observado",
      value: 980,
      unit: "CLP",
      change: 8,
      interpretation: "Sube 0.8%. Exportadores se fortalecen, importaciones se encarecen.",
      importance: "Medio"
    },
    {
      name: "Imacec",
      value: 2.1,
      unit: "%",
      change: -0.3,
      interpretation: "Actividad económica desacelera levemente. Moderada contracción en sectores industriales.",
      importance: "Alto"
    },
    {
      name: "Desempleo",
      value: 8.2,
      unit: "%",
      change: 0.3,
      interpretation: "Sube 30pb. Más competencia en mercado laboral, especialmente en roles junior.",
      importance: "Crítico"
    },
    {
      name: "Confianza Económica",
      value: -12,
      unit: "índice",
      change: -5,
      interpretation: "Cae significativamente. Consumidores y empresas reducen gasto. Mercado de contratación se enfría.",
      importance: "Alto"
    }
  ],
  isLoading = false
}: ChileEnNumerosProps) {
  const getArrow = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-green/50" />
    if (change < 0) return <ArrowDown className="w-4 h-4 text-red" />
    return <Minus className="w-4 h-4 text-slate-400" />
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "Crítico":
        return "bg-red/50/10 text-red dark:text-red-400"
      case "Alto":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400"
      default:
        return "bg-slate-500/10 text-slate-700 dark:text-slate-400"
    }
  }

  return (
    <Card className="border-0 bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Chile en Números</CardTitle>
          <Badge variant="outline">Banco Central & INE</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Indicadores oficiales que contextualizan el mercado laboral
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-muted rounded animate-pulse" />
            ))
          ) : (
            indicators.map((indicator, idx) => (
              <div
                key={idx}
                className="p-4 rounded-[28px] border border-border/50 hover:border-border transition-colors group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{indicator.name}</h4>
                    <Badge 
                      className={`mt-2 text-xs font-medium ${getImportanceColor(indicator.importance)}`}
                      variant="outline"
                    >
                      {indicator.importance}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {getArrow(indicator.change)}
                    <span className={`text-xs font-medium ${indicator.change > 0 ? 'text-green' : indicator.change < 0 ? 'text-red' : 'text-slate-600'}`}>
                      {indicator.change > 0 ? '+' : ''}{indicator.change}
                    </span>
                  </div>
                </div>

                {/* Value */}
                <div className="mb-3">
                  <p className="text-2xl font-bold">
                    {indicator.value}<span className="text-sm text-muted-foreground ml-1">{indicator.unit}</span>
                  </p>
                </div>

                {/* Interpretation */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {indicator.interpretation}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
