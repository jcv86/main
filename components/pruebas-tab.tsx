"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookMarked, ArrowRight, Users, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"

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
  completed?: boolean
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
          {/* The Challenge */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold">El Desafío</h3>
            </div>
            <p className="text-muted-foreground">{selectedCase.challenge}</p>
          </div>

          {/* The Strategy */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">La Estrategia</h3>
            </div>
            <p className="text-muted-foreground">{selectedCase.strategy}</p>
          </div>

          {/* The Results */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold">Los Resultados</h3>
            </div>
            <p className="text-muted-foreground">{selectedCase.results}</p>
          </div>

          {/* Key Learnings */}
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

          {/* Related Thesis */}
          {selectedCase.relevantTesis && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Tesis relacionada:</p>
              <p className="font-semibold text-primary">"{selectedCase.relevantTesis}"</p>
            </div>
          )}

          {/* Mark Complete Button */}
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
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null)
  const [completedCases, setCompletedCases] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<string>("")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("")

  // Get unique categories and difficulties
  const categories = Array.from(new Set(caseStudies.map((cs) => cs.category)))
  const difficulties = ["Básico", "Intermedio", "Avanzado"]

  const filteredCases = caseStudies.filter((cs) => {
    const matchesCategory = !filter || cs.category === filter
    const matchesDifficulty = !difficultyFilter || cs.difficulty === difficultyFilter
    return matchesCategory && matchesDifficulty
  })

  const handleCompleteCase = (caseId: string) => {
    setCompletedCases((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(caseId)) {
        newSet.delete(caseId)
      } else {
        newSet.add(caseId)
      }
      return newSet
    })
  }

  const completionPercentage = (completedCases.size / caseStudies.length) * 100

  if (selectedCase) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setSelectedCase(null)}
          className="text-sm"
        >
          ← Volver a Casos de Estudio
        </Button>

        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <div className="space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-balance">{selectedCase.title}</h1>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {selectedCase.difficulty}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-lg">{selectedCase.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {selectedCase.industry}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {selectedCase.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  ⏱️ {selectedCase.duration} min
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Challenge */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h2 className="text-lg font-semibold">El Desafío</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{selectedCase.challenge}</p>
            </div>

            {/* Strategy */}
            <div className="space-y-2 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold">La Estrategia</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{selectedCase.strategy}</p>
            </div>

            {/* Results */}
            <div className="space-y-2 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h2 className="text-lg font-semibold">Los Resultados</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium bg-green-500/5 border border-green-500/20 p-3 rounded-lg">
                {selectedCase.results}
              </p>
            </div>

            {/* Key Learnings */}
            <div className="space-y-3 pt-4 border-t border-border/50">
              <h2 className="text-lg font-semibold">Aprendizajes Clave</h2>
              <div className="space-y-2">
                {selectedCase.keyLearnings.map((learning, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-muted/50 rounded-lg border border-border/50">
                    <div className="flex-shrink-0 pt-1">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    </div>
                    <p className="text-sm text-muted-foreground">{learning}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Relevant Thesis */}
            {selectedCase.relevantTesis && (
              <div className="space-y-2 pt-4 border-t border-border/50">
                <h2 className="text-lg font-semibold">Tesis Estratégica Relacionada</h2>
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm font-medium text-primary">💡 {selectedCase.relevantTesis}</p>
                </div>
              </div>
            )}

            {/* Completion Button */}
            <div className="pt-4 border-t border-border/50 flex gap-2">
              <Button
                onClick={() => handleCompleteCase(selectedCase.id)}
                variant={completedCases.has(selectedCase.id) ? "default" : "outline"}
                className="flex-1 text-sm"
              >
                {completedCases.has(selectedCase.id) ? "✓ Caso Completado" : "Marcar como Completado"}
              </Button>
              <Button variant="outline" className="flex-1 text-sm">
                📌 Guardar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Casos Disponibles</p>
              <p className="text-3xl font-bold">{caseStudies.length}</p>
              <Badge variant="outline" className="text-xs mt-2">
                {filteredCases.length} que coinciden
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Completados</p>
              <p className="text-3xl font-bold">{completedCases.size}</p>
              <Progress value={completionPercentage} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Horas de Aprendizaje</p>
              <p className="text-3xl font-bold">
                {Math.round(Array.from(completedCases).reduce((sum, id) => {
                  const cs = caseStudies.find((c) => c.id === id)
                  return sum + (cs?.duration || 0)
                }, 0) / 60)}
              </p>
              <Badge variant="outline" className="text-xs mt-2">
                desde inicio
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardContent className="pt-6 space-y-3">
          <div className="space-y-2">
            <p className="text-sm font-medium">Categoría</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("")}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  filter === ""
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Todas
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    filter === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Dificultad</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDifficultyFilter("")}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  difficultyFilter === ""
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Todas
              </button>
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    difficultyFilter === diff
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Case Studies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredCases.map((caseStudy) => (
          <Card
            key={caseStudy.id}
            className="border-0 bg-card/70 backdrop-blur-sm hover:bg-card/90 transition-colors cursor-pointer"
            onClick={() => setSelectedCase(caseStudy)}
          >
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-base line-clamp-2">{caseStudy.title}</h3>
                    {completedCases.has(caseStudy.id) && (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {caseStudy.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-xs">
                    {caseStudy.industry}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {caseStudy.category}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BookMarked className="w-3 h-3" />
                    {caseStudy.duration} min
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      caseStudy.difficulty === "Básico"
                        ? "bg-green-500/10 text-green-700 dark:text-green-400"
                        : caseStudy.difficulty === "Intermedio"
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          : "bg-red-500/10 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {caseStudy.difficulty}
                  </Badge>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedCase(caseStudy)
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  Leer Caso <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardContent className="py-12 text-center text-muted-foreground">
            No se encontraron casos de estudio con los filtros seleccionados.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
