"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Trash2, Archive, Clock } from "lucide-react"

export default function DataRetentionPage() {
  const [policies, setPolicies] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [policiesRes, historyRes] = await Promise.all([
        fetch("/api/data-retention/policies"),
        fetch("/api/data-retention/history"),
      ])

      const policiesData = await policiesRes.json()
      const historyData = await historyRes.json()

      setPolicies(policiesData.policies || [])
      setHistory(historyData.history || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "essential":
        return "bg-blue/50"
      case "operational":
        return "bg-green/50"
      case "analytics":
        return "bg-purple/50"
      case "temporary":
        return "bg-orange"
      case "cache":
        return "bg-muted/50"
      default:
        return "bg-muted/40"
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      essential: "Esencial",
      operational: "Operacional",
      analytics: "Analítico",
      temporary: "Temporal",
      cache: "Caché",
    }
    return labels[category] || category
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando políticas de retención...</p>
        </div>
      </div>
    )
  }

  const totalDeleted = history.reduce((sum, h) => sum + (h.records_deleted || 0), 0)
  const totalArchived = history.reduce((sum, h) => sum + (h.records_archived || 0), 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Políticas de Retención de Datos</h1>
        <p className="text-muted-foreground">Gestión y automatización de limpieza de datos según tipo y antigüedad</p>
      </div>

      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="policies">Políticas ({policies.length})</TabsTrigger>
          <TabsTrigger value="history">Historial ({history.length})</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          <div className="grid gap-4">
            {policies.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{policy.policy_name}</CardTitle>
                      <CardDescription>{policy.description}</CardDescription>
                    </div>
                    <Badge className={getCategoryColor(policy.category)}>{getCategoryLabel(policy.category)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Tabla</p>
                      <p className="font-medium">{policy.table_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Retención</p>
                      <p className="font-medium">{policy.retention_days} días</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Auto-limpieza</p>
                      <p className="font-medium">{policy.auto_cleanup_enabled ? " Activa" : "✗ Inactiva"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Eliminado</p>
                      <p className="font-medium">{policy.total_deleted || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Limpieza</CardTitle>
              <CardDescription>Últimas 50 ejecuciones de limpieza de datos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {history.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{item.table_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.cleanup_date).toLocaleString("es-ES")}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground">Eliminados</p>
                        <p className="font-medium">{item.records_deleted}</p>
                      </div>
                      {item.records_archived > 0 && (
                        <div className="text-center">
                          <p className="text-muted-foreground">Archivados</p>
                          <p className="font-medium">{item.records_archived}</p>
                        </div>
                      )}
                      <Badge variant={item.status === "success" ? "default" : "destructive"}>{item.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Políticas Activas</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{policies.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Eliminado</CardTitle>
                <Trash2 className="h-4 w-4 text-[rgb(80,160,170)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDeleted.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Archivado</CardTitle>
                <Archive className="h-4 w-4 text-blue/50" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalArchived.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ejecuciones</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{history.length}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
