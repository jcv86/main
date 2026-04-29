"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Target, Zap, Calendar } from "lucide-react"

interface MilestoneCard {
  days: 30 | 60 | 90
  objetivo: string
  tareas: string[]
  metricas: string[]
  intensidad: "suave" | "moderada" | "alta"
}

interface CanonRouteVisualizationProps {
  mision_30: MilestoneCard
  mision_60: MilestoneCard
  mision_90: MilestoneCard
  masterInsight?: string
  recomendacionesPersonalizadas?: string[]
}

const intensidadColors = {
  suave: { bg: "bg-accent/10 dark:bg-accent/5", border: "border-accent/30 dark:border-accent/40", badge: "bg-accent/20 dark:bg-accent/10 text-foreground" },
  moderada: { bg: "bg-purple/10 dark:bg-purple/5", border: "border-purple/30 dark:border-purple/40", badge: "bg-purple/20 dark:bg-purple/10 text-foreground" },
  alta: { bg: "bg-orange/10/50 dark:bg-orange/30", border: "border-orange/30/50 dark:border-orange/50", badge: "bg-orange/20/70 dark:bg-orange/50 text-orange dark:text-orange/10" }
}

function MilestoneCard({ milestone, index }: { milestone: MilestoneCard; index: number }) {
  const colors = intensidadColors[milestone.intensidad]
  const icons = [Target, Zap, CheckCircle2]
  const IconComponent = icons[index]

  return (
    <div className="relative group">
      {/* Card */}
      <Card className={`${colors.bg} border-2 ${colors.border} transition-all duration-300 hover:shadow-lg`}>
        <CardHeader>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-4xl font-bold text-foreground mb-1">
                Día {milestone.days}
              </div>
              <CardDescription className="text-sm">
                {milestone.days === 30 && "Establecer la base"}
                {milestone.days === 60 && "Profundizar la práctica"}
                {milestone.days === 90 && "Integración completa"}
              </CardDescription>
            </div>
            <div className="p-2 rounded-[28px] bg-muted">
              <IconComponent className="w-5 h-5 text-foreground" />
            </div>
          </div>

          <div className="flex gap-2">
            <Badge variant="outline" className={colors.badge}>
              {milestone.intensidad}
            </Badge>
            <Badge variant="outline">
              {milestone.tareas.length} tareas clave
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Objetivo */}
          <div>
            <h4 className="font-semibold text-foreground mb-2">Objetivo Principal</h4>
            <p className="text-sm text-muted-foreground">
              {milestone.objetivo}
            </p>
          </div>

          {/* Tareas */}
          <div>
            <h4 className="font-semibold text-foreground mb-2">Tareas Clave</h4>
            <ul className="space-y-2">
              {milestone.tareas.slice(0, 3).map((tarea, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>{tarea}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Métricas */}
          <div className="pt-2 border-t border-muted/20 dark:border-muted/70">
            <h4 className="font-semibold text-muted/90 dark:text-muted/5 mb-2 text-xs">Métricas de Éxito</h4>
            <div className="flex flex-wrap gap-2">
              {milestone.metricas.slice(0, 2).map((metrica, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs"
                >
                  {metrica}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connector */}
      {index < 2 && (
        <div className="hidden lg:block absolute -right-8 top-1/2 w-8 h-0.5 bg-background" />
      )}
    </div>
  )
}

export function CanonRouteVisualization({
  mision_30,
  mision_60,
  mision_90,
  masterInsight,
  recomendacionesPersonalizadas
}: CanonRouteVisualizationProps) {
  return (
    <div className="w-full space-y-8">
      {/* Master Insight */}
      {masterInsight && (
        <Card className="border-2 border-gradient-to-r300300700700 bg-background">
          <CardHeader>
            <CardTitle className="text-2xl text-purple dark:text-purple/10">
              Tu Insight Maestro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-purple dark:text-purple/30 font-semibold leading-relaxed">
              "{masterInsight}"
            </p>
          </CardContent>
        </Card>
      )}

      {/* Milestone Timeline */}
      <div>
        <h3 className="text-2xl font-bold text-muted/90 dark:text-muted/5 mb-6">
          Tu Ruta de 90 Días
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          <MilestoneCard milestone={mision_30} index={0} />
          <MilestoneCard milestone={mision_60} index={1} />
          <MilestoneCard milestone={mision_90} index={2} />
        </div>
      </div>

      {/* Recomendaciones */}
      {recomendacionesPersonalizadas && recomendacionesPersonalizadas.length > 0 && (
        <Card className="bg-blue/5 dark:bg-blue/10 border-blue/20 dark:border-blue">
          <CardHeader>
            <CardTitle className="text-blue dark:text-blue/10">
              Recomendaciones Personalizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recomendacionesPersonalizadas.map((rec, idx) => (
                <li key={idx} className="flex gap-3 text-blue dark:text-blue-300">
                  <div className="w-1.5 h-1.5 rounded-[20px] bg-blue/50 dark:bg-blue/40 flex-shrink-0 mt-2" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
