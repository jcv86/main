'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { Interview0PreAudit } from '@/components/interview-0-pre-audit'
import { ConversationalInterviewSimulator } from '@/components/conversational-interview-simulator'

export default function Interview0Page() {
  const router = useRouter()
  const [stage, setStage] = useState<'audit' | 'simulator' | 'complete'>('audit')

  const handleAuditComplete = (result: any) => {
    console.log('[v0] Audit completed:', result)
    setStage('simulator')
  }

  const handleSimulatorComplete = (result: any) => {
    console.log('[v0] Interview 0 fully completed:', result)
    setStage('complete')
  }

  if (stage === 'complete') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-cyan mb-4">¡Entrevista 0 completada!</h1>
          <p className="text-lg text-white/90 mb-8">
            Excelente. Ahora tienes tu base profesional lista. Continúa con práctica guiada o entrenamiento estructurado.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => setStage('audit')}
              className="bg-blue hover:bg-cyan text-white"
            >
              Hacer otra auditoría
            </Button>
            <Button
              onClick={() => router.push('/despega/a3')}
              variant="outline"
              className="text-white"
            >
              Volver a entrenamientos
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-muted/80 bg-background py-3 px-4">
          <button
            onClick={() => router.push('/despega/a3')}
            className="inline-flex items-center gap-2 text-cyan/40 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Entrenamientos
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {stage === 'audit' && (
              <Interview0PreAudit onComplete={handleAuditComplete} />
            )}

            {stage === 'simulator' && (
              <div className="space-y-4">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white">Simulación de Entrevista</h2>
                  <p className="text-white/85 mt-2">Ahora practicaremos una entrevista real basada en tu auditoría</p>
                </div>
                <ConversationalInterviewSimulator
                  level="basico"
                  onComplete={handleSimulatorComplete}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
