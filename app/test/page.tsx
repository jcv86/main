"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  Clock,
  Star,
  TrendingUp,
  Award,
  Zap,
  CheckCircle,
  ArrowRight,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"

const tests = [
  {
    id: "emotional-intelligence",
    title: "Inteligencia Emocional",
    description: "Evalúa tu capacidad para reconocer, entender y manejar emociones propias y ajenas",
    icon: Heart,
    color: "from-red-500 to-pink-500",
    bgColor: "from-red-50 to-pink-50",
    duration: "20-30 min",
    questions: 30,
    competencies: 5,
    features: ["Análisis por competencias", "Plan de desarrollo", "Implicaciones profesionales", "Perfil emocional"],
    available: true,
  },
  {
    id: "disc",
    title: "Test DISC",
    description: "Descubre tu estilo de comportamiento y personalidad en el trabajo",
    icon: Target,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50",
    duration: "15-20 min",
    questions: 24,
    competencies: 4,
    features: ["Perfil DISC", "Estilo de trabajo", "Fortalezas naturales", "Áreas de desarrollo"],
    available: true,
  },
  {
    id: "big-five",
    title: "Big Five",
    description: "Análisis completo de los cinco grandes factores de personalidad",
    icon: Brain,
    color: "from-purple-500 to-indigo-500",
    bgColor: "from-purple-50 to-indigo-50",
    duration: "25-35 min",
    questions: 50,
    competencies: 5,
    features: ["Cinco dimensiones", "Percentiles", "Comparación poblacional", "Predicciones laborales"],
    available: true,
  },
  {
    id: "mbti",
    title: "MBTI",
    description: "Identifica tu tipo de personalidad según el indicador Myers-Briggs",
    icon: Users,
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50",
    duration: "20-25 min",
    questions: 32,
    competencies: 4,
    features: ["16 tipos de personalidad", "Preferencias cognitivas", "Dinámicas de equipo", "Desarrollo personal"],
    available: true,
  },
  {
    id: "riasec",
    title: "RIASEC",
    description: "Descubre tus intereses vocacionales y carreras compatibles",
    icon: Lightbulb,
    color: "from-yellow-500 to-orange-500",
    bgColor: "from-yellow-50 to-orange-50",
    duration: "15-20 min",
    questions: 36,
    competencies: 6,
    features: ["Intereses vocacionales", "Carreras sugeridas", "Ambientes de trabajo", "Código Holland"],
    available: true,
  },
  {
    id: "soft-skills",
    title: "Habilidades Blandas",
    description: "Evalúa tus competencias interpersonales y de liderazgo",
    icon: Star,
    color: "from-teal-500 to-cyan-500",
    bgColor: "from-teal-50 to-cyan-50",
    duration: "25-30 min",
    questions: 40,
    competencies: 8,
    features: ["Competencias clave", "Liderazgo", "Comunicación", "Trabajo en equipo"],
    available: true,
  },
]

const stats = {
  totalTests: 6,
  totalQuestions: 212,
  avgDuration: "22 min",
  completionRate: "94%",
}

