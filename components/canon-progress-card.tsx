import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, TrendingUp, Target } from "lucide-react"
import { type GeneratedRoute } from "@/lib/canon-rules-engine"

interface CanonProgressCardProps {
  c1Completed: boolean
  c1CompletedAt?: string
  a1Completed: boolean
  a1CompletedAt?: string
  c2Completed: boolean
  c2CompletedAt?: string
  generatedRoute?: GeneratedRoute
}

export function CanonProgressCard({
  c1Completed,
  c1CompletedAt,
  a1Completed,
  a1CompletedAt,
  c2Completed,
  c2CompletedAt,
  generatedRoute
}: CanonProgressCardProps) {
  const totalSteps = c2Completed ? 3 : a1Completed ? 2 : c1Completed ? 1 : 0
  const progress = (totalSteps / 3) * 100

  return (
    <div className="space-y-6">
      {/* Main Progress Card */}
      <Card className="border-0 shadow-lg bg-background">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Target className="w-6 h-6 text-purple dark:text-purple/40" />
            Tu Viaje CANON
          </CardTitle>
          <CardDescription>
            {c2Completed ? "¡Tu ruta está lista!" : "Completa los pasos para generar tu ruta 30/60/90"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-muted-foreground dark:text-white/85">
                Progreso: {totalSteps}/3 pasos
              </span>
              <span className="text-sm font-semibold text-muted-foreground dark:text-white/85">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-muted/20 dark:bg-muted/70 rounded-full h-3 overflow-hidden">
              <div
                className="bg-background"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {/* Step 1: C1 */}
            <div className="flex items-start gap-4 p-4 bg-transparent rounded-lg">
              <div className="flex-shrink-0">
                {c1Completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green dark:text-green/40" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-muted/30 dark:border-muted/60" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-muted/90 dark:text-muted/10">
                  Paso 1: Conozcámonos
                </p>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Captura tu contexto profesional y personal
                </p>
                {c1CompletedAt && (
                  <p className="text-xs text-green dark:text-green/40 mt-1">
                    ✓ Completado {new Date(c1CompletedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Step 2: A1 */}
            <div className="flex items-start gap-4 p-4 bg-transparent rounded-lg">
              <div className="flex-shrink-0">
                {a1Completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green dark:text-green/40" />
                ) : (
                  <div className={`w-6 h-6 rounded-full border-2 ${c1Completed ? "border-purple" : "border-muted/30 dark:border-muted/60"}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-muted/90 dark:text-muted/10">
                  Paso 2: Despega Cerebral
                </p>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Descubre tu patrón natural de liderazgo
                </p>
                {a1CompletedAt && (
                  <p className="text-xs text-green dark:text-green/40 mt-1">
                    ✓ Completado {new Date(a1CompletedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Step 3: C2 */}
            <div className="flex items-start gap-4 p-4 bg-transparent rounded-lg">
              <div className="flex-shrink-0">
                {c2Completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green dark:text-green/40" />
                ) : (
                  <div className={`w-6 h-6 rounded-full border-2 ${a1Completed ? "border-purple" : "border-muted/30 dark:border-muted/60"}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-muted/90 dark:text-muted/10">
                  Paso 3: Tu Ruta Personalizada
                </p>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Plan 30/60/90 adaptado a tu realidad
                </p>
                {c2CompletedAt && (
                  <p className="text-xs text-green dark:text-green/40 mt-1">
                    ✓ Completado {new Date(c2CompletedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Route Summary (if available) */}
      {generatedRoute && c2Completed && (
        <div className="space-y-4">
          {/* Recomendaciones */}
          {generatedRoute.recomendaciones_personalizadas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recomendaciones Personalizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedRoute.recomendaciones_personalizadas.map((rec, idx) => (
                    <li key={idx} className="flex gap-2 text-sm">
                      <span className="text-purple dark:text-purple/40 font-bold">•</span>
                      <span className="text-muted-foreground dark:text-white/85">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Advertencias */}
          {generatedRoute.contradicciones_detectadas.length > 0 && (
            <Card className="border-yellow/20 dark:border-yellow bg-yellow/5 dark:bg-yellow/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow dark:text-orange" />
                  Puntos de Atención
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedRoute.contradicciones_detectadas.map((adv, idx) => (
                    <li key={idx} className="text-sm text-yellow dark:text-yellow-300">
                      {adv}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Factores de Éxito */}
          {generatedRoute.factores_exito.length > 0 && (
            <Card className="border-green/20 dark:border-green">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-green dark:text-green/40">
                  <CheckCircle2 className="w-5 h-5" />
                  Factores de Éxito Detectados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedRoute.factores_exito.map((factor, idx) => (
                    <li key={idx} className="flex gap-2 text-sm">
                      <Badge className="bg-green/10 text-green dark:bg-green dark:text-green/20">
                        ✓
                      </Badge>
                      <span className="text-muted-foreground dark:text-white/85">{factor}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
