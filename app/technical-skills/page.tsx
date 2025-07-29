"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Code,
  Database,
  Globe,
  Smartphone,
  Brain,
  Shield,
  BarChart3,
  Filter,
  Star,
  TrendingUp,
  BookOpen,
  Target,
  Award,
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface TechnicalSkill {
  id: string
  name: string
  category: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced" | "expert"
  estimatedTime: number // in minutes
  prerequisites?: string[]
  careerRelevance: string[]
  tools: string[]
  userLevel?: number
  isRecommended?: boolean
  icon: string
  marketDemand?: number
  averageSalary?: string
  relatedJobs?: string[]
  learningResources?: string[]
  certifications?: string[]
}

const technicalSkills: TechnicalSkill[] = [
  {
    id: "excel_advanced",
    name: "Excel Avanzado",
    category: "Análisis de Datos",
    description: "Dominio de funciones avanzadas, tablas dinámicas, macros y análisis de datos en Excel",
    difficulty: "advanced",
    estimatedTime: 45,
    prerequisites: ["excel_intermediate"],
    careerRelevance: ["Analista de Datos", "Finanzas", "Marketing", "Operaciones"],
    tools: ["Microsoft Excel", "Google Sheets"],
    userLevel: 75,
    isRecommended: true,
    icon: "chart",
    marketDemand: 85,
    averageSalary: "$500 - $1000",
    relatedJobs: ["Analista de Datos", "Finanzas"],
    learningResources: ["Curso de Excel Avanzado en Udemy", "Libro de Excel de Microsoft"],
    certifications: ["Certificado de Excel Avanzado de Microsoft"],
  },
  {
    id: "python_programming",
    name: "Programación en Python",
    category: "Desarrollo de Software",
    description: "Capacidad para escribir código Python eficiente y resolver problemas algorítmicos",
    difficulty: "intermediate",
    estimatedTime: 60,
    prerequisites: ["programming_basics"],
    careerRelevance: ["Desarrollador de Software", "Data Scientist", "Analista de Datos"],
    tools: ["Python", "IDE"],
    userLevel: 60,
    isRecommended: true,
    icon: "code",
    marketDemand: 90,
    averageSalary: "$600 - $1200",
    relatedJobs: ["Desarrollador de Software", "Data Scientist"],
    learningResources: ["Curso de Python en Coursera", "Libro de Python de Zed Shaw"],
    certifications: ["Certificado de Python de Codecademy"],
  },
  {
    id: "sql_queries",
    name: "Consultas SQL",
    category: "Base de Datos",
    description: "Escritura de consultas SQL complejas para análisis y manipulación de datos",
    difficulty: "intermediate",
    estimatedTime: 40,
    prerequisites: ["database_basics"],
    careerRelevance: ["Analista de Datos", "Desarrollador Backend", "Data Scientist"],
    tools: ["SQL", "PostgreSQL", "MySQL"],
    userLevel: 70,
    isRecommended: true,
    icon: "database",
    marketDemand: 80,
    averageSalary: "$550 - $1100",
    relatedJobs: ["Analista de Datos", "Desarrollador Backend"],
    learningResources: ["Curso de SQL en edX", "Libro de SQL de Joe Celko"],
    certifications: ["Certificado de SQL de Oracle"],
  },
  {
    id: "powerpoint_design",
    name: "Diseño de Presentaciones",
    category: "Comunicación",
    description: "Creación de presentaciones profesionales y efectivas",
    difficulty: "intermediate",
    estimatedTime: 30,
    prerequisites: [],
    careerRelevance: ["Marketing", "Consultoría", "Ventas", "Gestión"],
    tools: ["PowerPoint", "Google Slides", "Canva"],
    userLevel: 80,
    isRecommended: false,
    icon: "globe",
    marketDemand: 75,
    averageSalary: "$400 - $800",
    relatedJobs: ["Marketing", "Consultoría"],
    learningResources: ["Curso de PowerPoint en LinkedIn Learning", "Libro de PowerPoint de Nancy Duarte"],
    certifications: ["Certificado de PowerPoint de Microsoft"],
  },
  {
    id: "aws",
    name: "Amazon Web Services",
    category: "Cloud",
    description: "Plataforma de servicios en la nube más utilizada en la industria",
    difficulty: "advanced",
    estimatedTime: 60,
    prerequisites: [],
    careerRelevance: ["Cloud Engineer", "DevOps Engineer", "Solutions Architect"],
    tools: ["AWS Management Console", "AWS CLI", "Terraform"],
    userLevel: 30,
    isRecommended: true,
    icon: "globe",
    marketDemand: 95,
    averageSalary: "$700 - $1400",
    relatedJobs: ["Cloud Engineer", "DevOps Engineer"],
    learningResources: ["Curso de AWS en Udacity", "Libro de AWS de James S. Bucanek"],
    certifications: ["Certificado de AWS Certified Solutions Architect"],
  },
  {
    id: "project_management",
    name: "Gestión de Proyectos",
    category: "Gestión",
    description: "Planificación, ejecución y control de proyectos",
    difficulty: "intermediate",
    estimatedTime: 45,
    prerequisites: [],
    careerRelevance: ["Project Manager", "Scrum Master", "Product Owner"],
    tools: ["Jira", "Asana", "Trello"],
    userLevel: 45,
    isRecommended: true,
    icon: "chart",
    marketDemand: 88,
    averageSalary: "$500 - $1000",
    relatedJobs: ["Project Manager", "Scrum Master"],
    learningResources: [
      "Curso de Gestión de Proyectos en PMI",
      "Libro de Gestión de Proyectos de A Guide to the Project Management Body of Knowledge",
    ],
    certifications: ["Certificado PMP de PMI"],
  },
  {
    id: "digital_marketing",
    name: "Marketing Digital",
    category: "Marketing",
    description: "Estrategias de marketing online",
    difficulty: "intermediate",
    estimatedTime: 40,
    prerequisites: [],
    careerRelevance: ["Marketing Manager", "Social Media Manager", "SEO Specialist"],
    tools: ["Google Analytics", "Google Ads", "Facebook Ads"],
    userLevel: 50,
    isRecommended: true,
    icon: "globe",
    marketDemand: 92,
    averageSalary: "$450 - $900",
    relatedJobs: ["Marketing Manager", "Social Media Manager"],
    learningResources: ["Curso de Marketing Digital en HubSpot", "Libro de Marketing Digital de Gary Vaynerchuk"],
    certifications: ["Certificado de Google Analytics"],
  },
  {
    id: "financial_analysis",
    name: "Análisis Financiero",
    category: "Finanzas",
    description: "Análisis de estados financieros y toma de decisiones de inversión",
    difficulty: "advanced",
    estimatedTime: 60,
    prerequisites: [],
    careerRelevance: ["Financial Analyst", "Investment Banker", "Portfolio Manager"],
    tools: ["Bloomberg Terminal", "FactSet", "Excel"],
    userLevel: 65,
    isRecommended: true,
    icon: "chart",
    marketDemand: 90,
    averageSalary: "$650 - $1300",
    relatedJobs: ["Financial Analyst", "Investment Banker"],
    learningResources: ["Curso de Análisis Financiero en Coursera", "Libro de Análisis Financiero de John C. Hull"],
    certifications: ["Certificado de CFA de CFA Institute"],
  },
  {
    id: "clinical_research",
    name: "Investigación Clínica",
    category: "Salud",
    description: "Diseño y ejecución de estudios clínicos",
    difficulty: "advanced",
    estimatedTime: 90,
    prerequisites: [],
    careerRelevance: ["Clinical Research Associate", "Clinical Trial Manager", "Medical Science Liaison"],
    tools: ["SPSS", "SAS", "R"],
    userLevel: 40,
    isRecommended: true,
    icon: "chart",
    marketDemand: 85,
    averageSalary: "$700 - $1400",
    relatedJobs: ["Clinical Research Associate", "Clinical Trial Manager"],
    learningResources: [
      "Curso de Investigación Clínica en Coursera",
      "Libro de Investigación Clínica de Michael J. Pencina",
    ],
    certifications: ["Certificado de Investigador Clínico de ACRP"],
  },
  {
    id: "graphic_design",
    name: "Diseño Gráfico",
    category: "Diseño",
    description: "Creación de diseños visuales para medios impresos y digitales",
    difficulty: "intermediate",
    estimatedTime: 45,
    prerequisites: [],
    careerRelevance: ["Graphic Designer", "Web Designer", "UI/UX Designer"],
    tools: ["Adobe Photoshop", "Adobe Illustrator", "Figma"],
    userLevel: 55,
    isRecommended: true,
    icon: "chart",
    marketDemand: 80,
    averageSalary: "$450 - $900",
    relatedJobs: ["Graphic Designer", "Web Designer"],
    learningResources: ["Curso de Diseño Gráfico en Canva", "Libro de Diseño Gráfico de Robin Williams"],
    certifications: ["Certificado de Adobe Certified Expert"],
  },
]

