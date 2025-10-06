"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LearningPathCard } from "@/components/learning-path-card"
import { SkillGapAnalysis } from "@/components/skill-gap-analysis"
import { Sparkles, Search, TrendingUp, Target, BookOpen, Filter, Award } from "lucide-react"

export default function LearningPathsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("recommended")
  const userEmail = "demo-user" // In production, get from auth

  // Mock data - replace with actual API calls
  const recommendedPaths = [
    {
      id: 1,
      title: "Liderazgo Efectivo en el Siglo XXI",
      description:
        "Desarrolla habilidades de liderazgo moderno: influencia, comunicación y gestión de equipos remotos.",
      category: "Liderazgo",
      difficulty_level: "intermediate",
      estimated_hours: 20,
      skills_covered: ["Comunicación Efectiva", "Gestión de Equipos", "Inteligencia Emocional", "Toma de Decisiones"],
      completion_rate: 78,
      popularity_score: 85,
      match_score: 92,
      match_reason: "Aborda tus brechas de habilidades en liderazgo y comunicación",
    },
    {
      id: 2,
      title: "Productividad Personal: Del Caos a la Excelencia",
      description: "Sistema completo para dominar tu tiempo, energía y atención en la era digital.",
      category: "Productividad",
      difficulty_level: "intermediate",
      estimated_hours: 15,
      skills_covered: ["Gestión del Tiempo", "Organización Personal", "Focus y Concentración", "Hábitos Atómicos"],
      completion_rate: 85,
      popularity_score: 92,
      match_score: 88,
      match_reason: "Popular entre profesionales con objetivos similares",
    },
  ]

  const myPaths = [
    {
      id: 2,
      title: "Productividad Personal: Del Caos a la Excelencia",
      description: "Sistema completo para dominar tu tiempo, energía y atención en la era digital.",
      category: "Productividad",
      difficulty_level: "intermediate",
      estimated_hours: 15,
      skills_covered: ["Gestión del Tiempo", "Organización Personal", "Focus y Concentración", "Hábitos Atómicos"],
      completion_rate: 85,
      popularity_score: 92,
      userProgress: {
        completion_percentage: 45,
        streak_days: 7,
        status: "in_progress",
      },
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Rutas de Aprendizaje</h1>
            <p className="text-muted-foreground">Caminos estructurados para el desarrollo profesional continuo</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-muted-foreground">Rutas Disponibles</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-muted-foreground">En Progreso</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <p className="text-2xl font-bold">7</p>
                <p className="text-xs text-muted-foreground">Días de Racha</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">45%</p>
                <p className="text-xs text-muted-foreground">Progreso Total</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Skill Gap Analysis */}
      <div className="mb-8">
        <SkillGapAnalysis userEmail={userEmail} />
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar rutas de aprendizaje..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommended">
            <Sparkles className="h-4 w-4 mr-2" />
            Recomendadas
            <Badge variant="secondary" className="ml-2">
              2
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="my-paths">
            <BookOpen className="h-4 w-4 mr-2" />
            Mis Rutas
            <Badge variant="secondary" className="ml-2">
              1
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="all">
            <TrendingUp className="h-4 w-4 mr-2" />
            Explorar Todas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="space-y-6">
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Recomendaciones Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Estas rutas están seleccionadas específicamente para ti basándose en:
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">•</span>
                  Tus brechas de habilidades identificadas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">•</span>
                  Tu perfil psicométrico (DISC, MBTI, IE)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">•</span>
                  Patrones de aprendizaje de profesionales similares
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedPaths.map((path) => (
              <div key={path.id} className="relative">
                <Badge className="absolute -top-2 -right-2 z-10 bg-purple-600">{path.match_score}% match</Badge>
                <LearningPathCard path={path} onStart={() => console.log("Start path", path.id)} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-paths" className="space-y-6">
          {myPaths.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myPaths.map((path) => (
                <LearningPathCard
                  key={path.id}
                  path={path}
                  userProgress={path.userProgress}
                  onContinue={() => console.log("Continue path", path.id)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No has iniciado ninguna ruta</h3>
                <p className="text-muted-foreground mb-4">
                  Explora nuestras recomendaciones personalizadas para comenzar
                </p>
                <Button onClick={() => setSelectedTab("recommended")}>Ver Recomendaciones</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...recommendedPaths].map((path) => (
              <LearningPathCard key={path.id} path={path} onStart={() => console.log("Start path", path.id)} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
