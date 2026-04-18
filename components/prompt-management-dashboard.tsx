"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, TrendingUp, TrendingDown, Plus, Play, Pause, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PromptVersion {
  id: string
  coach_type: "sofia" | "dani"
  conversation_category: string
  version: string
  system_prompt: string
  welcome_message: string
  is_active: boolean
  is_control: boolean
  created_at: string
  performance?: {
    total_sessions: number
    avg_satisfaction: number
    avg_engagement: number
    action_completion_rate: number
    is_critical: boolean
  }
}

export function PromptManagementDashboard() {
  const [prompts, setPrompts] = useState<PromptVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCoach, setSelectedCoach] = useState<"sofia" | "dani">("sofia")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newVariant, setNewVariant] = useState({
    coach_type: "sofia" as "sofia" | "dani",
    conversation_category: "autoconocimiento",
    version: "",
    system_prompt: "",
    welcome_message: "",
  })

  useEffect(() => {
    fetchPrompts()
  }, [])

  const fetchPrompts = async () => {
    try {
      const response = await fetch("/api/prompt-management")
      const data = await response.json()
      setPrompts(data.prompts || [])
    } catch (error) {
      console.error("Error fetching prompts:", error)
    } finally {
      setLoading(false)
    }
  }

  const createVariant = async () => {
    try {
      const response = await fetch("/api/prompt-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVariant),
      })

      if (response.ok) {
        await fetchPrompts()
        setIsCreateDialogOpen(false)
        setNewVariant({
          coach_type: "sofia",
          conversation_category: "autoconocimiento",
          version: "",
          system_prompt: "",
          welcome_message: "",
        })
      }
    } catch (error) {
      console.error("Error creating variant:", error)
    }
  }

  const toggleVariant = async (id: string, isActive: boolean) => {
    try {
      await fetch("/api/prompt-management", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !isActive }),
      })
      await fetchPrompts()
    } catch (error) {
      console.error("Error toggling variant:", error)
    }
  }

  const publishVariant = async (id: string) => {
    try {
      await fetch("/api/prompt-management/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      await fetchPrompts()
    } catch (error) {
      console.error("Error publishing variant:", error)
    }
  }

  const sofiaPrompts = prompts.filter((p) => p.coach_type === "sofia")
  const daniPrompts = prompts.filter((p) => p.coach_type === "dani")

  const renderPromptCard = (prompt: PromptVersion) => {
    const perf = prompt.performance
    const hasPerformance = perf && perf.total_sessions > 0

    return (
      <Card key={prompt.id} className={prompt.is_control ? "border-blue/50" : ""}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {prompt.version}
                {prompt.is_control && <Badge variant="outline">Control</Badge>}
                {prompt.is_active ? (
                  <Badge className="bg-green-500">Activo</Badge>
                ) : (
                  <Badge variant="secondary">Inactivo</Badge>
                )}
                {perf?.is_critical && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Crítico
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="capitalize">{prompt.conversation_category.replace("_", " ")}</CardDescription>
            </div>
            <div className="flex gap-2">
              {!prompt.is_control && (
                <>
                  <Button size="sm" variant="outline" onClick={() => toggleVariant(prompt.id, prompt.is_active)}>
                    {prompt.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  {hasPerformance && perf.avg_satisfaction > 4.3 && (
                    <Button size="sm" onClick={() => publishVariant(prompt.id)} className="gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Publicar
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasPerformance && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Satisfacción</div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{perf.avg_satisfaction.toFixed(1)}★</span>
                  {perf.avg_satisfaction >= 4.3 ? (
                    <TrendingUp className="h-4 w-4 text-green/50" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red" />
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Engagement</div>
                <div className="text-2xl font-bold">{perf.avg_engagement.toFixed(1)} msg</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Acción Completada</div>
                <div className="text-2xl font-bold">{(perf.action_completion_rate * 100).toFixed(0)}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Sesiones</div>
                <div className="text-2xl font-bold">{perf.total_sessions}</div>
              </div>
            </div>
          )}

          <div>
            <div className="text-sm font-medium mb-1">System Prompt</div>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md max-h-32 overflow-y-auto">
              {prompt.system_prompt}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-1">Mensaje de Bienvenida</div>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{prompt.welcome_message}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return <div className="text-center py-8">Cargando prompts...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Los prompts críticos tienen satisfaction {"<"} 4.3★, action {"<"} 60%, o engagement {"<"} 70%
          </AlertDescription>
        </Alert>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Variante
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Variante de Prompt</DialogTitle>
              <DialogDescription>Crea una nueva versión para hacer A/B testing</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Coach</Label>
                <Select
                  value={newVariant.coach_type}
                  onValueChange={(value: "sofia" | "dani") => setNewVariant({ ...newVariant, coach_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sofia">Sofia</SelectItem>
                    <SelectItem value="dani">Dani</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Categoría</Label>
                <Select
                  value={newVariant.conversation_category}
                  onValueChange={(value) => setNewVariant({ ...newVariant, conversation_category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="autoconocimiento">Autoconocimiento</SelectItem>
                    <SelectItem value="desarrollo_habilidades">Desarrollo de Habilidades</SelectItem>
                    <SelectItem value="orientacion_carrera">Orientación de Carrera</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Versión (ej: v1.1, v2.0)</Label>
                <Input
                  value={newVariant.version}
                  onChange={(e) => setNewVariant({ ...newVariant, version: e.target.value })}
                  placeholder="v1.1"
                />
              </div>

              <div>
                <Label>System Prompt</Label>
                <Textarea
                  value={newVariant.system_prompt}
                  onChange={(e) => setNewVariant({ ...newVariant, system_prompt: e.target.value })}
                  rows={8}
                  placeholder="Eres Sofia, una coach experta en..."
                />
              </div>

              <div>
                <Label>Mensaje de Bienvenida</Label>
                <Textarea
                  value={newVariant.welcome_message}
                  onChange={(e) => setNewVariant({ ...newVariant, welcome_message: e.target.value })}
                  rows={3}
                  placeholder="¡Hola! Soy Sofia..."
                />
              </div>

              <Button onClick={createVariant} className="w-full">
                Crear Variante
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="sofia" onValueChange={(v) => setSelectedCoach(v as "sofia" | "dani")}>
        <TabsList>
          <TabsTrigger value="sofia">Sofia ({sofiaPrompts.length})</TabsTrigger>
          <TabsTrigger value="dani">Dani ({daniPrompts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="sofia" className="space-y-4">
          {sofiaPrompts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No hay prompts de Sofia</p>
          ) : (
            sofiaPrompts.map(renderPromptCard)
          )}
        </TabsContent>

        <TabsContent value="dani" className="space-y-4">
          {daniPrompts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No hay prompts de Dani</p>
          ) : (
            daniPrompts.map(renderPromptCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PromptManagementDashboard
