'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Copy, Check } from 'lucide-react'

interface A2Day1RoadmapProps {
  onNext: (roadmap: string) => void
  onBack: () => void
  routeData: any
}

export function A2Day1Roadmap({
  onNext,
  onBack,
  routeData,
}: A2Day1RoadmapProps) {
  const [copied, setCopied] = useState(false)

  const roadmapContent = `MI RUTA PROFESIONAL DE 30 DÍAS

═══════════════════════════════════════════════════════

1. SITUACIÓN PROFESIONAL ACTUAL

${routeData.mainBlocker}

═══════════════════════════════════════════════════════

2. OBJETIVO PRINCIPAL

${routeData.change30Days}

═══════════════════════════════════════════════════════

3. TIPO DE ROL / EMPRESA / ENTORNO TARGET

${routeData.targetRole}

═══════════════════════════════════════════════════════

4. PUERTA 1 — IDENTIDAD (Día 10)
¿Qué debe estar claro sobre ti?

${routeData.gates?.identity || '[Puerta de identidad]'}

═══════════════════════════════════════════════════════

5. PUERTA 2 — EVIDENCIA (Día 20)
¿Qué prueba de valor debe existir?

${routeData.gates?.evidence || '[Puerta de evidencia]'}

═══════════════════════════════════════════════════════

6. PUERTA 3 — MATERIAL (Día 30)
¿Qué activo profesional debe existir?

${routeData.gates?.material || '[Puerta de material]'}

═══════════════════════════════════════════════════════

7. RIESGOS PRINCIPALES

- Perder claridad durante el proceso
- Compararse con otros candidatos
- No recolectar evidencia suficiente
- Saltar pasos sin validar

═══════════════════════════════════════════════════════

8. COMPROMISO DIARIO

10-15 minutos mínimo cada día en DTC
Documentación en bóveda externa
1 acción de validación externa por semana

═══════════════════════════════════════════════════════

9. PRIMERAS ACCIONES (Próximos 3 días)

□ Crear bóveda de evidencia (Notion/Drive)
□ Recolectar 7+ fragmentos de trabajo anterior
□ Buscar 3 vacantes reales en mercado target
□ Iniciar mapeo de "qué quiere el mercado"

═══════════════════════════════════════════════════════

INSTRUCCIONES:
1. Descarga o copia este documento
2. Personalízalo: agrega más detalles, ajusta redacción
3. Agrega contexto adicional que sea importante para ti
4. Guarda en formato que prefieras (PDF, Notion, Google Docs, etc)
5. Vuelve a DTC y sube el documento editado
6. DTC lo puntuará y validará

═══════════════════════════════════════════════════════`

  const handleCopy = () => {
    navigator.clipboard.writeText(roadmapContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadMarkdown = () => {
    const element = document.createElement('a')
    const file = new Blob([roadmapContent], { type: 'text/markdown' })
    element.href = URL.createObjectURL(file)
    element.download = 'ruta-profesional-30-dias.md'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleDownloadText = () => {
    const element = document.createElement('a')
    const file = new Blob([roadmapContent], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'ruta-profesional-30-dias.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', borderColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid' }}
      >
        <h3 className="font-bold text-white mb-2">Tu Documento de Ruta Está Listo</h3>
        <p className="text-sm text-white/70">
          Personaliza, edita, embellece. Luego lo subes de vuelta a DTC para validación y puntuación.
        </p>
      </div>

      {/* Roadmap Preview */}
      <div
        className="rounded-lg p-6 space-y-2 font-mono text-sm text-white/80 whitespace-pre-wrap max-h-96 overflow-y-auto"
        style={{
          backgroundColor: 'rgba(90, 90, 150, 0.05)',
          borderColor: 'rgba(90, 90, 150, 0.2)',
          border: '1px solid',
        }}
      >
        {roadmapContent}
      </div>

      {/* Download Options */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-white">Descargar/Copiar:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="flex items-center justify-center gap-2"
            style={{
              borderColor: 'rgba(90, 90, 150, 0.3)',
              backgroundColor: copied ? 'rgba(80, 160, 170, 0.2)' : 'transparent',
              color: 'white',
            }}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar al portapapeles
              </>
            )}
          </Button>

          <Button
            onClick={handleDownloadMarkdown}
            variant="outline"
            style={{
              borderColor: 'rgba(90, 90, 150, 0.3)',
              color: 'white',
            }}
          >
            Descargar Markdown
          </Button>

          <Button
            onClick={handleDownloadText}
            variant="outline"
            style={{
              borderColor: 'rgba(90, 90, 150, 0.3)',
              color: 'white',
            }}
          >
            Descargar TXT
          </Button>
        </div>
      </div>

      {/* Mini lesson */}
      <div
        className="rounded-lg p-4 space-y-2 text-sm"
        style={{
          backgroundColor: 'rgba(80, 160, 170, 0.1)',
          borderColor: 'rgba(80, 160, 170, 0.2)',
          border: '1px solid',
        }}
      >
        <p className="font-semibold text-white">Próximo paso:</p>
        <p className="text-white/70">
          Abre este documento en Notion, Google Docs, Word o donde prefieras. 
          Personalízalo: agrega tus propias notas, ajusta el lenguaje, 
          agrega detalles más profundos. Este es TU documento.
        </p>
      </div>

      {/* CTA */}
      <div className="pt-4 border-t space-y-3" style={{ borderColor: 'rgba(90, 90, 150, 0.2)' }}>
        <Button
          onClick={() => onNext(roadmapContent)}
          className="w-full"
          size="lg"
          style={{ backgroundColor: 'rgb(90, 90, 150)', color: 'white' }}
        >
          Continuar (Guardar/Editar Externo) →
        </Button>

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white/70 text-sm transition w-full justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>
    </div>
  )
}