export default function TestsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = [
    { id: "all", name: "Todos los Tests", icon: BarChart3 },
    { id: "personality", name: "Personalidad", icon: Brain },
    { id: "emotional", name: "Inteligencia Emocional", icon: Heart },
    { id: "vocational", name: "Vocacional", icon: Target },
    { id: "skills", name: "Habilidades", icon: Star },
  ]

  const getCategoryTests = (category: string) => {
    if (category === "all") return tests
    if (category === "personality") return tests.filter((t) => ["disc", "big-five", "mbti"].includes(t.id))
    if (category === "emotional") return tests.filter((t) => t.id === "emotional-intelligence")
    if (category === "vocational") return tests.filter((t) => t.id === "riasec")
    if (category === "skills") return tests.filter((t) => t.id === "soft-skills")
    return tests
  }

  const filteredTests = getCategoryTests(selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg">
              <BarChart3 className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Centro de Evaluaciones</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre tu potencial con nuestros tests psicométricos profesionales. Obtén insights profundos sobre tu
            personalidad, habilidades y preferencias vocacionales.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center shadow-lg">
            <CardContent className="p-6">
              <BookOpen className="h-10 w-10 mx-auto mb-3 text-blue-500" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalTests}</div>
              <div className="text-sm text-gray-600">Tests Disponibles</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg">
            <CardContent className="p-6">
              <Activity className="h-10 w-10 mx-auto mb-3 text-green-500" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</div>
              <div className="text-sm text-gray-600">Preguntas Total</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg">
            <CardContent className="p-6">
              <Clock className="h-10 w-10 mx-auto mb-3 text-yellow-500" />
              <div className="text-2xl font-bold text-gray-900">{stats.avgDuration}</div>
              <div className="text-sm text-gray-600">Duración Promedio</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg">
            <CardContent className="p-6">
              <TrendingUp className="h-10 w-10 mx-auto mb-3 text-purple-500" />
              <div className="text-2xl font-bold text-gray-900">{stats.completionRate}</div>
              <div className="text-sm text-gray-600">Tasa de Finalización</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{category.name}</span>
              </Button>
            )
          })}
        </div>

        {/* Tests Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredTests.map((test) => {
            const IconComponent = test.icon
            return (
              <Card
                key={test.id}
                className={`shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br ${test.bgColor} border-0`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-4 rounded-full bg-gradient-to-r ${test.color} shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    {test.available && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">Disponible</Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl text-gray-900">{test.title}</CardTitle>
                  <CardDescription className="text-gray-700 leading-relaxed">{test.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Test Info */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-white bg-opacity-60 rounded-lg">
                      <Clock className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                      <div className="text-sm font-medium text-gray-900">{test.duration}</div>
                      <div className="text-xs text-gray-600">Duración</div>
                    </div>
                    <div className="p-3 bg-white bg-opacity-60 rounded-lg">
                      <BookOpen className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                      <div className="text-sm font-medium text-gray-900">{test.questions}</div>
                      <div className="text-xs text-gray-600">Preguntas</div>
                    </div>
                    <div className="p-3 bg-white bg-opacity-60 rounded-lg">
                      <PieChart className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                      <div className="text-sm font-medium text-gray-900">{test.competencies}</div>
                      <div className="text-xs text-gray-600">Áreas</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm">Incluye:</h4>
                    <div className="space-y-1">
                      {test.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => router.push(`/test/${test.id}`)}
                    disabled={!test.available}
                    className={`w-full bg-gradient-to-r ${test.color} hover:opacity-90 text-white shadow-lg`}
                    size="lg"
                  >
                    {test.available ? (
                      <>
                        <span>Comenzar Test</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    ) : (
                      <span>Próximamente</span>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Featured Test Spotlight */}
        <Card className="shadow-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white mb-12">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Heart className="h-10 w-10" />
                  <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    ⭐ Destacado
                  </Badge>
                </div>
                <h2 className="text-3xl font-bold mb-4">Test de Inteligencia Emocional</h2>
                <p className="text-red-100 text-lg leading-relaxed mb-6">
                  Nuestro test más completo y popular. Descubre tu capacidad para manejar emociones y liderar con
                  efectividad. Incluye análisis detallado en 4 pestañas con recomendaciones personalizadas.
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>30 preguntas especializadas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>5 competencias evaluadas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Plan de desarrollo incluido</span>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/test/emotional-intelligence")}
                  size="lg"
                  className="bg-white text-red-500 hover:bg-gray-100 shadow-lg"
                >
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-10 rounded-2xl p-8">
                  <Heart className="h-24 w-24 mx-auto mb-6 text-white" />
                  <div className="text-4xl font-bold mb-2">4.9/5</div>
                  <div className="text-red-100">Calificación promedio</div>
                  <div className="flex justify-center mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-current text-yellow-300" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <Card className="shadow-lg mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">¿Por qué tomar nuestros tests?</CardTitle>
            <CardDescription className="text-lg">
              Beneficios de completar las evaluaciones psicométricas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Autoconocimiento</h3>
                <p className="text-gray-600 leading-relaxed">
                  Obtén insights profundos sobre tu personalidad, fortalezas y áreas de mejora para el crecimiento
                  personal.
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-green-100 rounded-full w-fit mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Desarrollo Profesional</h3>
                <p className="text-gray-600 leading-relaxed">
                  Identifica oportunidades de carrera y desarrolla las competencias más valoradas en el mercado laboral.
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Mejores Relaciones</h3>
                <p className="text-gray-600 leading-relaxed">
                  Comprende mejor tu estilo de comunicación y cómo interactuar más efectivamente con otros.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Listo para comenzar tu evaluación?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Elige el test que más te interese y descubre insights valiosos sobre tu perfil profesional y personal.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => router.push("/test/emotional-intelligence")}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8"
            >
              Test Más Popular
              <Heart className="ml-2 h-5 w-5" />
            </Button>
            <Button onClick={() => router.push("/dashboard")} variant="outline" size="lg" className="bg-white px-8">
              Ver Dashboard
              <BarChart3 className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
