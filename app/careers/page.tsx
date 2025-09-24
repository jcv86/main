"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MapPin,
  DollarSign,
  Clock,
  Users,
  Heart,
  Coffee,
  Laptop,
  GraduationCap,
  ChevronRight,
  Filter,
  Mail,
  Phone,
  Building,
  CheckCircle,
  Search,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

const CareersPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [applicationData, setApplicationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    positionId: "",
    positionTitle: "",
    department: "",
    experienceLevel: "",
    motivation: "",
    currentCompany: "",
    currentPosition: "",
    linkedinProfile: "",
    portfolioUrl: "",
    salaryExpectation: "",
    availabilityDate: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [applicationId, setApplicationId] = useState("")
  const [error, setError] = useState("")

  const departments = [
    { id: "all", name: "Todos los Departamentos", count: 6 },
    { id: "technology", name: "Tecnología", count: 2 },
    { id: "design", name: "Diseño", count: 1 },
    { id: "ai", name: "Inteligencia Artificial", count: 1 },
    { id: "product", name: "Producto", count: 1 },
    { id: "customer", name: "Customer Success", count: 1 },
    { id: "marketing", name: "Marketing", count: 1 },
  ]

  const jobs = [
    {
      id: "senior-fullstack",
      title: "Senior Full Stack Developer",
      department: "technology",
      location: "Santiago, Chile",
      type: "Tiempo Completo",
      salary: "$3.500.000 - $4.500.000 CLP",
      description:
        "Buscamos un desarrollador senior para liderar el desarrollo de nuestra plataforma de evaluaciones psicométricas.",
      requirements: [
        "5+ años de experiencia en desarrollo full stack",
        "Experiencia avanzada con React, Next.js, TypeScript",
        "Conocimiento sólido de Node.js y bases de datos PostgreSQL",
        "Experiencia con APIs REST y GraphQL",
        "Conocimiento de AWS o servicios cloud similares",
        "Experiencia con metodologías ágiles",
        "Inglés conversacional",
      ],
      responsibilities: [
        "Desarrollar y mantener aplicaciones web escalables",
        "Colaborar con el equipo de producto en nuevas funcionalidades",
        "Optimizar el rendimiento de aplicaciones existentes",
        "Mentorear desarrolladores junior",
        "Participar en revisiones de código y arquitectura",
        "Implementar mejores prácticas de desarrollo",
      ],
      benefits: [
        "Salario competitivo + equity",
        "Seguro de salud premium",
        "Trabajo híbrido (3 días remotos)",
        "Presupuesto anual de $800.000 CLP para capacitación",
        "Laptop y setup completo",
        "Vacaciones flexibles",
      ],
    },
    {
      id: "ux-ui-designer",
      title: "UX/UI Designer",
      department: "design",
      location: "Santiago, Chile",
      type: "Tiempo Completo",
      salary: "$2.800.000 - $3.800.000 CLP",
      description:
        "Diseñador UX/UI para crear experiencias excepcionales en nuestra plataforma de desarrollo profesional.",
      requirements: [
        "3+ años de experiencia en diseño UX/UI",
        "Dominio de Figma, Sketch o herramientas similares",
        "Experiencia en design systems",
        "Conocimiento de principios de usabilidad",
        "Portfolio sólido con casos de estudio",
        "Experiencia en investigación de usuarios",
        "Conocimientos básicos de HTML/CSS",
      ],
      responsibilities: [
        "Diseñar interfaces intuitivas y atractivas",
        "Realizar investigación de usuarios y testing",
        "Crear y mantener el design system",
        "Colaborar estrechamente con desarrollo",
        "Prototipar nuevas funcionalidades",
        "Analizar métricas de usabilidad",
      ],
      benefits: [
        "Salario competitivo + bonos por performance",
        "Seguro de salud premium",
        "Horarios flexibles",
        "Presupuesto para conferencias y cursos",
        "Ambiente creativo y colaborativo",
        "Oportunidades de crecimiento",
      ],
    },
    {
      id: "data-scientist-ai",
      title: "Data Scientist - AI Coach",
      department: "ai",
      location: "Santiago, Chile",
      type: "Tiempo Completo",
      salary: "$4.000.000 - $5.200.000 CLP",
      description: "Científico de datos especializado en IA para desarrollar y mejorar nuestro coach inteligente.",
      requirements: [
        "PhD o Master en Data Science, ML o campo relacionado",
        "Experiencia con Python, TensorFlow, PyTorch",
        "Conocimiento profundo de NLP y LLMs",
        "Experiencia con modelos de recomendación",
        "Conocimiento de psicología organizacional (deseable)",
        "Experiencia en producción con modelos ML",
        "Inglés avanzado",
      ],
      responsibilities: [
        "Desarrollar algoritmos de recomendación personalizados",
        "Mejorar el modelo de coaching con IA",
        "Analizar datos de comportamiento de usuarios",
        "Implementar modelos de ML en producción",
        "Colaborar con psicólogos organizacionales",
        "Investigar nuevas técnicas de IA aplicadas",
      ],
      benefits: [
        "Salario top del mercado + equity significativo",
        "Seguro de salud premium + familia",
        "Flexibilidad total de horarios",
        "Presupuesto ilimitado para investigación",
        "Acceso a recursos computacionales avanzados",
        "Oportunidades de publicación académica",
      ],
    },
    {
      id: "product-manager",
      title: "Product Manager",
      department: "product",
      location: "Santiago, Chile",
      type: "Tiempo Completo",
      salary: "$3.200.000 - $4.200.000 CLP",
      description: "Product Manager para liderar la estrategia y desarrollo de nuestras funcionalidades principales.",
      requirements: [
        "4+ años de experiencia como Product Manager",
        "Experiencia en productos SaaS B2B",
        "Conocimiento de metodologías ágiles",
        "Habilidades analíticas fuertes",
        "Experiencia con herramientas como Jira, Notion",
        "Background técnico deseable",
        "Excelentes habilidades de comunicación",
      ],
      responsibilities: [
        "Definir roadmap de producto",
        "Colaborar con equipos de desarrollo y diseño",
        "Analizar métricas de producto y usuario",
        "Gestionar backlog y prioridades",
        "Comunicar visión de producto a stakeholders",
        "Realizar investigación de mercado",
      ],
      benefits: [
        "Salario competitivo + equity",
        "Seguro de salud premium",
        "Trabajo híbrido flexible",
        "Presupuesto para herramientas y capacitación",
        "Oportunidades de liderazgo",
        "Impacto directo en el producto",
      ],
    },
    {
      id: "customer-success",
      title: "Customer Success Manager",
      department: "customer",
      location: "Santiago, Chile",
      type: "Tiempo Completo",
      salary: "$2.500.000 - $3.200.000 CLP",
      description: "Customer Success Manager para asegurar el éxito y satisfacción de nuestros clientes empresariales.",
      requirements: [
        "3+ años en Customer Success o Account Management",
        "Experiencia en SaaS B2B",
        "Excelentes habilidades de comunicación",
        "Orientación a resultados y métricas",
        "Experiencia con CRM (Salesforce, HubSpot)",
        "Capacidad de análisis de datos",
        "Inglés intermedio-avanzado",
      ],
      responsibilities: [
        "Gestionar cartera de clientes empresariales",
        "Asegurar adopción exitosa de la plataforma",
        "Identificar oportunidades de upselling",
        "Resolver problemas y consultas de clientes",
        "Crear contenido educativo y webinars",
        "Analizar métricas de satisfacción y retención",
      ],
      benefits: [
        "Salario base + comisiones atractivas",
        "Seguro de salud premium",
        "Horarios flexibles",
        "Presupuesto para capacitación en CS",
        "Oportunidades de crecimiento",
        "Ambiente colaborativo",
      ],
    },
    {
      id: "marketing-digital",
      title: "Marketing Digital Specialist",
      department: "marketing",
      location: "Santiago, Chile",
      type: "Tiempo Completo",
      salary: "$2.200.000 - $3.000.000 CLP",
      description: "Especialista en marketing digital para impulsar el crecimiento y adquisición de usuarios.",
      requirements: [
        "2+ años en marketing digital",
        "Experiencia con Google Ads, Facebook Ads",
        "Conocimiento de SEO y content marketing",
        "Experiencia con herramientas de analytics",
        "Habilidades de copywriting",
        "Conocimiento de marketing automation",
        "Creatividad y pensamiento analítico",
      ],
      responsibilities: [
        "Gestionar campañas de paid media",
        "Crear y optimizar contenido para redes sociales",
        "Analizar métricas de marketing y ROI",
        "Desarrollar estrategias de content marketing",
        "Colaborar en el diseño de landing pages",
        "Implementar estrategias de email marketing",
      ],
      benefits: [
        "Salario competitivo + bonos por performance",
        "Seguro de salud",
        "Trabajo híbrido",
        "Presupuesto para herramientas de marketing",
        "Oportunidades de especialización",
        "Ambiente dinámico y creativo",
      ],
    },
  ]

  const filteredJobs = selectedDepartment === "all" ? jobs : jobs.filter((job) => job.department === selectedDepartment)

  const companyBenefits = [
    {
      icon: <DollarSign className="h-8 w-8 text-green-500" />,
      title: "Compensación Competitiva",
      description: "Salarios top del mercado, equity, bonos por performance y revisiones salariales anuales.",
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Salud y Bienestar",
      description: "Seguro de salud premium, cobertura dental, programas de bienestar y apoyo psicológico.",
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: "Flexibilidad Total",
      description: "Horarios flexibles, trabajo híbrido (3 días remotos), vacaciones ilimitadas.",
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-purple-500" />,
      title: "Desarrollo Profesional",
      description: "Presupuesto anual de capacitación, conferencias, cursos online y mentoring interno.",
    },
    {
      icon: <Laptop className="h-8 w-8 text-gray-500" />,
      title: "Tecnología de Punta",
      description: "MacBook Pro, monitor 4K, setup ergonómico completo y herramientas premium.",
    },
    {
      icon: <Coffee className="h-8 w-8 text-amber-500" />,
      title: "Ambiente Excepcional",
      description: "Oficina moderna en Providencia, snacks ilimitados, eventos de equipo y cultura colaborativa.",
    },
  ]

  const hiringProcess = [
    {
      step: 1,
      title: "Aplicación",
      description: "Envía tu CV y carta de presentación a través de nuestro formulario.",
    },
    {
      step: 2,
      title: "Screening Inicial",
      description: "Llamada de 30 minutos con nuestro equipo de Talent para conocerte mejor.",
    },
    {
      step: 3,
      title: "Entrevista Técnica",
      description: "Evaluación técnica específica del rol con el equipo correspondiente.",
    },
    {
      step: 4,
      title: "Entrevista Final",
      description: "Conversación con liderazgo sobre fit cultural y expectativas mutuas.",
    },
  ]

  const handleApplyToJob = (job: any) => {
    setApplicationData({
      ...applicationData,
      positionId: job.id,
      positionTitle: job.title,
      department: departments.find((d) => d.id === job.department)?.name || job.department,
    })
    setSelectedJob(job.id)
    // Scroll to application form
    document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle: applicationData.positionTitle,
          department: applicationData.department,
          candidateName: `${applicationData.firstName} ${applicationData.lastName}`,
          candidateEmail: applicationData.email,
          candidatePhone: applicationData.phone,
          coverLetter: applicationData.motivation,
          linkedinProfile: applicationData.linkedinProfile,
          portfolioUrl: applicationData.portfolioUrl,
          yearsExperience: applicationData.experienceLevel
            ? Number.parseInt(applicationData.experienceLevel.split("-")[0])
            : 0,
          currentCompany: applicationData.currentCompany,
          currentPosition: applicationData.currentPosition,
          salaryExpectation: applicationData.salaryExpectation
            ? Number.parseInt(applicationData.salaryExpectation.replace(/\D/g, ""))
            : null,
          availabilityDate: applicationData.availabilityDate || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar la aplicación")
      }

      setApplicationId(data.applicationId)
      setSubmitted(true)

      // Reset form
      setApplicationData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        positionId: "",
        positionTitle: "",
        department: "",
        experienceLevel: "",
        motivation: "",
        currentCompany: "",
        currentPosition: "",
        linkedinProfile: "",
        portfolioUrl: "",
        salaryExpectation: "",
        availabilityDate: "",
      })
      setSelectedJob(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setApplicationData({ ...applicationData, [field]: value })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Construye el Futuro del Desarrollo Profesional</h1>
            <p className="text-xl mb-8 text-blue-100">
              Únete a nuestro equipo en Santiago y ayuda a transformar carreras con inteligencia artificial y ciencia de
              datos.
            </p>
            <div className="flex items-center justify-center space-x-8 text-lg mb-8">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Santiago, Chile
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                25+ Miembros del Equipo
              </div>
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Oficina en Providencia
              </div>
            </div>

            {/* Track Application CTA */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
              <p className="text-blue-100 mb-2">¿Ya aplicaste? Rastrea tu aplicación</p>
              <Link href="/track-application">
                <Button variant="secondary" size="lg">
                  <Search className="mr-2 h-4 w-4" />
                  Seguir Mi Aplicación
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">25+</div>
              <div className="text-gray-600">Miembros del Equipo</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Retención de Talento</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">4.8/5</div>
              <div className="text-gray-600">Satisfacción Laboral</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">6</div>
              <div className="text-gray-600">Posiciones Abiertas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Oportunidades Abiertas</h2>
              <p className="text-xl text-gray-600">Encuentra tu próximo desafío profesional en nuestro equipo</p>
            </div>

            {/* Department Filter */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Filter className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700 font-medium">Filtrar por departamento:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {departments.map((dept) => (
                  <Button
                    key={dept.id}
                    variant={selectedDepartment === dept.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDepartment(dept.id)}
                    className="mb-2"
                  >
                    {dept.name} ({dept.count})
                  </Button>
                ))}
              </div>
            </div>

            {/* Job Cards */}
            <div className="grid gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                        <CardDescription className="text-lg mb-4">{job.description}</CardDescription>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.type}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {departments.find((d) => d.id === job.department)?.name}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="requirements" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="requirements">Requisitos</TabsTrigger>
                        <TabsTrigger value="responsibilities">Responsabilidades</TabsTrigger>
                        <TabsTrigger value="benefits">Beneficios</TabsTrigger>
                      </TabsList>
                      <TabsContent value="requirements" className="mt-4">
                        <ul className="space-y-2">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start">
                              <ChevronRight className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                      <TabsContent value="responsibilities" className="mt-4">
                        <ul className="space-y-2">
                          {job.responsibilities.map((resp, index) => (
                            <li key={index} className="flex items-start">
                              <ChevronRight className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                      <TabsContent value="benefits" className="mt-4">
                        <ul className="space-y-2">
                          {job.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <ChevronRight className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                    </Tabs>
                    <div className="mt-6 pt-4 border-t">
                      <Button className="w-full" onClick={() => handleApplyToJob(job)}>
                        Aplicar a esta Posición
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Por qué Trabajar con Nosotros?</h2>
              <p className="text-xl text-gray-600">
                Ofrecemos un paquete integral de beneficios y un ambiente de trabajo excepcional
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companyBenefits.map((benefit, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto mb-4">{benefit.icon}</div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hiring Process */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestro Proceso de Selección</h2>
              <p className="text-xl text-gray-600">
                Un proceso transparente y eficiente diseñado para conocernos mutuamente
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {hiringProcess.map((process, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {process.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{process.title}</h3>
                  <p className="text-gray-600">{process.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      {submitted ? (
        <section id="application-form" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-green-800">¡Aplicación Enviada Exitosamente!</CardTitle>
                  <CardDescription className="text-green-700">
                    Tu aplicación ha sido recibida y está siendo procesada
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-gray-600 mb-2">Tu ID de aplicación es:</p>
                    <p className="text-2xl font-bold text-gray-900 mb-4">{applicationId}</p>
                    <p className="text-sm text-gray-600">
                      Guarda este ID para hacer seguimiento de tu aplicación. También lo recibirás por email.
                    </p>
                  </div>

                  <div className="space-y-3 text-left">
                    <h4 className="font-semibold text-gray-900">Próximos pasos:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Recibirás un email de confirmación en los próximos minutos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Nuestro equipo revisará tu aplicación en 2-3 días hábiles</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Mail className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span>Te contactaremos por email para los siguientes pasos</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Link href="/track-application" className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        <Search className="mr-2 h-4 w-4" />
                        Seguir Mi Aplicación
                      </Button>
                    </Link>
                    <Button
                      onClick={() => {
                        setSubmitted(false)
                        setApplicationId("")
                      }}
                      className="flex-1"
                    >
                      Aplicar a Otra Posición
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      ) : (
        <section id="application-form" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {selectedJob ? `Aplicar a ${jobs.find((j) => j.id === selectedJob)?.title}` : "Aplica Ahora"}
                </h2>
                <p className="text-xl text-gray-600">Completa el formulario y nos contactaremos contigo pronto</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Formulario de Aplicación</CardTitle>
                  <CardDescription>Todos los campos marcados con * son obligatorios</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitApplication} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Nombre *</Label>
                        <Input
                          id="firstName"
                          placeholder="Tu nombre"
                          value={applicationData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Apellido *</Label>
                        <Input
                          id="lastName"
                          placeholder="Tu apellido"
                          value={applicationData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={applicationData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        placeholder="+56 9 1234 5678"
                        value={applicationData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="position">Posición de Interés *</Label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={applicationData.positionId}
                        onChange={(e) => {
                          const selectedJob = jobs.find((job) => job.id === e.target.value)
                          if (selectedJob) {
                            handleInputChange("positionId", selectedJob.id)
                            handleInputChange("positionTitle", selectedJob.title)
                            handleInputChange(
                              "department",
                              departments.find((d) => d.id === selectedJob.department)?.name || selectedJob.department,
                            )
                          }
                        }}
                        required
                      >
                        <option value="">Selecciona una posición</option>
                        {jobs.map((job) => (
                          <option key={job.id} value={job.id}>
                            {job.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="experience">Años de Experiencia</Label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={applicationData.experienceLevel}
                        onChange={(e) => handleInputChange("experienceLevel", e.target.value)}
                      >
                        <option value="">Selecciona tu experiencia</option>
                        <option value="0-1">0-1 años</option>
                        <option value="2-3">2-3 años</option>
                        <option value="4-5">4-5 años</option>
                        <option value="6-10">6-10 años</option>
                        <option value="10+">Más de 10 años</option>
                      </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="currentCompany">Empresa Actual</Label>
                        <Input
                          id="currentCompany"
                          placeholder="Nombre de tu empresa actual"
                          value={applicationData.currentCompany}
                          onChange={(e) => handleInputChange("currentCompany", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="currentPosition">Cargo Actual</Label>
                        <Input
                          id="currentPosition"
                          placeholder="Tu cargo actual"
                          value={applicationData.currentPosition}
                          onChange={(e) => handleInputChange("currentPosition", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          placeholder="https://linkedin.com/in/tu-perfil"
                          value={applicationData.linkedinProfile}
                          onChange={(e) => handleInputChange("linkedinProfile", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="portfolio">Portafolio/GitHub</Label>
                        <Input
                          id="portfolio"
                          placeholder="https://tu-portafolio.com"
                          value={applicationData.portfolioUrl}
                          onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="salary">Expectativa Salarial (CLP)</Label>
                        <Input
                          id="salary"
                          placeholder="3.500.000"
                          value={applicationData.salaryExpectation}
                          onChange={(e) => handleInputChange("salaryExpectation", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="availability">Disponibilidad</Label>
                        <Input
                          id="availability"
                          type="date"
                          value={applicationData.availabilityDate}
                          onChange={(e) => handleInputChange("availabilityDate", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="motivation">¿Por qué quieres trabajar con nosotros? *</Label>
                      <Textarea
                        id="motivation"
                        placeholder="Cuéntanos qué te motiva a unirte a nuestro equipo..."
                        rows={4}
                        value={applicationData.motivation}
                        onChange={(e) => handleInputChange("motivation", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="cv">CV / Portafolio</Label>
                      <Input id="cv" type="file" accept=".pdf,.doc,.docx" />
                      <p className="text-sm text-gray-500 mt-1">Formatos aceptados: PDF, DOC, DOCX (máx. 5MB)</p>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                      {submitting ? "Enviando..." : "Enviar Aplicación"}
                      {!submitting && <ChevronRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Tienes Preguntas?</h2>
              <p className="text-xl text-gray-600">Nuestro equipo de Talent está aquí para ayudarte</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <Card>
                <CardHeader>
                  <Mail className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <CardTitle>Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">careers@tuempresa.com</p>
                  <p className="text-sm text-gray-500 mt-2">Respuesta en 24-48 horas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Phone className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <CardTitle>Teléfono</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">+56 2 1234 5678</p>
                  <p className="text-sm text-gray-500 mt-2">Lun-Vie 9:00-18:00</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <MapPin className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <CardTitle>Oficina</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Av. Providencia 1234
                    <br />
                    Providencia, Santiago
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Metro Manuel Montt</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CareersPage
