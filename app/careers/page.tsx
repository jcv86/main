"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Briefcase,
  GraduationCap,
  Heart,
  Coffee,
  Zap,
  Shield,
  Calendar,
  CheckCircle,
  ArrowRight,
  Building,
  Award,
  TrendingUp,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface JobPosition {
  id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  salary: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  posted: string
  urgent: boolean
}

const jobPositions: JobPosition[] = [
  {
    id: "senior-software-engineer",
    title: "Ingeniero de Software Senior",
    department: "Tecnología",
    location: "Santiago, Chile",
    type: "Tiempo Completo",
    experience: "5+ años",
    salary: "$3.500.000 - $4.500.000 CLP",
    description:
      "Únete a nuestro equipo de tecnología para desarrollar soluciones innovadoras que impacten a miles de profesionales en su crecimiento.",
    requirements: [
      "5+ años de experiencia en desarrollo de software",
      "Dominio de React, Node.js y TypeScript",
      "Experiencia con bases de datos PostgreSQL",
      "Conocimiento de AWS o servicios cloud similares",
      "Experiencia en metodologías ágiles",
      "Inglés técnico intermedio",
    ],
    responsibilities: [
      "Desarrollar y mantener aplicaciones web escalables",
      "Colaborar con equipos multidisciplinarios",
      "Mentorear desarrolladores junior",
      "Participar en revisiones de código y arquitectura",
      "Implementar mejores prácticas de desarrollo",
    ],
    benefits: [
      "Seguro de salud premium",
      "15 días de vacaciones adicionales",
      "Presupuesto para capacitación",
      "Trabajo remoto híbrido",
      "Stock options",
    ],
    posted: "2024-01-15",
    urgent: true,
  },
  {
    id: "product-manager",
    title: "Product Manager",
    department: "Producto",
    location: "Santiago, Chile",
    type: "Tiempo Completo",
    experience: "3+ años",
    salary: "$3.000.000 - $4.000.000 CLP",
    description:
      "Lidera el desarrollo de productos que transforman la experiencia de desarrollo profesional de nuestros usuarios.",
    requirements: [
      "3+ años de experiencia en gestión de productos",
      "Experiencia con metodologías ágiles",
      "Conocimiento de analytics y métricas de producto",
      "Habilidades de comunicación excepcionales",
      "Experiencia en productos B2B",
      "MBA o formación equivalente preferible",
    ],
    responsibilities: [
      "Definir roadmap y estrategia de producto",
      "Colaborar con equipos de ingeniería y diseño",
      "Analizar métricas y feedback de usuarios",
      "Gestionar stakeholders internos y externos",
      "Liderar lanzamientos de nuevas funcionalidades",
    ],
    benefits: [
      "Seguro de salud familiar",
      "Bono por objetivos",
      "Capacitación en liderazgo",
      "Flexibilidad horaria",
      "Participación en conferencias",
    ],
    posted: "2024-01-12",
    urgent: false,
  },
  {
    id: "ux-designer",
    title: "UX/UI Designer Senior",
    department: "Diseño",
    location: "Santiago, Chile",
    type: "Tiempo Completo",
    experience: "4+ años",
    salary: "$2.800.000 - $3.800.000 CLP",
    description: "Crea experiencias excepcionales que ayuden a los profesionales a alcanzar su máximo potencial.",
    requirements: [
      "4+ años de experiencia en UX/UI",
      "Dominio de Figma, Sketch y herramientas de prototipado",
      "Experiencia en design systems",
      "Conocimiento de usabilidad y testing",
      "Portfolio sólido con casos de estudio",
      "Experiencia en productos digitales",
    ],
    responsibilities: [
      "Diseñar interfaces intuitivas y atractivas",
      "Realizar investigación de usuarios",
      "Crear y mantener design system",
      "Colaborar con equipos de producto e ingeniería",
      "Realizar testing de usabilidad",
    ],
    benefits: [
      "Seguro de salud",
      "Presupuesto para herramientas de diseño",
      "Capacitación en UX",
      "Ambiente creativo",
      "Proyectos desafiantes",
    ],
    posted: "2024-01-10",
    urgent: false,
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    department: "Analytics",
    location: "Santiago, Chile",
    type: "Tiempo Completo",
    experience: "3+ años",
    salary: "$3.200.000 - $4.200.000 CLP",
    description:
      "Utiliza datos para generar insights que impulsen decisiones estratégicas y mejoren la experiencia del usuario.",
    requirements: [
      "3+ años de experiencia en data science",
      "Dominio de Python, R y SQL",
      "Experiencia con machine learning",
      "Conocimiento de estadística avanzada",
      "Experiencia con herramientas de visualización",
      "Título en ingeniería, matemáticas o afines",
    ],
    responsibilities: [
      "Desarrollar modelos predictivos",
      "Analizar comportamiento de usuarios",
      "Crear dashboards y reportes",
      "Colaborar con equipos de producto",
      "Implementar experimentos A/B",
    ],
    benefits: [
      "Seguro de salud",
      "Capacitación en tecnologías emergentes",
      "Conferencias especializadas",
      "Trabajo con datos reales",
      "Impacto directo en producto",
    ],
    posted: "2024-01-08",
    urgent: true,
  },
  {
    id: "marketing-manager",
    title: "Marketing Manager",
    department: "Marketing",
    location: "Santiago, Chile",
    type: "Tiempo Completo",
    experience: "4+ años",
    salary: "$2.500.000 - $3.500.000 CLP",
    description:
      "Lidera estrategias de marketing que conecten con profesionales y impulsen el crecimiento de la plataforma.",
    requirements: [
      "4+ años de experiencia en marketing digital",
      "Experiencia en marketing B2B",
      "Conocimiento de SEO, SEM y social media",
      "Experiencia con herramientas de analytics",
      "Habilidades de copywriting",
      "Experiencia en growth marketing",
    ],
    responsibilities: [
      "Desarrollar estrategias de marketing",
      "Gestionar campañas digitales",
      "Analizar métricas de marketing",
      "Colaborar con equipos de ventas",
      "Crear contenido estratégico",
    ],
    benefits: [
      "Seguro de salud",
      "Presupuesto para herramientas de marketing",
      "Capacitación en marketing digital",
      "Flexibilidad creativa",
      "Bonos por performance",
    ],
    posted: "2024-01-05",
    urgent: false,
  },
  {
    id: "customer-success",
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Santiago, Chile",
    type: "Tiempo Completo",
    experience: "2+ años",
    salary: "$2.200.000 - $3.200.000 CLP",
    description:
      "Asegura el éxito y satisfacción de nuestros clientes, ayudándolos a maximizar el valor de nuestra plataforma.",
    requirements: [
      "2+ años de experiencia en customer success",
      "Excelentes habilidades de comunicación",
      "Experiencia en SaaS B2B",
      "Conocimiento de CRM y herramientas de CS",
      "Orientación a resultados",
      "Capacidad analítica",
    ],
    responsibilities: [
      "Gestionar cartera de clientes",
      "Asegurar adopción y retención",
      "Identificar oportunidades de crecimiento",
      "Resolver problemas de clientes",
      "Colaborar con equipos internos",
    ],
    benefits: [
      "Seguro de salud",
      "Comisiones por retención",
      "Capacitación en customer success",
      "Interacción directa con clientes",
      "Crecimiento profesional acelerado",
    ],
    posted: "2024-01-03",
    urgent: false,
  },
]

