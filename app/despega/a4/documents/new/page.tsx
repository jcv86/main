'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  FileText, 
  MessageSquare, 
  User, 
  Target, 
  Briefcase, 
  TrendingUp,
  CheckCircle,
  FileCheck,
  Users,
  BarChart,
  ArrowLeft,
  Sparkles,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

const DOCUMENT_TYPES = [
  { 
    value: 'cv', 
    label: 'CV / Currículum', 
    icon: FileText, 
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/50',
    description: 'Genera un CV profesional basado en tu perfil y experiencia'
  },
  { 
    value: 'cover_letter', 
    label: 'Carta de Presentación', 
    icon: MessageSquare, 
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/50',
    description: 'Crea una carta personalizada para una empresa específica'
  },
  { 
    value: 'linkedin_summary', 
    label: 'LinkedIn Summary', 
    icon: User, 
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    borderColor: 'border-cyan-400/50',
    description: 'Optimiza tu sección "Acerca de" para destacar en LinkedIn'
  },
  { 
    value: 'elevator_pitch', 
    label: 'Elevator Pitch', 
    icon: Target, 
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/50',
    description: 'Prepara tu presentación de 30-60 segundos'
  },
  { 
    value: 'interview_prep', 
    label: 'Preparación Entrevista', 
    icon: Briefcase, 
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/50',
    description: 'Guía completa con preguntas y respuestas sugeridas'
  },
  { 
    value: 'career_roadmap', 
    label: 'Ruta de Carrera', 
    icon: TrendingUp, 
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/50',
    description: 'Plan de 90 días para alcanzar tus metas profesionales'
  },
  { 
    value: 'skills_inventory', 
    label: 'Inventario de Habilidades', 
    icon: CheckCircle, 
    color: 'text-teal-400',
    bgColor: 'bg-teal-400/10',
    borderColor: 'border-teal-400/50',
    description: 'Catálogo completo de tus habilidades técnicas y blandas'
  },
  { 
    value: 'achievements_portfolio', 
    label: 'Portafolio de Logros', 
    icon: FileCheck, 
    color: 'text-pink-400',
    bgColor: 'bg-pink-400/10',
    borderColor: 'border-pink-400/50',
    description: 'Documenta tus logros con métricas y contexto STAR'
  },
  { 
    value: 'network_map', 
    label: 'Mapa de Networking', 
    icon: Users, 
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-400/10',
    borderColor: 'border-indigo-400/50',
    description: 'Estrategia de contactos y comunidades para tu industria'
  },
  { 
    value: 'market_analysis', 
    label: 'Análisis de Mercado', 
    icon: BarChart, 
    color: 'text-[rgb(80,160,170)]',
    bgColor: 'bg-[rgba(80,160,170,0.1)]',
    borderColor: 'border-[rgb(80,160,170)]',
    description: 'Tendencias, salarios y oportunidades en tu sector'
  },
]

