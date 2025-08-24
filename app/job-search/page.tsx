"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { JobAlertDialog } from "@/components/job-alert-dialog"
import {
  Search,
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Filter,
  BookmarkPlus,
  ExternalLink,
  TrendingUp,
  Users,
  Star,
  AlertCircle,
  Briefcase,
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary?: string
  type: string
  experience: string
  description: string
  requirements: string[]
  benefits: string[]
  postedDate: string
  source: string
  url?: string
  isRemote: boolean
  isFeatured?: boolean
}

interface JobStats {
  totalJobs: number
  newJobsToday: number
  averageSalary: number
  topCompanies: string[]
  popularSkills: string[]
  remoteJobs: number
}

interface SearchFilters {
  query: string
  location: string
  jobType: string
  experienceLevel: string
  salaryRange: string
  isRemote: boolean
  company: string
}

export default function JobSearchPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [stats, setStats] = useState<JobStats>({
    totalJobs: 0,
    newJobsToday: 0,
    averageSalary: 0,
    topCompanies: [],
    popularSkills: [],
    remoteJobs: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: "",
    location: "",
    jobType: "",
    experienceLevel: "",
    salaryRange: "",
    isRemote: false,
    company: "",
  })
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalJobs, setTotalJobs] = useState(0)
  const jobsPerPage = 10

  // Load jobs and stats
  useEffect(() => {
    loadJobs()
    loadJobStats()
  }, [])

  // Filter jobs when search filters change
  useEffect(() => {
    filterJobs()
  }, [jobs, searchFilters])

  const loadJobs = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        query: searchFilters.query,
        location: searchFilters.location,
        ...(searchFilters.jobType && { employment_type: searchFilters.jobType }),
        ...(searchFilters.experienceLevel && { experience_level: searchFilters.experienceLevel }),
        ...(searchFilters.company && { company: searchFilters.company }),
        ...(searchFilters.isRemote && { remote_work: "true" }),
      })

      const response = await fetch(`/api/jobs/search?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Error al cargar empleos")
      }

      const data = await response.json()
      setJobs(data.jobs || [])
      setTotalJobs(data.total || 0)
    } catch (error) {
      console.error("Error loading jobs:", error)
      toast.error("Error al cargar los empleos")
      // Set default empty state
      setJobs([])
      setTotalJobs(0)
    } finally {
      setIsLoading(false)
    }
  }

  const loadJobStats = async () => {
    try {
      const response = await fetch("/api/jobs/stats")
      if (!response.ok) {
        throw new Error("Error al cargar estadísticas")
      }

      const data = await response.json()
      setStats({
        totalJobs: data.totalJobs || 0,
        newJobsToday: data.newJobsToday || 0,
        averageSalary: data.averageSalary || 0,
        topCompanies: data.topCompanies || [],
        popularSkills: data.popularSkills || [],
        remoteJobs: data.remoteJobs || 0,
      })
    } catch (error) {
      console.error("Error loading job stats:", error)
      // Keep default stats state
    }
  }

  const filterJobs = () => {
    let filtered = jobs

    if (searchFilters.query) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
          job.company.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
          job.description.toLowerCase().includes(searchFilters.query.toLowerCase()),
      )
    }

    if (searchFilters.location) {
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(searchFilters.location.toLowerCase()))
    }

    if (searchFilters.jobType) {
      filtered = filtered.filter((job) => job.type === searchFilters.jobType)
    }

    if (searchFilters.experienceLevel) {
      filtered = filtered.filter((job) => job.experience === searchFilters.experienceLevel)
    }

    if (searchFilters.isRemote) {
      filtered = filtered.filter((job) => job.isRemote)
    }

    if (searchFilters.company) {
      filtered = filtered.filter((job) => job.company.toLowerCase().includes(searchFilters.company.toLowerCase()))
    }

    setFilteredJobs(filtered)
    setCurrentPage(1)
  }

  const handleSearch = () => {
    loadJobs()
  }

  const handleSaveJob = (jobId: string) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter((id) => id !== jobId))
      toast.success("Empleo removido de guardados")
    } else {
      setSavedJobs([...savedJobs, jobId])
      toast.success("Empleo guardado exitosamente")
    }
  }

  const handleApplyJob = (job: Job) => {
    if (job.url) {
      window.open(job.url, "_blank")
    }
    toast.success(`Aplicando a ${job.title} en ${job.company}`)
  }

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
  const startIndex = (currentPage - 1) * jobsPerPage
  const endIndex = startIndex + jobsPerPage
  const currentJobs = filteredJobs.slice(startIndex, endIndex)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Búsqueda de Empleos</h1>
            <p className="text-muted-foreground">Encuentra oportunidades laborales en el mercado chileno</p>
          </div>
          <JobAlertDialog />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Empleos</p>
                  <p className="text-2xl font-bold">{(stats?.totalJobs || 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Nuevos Hoy</p>
                  <p className="text-2xl font-bold">{(stats?.newJobsToday || 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Salario Promedio</p>
                  <p className="text-2xl font-bold">${(stats?.averageSalary || 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Trabajo Remoto</p>
                  <p className="text-2xl font-bold">{(stats?.remoteJobs || 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Búsqueda</label>
              <Input
                placeholder="Título, empresa, habilidades..."
                value={searchFilters.query}
                onChange={(e) => setSearchFilters({ ...searchFilters, query: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Ubicación</label>
              <Input
                placeholder="Santiago, Valparaíso..."
                value={searchFilters.location}
                onChange={(e) => setSearchFilters({ ...searchFilters, location: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tipo de Trabajo</label>
              <Select
                value={searchFilters.jobType}
                onValueChange={(value) => setSearchFilters({ ...searchFilters, jobType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="full-time">Tiempo Completo</SelectItem>
                  <SelectItem value="part-time">Medio Tiempo</SelectItem>
                  <SelectItem value="contract">Contrato</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Experiencia</label>
              <Select
                value={searchFilters.experienceLevel}
                onValueChange={(value) => setSearchFilters({ ...searchFilters, experienceLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nivel de experiencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="entry">Junior (0-2 años)</SelectItem>
                  <SelectItem value="mid">Semi-Senior (2-5 años)</SelectItem>
                  <SelectItem value="senior">Senior (5+ años)</SelectItem>
                  <SelectItem value="lead">Lead/Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Empresa</label>
              <Input
                placeholder="Nombre de la empresa"
                value={searchFilters.company}
                onChange={(e) => setSearchFilters({ ...searchFilters, company: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remote"
                checked={searchFilters.isRemote}
                onChange={(e) => setSearchFilters({ ...searchFilters, isRemote: e.target.checked })}
              />
              <label htmlFor="remote" className="text-sm font-medium">
                Solo trabajo remoto
              </label>
            </div>

            <Button onClick={handleSearch} className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Buscar Empleos
            </Button>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {currentJobs.length} de {filteredJobs.length} empleos
              {searchFilters.query && ` para "${searchFilters.query}"`}
            </p>
            <Select defaultValue="relevance">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Más Relevantes</SelectItem>
                <SelectItem value="date">Más Recientes</SelectItem>
                <SelectItem value="salary">Mejor Salario</SelectItem>
                <SelectItem value="company">Por Empresa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job Listings */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : currentJobs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron empleos</h3>
                <p className="text-muted-foreground mb-4">
                  Intenta ajustar tus filtros de búsqueda o buscar términos diferentes.
                </p>
                <Button
                  onClick={() =>
                    setSearchFilters({
                      query: "",
                      location: "",
                      jobType: "",
                      experienceLevel: "",
                      salaryRange: "",
                      isRemote: false,
                      company: "",
                    })
                  }
                >
                  Limpiar Filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {currentJobs.map((job) => (
                <Card
                  key={job.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedJob?.id === job.id ? "ring-2 ring-primary" : ""
                  } ${job.isFeatured ? "border-yellow-200 bg-yellow-50/50" : ""}`}
                  onClick={() => setSelectedJob(job)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          {job.isFeatured && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1" />
                              Destacado
                            </Badge>
                          )}
                          {job.isRemote && <Badge variant="outline">Remoto</Badge>}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {job.company}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.postedDate}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{job.type}</Badge>
                          <Badge variant="outline">{job.experience}</Badge>
                          {job.salary && (
                            <Badge variant="outline" className="text-green-600">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {job.salary}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSaveJob(job.id)
                          }}
                        >
                          <BookmarkPlus className={`h-4 w-4 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleApplyJob(job)
                          }}
                        >
                          Aplicar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>

              <div className="flex items-center space-x-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Job Details Modal/Sidebar */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{selectedJob.title}</CardTitle>
                <p className="text-muted-foreground">
                  {selectedJob.company} • {selectedJob.location}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedJob(null)}>
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Descripción</h4>
                    <p className="text-sm text-muted-foreground">{selectedJob.description}</p>
                  </div>

                  {selectedJob.requirements.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Requisitos</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {selectedJob.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedJob.benefits.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Beneficios</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {selectedJob.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-4">
                    <Badge variant="secondary">{selectedJob.type}</Badge>
                    <Badge variant="outline">{selectedJob.experience}</Badge>
                    {selectedJob.isRemote && <Badge variant="outline">Remoto</Badge>}
                    {selectedJob.salary && (
                      <Badge variant="outline" className="text-green-600">
                        {selectedJob.salary}
                      </Badge>
                    )}
                  </div>
                </div>
              </ScrollArea>

              <Separator />

              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => handleApplyJob(selectedJob)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Aplicar Ahora
                </Button>
                <Button variant="outline" onClick={() => handleSaveJob(selectedJob.id)}>
                  <BookmarkPlus className={`h-4 w-4 ${savedJobs.includes(selectedJob.id) ? "fill-current" : ""}`} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
