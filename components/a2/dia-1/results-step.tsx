'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle } from 'lucide-react'

interface Dia1ResultsStepProps {
  score: number | null
  status: 'pending' | 'passed' | 'needs-revision' | null
  feedback: any
  onRetry: () => void
}

export default function Dia1ResultsStep({
  score = 84,
  status = 'passed',
  feedback,
  onRetry,
}: Dia1ResultsStepProps) {
  const isPassed = status === 'passed'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-lg p-6 border ${
        isPassed
          ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
          : 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800'
      }`}>
        <div className="flex items-start gap-3">
          {isPassed ? (
            <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
          ) : (
            <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
          )}
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${isPassed ? 'text-green-900 dark:text-green-100' : 'text-amber-900 dark:text-amber-100'}`}>
              {isPassed ? 'Día 1 completado con éxito' : 'Tu roadmap necesita una revisión'}
            </h2>
            <p className={`text-sm mt-2 ${isPassed ? 'text-green-800 dark:text-green-200' : 'text-amber-800 dark:text-amber-200'}`}>
              {isPassed
                ? 'Tu roadmap inicial está listo. DTC detectó una visión clara, hitos suficientes y un plan de acciones coherente para comenzar tu ruta de 30 días.'
                : 'DTC encontró algunos puntos incompletos o demasiado generales. No es un error. Es parte del proceso. Ajusta tu roadmap con ayuda del coach y súbelo nuevamente.'}
            </p>
          </div>
        </div>
      </div>

      {/* Score */}
      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <h3 className="font-semibold text-sm mb-3 text-foreground">Resultado del análisis</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Puntuación:</span>
            <span className="text-2xl font-bold text-foreground">{score} / 100</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Estado:</span>
            <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
              isPassed
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                : 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100'
            }`}>
              {isPassed ? 'Aprobado' : 'Revisión necesaria'}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Evaluación por categoría</h3>
        <div className="space-y-2">
          <ScoreBar label="Claridad de visión" value={25} weight={25} />
          <ScoreBar label="Calidad de hitos" value={25} weight={25} />
          <ScoreBar label="Plan de acciones" value={25} weight={25} />
          <ScoreBar label="Realismo y coherencia" value={9} weight={25} />
        </div>
      </div>

      {/* Strengths & Improvements */}
      {isPassed ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <h3 className="font-semibold text-foreground mb-3">Fortalezas detectadas</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Tu visión profesional tiene una dirección clara.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Los hitos de 10, 20 y 30 días están conectados.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">El plan incluye claridad, CV, preparación y acción real.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-semibold text-foreground mb-3">Mejora sugerida</h3>
            <p className="text-sm text-muted-foreground">
              Puedes hacer tu objetivo salarial o tipo de empresa un poco más específico en la próxima revisión.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <h3 className="font-semibold text-foreground mb-3">Puntos a corregir</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Tu visión es demasiado general.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Falta un hito claro para el Día 20.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">El plan no incluye acciones reales de búsqueda o postulación.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="space-y-3 pt-4 border-t border-border">
        {isPassed ? (
          <Button size="lg" className="w-full">
            Continuar al Día 2
          </Button>
        ) : (
          <>
            <Button size="lg" className="w-full" onClick={onRetry}>
              Corregir con el coach
            </Button>
            <Button size="lg" variant="outline" className="w-full">
              Subir nueva versión
            </Button>
          </>
        )}
      </div>

      {/* Next Steps */}
      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <h3 className="font-semibold text-sm mb-2 text-foreground">Próximos pasos</h3>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          {isPassed ? (
            <>
              <li>Tu Día 1 está completado</li>
              <li>Tu roadmap inicial se guardó en tu perfil</li>
              <li>Ahora puedes acceder a Día 2</li>
              <li>Día 2 comenzará a trabajar tu visión más a fondo</li>
            </>
          ) : (
            <>
              <li>Usa el coach para mejorar tu visión</li>
              <li>Agrega más detalles a tus hitos</li>
              <li>Incluye acciones reales de búsqueda</li>
              <li>Sube nuevamente cuando estés listo</li>
            </>
          )}
        </ol>
      </div>
    </div>
  )
}

function ScoreBar({ label, value, weight }: { label: string; value: number; weight: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">{value}/{weight}</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${(value / weight) * 100}%` }}
        />
      </div>
    </div>
  )
}
