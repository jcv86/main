"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertTriangle, TrendingUp, Volume2, Eye, Smile } from "lucide-react"

interface BehavioralFeedbackProps {
  observations: any
  emotionalState: any
  performanceScore: number
}

export function A3BehavioralFeedback({ observations, emotionalState, performanceScore }: BehavioralFeedbackProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green"
    if (score >= 60) return "text-amber-600"
    return "text-red"
  }

  return (
    <div className="space-y-6">
      {/* Overall Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Desempeño General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-5xl font-bold text-center mb-4">
            <span className={getScoreColor(performanceScore)}>{performanceScore}%</span>
          </div>
          <div className="bg-muted/20 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-red-500 to-green-500 h-3 rounded-full transition-all"
              style={{ width: `${performanceScore}%` }}
            />
          </div>
          <div className="text-center text-sm text-muted/60">
            {performanceScore >= 80 ? "Excelente desempeño" :
             performanceScore >= 60 ? "Buen desempeño, con áreas de mejora" :
             "Necesitas más práctica"}
          </div>
        </CardContent>
      </Card>

      {/* Visual Signals */}
      <Card>
        <CardHeader 
          className="cursor-pointer"
          onClick={() => setExpandedSection(expandedSection === "visual" ? null : "visual")}
        >
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Señales Visuales
            {expandedSection === "visual" ? "▼" : "▶"}
          </CardTitle>
        </CardHeader>
        {expandedSection === "visual" && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/5 rounded">
                <div className="text-sm text-muted/60">Contacto Visual</div>
                <div className={`text-2xl font-bold ${getScoreColor(observations?.eye_contact_percentage)}`}>
                  {observations?.eye_contact_percentage}%
                </div>
              </div>
              <div className="p-3 bg-muted/5 rounded">
                <div className="text-sm text-muted/60">Rigidez Postural</div>
                <div className={`text-2xl font-bold ${getScoreColor(100 - (observations?.postura_rigidez_score || 0))}`}>
                  {100 - (observations?.postura_rigidez_score || 0)}%
                </div>
              </div>
            </div>
            <div className="p-3 bg-blue/5 border border-blue/20 rounded">
              <div className="text-sm font-medium mb-2">Observaciones</div>
              <p className="text-sm text-muted">{observations?.postura_changes}</p>
              <p className="text-sm text-muted mt-2">{observations?.eye_contact_pattern}</p>
            </div>
            {observations?.repetitive_movements?.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Detectamos movimientos repetitivos. Esto puede indicar nervios. Practica mantener manos y brazos quietos.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        )}
      </Card>

      {/* Voice & Tone */}
      <Card>
        <CardHeader 
          className="cursor-pointer"
          onClick={() => setExpandedSection(expandedSection === "voice" ? null : "voice")}
        >
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Voz y Tono
            {expandedSection === "voice" ? "▼" : "▶"}
          </CardTitle>
        </CardHeader>
        {expandedSection === "voice" && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/5 rounded">
                <div className="text-sm text-muted/60">Confianza en Tono</div>
                <div className={`text-2xl font-bold ${getScoreColor(observations?.tone_confidence)}`}>
                  {observations?.tone_confidence}%
                </div>
              </div>
              <div className="p-3 bg-muted/5 rounded">
                <div className="text-sm text-muted/60">Velocidad de Habla</div>
                <Badge variant="outline">{observations?.speech_speed?.replace("_", " ")}</Badge>
              </div>
            </div>
            <Alert>
              <AlertDescription>
                Detectamos {observations?.voice_breaks_count} quiebres en la voz. Esto es normal bajo presión.
              </AlertDescription>
            </Alert>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded">
              <div className="text-sm font-medium mb-2">Recomendación</div>
              <p className="text-sm text-muted">
                Practica respiración profunda antes de responder preguntas difíciles. Pausa 2-3 segundos antes de empezar.
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Verbal Patterns */}
      <Card>
        <CardHeader 
          className="cursor-pointer"
          onClick={() => setExpandedSection(expandedSection === "verbal" ? null : "verbal")}
        >
          <CardTitle className="flex items-center gap-2">
            <Smile className="w-5 h-5" />
            Patrones Verbales
            {expandedSection === "verbal" ? "▼" : "▶"}
          </CardTitle>
        </CardHeader>
        {expandedSection === "verbal" && (
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-muted/5 rounded">
                <div className="text-sm text-muted/60 mb-1">Muletillas Detectadas</div>
                <div className="flex flex-wrap gap-2">
                  {observations?.verbal_fillers?.map((filler: string, idx: number) => (
                    <Badge key={idx} variant="secondary">{filler}</Badge>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-muted/5 rounded">
                <div className="text-sm text-muted/60 mb-2">Enfoque de Respuestas</div>
                <Badge className={
                  observations?.response_focus === "muy_enfocada" ? "bg-green" :
                  observations?.response_focus === "enfocada" ? "bg-green/50" :
                  observations?.response_focus === "dispersa" ? "bg-amber-600" :
                  "bg-red"
                }>
                  {observations?.response_focus?.replace("_", " ")}
                </Badge>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                <div className="text-sm font-medium mb-2">Área a Trabajar</div>
                <p className="text-sm text-muted">
                  Ciertas respuestas fueron muy largas. Practica la regla: responde en 60-90 segundos máximo.
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Silencios & Blocks */}
      <Card>
        <CardHeader>
          <CardTitle>Silencios y Bloqueos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {observations?.silence_count > 0 ? (
            <div className="p-3 bg-orange/5 border border-orange/20 rounded">
              <div className="font-medium text-sm mb-2">Detectamos {observations?.silence_count} silencios prolongados</div>
              <p className="text-sm text-muted">
                Los silencios son datos valiosos. Indican que el usuario está pensando. La regla: pausas de 2-3 segundos son normales. 
                Más de 5 segundos requiere práctica en pensar en voz alta.
              </p>
            </div>
          ) : (
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green" />
              <AlertDescription>
                Excelente fluidez sin bloqueos prolongados.
              </AlertDescription>
            </Alert>
          )}

          {observations?.blank_outs_count > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Perdiste la concentración {observations?.blank_outs_count} veces. Practica técnicas de anclaje mental.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Emotional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Manejo Emocional</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/5 rounded">
              <div className="text-sm text-muted/60">Ansiedad Inicial</div>
              <div className="text-2xl font-bold">{emotionalState?.anxiety_level_pre}%</div>
            </div>
            <div className="p-3 bg-muted/5 rounded">
              <div className="text-sm text-muted/60">Pico Máximo</div>
              <div className="text-2xl font-bold text-red">{emotionalState?.max_anxiety_during}%</div>
            </div>
          </div>

          {emotionalState?.frustration_detected && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Detectamos frustración durante {emotionalState?.frustration_timing}. 
                Esto es normal. La clave es recuperarse rápidamente.
              </AlertDescription>
            </Alert>
          )}

          <div className="p-3 bg-green/5 border border-green/20 rounded">
            <div className="text-sm font-medium mb-2">Fortaleza Emocional</div>
            <p className="text-sm text-muted">
              Capacidad de regulación: {emotionalState?.emotional_regulation_score}%. 
              Recuperación post-error: {emotionalState?.recovery_after_mistake_score}%.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
