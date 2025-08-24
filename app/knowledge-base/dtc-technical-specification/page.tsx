"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  Target,
  Users,
  Brain,
  Rocket,
  Settings,
  ChevronRight,
  FileText,
  Lightbulb,
  TrendingUp,
  Shield,
  Zap,
  Building2,
} from "lucide-react"

export default function DTCTechnicalSpecificationPage() {
  const [selectedCareer, setSelectedCareer] = useState("arquitectura")

  const careers = [
    {
      id: "arquitectura",
      name: "Arquitectura y Urbanismo",
      specialties: [
        "Diseño arquitectónico",
        "Urbanismo",
        "Arquitectura de interiores",
        "Patrimonio",
        "Urbanismo sostenible",
        "Paisajismo",
      ],
      sectors: [
        "Estudios de arquitectura",
        "Empresas constructoras",
        "Consultoras de planificación urbana",
        "Instituciones públicas",
        "Docencia universitaria",
      ],
      dtcPersonalization: [
        "Construcción de portafolio profesional visual",
        "CV con secciones para proyectos y competencias creativas",
        "Simulador con preguntas específicas de arquitectura",
        "Pruebas técnicas de interpretación de planos",
        "Recomendaciones de cursos BIM y construcción sostenible",
      ],
    },
    {
      id: "derecho",
      name: "Derecho",
      specialties: [
        "Derecho civil",
        "Derecho penal",
        "Derecho comercial",
        "Derecho laboral",
        "Derecho tributario",
        "Derecho internacional",
      ],
      sectors: [
        "Estudios jurídicos",
        "Empresas (asesoría legal)",
        "Sector público",
        "Poder judicial",
        "Fiscalía",
        "Defensoría",
      ],
      dtcPersonalization: [
        "CV enfocado en experiencia legal y casos relevantes",
        "Simulador con casos jurídicos y argumentación",
        "Pruebas de razonamiento legal y ética",
        "Recursos sobre nuevas leyes y jurisprudencia",
        "Networking con profesionales del derecho",
      ],
    },
    {
      id: "diseno",
      name: "Diseño",
      specialties: [
        "Diseño gráfico",
        "Diseño industrial",
        "Diseño UX/UI",
        "Diseño de productos",
        "Branding",
        "Diseño digital",
      ],
      sectors: [
        "Agencias de publicidad",
        "Estudios de diseño",
        "Empresas tecnológicas",
        "Consultoras de branding",
        "Freelance",
        "Startups",
      ],
      dtcPersonalization: [
        "Portafolio digital interactivo",
        "CV visual con proyectos destacados",
        "Simulador con desafíos creativos",
        "Pruebas de creatividad y tendencias",
        "Cursos de herramientas de diseño actuales",
      ],
    },
    {
      id: "ingenieria-comercial",
      name: "Ingeniería Comercial",
      specialties: ["Finanzas", "Marketing", "Operaciones", "Recursos humanos", "Estrategia", "Emprendimiento"],
      sectors: ["Bancos", "Consultoras", "Empresas multinacionales", "Startups", "Retail", "Servicios financieros"],
      dtcPersonalization: [
        "CV con métricas de negocio y logros cuantificables",
        "Simulador con casos de negocio reales",
        "Pruebas de análisis financiero y estratégico",
        "Recursos de tendencias de mercado",
        "Networking empresarial",
      ],
    },
    {
      id: "informatica",
      name: "Ingeniería Civil Informática",
      specialties: [
        "Desarrollo de software",
        "Inteligencia artificial",
        "Ciberseguridad",
        "Bases de datos",
        "Redes",
        "DevOps",
      ],
      sectors: [
        "Empresas tecnológicas",
        "Bancos",
        "Consultoras IT",
        "Startups",
        "Gobierno digital",
        "Telecomunicaciones",
      ],
      dtcPersonalization: [
        "CV técnico con proyectos de código",
        "Simulador con desafíos de programación",
        "Pruebas técnicas de algoritmos",
        "Recursos de tecnologías emergentes",
        "Portafolio de proyectos en GitHub",
      ],
    },
    {
      id: "medicina",
      name: "Medicina",
      specialties: [
        "Medicina general",
        "Especialidades médicas",
        "Medicina familiar",
        "Medicina de urgencia",
        "Investigación médica",
      ],
      sectors: ["Hospitales", "Clínicas", "Centros de salud", "Investigación", "Docencia médica", "Salud pública"],
      dtcPersonalization: [
        "CV médico con experiencia clínica",
        "Simulador con casos clínicos",
        "Pruebas de conocimiento médico",
        "Recursos de medicina basada en evidencia",
        "Networking médico profesional",
      ],
    },
    {
      id: "psicologia",
      name: "Psicología",
      specialties: [
        "Psicología clínica",
        "Psicología organizacional",
        "Psicología educacional",
        "Neuropsicología",
        "Psicología social",
      ],
      sectors: [
        "Clínicas",
        "Hospitales",
        "Empresas (RRHH)",
        "Centros educacionales",
        "Investigación",
        "Práctica privada",
      ],
      dtcPersonalization: [
        "CV con enfoque en competencias terapéuticas",
        "Simulador con casos psicológicos",
        "Pruebas de evaluación psicológica",
        "Recursos de terapias actuales",
        "Ética profesional y casos complejos",
      ],
    },
  ]

  const systemModules = [
    {
      name: "Tests Psicométricos",
      icon: Brain,
      description: "Evaluaciones de personalidad, habilidades y competencias",
      features: ["Test DISC", "Big Five", "Inteligencias múltiples", "Habilidades blandas", "Evaluación técnica"],
    },
    {
      name: "Generador de CV",
      icon: FileText,
      description: "Creación automática de CV optimizados por IA",
      features: ["Templates por carrera", "Optimización ATS", "Análisis de palabras clave", "Múltiples formatos"],
    },
    {
      name: "Simulador de Entrevistas",
      icon: Users,
      description: "Práctica de entrevistas con IA y feedback personalizado",
      features: [
        "Preguntas por industria",
        "Análisis de respuestas",
        "Feedback en tiempo real",
        "Grabación y revisión",
      ],
    },
    {
      name: "Coach IA",
      icon: Lightbulb,
      description: "Asistente inteligente para orientación profesional",
      features: ["Consejos personalizados", "Planificación de carrera", "Resolución de dudas", "Motivación continua"],
    },
    {
      name: "Biblioteca de Habilidades",
      icon: BookOpen,
      description: "Recursos de aprendizaje y desarrollo profesional",
      features: ["Cursos recomendados", "Artículos especializados", "Videos educativos", "Certificaciones"],
    },
    {
      name: "Panel de Progreso",
      icon: TrendingUp,
      description: "Seguimiento del desarrollo profesional",
      features: ["Métricas de progreso", "Objetivos personalizados", "Logros desbloqueados", "Análisis de tendencias"],
    },
  ]

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Rocket className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">DespegaTuCarrera 1.5</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Especificación técnica completa de la plataforma integral de orientación y desarrollo profesional potenciada
          por Inteligencia Artificial
        </p>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="secondary" className="px-4 py-2">
            <Target className="h-4 w-4 mr-2" />7 Carreras Objetivo
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <Brain className="h-4 w-4 mr-2" />
            IA Generativa
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <Shield className="h-4 w-4 mr-2" />
            Evaluaciones Psicométricas
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visión General</TabsTrigger>
          <TabsTrigger value="careers">Carreras Objetivo</TabsTrigger>
          <TabsTrigger value="modules">Módulos del Sistema</TabsTrigger>
          <TabsTrigger value="architecture">Arquitectura Técnica</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objetivos del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                DTC 1.5 busca crear una experiencia personalizada que evoluciona con el usuario desde el primer día,
                combinando IA generativa, evaluaciones psicométricas y coaching personalizado para ayudar a estudiantes
                y jóvenes profesionales a despegar sus carreras de forma efectiva.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Características Clave
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                      Personalización basada en datos psicométricos
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                      Coach IA con nivel de detalle similar a mentor humano
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                      Integraciones con servicios externos (Coursera, LinkedIn)
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                      Ecosistema completo de desarrollo profesional
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Beneficios Esperados
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                      Autoconocimiento profundo mediante tests validados
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                      Mejora continua de habilidades técnicas y blandas
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                      Acompañamiento constante y motivacional
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                      Conexiones directas con oportunidades reales
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visión Estratégica</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                La visión estratégica de DTC 1.5 es crear una plataforma que anticipe y responda a las necesidades
                individuales de orientación profesional de cada usuario. Gracias a la IA generativa, la plataforma podrá
                brindar asesoría con un nivel de detalle y personalización similar al de un mentor humano experimentado.
              </p>
              <p className="text-muted-foreground">
                Al mismo tiempo, la integración de datos psicométricos garantizará que las recomendaciones se basen en
                un entendimiento profundo de la personalidad, intereses y fortalezas de cada persona. Esto es
                especialmente relevante en un contexto donde el desarrollo de carrera se ha vuelto continuo y crítico.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="careers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Carreras Objetivo - Universidad del Desarrollo</CardTitle>
              <p className="text-muted-foreground">
                DTC 1.5 brindará soporte inicial para 7 carreras profesionales clave, adaptando la experiencia a las
                particularidades de cada una.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold mb-3">Selecciona una carrera:</h4>
                  {careers.map((career) => (
                    <Button
                      key={career.id}
                      variant={selectedCareer === career.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCareer(career.id)}
                    >
                      {career.name}
                    </Button>
                  ))}
                </div>

                <div className="lg:col-span-2">
                  {careers
                    .filter((career) => career.id === selectedCareer)
                    .map((career) => (
                      <div key={career.id} className="space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{career.name}</h3>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              Especialidades
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {career.specialties.map((specialty, index) => (
                                <Badge key={index} variant="secondary">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              Sectores de Empleo
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {career.sectors.map((sector, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <ChevronRight className="h-3 w-3" />
                                  {sector}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Settings className="h-4 w-4" />
                              Personalización DTC
                            </h4>
                            <div className="space-y-2">
                              {career.dtcPersonalization.map((feature, index) => (
                                <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <ChevronRight className="h-3 w-3 mt-0.5 text-primary" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {systemModules.map((module, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <module.icon className="h-5 w-5 text-primary" />
                    {module.name}
                  </CardTitle>
                  <p className="text-muted-foreground">{module.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Características:</h4>
                    <ul className="space-y-1">
                      {module.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ChevronRight className="h-3 w-3 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Arquitectura del Sistema</CardTitle>
              <p className="text-muted-foreground">
                DTC 1.5 implementará una arquitectura moderna basada en microservicios con integración de IA
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Frontend</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Next.js 14 con App Router
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      TypeScript para type safety
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Tailwind CSS para styling
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Shadcn/ui para componentes
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Backend</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      API Routes de Next.js
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Supabase para base de datos
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Autenticación con Supabase Auth
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Row Level Security (RLS)
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">IA y Machine Learning</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      OpenAI GPT-4 para coach IA
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Vercel AI SDK para integraciones
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Análisis de sentimientos
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Recomendaciones personalizadas
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Integraciones</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      APIs de empleo (LinkedIn, Indeed)
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Coursera para cursos
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Sistemas de video llamadas
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      Servicios de notificaciones
                    </li>
                  </ul>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Flujo de Datos</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Usuario completa tests psicométricos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>IA analiza resultados y crea perfil personalizado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Sistema genera recomendaciones específicas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Coach IA proporciona guidance personalizado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Integración con servicios externos para oportunidades</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
