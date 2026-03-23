"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookMarked, ArrowRight, AlertCircle, CheckCircle, TrendingUp } from "lucide-react"

interface CaseStudy {
  id: string
  title: string
  description: string
  category: string
  difficulty: "Básico" | "Intermedio" | "Avanzado"
  duration: number
  industry: string
  challenge: string
  strategy: string
  results: string
  keyLearnings: string[]
  relevantTesis?: string
}

const caseStudies: CaseStudy[] = [
  {
    id: "cs-001",
    title: "Transformación Digital en Retail Tradicional",
    description: "Cómo una cadena minorista de 50 años adaptó su modelo a omnichannel en 18 meses",
    category: "Transformación Digital",
    difficulty: "Intermedio",
    duration: 12,
    industry: "Retail",
    challenge: "Pérdida de relevancia frente a e-commerce, resistencia al cambio organizacional, tecnología legacy",
    strategy: "Implementación gradual de plataforma omnichannel, capacitación de personal, partnerships tecnológicos",
    results: "Incremento 35% en ventas online, 25% en satisfacción del cliente, reducción 20% en costos operativos",
    keyLearnings: [
      "La transformación requiere cambio cultural, no solo tecnológico",
      "Involucrar a equipos locales en la estrategia es crítico",
      "Partnerships aceleran implementación sin perder control",
      "ROI debe medirse en múltiples dimensiones, no solo ventas",
    ],
    relevantTesis: "Omnichannel es obligatorio",
  },
  {
    id: "cs-002",
    title: "Monetización de Datos en Servicios Financieros",
    description: "Banco regional que generó nuevas líneas de ingresos a través de inteligencia de datos",
    category: "Monetización de Datos",
    difficulty: "Avanzado",
    duration: 15,
    industry: "Fintech",
    challenge: "Datos fragmentados, falta de competencias en IA, regulaciones estrictas",
    strategy: "Construcción de data lake centralizado, partnerships con startups de IA, compliance framework",
    results: "Nueva línea de ingresos de $2.5M anuales, ventaja competitiva en scoring, ROI 300% en 2 años",
    keyLearnings: [
      "Los datos son un activo que requiere inversión continua",
      "La IA no reemplaza decisiones humanas, las mejora",
      "Compliance es enabler, no bloqueador",
      "Ecosistema de partnerships acelera time-to-market",
    ],
    relevantTesis: "Data es el nuevo petróleo",
  },
  {
    id: "cs-003",
    title: "Upskilling Masivo Durante Crisis de Talento",
    description: "Empresa tech que redujo rotación 40% mediante programa interno de desarrollo",
    category: "Desarrollo de Talento",
    difficulty: "Básico",
    duration: 10,
    industry: "Tecnología",
    challenge: "Rotación 35%, mercado compitiendo por talento senior, presupuesto limitado",
    strategy: "Programa interno de mentoría, learning paths claros, oportunidades de crecimiento visible",
    results: "Rotación reducida a 21%, 60% de promociones internas, NPS de empleados +45",
    keyLearnings: [
      "El talento quiere crecer, no necesariamente cambiar de empresa",
      "Mentoría peer es tan efectiva como coaching externo",
      "Transparencia en carrera acelera compromiso",
    ],
    relevantTesis: "La cultura es competitiva",
  },
]

export function PruebasTab() {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null)
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  const handleMarkComplete = (caseId: string) => {
    const newCompleted = new Set(completed)
    if (newCompleted.has(caseId)) {
      newCompleted.delete(caseId)
    } else {
      newCompleted.add(caseId)
    }
    setCompleted(newCompleted)
  }

  if (selectedCase) {
    return (
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{selectedCase.title}</CardTitle>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline">{selectedCase.category}</Badge>
                <Badge variant="secondary">{selectedCase.difficulty}</Badge>
                <Badge variant="outline">Industria: {selectedCase.industry}</Badge>
              </div>
            </div>
            <Button variant="outline" onClick={() => setSelectedCase(null)}>
              Atrás
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold">El Desafío</h3>
            </div>
            <p className="text-muted-foreground">{selectedCase.challenge}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">La Estrategia</h3>
            </div>
            <p className="text-muted-foreground">{selectedCase.strategy}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold">Los Resultados</h3>
            </div>
            <p className="text-muted-foreground">{selectedCase.results}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold">Aprendizajes Clave</h3>
            </div>
            <ul className="space-y-2">
              {selectedCase.keyLearnings.map((learning, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold">•</span>
                  {learning}
                </li>
              ))}
            </ul>
          </div>

          {selectedCase.relevantTesis && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Tesis relacionada:</p>
              <p className="font-semibold text-primary">"{selectedCase.relevantTesis}"</p>
            </div>
          )}

          <Button
            className="w-full"
            variant={completed.has(selectedCase.id) ? "default" : "outline"}
            onClick={() => handleMarkComplete(selectedCase.id)}
          >
            {completed.has(selectedCase.id) ? "✓ Caso Completado" : "Marcar como Completado"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {caseStudies.map((caseStudy) => (
          <Card
            key={caseStudy.id}
            className="border-0 bg-card/70 backdrop-blur-sm hover:bg-card/90 transition-colors cursor-pointer"
            onClick={() => setSelectedCase(caseStudy)}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-lg line-clamp-2">{caseStudy.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{caseStudy.description}</p>
                </div>
                {completed.has(caseStudy.id) && (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {caseStudy.difficulty}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {caseStudy.duration} min
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{caseStudy.industry}</p>
                <Button size="sm" variant="ghost" className="w-full text-xs">
                  Leer caso →
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
