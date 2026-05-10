'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trophy, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConversationalInterviewSimulator } from '@/components/conversational-interview-simulator'
import { ChallengeInvitation } from '@/components/a3-challenge-invitation'
import { A3GeneralProgress } from '@/components/a3-general-progress'

export default function StructuredSimulationPage() {
  const [isComplete, setIsComplete] = useState(false)

  const handleComplete = (result: any) => {
    console.log('[v0] Structured simulation completed:', result)
    setIsComplete(true)
  }

  if (isComplete) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container max-w-3xl mx-auto px-4 py-8 space-y-8">
          <Link href="/despega/a3" className="inline-flex items-center gap-2 text-training hover:text-training/80 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>
          
          <div className="text-center py-12 space-y-6">
            <h1 className="text-4xl font-bold text-training mb-4">¡Simulación Completada!</h1>
            <p className="text-white/85 text-lg mb-8">
              Excelente trabajo. Ahora tienes el material para sonar como un profesional en tu próxima entrevista.
            </p>
            <Button 
              onClick={() => setIsComplete(false)}
              className="text-white h-12 px-8 bg-training hover:bg-training/90"
            >
              Hacer otra simulación
            </Button>
          </div>

          {/* Challenge Invitation */}
          <ChallengeInvitation
            title="Desafío Final Disponible"
            description="Completa el último nivel para dominar completamente las entrevistas"
            challengeHref="/despega/a3/feedback"
            xpReward={500}
            difficulty="expert"
            unlocked={true}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="flex flex-col h-screen">
        {/* General Progress Bar */}
        <A3GeneralProgress 
          currentStep={1}
          totalSteps={3}
          currentLabel="Simulación Estructurada"
          isCompleted={false}  // Not completed until practice finishes
        />

        <div className="flex-shrink-0 border-b border-muted/80 bg-background">
          <Link href="/despega/a3" className="inline-flex items-center gap-2 text-training hover:text-training/80">
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
