"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  GraduationCap,
  TrendingUp,
  DollarSign,
  MapPin,
  Clock,
  Award,
  Building2,
  Target,
  ChevronRight,
  Star,
  Briefcase,
} from "lucide-react"

export default function CareersGuidePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCareer, setSelectedCareer] = useState("arquitectura")

  const careers = [
    {
      id: "arquitectura",
      name: "Arquitectura y Urbanismo",
      description: "Diseño y planificación de espacios habitables, desde edificios hasta ciudades completas",
      averageSalary: "1,800,000 - 3,500,000",
      growthRate: "+8.5%",
      jobOpenings: "2,400+",
      education: "5-6 años",
      skills: ["AutoCAD", "Revit", "SketchUp", "Creatividad", "Gestión de proyectos", "Normativas de construcción"],
      certifications: ["Certificación BIM", "LEED Green Associate", "Especialización en Patrimonio"],
      employers: ["Mathias Klotz", "Smiljan Radic", "Pezo von Ellrichshausen", "Constructoras", "Municipalidades"],
      careerPath: [
        "Arquitecto Junior (0-2 años)",
        "Arquitecto de Proyectos (3-5 años)",
        "Arquitecto Senior (6-10 años)",
        "Jefe de Proyectos (10+ años)",
        "Socio/Director (15+ años)",
      ],
      typicalDay: [
        "Revisión de planos y especificaciones técnicas",
        "Reuniones con clientes y equipos de trabajo",
        "Desarrollo de propuestas de diseño",
        "Coordinación con ingenieros y constructores",
        "Visitas a obra y supervisión",
        "Actualización de proyectos en software especializado",
      ],
      marketData: {
        demand: "Alta",
        competition: "Media-Alta",
        remoteWork: "Parcial",
        regions: ["Santiago", "Valparaíso", "Concepción", "La Serena"],
      },
    },
    {
      id: "derecho",
      name: "Derecho",
      description: "Aplicación y interpretación de leyes para resolver conflictos y asesorar en temas legales",
      averageSalary: "1,500,000 - 4,000,000",
      growthRate: "+6.2%",
      jobOpenings: "3,200+",
      education: "5-6 años + práctica",
      skills: [
        "Argumentación",
        "Investigación jurídica",
        "Redacción legal",
        "Oratoria",
        "Análisis crítico",
        "Ética profesional",
      ],
      certifications: ["Especialización en áreas específicas", "Diplomados", "Magíster en Derecho"],
      employers: [
        "Carey",
        "Claro & Cía",
        "Philippi Prietocarrizosa Ferrero DU & Uría",
        "Sector público",
        "In-house counsel",
      ],
      careerPath: [
        "Abogado Junior (0-2 años)",
        "Asociado (3-5 años)",
        "Senior Associate (6-8 años)",
        "Counsel (9-12 años)",
        "Socio (12+ años)",
      ],
      typicalDay: [
        "Investigación jurisprudencial y doctrinaria",
        "Redacción de contratos y documentos legales",
        "Reuniones con clientes",
        "Audiencias y comparendos",
        "Análisis de casos y estrategias legales",
        "Coordinación con otros profesionales",
      ],
      marketData: {
        demand: "Media-Alta",
        competition: "Alta",
        remoteWork: "Parcial",
        regions: ["Santiago", "Valparaíso", "Concepción", "Antofagasta"],
      },
    },
    {
      id: "diseno",
      name: "Diseño",
      description: "Creación de soluciones visuales y funcionales para comunicar, informar y resolver problemas",
      averageSalary: "1,200,000 - 2,800,000",
      growthRate: "+12.3%",
      jobOpenings: "1,800+",
      education: "4-5 años",
      skills: ["Adobe Creative Suite", "Figma", "UX/UI", "Creatividad", "Comunicación visual", "Tendencias de diseño"],
      certifications: ["Certificación Adobe", "Google UX Design", "Especialización en Branding"],
      employers: [
        "Agencias de publicidad",
        "Estudios de diseño",
        "Empresas tech",
        "Freelance",
        "Consultoras de branding",
      ],
      careerPath: [
        "Diseñador Junior (0-2 años)",
        "Diseñador (3-5 años)",
        "Diseñador Senior (6-8 años)",
        "Director Creativo (9+ años)",
        "Fundador de estudio (10+ años)",
      ],
      typicalDay: [
        "Desarrollo de conceptos creativos",
        "Creación de piezas gráficas y digitales",
        "Reuniones de briefing con clientes",
        "Presentación de propuestas",
        "Coordinación con equipos multidisciplinarios",
        "Investigación de tendencias y referencias",
      ],
      marketData: {
        demand: "Alta",
        competition: "Media",
        remoteWork: "Alta",
        regions: ["Santiago", "Valparaíso", "Concepción", "Viña del Mar"],
      },
    },
    {
      id: "ingenieria-comercial",
      name: "Ingeniería Comercial",
      description: "Gestión estratégica de negocios combinando análisis técnico con visión comercial",
      averageSalary: "2,000,000 - 5,000,000",
      growthRate: "+9.8%",
      jobOpenings: "4,500+",
      education: "5-6 años",
      skills: ["Análisis financiero", "Excel avanzado", "Liderazgo", "Estrategia", "Marketing", "Gestión de proyectos"],
      certifications: ["MBA", "PMP", "CFA", "Certificaciones en Analytics"],
      employers: ["Bancos", "Consultoras", "Retail", "Mineras", "Startups", "Multinacionales"],
      careerPath: [
        "Analista (0-2 años)",
        "Especialista (3-5 años)",
        "Jefe/Supervisor (6-8 años)",
        "Gerente (9-12 años)",
        "Director/VP (12+ años)",
      ],
      typicalDay: [
        "Análisis de datos y métricas de negocio",
        "Reuniones estratégicas con equipos",
        "Desarrollo de planes de negocio",
        "Presentaciones a directorio",
        "Coordinación de proyectos",
        "Análisis de mercado y competencia",
      ],
      marketData: {
        demand: "Muy Alta",
        competition: "Alta",
        remoteWork: "Media",
        regions: ["Santiago", "Antofagasta", "Valparaíso", "Concepción"],
      },
    },
    {
      id: "informatica",
      name: "Ingeniería Civil Informática",
      description: "Desarrollo de sistemas y soluciones tecnológicas para resolver problemas complejos",
      averageSalary: "2,200,000 - 4,500,000",
      growthRate: "+15.7%",
      jobOpenings: "5,200+",
      education: "5-6 años",
      skills: ["Programación", "Bases de datos", "Cloud computing", "DevOps", "Ciberseguridad", "Machine Learning"],
      certifications: ["AWS", "Azure", "Google Cloud", "Certificaciones de seguridad", "Scrum Master"],
      employers: ["Bancos", "Fintechs", "Consultoras tech", "Startups", "Gobierno digital", "Multinacionales"],
      careerPath: [
        "Desarrollador Junior (0-2 años)",
        "Desarrollador (3-5 años)",
        "Senior Developer (6-8 años)",
        "Tech Lead/Architect (9+ años)",
        "CTO/Director Técnico (12+ años)",
      ],
      typicalDay: [
        "Desarrollo y programación de software",
        "Revisión de código y testing",
        "Reuniones de planificación ágil",
        "Resolución de problemas técnicos",
        "Documentación técnica",
        "Investigación de nuevas tecnologías",
      ],
      marketData: {
        demand: "Muy Alta",
        competition: "Media",
        remoteWork: "Muy Alta",
        regions: ["Santiago", "Valparaíso", "Concepción", "Remoto"],
      },
    },
    {
      id: "medicina",
      name: "Medicina",
      description: "Diagnóstico, tratamiento y prevención de enfermedades para mejorar la salud humana",
      averageSalary: "2,500,000 - 6,000,000",
      growthRate: "+7.4%",
      jobOpenings: "3,800+",
      education: "7 años + especialización",
      skills: [
        "Diagnóstico clínico",
        "Comunicación empática",
        "Toma de decisiones",
        "Trabajo bajo presión",
        "Actualización continua",
      ],
      certifications: ["Especialidades médicas", "Certificaciones internacionales", "Diplomados"],
      employers: ["Hospitales públicos", "Clínicas privadas", "Centros de salud", "Investigación", "Docencia"],
      careerPath: [
        "Interno (7mo año)",
        "Médico General (1-3 años)",
        "Residente (4-7 años)",
        "Especialista (8+ años)",
        "Jefe de Servicio (15+ años)",
      ],
      typicalDay: [
        "Atención de pacientes y consultas",
        "Revisión de exámenes y diagnósticos",
        "Procedimientos médicos",
        "Reuniones clínicas",
        "Actualización de historias clínicas",
        "Educación continua y capacitación",
      ],
      marketData: {
        demand: "Muy Alta",
        competition: "Media",
        remoteWork: "Baja",
        regions: ["Santiago", "Valparaíso", "Concepción", "Regiones"],
      },
    },
    {
      id: "psicologia",
      name: "Psicología",
      description: "Estudio del comportamiento humano y procesos mentales para promover el bienestar",
      averageSalary: "1,400,000 - 3,200,000",
      growthRate: "+10.1%",
      jobOpenings: "2,600+",
      education: "5 años + especialización",
      skills: [
        "Evaluación psicológica",
        "Terapia",
        "Escucha activa",
        "Empatía",
        "Análisis conductual",
        "Ética profesional",
      ],
      certifications: ["Especialización clínica", "Terapias específicas", "Evaluación psicológica"],
      employers: ["Clínicas", "Hospitales", "Empresas (RRHH)", "Centros educacionales", "Práctica privada"],
      careerPath: [
        "Psicólogo Junior (0-2 años)",
        "Psicólogo Clínico (3-5 años)",
        "Psicólogo Senior (6-10 años)",
        "Supervisor/Coordinador (10+ años)",
        "Director/Consultor (15+ años)",
      ],
      typicalDay: [
        "Sesiones terapéuticas con pacientes",
        "Evaluaciones psicológicas",
        "Elaboración de informes",
        "Reuniones de equipo multidisciplinario",
        "Planificación de tratamientos",
        "Capacitación y actualización profesional",
      ],
      marketData: {
        demand: "Alta",
        competition: "Media-Alta",
        remoteWork: "Media",
        regions: ["Santiago", "Valparaíso", "Concepción", "Viña del Mar"],
      },
    },
  ]

  const filteredCareers = careers.filter(
    (career) =>
      career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const selectedCareerData = careers.find((career) => career.id === selectedCareer)

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Guía Completa de Carreras</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Información detallada sobre las 7 carreras objetivo de DTC, incluyendo datos del mercado laboral chileno,
          habilidades requeridas y rutas de desarrollo profesional
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar carreras, habilidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Career List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Carreras ({filteredCareers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {filteredCareers.map((career) => (
                  <Button
                    key={career.id}
                    variant={selectedCareer === career.id ? "default" : "ghost"}
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => setSelectedCareer(career.id)}
                  >
                    <div>
                      <div className="font-medium">{career.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{career.jobOpenings} empleos disponibles</div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Career Details */}
        <div className="lg:col-span-3">
          {selectedCareerData && (
            <div className="space-y-6">
              {/* Career Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{selectedCareerData.name}</CardTitle>
                      <p className="text-muted-foreground mt-2">{selectedCareerData.description}</p>
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {selectedCareerData.growthRate}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                      <div className="text-sm font-medium">Salario Promedio</div>
                      <div className="text-xs text-muted-foreground">{selectedCareerData.averageSalary}</div>
                    </div>
                    <div className="text-center">
                      <Briefcase className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <div className="text-sm font-medium">Empleos Disponibles</div>
                      <div className="text-xs text-muted-foreground">{selectedCareerData.jobOpenings}</div>
                    </div>
                    <div className="text-center">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                      <div className="text-sm font-medium">Duración Estudios</div>
                      <div className="text-xs text-muted-foreground">{selectedCareerData.education}</div>
                    </div>
                    <div className="text-center">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                      <div className="text-sm font-medium">Crecimiento</div>
                      <div className="text-xs text-muted-foreground">{selectedCareerData.growthRate}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="skills" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="skills">Habilidades</TabsTrigger>
                  <TabsTrigger value="employers">Empleadores</TabsTrigger>
                  <TabsTrigger value="career-path">Carrera</TabsTrigger>
                  <TabsTrigger value="typical-day">Día Típico</TabsTrigger>
                  <TabsTrigger value="market">Mercado</TabsTrigger>
                </TabsList>

                <TabsContent value="skills" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Habilidades Requeridas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedCareerData.skills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          Certificaciones
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedCareerData.certifications.map((cert, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <ChevronRight className="h-3 w-3 text-primary" />
                              {cert}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="employers" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Principales Empleadores
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedCareerData.employers.map((employer, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">{employer}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="career-path" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Progresión de Carrera
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedCareerData.careerPath.map((stage, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{stage}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="typical-day" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Un Día Típico
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedCareerData.typicalDay.map((activity, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <span className="text-sm text-muted-foreground">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="market" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Datos del Mercado
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Demanda</span>
                          <Badge
                            variant={
                              selectedCareerData.marketData.demand === "Muy Alta"
                                ? "default"
                                : selectedCareerData.marketData.demand === "Alta"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {selectedCareerData.marketData.demand}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Competencia</span>
                          <Badge variant="outline">{selectedCareerData.marketData.competition}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Trabajo Remoto</span>
                          <Badge variant="outline">{selectedCareerData.marketData.remoteWork}</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Principales Regiones
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedCareerData.marketData.regions.map((region, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{region}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