const companyBenefits = [
  {
    icon: Heart,
    title: "Bienestar Integral",
    description: "Seguro de salud premium, apoyo psicológico y programas de wellness",
  },
  {
    icon: GraduationCap,
    title: "Desarrollo Profesional",
    description: "Presupuesto anual para capacitación, conferencias y certificaciones",
  },
  {
    icon: Coffee,
    title: "Ambiente Flexible",
    description: "Trabajo remoto híbrido, horarios flexibles y espacios colaborativos",
  },
  {
    icon: Zap,
    title: "Innovación Constante",
    description: "Proyectos desafiantes, tecnologías de vanguardia y autonomía creativa",
  },
  {
    icon: Shield,
    title: "Estabilidad y Crecimiento",
    description: "Stock options, bonos por performance y plan de carrera claro",
  },
  {
    icon: Users,
    title: "Equipo Excepcional",
    description: "Colabora con profesionales talentosos en un ambiente inclusivo",
  },
]

const applicationProcess = [
  {
    step: 1,
    title: "Aplicación Online",
    description: "Completa tu aplicación con CV y carta de presentación",
    duration: "5 min",
  },
  {
    step: 2,
    title: "Revisión Inicial",
    description: "Nuestro equipo de RRHH revisa tu perfil",
    duration: "2-3 días",
  },
  {
    step: 3,
    title: "Entrevista Telefónica",
    description: "Conversación inicial con el equipo de reclutamiento",
    duration: "30 min",
  },
  {
    step: 4,
    title: "Entrevista Técnica",
    description: "Evaluación de habilidades específicas del rol",
    duration: "1 hora",
  },
  {
    step: 5,
    title: "Entrevista Final",
    description: "Conversación con el equipo y manager directo",
    duration: "45 min",
  },
  {
    step: 6,
    title: "Oferta y Negociación",
    description: "Presentación de oferta y términos de contratación",
    duration: "1-2 días",
  },
]

