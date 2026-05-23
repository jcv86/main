'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { A3ModuleAccessGate } from '@/components/a3-module-access-gate'
import { ArrowRight, Sparkles, Star, Lightbulb } from 'lucide-react'

export default function MarcaPersonalPage() {
  const router = useRouter()
  const [accessGranted, setAccessGranted] = useState(false)

  return (
    <A3ModuleAccessGate
      moduleId="marca-personal"
      moduleNumber={2}
      moduleTitle="Marca Personal - A3 Unlock"
      onAccessGranted={() => setAccessGranted(true)}
    >
      <div className="min-h-screen bg-black/95 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h1 className="text-4xl font-bold">Marca Personal</h1>
            </div>
            <p className="text-white/70 text-lg">
              Basado en tu progreso en A2 Día 6, has desbloqueado este módulo exclusivo
            </p>
          </div>

          {/* Main Content Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* What You'll Learn */}
            <Card className="bg-amber-900/20 border-amber-500/30 p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Qué aprenderás</h3>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li>✓ Construir tu marca profesional diferenciada</li>
                    <li>✓ Comunicar tu valor único en todas plataformas</li>
                    <li>✓ Optimizar presencia online para reclutadores</li>
                    <li>✓ Crear narrativa profesional coherente</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Why It Matters */}
            <Card className="bg-cyan-900/20 border-cyan-500/30 p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Por qué importa</h3>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li>✓ 80% de reclutadores evalúan presencia online</li>
                    <li>✓ Marca consistente genera confianza</li>
                    <li>✓ Diferenciación te separa de competencia</li>
                    <li>✓ Valor claro acelera negociaciones</li>
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
                <span className="text-sm text-white/70">Completaste: Día 6 - Perfil de marca personal</span>
                <span className="text-green-400 font-semibold">✓ Completado</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-gradient-to-r from-amber-500 to-orange-400 rounded-full" />
              </div>
              <p className="text-xs text-white/50">60% del camino A2 completado • A3 está desbloqueado</p>
            </div>
          </Card>

          {/* Brand Elements Section */}
          <Card className="bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/10 p-6 space-y-4">
            <h3 className="text-lg font-semibold mb-4">Elementos de tu Marca</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-amber-900/20 rounded border border-amber-500/20">
                <p className="text-sm text-white/50 mb-2">Visión</p>
                <p className="font-semibold text-amber-300">Tu dirección profesional clara</p>
              </div>
              <div className="p-4 bg-orange-900/20 rounded border border-orange-500/20">
                <p className="text-sm text-white/50 mb-2">Fortalezas</p>
                <p className="font-semibold text-orange-300">Lo que te hace único</p>
              </div>
              <div className="p-4 bg-amber-900/20 rounded border border-amber-500/20">
                <p className="text-sm text-white/50 mb-2">Mercado</p>
                <p className="font-semibold text-amber-300">Donde tu valor es requerido</p>
              </div>
              <div className="p-4 bg-orange-900/20 rounded border border-orange-500/20">
                <p className="text-sm text-white/50 mb-2">Narrativa</p>
                <p className="font-semibold text-orange-300">Cómo comunicas tu valor</p>
              </div>
            </div>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 border-amber-500/50 p-8 space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">Amplifica tu Marca Profesional</h2>
              <p className="text-white/70">
                En este módulo refinarás y amplificarás tu marca en todos los canales: LinkedIn, CV, redes profesionales y comunicaciones directas.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm text-white/70">
              <div className="flex gap-2">
                <span className="text-amber-400">▸</span>
                <span>Auditoría completa de presencia online</span>
              </div>
              <div className="flex gap-2">
                <span className="text-amber-400">▸</span>
                <span>Optimización de perfil LinkedIn</span>
              </div>
              <div className="flex gap-2">
                <span className="text-orange-400">▸</span>
                <span>Desarrollo de narrativa profesional</span>
              </div>
              <div className="flex gap-2">
                <span className="text-orange-400">▸</span>
                <span>Estrategia de comunicación integrada</span>
              </div>
            </div>

            <Button
              onClick={() => router.push('/despega/a3')}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-6 text-lg"
            >
              Ir a A3 Training Center
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>

          {/* Info Footer */}
          <div className="text-center space-y-2 text-sm text-white/50">
            <p>Este módulo está conectado a tu progreso en A2</p>
            <p>Tu marca se actualiza automáticamente con nueva información</p>
          </div>
        </div>
      </div>
    </A3ModuleAccessGate>
  )
}
