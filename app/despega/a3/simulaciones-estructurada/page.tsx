'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConversationalInterviewSimulator } from '@/components/conversational-interview-simulator'

export default function StructuredSimulationPage() {
  const [isComplete, setIsComplete] = useState(false)

  const handleComplete = (result: any) => {
    console.log('[v0] Structured simulation completed:', result)
    setIsComplete(true)
  }

  if (isComplete) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container max-w-3xl mx-auto px-4 py-8">
          <Link href="/despega/a3-dashboard" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>
          
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-cyan-400 mb-4">¡Simulación Completada!</h1>
            <p className="text-muted/30 text-lg mb-8">
              Excelente trabajo. Ahora tienes el material para sonar como un profesional en tu próxima entrevista.
            </p>
            <Button 
              onClick={() => setIsComplete(false)}
              className="bg-blue hover:bg-cyan-700 text-white h-12 px-8"
            >
              Hacer otra simulación
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="flex flex-col h-screen">
        <div className="flex-shrink-0 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 p-4">
          <Link href="/despega/a3-dashboard" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>
        </div>

        <div className="flex-1 overflow-hidden p-4">
          <ConversationalInterviewSimulator 
            level="intermedio"
            onComplete={handleComplete}
          />
        </div>
      </div>
    </main>
  )
}
