'use client'

import { Button } from '@/components/ui/button'

interface Dia1MilestonesStepProps {
  milestones: {
    day10: string
    day20: string
    day30: string
  }
  onUpdate: (milestones: any) => void
  onNext: () => void
  onPrevious: () => void
}

const milestonePlaceholders = {
  day10: 'Tener claridad sobre mi dirección profesional, mis principales fortalezas y los bloqueos que debo trabajar.',
  day20: 'Tener una versión base de mi CV, primeros logros identificados y una mejor conexión entre mi experiencia y el tipo de rol que busco.',
  day30: 'Tener una preparación inicial sólida para entrevistas básicas, con respuestas estructuradas, una primera estrategia de postulación y claridad sobre los próximos pasos.',
}

export default function Dia1MilestonesStep({
  milestones,
  onUpdate,
  onNext,
  onPrevious,
}: Dia1MilestonesStepProps) {
  const isComplete = milestones.day10 && milestones.day20 && milestones.day30

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2 text-foreground">Paso 3: Define 3 hitos</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Estos hitos no son módulos de A3. Son puntos de control de tu roadmap. Define qué deberías tener claro o construido en cada fecha.
        </p>
        <div className="text-xs font-medium text-muted-foreground">⏱️ Tiempo estimado: 15 min</div>
      </div>

      <div className="space-y-6">
        {/* Milestone 1 - Day 10 */}
        <div className="space-y-2">
          <label className="block font-semibold text-foreground">
            Hito 1 — Día 10: Claridad profesional inicial
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            ¿Qué deberías tener claro o construido antes del Día 10?
          </p>
          <div className="text-xs text-muted-foreground mb-2 p-2 bg-muted/30 rounded border border-border">
            Ejemplos: Tener una visión profesional más clara, entender mis fortalezas y bloqueos, tener primeras ideas para mi CV, identificar el tipo de rol que quiero
          </div>
          <textarea
            value={milestones.day10}
            onChange={(e) => onUpdate({ ...milestones, day10: e.target.value })}
            placeholder={milestonePlaceholders.day10}
            className="w-full h-20 p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Milestone 2 - Day 20 */}
        <div className="space-y-2">
          <label className="block font-semibold text-foreground">
            Hito 2 — Día 20: Material profesional y preparación base
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            ¿Qué deberías haber construido antes del Día 20?
          </p>
          <div className="text-xs text-muted-foreground mb-2 p-2 bg-muted/30 rounded border border-border">
            Ejemplos: Tener un CV base mejorado, haber identificado logros importantes, tener respuestas iniciales para entrevistas, tener lista de roles objetivo
          </div>
          <textarea
            value={milestones.day20}
            onChange={(e) => onUpdate({ ...milestones, day20: e.target.value })}
            placeholder={milestonePlaceholders.day20}
            className="w-full h-20 p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Milestone 3 - Day 30 */}
        <div className="space-y-2">
          <label className="block font-semibold text-foreground">
            Hito 3 — Día 30: Primera preparación real
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            ¿Qué resultado quieres tener al final de los primeros 30 días?
          </p>
          <div className="text-xs text-muted-foreground mb-2 p-2 bg-muted/30 rounded border border-border">
            Ejemplos: Tener una ruta clara, tener un CV funcional, haber practicado respuestas básicas, estar listo para empezar simulaciones simples, tener 2–3 vacantes analizadas
          </div>
          <textarea
            value={milestones.day30}
            onChange={(e) => onUpdate({ ...milestones, day30: e.target.value })}
            placeholder={milestonePlaceholders.day30}
            className="w-full h-20 p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Validation */}
      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <h3 className="font-semibold text-sm mb-3 text-foreground">Estado de hitos</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${milestones.day10 ? 'bg-green-600' : 'bg-muted-foreground'}`}>
              {milestones.day10 ? '✓' : '1'}
            </span>
            <span className="text-muted-foreground">Día 10: {milestones.day10 ? 'completado' : 'pendiente'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${milestones.day20 ? 'bg-green-600' : 'bg-muted-foreground'}`}>
              {milestones.day20 ? '✓' : '2'}
            </span>
            <span className="text-muted-foreground">Día 20: {milestones.day20 ? 'completado' : 'pendiente'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${milestones.day30 ? 'bg-green-600' : 'bg-muted-foreground'}`}>
              {milestones.day30 ? '✓' : '3'}
            </span>
            <span className="text-muted-foreground">Día 30: {milestones.day30 ? 'completado' : 'pendiente'}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex-1"
        >
          Anterior
        </Button>
        <Button
          onClick={onNext}
          disabled={!isComplete}
          className="flex-1"
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
