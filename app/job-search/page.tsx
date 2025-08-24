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
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  Send,
  Eye,
  SlidersHorizontal,
  Award,
  Target,
  ExternalLink,
  TrendingUp,
  RefreshCw,
  Globe,
  Verified,
  AlertTriangle,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { ChileanJob } from "@/lib/chilean-job-data"

interface JobStats {
  totalJobs: number
  bySource: Record<string, number>
  byRegion: Record<string, number>
  byIndustry: Record<string, number>
  avgSalary: number
  lastUpdated: string
}

export default function JobSearchPage() {
  const { t } = useLanguage()
  const [jobs, setJobs] = useState<ChileanJob[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<JobStats | null>(null)
  const [selectedJob, setSelectedJob] = useState<ChileanJob | null>(null)
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [appliedJobs, setAppliedJobs] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalJobs, setTotalJobs] = useState(0)

  // Search filters
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [experienceFilter, setExperienceFilter] = useState("all")
  const [modalityFilter, setModalityFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [salaryMinFilter, setSalaryMinFilter] = useState("")
  const [salaryMaxFilter, setSalaryMaxFilter] = useState("")
  const [postedDaysFilter, setPostedDaysFilter] = useState("all")

  useEffect(() => {
    searchJobs()
    fetchStats()
  }, [currentPage])

  useEffect(() => {
    setCurrentPage(1)
    searchJobs()
  }, [
    searchTerm,
    locationFilter,
    regionFilter,
    typeFilter,
    experienceFilter,
    modalityFilter,
    industryFilter,
    salaryMinFilter,
    salaryMaxFilter,
    postedDaysFilter,
  ])

  const searchJobs = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()

      if (searchTerm) params.append("q", searchTerm)
      if (locationFilter !== "all") params.append("location", locationFilter)
      if (regionFilter !== "all") params.append("region", regionFilter)
      if (typeFilter !== "all") params.append("type", typeFilter)
      if (experienceFilter !== "all") params.append("experience", experienceFilter)
      if (modalityFilter !== "all") params.append("modality", modalityFilter)
      if (industryFilter !== "all") params.append("industry", industryFilter)
      if (salaryMinFilter) params.append("salary_min", salaryMinFilter)
      if (salaryMaxFilter) params.append("salary_max", salaryMaxFilter)
      if (postedDaysFilter !== "all") params.append("posted_days", postedDaysFilter)

      params.append("page", currentPage.toString())
      params.append("limit", "20")

      const response = await fetch(`/api/jobs/search?${params}`)

      if (!response.ok) {
        throw new Error("Error al buscar empleos")
      }

      const data = await response.json()
      setJobs(data.jobs || [])
      setTotalJobs(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error("Error searching jobs:", error)
      setError("Error al cargar los empleos. Por favor, intenta nuevamente.")
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/jobs/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      if (prev.includes(jobId)) {
        return prev.filter((id) => id !== jobId)
      } else {
        return [...prev, jobId]
      }
    })
  }

  const handleApplyJob = (jobId: string, applicationUrl: string) => {
    setAppliedJobs((prev) => [...prev, jobId])
    window.open(applicationUrl, "_blank")
  }

  const clearFilters = () => {
    setSearchTerm("")
    setLocationFilter("all")
    setRegionFilter("all")
    setTypeFilter("all")
    setExperienceFilter("all")
    setModalityFilter("all")
    setIndustryFilter("all")
    setSalaryMinFilter("")
    setSalaryMaxFilter("")
    setPostedDaysFilter("all")
    setCurrentPage(1)
  }

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-green-100 text-green-800"
      case "part-time":
        return "bg-blue-100 text-blue-800"
      case "contract":
        return "bg-orange-100 text-orange-800"
      case "internship":
        return "bg-purple-100 text-purple-800"
      case "freelance":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getModalityIcon = (modality: string) => {
    switch (modality) {
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

  const getSourceBadge = (source: string) => {
    const sourceMap = {
      trabajando: { name: "Trabajando.com", color: "bg-blue-100 text-blue-800" },
      getonboard: { name: "GetOnBoard", color: "bg-green-100 text-green-800" },
      laborum: { name: "Laborum", color: "bg-purple-100 text-purple-800" },
      computrabajo: { name: "CompuTrabajo", color: "bg-orange-100 text-orange-800" },
      "indeed-chile": { name: "Indeed Chile", color: "bg-red-100 text-red-800" },
    }

    const sourceInfo = sourceMap[source as keyof typeof sourceMap] || {
      name: source,
      color: "bg-gray-100 text-gray-800",
    }

    return (
      <Badge className={sourceInfo.color} variant="secondary">
        <Globe className="w-3 h-3 mr-1" />
        {sourceInfo.name}
      </Badge>
    )
  }

  const formatSalary = (job: ChileanJob) => {
    if (job.salary) return job.salary
    if (job.salaryMin && job.salaryMax) {
      return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()} ${job.currency}`
    }
    if (job.salaryMin) {
      return `Desde $${job.salaryMin.toLocaleString()} ${job.currency}`
    }
    return "Salario a convenir"
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

  const getExperienceLabel = (experience: string) => {
    const labels = {
      "sin-experiencia": "Sin experiencia",
      junior: "Junior (0-2 años)",
      "semi-senior": "Semi-Senior (3-5 años)",
      senior: "Senior (5+ años)",
      gerencial: "Gerencial/Ejecutivo",
    }
    return labels[experience as keyof typeof labels] || experience
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      "full-time": "Tiempo completo",
      "part-time": "Medio tiempo",
      contract: "Contrato",
      internship: "Práctica",
      freelance: "Freelance",
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Búsqueda de Empleos en Chile</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Encuentra las mejores oportunidades laborales en Chile. Empleos de empresas líderes como Banco de Chile,
            NotCo, Fintual y más.
          </p>
          {stats && (
            <div className="flex justify-center items-center space-x-6 mt-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>{(stats?.totalJobs || 0).toLocaleString()} empleos disponibles</span>
              </div>
              <div className="flex items-center space-x-1">
                <RefreshCw className="w-4 h-4" />
                <span>Actualizado: {new Date(stats.lastUpdated).toLocaleDateString("es-CL")}</span>
              </div>
              {(stats?.avgSalary || 0) > 0 && (
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>Salario promedio: ${(stats?.avgSalary || 0).toLocaleString()} CLP</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Buscar Empleos</span>
              <Badge variant="outline" className="ml-auto">
                Empresas chilenas verificadas
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por título, empresa, tecnología o habilidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Región" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las regiones</SelectItem>
                  <SelectItem value="Metropolitana">Metropolitana</SelectItem>
                  <SelectItem value="Valparaíso">Valparaíso</SelectItem>
                  <SelectItem value="Biobío">Biobío</SelectItem>
                  <SelectItem value="Coquimbo">Coquimbo</SelectItem>
                  <SelectItem value="Antofagasta">Antofagasta</SelectItem>
                  <SelectItem value="La Araucanía">La Araucanía</SelectItem>
                  <SelectItem value="O'Higgins">O'Higgins</SelectItem>
                  <SelectItem value="Maule">Maule</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Comuna" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las comunas</SelectItem>
                  <SelectItem value="Santiago">Santiago</SelectItem>
                  <SelectItem value="Las Condes">Las Condes</SelectItem>
                  <SelectItem value="Providencia">Providencia</SelectItem>
                  <SelectItem value="Vitacura">Vitacura</SelectItem>
                  <SelectItem value="Ñuñoa">Ñuñoa</SelectItem>
                  <SelectItem value="Concepción">Concepción</SelectItem>
                  <SelectItem value="Valparaíso">Valparaíso</SelectItem>
                  <SelectItem value="Viña del Mar">Viña del Mar</SelectItem>
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
                  <SelectItem value="internship">Práctica</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Experiencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los niveles</SelectItem>
                  <SelectItem value="sin-experiencia">Sin experiencia</SelectItem>
                  <SelectItem value="junior">Junior (0-2 años)</SelectItem>
                  <SelectItem value="semi-senior">Semi-Senior (3-5 años)</SelectItem>
                  <SelectItem value="senior">Senior (5+ años)</SelectItem>
                  <SelectItem value="gerencial">Gerencial/Ejecutivo</SelectItem>
                </SelectContent>
              </Select>

              <Select value={modalityFilter} onValueChange={setModalityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Modalidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las modalidades</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="remoto">Remoto</SelectItem>
                  <SelectItem value="híbrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>

              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Industria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las industrias</SelectItem>
                  <SelectItem value="Tecnología">Tecnología</SelectItem>
                  <SelectItem value="Servicios Financieros">Servicios Financieros</SelectItem>
                  <SelectItem value="FinTech">FinTech</SelectItem>
                  <SelectItem value="FoodTech">FoodTech</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Telecomunicaciones">Telecomunicaciones</SelectItem>
                  <SelectItem value="Minería">Minería</SelectItem>
                  <SelectItem value="Educación">Educación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Salario mínimo (CLP)</label>
                <Input
                  type="number"
                  placeholder="Ej: 1500000"
                  value={salaryMinFilter}
                  onChange={(e) => setSalaryMinFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Salario máximo (CLP)</label>
                <Input
                  type="number"
                  placeholder="Ej: 3000000"
                  value={salaryMaxFilter}
                  onChange={(e) => setSalaryMaxFilter(e.target.value)}
                />
              </div>
            </div>

            {/* Posted Date Filter */}
            <Select value={postedDaysFilter} onValueChange={setPostedDaysFilter}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Publicado en los últimos..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cualquier fecha</SelectItem>
                <SelectItem value="1">Último día</SelectItem>
                <SelectItem value="7">Última semana</SelectItem>
                <SelectItem value="30">Último mes</SelectItem>
                <SelectItem value="90">Últimos 3 meses</SelectItem>
              </SelectContent>
            </Select>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={searchJobs} disabled={loading} className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>{loading ? "Buscando..." : "Buscar Empleos"}</span>
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {!loading && (
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-gray-600">
                {(totalJobs || 0) > 0 ? (
                  <span>
                    Mostrando {jobs.length} de {(totalJobs || 0).toLocaleString()} empleos encontrados
                  </span>
                ) : (
                  <span>No se encontraron empleos con los filtros seleccionados</span>
                )}
              </div>
              {stats && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stats.bySource).map(([source, count]) => (
                    <Badge key={source} variant="outline" className="text-xs">
                      {source}: {count}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Job Results */}
        {!loading && jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Job Info */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Building2 className="w-4 h-4" />
                            <span className="font-medium">{job.company}</span>
                            {job.verified && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <Verified className="w-3 h-3 mr-1" />
                                Verificada
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {job.isUrgent && (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Urgente
                            </Badge>
                          )}
                          {getSourceBadge(job.source)}
                        </div>
                      </div>

                      {/* Location and Details */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getModalityIcon(job.modality)}
                          <span className="capitalize">{job.modality}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatPostedDate(job.postedDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{getExperienceLabel(job.experience)}</span>
                        </div>
                      </div>

                      {/* Salary and Type */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={getJobTypeColor(job.type)}>{getTypeLabel(job.type)}</Badge>
                        <Badge variant="outline">{job.industry}</Badge>
                        <Badge variant="outline" className="font-semibold">
                          {formatSalary(job)}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 line-clamp-2">{job.description}</p>

                      {/* Skills */}
                      {job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {job.skills.slice(0, 6).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 6 && (
                            <Badge variant="secondary" className="text-xs">
                              +{job.skills.length - 6} más
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 lg:w-48">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => setSelectedJob(job)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                              <span>{job.title}</span>
                              <div className="flex items-center space-x-2">
                                {job.verified && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    <Verified className="w-3 h-3 mr-1" />
                                    Verificada
                                  </Badge>
                                )}
                                {getSourceBadge(job.source)}
                              </div>
                            </DialogTitle>
                            <DialogDescription>
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="font-medium">{job.company}</span>
                                <span>•</span>
                                <span>{job.location}</span>
                                <span>•</span>
                                <span>{formatPostedDate(job.postedDate)}</span>
                              </div>
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-6">
                            {/* Job Overview */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900">Salario</h4>
                                <p className="text-sm text-gray-600">{formatSalary(job)}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">Tipo</h4>
                                <p className="text-sm text-gray-600">{getTypeLabel(job.type)}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">Modalidad</h4>
                                <p className="text-sm text-gray-600 capitalize">{job.modality}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">Experiencia</h4>
                                <p className="text-sm text-gray-600">{getExperienceLabel(job.experience)}</p>
                              </div>
                            </div>

                            <Separator />

                            {/* Company Description */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Sobre la empresa</h4>
                              <p className="text-sm text-gray-600">{job.companyDescription}</p>
                            </div>

                            <Separator />

                            {/* Job Description */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Descripción del puesto</h4>
                              <p className="text-sm text-gray-600">{job.description}</p>
                            </div>

                            {/* Responsibilities */}
                            {job.responsibilities.length > 0 && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Responsabilidades</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {job.responsibilities.map((responsibility, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <span>{responsibility}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Requirements */}
                            {job.requirements.length > 0 && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Requisitos</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {job.requirements.map((requirement, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                      <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                      <span>{requirement}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Benefits */}
                            {job.benefits.length > 0 && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Beneficios</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {job.benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                      <span>{benefit}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Skills */}
                            {job.skills.length > 0 && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Habilidades requeridas</h4>
                                <div className="flex flex-wrap gap-2">
                                  {job.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex space-x-3 pt-4">
                              <Button
                                onClick={() => handleApplyJob(job.id, job.applicationUrl)}
                                className="flex-1"
                                disabled={appliedJobs.includes(job.id)}
                              >
                                {appliedJobs.includes(job.id) ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Aplicado
                                  </>
                                ) : (
                                  <>
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Aplicar en {job.source}
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleSaveJob(job.id)}
                                className={savedJobs.includes(job.id) ? "bg-red-50 text-red-600" : ""}
                              >
                                <Heart className={`w-4 h-4 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        onClick={() => handleApplyJob(job.id, job.applicationUrl)}
                        disabled={appliedJobs.includes(job.id)}
                        className="w-full"
                      >
                        {appliedJobs.includes(job.id) ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Aplicado
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Aplicar
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleSaveJob(job.id)}
                        className={`w-full ${savedJobs.includes(job.id) ? "bg-red-50 text-red-600" : ""}`}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                        {savedJobs.includes(job.id) ? "Guardado" : "Guardar"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron empleos</h3>
              <p className="text-gray-600 mb-4">
                Intenta ajustar tus filtros de búsqueda o busca términos más generales.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Limpiar todos los filtros
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Summary */}
        {stats && !loading && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Estadísticas del Mercado Laboral Chileno</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Por Portal</h4>
                  <div className="space-y-1">
                    {Object.entries(stats.bySource).map(([source, count]) => (
                      <div key={source} className="flex justify-between text-sm">
                        <span className="capitalize">{source}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Por Región</h4>
                  <div className="space-y-1">
                    {Object.entries(stats.byRegion)
                      .slice(0, 5)
                      .map(([region, count]) => (
                        <div key={region} className="flex justify-between text-sm">
                          <span>{region}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Por Industria</h4>
                  <div className="space-y-1">
                    {Object.entries(stats.byIndustry)
                      .slice(0, 5)
                      .map(([industry, count]) => (
                        <div key={industry} className="flex justify-between text-sm">
                          <span>{industry}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
