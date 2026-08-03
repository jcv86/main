'use client'

import {
  BarChart3,
  CheckCircle2,
  Circle,
  FileText,
  Link2,
  ListChecks,
  MapPin,
  MessageSquare,
} from 'lucide-react'
import type { A2DailyMission } from '@/lib/a2-mission.types'
import type {
  A2MissionSubmission,
  A2MissionValidationResult,
} from '@/lib/a2/day-submission'
import type { A2RouteAdaptation } from '@/lib/a2/route-adaptation'

interface A2GenericMissionWorkspaceProps {
  mission: A2DailyMission
  value: A2MissionSubmission
  validation: A2MissionValidationResult
  adaptation?: A2RouteAdaptation
  onChange: (value: A2MissionSubmission) => void
}

function updateInstruction(
  value: A2MissionSubmission,
  instructionIndex: number,
): A2MissionSubmission {
  const selected = new Set(value.completedInstructions)
  if (selected.has(instructionIndex)) selected.delete(instructionIndex)
  else selected.add(instructionIndex)

  return {
    ...value,
    completedInstructions: Array.from(selected).sort((left, right) => left - right),
  }
}

export function A2GenericMissionWorkspace({
  mission,
  value,
  validation,
  adaptation,
  onChange,
}: A2GenericMissionWorkspaceProps) {
  const summaryPlaceholder = adaptation
    ? `${adaptation.focusQuestion} Resume el trabajo realizado y la decisión que quedó registrada.`
    : 'Resume el trabajo realizado, las decisiones tomadas y cómo se conecta con tu objetivo profesional.'
  const evidencePlaceholder = adaptation
    ? adaptation.evidencePrompt
    : 'Pega el resultado principal, ejemplos, fragmentos, estructura, mensajes, aprendizajes o evidencia concreta producida hoy.'
  const reflectionPlaceholder = adaptation
    ? `${adaptation.applicationPrompt} Registra el aprendizaje central y el ajuste que aplicarás después.`
    : 'Registra el aprendizaje central, una dificultad y el ajuste que aplicarás en el siguiente día.'

  return (
    <div className="space-y-6 rounded-[28px] border border-cyan-500/25 bg-slate-950/50 p-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-cyan-300">
          <ListChecks className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Espacio de trabajo del día</h2>
        </div>
        <p className="text-sm leading-relaxed text-slate-400">
          Completa los pasos y registra evidencia suficiente para conservar este
          avance como parte de tu ruta.
        </p>
      </div>

      {adaptation && (
        <section className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
            <MapPin className="h-4 w-4" />
            Evidencia para {adaptation.routeName}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {adaptation.evidencePrompt}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {adaptation.qualitySignals.map((signal) => (
              <span
                key={signal}
                className="rounded-full border border-cyan-500/15 bg-slate-950/55 px-3 py-1 text-xs text-slate-300"
              >
                {signal}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Entregable esperado
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/85">
            {mission.deliverable}
          </p>
        </div>

        <div className="space-y-2">
          {mission.instructions.map((instruction, index) => {
            const completed = value.completedInstructions.includes(index)
            return (
              <button
                key={`${mission.day}-${index}`}
                type="button"
                onClick={() => onChange(updateInstruction(value, index))}
                className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                  completed
                    ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-100'
                    : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-cyan-500/35'
                }`}
              >
                {completed ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-600" />
                )}
                <span className="text-sm leading-relaxed">{instruction}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="grid gap-5">
        <label className="space-y-2">
          <span className="flex items-center gap-2 text-sm font-semibold text-white">
            <MessageSquare className="h-4 w-4 text-cyan-400" />
            Qué hiciste y qué decisión tomaste
          </span>
          <textarea
            value={value.summary}
            onChange={(event) => onChange({ ...value, summary: event.target.value })}
            rows={5}
            placeholder={summaryPlaceholder}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500/60"
          />
          <span className="block text-right text-xs text-slate-600">
            {value.summary.length} caracteres
          </span>
        </label>

        <label className="space-y-2">
          <span className="flex items-center gap-2 text-sm font-semibold text-white">
            <FileText className="h-4 w-4 text-purple-400" />
            Evidencia o contenido del entregable
          </span>
          <textarea
            value={value.evidence}
            onChange={(event) => onChange({ ...value, evidence: event.target.value })}
            rows={6}
            placeholder={evidencePlaceholder}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/60"
          />
          <span className="block text-right text-xs text-slate-600">
            {value.evidence.length} caracteres
          </span>
        </label>

        <label className="space-y-2">
          <span className="flex items-center gap-2 text-sm font-semibold text-white">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Qué aprendiste y qué ajustarás
          </span>
          <textarea
            value={value.reflection}
            onChange={(event) => onChange({ ...value, reflection: event.target.value })}
            rows={4}
            placeholder={reflectionPlaceholder}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/60"
          />
          <span className="block text-right text-xs text-slate-600">
            {value.reflection.length} caracteres
          </span>
        </label>

        {mission.missionType === 'field_action' && (
          <label className="space-y-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-white">
              <BarChart3 className="h-4 w-4 text-amber-400" />
              Resultado o métrica de la acción real
            </span>
            <textarea
              value={value.metrics}
              onChange={(event) => onChange({ ...value, metrics: event.target.value })}
              rows={3}
              placeholder="Ejemplo: 5 contactos enviados, 2 respuestas, 1 conversación agendada y próxima acción definida."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-500/60"
            />
          </label>
        )}

        <label className="space-y-2">
          <span className="flex items-center gap-2 text-sm font-semibold text-white">
            <Link2 className="h-4 w-4 text-blue-400" />
            Enlace al activo o documento
            <span className="font-normal text-slate-500">(opcional)</span>
          </span>
          <input
            type="url"
            value={value.artifactUrl}
            onChange={(event) => onChange({ ...value, artifactUrl: event.target.value })}
            placeholder="https://..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/60"
          />
        </label>
      </section>

      <section
        className={`rounded-xl border p-4 ${
          validation.passed
            ? 'border-emerald-500/35 bg-emerald-500/10'
            : 'border-amber-500/30 bg-amber-500/10'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">
              Validación estructural del entregable
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Umbral del día: {validation.passScore}/100
              {mission.dtcValidation.required
                ? ' · Esta misión tiene revisión DTC reforzada'
                : ''}
            </p>
          </div>
          <div
            className={`text-3xl font-bold ${
              validation.passed ? 'text-emerald-300' : 'text-amber-300'
            }`}
          >
            {validation.score}
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-900">
          <div
            className={`h-full rounded-full transition-all ${
              validation.passed ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(100, validation.score)}%` }}
          />
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {validation.criteria.map((criterion) => (
            <div
              key={criterion.key}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-slate-950/35 px-3 py-2"
            >
              <span className="text-xs text-slate-300">{criterion.label}</span>
              <span
                className={`text-xs font-semibold ${
                  criterion.met ? 'text-emerald-300' : 'text-amber-300'
                }`}
              >
                {criterion.score}/{criterion.maxScore}
              </span>
            </div>
          ))}
        </div>

        {!validation.passed && validation.errors.length > 0 && (
          <ul className="mt-4 space-y-1 text-sm text-amber-100">
            {validation.errors.map((error) => (
              <li key={error}>• {error}</li>
            ))}
          </ul>
        )}

        {validation.passed && (
          <p className="mt-4 text-sm text-emerald-100">
            El entregable cumple la estructura mínima y está listo para registrarse.
          </p>
        )}
      </section>
    </div>
  )
}
