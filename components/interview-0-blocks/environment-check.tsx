'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertCircle, Check } from 'lucide-react'

interface EnvironmentCheckProps {
  onComplete: (data: { passed: boolean; score: number }) => void
}

export function EnvironmentCheck({ onComplete }: EnvironmentCheckProps) {
  const [checks, setChecks] = useState({
    lighting: false,
    background: false,
    noise: false,
    connection: false
  })

  const allChecked = Object.values(checks).every(Boolean)
  const score = allChecked ? 100 : (Object.values(checks).filter(Boolean).length / 4) * 100

  const handleToggle = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleContinue = () => {
    onComplete({
      passed: allChecked,
      score: Math.round(score)
    })
  }

  return (
    <Card className="border-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          Auditoría de Entorno
        </CardTitle>
        <p className="text-sm text-white/70 mt-2">
          Verifica que tu espacio esté preparado para la entrevista
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Checks */}
        <div className="space-y-4">
          {/* Lighting */}
          <div
            className="flex items-start gap-3 p-4 rounded-lg border border-muted/30 hover:border-muted/50 transition cursor-pointer"
            onClick={() => handleToggle('lighting')}
          >
            <Checkbox
              checked={checks.lighting}
              onCheckedChange={() => handleToggle('lighting')}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-semibold text-white">💡 Iluminación adecuada</p>
              <p className="text-sm text-white/60 mt-1">
                Tu cara está bien iluminada, sin sombras marcadas. Evita la luz de frente o de espalda.
              </p>
            </div>
          </div>

          {/* Background */}
          <div
            className="flex items-start gap-3 p-4 rounded-lg border border-muted/30 hover:border-muted/50 transition cursor-pointer"
            onClick={() => handleToggle('background')}
          >
            <Checkbox
              checked={checks.background}
              onCheckedChange={() => handleToggle('background')}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-semibold text-white">📍 Fondo profesional</p>
              <p className="text-sm text-white/60 mt-1">
                El fondo es limpio, ordenado y profesional. Sin distracciones ni objetos inapropiados.
              </p>
            </div>
          </div>

          {/* Noise */}
          <div
            className="flex items-start gap-3 p-4 rounded-lg border border-muted/30 hover:border-muted/50 transition cursor-pointer"
            onClick={() => handleToggle('noise')}
          >
            <Checkbox
              checked={checks.noise}
              onCheckedChange={() => handleToggle('noise')}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-semibold text-white">🔇 Ambiente silencioso</p>
              <p className="text-sm text-white/60 mt-1">
                Estás en un lugar quieto sin ruidos de fondo. Cierra puertas y avisa a quienes conviven contigo.
              </p>
            </div>
          </div>

          {/* Connection */}
          <div
            className="flex items-start gap-3 p-4 rounded-lg border border-muted/30 hover:border-muted/50 transition cursor-pointer"
            onClick={() => handleToggle('connection')}
          >
            <Checkbox
              checked={checks.connection}
              onCheckedChange={() => handleToggle('connection')}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-semibold text-white">🌐 Conexión estable</p>
              <p className="text-sm text-white/60 mt-1">
                Tienes buena conexión a internet. Prueba tu velocidad y conecta vía WiFi o cable.
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Completado</span>
            <span className="text-white font-semibold">{Object.values(checks).filter(Boolean).length}/4</span>
          </div>
          <div className="w-full h-2 bg-muted/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={handleContinue}
          className={`w-full h-12 font-semibold ${
            allChecked
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-muted/20 text-white/50 cursor-not-allowed'
          }`}
          disabled={!allChecked}
        >
          {allChecked ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Continuar
            </>
          ) : (
            'Completa todos los checks'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
