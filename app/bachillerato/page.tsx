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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  School,
  Search,
  Filter,
  Clock,
  TrendingUp,
  DollarSign,
  BookOpen,
  Briefcase,
  GraduationCap,
  Star,
  Building,
  Lightbulb,
} from "lucide-react"
import { bachilleratos, searchBachilleratos, type Bachillerato } from "@/lib/bachillerato-data"

export default function BachilleratoPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [selectedModalidad, setSelectedModalidad] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [selectedBachillerato, setSelectedBachillerato] = useState<Bachillerato | null>(null)

  const areas = Array.from(new Set(bachilleratos.map((bach) => bach.area)))
  const modalidades = Array.from(new Set(bachilleratos.map((bach) => bach.modalidad)))

  const filteredAndSortedBachilleratos = useMemo(() => {
    let filtered = bachilleratos

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchBachilleratos(searchQuery)
    }

    // Apply area filter
    if (selectedArea !== "all") {
      filtered = filtered.filter((bach) => bach.area === selectedArea)
    }

    // Apply modalidad filter
    if (selectedModalidad !== "all") {
      filtered = filtered.filter((bach) => bach.modalidad === selectedModalidad)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "employability":
          return b.empleabilidad - a.empleabilidad
        case "continuity":
          return b.continuidadEducativa - a.continuidadEducativa
        case "duration":
          return a.duracion - b.duracion
        case "name":
        default:
          return a.nombre.localeCompare(b.nombre)
      }
    })

    return filtered
  }, [searchQuery, selectedArea, selectedModalidad, sortBy])

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const stats = {
    totalBachilleratos: bachilleratos.length,
    averageEmployability: Math.round(
      bachilleratos.reduce((acc, bach) => acc + bach.empleabilidad, 0) / bachilleratos.length,
    ),
    averageContinuity: Math.round(
      bachilleratos.reduce((acc, bach) => acc + bach.continuidadEducativa, 0) / bachilleratos.length,
    ),
    averageDuration:
      Math.round((bachilleratos.reduce((acc, bach) => acc + bach.duracion, 0) / bachilleratos.length) * 10) / 10,
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <School className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Bachilleratos en Chile</h1>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            🇨🇱 Educación Media
          </Badge>
        </div>
        <p className="text-gray-600">
          Explora las opciones de bachillerato disponibles en Chile y encuentra el camino educativo que mejor se adapte
          a tus intereses y metas profesionales.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bachilleratos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBachilleratos}</p>
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
                <p className="text-sm font-medium text-gray-600">Continuidad Educativa</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageContinuity}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <GraduationCap className="w-6 h-6 text-purple-600" />
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
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
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
            Buscar y Filtrar Bachilleratos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar bachilleratos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger>
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Áreas</SelectItem>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedModalidad} onValueChange={setSelectedModalidad}>
              <SelectTrigger>
                <SelectValue placeholder="Modalidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Modalidades</SelectItem>
                {modalidades.map((modalidad) => (
                  <SelectItem key={modalidad} value={modalidad}>
                    {modalidad}
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
                <SelectItem value="continuity">Continuidad Educativa</SelectItem>
                <SelectItem value="duration">Duración</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {filteredAndSortedBachilleratos.length} bachillerato{filteredAndSortedBachilleratos.length !== 1 ? "s" : ""}{" "}
          encontrado
          {filteredAndSortedBachilleratos.length !== 1 ? "s" : ""}
        </h2>
      </div>

      {/* Bachilleratos Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedBachilleratos.map((bachillerato) => (
          <Card key={bachillerato.id} className="h-full hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{bachillerato.nombre}</CardTitle>
                  <CardDescription className="text-sm">{bachillerato.area}</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  {bachillerato.empleabilidad}% empleabilidad
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">{bachillerato.descripcion}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{bachillerato.duracion} años</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-green-600" />
                  <span>{bachillerato.modalidad}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  <span>{bachillerato.continuidadEducativa}% continúa</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                  <span>{formatSalary(bachillerato.salarioPromedio)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Habilidades principales:</div>
                <div className="flex flex-wrap gap-1">
                  {bachillerato.habilidades.slice(0, 3).map((habilidad) => (
                    <Badge key={habilidad} variant="outline" className="text-xs">
                      {habilidad}
                    </Badge>
                  ))}
                  {bachillerato.habilidades.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{bachillerato.habilidades.length - 3} más
                    </Badge>
                  )}
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setSelectedBachillerato(bachillerato)}
                  >
                    Ver Detalles Completos
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <School className="w-5 h-5 text-blue-600" />
                      {bachillerato.nombre}
                    </DialogTitle>
                    <DialogDescription>
                      {bachillerato.area} - {bachillerato.modalidad}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Overview */}
                    <div>
                      <h3 className="font-semibold mb-2">Descripción</h3>
                      <p className="text-gray-600">{bachillerato.descripcion}</p>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Clock className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                        <div className="font-semibold">{bachillerato.duracion} años</div>
                        <div className="text-xs text-gray-600">Duración</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" />
                        <div className="font-semibold">{bachillerato.empleabilidad}%</div>
                        <div className="text-xs text-gray-600">Empleabilidad</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                        <div className="font-semibold">{bachillerato.continuidadEducativa}%</div>
                        <div className="text-xs text-gray-600">Continúa estudios</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <DollarSign className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                        <div className="font-semibold">{formatSalary(bachillerato.salarioPromedio)}</div>
                        <div className="text-xs text-gray-600">Salario promedio</div>
                      </div>
                    </div>

                    {/* Plan de Estudios */}
                    <div>
                      <h3 className="font-semibold mb-3">Plan de Estudios</h3>
                      <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="general">Formación General</TabsTrigger>
                          <TabsTrigger value="especialidad">Especialidad</TabsTrigger>
                          <TabsTrigger value="electivos">Electivos</TabsTrigger>
                        </TabsList>

                        <TabsContent value="general" className="mt-4">
                          <div className="grid md:grid-cols-2 gap-3">
                            {bachillerato.planEstudios.formacionGeneral.map((materia) => (
                              <div key={materia} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                <span className="text-sm">{materia}</span>
                              </div>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="especialidad" className="mt-4">
                          <div className="grid md:grid-cols-2 gap-3">
                            {bachillerato.planEstudios.especialidad.map((materia) => (
                              <div key={materia} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                                <Star className="w-4 h-4 text-green-600" />
                                <span className="text-sm">{materia}</span>
                              </div>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="electivos" className="mt-4">
                          <div className="grid md:grid-cols-2 gap-3">
                            {bachillerato.planEstudios.electivos.map((materia) => (
                              <div key={materia} className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                                <Lightbulb className="w-4 h-4 text-purple-600" />
                                <span className="text-sm">{materia}</span>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    {/* Habilidades */}
                    <div>
                      <h3 className="font-semibold mb-3">Habilidades que Desarrollarás</h3>
                      <div className="flex flex-wrap gap-2">
                        {bachillerato.habilidades.map((habilidad) => (
                          <Badge key={habilidad} variant="secondary">
                            {habilidad}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Carreras Relacionadas */}
                    <div>
                      <h3 className="font-semibold mb-3">Carreras Universitarias Relacionadas</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {bachillerato.carrerasRelacionadas.map((carrera) => (
                          <div key={carrera} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <GraduationCap className="w-4 h-4 text-gray-600" />
                            <span className="text-sm">{carrera}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Oportunidades Laborales */}
                    <div>
                      <h3 className="font-semibold mb-3">Oportunidades Laborales Directas</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {bachillerato.oportunidadesLaborales.map((oportunidad) => (
                          <div key={oportunidad} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <Briefcase className="w-4 h-4 text-gray-600" />
                            <span className="text-sm">{oportunidad}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Instituciones */}
                    <div>
                      <h3 className="font-semibold mb-3">Instituciones que lo Ofrecen</h3>
                      <div className="flex flex-wrap gap-2">
                        {bachillerato.instituciones.map((institucion) => (
                          <Badge key={institucion} variant="outline" className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {institucion}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Consejos */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2 text-blue-900">Consejos de Estudio</h3>
                      <p className="text-sm text-blue-800">{bachillerato.consejosEstudio}</p>
                    </div>

                    {/* Próximos Pasos */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2 text-green-900">Próximos Pasos</h3>
                      <p className="text-sm text-green-800">{bachillerato.proximosPasos}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedBachilleratos.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron bachilleratos</h3>
            <p className="text-gray-600 mb-4">Intenta ajustar tus filtros de búsqueda para encontrar más resultados.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedArea("all")
                setSelectedModalidad("all")
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
