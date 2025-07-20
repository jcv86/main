"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  MapPin,
  Building2,
  Clock,
  Users,
  Briefcase,
  Heart,
  CheckCircle,
  Star,
  Laptop,
  Home,
  BookmarkPlus,
  Send,
  Eye,
  SlidersHorizontal,
  Award,
  Target,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface Job {
  id: number
  title: string
  company: string
  location: string
  type: "full-time" | "part-time" | "contract" | "remote"
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
  postedDate: string
  applicants: number
  remote: boolean
  experience: string
  companySize: string
  industry: string
  skills: string[]
  companyDescription: string
  responsibilities: string[]
  workMode: "presencial" | "remoto" | "híbrido"
}

const mockJobs: Job[] = [
  {
    id: 1,
    title: "Desarrollador Full Stack Senior",
    company: "TechCorp Chile",
    location: "Santiago, Las Condes",
    type: "full-time",
    salary: "$2.500.000 - $3.200.000 CLP",
    description:
      "Buscamos un desarrollador Full Stack Senior para liderar el desarrollo de aplicaciones web modernas utilizando React, Node.js y tecnologías cloud. Trabajarás en un equipo ágil desarrollando soluciones innovadoras para clientes enterprise.",
    requirements: [
      "5+ años de experiencia en desarrollo web",
      "Dominio de React, Node.js, TypeScript",
      "Experiencia con AWS o Azure",
      "Conocimientos de bases de datos SQL y NoSQL",
      "Experiencia con metodologías ágiles",
      "Inglés intermedio-avanzado",
    ],
    benefits: [
      "Seguro de salud complementario",
      "Bono de desempeño anual",
      "Capacitación y certificaciones",
      "Trabajo remoto flexible",
      "Días libres adicionales",
      "Equipamiento tecnológico",
    ],
    responsibilities: [
      "Desarrollar y mantener aplicaciones web full-stack",
      "Colaborar con equipos de diseño y producto",
      "Implementar mejores prácticas de desarrollo",
      "Mentorear desarrolladores junior",
      "Participar en revisiones de código",
      "Optimizar rendimiento de aplicaciones",
    ],
    postedDate: "2024-01-15",
    applicants: 45,
    remote: true,
    experience: "Senior (5+ años)",
    companySize: "51-200 empleados",
    industry: "Tecnología",
    skills: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"],
    companyDescription:
      "TechCorp Chile es una empresa líder en desarrollo de software empresarial, especializada en soluciones cloud y transformación digital para grandes corporaciones.",
    workMode: "híbrido",
  },
  {
    id: 2,
    title: "Frontend Developer React",
    company: "StartupLab",
    location: "Santiago, Providencia",
    type: "full-time",
    salary: "$1.800.000 - $2.400.000 CLP",
    description:
      "Únete a nuestro equipo de desarrollo frontend para crear interfaces de usuario excepcionales. Trabajarás con las últimas tecnologías React y contribuirás al crecimiento de nuestra plataforma SaaS.",
    requirements: [
      "3+ años de experiencia con React",
      "Conocimientos sólidos de JavaScript/TypeScript",
      "Experiencia con CSS moderno y frameworks",
      "Familiaridad con herramientas de testing",
      "Conocimientos de UX/UI",
      "Experiencia con Git y metodologías ágiles",
    ],
    benefits: [
      "Ambiente startup dinámico",
      "Stock options",
      "Horarios flexibles",
      "Snacks y bebidas gratis",
      "Eventos de equipo",
      "Crecimiento profesional acelerado",
    ],
    responsibilities: [
      "Desarrollar componentes React reutilizables",
      "Implementar diseños responsive",
      "Optimizar rendimiento de la aplicación",
      "Colaborar con el equipo de diseño",
      "Escribir tests unitarios y de integración",
      "Participar en planning y retrospectivas",
    ],
    postedDate: "2024-01-12",
    applicants: 32,
    remote: false,
    experience: "Mid-level (3-5 años)",
    companySize: "11-50 empleados",
    industry: "SaaS",
    skills: ["React", "TypeScript", "CSS", "Jest", "Figma"],
    companyDescription:
      "StartupLab es una startup chilena en rápido crecimiento que desarrolla herramientas SaaS para la gestión empresarial, con foco en la innovación y agilidad.",
    workMode: "presencial",
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Remoto (Chile)",
    type: "full-time",
    salary: "$2.800.000 - $3.500.000 CLP",
    description:
      "Buscamos un DevOps Engineer experimentado para gestionar nuestra infraestructura cloud y automatizar procesos de deployment. Trabajarás con tecnologías de vanguardia en un ambiente 100% remoto.",
    requirements: [
      "4+ años de experiencia en DevOps",
      "Experiencia con AWS, Docker, Kubernetes",
      "Conocimientos de CI/CD (Jenkins, GitLab CI)",
      "Scripting en Python o Bash",
      "Experiencia con Terraform o CloudFormation",
      "Conocimientos de monitoreo y logging",
    ],
    benefits: [
      "Trabajo 100% remoto",
      "Equipamiento completo",
      "Presupuesto para capacitación",
      "Seguro de vida",
      "Vacaciones flexibles",
      "Bonos por certificaciones",
    ],
    responsibilities: [
      "Gestionar infraestructura cloud en AWS",
      "Automatizar procesos de deployment",
      "Implementar pipelines CI/CD",
      "Monitorear sistemas y aplicaciones",
      "Optimizar costos de infraestructura",
      "Documentar procesos y procedimientos",
    ],
    postedDate: "2024-01-10",
    applicants: 28,
    remote: true,
    experience: "Senior (4+ años)",
    companySize: "201-500 empleados",
    industry: "Cloud Computing",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Python"],
    companyDescription:
      "CloudTech Solutions es una empresa especializada en servicios de cloud computing y transformación digital, ayudando a empresas a migrar y optimizar su infraestructura.",
    workMode: "remoto",
  },
  {
    id: 4,
    title: "Data Scientist Junior",
    company: "Analytics Pro",
    location: "Santiago, Las Condes",
    type: "full-time",
    salary: "$1.600.000 - $2.000.000 CLP",
    description:
      "Oportunidad perfecta para iniciar tu carrera en Data Science. Trabajarás con grandes volúmenes de datos, desarrollando modelos de machine learning y generando insights valiosos para nuestros clientes.",
    requirements: [
      "Título en Ingeniería, Matemáticas o afines",
      "Conocimientos de Python y R",
      "Experiencia con pandas, numpy, scikit-learn",
      "Conocimientos básicos de SQL",
      "Familiaridad con Jupyter Notebooks",
      "Inglés técnico para lectura",
    ],
    benefits: [
      "Mentoring especializado",
      "Cursos y certificaciones pagadas",
      "Ambiente de aprendizaje",
      "Proyectos desafiantes",
      "Crecimiento profesional estructurado",
      "Seguro complementario",
    ],
    responsibilities: [
      "Analizar y limpiar conjuntos de datos",
      "Desarrollar modelos predictivos",
      "Crear visualizaciones y dashboards",
      "Colaborar con equipos de negocio",
      "Documentar metodologías y resultados",
      "Presentar findings a stakeholders",
    ],
    postedDate: "2024-01-08",
    applicants: 67,
    remote: false,
    experience: "Junior (0-2 años)",
    companySize: "51-200 empleados",
    industry: "Analytics",
    skills: ["Python", "R", "SQL", "Machine Learning", "Pandas"],
    companyDescription:
      "Analytics Pro es una consultora especializada en análisis de datos y business intelligence, trabajando con empresas líderes en diversos sectores.",
    workMode: "híbrido",
  },
  {
    id: 5,
    title: "Mobile Developer iOS/Android",
    company: "AppFactory Chile",
    location: "Santiago, Vitacura",
    type: "contract",
    salary: "$2.200.000 - $2.800.000 CLP",
    description:
      "Contrato por 6 meses con posibilidad de extensión. Desarrollarás aplicaciones móviles nativas para iOS y Android, trabajando en proyectos innovadores para clientes nacionales e internacionales.",
    requirements: [
      "3+ años desarrollando apps móviles",
      "Experiencia con Swift/Kotlin o React Native",
      "Conocimientos de arquitecturas móviles",
      "Experiencia publicando en App Store/Play Store",
      "Familiaridad con APIs REST",
      "Portfolio de aplicaciones publicadas",
    ],
    benefits: [
      "Contrato competitivo",
      "Flexibilidad horaria",
      "Proyectos internacionales",
      "Posibilidad de extensión",
      "Ambiente creativo",
      "Últimas tecnologías móviles",
    ],
    responsibilities: [
      "Desarrollar aplicaciones móviles nativas",
      "Integrar APIs y servicios backend",
      "Optimizar rendimiento de aplicaciones",
      "Realizar testing y debugging",
      "Colaborar con diseñadores UX/UI",
      "Mantener código limpio y documentado",
    ],
    postedDate: "2024-01-05",
    applicants: 23,
    remote: false,
    experience: "Mid-level (3-5 años)",
    companySize: "11-50 empleados",
    industry: "Desarrollo Móvil",
    skills: ["Swift", "Kotlin", "React Native", "iOS", "Android"],
    companyDescription:
      "AppFactory Chile es un estudio de desarrollo móvil especializado en crear aplicaciones innovadoras para startups y empresas establecidas.",
    workMode: "presencial",
  },
  {
    id: 6,
    title: "Backend Developer Python",
    company: "FinTech Innovations",
    location: "Santiago, Las Condes",
    type: "full-time",
    salary: "$2.000.000 - $2.600.000 CLP",
    description:
      "Únete a nuestro equipo de backend para desarrollar sistemas financieros robustos y escalables. Trabajarás con Python, Django y tecnologías modernas en el sector fintech más dinámico de Chile.",
    requirements: [
      "3+ años de experiencia con Python",
      "Experiencia con Django o FastAPI",
      "Conocimientos sólidos de bases de datos",
      "Experiencia con APIs REST",
      "Conocimientos de seguridad web",
      "Experiencia en sector financiero (deseable)",
    ],
    benefits: [
      "Bono de performance trimestral",
      "Seguro de salud premium",
      "Capacitación en fintech",
      "Stock options",
      "Trabajo híbrido",
      "Ambiente innovador",
    ],
    responsibilities: [
      "Desarrollar APIs robustas y seguras",
      "Implementar lógica de negocio compleja",
      "Optimizar consultas de base de datos",
      "Integrar servicios de terceros",
      "Mantener estándares de seguridad",
      "Colaborar con equipos frontend",
    ],
    postedDate: "2024-01-03",
    applicants: 41,
    remote: true,
    experience: "Mid-level (3-5 años)",
    companySize: "51-200 empleados",
    industry: "FinTech",
    skills: ["Python", "Django", "PostgreSQL", "Redis", "Docker"],
    companyDescription:
      "FinTech Innovations está revolucionando los servicios financieros en Chile con soluciones tecnológicas innovadoras y seguras.",
    workMode: "híbrido",
  },
]

