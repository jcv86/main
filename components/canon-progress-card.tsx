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
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Progreso: {totalSteps}/3 pasos
              </span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {/* Step 1: C1 */}
            <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg">
              <div className="flex-shrink-0">
                {c1Completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Paso 1: Conozcámonos
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Captura tu contexto profesional y personal
                </p>
                {c1CompletedAt && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ Completado {new Date(c1CompletedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Step 2: A1 */}
            <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg">
              <div className="flex-shrink-0">
                {a1Completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <div className={`w-6 h-6 rounded-full border-2 ${c1Completed ? "border-purple-600" : "border-slate-300 dark:border-slate-600"}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Paso 2: Despega Cerebral
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Descubre tu patrón natural de liderazgo
                </p>
                {a1CompletedAt && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ Completado {new Date(a1CompletedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Step 3: C2 */}
            <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg">
              <div className="flex-shrink-0">
                {c2Completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <div className={`w-6 h-6 rounded-full border-2 ${a1Completed ? "border-purple-600" : "border-slate-300 dark:border-slate-600"}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Paso 3: Tu Ruta Personalizada
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Plan 30/60/90 adaptado a tu realidad
                </p>
                {c2CompletedAt && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
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
                      <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                      <span className="text-slate-700 dark:text-slate-300">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Advertencias */}
          {generatedRoute.contradicciones_detectadas.length > 0 && (
            <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                  Puntos de Atención
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedRoute.contradicciones_detectadas.map((adv, idx) => (
                    <li key={idx} className="text-sm text-yellow-800 dark:text-yellow-200">
                      {adv}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Factores de Éxito */}
          {generatedRoute.factores_exito.length > 0 && (
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  Factores de Éxito Detectados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedRoute.factores_exito.map((factor, idx) => (
                    <li key={idx} className="flex gap-2 text-sm">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        ✓
                      </Badge>
                      <span className="text-slate-700 dark:text-slate-300">{factor}</span>
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
