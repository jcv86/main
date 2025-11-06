"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, FileText, Settings, Shield, User, Search } from "lucide-react"

interface VersionStats {
  totalPromptVersions: number
  totalAuditLogs: number
  totalContentChanges: number
  totalConfigChanges: number
}

interface RecentActivity {
  action_type: string
  performed_by: string
  created_at: string
}

interface TopContributor {
  email: string
  changes: number
}

interface PromptVersion {
  id: string
  version_name: string
  coach_type: string
  conversation_category: string
  created_at: string
  created_by: string
  is_published: boolean
  notes: string
}

interface AuditLog {
  id: string
  action_type: string
  performed_by: string
  created_at: string
  action_details: any
  ip_address: string
}

interface ContentHistory {
  id: string
  change_type: string
  changed_by: string
  created_at: string
  change_reason: string
  old_values: any
  new_values: any
  license: {
    content_title: string
    content_type: string
  }
}

interface ConfigHistory {
  id: string
  config_key: string
  config_value: any
  updated_by: string
  updated_at: string
  description: string
}

export default function VersionHistoryPage() {
  const [stats, setStats] = useState<VersionStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [topContributors, setTopContributors] = useState<TopContributor[]>([])
  const [promptVersions, setPromptVersions] = useState<PromptVersion[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [contentHistory, setContentHistory] = useState<ContentHistory[]>([])
  const [configHistory, setConfigHistory] = useState<ConfigHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [statsRes, promptsRes, auditRes, contentRes, configRes] = await Promise.all([
        fetch("/api/version-history/stats"),
        fetch("/api/version-history/prompts"),
        fetch("/api/version-history/audit"),
        fetch("/api/version-history/content"),
        fetch("/api/version-history/config"),
      ])

      const statsData = await statsRes.json()
      const promptsData = await promptsRes.json()
      const auditData = await auditRes.json()
      const contentData = await contentRes.json()
      const configData = await configRes.json()

      setStats(statsData.stats)
      setRecentActivity(statsData.recentActivity)
      setTopContributors(statsData.topContributors)
      setPromptVersions(promptsData.versions)
      setAuditLogs(auditData.auditLog)
      setContentHistory(contentData.contentHistory)
      setConfigHistory(configData.configHistory)
    } catch (error) {
      console.error("Error fetching version history:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-CL", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getActionBadgeColor = (action: string) => {
    if (action.includes("create") || action.includes("insert")) return "default"
    if (action.includes("update") || action.includes("modify")) return "secondary"
    if (action.includes("delete") || action.includes("remove")) return "destructive"
    return "outline"
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando historial de versiones...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Historial de Versiones</h1>
          <p className="text-muted-foreground">Tracking detallado de todos los cambios en el sistema</p>
        </div>
        <Button onClick={fetchData} variant="outline">
          <Clock className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Versiones de Prompts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPromptVersions || 0}</div>
            <p className="text-xs text-muted-foreground">Versiones totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logs de Auditoría</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAuditLogs || 0}</div>
            <p className="text-xs text-muted-foreground">Acciones registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cambios de Contenido</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalContentChanges || 0}</div>
            <p className="text-xs text-muted-foreground">Modificaciones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cambios de Config</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalConfigChanges || 0}</div>
            <p className="text-xs text-muted-foreground">Configuraciones</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Top Contributors */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimos 10 cambios en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center gap-2">
                    <Badge variant={getActionBadgeColor(activity.action_type)}>{activity.action_type}</Badge>
                    <span className="text-sm text-muted-foreground">{activity.performed_by}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(activity.created_at)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Contribuidores</CardTitle>
            <CardDescription>Últimos 7 días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topContributors.map((contributor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{contributor.email}</span>
                  </div>
                  <Badge variant="secondary">{contributor.changes} cambios</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed History Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Historial Detallado</CardTitle>
          <CardDescription>Explora todos los cambios por categoría</CardDescription>
          <div className="flex gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar en historial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="create">Creaciones</SelectItem>
                <SelectItem value="update">Actualizaciones</SelectItem>
                <SelectItem value="delete">Eliminaciones</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="prompts" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
              <TabsTrigger value="audit">Auditoría</TabsTrigger>
              <TabsTrigger value="content">Contenido</TabsTrigger>
              <TabsTrigger value="config">Configuración</TabsTrigger>
            </TabsList>

            <TabsContent value="prompts" className="space-y-4">
              {promptVersions.map((version) => (
                <div key={version.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{version.version_name}</h3>
                      {version.is_published && <Badge>Publicado</Badge>}
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDate(version.created_at)}</span>
                  </div>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>Coach: {version.coach_type}</span>
                    <span>•</span>
                    <span>Categoría: {version.conversation_category}</span>
                    <span>•</span>
                    <span>Por: {version.created_by}</span>
                  </div>
                  {version.notes && <p className="text-sm text-muted-foreground">{version.notes}</p>}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="audit" className="space-y-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={getActionBadgeColor(log.action_type)}>{log.action_type}</Badge>
                      <span className="text-sm">{log.performed_by}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDate(log.created_at)}</span>
                  </div>
                  {log.ip_address && <p className="text-xs text-muted-foreground">IP: {log.ip_address}</p>}
                  {log.action_details && (
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                      {JSON.stringify(log.action_details, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              {contentHistory.map((change) => (
                <div key={change.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={getActionBadgeColor(change.change_type)}>{change.change_type}</Badge>
                      <span className="font-semibold">{change.license?.content_title}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDate(change.created_at)}</span>
                  </div>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>Tipo: {change.license?.content_type}</span>
                    <span>•</span>
                    <span>Por: {change.changed_by}</span>
                  </div>
                  {change.change_reason && <p className="text-sm">{change.change_reason}</p>}
                  {(change.old_values || change.new_values) && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {change.old_values && (
                        <div>
                          <p className="font-semibold mb-1">Valores Anteriores:</p>
                          <pre className="bg-muted p-2 rounded overflow-x-auto">
                            {JSON.stringify(change.old_values, null, 2)}
                          </pre>
                        </div>
                      )}
                      {change.new_values && (
                        <div>
                          <p className="font-semibold mb-1">Valores Nuevos:</p>
                          <pre className="bg-muted p-2 rounded overflow-x-auto">
                            {JSON.stringify(change.new_values, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="config" className="space-y-4">
              {configHistory.map((config) => (
                <div key={config.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span className="font-semibold">{config.config_key}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDate(config.updated_at)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{config.description}</p>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Actualizado por: </span>
                    {config.updated_by}
                  </div>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(config.config_value, null, 2)}
                  </pre>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
