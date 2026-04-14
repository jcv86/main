'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConversationalInterviewSimulator } from '@/components/conversational-interview-simulator'

export default function StructuredTrainingPage() {
  const [isComplete, setIsComplete] = useState(false)

  const handleComplete = (result: any) => {
    console.log('[v0] Interview simulation completed:', result)
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
            <h1 className="text-4xl font-bold text-cyan-400 mb-4">¡Entrenamiento Completado!</h1>
            <p className="text-slate-300 text-lg mb-8">
              Excelente trabajo. Ahora tienes el material para sonar como un profesional en tu próxima entrevista.
            </p>
            <Button 
              onClick={() => setIsComplete(false)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white h-12 px-8"
            >
              Hacer otro entrenamiento
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Link href="/despega/a3-dashboard" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Volver al Dashboard
        </Link>

        <ConversationalInterviewSimulator 
          level="intermedio"
          onComplete={handleComplete}
        />
      </div>
    </main>
  )
}