export default function NewDocumentPage() {
  const router = useRouter()
  const [step, setStep] = useState<'select' | 'customize'>('select')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [customTitle, setCustomTitle] = useState('')
  const [targetCompany, setTargetCompany] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedTypeInfo = DOCUMENT_TYPES.find(t => t.value === selectedType)

  const handleSelectType = (type: string) => {
    setSelectedType(type)
    setStep('customize')
  }

  const handleGenerate = async () => {
    if (!selectedType) return

    try {
      setGenerating(true)
      setError(null)

      // First generate the content
      const generateResponse = await fetch('/api/a4/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: selectedType,
          targetCompany: targetCompany || undefined,
          targetRole: targetRole || undefined,
          customPrompt: customPrompt || undefined
        })
      })

      if (!generateResponse.ok) {
        throw new Error('Error al generar el documento')
      }

      const { content, suggestedTitle } = await generateResponse.json()

      // Then create the document
      const createResponse = await fetch('/api/a4/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: selectedType,
          title: customTitle || suggestedTitle,
          generateFromContext: false, // Already generated
          metadata: {
            targetCompany,
            targetRole,
            customPrompt: !!customPrompt
          }
        })
      })

      if (!createResponse.ok) {
        throw new Error('Error al guardar el documento')
      }

      const { document } = await createResponse.json()

      // Update with the generated content
      await fetch('/api/a4/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: document.id,
          content,
          createVersion: false
        })
      })

      // Redirect to the document editor
      router.push(`/despega/a4/documents/${document.id}/edit`)
    } catch (err) {
      console.error('[New Document] Error:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/despega/a4/documents">
            <Button variant="outline" size="icon" className="border-[rgb(80,160,170)]">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              {step === 'select' ? 'Nuevo Documento' : `Crear ${selectedTypeInfo?.label}`}
            </h1>
            <p className="text-muted-foreground">
              {step === 'select' 
                ? 'Selecciona el tipo de documento que quieres generar'
                : 'Personaliza tu documento antes de generarlo'
              }
            </p>
          </div>
        </div>

        {step === 'select' ? (
          /* Document Type Selection */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DOCUMENT_TYPES.map((type) => {
              const Icon = type.icon
              return (
                <Card
                  key={type.value}
                  className={`cursor-pointer transition-all hover:scale-[1.02] bg-slate-900/50 ${type.borderColor} hover:border-opacity-100 border-opacity-50`}
                  onClick={() => handleSelectType(type.value)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${type.bgColor}`}>
                        <Icon className={`h-6 w-6 ${type.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{type.label}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {type.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          /* Customization Form */
          <Card className="bg-slate-900/50 border-[rgb(80,160,170)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                {selectedTypeInfo && (
                  <div className={`p-3 rounded-lg ${selectedTypeInfo.bgColor}`}>
                    <selectedTypeInfo.icon className={`h-8 w-8 ${selectedTypeInfo.color}`} />
                  </div>
                )}
                <div>
                  <CardTitle>{selectedTypeInfo?.label}</CardTitle>
                  <CardDescription>{selectedTypeInfo?.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Custom Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Título del documento (opcional)</Label>
                <Input
                  id="title"
                  placeholder="Se generará automáticamente si no lo defines"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="bg-slate-900/50 border-[rgb(80,160,170)]"
                />
              </div>

              {/* Target Company - only for certain types */}
              {['cover_letter', 'interview_prep'].includes(selectedType || '') && (
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa objetivo</Label>
                  <Input
                    id="company"
                    placeholder="Ej: Google, Mercado Libre, Falabella..."
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="bg-slate-900/50 border-[rgb(80,160,170)]"
                  />
                </div>
              )}

              {/* Target Role */}
              {['cv', 'cover_letter', 'interview_prep', 'linkedin_summary'].includes(selectedType || '') && (
                <div className="space-y-2">
                  <Label htmlFor="role">Rol objetivo</Label>
                  <Input
                    id="role"
                    placeholder="Ej: Product Manager, Software Engineer, Marketing Lead..."
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="bg-slate-900/50 border-[rgb(80,160,170)]"
                  />
                </div>
              )}

              {/* Custom Instructions */}
              <div className="space-y-2">
                <Label htmlFor="prompt">Instrucciones adicionales (opcional)</Label>
                <Textarea
                  id="prompt"
                  placeholder="Ej: Enfócate en mi experiencia en startups, menciona mi proyecto de machine learning, usa un tono más formal..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={4}
                  className="bg-slate-900/50 border-[rgb(80,160,170)]"
                />
              </div>

              {/* Context Info */}
              <div className="bg-[rgba(80,160,170,0.1)] border border-[rgb(80,160,170)] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-[rgb(80,160,170)] mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Generación con IA personalizada</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      El documento se generará usando tu perfil de A1 (valores, fortalezas), 
                      datos de A2 (experiencia, educación) y progreso de A3 (habilidades, entrenamiento).
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep('select')}
                  className="border-[rgb(80,160,170)]"
                >
                  Volver
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex-1 bg-[rgba(80,160,170,0.6)] hover:bg-[rgba(80,160,170,0.8)] text-white"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generando documento...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generar con IA
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
