'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { A3ModuleAccessGate } from '@/components/a3-module-access-gate'
import { ArrowRight, Zap, Target, Compass } from 'lucide-react'

export default function RolObjetivoPage() {
  const router = useRouter()
  const [accessGranted, setAccessGranted] = useState(false)

  return (
    <A3ModuleAccessGate
      moduleId="rol-objetivo"
      moduleNumber={1}
      moduleTitle="Rol Objetivo - A3 Unlock"
      onAccessGranted={() => setAccessGranted(true)}
    >
      <div className="min-h-screen bg-black/95 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-400" />
              <h1 className="text-4xl font-bold">Rol Objetivo</h1>
            </div>
            <p className="text-white/70 text-lg">
              Basado en tu progreso en A2 Día 1, has desbloqueado este módulo exclusivo
            </p>
          </div>

          {/* Main Content Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* What You'll Learn */}
            <Card className="bg-purple-900/20 border-purple-500/30 p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Compass className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Qué aprenderás</h3>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li>✓ Definir tu rol objetivo con precisión</li>
                    <li>✓ Entender las expectativas reales del mercado</li>
                    <li>✓ Identificar el path de crecimiento más realista</li>
                    <li>✓ Validar si tu dirección es sostenible</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Why It Matters */}
            <Card className="bg-cyan-900/20 border-cyan-500/30 p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Por qué importa</h3>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li>✓ Claridad reduce el "ruido" en tu búsqueda</li>
                    <li>✓ Objetivo específico aumenta tasas de éxito</li>
                    <li>✓ Validación del mercado confirma viabilidad</li>
                    <li>✓ Plan concreto acelera tus resultados</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Progress Section */}
          <Card className="bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/10 p-6">
            <h3 className="text-lg font-semibold mb-4">Tu Progreso en A2</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Completaste: Día 1 - Define tu visión</span>
                <span className="text-green-400 font-semibold">✓ Completado</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" />
              </div>
              <p className="text-xs text-white/50">Has desbloqueado acceso a módulos avanzados de A3</p>
            </div>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border-purple-500/50 p-8 space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">Comienza tu Entrenamiento Intensivo</h2>
              <p className="text-white/70">
                Este módulo te guiará a través de un proceso de 5 pasos para solidificar tu rol objetivo y validarlo con expertos del mercado.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm text-white/70">
              <div className="flex gap-2">
                <span className="text-purple-400">▸</span>
                <span>Análisis profundo de tendencias de rol</span>
              </div>
              <div className="flex gap-2">
                <span className="text-purple-400">▸</span>
                <span>Validación de requisitos clave</span>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-400">▸</span>
                <span>Entrevistas con expertos del sector</span>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-400">▸</span>
                <span>Plan de acción personalizado</span>
              </div>
            </div>

            <Button
              onClick={() => router.push('/despega/a3')}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-6 text-lg"
            >
              Ir a A3 Training Center
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>

          {/* Info Footer */}
          <div className="text-center space-y-2 text-sm text-white/50">
            <p>Este módulo está conectado a tu progreso en A2</p>
            <p>Todos tus datos se sincronizan automáticamente</p>
          </div>
        </div>
      </div>
    </A3ModuleAccessGate>
  )
}
