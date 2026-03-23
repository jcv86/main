"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookMarked, ArrowRight, Users, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { useSession } from "next-auth/react"

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
    category: "Innovación de Modelo de Negocio",
    difficulty: "Avanzado",
    duration: 15,
    industry: "Finanzas",
    challenge: "Presión de márgenes, competencia de fintechs, datos subutilizados",
    strategy: "Crear hub de datos interno, partnering con fintech para APIs, compliance by design",
    results: "+$45M en ingresos anuales, 2 nuevas líneas de negocio B2B, 15% en retención de clientes",
    keyLearnings: [
      "Compliance y privacidad son ventajas competitivas, no restricciones",
      "El talento en data science es el cuello de botella real",
      "Ecosistema abierto genera más valor que silos cerrados",
      "Monetización requiere entender al cliente partner mejor que él",
    ],
    relevantTesis: "Datos son nuevo petróleo",
  },
  {
    id: "cs-003",
    title: "Sustentabilidad como Estrategia Competitiva",
    description: "Empresa manufacturera que capturó mercado premium mediante propuesta ESG integral",
    category: "Sustentabilidad",
    difficulty: "Intermedio",
    duration: 14,
    industry: "Manufactura",
    challenge: "Commoditización del producto, presión de precios, regulaciones ESG crecientes",
    strategy: "Rediseño de cadena de suministro sostenible, certificaciones internacionales, storytelling B2B",
    results: "Precio promedio +28%, expansión a 12 nuevos mercados, evaluación positiva de ESG",
    keyLearnings: [
      "Los consumidores premium pagan por convicción, no solo por atributos",
      "Sustentabilidad requiere ripple effect en toda la cadena",
      "Transparencia radical genera confianza",
      "ROI de ESG es más rápido en B2B que B2C",
    ],
    relevantTesis: "ESG es mainstream, no marginal",
  },
  {
    id: "cs-004",
    title: "Automatización Robótica en Back-Office",
    description: "Organización de servicios que aumentó productividad 60% sin despidos",
    category: "Automatización",
    difficulty: "Básico",
    duration: 10,
    industry: "Servicios",
    challenge: "Procesos manuales repetitivos, cuellos de botella en operaciones, rotación de personal",
    strategy: "Auditoría de procesos, implementación RPA en fases, reskilling de equipos",
    results: "60% aumento en productividad, 40% reducción en errores, reubicación 100% de personal",
    keyLearnings: [
      "RPA no reemplaza personas, reemplaza tareas",
      "Cambio organizacional es más importante que tecnología",
      "Empezar pequeño y escalar rápido es más efectivo",
      "Upskilling genera mejor retención que despidos",
    ],
    relevantTesis: "Automatización es oportunidad, no amenaza",
  },
  {
    id: "cs-005",
    title: "Plataforma de Economía Colaborativa en Latinoamérica",
    description: "Marketplace que llegó a 500K usuarios en 24 meses con modelo unit economics positivo",
    category: "Plataformas Digitales",
    difficulty: "Avanzado",
    duration: 16,
    industry: "Tecnología",
    challenge: "Riesgo regulatorio alto, competencia global, chicken-egg de network effects",
    strategy: "Community building antes de scaling, compliance local desde inicio, partnerships con gobiernos",
    results: "500K usuarios activos, profitabilidad en unidad de negocio principal, Series B cerrada",
    keyLearnings: [
      "Network effects requieren paciencia estratégica y capitalización",
      "Regulación debe ser aliada, no enemiga",
      "Comunidad local es fortaleza contra competencia global",
      "Rentabilidad temprana atrae inversión de calidad",
    ],
    relevantTesis: "Plataformas ganador-ganador escalan más rápido",
  },
]

export function PruebasTab() {
  const { data: session } = useSession()
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
