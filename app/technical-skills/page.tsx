"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Code,
  FileSpreadsheet,
  Database,
  Presentation,
  BarChart3,
  Clock,
  Target,
  TrendingUp,
  Award,
  Search,
  Filter,
  CheckCircle,
  Lock,
} from "lucide-react"
import { TECHNICAL_SKILLS, TECHNICAL_TESTS, CAREER_SKILL_MAPS } from "@/lib/technical-skills-types"

export default function TechnicalSkillsPage() {
  const router = useRouter()
  const [selectedCareer, setSelectedCareer] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [userValidations, setUserValidations] = useState<any[]>([])

  const getTestIcon = (type: string) => {
    switch (type) {
      case "code":
        return <Code className="w-5 h-5" />
      case "excel":
        return <FileSpreadsheet className="w-5 h-5" />
      case "sql":
        return <Database className="w-5 h-5" />
      case "presentation":
        return <Presentation className="w-5 h-5" />
      case "data_analysis":
        return <BarChart3 className="w-5 h-5" />
      default:
        return <Target className="w-5 h-5" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "advanced":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "expert":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSkillValidation = (skillId: string) => {
    return userValidations.find((v) => v.skillId === skillId)
  }

  const filteredSkills = TECHNICAL_SKILLS.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = !difficultyFilter || skill.difficulty === difficultyFilter
    const matchesCategory = !categoryFilter || skill.category === categoryFilter
    const matchesCareer = selectedCareer === "all" || skill.careerRelevance.includes(selectedCareer)

    return matchesSearch && matchesDifficulty && matchesCategory && matchesCareer
  })

  const filteredTests = TECHNICAL_TESTS.filter((test) => {
    const skill = TECHNICAL_SKILLS.find((s) => s.id === test.skillId)
    if (!skill) return false

    const matchesSearch =
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = !difficultyFilter || test.difficulty === difficultyFilter
    const matchesCategory = !categoryFilter || skill.category === categoryFilter
    const matchesCareer = selectedCareer === "all" || skill.careerRelevance.includes(selectedCareer)

    return matchesSearch && matchesDifficulty && matchesCategory && matchesCareer
  })

  const careerSkillMap =
    selectedCareer !== "all" ? CAREER_SKILL_MAPS.find((map) => map.career === selectedCareer) : null

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Habilidades Técnicas</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Valida tus habilidades técnicas con pruebas prácticas e interactivas. Demuestra tu competencia real y obtén
          certificaciones reconocidas.
        </p>
      </div>

      {/* Career Selection */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Personaliza por Carrera
          </CardTitle>
          <CardDescription>Selecciona tu carrera objetivo para ver las habilidades más relevantes</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedCareer} onValueChange={setSelectedCareer}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Selecciona tu carrera objetivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las carreras</SelectItem>
              {CAREER_SKILL_MAPS.map((map) => (
                <SelectItem key={map.career} value={map.career}>
                  {map.career}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {careerSkillMap && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <h3 className="font-semibold mb-2">Habilidades recomendadas para {selectedCareer}:</h3>
              <div className="flex flex-wrap gap-2">
                {careerSkillMap.requiredSkills.map((req) => {
                  const skill = TECHNICAL_SKILLS.find((s) => s.id === req.skillId)
                  if (!skill) return null

                  const validation = getSkillValidation(req.skillId)

                  return (
                    <Badge
                      key={req.skillId}
                      variant="outline"
                      className={`${
                        req.importance === "critical"
                          ? "border-red-300 text-red-700"
                          : req.importance === "important"
                            ? "border-orange-300 text-orange-700"
                            : "border-blue-300 text-blue-700"
                      } ${validation ? "bg-green-50" : ""}`}
                    >
                      {validation && <CheckCircle className="w-3 h-3 mr-1" />}
                      {skill.name}
                      {req.importance === "critical" && " (Crítica)"}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar habilidades o tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Dificultad</label>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="beginner">Principiante</SelectItem>
                  <SelectItem value="intermediate">Intermedio</SelectItem>
                  <SelectItem value="advanced">Avanzado</SelectItem>
                  <SelectItem value="expert">Experto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Categoría</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="Desarrollo de Software">Desarrollo de Software</SelectItem>
                  <SelectItem value="Análisis de Datos">Análisis de Datos</SelectItem>
                  <SelectItem value="Base de Datos">Base de Datos</SelectItem>
                  <SelectItem value="Comunicación">Comunicación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setDifficultyFilter("")
                  setCategoryFilter("")
                  setSelectedCareer("all")
                }}
                className="w-full"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
          <TabsTrigger value="tests">Tests Disponibles</TabsTrigger>
        </TabsList>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => {
              const validation = getSkillValidation(skill.id)
              const availableTests = TECHNICAL_TESTS.filter((test) => test.skillId === skill.id)

              return (
                <Card key={skill.id} className="relative">
                  {validation && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <Award className="w-3 h-3 mr-1" />
                        Validado
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getTestIcon(availableTests[0]?.type || "code")}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{skill.name}</CardTitle>
                        <CardDescription className="text-sm">{skill.category}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{skill.description}</p>

                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(skill.difficulty)}>{skill.difficulty}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {skill.estimatedTime} min
                      </div>
                    </div>

                    {validation && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-800">Nivel Validado: {validation.level}</span>
                          <span className="text-sm text-green-700">{validation.score}/100</span>
                        </div>
                        <Progress value={validation.score} className="h-2" />
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Relevante para:</h4>
                      <div className="flex flex-wrap gap-1">
                        {skill.careerRelevance.slice(0, 3).map((career) => (
                          <Badge key={career} variant="outline" className="text-xs">
                            {career}
                          </Badge>
                        ))}
                        {skill.careerRelevance.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{skill.careerRelevance.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          const firstTest = availableTests[0]
                          if (firstTest) {
                            router.push(`/technical-skills-test?testId=${firstTest.id}`)
                          }
                        }}
                        disabled={availableTests.length === 0}
                      >
                        {availableTests.length === 0 ? (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Próximamente
                          </>
                        ) : (
                          <>
                            <Target className="w-4 h-4 mr-2" />
                            Tomar Test
                          </>
                        )}
                      </Button>
                      {availableTests.length > 1 && (
                        <Button variant="outline" size="sm">
                          Ver Todos ({availableTests.length})
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredSkills.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron habilidades</h3>
              <p className="text-muted-foreground">Intenta ajustar tus filtros para ver más resultados</p>
            </div>
          )}
        </TabsContent>

        {/* Tests Tab */}
        <TabsContent value="tests" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTests.map((test) => {
              const skill = TECHNICAL_SKILLS.find((s) => s.id === test.skillId)
              if (!skill) return null

              const validation = getSkillValidation(test.skillId)

              return (
                <Card key={test.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getTestIcon(test.type)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{test.title}</CardTitle>
                        <CardDescription>
                          {skill.name} • {skill.category}
                        </CardDescription>
                      </div>
                      {validation && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completado
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{test.description}</p>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-muted rounded-lg">
                        <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
                        <div className="text-sm font-medium">{test.timeLimit} min</div>
                        <div className="text-xs text-muted-foreground">Tiempo</div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <Target className="w-4 h-4 mx-auto mb-1 text-primary" />
                        <div className="text-sm font-medium">{test.maxScore} pts</div>
                        <div className="text-xs text-muted-foreground">Máximo</div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <TrendingUp className="w-4 h-4 mx-auto mb-1 text-primary" />
                        <div className="text-sm font-medium capitalize">{test.difficulty}</div>
                        <div className="text-xs text-muted-foreground">Nivel</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Criterios de evaluación:</h4>
                      <div className="space-y-1">
                        {test.evaluationCriteria.slice(0, 3).map((criterion, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{criterion.criterion}</span>
                            <span className="font-medium">{criterion.weight}%</span>
                          </div>
                        ))}
                        {test.evaluationCriteria.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{test.evaluationCriteria.length - 3} criterios más
                          </div>
                        )}
                      </div>
                    </div>

                    <Button className="w-full" onClick={() => router.push(`/technical-skills-test?testId=${test.id}`)}>
                      {validation ? "Repetir Test" : "Comenzar Test"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredTests.length === 0 && (
            <div className="text-center py-12">
              <Code className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron tests</h3>
              <p className="text-muted-foreground">Intenta ajustar tus filtros para ver más resultados</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
