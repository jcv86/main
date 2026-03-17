'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { ArrowLeft, Upload, Zap, CheckCircle2, AlertCircle } from 'lucide-react'

export default function JobMatchingPage() {
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyzeJD = async () => {
    if (!jobDescription.trim()) return
    
    setLoading(true)
    // Simulación de análisis - en producción usaría AI para analizar el JD
    setTimeout(() => {
      const skills = extractSkillsFromJD(jobDescription)
      setAnalysis({
        matchPercentage: Math.round(Math.random() * 30 + 70),
        topMatches: ['AWS', 'Node.js', 'Leadership'],
        missingSkills: ['Kubernetes', 'GraphQL Advanced'],
        recommendedResponses: {
          'Why this role?': 'Aligns with my expertise in scaling distributed systems...',
          'Why you?': 'I bring 7 years backend experience with proven track record...',
          'Challenge': 'Describe your approach to leading technical migrations...'
        },
        resumeAdjustments: [
          'Destacar experiencia en microservicios',
          'Enfatizar liderazgo de equipos',
          'Cuantificar mejoras de performance'
        ]
      })
      setLoading(false)
    }, 2000)
  }

  const extractSkillsFromJD = (jd: string) => {
    return ['AWS', 'Node.js', 'Leadership', 'CI/CD']
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Link href="/despega/a3">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a A3
          </Button>
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Ajuste por Vacante</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Pega la descripción de trabajo y obtén: análisis de match, CV personalizado, y respuestas optimizadas.
          </p>
        </div>

        {!analysis ? (
          <Card className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Descripción de Trabajo (Job Description)
              </label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Pega aquí la descripción completa de la posición..."
                className="min-h-64 resize-none"
              />
              <p className="text-xs text-slate-500">
                Puedes copiar-pegar desde LinkedIn, Indeed, o cualquier portal de empleos
              </p>
            </div>

            <Button
              onClick={handleAnalyzeJD}
              disabled={loading || !jobDescription.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 h-12"
            >
              {loading ? 'Analizando...' : 'Analizar Vacante'}
              <Zap className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Match Score */}
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Tu Match con esta Vacante</p>
                    <p className="text-5xl font-bold text-green-600 dark:text-green-400 mt-2">
                      {analysis.matchPercentage}%
                    </p>
                  </div>
                  <div className="text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Tabs */}
            <Tabs defaultValue="match" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="match">Match</TabsTrigger>
                <TabsTrigger value="resume">CV Ajustado</TabsTrigger>
                <TabsTrigger value="responses">Respuestas</TabsTrigger>
                <TabsTrigger value="simulation">Simulación</TabsTrigger>
              </TabsList>

              <TabsContent value="match" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Habilidades Coincidentes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold mb-2">Tus habilidades que piden:</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.topMatches.map((skill: string) => (
                          <Badge key={skill} className="bg-green-600 hover:bg-green-700">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-2">Habilidades que falta:</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingSkills.map((skill: string) => (
                          <Badge key={skill} variant="outline" className="border-orange-300 text-orange-700 dark:text-orange-300">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resume" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Ajustes Recomendados en tu CV</CardTitle>
                    <CardDescription>
                      Cambios sugeridos para destacar tu match con esta posición
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.resumeAdjustments.map((adjustment: string, idx: number) => (
                        <li key={idx} className="flex gap-3">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{idx + 1}.</span>
                          <span className="text-slate-700 dark:text-slate-300">{adjustment}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Generar CV Personalizado para esta Vacante
                </Button>
              </TabsContent>

              <TabsContent value="responses" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Respuestas Optimizadas</CardTitle>
                    <CardDescription>
                      Respuestas construidas según esta vacante específica
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(analysis.recommendedResponses).map(([question, response]: [string, any]) => (
                      <div key={question} className="space-y-2">
                        <p className="font-semibold text-slate-900 dark:text-white">{question}</p>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                          <p className="text-sm text-slate-700 dark:text-slate-300">{response}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Editar Respuesta
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="simulation" className="space-y-4">
                <Card className="p-6">
                  <div className="text-center space-y-4">
                    <Zap className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Simulación Personalizada
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Práctica una entrevista simulada con preguntas específicas de esta vacante
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Iniciar Simulación
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Back Button */}
            <Button
              variant="outline"
              onClick={() => setAnalysis(null)}
              className="w-full"
            >
              Analizar Otra Vacante
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
