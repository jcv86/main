"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sparkles, Target, Briefcase, TrendingUp } from "lucide-react"

interface DISCContextFormProps {
  onSubmit: (context: UserContext) => void
  onSkip: () => void
  attemptNumber: number
}

export interface UserContext {
  current_situation: string
  personal_goals: string
  career_stage: string
  priority_focus: string
}

export function DISCContextForm({ onSubmit, onSkip, attemptNumber }: DISCContextFormProps) {
  const [context, setContext] = useState<UserContext>({
    current_situation: "",
    personal_goals: "",
    career_stage: "exploring",
    priority_focus: "immediate",
  })

  const isFirstTime = attemptNumber === 1

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-blue" />
          <CardTitle>
            {isFirstTime
              ? "¡Bienvenido a tu Informe Despega Cerebral!"
              : `Informe Despega Cerebral - Intento #${attemptNumber}`}
          </CardTitle>
        </div>
        <CardDescription>
          {isFirstTime
            ? "Para personalizar tu informe y hacerlo más útil, cuéntanos un poco sobre tu contexto actual. Esto nos ayudará a darte recomendaciones más precisas."
            : "Actualiza tu contexto para obtener un informe aún más personalizado basado en tu evolución."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Situation */}
        <div className="space-y-2">
          <Label htmlFor="situation" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted/50" />
            ¿En qué momento profesional te encuentras?
          </Label>
          <Textarea
            id="situation"
            placeholder="Ej: Estoy buscando cambiar de área, recién egresado buscando primer empleo, quiero mejorar mi liderazgo..."
            value={context.current_situation}
            onChange={(e) => setContext({ ...context, current_situation: e.target.value })}
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Personal Goals */}
        <div className="space-y-2">
          <Label htmlFor="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted/50" />
            ¿Qué te gustaría lograr en los próximos 3 meses?
          </Label>
          <Textarea
            id="goals"
            placeholder="Ej: Conseguir un ascenso, mejorar mi comunicación con el equipo, desarrollar habilidades de liderazgo..."
            value={context.personal_goals}
            onChange={(e) => setContext({ ...context, personal_goals: e.target.value })}
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Career Stage */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted/50" />
            Etapa de carrera
          </Label>
          <RadioGroup
            value={context.career_stage}
            onValueChange={(value) => setContext({ ...context, career_stage: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="exploring" id="exploring" />
              <Label htmlFor="exploring" className="font-normal cursor-pointer">
                Explorando opciones / Recién egresado
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="early" id="early" />
              <Label htmlFor="early" className="font-normal cursor-pointer">
                Inicio de carrera (0-3 años)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mid" id="mid" />
              <Label htmlFor="mid" className="font-normal cursor-pointer">
                Carrera media (3-7 años)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="senior" id="senior" />
              <Label htmlFor="senior" className="font-normal cursor-pointer">
                Senior / Liderazgo (7+ años)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="transition" id="transition" />
              <Label htmlFor="transition" className="font-normal cursor-pointer">
                En transición / Cambio de carrera
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Priority Focus */}
        <div className="space-y-3">
          <Label>¿Cuál es tu prioridad ahora?</Label>
          <RadioGroup
            value={context.priority_focus}
            onValueChange={(value) => setContext({ ...context, priority_focus: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="immediate" id="immediate" />
              <Label htmlFor="immediate" className="font-normal cursor-pointer">
                Acción inmediata (quiero empezar HOY)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="planning" id="planning" />
              <Label htmlFor="planning" className="font-normal cursor-pointer">
                Planificación (tengo tiempo para organizar)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="exploration" id="exploration" />
              <Label htmlFor="exploration" className="font-normal cursor-pointer">
                Exploración (quiero conocer mis opciones)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button onClick={() => onSubmit(context)} className="flex-1" size="lg">
            Continuar al Informe
          </Button>
          <Button onClick={onSkip} variant="outline" size="lg">
            Saltar por ahora
          </Button>
        </div>

        {!isFirstTime && (
          <p className="text-sm text-muted/50 text-center">
            Este es tu intento #{attemptNumber}. El informe mostrará tu evolución y progreso.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
