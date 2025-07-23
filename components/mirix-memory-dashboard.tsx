"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Brain,
  Search,
  Trash2,
  Eye,
  Tag,
  TrendingUp,
  MessageSquare,
  Target,
  Lightbulb,
  Settings,
  BarChart3,
  Clock,
  Star,
} from "lucide-react"
import type { MirixMemory, MemoryType, ImportanceLevel } from "@/lib/mirix-memory"

interface MemoryStats {
  total_memories: number
  by_type: Record<MemoryType, number>
  by_importance: Record<ImportanceLevel, number>
  total_access_count: number
  recent_memories: number
}

const memoryTypeIcons = {
  conversation: MessageSquare,
  preference: Star,
  insight: Lightbulb,
  goal: Target,
  context: Settings,
}

const memoryTypeColors = {
  conversation: "bg-blue-100 text-blue-800",
  preference: "bg-purple-100 text-purple-800",
  insight: "bg-yellow-100 text-yellow-800",
  goal: "bg-green-100 text-green-800",
  context: "bg-gray-100 text-gray-800",
}

const importanceColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
}

export function MirixMemoryDashboard({ userId }: { userId?: string }) {
  const [memories, setMemories] = useState<MirixMemory[]>([])
  const [stats, setStats] = useState<MemoryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<MemoryType | "all">("all")
  const [selectedImportance, setSelectedImportance] = useState<ImportanceLevel | "all">("all")
  const [selectedMemory, setSelectedMemory] = useState<MirixMemory | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Generate a consistent user ID for demo purposes
  const demoUserId = userId || crypto.randomUUID()

  useEffect(() => {
    loadData()
  }, [demoUserId])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Load memories
      const memoriesResponse = await fetch(`/api/mirix?action=memories&user_id=${demoUserId}&limit=100`)
      if (!memoriesResponse.ok) {
        throw new Error(`HTTP error! status: ${memoriesResponse.status}`)
      }
      const memoriesData = await memoriesResponse.json()

      // Load stats
      const statsResponse = await fetch(`/api/mirix?action=stats&user_id=${demoUserId}`)
      if (!statsResponse.ok) {
        throw new Error(`HTTP error! status: ${statsResponse.status}`)
      }
      const statsData = await statsResponse.json()

      setMemories(memoriesData.memories || [])
      setStats(statsData.stats || null)
    } catch (error) {
      console.error("Error loading Mirix data:", error)
      setError("Error loading data. Please try again.")

      // Set empty data as fallback
      setMemories([])
      setStats({
        total_memories: 0,
        by_type: { conversation: 0, preference: 0, insight: 0, goal: 0, context: 0 },
        by_importance: { low: 0, medium: 0, high: 0, critical: 0 },
        total_access_count: 0,
        recent_memories: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredMemories = memories.filter((memory) => {
    const matchesSearch =
      searchTerm === "" ||
      memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = selectedType === "all" || memory.memory_type === selectedType
    const matchesImportance = selectedImportance === "all" || memory.importance === selectedImportance

    return matchesSearch && matchesType && matchesImportance
  })

  const handleDeleteMemory = async (memoryId: string) => {
    try {
      const response = await fetch(`/api/mirix?memory_id=${memoryId}&user_id=${demoUserId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMemories(memories.filter((m) => m.id !== memoryId))
        if (selectedMemory?.id === memoryId) {
          setSelectedMemory(null)
        }
      } else {
        throw new Error("Failed to delete memory")
      }
    } catch (error) {
      console.error("Error deleting memory:", error)
      setError("Error deleting memory. Please try again.")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={loadData} variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            Sistema Mirix
          </h1>
          <p className="text-gray-600 mt-1">Memoria Inteligente para Agentes de IA</p>
          <p className="text-xs text-gray-500 mt-1">Usuario: {demoUserId.substring(0, 8)}...</p>
        </div>
        <Button onClick={loadData} variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Memorias</p>
                  <p className="text-2xl font-bold">{stats.total_memories}</p>
                </div>
                <Brain className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Accesos Totales</p>
                  <p className="text-2xl font-bold">{stats.total_access_count}</p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recientes</p>
                  <p className="text-2xl font-bold">{stats.recent_memories}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Críticas</p>
                  <p className="text-2xl font-bold">{stats.by_importance.critical}</p>
                </div>
                <Star className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Objetivos</p>
                  <p className="text-2xl font-bold">{stats.by_type.goal}</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="memories" className="w-full">
        <TabsList>
          <TabsTrigger value="memories">Memorias</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="memories" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar en memorias..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedType} onValueChange={(value) => setSelectedType(value as MemoryType | "all")}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tipo de memoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="conversation">Conversaciones</SelectItem>
                    <SelectItem value="preference">Preferencias</SelectItem>
                    <SelectItem value="insight">Insights</SelectItem>
                    <SelectItem value="goal">Objetivos</SelectItem>
                    <SelectItem value="context">Contexto</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedImportance}
                  onValueChange={(value) => setSelectedImportance(value as ImportanceLevel | "all")}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Importancia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las importancias</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="low">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Memories List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Memorias ({filteredMemories.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <div className="space-y-2 p-4">
                    {filteredMemories.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No se encontraron memorias</p>
                        <p className="text-sm">Intenta ajustar los filtros o crear nuevas memorias</p>
                      </div>
                    ) : (
                      filteredMemories.map((memory) => {
                        const TypeIcon = memoryTypeIcons[memory.memory_type]
                        return (
                          <div
                            key={memory.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedMemory?.id === memory.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                            }`}
                            onClick={() => setSelectedMemory(memory)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <TypeIcon className="h-4 w-4" />
                                <h4 className="font-medium text-sm">{memory.title}</h4>
                              </div>
                              <div className="flex items-center gap-1">
                                <Badge className={`text-xs ${memoryTypeColors[memory.memory_type]}`}>
                                  {memory.memory_type}
                                </Badge>
                                <Badge className={`text-xs ${importanceColors[memory.importance]}`}>
                                  {memory.importance}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{memory.content}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{formatDate(memory.created_at)}</span>
                              <div className="flex items-center gap-2">
                                <Eye className="h-3 w-3" />
                                <span>{memory.access_count}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Memory Detail */}
            <Card>
              <CardHeader>
                <CardTitle>Detalle de Memoria</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedMemory ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedMemory.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={memoryTypeColors[selectedMemory.memory_type]}>
                          {selectedMemory.memory_type}
                        </Badge>
                        <Badge className={importanceColors[selectedMemory.importance]}>
                          {selectedMemory.importance}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Contenido</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMemory.content}</p>
                    </div>

                    {selectedMemory.tags.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedMemory.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Creado:</span>
                        <p className="text-gray-600">{formatDate(selectedMemory.created_at)}</p>
                      </div>
                      <div>
                        <span className="font-medium">Accesos:</span>
                        <p className="text-gray-600">{selectedMemory.access_count}</p>
                      </div>
                      <div>
                        <span className="font-medium">Agente:</span>
                        <p className="text-gray-600">{selectedMemory.agent_id}</p>
                      </div>
                      {selectedMemory.last_accessed_at && (
                        <div>
                          <span className="font-medium">Último acceso:</span>
                          <p className="text-gray-600">{formatDate(selectedMemory.last_accessed_at)}</p>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteMemory(selectedMemory.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Selecciona una memoria para ver los detalles</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Tipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.by_type).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {React.createElement(memoryTypeIcons[type as MemoryType], { className: "h-4 w-4" })}
                          <span className="capitalize">{type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${stats.total_memories > 0 ? (count / stats.total_memories) * 100 : 0}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Importancia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.by_importance).map(([importance, count]) => (
                      <div key={importance} className="flex items-center justify-between">
                        <span className="capitalize">{importance}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-600 h-2 rounded-full"
                              style={{
                                width: `${stats.total_memories > 0 ? (count / stats.total_memories) * 100 : 0}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Sistema</CardTitle>
              <CardDescription>Gestiona la configuración de memoria del sistema Mirix</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Limpieza Automática</h4>
                  <p className="text-sm text-gray-600">Eliminar memorias expiradas automáticamente</p>
                </div>
                <Button variant="outline">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpiar Ahora
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Exportar Memorias</h4>
                  <p className="text-sm text-gray-600">Descargar todas las memorias en formato JSON</p>
                </div>
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
