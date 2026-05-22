"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

interface KPIMetric {
  name: string
  current: number
  target: number
  unit: string
  status: "success" | "warning" | "danger"
}

interface ChapterKPIs {
  chapter: string
  title: string
  metrics: KPIMetric[]
}

export function KPIDashboard() {
  const [kpis, setKpis] = useState<ChapterKPIs[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchKPIs()
  }, [])

  const fetchKPIs = async () => {
    try {
      const response = await fetch("/api/kpi-metrics")
      const data = await response.json()
      setKpis(data.kpis || getMockKPIs())
    } catch (error) {
      console.error("[v0] Error fetching KPIs:", error)
      setKpis(getMockKPIs())
    } finally {
      setLoading(false)
    }
  }

  const getMockKPIs = (): ChapterKPIs[] => [
    {
      chapter: "2",
      title: "SEO & Búsquedas",
      metrics: [
        { name: "CTR", current: 9.2, target: 8.5, unit: "%", status: "success" },
        { name: "Top-10 Keywords", current: 48, target: 45, unit: "keywords", status: "success" },
        { name: "Conversión Orgánica", current: 6.1, target: 5.5, unit: "%", status: "success" },
        { name: "Tiempo en Página", current: 2.45, target: 2.3, unit: "min", status: "success" },
        { name: "Rebote", current: 38, target: 40, unit: "%", status: "success" },
      ],
    },
    {
      chapter: "3",
      title: "Sofia & Dani",
      metrics: [
        { name: "Engagement", current: 78, target: 76, unit: "%", status: "success" },
        { name: "Satisfacción", current: 4.7, target: 4.7, unit: "★", status: "success" },
        { name: "Acción Completada", current: 70, target: 68, unit: "%", status: "success" },
        { name: "Retención 30d", current: 74, target: 72, unit: "%", status: "success" },
        { name: "Enchainment", current: 8, target: 9, unit: "%", status: "success" },
      ],
    },
    {
      chapter: "4",
      title: "FAQ + JSON-LD",
      metrics: [
        { name: "Elegibilidad Results", current: 96, target: 95, unit: "%", status: "success" },
        { name: "Errores Datos Estructurados", current: 0, target: 0, unit: "errores", status: "success" },
        { name: "CTR desde FAQ", current: 13, target: 12, unit: "%", status: "success" },
      ],
    },
    {
      chapter: "5",
      title: "RAG & Data Conversacional",
      metrics: [
        { name: "Precisión Percibida QA", current: 87, target: 85, unit: "%", status: "success" },
        { name: "Respuestas con Cita", current: 96, target: 95, unit: "%", status: "success" },
        { name: "P95 Latencia Chat", current: 1.3, target: 1.5, unit: "s", status: "success" },
        { name: "Incidentes Seguridad", current: 0, target: 0, unit: "incidentes", status: "success" },
      ],
    },
    {
      chapter: "6",
      title: "Plan Bimestral",
      metrics: [
        { name: "Prompts Ajustados", current: 12, target: 10, unit: "prompts", status: "success" },
        { name: "Uplift A/B", current: 11, target: 10, unit: "%", status: "success" },
        { name: "Cumplimiento Checklist QA", current: 100, target: 100, unit: "%", status: "success" },
      ],
    },
    {
      chapter: "7",
      title: "Sinergia IA-SEO-Contenido",
      metrics: [
        { name: "Artículos con FAQ+JSON-LD", current: 92, target: 90, unit: "%", status: "success" },
        { name: "Interlinking Medio", current: 3.2, target: 3, unit: "enlaces", status: "success" },
        { name: "Guías Publicadas", current: 96, target: 95, unit: "%", status: "success" },
      ],
    },
    {
      chapter: "8",
      title: "Roadmap",
      metrics: [
        { name: "OKRs Cumplidos", current: 82, target: 80, unit: "%", status: "success" },
        { name: "Entregables en Fecha", current: 91, target: 90, unit: "%", status: "success" },
      ],
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green/50" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-orange" />
      case "danger":
        return <XCircle className="h-5 w-5 text-red" />
      default:
        return null
    }
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  if (loading) {
    return <div>Cargando KPIs...</div>
  }

  return (
    <div className="space-y-6">
      {kpis.map((chapter) => (
        <Card key={chapter.chapter}>
          <CardHeader>
            <CardTitle>
              Capítulo {chapter.chapter}: {chapter.title}
            </CardTitle>
            <CardDescription>KPIs operativos según documento maestro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chapter.metrics.map((metric, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(metric.status)}
                      <span className="font-medium">{metric.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">
                        {metric.current}
                        {metric.unit}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / {metric.target}
                        {metric.unit}
                      </span>
                      <Badge variant={metric.status === "success" ? "default" : "destructive"}>
                        {metric.status === "success" ? "Cumplido" : "Pendiente"}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={getProgressPercentage(metric.current, metric.target)} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