const careerPaths = [
  {
    id: "frontend",
    name: "Frontend Developer",
    description: "Desarrollo de interfaces de usuario y experiencias web",
    requiredSkills: ["javascript", "react", "typescript"],
    recommendedSkills: ["css", "html", "webpack"],
  },
  {
    id: "backend",
    name: "Backend Developer",
    description: "Desarrollo de APIs y lógica del servidor",
    requiredSkills: ["python", "nodejs", "sql"],
    recommendedSkills: ["docker", "aws", "mongodb"],
  },
  {
    id: "fullstack",
    name: "Full Stack Developer",
    description: "Desarrollo completo de aplicaciones web",
    requiredSkills: ["javascript", "react", "nodejs", "sql"],
    recommendedSkills: ["typescript", "docker", "aws"],
  },
  {
    id: "devops",
    name: "DevOps Engineer",
    description: "Automatización y gestión de infraestructura",
    requiredSkills: ["docker", "kubernetes", "aws"],
    recommendedSkills: ["python", "linux", "terraform"],
  },
  {
    id: "project_manager",
    name: "Project Manager",
    description: "Planificación, ejecución y control de proyectos",
    requiredSkills: ["project_management", "communication"],
    recommendedSkills: ["excel_advanced", "leadership"],
  },
  {
    id: "financial_analyst",
    name: "Financial Analyst",
    description: "Análisis de estados financieros y toma de decisiones de inversión",
    requiredSkills: ["financial_analysis", "excel_advanced"],
    recommendedSkills: ["sql_queries", "data_visualization"],
  },
  {
    id: "clinical_research_associate",
    name: "Clinical Research Associate",
    description: "Diseño y ejecución de estudios clínicos",
    requiredSkills: ["clinical_research", "data_analysis"],
    recommendedSkills: ["excel_advanced", "sql_queries"],
  },
  {
    id: "graphic_designer",
    name: "Graphic Designer",
    description: "Creación de diseños visuales para medios impresos y digitales",
    requiredSkills: ["graphic_design", "communication"],
    recommendedSkills: ["photoshop", "illustrator"],
  },
]

