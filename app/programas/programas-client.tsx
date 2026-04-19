"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Heart,
  Brain,
  Users,
  Target,
  Lightbulb,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  BookOpen,
  Play,
} from "lucide-react"
import Link from "next/link"

const PROGRAMAS = [
  {
    id: "liderazgo-consciente",
    title: "Liderazgo Consciente",
    duration: 90,
    description: "Desarrolla tu capacidad de liderazgo con inteligencia emocional y propósito",
    icon: Brain,
    color: "from-blue/50/50",
    level: "Intermedio",
    modules: 12,
    testsRequired: ["DISC", "Inteligencia Emocional"],
    outcomes: [
      "Liderar equipos con empatía y claridad",
      "Tomar decisiones difíciles con confianza",
      "Inspirar y motivar auténticamente",
      "Gestionar conflictos constructivamente",
    ],
  },
  {
    id: "relaciones-sanas",
    title: "Relaciones Sanas",
    duration: 60,
    description: "Construye conexiones auténticas en pareja, familia y amistades",
    icon: Heart,
    color: "from-red/50500",
    level: "Básico",
    modules: 8,
    testsRequired: ["Inteligencia Emocional"],
    outcomes: [
      "Comunicación empática y asertiva",
      "Establecer límites sanos",
      "Resolver conflictos sin dañar la relación",
      "Profundizar conexiones emocionales",
    ],
  },
  {
    id: "gestion-emocional",
    title: "Gestión Emocional",
    duration: 90,
    description: "Domina tus emociones y desarrolla resiliencia emocional",
    icon: Target,
    color: "from-green/50",
    level: "Básico",
    modules: 12,
    testsRequired: ["Inteligencia Emocional", "Big Five"],
    outcomes: [
      "Reconocer y nombrar emociones complejas",
      "Técnicas de autorregulación efectivas",
      "Reducir ansiedad y estrés",
      "Desarrollar inteligencia emocional avanzada",
    ],
  },
  {
    id: "proposito-vocacional",
    title: "Propósito Vocacional",
    duration: 90,
    description: "Descubre tu vocación y diseña una carrera con significado",
    icon: Lightbulb,
    color: "from-yellow-500/50",
    level: "Intermedio",
    modules: 12,
    testsRequired: ["RIASEC", "MBTI", "Soft Skills"],
    outcomes: [
      "Claridad sobre tu propósito profesional",
      "Plan de carrera alineado con tus valores",
      "Superar el miedo a cambiar de rumbo",
      "Monetizar tu pasión",
    ],
  },
  {
    id: "comunicacion-efectiva",
    title: "Comunicación Efectiva",
    duration: 60,
    description: "Comunica con claridad, empatía e impacto en cualquier contexto",
    icon: Users,
    color: "from-blue/50/50",
    level: "Básico",
    modules: 8,
    testsRequired: ["DISC", "Soft Skills"],
    outcomes: [
      "Adaptar tu mensaje a diferentes audiencias",
      "Hablar en público con confianza",
      "Conversaciones difíciles sin conflicto",
      "Escucha activa profunda",
    ],
  },
  {
    id: "habitos-transformadores",
    title: "Hábitos Transformadores",
    duration: 90,
    description: "Construye rutinas que cambien tu vida personal y profesional",
    icon: TrendingUp,
    color: "from-purple/50500",
    level: "Básico",
    modules: 12,
    testsRequired: ["Big Five"],
    outcomes: [
      "Sistema de hábitos sostenible",
      "Rutina matutina poderosa",
      "Eliminar hábitos autodestructivos",
      "Productividad sin burnout",
    ],
  },
]

export default function ProgramasClient() {
  const [selectedProgram, setSelectedProgram] = useState(PROGRAMAS[0])

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-background">
          Programas Guiados DTC
        </h1>
        <p className="text-xl text-muted/60 max-w-2xl mx-auto">
          Rutas estructuradas de 60-90 días para transformar áreas clave de tu vida personal y profesional
        </p>
      </div>

      {/* Programs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROGRAMAS.map((programa) => {
          const Icon = programa.icon
          return (
            <Card
              key={programa.id}
              className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple/30"
              onClick={() => setSelectedProgram(programa)}
            >
              <CardHeader>
                <div
                  className={`h-12 w-12 rounded-lg bg-background`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl">{programa.title}</CardTitle>
                  <Badge variant="outline">{programa.level}</Badge>
                </div>
                <CardDescription>{programa.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted/60">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{programa.duration} días</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{programa.modules} módulos</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Selected Program Details */}
      <Card className="border-2 border-purple/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`h-16 w-16 rounded-lg bg-background`}
              >
                {(() => {
                  const Icon = selectedProgram.icon
                  return <Icon className="h-8 w-8 text-white" />
                })()}
              </div>
              <div>
                <CardTitle className="text-2xl">{selectedProgram.title}</CardTitle>
                <CardDescription className="text-base">{selectedProgram.description}</CardDescription>
              </div>
            </div>
            <Badge className="text-base px-4 py-2">{selectedProgram.level}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-blue/5">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-blue" />
                  <span className="font-semibold">Duración</span>
                </div>
                <p className="text-2xl font-bold text-blue">{selectedProgram.duration} días</p>
              </CardContent>
            </Card>
            <Card className="bg-purple/5">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-purple" />
                  <span className="font-semibold">Módulos</span>
                </div>
                <p className="text-2xl font-bold text-purple">{selectedProgram.modules}</p>
              </CardContent>
            </Card>
            <Card className="bg-green/5">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-green" />
                  <span className="font-semibold">Tiempo/día</span>
                </div>
                <p className="text-2xl font-bold text-green">30-45 min</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Tests Requeridos</h3>
            <div className="flex flex-wrap gap-2">
              {selectedProgram.testsRequired.map((test) => (
                <Badge key={test} variant="secondary" className="text-sm py-1 px-3">
                  {test}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Al completar este programa podrás</h3>
            <ul className="space-y-2">
              {selectedProgram.outcomes.map((outcome, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green mt-0.5 flex-shrink-0" />
                  <span className="text-muted">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>Enfoque Personal Primero</AlertTitle>
            <AlertDescription>
              Todos los programas DTC priorizan tu desarrollo personal, relaciones y bienestar emocional sobre
              resultados laborales.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button size="lg" className={`bg-background`}>
              <Play className="mr-2 h-4 w-4" />
              Iniciar Programa
            </Button>
            <Link href="/test">
              <Button size="lg" variant="outline">
                Completar Tests Requeridos
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>¿Cómo funcionan los Programas Guiados?</CardTitle>
          <CardDescription>Un sistema estructurado para transformación real</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: "Diagnóstico Personalizado",
                description: "Basado en tus resultados de tests DTC",
                icon: Brain,
              },
              {
                step: 2,
                title: "Lecciones Semanales",
                description: "Contenido teórico y ejercicios prácticos",
                icon: BookOpen,
              },
              {
                step: 3,
                title: "Práctica Guiada",
                description: "Simulaciones y conversaciones con Coach IA",
                icon: Target,
              },
              {
                step: 4,
                title: "Seguimiento",
                description: "Track de progreso y ajustes personalizados",
                icon: TrendingUp,
              },
            ].map(({ step, title, description, icon: Icon }) => (
              <div key={step} className="text-center space-y-3">
                <div className="h-16 w-16 rounded-full bg-purple/10 flex items-center justify-center mx-auto">
                  <Icon className="h-8 w-8 text-purple" />
                </div>
                <div>
                  <Badge className="mb-2">Paso {step}</Badge>
                  <h4 className="font-semibold">{title}</h4>
                  <p className="text-sm text-muted/60">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