export default function CareersPage() {
  const router = useRouter()
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applicationData, setApplicationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedin: "",
    portfolio: "",
    experience: "",
    motivation: "",
    availability: "",
    salary: "",
    cv: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [applicationId, setApplicationId] = useState<string>("")

  const departments = ["all", ...Array.from(new Set(jobPositions.map((job) => job.department)))]

  const filteredJobs =
    selectedDepartment === "all" ? jobPositions : jobPositions.filter((job) => job.department === selectedDepartment)

  const handleJobSelect = (job: JobPosition) => {
    setSelectedJob(job)
    setShowApplicationForm(false)
  }

  const handleApplyClick = () => {
    setShowApplicationForm(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setApplicationData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileChange = (file: File | null) => {
    setApplicationData((prev) => ({
      ...prev,
      cv: file,
    }))
  }

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJob) return

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("jobId", selectedJob.id)
      formData.append("jobTitle", selectedJob.title)
      formData.append("firstName", applicationData.firstName)
      formData.append("lastName", applicationData.lastName)
      formData.append("email", applicationData.email)
      formData.append("phone", applicationData.phone)
      formData.append("linkedin", applicationData.linkedin)
      formData.append("portfolio", applicationData.portfolio)
      formData.append("experience", applicationData.experience)
      formData.append("motivation", applicationData.motivation)
      formData.append("availability", applicationData.availability)
      formData.append("expectedSalary", applicationData.salary)

      if (applicationData.cv) {
        formData.append("cv", applicationData.cv)
      }

      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setApplicationId(result.applicationId)
        setSubmitSuccess(true)
        setShowApplicationForm(false)

        // Reset form
        setApplicationData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          linkedin: "",
          portfolio: "",
          experience: "",
          motivation: "",
          availability: "",
          salary: "",
          cv: null,
        })
      } else {
        throw new Error("Error al enviar aplicación")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      alert("Error al enviar la aplicación. Por favor intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">¡Aplicación Enviada Exitosamente!</h1>
            <p className="text-gray-600 mb-6">
              Gracias por tu interés en unirte a nuestro equipo. Hemos recibido tu aplicación y la revisaremos
              cuidadosamente.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Detalles de tu Aplicación</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de Aplicación:</span>
                  <span className="font-mono font-semibold">{applicationId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posición:</span>
                  <span className="font-semibold">{selectedJob?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span>{new Date().toLocaleDateString("es-CL")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              <strong>Próximos pasos:</strong> Recibirás un email de confirmación en los próximos minutos. Nuestro
              equipo de RRHH revisará tu aplicación y te contactaremos dentro de 2-3 días hábiles.
            </p>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => router.push(`/track-application?email=${applicationData.email}&id=${applicationId}`)}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Seguir mi Aplicación
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setSubmitSuccess(false)
                  setSelectedJob(null)
                }}
              >
                Ver Más Posiciones
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Construye tu Carrera con Nosotros</h1>
            <p className="text-xl mb-8 opacity-90">
              Únete a un equipo apasionado por transformar el desarrollo profesional. Encuentra tu próxima oportunidad
              en Santiago, Chile.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>Oficinas en Santiago</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>50+ Profesionales</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Crecimiento 200% anual</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Great Place to Work</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {!selectedJob ? (
          <>
            {/* Job Listings */}
            <div className="mb-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Posiciones Abiertas</h2>
                  <p className="text-gray-600">Descubre oportunidades que se alineen con tus objetivos profesionales</p>
                </div>

                <div className="mt-4 md:mt-0">
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los Departamentos</SelectItem>
                      {departments.slice(1).map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-6">
                {filteredJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleJobSelect(job)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            {job.urgent && (
                              <Badge variant="destructive" className="text-xs">
                                Urgente
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              <span>{job.department}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{job.type}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GraduationCap className="h-4 w-4" />
                              <span>{job.experience}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{job.salary}</span>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4">{job.description}</p>

                          <div className="flex flex-wrap gap-2">
                            {job.requirements.slice(0, 3).map((req, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                            {job.requirements.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{job.requirements.length - 3} más
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 md:mt-0 md:ml-6">
                          <Button className="w-full md:w-auto">
                            Ver Detalles
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Company Benefits */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">¿Por Qué Trabajar con Nosotros?</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Ofrecemos un ambiente de trabajo excepcional donde puedes crecer profesionalmente mientras contribuyes
                  a transformar el desarrollo de carrera de miles de personas.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companyBenefits.map((benefit, index) => (
                  <Card key={index}>
                    <CardContent className="p-6 text-center">
                      <benefit.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Application Process */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Proceso de Selección</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Nuestro proceso está diseñado para conocerte mejor y asegurar que sea una excelente oportunidad tanto
                  para ti como para nuestro equipo.
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {applicationProcess.map((step, index) => (
                    <Card key={step.step} className="relative">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {step.step}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {step.duration}
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-2">{step.title}</h3>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                      </CardContent>
                      {index < applicationProcess.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <ArrowRight className="h-3 w-3 text-gray-600" />
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Job Detail View */
          <div className="max-w-4xl mx-auto">
            <Button variant="outline" onClick={() => setSelectedJob(null)} className="mb-6">
              ← Volver a Posiciones
            </Button>

            {!showApplicationForm ? (
              <div className="space-y-8">
                {/* Job Header */}
                <Card>
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <h1 className="text-3xl font-bold">{selectedJob.title}</h1>
                          {selectedJob.urgent && <Badge variant="destructive">Urgente</Badge>}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-gray-500" />
                            <span>{selectedJob.department}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{selectedJob.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{selectedJob.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-gray-500" />
                            <span>{selectedJob.experience}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span>{selectedJob.salary}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>Publicado: {new Date(selectedJob.posted).toLocaleDateString("es-CL")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 md:mt-0">
                        <Button size="lg" onClick={handleApplyClick} className="w-full md:w-auto">
                          Aplicar Ahora
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
                  </CardContent>
                </Card>

                {/* Job Details Tabs */}
                <Tabs defaultValue="requirements" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="requirements">Requisitos</TabsTrigger>
                    <TabsTrigger value="responsibilities">Responsabilidades</TabsTrigger>
                    <TabsTrigger value="benefits">Beneficios</TabsTrigger>
                  </TabsList>

                  <TabsContent value="requirements" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Requisitos del Puesto</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {selectedJob.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="responsibilities" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Responsabilidades Principales</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {selectedJob.responsibilities.map((resp, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <ArrowRight className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="benefits" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Beneficios del Puesto</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {selectedJob.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <Heart className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Apply CTA */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">¿Listo para Unirte a Nuestro Equipo?</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Si cumples con los requisitos y te emociona la oportunidad de contribuir a nuestro crecimiento,
                      nos encantaría conocerte mejor.
                    </p>
                    <Button size="lg" onClick={handleApplyClick}>
                      Aplicar a Esta Posición
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Application Form */
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Aplicar a {selectedJob.title}</CardTitle>
                  <p className="text-gray-600">
                    Completa el formulario a continuación para aplicar a esta posición. Todos los campos marcados con *
                    son obligatorios.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitApplication} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Información Personal</h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">Nombre *</Label>
                          <Input
                            id="firstName"
                            value={applicationData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Apellido *</Label>
                          <Input
                            id="lastName"
                            value={applicationData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={applicationData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Teléfono *</Label>
                          <Input
                            id="phone"
                            value={applicationData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={applicationData.linkedin}
                            onChange={(e) => handleInputChange("linkedin", e.target.value)}
                            placeholder="https://linkedin.com/in/tu-perfil"
                          />
                        </div>
                        <div>
                          <Label htmlFor="portfolio">Portfolio/GitHub</Label>
                          <Input
                            id="portfolio"
                            value={applicationData.portfolio}
                            onChange={(e) => handleInputChange("portfolio", e.target.value)}
                            placeholder="https://tu-portfolio.com"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Professional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Información Profesional</h3>

                      <div>
                        <Label htmlFor="experience">Experiencia Relevante *</Label>
                        <Textarea
                          id="experience"
                          value={applicationData.experience}
                          onChange={(e) => handleInputChange("experience", e.target.value)}
                          placeholder="Describe tu experiencia relevante para esta posición..."
                          rows={4}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="motivation">¿Por qué te interesa esta posición? *</Label>
                        <Textarea
                          id="motivation"
                          value={applicationData.motivation}
                          onChange={(e) => handleInputChange("motivation", e.target.value)}
                          placeholder="Cuéntanos qué te motiva a aplicar a esta posición..."
                          rows={4}
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="availability">Disponibilidad *</Label>
                          <Select
                            value={applicationData.availability}
                            onValueChange={(value) => handleInputChange("availability", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu disponibilidad" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="inmediata">Inmediata</SelectItem>
                              <SelectItem value="2-semanas">2 semanas</SelectItem>
                              <SelectItem value="1-mes">1 mes</SelectItem>
                              <SelectItem value="2-meses">2 meses</SelectItem>
                              <SelectItem value="a-convenir">A convenir</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="salary">Expectativa Salarial</Label>
                          <Input
                            id="salary"
                            value={applicationData.salary}
                            onChange={(e) => handleInputChange("salary", e.target.value)}
                            placeholder="Ej: $3.000.000 - $4.000.000 CLP"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* CV Upload */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Documentos</h3>

                      <div>
                        <Label htmlFor="cv">Curriculum Vitae *</Label>
                        <Input
                          id="cv"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                          required
                        />
                        <p className="text-sm text-gray-500 mt-1">Formatos aceptados: PDF, DOC, DOCX (máx. 5MB)</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Submit */}
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowApplicationForm(false)}
                        disabled={isSubmitting}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isSubmitting} className="flex-1">
                        {isSubmitting ? "Enviando..." : "Enviar Aplicación"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