export default function JobSearchPage() {
  const { t } = useLanguage()
  const [jobs, setJobs] = useState<Job[]>(mockJobs)
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [experienceFilter, setExperienceFilter] = useState("all")
  const [remoteFilter, setRemoteFilter] = useState("all")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [savedJobs, setSavedJobs] = useState<number[]>([])
  const [appliedJobs, setAppliedJobs] = useState<number[]>([])

  useEffect(() => {
    filterJobs()
  }, [searchTerm, locationFilter, typeFilter, experienceFilter, remoteFilter])

  const filterJobs = () => {
    let filtered = jobs

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(locationFilter.toLowerCase()))
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((job) => job.type === typeFilter)
    }

    if (experienceFilter !== "all") {
      filtered = filtered.filter((job) => job.experience.toLowerCase().includes(experienceFilter.toLowerCase()))
    }

    if (remoteFilter !== "all") {
      if (remoteFilter === "remote") {
        filtered = filtered.filter((job) => job.workMode === "remoto")
      } else if (remoteFilter === "hybrid") {
        filtered = filtered.filter((job) => job.workMode === "híbrido")
      } else if (remoteFilter === "onsite") {
        filtered = filtered.filter((job) => job.workMode === "presencial")
      }
    }

    setFilteredJobs(filtered)
  }

  const handleSaveJob = (jobId: number) => {
    setSavedJobs((prev) => {
      if (prev.includes(jobId)) {
        return prev.filter((id) => id !== jobId)
      } else {
        return [...prev, jobId]
      }
    })
  }

  const handleApplyJob = (jobId: number) => {
    setAppliedJobs((prev) => [...prev, jobId])
  }

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-green-100 text-green-800"
      case "part-time":
        return "bg-blue-100 text-blue-800"
      case "contract":
        return "bg-orange-100 text-orange-800"
      case "remote":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getWorkModeIcon = (workMode: string) => {
    switch (workMode) {
      case "remoto":
        return <Home className="w-4 h-4" />
      case "híbrido":
        return <Laptop className="w-4 h-4" />
      case "presencial":
        return <Building2 className="w-4 h-4" />
      default:
        return <Building2 className="w-4 h-4" />
    }
  }

  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Hace 1 día"
    if (diffDays < 7) return `Hace ${diffDays} días`
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
    return `Hace ${Math.floor(diffDays / 30)} meses`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Búsqueda de Empleos Tech</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Encuentra las mejores oportunidades laborales en tecnología en Chile. Empleos actualizados diariamente.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Buscar Empleos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por título, empresa o tecnología..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Ubicación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las ubicaciones</SelectItem>
                  <SelectItem value="santiago">Santiago</SelectItem>
                  <SelectItem value="las condes">Las Condes</SelectItem>
                  <SelectItem value="providencia">Providencia</SelectItem>
                  <SelectItem value="vitacura">Vitacura</SelectItem>
                  <SelectItem value="remoto">Remoto</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de empleo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="full-time">Tiempo completo</SelectItem>
                  <SelectItem value="part-time">Medio tiempo</SelectItem>
                  <SelectItem value="contract">Contrato</SelectItem>
                </SelectContent>
              </Select>

              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Experiencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los niveles</SelectItem>
                  <SelectItem value="junior">Junior (0-2 años)</SelectItem>
                  <SelectItem value="mid">Mid-level (3-5 años)</SelectItem>
                  <SelectItem value="senior">Senior (5+ años)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={remoteFilter} onValueChange={setRemoteFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Modalidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las modalidades</SelectItem>
                  <SelectItem value="remote">Remoto</SelectItem>
                  <SelectItem value="hybrid">Híbrido</SelectItem>
                  <SelectItem value="onsite">Presencial</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setLocationFilter("all")
                  setTypeFilter("all")
                  setExperienceFilter("all")
                  setRemoteFilter("all")
                }}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{filteredJobs.length} empleos encontrados</span>
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <BookmarkPlus className="w-4 h-4" />
                  <span>{savedJobs.length} guardados</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Send className="w-4 h-4" />
                  <span>{appliedJobs.length} postulaciones</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      {appliedJobs.includes(job.id) && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Postulado
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Building2 className="w-4 h-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getWorkModeIcon(job.workMode)}
                        <span className="capitalize">{job.workMode}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatPostedDate(job.postedDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600 mb-2">{job.salary}</div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getJobTypeColor(job.type)}>
                        {job.type === "full-time" && "Tiempo completo"}
                        {job.type === "part-time" && "Medio tiempo"}
                        {job.type === "contract" && "Contrato"}
                      </Badge>
                      <Badge variant="outline">{job.experience}</Badge>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.slice(0, 5).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {job.skills.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.skills.length - 5} más
                    </Badge>
                  )}
                </div>

                {/* Job Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{job.applicants} postulantes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Building2 className="w-4 h-4" />
                      <span>{job.companySize}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.industry}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedJob(job)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">{job.title}</DialogTitle>
                          <DialogDescription className="text-lg">
                            {job.company} • {job.location}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* Job Overview */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{job.salary}</div>
                              <div className="text-sm text-gray-600">Salario</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{job.applicants}</div>
                              <div className="text-sm text-gray-600">Postulantes</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600 capitalize">{job.workMode}</div>
                              <div className="text-sm text-gray-600">Modalidad</div>
                            </div>
                          </div>

                          {/* Company Info */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center">
                              <Building2 className="w-5 h-5 mr-2" />
                              Sobre la Empresa
                            </h3>
                            <p className="text-gray-700 mb-3">{job.companyDescription}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{job.companySize}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Target className="w-4 h-4" />
                                <span>{job.industry}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{job.location}</span>
                              </span>
                            </div>
                          </div>

                          <Separator />

                          {/* Job Description */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Descripción del Puesto</h3>
                            <p className="text-gray-700">{job.description}</p>
                          </div>

                          {/* Responsibilities */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center">
                              <CheckCircle className="w-5 h-5 mr-2" />
                              Responsabilidades
                            </h3>
                            <ul className="space-y-2">
                              {job.responsibilities.map((responsibility, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-gray-700">{responsibility}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Requirements */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center">
                              <Award className="w-5 h-5 mr-2" />
                              Requisitos
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {job.requirements.map((requirement, index) => (
                                <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-gray-700">{requirement}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Skills */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Tecnologías y Herramientas</h3>
                            <div className="flex flex-wrap gap-2">
                              {job.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="px-3 py-1">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Benefits */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center">
                              <Star className="w-5 h-5 mr-2" />
                              Beneficios
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {job.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg">
                                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-gray-700">{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Job Details */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                              <div className="text-sm text-gray-600">Tipo de Empleo</div>
                              <div className="font-medium capitalize">
                                {job.type === "full-time" && "Tiempo completo"}
                                {job.type === "part-time" && "Medio tiempo"}
                                {job.type === "contract" && "Contrato"}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Experiencia</div>
                              <div className="font-medium">{job.experience}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Modalidad</div>
                              <div className="font-medium capitalize">{job.workMode}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Publicado</div>
                              <div className="font-medium">{formatPostedDate(job.postedDate)}</div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between pt-4 border-t">
                            <Button
                              variant="outline"
                              onClick={() => handleSaveJob(job.id)}
                              className={savedJobs.includes(job.id) ? "bg-yellow-50 border-yellow-300" : ""}
                            >
                              <BookmarkPlus className="w-4 h-4 mr-2" />
                              {savedJobs.includes(job.id) ? "Guardado" : "Guardar Empleo"}
                            </Button>
                            <Button
                              onClick={() => handleApplyJob(job.id)}
                              disabled={appliedJobs.includes(job.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {appliedJobs.includes(job.id) ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Postulado
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-2" />
                                  Postular Ahora
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveJob(job.id)}
                      className={savedJobs.includes(job.id) ? "bg-yellow-50 border-yellow-300" : ""}
                    >
                      <Heart
                        className={`w-4 h-4 mr-2 ${savedJobs.includes(job.id) ? "fill-current text-yellow-600" : ""}`}
                      />
                      {savedJobs.includes(job.id) ? "Guardado" : "Guardar"}
                    </Button>
                  </div>

                  <Button
                    onClick={() => handleApplyJob(job.id)}
                    disabled={appliedJobs.includes(job.id)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {appliedJobs.includes(job.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Postulado
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Postular
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredJobs.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron empleos</h3>
              <p className="text-gray-600 mb-4">
                Intenta ajustar tus filtros de búsqueda o usar términos más generales.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setLocationFilter("all")
                  setTypeFilter("all")
                  setExperienceFilter("all")
                  setRemoteFilter("all")
                }}
              >
                Limpiar Filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
