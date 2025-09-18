"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Heart,
  Users,
  Target,
  Lightbulb,
  BookOpen,
  Award,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  BarChart3,
  Sparkles,
  Trophy,
  Rocket,
  Globe,
  Shield,
  Compass,
} from "lucide-react"
import { useRouter } from "next/navigation"

const tests = [
  {
    id: "emotional-intelligence",
    title: "Inteligencia Emocional",
    description: "Evalúa tu capacidad para reconocer, entender y manejar emociones propias y ajenas",
    icon: Heart,
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-50",
    duration: "25 min",
    questions: 30,
    categories: ["Autoconciencia", "Autorregulación", "Motivación", "Empatía", "Habilidades Sociales"],
    comingSoon: false,
    featured: true,
  },
  {
    id: "disc",
    title: "Test DISC",
    description: "Descubre tu estilo de comportamiento y comunicación predominante",
    icon: Target,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    duration: "15 min",
    questions: 24,
    categories: ["Dominancia", "Influencia", "Estabilidad", "Cumplimiento"],
    comingSoon: false,
  },
  {
    id: "big-five",
    title: "Big Five",
    description: "Análisis completo de los cinco grandes factores de personalidad",
    icon: Brain,
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-50",
    duration: "20 min",
    questions: 50,
    categories: ["Apertura", "Responsabilidad", "Extraversión", "Amabilidad", "Neuroticismo"],
    comingSoon: false,
  },
  {
    id: "mbti",
    title: "MBTI",
    description: "Identifica tu tipo de personalidad según Myers-Briggs",
    icon: Lightbulb,
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50",
    duration: "18 min",
    questions: 40,
    categories: ["Extraversión/Introversión", "Sensación/Intuición", "Pensamiento/Sentimiento", "Juicio/Percepción"],
    comingSoon: false,
  },
  {
    id: "riasec",
    title: "RIASEC",
    description: "Descubre tus intereses vocacionales y carreras compatibles",
    icon: Compass,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    duration: "22 min",
    questions: 36,
    categories: ["Realista", "Investigativo", "Artístico", "Social", "Emprendedor", "Convencional"],
    comingSoon: false,
  },
  {
    id: "soft-skills",
    title: "Habilidades Blandas",
    description: "Evalúa tus competencias interpersonales y profesionales",
    icon: Users,
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50",
    duration: "20 min",
    questions: 35,
    categories: ["Comunicación", "Liderazgo", "Trabajo en Equipo", "Adaptabilidad", "Resolución de Problemas"],
    comingSoon: false,
  },
]

const features = [
  {
    icon: Brain,
    title: "Análisis Profundo",
    description: "Evaluaciones basadas en metodologías científicas validadas",
  },
  {
    icon: Zap,
    title: "Resultados Instantáneos",
    description: "Obtén tu perfil completo inmediatamente después del test",
  },
  {
    icon: Shield,
    title: "100% Confidencial",
    description: "Tus datos están protegidos y nunca se comparten",
  },
  {
    icon: Trophy,
    title: "Recomendaciones Personalizadas",
    description: "Recibe consejos específicos para tu desarrollo profesional",
  },
]

const stats = [
  { number: "50,000+", label: "Tests Completados" },
  { number: "95%", label: "Satisfacción" },
  { number: "6", label: "Evaluaciones Disponibles" },
  { number: "24/7", label: "Acceso Disponible" },
]

