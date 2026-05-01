"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Clock, AlertCircle, Sparkles, MessageCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Mission {
  id: string
  titulo: string
  descripcion: string
  dia: number
  tipo: "lectura" | "reflexion" | "accion" | "quiz" | "habito" | "proyecto"
  duracion_minutos: number
  puntos: number
  contenido?: any
}

interface A1MissionExecutorProps {
  pilar: "energia" | "enfoque" | "relaciones" | "plan_ejecutivo"
  misiones: Mission[]
  ciclo: number
  completedMisiones: Set<string>
  onMissionComplete: (misionId: string, respuesta: any, tiempo: number) => void
}

const getTipoConfig = (tipo: string) => {
  const configs: Record<string, { icon: string; color: string; label: string }> = {
    lectura: { icon: "📖", color: "bg-blue/5 border-blue/20", label: "Lectura" },
    reflexion: { icon: "🤔", color: "bg-purple/5 border-purple/20", label: "Reflexión" },
    accion: { icon: "⚡", color: "bg-green/5 border-green/20", label: "Acción" },
    quiz: { icon: "❓", color: "bg-orange/5 border-orange/20", label: "Quiz" },
    habito: { icon: "🔄", color: "bg-indigo-50 border-indigo-200", label: "Hábito" },
    proyecto: { icon: "", color: "bg-pink-50 border-pink-200", label: "Proyecto" },
  }
  return configs[tipo] || configs.accion
}

export function A1MissionExecutor({
  pilar,
  misiones,
  ciclo,
  completedMisiones,
  onMissionComplete,
}: A1MissionExecutorProps) {
  const [selectedMision, setSelectedMision] = useState<Mission | null>(null)
  const [misionResponse, setMisionResponse] = useState("")
  const [misionTime, setMisionTime] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitMision = async () => {
    if (!selectedMision) return
    
    setIsSubmitting(true)
    try {
      await onMissionComplete(selectedMision.id, {
        respuesta: misionResponse,
        tiempo_dedicado: misionTime,
      }, misionTime)
      
      setMisionResponse("")
      setMisionTime(0)
      setSelectedMision(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const completedCount = misiones.filter(m => completedMisiones.has(m.id)).length
  const totalPoints = misiones.reduce((acc, m) => acc + m.puntos, 0)
  const completedPoints = misiones
    .filter(m => completedMisiones.has(m.id))
    .reduce((acc, m) => acc + m.puntos, 0)

  return (
    <div className="w-full space-y-6">
      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Progreso del Ciclo {ciclo} Días</span>
            <Badge variant="outline">{completedCount}/{misiones.length} completadas</Badge>
          </CardTitle>
          <CardDescription>
            {completedPoints} de {totalPoints} puntos ganados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={(completedCount / misiones.length) * 100} className="h-3" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-purple">{completedCount}</div>
              <div className="text-sm text-muted-foreground">Misiones completadas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green">{completedPoints}</div>
              <div className="text-sm text-muted-foreground">Puntos acumulados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mission Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Misiones Disponibles</h3>
        <div className="grid gap-3">
          {misiones.map((mision) => {
            const isCompleted = completedMisiones.has(mision.id)
            const tipoConfig = getTipoConfig(mision.tipo)

            return (
              <Card
                key={mision.id}
                className={`cursor-pointer transition-all hover:shadow-md ${`}
                  isCompleted ? "opacity-60 bg-muted" : tipoConfig.color`}
                } border`}
              >
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{tipoConfig.icon}</span>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {mision.titulo}
                            {isCompleted && <CheckCircle2 className="w-4 h-4 text-green" />}
                          </div>
                          <div className="text-sm text-muted-foreground">{mision.descripcion}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {mision.duracion_minutos} min
                        </Badge>
                        <Badge className="text-xs">
                          +{mision.puntos} pts
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          Día {mision.dia}
                        </Badge>
                      </div>
                    </div>

                    {!isCompleted ? (
                      <Dialog open={selectedMision?.id === mision.id} onOpenChange={(open) => {
                        if (!open) setSelectedMision(null)
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => setSelectedMision(mision)}
                            className="flex-shrink-0"
                          >
                            Empezar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <span>{tipoConfig.icon}</span>
                              {mision.titulo}
                            </DialogTitle>
                            <DialogDescription>
                              {mision.descripcion}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            {/* Mission Details */}
                            <Card className="bg-muted">
                              <CardContent className="pt-6">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                  <div>
                                    <div className="text-sm text-muted-foreground">Tipo</div>
                                    <div className="font-medium capitalize">{mision.tipo}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Duración</div>
                                    <div className="font-medium">{mision.duracion_minutos} min</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Puntos</div>
                                    <div className="font-medium text-purple">+{mision.puntos}</div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Time Input */}
                            <div>
                              <label className="text-sm font-medium">
                                ¿Cuántos minutos dedicaste? (aprox: {mision.duracion_minutos})
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="180"
                                value={misionTime}
                                onChange={(e) => setMisionTime(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full mt-2 px-3 py-2 border rounded-md"
                              />
                            </div>

                            {/* Response Area */}
                            {(mision.tipo === "reflexion" || mision.tipo === "proyecto") && (
                              <div>
                                <label className="text-sm font-medium">
                                  ¿Qué observaste o aprendiste?
                                </label>
                                <Textarea
                                  placeholder="Comparte tu reflexión, resultado o aprendizaje..."
                                  value={misionResponse}
                                  onChange={(e) => setMisionResponse(e.target.value)}
                                  className="mt-2"
                                  rows={4}
                                />
                              </div>
                            )}

                            {/* Submit Buttons */}
                            <div className="flex gap-2 pt-4">
                              <Button
                                onClick={handleSubmitMision}
                                disabled={isSubmitting || misionTime === 0}
                                className="flex-1"
                              >
                                {isSubmitting ? "Guardando..." : "Marcar como Completada"}
                                <CheckCircle2 className="w-4 h-4 ml-2" />
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setSelectedMision(null)}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Badge className="bg-green/10 text-green flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Completada
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Coaching Tip */}
      <Card className="bg-blue/5 border-blue/20">
        <CardContent className="pt-6 flex gap-4">
          <Sparkles className="w-5 h-5 text-blue flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-blue mb-1">Consejo del Coach</div>
            <div className="text-sm text-blue">
              La consistencia es clave. Completa al menos 1 misión diaria para mantener el momentum y ver resultados en 30 días.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
