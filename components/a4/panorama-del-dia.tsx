"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from "lucide-react"

interface PanoramaItem {
  title: string
  description: string
  importance: "high" | "medium" | "low"
  type: "change" | "warning" | "opportunity" | "context"
}

interface PanoramaDeDiaProps {
  items?: PanoramaItem[]
  isLoading?: boolean
}

export function PanoramadelDia({ 
  items = [
    {
      title: "IPC sorprende al alza",
      description: "Presión inflacionaria mayor a la esperada. Puede influir en tasas y decisiones de consumo.",
      importance: "high",
      type: "change"
    },
    {
      title: "Dólar sube 0.8%",
      description: "Movimiento moderado. Mercado laboral exportador se fortalece.",
      importance: "high",
      type: "change"
    },
    {
      title: "Mercado laboral se enfría",
      description: "Tasas de contratación bajan 2.3%. Competencia aumenta en roles junior.",
      importance: "high",
      type: "warning"
    },
    {
      title: "Sectores tech muestran más movimiento",
      description: "IA y fintech concentran 65% de inversiones. Mayor demanda por competencias digitales.",
      importance: "medium",
      type: "opportunity"
    }
  ],
  isLoading = false
}: PanoramaDeDiaProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "change":
        return <TrendingUp className="w-5 h-5 text-blue-500" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-amber-500" />
      case "opportunity":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      default:
        return <TrendingDown className="w-5 h-5 text-slate-500" />
    }
  }

  const getColorClasses = (importance: string) => {
    switch (importance) {
      case "high":
        return "border-l-4 border-l-red-500 bg-red-500/5"
      case "medium":
        return "border-l-4 border-l-amber-500 bg-amber-500/5"
      default:
        return "border-l-4 border-l-slate-300 bg-slate-500/5"
    }
  }

  return (
    <Card className="border-0 bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Panorama del Día</CardTitle>
          <Badge variant="outline">Editorial</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Qué cambió hoy, qué importa de verdad, y qué es ruido
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg transition-colors ${getColorClasses(item.importance)}`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(item.type)}
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
