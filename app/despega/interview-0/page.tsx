'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ConversationalInterviewSimulator } from '@/components/conversational-interview-simulator'

export default function Interview0Page() {
  const router = useRouter()
  const [isComplete, setIsComplete] = useState(false)

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/90 to-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-cyan/40 mb-4">¡Interview 0 Completado!</h1>
          <p className="text-muted/30 mb-8">
            Excelente trabajo preparando tu pitch personal. Ahora tienes la base para entrevistas más complejas.
          </p>
          <div className="flex gap-4">
            <Button
              onClick={() => setIsComplete(false)}
              className="flex-1 bg-blue hover:bg-cyan"
            >
              Hacer otro entrenamiento
            </Button>
            <Button
              onClick={() => router.push('/despega/a3-dashboard')}
              variant="outline"
              className="flex-1"
            >
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="flex flex-col h-screen">
        <div className="flex-shrink-0 border-b border-muted/80 bg-gradient-to-r from-muted/90 to-background p-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-cyan/40 hover:text-cyan/30"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        </div>

        <div className="flex-1 overflow-hidden p-4">
          <ConversationalInterviewSimulator
            level="basico"
            onComplete={(result) => {
              console.log('[v0] Interview 0 completed:', result)
              setIsComplete(true)
            }}
          />
        </div>
      </div>
    </main>
  )
}
