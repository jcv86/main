"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  GraduationCap,
  Search,
  Filter,
  MapPin,
  Clock,
  TrendingUp,
  DollarSign,
  Users,
  BookOpen,
  Briefcase,
} from "lucide-react"
import { uddCareers, searchCareers, type UDDCareer } from "@/lib/udd-careers"

export default function UDDCareersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFaculty, setSelectedFaculty] = useState<string>("all")
  const [selectedCampus, setSelectedCampus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [selectedCareer, setSelectedCareer] = useState<UDDCareer | null>(null)

  const faculties = Array.from(new Set(uddCareers.map((career) => career.faculty)))
  const campuses = Array.from(new Set(uddCareers.flatMap((career) => career.campus)))

  const filteredAndSortedCareers = useMemo(() => {
    let filtered = uddCareers

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchCareers(searchQuery)
    }

    // Apply faculty filter
    if (selectedFaculty !== "all") {
      filtered = filtered.filter((career) => career.faculty === selectedFaculty)
    }

    // Apply campus filter
    if (selectedCampus !== "all") {
      filtered = filtered.filter((career) => career.campus.includes(selectedCampus))
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "employability":
          return b.employabilityRate - a.employabilityRate
        case "salary":
          return b.averageSalary.entry - a.averageSalary.entry
        case "duration":
          return a.duration - b.duration
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [searchQuery, selectedFaculty, selectedCampus, sortBy])

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const stats = {
    totalCareers: uddCareers.length,
    averageEmployability: Math.round(
      uddCareers.reduce((acc, career) => acc + career.employabilityRate, 0) / uddCareers.length,
    ),
    averageDuration:
      Math.round((uddCareers.reduce((acc, career) => acc + career.duration, 0) / uddCareers.length) * 10) / 10,
    totalCampuses: campuses.length,
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Carreras UDD</h1>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            🇨🇱 Universidad del Desarrollo
          </Badge>
        </div>
        <p className="text-gray-600">
          Explora todas las carreras disponibles en la Universidad del Desarrollo y encuentra la que mejor se adapte a
          tu perfil.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Carreras</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCareers}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Empleabilidad Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageEmployability}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Duración Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageDuration} años</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Campus Disponibles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCampuses}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Buscar y Filtrar Carreras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar carreras..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
              <SelectTrigger>
                <SelectValue placeholder="Facultad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Facultades</SelectItem>
                {faculties.map((faculty) => (
                  <SelectItem key={faculty} value={faculty}>
                    {faculty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCampus} onValueChange={setSelectedCampus}>
              <SelectTrigger>
                <SelectValue placeholder="Campus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Campus</SelectItem>
                {campuses.map((campus) => (
                  <SelectItem key={campus} value={campus}>
                    {campus}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="employability">Empleabilidad</SelectItem>
                <SelectItem value="salary">Salario</SelectItem>
                <SelectItem value="duration">Duración</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {filteredAndSortedCareers.length} carrera{filteredAndSortedCareers.length !== 1 ? "s" : ""} encontrada
          {filteredAndSortedCareers.length !== 1 ? "s" : ""}
        </h2>
      </div>

      {/* Careers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedCareers.map((career) => (
          <Card key={career.id} className="h-full hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{career.name}</CardTitle>
                  <CardDescription className="text-sm">{career.faculty}</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  {career.employabilityRate}% empleabilidad
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">{career.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{career.duration} años</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span>{career.campus.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                  <span>{formatSalary(career.averageSalary.entry)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>{career.jobOpportunities.length} salidas</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Habilidades principales:</div>
                <div className="flex flex-wrap gap-1">
                  {career.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {career.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{career.skills.length - 3} más
                    </Badge>
                  )}
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setSelectedCareer(career)}>
                    Ver Detalles Completos
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      {career.name}
                    </DialogTitle>
                    <DialogDescription>{career.faculty}</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Overview */}
                    <div>
                      <h3 className="font-semibold mb-2">Descripción</h3>
                      <p className="text-gray-600">{career.description}</p>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Clock className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                        <div className="font-semibold">{career.duration} años</div>
                        <div className="text-xs text-gray-600">Duración</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" />
                        <div className="font-semibold">{career.employabilityRate}%</div>
                        <div className="text-xs text-gray-600">Empleabilidad</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <MapPin className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                        <div className="font-semibold">{career.campus.length}</div>
                        <div className="text-xs text-gray-600">Campus</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <Users className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                        <div className="font-semibold">{career.jobOpportunities.length}</div>
                        <div className="text-xs text-gray-600">Salidas laborales</div>
                      </div>
                    </div>

                    {/* Salary Progression */}
                    <div>
                      <h3 className="font-semibold mb-3">Proyección Salarial</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Recién egresado</span>
                          <span className="font-semibold">{formatSalary(career.averageSalary.entry)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">5-10 años experiencia</span>
                          <span className="font-semibold">{formatSalary(career.averageSalary.mid)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Senior (10+ años)</span>
                          <span className="font-semibold">{formatSalary(career.averageSalary.senior)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Admission Requirements */}
                    <div>
                      <h3 className="font-semibold mb-3">Requisitos de Admisión</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 border rounded-lg">
                          <div className="font-semibold text-lg">{career.admissionRequirements.psu}</div>
                          <div className="text-xs text-gray-600">PSU/PAES</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className="font-semibold text-lg">{career.admissionRequirements.ranking}%</div>
                          <div className="text-xs text-gray-600">Ranking</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className="font-semibold text-lg">{career.admissionRequirements.nem}</div>
                          <div className="text-xs text-gray-600">NEM</div>
                        </div>
                      </div>
                    </div>

                    {/* Curriculum */}
                    <div>
                      <h3 className="font-semibold mb-3">Plan de Estudios</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2 text-blue-600">Ciencias Básicas</h4>
                          <ul className="text-sm space-y-1">
                            {career.curriculum.basicSciences.map((subject) => (
                              <li key={subject} className="text-gray-600">
                                • {subject}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-2 text-green-600">Especialidad</h4>
                          <ul className="text-sm space-y-1">
                            {career.curriculum.specialty.map((subject) => (
                              <li key={subject} className="text-gray-600">
                                • {subject}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-2 text-purple-600">Electivos</h4>
                          <ul className="text-sm space-y-1">
                            {career.curriculum.electives.map((subject) => (
                              <li key={subject} className="text-gray-600">
                                • {subject}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="font-semibold mb-3">Habilidades que Desarrollarás</h3>
                      <div className="flex flex-wrap gap-2">
                        {career.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Job Opportunities */}
                    <div>
                      <h3 className="font-semibold mb-3">Oportunidades Laborales</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {career.jobOpportunities.map((job) => (
                          <div key={job} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <Briefcase className="w-4 h-4 text-gray-600" />
                            <span className="text-sm">{job}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Campus Information */}
                    <div>
                      <h3 className="font-semibold mb-3">Campus Disponibles</h3>
                      <div className="flex gap-2">
                        {career.campus.map((campus) => (
                          <Badge key={campus} variant="outline" className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {campus}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedCareers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron carreras</h3>
            <p className="text-gray-600 mb-4">Intenta ajustar tus filtros de búsqueda para encontrar más resultados.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedFaculty("all")
                setSelectedCampus("all")
                setSortBy("name")
              }}
            >
              Limpiar Filtros
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
