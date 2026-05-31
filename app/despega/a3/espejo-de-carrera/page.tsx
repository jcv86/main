'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { A3ModuleAccessGate } from '@/components/a3-module-access-gate'
import { ArrowRight, Compass, Layers, Check } from 'lucide-react'

export default function EspejoCarreraPage() {
  const router = useRouter()
  const [accessGranted, setAccessGranted] = useState(false)

  return (
    <A3ModuleAccessGate
      moduleId="espejo-de-carrera"
      moduleNumber={3}
      moduleTitle="Espejo de Carrera - A3 Unlock"
      onAccessGranted={() => setAccessGranted(true)}
    >
      <div className="min-h-screen bg-black/95 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Compass className="w-6 h-6 text-cyan-400" />
              <h1 className="text-4xl font-bold">Espejo de Carrera - Checkpoint A3</h1>
            </div>
            <p className="text-white/70 text-lg">
              Basado en tu progreso en A2 Día 7 (Checkpoint A3), has desbloqueado este módulo exclusivo
            </p>
          </div>

          {/* Milestone Badge */}
          <Card className="bg-gradient-to-r from-green-900/40 to-cyan-900/40 border-green-500/50 p-6">
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-sm text-white/70">CHECKPOINT ALCANZADO</p>
                <p className="text-lg font-semibold">Completaste los primeros 10 días de A2</p>
              </div>
            </div>
          </Card>

          {/* Main Content Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* What You'll Learn */}
            <Card className="bg-cyan-900/20 border-cyan-500/30 p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Layers className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Qué aprenderás</h3>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li>✓ Síntesis integrada de tu perfil A2 completo</li>
                    <li>✓ Reflejo claro de cómo te ven en el mercado</li>
                    <li>✓ Identificación de patrones de carrera</li>
                    <li>✓ Validación externa con expertos del sector</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Why It Matters */}
            <Card className="bg-teal-900/20 border-teal-500/30 p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Compass className="w-5 h-5 text-teal-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Por qué importa</h3>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li>✓ "Espejo" revela cómo otros te ven realmente</li>
                    <li>✓ Cierre de brecha entre autopercepción vs. realidad</li>
                    <li>✓ Preparación óptima para siguiente fase</li>
                    <li>✓ Validación que aumenta confianza</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Progress Section */}
          <Card className="bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/10 p-6">
            <h3 className="text-lg font-semibold mb-4">Tu Progreso en A2</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Fase 1: Claridad (Días 1-10)</span>
                  <span className="text-green-400 font-semibold">✓ Completado</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-green-500 rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Fase 2: Profundización (Días 11-20)</span>
                  <span className="text-white/50 font-semibold">Por iniciar</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-cyan-500 rounded-full" />
                </div>
              </div>
              <p className="text-xs text-white/50 pt-2">Completaste: 10/90 días (11%) • A3 Checkpoints 3/10 desbloqueados</p>
            </div>
          </Card>

          {/* Mirror Card Section */}
          <Card className="bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/10 p-6 space-y-4">
            <h3 className="text-lg font-semibold mb-4">Tu Tarjeta de Espejo de Carrera</h3>
            <p className="text-sm text-white/70 mb-4">
              Basada en tus respuestas en A2 Días 1-10, tu espejo de carrera refleja:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-cyan-900/20 rounded border border-cyan-500/20">
                <p className="text-xs text-white/50 uppercase tracking-wide mb-2">Cómo te Ves</p>
                <p className="font-semibold text-cyan-300">Tu visión + fortalezas identificadas</p>
              </div>
              <div className="p-4 bg-teal-900/20 rounded border border-teal-500/20">
                <p className="text-xs text-white/50 uppercase tracking-wide mb-2">Cómo te Ve el Mercado</p>
                <p className="font-semibold text-teal-300">Expectativas + requisitos reales</p>
              </div>
              <div className="p-4 bg-cyan-900/20 rounded border border-cyan-500/20">
                <p className="text-xs text-white/50 uppercase tracking-wide mb-2">Brecha Identificada</p>
                <p className="font-semibold text-cyan-300">Qué aprender • Qué desarrollar</p>
              </div>
              <div className="p-4 bg-teal-900/20 rounded border border-teal-500/20">
                <p className="text-xs text-white/50 uppercase tracking-wide mb-2">Plan de Cierre</p>
                <p className="font-semibold text-teal-300">Siguientes pasos • Roadmap personalizado</p>
              </div>
            </div>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-cyan-900/40 to-teal-900/40 border-cyan-500/50 p-8 space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">Revisa tu Espejo de Carrera</h2>
              <p className="text-white/70">
                Este checkpoint crucial te muestra con claridad: tu reflejo real en el mercado laboral. Valida lo aprendido en los primeros 10 días y prepárate para profundizar aún más.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm text-white/70">
              <div className="flex gap-2">
                <span className="text-cyan-400">▸</span>
                <span>Revisión de síntesis A2 completa</span>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-400">▸</span>
                <span>Tarjeta de identidad profesional</span>
              </div>
              <div className="flex gap-2">
                <span className="text-teal-400">▸</span>
                <span>Feedback de coach especializado</span>
              </div>
              <div className="flex gap-2">
                <span className="text-teal-400">▸</span>
                <span>Plan de acción para Fase 2</span>
              </div>
            </div>

            <Button
              onClick={() => router.push('/despega/a3')}
              className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold py-6 text-lg"
            >
              Ver mi Espejo de Carrera en A3
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>

          {/* Next Steps */}
          <Card className="bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/10 p-6 space-y-3">
            <h3 className="text-lg font-semibold">Próximos Pasos</h3>
            <ol className="space-y-2 text-sm text-white/70">
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">1.</span>
                <span>Revisa tu Tarjeta de Espejo en A3</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">2.</span>
                <span>Sesión de feedback con coach</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">3.</span>
                <span>Ajusta tu estrategia si es necesario</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">4.</span>
                <span>Continúa A2 Días 11-20 (Profundización)</span>
              </li>
            </ol>
          </Card>

          {/* Info Footer */}
          <div className="text-center space-y-2 text-sm text-white/50">
            <p>Este checkpoint integra todos tus datos de A2 + A3</p>
            <p>Tu progreso se sincroniza automáticamente en ambas plataformas</p>
          </div>
        </div>
      </div>
    </A3ModuleAccessGate>
  )
}
