"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookOpen, Clock, Zap, CheckCircle2, ArrowRight } from "lucide-react"

interface Module {
  id: string
  titulo: string
  descripcion: string
  contenido_principal: string
  duracion_minutos: number
  puntos: number
  nivel: "basico" | "intermedio" | "avanzado"
  categoria: string
  preguntas_reflexion: string[]
  recursos?: string[]
  casos_estudio?: string[]
}

interface A4LearningModulesProps {
  modules: Module[]
  onCompleteModule?: (moduleId: string, responses: string[]) => void
}

const getNivelColor = (nivel: string) => {
  const colors: Record<string, string> = {
    "basico": "bg-green-100 text-green-800",
    "intermedio": "bg-blue-100 text-blue-800",
    "avanzado": "bg-purple-100 text-purple-800",
  }
  return colors[nivel] || "bg-gray-100"
}

export function A4LearningModules({ modules, onCompleteModule }: A4LearningModulesProps) {
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set())
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [reflexionResponses, setReflexionResponses] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCompleteModule = async () => {
    if (!selectedModule) return

    setIsSubmitting(true)
    try {
      const responses = selectedModule.preguntas_reflexion.map(
        (_, idx) => reflexionResponses[idx] || ""
      )

      onCompleteModule?.(selectedModule.id, responses)
      setCompletedModules(prev => new Set([...prev, selectedModule.id]))
      setReflexionResponses({})
      setSelectedModule(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const groupedByCategory = modules.reduce((acc, module) => {
    if (!acc[module.categoria]) acc[module.categoria] = []
    acc[module.categoria].push(module)
    return acc
  }, {} as Record<string, Module[]>)

  const categories = Object.keys(groupedByCategory)

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-xl">
            📚
          </div>
          <div>
            <h2 className="text-2xl font-bold">Módulos de Contexto Profesional</h2>
            <p className="text-sm text-muted-foreground">
              Aprende sobre mercado, tendencias, y oportunidades profesionales
            </p>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{completedModules.size}</div>
                <div className="text-xs text-muted-foreground">Completados</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{modules.length}</div>
                <div className="text-xs text-muted-foreground">Disponibles</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {completedModules.size * 20}
                </div>
                <div className="text-xs text-muted-foreground">Puntos</div>
              </div>
            </div>
            <Progress
              value={(completedModules.size / modules.length) * 100}
              className="mt-4"
            />
          </CardContent>
        </Card>
      </div>

      {/* Modules by Category */}
      {categories.map(category => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold">{category}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {groupedByCategory[category].map(module => {
              const isCompleted = completedModules.has(module.id)

              return (
                <Dialog key={module.id} open={selectedModule?.id === module.id} onOpenChange={(open) => {
                  if (!open) setSelectedModule(null)
                }}>
                  <DialogTrigger asChild>
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        isCompleted ? "opacity-60 bg-muted" : ""
                      }`}
                      onClick={() => setSelectedModule(module)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-2">
                            <CardTitle className="text-base">{module.titulo}</CardTitle>
                            <CardDescription className="text-sm">
                              {module.descripcion}
                            </CardDescription>
                          </div>
                          {isCompleted && (
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getNivelColor(module.nivel)}>
                            {module.nivel}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {module.duracion_minutos} min
                          </Badge>
                          <Badge className="bg-primary text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            +{module.puntos} pts
                          </Badge>
                        </div>

                        {module.preguntas_reflexion.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {module.preguntas_reflexion.length} preguntas de reflexión
                          </div>
                        )}

                        {!isCompleted && (
                          <Button className="w-full" size="sm">
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Comienza
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </DialogTrigger>

                  {selectedModule?.id === module.id && (
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          {module.titulo}
                        </DialogTitle>
                        <DialogDescription>{module.descripcion}</DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        {/* Main Content */}
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="text-sm whitespace-pre-wrap">
                            {module.contenido_principal}
                          </div>
                        </div>

                        {/* Case Studies */}
                        {module.casos_estudio && module.casos_estudio.length > 0 && (
                          <div className="space-y-3">
                            <div className="font-medium">Casos de Estudio</div>
                            {module.casos_estudio.map((caso, idx) => (
                              <Card key={idx} className="bg-blue-50">
                                <CardContent className="pt-4">
                                  <div className="text-sm">{caso}</div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}

                        {/* Reflection Questions */}
                        {module.preguntas_reflexion.length > 0 && (
                          <div className="space-y-4">
                            <div className="font-medium">Preguntas de Reflexión</div>
                            {module.preguntas_reflexion.map((pregunta, idx) => (
                              <div key={idx} className="space-y-2">
                                <label className="text-sm font-medium">{pregunta}</label>
                                <Textarea
                                  placeholder="Tu respuesta..."
                                  value={reflexionResponses[idx] || ""}
                                  onChange={(e) =>
                                    setReflexionResponses(prev => ({
                                      ...prev,
                                      [idx]: e.target.value
                                    }))
                                  }
                                  rows={3}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={handleCompleteModule}
                            disabled={isSubmitting || (module.preguntas_reflexion.length > 0 && Object.values(reflexionResponses).some(r => !r))}
                            className="flex-1"
                          >
                            {isSubmitting ? "Guardando..." : "Marcar como Completado"}
                            <CheckCircle2 className="w-4 h-4 ml-2" />
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedModule(null)}
                          >
                            Cerrar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
