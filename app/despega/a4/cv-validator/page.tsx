'use client'

import { CVValidator } from '@/components/cv-validator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Zap } from 'lucide-react'

export default function CVValidatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-[rgba(170,70,170,0.2)] rounded-lg">
              <FileText className="w-8 h-8 text-[rgb(170,70,170)]" />
            </div>
          </div>
          <h1 className="text-5xl font-bold">CV ATS Validator</h1>
          <p className="text-lg text-slate-300">
            Optimize your CV for Applicant Tracking Systems (ATS)
          </p>
        </div>

        {/* Main Validator */}
        <CVValidator />

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-sm">What is ATS?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              Applicant Tracking Systems automatically parse and score CVs. Most companies use them to filter applications.
            </CardContent>
          </Card>

          <Card className="border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-sm">Why ATS Matters</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              A poorly formatted CV might get filtered out before a human even sees it. ATS readability is crucial.
            </CardContent>
          </Card>

          <Card className="border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-sm">Mejora Tu Puntuación</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              Sigue nuestras sugerencias para aumentar tu tasa de paso ATS y obtener más llamadas de entrevista.
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="border-[rgb(170,70,170)]/30 bg-[rgba(170,70,170,0.05)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[rgb(170,70,170)]" />
              Consejos Rápidos para Optimización ATS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>✓ Usa formato estándar (evita tablas, imágenes, fuentes decorativas)</li>
              <li>✓ Incluye una sección de contacto clara con correo y teléfono</li>
              <li>✓ Usa viñetas para descripciones de experiencia</li>
              <li>✓ Comienza viñetas con verbos de acción (Desarrollé, Gestioné, Lideré)</li>
              <li>✓ Incluye resultados cuantificables (aumentó X%, redujo costos Y)</li>
              <li>✓ Lista habilidades técnicas relevantes claramente</li>
              <li>✓ Mantén líneas bajo 100 caracteres para mejor análisis</li>
              <li>✓ Evita caracteres especiales y fuentes inusuales</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
