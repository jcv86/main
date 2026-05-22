'use client'

import { Button } from '@/components/ui/button'

interface A2Day2IntroProps {
  onNext: () => void
}

export function A2Day2Intro({ onNext }: A2Day2IntroProps) {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <div
        className="rounded-lg p-8 space-y-6"
        style={{
          backgroundColor: 'rgba(90, 90, 150, 0.1)',
          borderColor: 'rgba(90, 90, 150, 0.2)',
          border: '1px solid',
        }}
      >
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-white" style={{ color: 'rgb(90, 90, 150)' }}>
            LA BÓVEDA DE EVIDENCIA
          </h1>
          <p className="text-lg text-white/70">
            Donde vive tu verdadera historia profesional
          </p>
        </div>

        <div className="space-y-4 text-white/80 leading-relaxed">
          <p>
            Un CV perfecto sin evidencia es ficción. Un LinkedIn bonito sin pruebas es marketing.
          </p>
          <p>
            Hoy no escribimos. Cazamos. Buscamos mensajes, archivos, documentos, feedback, números.
            Todo lo que prueba que hiciste trabajo real.
          </p>
          <p>
            Esta bóveda será tu fuente de verdad: documentos, mensajes, evidencia concreta. 
            Cada fragmento que recolectes hoy alimentará todo lo que viene después.
          </p>
        </div>

        <div
          className="rounded-lg p-4 space-y-2"
          style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)', border: '1px solid rgba(80, 160, 170, 0.2)' }}
        >
          <p className="text-sm font-semibold text-white/90">Lo que vas a hacer hoy:</p>
          <ul className="text-sm text-white/70 space-y-1 ml-4">
            <li>✓ Crear tu bóveda externa (Notion, Drive, local, etc)</li>
            <li>✓ Buscar evidencia en 5 lugares diferentes</li>
            <li>✓ Recolectar 7+ fragmentos de prueba</li>
            <li>✓ Subir evidencia a DTC</li>
            <li>✓ DTC clasifica automáticamente</li>
            <li>✓ Identificar 3 "Piezas de Oro"</li>
          </ul>
        </div>

        <Button
          onClick={onNext}
          className="w-full"
          size="lg"
          style={{
            backgroundColor: 'rgb(90, 90, 150)',
            color: 'white',
          }}
        >
          Crear Mi Bóveda →
        </Button>
      </div>
    </div>
  )
}
