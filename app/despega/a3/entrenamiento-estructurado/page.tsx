'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { ConversationalInterviewSimulator } from '@/components/conversational-interview-simulator'
import { TrainingResultsCard } from '@/components/training-results-card'

export default function StructuredTrainingPage() {
  const router = useRouter()
  const [stage, setStage] = useState<'training' | 'farewell' | 'results'>('training')
  const [score, setScore] = useState(0)

  const handleComplete = (result: any) => {
    console.log('[v0] Interview simulation completed:', result)
    setScore(result.score || 85)
    setStage('farewell')
  }

  if (stage === 'farewell') {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6">
          <Card className="border-training/40 overflow-hidden">
            <div className="relative aspect-[3/4] w-full bg-black">
              <video
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sofia02ciao-JJXsroDrldJQrOQgg1lHrJzODwH1Uf.mov"
                autoPlay
                playsInline
                crossOrigin="anonymous"
                className="w-full h-full object-contain"
                onEnded={() => setStage('results')}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </Card>

          <Card className="border-training/30 bg-training/5">
            <CardContent className="pt-6">
              <p className="text-white/85 text-center">
                Sofia se está despidiendo...
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  if (stage === 'results') {
    return (
      <TrainingResultsCard
        result={{
          score: score,
          questionsCompleted: 5,
          totalQuestions: 5,
          timeSpent: 1200,
          level: 'intermedio',
          trainingType: 'Entrenamiento Estructurado'
        }}
        onContinue={() => router.push('/despega/a3')}
      />
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="flex flex-col h-screen">
        <div className="flex-shrink-0 border-b border-muted/80 bg-background p-4">
          <Link href="/despega/a3" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-400/80">
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>
        </div>

        <div className="flex-1 overflow-auto p-2 md:p-4">
          <ConversationalInterviewSimulator 
            level="intermedio"
            onComplete={handleComplete}
          />
        </div>
      </div>
    </main>
  )
}