export function LandingPage() {
  const router = useRouter()
  const [selectedTest, setSelectedTest] = useState<string | null>(null)

  const handleStartTest = (testId: string) => {
    router.push(`/test/${testId}`)
  }

  const featuredTest = tests.find((test) => test.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                <Sparkles className="h-16 w-16 text-yellow-300" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Descubre Tu Potencial
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Evaluaciones psicométricas profesionales para impulsar tu carrera y desarrollo personal
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => handleStartTest("emotional-intelligence")}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-4 text-lg shadow-xl"
              >
                <Heart className="mr-2 h-6 w-6" />
                Comenzar Test Destacado
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("tests")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4 text-lg backdrop-blur-sm"
              >
                <Globe className="mr-2 h-6 w-6" />
                Explorar Todos los Tests
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Test Section */}
      {featuredTest && (
        <section className="py-20 bg-gradient-to-br from-red-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-red-100 text-red-800 px-4 py-2 text-sm font-semibold">✨ Test Destacado</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Test de Inteligencia Emocional</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Descubre y desarrolla tu capacidad para manejar emociones y relaciones interpersonales
              </p>
            </div>

            <Card className="max-w-4xl mx-auto shadow-2xl border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-8 text-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-full">
                      <Heart className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{featuredTest.title}</h3>
                      <p className="text-red-100">{featuredTest.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-white/20 text-white px-3 py-1">Nuevo</Badge>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-red-200" />
                    <div className="text-lg font-semibold">{featuredTest.duration}</div>
                    <div className="text-red-200 text-sm">Duración</div>
                  </div>
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-red-200" />
                    <div className="text-lg font-semibold">{featuredTest.questions} preguntas</div>
                    <div className="text-red-200 text-sm">Evaluación completa</div>
                  </div>
                  <div className="text-center">
                    <Award className="h-8 w-8 mx-auto mb-2 text-red-200" />
                    <div className="text-lg font-semibold">5 competencias</div>
                    <div className="text-red-200 text-sm">Análisis detallado</div>
                  </div>
                </div>
              </div>

              <CardContent className="p-8">
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">¿Qué evalúa este test?</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {featuredTest.categories.map((category, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">{category}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={() => handleStartTest(featuredTest.id)}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-12 py-4 text-lg shadow-lg"
                  >
                    <Rocket className="mr-2 h-6 w-6" />
                    Comenzar Test Ahora
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* All Tests Section */}
      <section id="tests" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Evaluaciones Disponibles</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Elige la evaluación que mejor se adapte a tus objetivos de desarrollo profesional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tests.map((test) => {
              const IconComponent = test.icon
              return (
                <Card
                  key={test.id}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer border-0 ${
                    test.comingSoon ? "opacity-75" : ""
                  }`}
                  onClick={() => !test.comingSoon && setSelectedTest(test.id)}
                >
                  <div className={`h-2 bg-gradient-to-r ${test.color}`}></div>
                  <CardHeader className={`${test.bgColor} pb-4`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-r ${test.color} rounded-full shadow-lg`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      {test.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs">Destacado</Badge>
                      )}
                      {test.comingSoon && (
                        <Badge className="bg-gray-100 text-gray-600 px-2 py-1 text-xs">Próximamente</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl text-gray-900">{test.title}</CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{test.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="h-4 w-4" />
                        <span>{test.questions} preguntas</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="text-sm font-medium text-gray-700 mb-2">Evalúa:</div>
                      <div className="flex flex-wrap gap-1">
                        {test.categories.slice(0, 3).map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                        {test.categories.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{test.categories.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button
                      className={`w-full bg-gradient-to-r ${test.color} hover:opacity-90 text-white shadow-lg`}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!test.comingSoon) {
                          handleStartTest(test.id)
                        }
                      }}
                      disabled={test.comingSoon}
                    >
                      {test.comingSoon ? (
                        <>
                          <Clock className="mr-2 h-4 w-4" />
                          Próximamente
                        </>
                      ) : (
                        <>
                          <Rocket className="mr-2 h-4 w-4" />
                          Comenzar Test
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir nuestras evaluaciones?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tecnología avanzada y metodologías científicas para resultados precisos y útiles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para descubrir tu potencial?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Únete a miles de profesionales que han transformado su carrera con nuestras evaluaciones
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => handleStartTest("emotional-intelligence")}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg shadow-xl"
            >
              <Heart className="mr-2 h-6 w-6" />
              Comenzar Ahora
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/biblioteca")}
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
            >
              <BookOpen className="mr-2 h-6 w-6" />
              Explorar Biblioteca
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
