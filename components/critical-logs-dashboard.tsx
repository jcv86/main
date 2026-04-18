"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, TrendingDown, MessageSquare, Target, Calendar, User } from "lucide-react"
import Link from "next/link"

interface CriticalData {
  summary: {
    total_critical: number
    low_satisfaction_count: number
    low_engagement_count: number
    low_action_count: number
  }
  critical_by_type: {
    low_satisfaction: any[]
    low_engagement: any[]
    low_action: any[]
  }
  conversations: any[]
}

export function CriticalLogsDashboard() {
  const [data, setData] = useState<CriticalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    fetchCriticalLogs()
  }, [days])

  const fetchCriticalLogs = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/critical-prompts?days=${days}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("[v0] Error fetching critical logs:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue" />
      </div>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted/60">No se pudieron cargar los logs críticos</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted/60">Total Críticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red" />
              <span className="text-3xl font-bold">{data.summary.total_critical}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted/60">Baja Satisfacción</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange" />
              <span className="text-3xl font-bold">{data.summary.low_satisfaction_count}</span>
            </div>
            <p className="text-xs text-muted/50 mt-1">{"< 4.3★"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted/60">Bajo Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange" />
              <span className="text-3xl font-bold">{data.summary.low_engagement_count}</span>
            </div>
            <p className="text-xs text-muted/50 mt-1">{"< 70%"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted/60">Baja Acción</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-red" />
              <span className="text-3xl font-bold">{data.summary.low_action_count}</span>
            </div>
            <p className="text-xs text-muted/50 mt-1">{"< 60%"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        <Button variant={days === 7 ? "default" : "outline"} size="sm" onClick={() => setDays(7)}>
          7 días
        </Button>
        <Button variant={days === 30 ? "default" : "outline"} size="sm" onClick={() => setDays(30)}>
          30 días
        </Button>
        <Button variant={days === 60 ? "default" : "outline"} size="sm" onClick={() => setDays(60)}>
          60 días
        </Button>
      </div>

      {/* Critical Logs by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Logs Críticos por Tipo</CardTitle>
          <CardDescription>Conversaciones que requieren revisión y mejora de prompts</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="satisfaction">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="satisfaction">Baja Satisfacción ({data.summary.low_satisfaction_count})</TabsTrigger>
              <TabsTrigger value="engagement">Bajo Engagement ({data.summary.low_engagement_count})</TabsTrigger>
              <TabsTrigger value="action">Baja Acción ({data.summary.low_action_count})</TabsTrigger>
            </TabsList>

            <TabsContent value="satisfaction" className="space-y-4 mt-4">
              {data.critical_by_type.low_satisfaction.map((metric: any) => (
                <LogCard key={metric.id} metric={metric} issueType="satisfaction" />
              ))}
              {data.critical_by_type.low_satisfaction.length === 0 && (
                <p className="text-center text-muted/50 py-8">No hay logs críticos de este tipo</p>
              )}
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4 mt-4">
              {data.critical_by_type.low_engagement.map((metric: any) => (
                <LogCard key={metric.id} metric={metric} issueType="engagement" />
              ))}
              {data.critical_by_type.low_engagement.length === 0 && (
                <p className="text-center text-muted/50 py-8">No hay logs críticos de este tipo</p>
              )}
            </TabsContent>

            <TabsContent value="action" className="space-y-4 mt-4">
              {data.critical_by_type.low_action.map((metric: any) => (
                <LogCard key={metric.id} metric={metric} issueType="action" />
              ))}
              {data.critical_by_type.low_action.length === 0 && (
                <p className="text-center text-muted/50 py-8">No hay logs críticos de este tipo</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function LogCard({ metric, issueType }: { metric: any; issueType: string }) {
  const session = metric.coaching_sessions

  return (
    <Card className="border-l-4 border-l-red-500">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant={session?.coach_type === "sofia" ? "default" : "secondary"}>
                {session?.coach_type === "sofia" ? "Sofia" : "Dani"}
              </Badge>
              <Badge variant="outline">{session?.conversation_category}</Badge>
              <Badge variant="destructive" className="capitalize">
                {issueType === "satisfaction" && "Baja Satisfacción"}
                {issueType === "engagement" && "Bajo Engagement"}
                {issueType === "action" && "Baja Acción"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted/50">Satisfacción</p>
                <p className="font-semibold">{metric.satisfaction_rating?.toFixed(1) || "N/A"}★</p>
              </div>
              <div>
                <p className="text-muted/50">Engagement</p>
                <p className="font-semibold">{metric.engagement_percentage?.toFixed(0) || "N/A"}%</p>
              </div>
              <div>
                <p className="text-muted/50">Acción</p>
                <p className="font-semibold">{metric.action_completion_percentage?.toFixed(0) || "N/A"}%</p>
              </div>
              <div>
                <p className="text-muted/50">Mensajes</p>
                <p className="font-semibold">{metric.message_count || 0}</p>
              </div>
            </div>

            {metric.satisfaction_feedback && (
              <div className="mt-3 p-3 bg-muted/5 rounded-lg">
                <p className="text-sm text-muted/70">
                  <span className="font-semibold">Feedback:</span> {metric.satisfaction_feedback}
                </p>
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-muted/50 mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(metric.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                Session: {metric.session_id?.slice(0, 8)}...
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href={`/admin/prompt-management?coach=${session?.coach_type}&category=${session?.conversation_category}`}
            >
              <Button size="sm" variant="outline">
                Ver Prompt
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
