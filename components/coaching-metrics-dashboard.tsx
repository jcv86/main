"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Star, CheckCircle, TrendingUp } from "lucide-react"

interface MetricsAggregates {
  totalSessions: number
  avgEngagement: string
  avgSatisfaction: string
  actionsCompleted: number
  completionRate: string
  meetsEngagementTarget: boolean
  meetsSatisfactionTarget: boolean
  meetsActionTarget: boolean
}

export function CoachingMetricsDashboard() {
  const [aggregates, setAggregates] = useState<MetricsAggregates | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/coaching-metrics")
      if (!response.ok) throw new Error("Error fetching metrics")

      const data = await response.json()
      setAggregates(data.aggregates)
    } catch (error) {
      console.error("[v0] Error fetching metrics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando métricas...</div>
  }

  if (!aggregates) {
    return <div className="text-center py-8">No hay métricas disponibles</div>
  }

  const engagementPercent = Number.parseFloat(aggregates.avgEngagement) * 100
  const satisfactionPercent = (Number.parseFloat(aggregates.avgSatisfaction) / 5) * 100
  const completionPercent = Number.parseFloat(aggregates.completionRate)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Métricas de Coaching</h2>
        <p className="text-muted-foreground">Seguimiento de engagement, satisfacción y acciones completadas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones Totales</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aggregates.totalSessions}</div>
            <p className="text-xs text-muted-foreground">Conversaciones con Sofia & Dani</p>
          </CardContent>
        </Card>

        {/* Engagement */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementPercent.toFixed(0)}%</div>
            <Progress value={engagementPercent} className="mt-2" />
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={aggregates.meetsEngagementTarget ? "default" : "secondary"}>
                {aggregates.meetsEngagementTarget ? " Meta alcanzada" : "En progreso"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Meta: 2+ mensajes por sesión</p>
          </CardContent>
        </Card>

        {/* Satisfaction */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfacción</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aggregates.avgSatisfaction}★</div>
            <Progress value={satisfactionPercent} className="mt-2" />
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={aggregates.meetsSatisfactionTarget ? "default" : "secondary"}>
                {aggregates.meetsSatisfactionTarget ? " Meta alcanzada" : "En progreso"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Meta: 4+ estrellas</p>
          </CardContent>
        </Card>

        {/* Actions Completed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acciones Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aggregates.completionRate}</div>
            <Progress value={completionPercent} className="mt-2" />
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={aggregates.meetsActionTarget ? "default" : "secondary"}>
                {aggregates.meetsActionTarget ? " Meta alcanzada" : "En progreso"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {aggregates.actionsCompleted} de {aggregates.totalSessions} acciones
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Targets Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Metas</CardTitle>
          <CardDescription>Basado en el documento (páginas 61-63)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Engagement (2+ mensajes)</span>
              <Badge variant={aggregates.meetsEngagementTarget ? "default" : "outline"}>
                {aggregates.meetsEngagementTarget ? " Cumplido" : "Pendiente"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Satisfacción (4+ estrellas)</span>
              <Badge variant={aggregates.meetsSatisfactionTarget ? "default" : "outline"}>
                {aggregates.meetsSatisfactionTarget ? " Cumplido" : "Pendiente"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Tasa de Completación (50%+)</span>
              <Badge variant={aggregates.meetsActionTarget ? "default" : "outline"}>
                {aggregates.meetsActionTarget ? " Cumplido" : "Pendiente"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