export default function TechnicalSkillsPage() {
  const router = useRouter()
  const [skills, setSkills] = useState<TechnicalSkill[]>(technicalSkills)
  const [filteredSkills, setFilteredSkills] = useState<TechnicalSkill[]>(technicalSkills)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedCareer, setSelectedCareer] = useState("")
  const [selectedSkill, setSelectedSkill] = useState<TechnicalSkill | null>(null)
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false)

  useEffect(() => {
    filterSkills()
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedCareer])

  const filterSkills = () => {
    let filtered = skills

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (skill) =>
          skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          skill.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((skill) => skill.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    // Filter by difficulty
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((skill) => skill.difficulty === selectedDifficulty)
    }

    // Filter by career path
    if (selectedCareer) {
      const career = careerPaths.find((c) => c.id === selectedCareer)
      if (career) {
        const relevantSkillIds = [...career.requiredSkills, ...career.recommendedSkills]
        filtered = filtered.filter((skill) => relevantSkillIds.includes(skill.id))
      }
    }

    setFilteredSkills(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedDifficulty("all")
    setSelectedCareer("")
  }

  const getSkillIcon = (iconName: string) => {
    const icons = {
      code: Code,
      database: Database,
      globe: Globe,
      smartphone: Smartphone,
      brain: Brain,
      shield: Shield,
      chart: BarChart3,
    }
    const IconComponent = icons[iconName as keyof typeof icons] || Code
    return <IconComponent className="h-5 w-5" />
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-orange-100 text-orange-800",
      expert: "bg-red-100 text-red-800",
    }
    return colors[difficulty as keyof typeof colors] || colors.beginner
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Frontend: "bg-blue-100 text-blue-800",
      Backend: "bg-purple-100 text-purple-800",
      Database: "bg-green-100 text-green-800",
      Cloud: "bg-orange-100 text-orange-800",
      DevOps: "bg-red-100 text-red-800",
      Mobile: "bg-pink-100 text-pink-800",
      Gestión: "bg-teal-100 text-teal-800",
      Marketing: "bg-yellow-100 text-yellow-800",
      Finanzas: "bg-indigo-100 text-indigo-800",
      Salud: "bg-lime-100 text-lime-800",
      Diseño: "bg-fuchsia-100 text-fuchsia-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const updateSkillLevel = (skillId: string, newLevel: number) => {
    setSkills((prev) => prev.map((skill) => (skill.id === skillId ? { ...skill, userLevel: newLevel } : skill)))
    toast.success("Nivel de habilidad actualizado")
  }

  const startSkillTest = (skill: TechnicalSkill) => {
    toast.success(`Iniciando test de ${skill.name}`)
    router.push(`/technical-skills-test?testId=${skill.id}`)
  }

  const categories = Array.from(new Set(skills.map((skill) => skill.category)))
  const difficulties = ["beginner", "intermediate", "advanced", "expert"]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Habilidades Técnicas</h1>
          <p className="text-muted-foreground">
            Evalúa y desarrolla tus competencias técnicas para el mercado laboral chileno
          </p>
        </div>
        <Button>
          <Target className="h-4 w-4 mr-2" />
          Crear Plan de Estudio
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Input
                placeholder="Buscar habilidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Dificultad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las dificultades</SelectItem>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedCareer} onValueChange={setSelectedCareer}>
                <SelectTrigger>
                  <SelectValue placeholder="Carrera objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Todas las carreras</SelectItem>
                  {careerPaths.map((career) => (
                    <SelectItem key={career.id} value={career.id}>
                      {career.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="skills" className="space-y-4">
        <TabsList>
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
          <TabsTrigger value="career-paths">Rutas de Carrera</TabsTrigger>
          <TabsTrigger value="progress">Mi Progreso</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => (
              <Card
                key={skill.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  skill.isRecommended ? "ring-2 ring-primary/20" : ""
                }`}
                onClick={() => {
                  setSelectedSkill(skill)
                  setIsSkillDialogOpen(true)
                }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSkillIcon(skill.icon)}
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                      {skill.isRecommended && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                    <Badge className={getCategoryColor(skill.category)}>{skill.category}</Badge>
                  </div>
                  <CardDescription>{skill.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getDifficultyColor(skill.difficulty)}>{skill.difficulty}</Badge>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">{skill.marketDemand}% demanda</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Tu nivel</span>
                        <span className="text-sm text-muted-foreground">{skill.userLevel || 0}%</span>
                      </div>
                      <Progress value={skill.userLevel || 0} className="h-2" />
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">Salario promedio:</p>
                      <p>{skill.averageSalary}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          startSkillTest(skill)
                        }}
                        className="flex-1"
                      >
                        Tomar Test
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Open learning resources
                        }}
                        className="flex-1"
                      >
                        <BookOpen className="h-4 w-4 mr-1" />
                        Aprender
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSkills.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron habilidades con los filtros aplicados</p>
                <Button variant="outline" onClick={clearFilters} className="mt-4 bg-transparent">
                  Limpiar filtros
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="career-paths" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careerPaths.map((career) => (
              <Card key={career.id}>
                <CardHeader>
                  <CardTitle>{career.name}</CardTitle>
                  <CardDescription>{career.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Habilidades requeridas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {career.requiredSkills.map((skillId) => {
                          const skill = skills.find((s) => s.id === skillId)
                          return skill ? (
                            <Badge key={skillId} variant="default">
                              {skill.name}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Habilidades recomendadas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {career.recommendedSkills.map((skillId) => {
                          const skill = skills.find((s) => s.id === skillId)
                          return skill ? (
                            <Badge key={skillId} variant="outline">
                              {skill.name}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>

                    <Button
                      onClick={() => setSelectedCareer(career.id)}
                      className="w-full"
                      variant={selectedCareer === career.id ? "default" : "outline"}
                    >
                      {selectedCareer === career.id ? "Ruta seleccionada" : "Seleccionar ruta"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Resumen General
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {skills.filter((s) => (s.userLevel || 0) > 70).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Habilidades dominadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {skills.filter((s) => (s.userLevel || 0) > 30 && (s.userLevel || 0) <= 70).length}
                    </div>
                    <div className="text-sm text-muted-foreground">En desarrollo</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {skills.filter((s) => (s.userLevel || 0) <= 30).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Por desarrollar</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progreso por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((category) => {
                    const categorySkills = skills.filter((s) => s.category === category)
                    const avgProgress =
                      categorySkills.reduce((sum, s) => sum + (s.userLevel || 0), 0) / categorySkills.length
                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{category}</span>
                          <span>{Math.round(avgProgress)}%</span>
                        </div>
                        <Progress value={avgProgress} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Habilidades Recomendadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {skills
                    .filter((s) => s.isRecommended && (s.userLevel || 0) < 70)
                    .slice(0, 5)
                    .map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{skill.name}</p>
                          <p className="text-sm text-muted-foreground">{skill.category}</p>
                        </div>
                        <Button size="sm" onClick={() => startSkillTest(skill)}>
                          Test
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Todas las Habilidades - Progreso Detallado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getSkillIcon(skill.icon)}
                      <div>
                        <h4 className="font-medium">{skill.name}</h4>
                        <p className="text-sm text-muted-foreground">{skill.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <Progress value={skill.userLevel || 0} className="h-2" />
                      </div>
                      <span className="text-sm font-medium w-12">{skill.userLevel || 0}%</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newLevel = Math.min((skill.userLevel || 0) + 10, 100)
                          updateSkillLevel(skill.id, newLevel)
                        }}
                      >
                        +10%
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Skill Details Dialog */}
      <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedSkill && getSkillIcon(selectedSkill.icon)}
              {selectedSkill?.name}
              {selectedSkill?.isRecommended && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
            </DialogTitle>
            <DialogDescription>{selectedSkill?.description}</DialogDescription>
          </DialogHeader>
          {selectedSkill && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <Badge className={getCategoryColor(selectedSkill.category)}>{selectedSkill.category}</Badge>
                <Badge className={getDifficultyColor(selectedSkill.difficulty)}>{selectedSkill.difficulty}</Badge>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">{selectedSkill.marketDemand}% demanda</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Tu nivel actual</h4>
                <div className="flex items-center gap-4">
                  <Progress value={selectedSkill.userLevel || 0} className="flex-1 h-3" />
                  <span className="font-medium">{selectedSkill.userLevel || 0}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Información del mercado</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Salario promedio:</span> {selectedSkill.averageSalary}
                    </p>
                    <p>
                      <span className="font-medium">Demanda del mercado:</span> {selectedSkill.marketDemand}%
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Trabajos relacionados</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkill.relatedJobs?.map((job) => (
                      <Badge key={job} variant="outline">
                        {job}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Recursos de aprendizaje</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {selectedSkill.learningResources?.map((resource) => (
                    <li key={resource}>{resource}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Certificaciones disponibles</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {selectedSkill.certifications?.map((cert) => (
                    <li key={cert}>{cert}</li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    startSkillTest(selectedSkill)
                    setIsSkillDialogOpen(false)
                  }}
                  className="flex-1"
                >
                  Tomar Test de Evaluación
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Ver Recursos
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
