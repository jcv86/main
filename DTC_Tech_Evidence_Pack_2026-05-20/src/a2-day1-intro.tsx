'use client'

import { Button } from '@/components/ui/button'

interface A2Day1IntroProps {
  onNext: () => void
}

export function A2Day1Intro({ onNext }: A2Day1IntroProps) {
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
        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-white" style={{ color: 'rgb(90, 90, 150)' }}>
            EL CONTRATO DE TU RUTA
          </h1>
          <p className="text-lg text-white/70">
            Antes de entrenar, tienes que saber hacia dónde vas.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4 text-white/80 leading-relaxed">
          <p>
            Durante los próximos 90 días, no vamos a prepararte en el vacío. Vamos a construir una candidatura real basada en investigación real, mercado real y evidencia real.
          </p>
          <p>
            Hoy creamos el mapa. No tiene que ser perfecto. Tiene que ser claro, posible y tuyo.
          </p>
          <p>
            Este no es un formulario más. Es un contrato con tu futuro profesional. Lo vas a crear aquí, lo vas a editar afuera, lo vas a personalizar, y luego lo subirás. DTC lo validará. Si es fuerte, desbloquearás los próximos 89 días.
          </p>
        </div>

        {/* Mini lesson */}
        <div
          className="rounded-lg p-4 space-y-2"
          style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)', border: '1px solid rgba(80, 160, 170, 0.2)' }}
        >
          <p className="text-sm font-semibold text-white/90">Lo que vas a hacer hoy:</p>
          <ul className="text-sm text-white/70 space-y-1 ml-4">
            <li>✓ Responder 3 preguntas sobre tu visión</li>
            <li>✓ Ver una hipótesis de ruta generada por coach</li>
            <li>✓ Definir 3 puertas (hitos de validación)</li>
            <li>✓ Generar un documento de ruta profesional</li>
            <li>✓ Descargarlo, editarlo afuera, subirlo</li>
            <li>✓ Obtener puntuación y feedback</li>
          </ul>
        </div>

        {/* CTA */}
        <Button
          onClick={onNext}
          className="w-full"
          size="lg"
          style={{
            backgroundColor: 'rgb(90, 90, 150)',
            color: 'white',
          }}
        >
          Comenzar Escaneo de Visión
        </Button>
      </div>
    </div>
  )
}
