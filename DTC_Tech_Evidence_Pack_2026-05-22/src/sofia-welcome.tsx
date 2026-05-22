'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SofiaInterviewer } from '@/components/sofia-interviewer'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

interface WelcomeProps {
  moduleId: number
  moduleName: string
  moduleLessonCount: number
  onContinue: () => void
}

export function SofiaWelcome({ moduleId, moduleName, moduleLessonCount, onContinue }: WelcomeProps) {
  const [videoEnded, setVideoEnded] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        {/* Back Button */}
        <Link href="/despega/a3/entrenamiento-guiado" className="inline-flex items-center gap-2 text-training hover:text-training/80 mb-12">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        {/* Main Welcome Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Sofia Full Screen */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full rounded-xl overflow-hidden border-2 border-training/40">
              <SofiaInterviewer 
                state="greeting" 
                autoPlay={true}
                loop={false}
                onEnded={() => setVideoEnded(true)}
              />
            </div>
            <p className="text-center text-white/70 font-medium">Sofia, tu coach de práctica IA</p>
          </div>

          {/* Welcome Message and Info */}
          <Card className="border-training/40 bg-background">
            <CardContent className="pt-8 space-y-6">
              {/* Module Info */}
              <div>
                <Badge className="bg-training/20 text-training border-training/40 mb-3">
                  {moduleLessonCount} lecciones
                </Badge>
                <h1 className="text-3xl font-bold text-white mb-2">{moduleName}</h1>
                <p className="text-white/85">
                  Bienvenido a tu sesión de práctica. Sofia te guiará a través de este entrenamiento paso a paso.
                </p>
              </div>

              {/* What to Expect */}
              <div>
                <h3 className="font-semibold text-white mb-3">Qué esperar:</h3>
                <ul className="space-y-2">
                  <li className="flex gap-3 text-white/80">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-training mt-0.5" />
                    <span>Sofia te hará preguntas específicas</span>
                  </li>
                  <li className="flex gap-3 text-white/80">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-training mt-0.5" />
                    <span>Escuchará tu respuesta y dará seguimiento</span>
                  </li>
                  <li className="flex gap-3 text-white/80">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-training mt-0.5" />
                    <span>Recibirás feedback detallado al final</span>
                  </li>
                  <li className="flex gap-3 text-white/80">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-training mt-0.5" />
                    <span>Puedes intentar de nuevo cuando quieras</span>
                  </li>
                </ul>
              </div>

              {/* Continue Button */}
              <Button
                onClick={onContinue}
                disabled={!videoEnded}
                className="w-full h-12 text-white bg-training hover:bg-training/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {videoEnded ? 'Comenzar Entrenamiento' : 'Sofia está presentándose...'}
              </Button>

              {/* Tips */}
              <div className="bg-training/5 border border-training/30 rounded-lg p-4">
                <p className="text-sm text-white/80">
                  <strong className="text-training">💡 Consejo:</strong> Sé auténtico y natural en tus respuestas. No hay respuestas "correctas", Sofia aprecia la honestidad.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
