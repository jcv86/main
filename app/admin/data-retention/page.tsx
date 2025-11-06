"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Archive, Clock, AlertTriangle, CheckCircle2, Play, Settings, History, BarChart3 } from "lucide-react"

export default function DataRetentionPage() {
  const [policies, setPolicies] = useState<any[]>([])
  const [needingCleanup, setNeedingCleanup] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [summary, setSummary] = useState<any[]>([])
  const [archivedStats, setArchivedStats] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [executing, setExecuting] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [policiesRes, cleanupRes, historyRes, summaryRes, statsRes] = await Promise.all([
        fetch("/api/retention/policies"),
        fetch("/api/retention/needing-cleanup"),
        fetch("/api/retention/history"),
        fetch("/api/retention/summary"),
        fetch("/api/retention/archived-stats"),
      ])

      setPolicies(await policiesRes.json())
      setNeedingCleanup(await cleanupRes.json())
      setHistory(await historyRes.json())
      setSummary(await summaryRes.json())
      setArchivedStats(await statsRes.json())
    } catch (error) {
      console.error("Error fetching retention data:", error)
    } finally {
      setLoading(false)
    }
  }

  const executeCleanup = async (policyId: string, dryRun = false) => {
    setExecuting(policyId)
    try {
      const res = await fetch("/api/retention/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policyId, dryRun }),
      })

      if (!res.ok) throw new Error("Cleanup failed")

      await fetchData()
      alert(dryRun ? "Dry run completed" : "Cleanup completed successfully")
    } catch (error) {
      console.error("Error executing cleanup:", error)
      alert("Error executing cleanup")
    } finally {
      setExecuting(null)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      essential: "bg-blue-500",
      operational: "bg-green-500",
      analytical: "bg-yellow-500",
      temporary: "bg-orange-500",
      cache: "bg-red-500",
    }
    return colors[category] || "bg-gray-500"
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      essential: "Esencial",
      operational: "Operacional",
      analytical: "Analítico",
      temporary: "Temporal",
      cache: "Cache",
    }
    return labels[category] || category
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando políticas de retención...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Políticas de Retención de Datos</h1>
          <p className="text-gray-600 mt-2">Gestión y limpieza automática de datos según políticas de retención</p>
        </div>
        <Button onClick={() => fetchData()}>Actualizar</Button>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Políticas</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.length}</div>
            <p className="text-xs text-muted-foreground">
              {policies.filter((p) => p.auto_cleanup_enabled).length} con limpieza automática
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Necesitan Limpieza</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{needingCleanup.length}</div>
            <p className="text-xs text-muted-foreground">Políticas pendientes de ejecutar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Datos Archivados</CardTitle>
            <Archive className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(archivedStats).reduce((sum: number, stat: any) => sum + stat.count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Registros archivados totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Limpieza</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {history.length > 0 ? new Date(history[0].created_at).toLocaleDateString() : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">{history.length} limpiezas totales</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="policies">
            <Settings className="h-4 w-4 mr-2" />
            Políticas
          </TabsTrigger>
          <TabsTrigger value="cleanup">
            <Play className="h-4 w-4 mr-2" />
            Ejecutar Limpieza
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            Historial
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="h-4 w-4 mr-2" />
            Estadísticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todas las Políticas de Retención</CardTitle>
              <CardDescription>{policies.length} políticas configuradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policies.map((policy) => (
                  <div key={policy.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Database className="h-5 w-5 text-gray-500" />
                        <div>
                          <h3 className="font-semibold">{policy.data_type}</h3>
                          <p className="text-sm text-gray-600">{policy.table_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(policy.retention_category)}>
                          {getCategoryLabel(policy.retention_category)}
                        </Badge>
                        {policy.auto_cleanup_enabled && (
                          <Badge variant="outline" className="bg-green-50">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Auto
                          </Badge>
                        )}
                        {policy.archive_before_delete && (
                          <Badge variant="outline" className="bg-blue-50">
                            <Archive className="h-3 w-3 mr-1" />
                            Archivo
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Retención:</span>
                        <p className="font-medium">{policy.retention_days} días</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Última limpieza:</span>
                        <p className="font-medium">
                          {policy.last_cleanup_at ? new Date(policy.last_cleanup_at).toLocaleDateString() : "Nunca"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Próxima limpieza:</span>
                        <p className="font-medium">
                          {policy.next_cleanup_at ? new Date(policy.next_cleanup_at).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Frecuencia:</span>
                        <p className="font-medium">{policy.cleanup_frequency_days} días</p>
                      </div>
                    </div>

                    {policy.description && <p className="text-sm text-gray-600 mt-2">{policy.description}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cleanup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ejecutar Limpieza de Datos</CardTitle>
              <CardDescription>{needingCleanup.length} políticas necesitan limpieza</CardDescription>
            </CardHeader>
            <CardContent>
              {needingCleanup.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">No hay políticas pendientes de limpieza</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {needingCleanup.map((policy) => (
                    <div key={policy.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{policy.data_type}</h3>
                          <p className="text-sm text-gray-600">
                            Última limpieza: {policy.days_since_last_cleanup} días atrás
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => executeCleanup(policy.id, true)}
                            disabled={executing === policy.id}
                          >
                            Dry Run
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => executeCleanup(policy.id, false)}
                            disabled={executing === policy.id}
                          >
                            {executing === policy.id ? "Ejecutando..." : "Ejecutar"}
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Retención: {policy.retention_days} días</p>
                        <p>Columna de fecha: {policy.date_column}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Limpiezas</CardTitle>
              <CardDescription>Últimas {history.length} ejecuciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{item.data_type}</h3>
                        <Badge variant={item.status === "completed" ? "default" : "destructive"}>{item.status}</Badge>
                      </div>
                      <span className="text-sm text-gray-600">{new Date(item.created_at).toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Identificados:</span>
                        <p className="font-medium">{item.records_identified}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Archivados:</span>
                        <p className="font-medium">{item.records_archived}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Eliminados:</span>
                        <p className="font-medium">{item.records_deleted}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Duración:</span>
                        <p className="font-medium">{item.duration_ms}ms</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Retención</CardTitle>
              <CardDescription>Resumen por tipo de dato</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary.map((stat) => (
                  <div key={stat.data_type} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{stat.data_type}</h3>
                      <Badge className={getCategoryColor(stat.retention_category)}>
                        {getCategoryLabel(stat.retention_category)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total limpiezas:</span>
                        <p className="font-medium">{stat.total_cleanups || 0}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Registros eliminados:</span>
                        <p className="font-medium">{stat.total_records_deleted || 0}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Registros archivados:</span>
                        <p className="font-medium">{stat.total_records_archived || 0}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Datos Archivados</CardTitle>
              <CardDescription>Por tipo de contenido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(archivedStats).map(([type, stat]: [string, any]) => (
                  <div key={type} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2">
                      <Archive className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{type}</span>
                    </div>
                    <Badge variant="outline">{stat.count} registros</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
