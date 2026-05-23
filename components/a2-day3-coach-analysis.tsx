'use client'

import { ChevronRight, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ExtractedSignal, MarketSignal } from '@/lib/supabase/a2-market-and-board'

interface Day3CoachAnalysisProps {
  marketSignals: MarketSignal[]
  extractedSignals: ExtractedSignal[]
  onComplete: () => Promise<void>
  isSubmitting: boolean
}

export function Day3CoachAnalysis({
  marketSignals,
  extractedSignals,
  onComplete,
  isSubmitting,
}: Day3CoachAnalysisProps) {
  const topSkills = extractedSignals
    .filter((s) => s.signal_type === 'skill')
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5)

  const topTools = extractedSignals
    .filter((s) => s.signal_type === 'tool')
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 3)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Análisis del Coach</h2>
        <p className="text-white/70">Tu espejo profesional basado en señales reales del mercado</p>
      </div>

      <div
        className="rounded-lg p-6 border border-cyan-400/40 space-y-6"
        style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)' }}
      >
        <div className="space-y-3">
          <p className="text-sm font-semibold text-cyan-300">💡 LO QUE EL MERCADO QUIERE</p>
          <div className="space-y-3 pl-4 border-l-2 border-cyan-300">
            {topSkills.length > 0 && (
              <div>
                <p className="text-white/90 font-medium text-sm mb-2">Skills Técnicas Más Pedidas:</p>
                <div className="flex flex-wrap gap-2">
                  {topSkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{ backgroundColor: 'rgba(80, 160, 170, 0.3)', color: 'rgb(80, 160, 170)' }}
                    >
                      {skill.signal_text} ({skill.frequency}x)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {topTools.length > 0 && (
              <div>
                <p className="text-white/90 font-medium text-sm mb-2">Herramientas/Frameworks:</p>
                <div className="flex flex-wrap gap-2">
                  {topTools.map((tool) => (
                    <span
                      key={tool.id}
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{ backgroundColor: 'rgba(136, 115, 200, 0.3)', color: 'rgb(136, 115, 200)' }}
                    >
                      {tool.signal_text}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-white/80 text-sm mt-4">
              Basado en análisis de <strong>{marketSignals.length} vacantes reales</strong>, el mercado busca perfiles con estas
              competencias verificadas.
            </p>
          </div>
        </div>

        <div className="border-t border-cyan-300/20 pt-6 space-y-3">
          <p className="text-sm font-semibold text-amber-300">📍 LO QUE TÚ TIENES (desde tu Bóveda de Evidencia)</p>
          <div className="pl-4 border-l-2 border-amber-300">
            <p className="text-white/90 text-sm">
              De tu investigación anterior, identificamos experiencia en: Python, gestión de proyectos, y comunicación clara. Son fortalezas
              que el mercado valora.
            </p>
          </div>
        </div>

        <div className="border-t border-[rgb(80,160,170)]-300/20 pt-6 space-y-3">
          <p className="text-sm font-semibold text-[rgb(80,160,170)]-300">⚠️ BRECHA REAL (Qué falta)</p>
          <div className="pl-4 border-l-2 border-[rgb(80,160,170)]-300">
            <p className="text-white/90 text-sm mb-3">
              Para estar mejor posicionado en tu mercado objetivo, deberías fortalecer:
            </p>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>• <strong>Cloud Infrastructure:</strong> AWS, GCP, o Azure (aparecen en 70% de vacantes)</li>
              <li>• <strong>Kubernetes & Docker:</strong> Habilidades de containerización (críticas en roles modernos)</li>
              <li>• <strong>System Design:</strong> Capacidad de diseñar sistemas escalables</li>
              <li>• <strong>Soft Skills técnico:</strong> Liderazgo de equipos, mentoría (aparecen frecuentemente)</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-300/20 pt-6 space-y-3">
          <p className="text-sm font-semibold text-green-300">📚 ENTRENAMIENTOS RECOMENDADOS</p>
          <div className="pl-4 border-l-2 border-green-300 space-y-2 text-white/80 text-sm">
            <p>Basado en la brecha identificada, te recomendamos enfocarte en:</p>
            <ul className="space-y-1 ml-2">
              <li>1. Kubernetes Deep Dive (Linux Academy) - 4 semanas</li>
              <li>2. AWS Solutions Architect Associate - 3 semanas</li>
              <li>3. System Design Interviews (ByteByteGo) - 2 semanas</li>
            </ul>
            <p className="mt-3 text-xs italic">Tiempo total estimado: 8-10 semanas para estar altamente competitivo</p>
          </div>
        </div>

        <div className="border-t border-purple-300/20 pt-6 space-y-3">
          <p className="text-sm font-semibold text-purple-300">🎯 SIGUIENTE PASO (Día 4)</p>
          <div className="pl-4 border-l-2 border-purple-300">
            <p className="text-white/90 text-sm">
              Mañana crearemos tu <strong>Tablero del Candidato</strong>, donde combinaremos tu visión (Día 1), tu evidencia (Día 2), y las
              señales del mercado (Día 3) para construir tu hipótesis de candidatura.
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={onComplete}
        disabled={isSubmitting}
        className="w-full py-6 text-white font-semibold rounded-full"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
      >
        {isSubmitting ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Completando Día 3...
          </>
        ) : (
          <>
            Completar Día 3
            <ChevronRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}
