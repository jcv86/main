'use client'

import { A3EmployabilityDiagnosis } from '@/components/a3-employability-diagnosis'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function DiagnosisPage() {
  const handleDiagnosisComplete = (diagnosis: any) => {
    console.log('[v0] Diagnosis completed:', diagnosis)
    // Save diagnosis and redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <Link href="/despega/a3">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a A3
          </Button>
        </Link>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            Diagnosis de Empleabilidad
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Evaluación rápida para entender tu nivel actual y calibrar tus entrenamientos.
          </p>
        </div>

        {/* Diagnosis Component */}
        <A3EmployabilityDiagnosis onComplete={handleDiagnosisComplete} />

        {/* Info Card */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-base">¿Por qué esta diagnosis?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
            <p>
              Cada persona tiene un punto de partida diferente. Esta diagnosis nos ayuda a:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Entender tu claridad de propuesta de valor</li>
              <li>Identificar tus 3 fortalezas principales</li>
              <li>Detectar gaps de habilidades</li>
              <li>Calibrar la dificultad de entrenamientos</li>
              <li>Personalizar recomendaciones del coach</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
