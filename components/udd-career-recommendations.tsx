"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  MapPin,
  Clock,
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  Award,
  Globe,
  BookOpen,
  Target,
  Star,
  Building,
  Lightbulb,
  Heart,
  Trophy,
  Zap,
  CheckCircle,
} from "lucide-react"
import { getCareerRecommendations, type UDDCareer } from "@/lib/udd-careers"
import { cn } from "@/lib/utils"

interface UDDCareerRecommendationsProps {
  personalityResults: Record<string, number>
  userSkills: string[]
  jobInterests: string[]
  className?: string
}

export function UDDCareerRecommendations({
  personalityResults,
  userSkills,
  jobInterests,
  className,
}: UDDCareerRecommendationsProps) {
  const recommendations = getCareerRecommendations(personalityResults, userSkills, jobInterests)

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const CareerCard = ({ career }: { career: UDDCareer & { matchScore?: number } }) => (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{career.name}</CardTitle>
            <CardDescription className="text-sm">{career.faculty}</CardDescription>
          </div>
          {career.matchScore && (
            <Badge variant="secondary" className="bg-green-50 text-green-700">
              {career.matchScore}% match
            </Badge>
          )}
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
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span>{career.employabilityRate}% empleabilidad</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-orange-600" />
            <span>{formatSalary(career.averageSalary.entry)}</span>
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
            <Button variant="outline" className="w-full bg-transparent">
              Ver Detalles Completos
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                {career.name}
              </DialogTitle>
              <DialogDescription className="text-lg">{career.faculty}</DialogDescription>
            </DialogHeader>

            <div className="space-y-8">
              {/* Mission Statement */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Misión de la Carrera
                </h3>
                <p className="text-blue-800 italic">{career.missionStatement}</p>
              </div>

              {/* Detailed Description */}
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gray-700" />
                  Descripción Detallada
                </h3>
                <p className="text-gray-700 leading-relaxed">{career.detailedDescription}</p>
              </div>

              {/* Key Statistics */}
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gray-700" />
                  Estadísticas Clave
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-bold text-xl">{career.duration} años</div>
                    <div className="text-xs text-gray-600">Duración</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="font-bold text-xl">{career.employabilityRate}%</div>
                    <div className="text-xs text-gray-600">Empleabilidad</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="font-bold text-xl">{career.campus.length}</div>
                    <div className="text-xs text-gray-600">Campus</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="font-bold text-xl">{career.jobOpportunities.length}</div>
                    <div className="text-xs text-gray-600">Salidas laborales</div>
                  </div>
                </div>
              </div>

              {/* Industry Outlook */}
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-700" />
                  Perspectivas de la Industria
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">Crecimiento Anual:</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {career.industryOutlook.growthRate}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">Nivel de Demanda:</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {career.industryOutlook.demandLevel}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Perspectivas Futuras:</h4>
                    <p className="text-sm text-gray-600 mb-3">{career.industryOutlook.futureProspects}</p>
                    <h4 className="font-semibold mb-2">Tendencias Clave:</h4>
                    <div className="flex flex-wrap gap-1">
                      {career.industryOutlook.keyTrends.map((trend) => (
                        <Badge key={trend} variant="outline" className="text-xs">
                          {trend}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Progression */}
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-700" />
                  Proyección Salarial
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {formatSalary(career.averageSalary.entry)}
                    </div>
                    <div className="text-sm text-gray-600">Recién egresado</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {formatSalary(career.averageSalary.mid)}
                    </div>
                    <div className="text-sm text-gray-600">5-10 años experiencia</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {formatSalary(career.averageSalary.senior)}
                    </div>
                    <div className="text-sm text-gray-600">Senior (10+ años)</div>
                  </div>
                </div>
              </div>

              {/* Admission Requirements */}
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-gray-700" />
                  Requisitos de Admisión
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Puntajes Mínimos:</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="font-bold text-lg">{career.admissionRequirements.psu}</div>
                        <div className="text-xs text-gray-600">PSU/PAES</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="font-bold text-lg">{career.admissionRequirements.ranking}%</div>
                        <div className="text-xs text-gray-600">Ranking</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="font-bold text-lg">{career.admissionRequirements.nem}</div>
                        <div className="text-xs text-gray-600">NEM</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Requisitos Específicos:</h4>
                    <ul className="space-y-2">
                      {career.admissionRequirements.specificRequirements.map((req) => (
                        <li key={req} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Curriculum */}
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gray-700" />
                  Plan de Estudios Detallado
                </h3>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Ciencias Básicas</TabsTrigger>
                    <TabsTrigger value="specialty">Especialidad</TabsTrigger>
                    <TabsTrigger value="electives">Electivos</TabsTrigger>
                    <TabsTrigger value="practice">Práctica</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="mt-4">
                    <div className="grid md:grid-cols-2 gap-3">
                      {career.curriculum.basicSciences.map((subject) => (
                        <div key={subject} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{subject}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="specialty" className="mt-4">
                    <div className="grid md:grid-cols-2 gap-3">
                      {career.curriculum.specialty.map((subject) => (
                        <div key={subject} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <Star className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{subject}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="electives" className="mt-4">
                    <div className="grid md:grid-cols-2 gap-3">
                      {career.curriculum.electives.map((subject) => (
                        <div key={subject} className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                          <Lightbulb className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">{subject}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="practice" className="mt-4">
                    <div className="space-y-3">
                      {career.curriculum.practicalExperience.map((experience) => (
                        <div key={experience} className="flex items-center gap-2 p-3 bg-orange-50 rounded">
                          <Briefcase className="w-4 h-4 text-orange-600" />
                          <span className="text-sm">{experience}</span>
                        </div>
                      ))}
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-yellow-600" />
                          Trabajo de Título:
                        </h4>
                        <p className="text-sm text-gray-700">{career.curriculum.thesis}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Academic Excellence */}
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-gray-700" />
                  Excelencia Académica
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Acreditaciones:</h4>
                    <div className="space-y-2">
                      {career.academicExcellence.accreditation.map((acc) => (
                        <div key={acc} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <Award className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{acc}</span>
                        </div>
                      ))}
                    </div>

                    <h4 className="font-semibold mb-3 mt-4">Rankings:</h4>
                    <div className="space-y-2">
                      {career.academicExcellence.rankings.map((ranking) => (
                        <div key={ranking} className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                          <Trophy className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm">{ranking}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Áreas de Investigación:</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {career.academicExcellence.researchAreas.map((area) => (
                        <Badge key={area} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>

                    <h4 className="font-semibold mb-3">Intercambios Internacionales:</h4>
                    <div className="space-y-2">
                      {career.academicExcellence.internationalExchange.map((exchange) => (
                        <div key={exchange} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{exchange}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Development */}
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-gray-700" />
                  Habilidades que Desarrollarás
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {career.skills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded"
                    >
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graduate Profile */}
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-700" />
                  Perfil del Egresado
                </h3>
                <Tabs defaultValue="competencies" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="competencies">Competencias</TabsTrigger>
                    <TabsTrigger value="values">Valores</TabsTrigger>
                    <TabsTrigger value="differentiators">Diferenciadores</TabsTrigger>
                  </TabsList>

                  <TabsContent value="competencies" className="mt-4">
                    <div className="grid md:grid-cols-2 gap-3">
                      {career.graduateProfile.competencies.map((comp) => (
                        <div key={comp} className="flex items-start gap-2 p-3 bg-blue-50 rounded">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{comp}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="values" className="mt-4">
                    <div className="grid md:grid-cols-2 gap-3">
                      {career.graduateProfile.values.map((value) => (
                        <div key={value} className="flex items-start gap-2 p-3 bg-green-50 rounded">
                          <Heart className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{value}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="differentiators" className="mt-4">
                    <div className="grid md:grid-cols-2 gap-3">
                      {career.graduateProfile.differentiators.map((diff) => (
                        <div key={diff} className="flex items-start gap-2 p-3 bg-purple-50 rounded">
                          <Star className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{diff}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Career Paths */}
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gray-700" />
                  Caminos Profesionales
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-600">
                      <Building className="w-4 h-4" />
                      Tradicional
                    </h4>
                    <ul className="space-y-1">
                      {career.careerPaths.traditional.map((path) => (
                        <li key={path} className="text-xs text-gray-600">
                          • {path}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-600">
                      <Lightbulb className="w-4 h-4" />
                      Emprendimiento
                    </h4>
                    <ul className="space-y-1">
                      {career.careerPaths.entrepreneurial.map((path) => (
                        <li key={path} className="text-xs text-gray-600">
                          • {path}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-purple-600">
                      <BookOpen className="w-4 h-4" />
                      Académico
                    </h4>
                    <ul className="space-y-1">
                      {career.careerPaths.academic.map((path) => (
                        <li key={path} className="text-xs text-gray-600">
                          • {path}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-orange-600">
                      <Globe className="w-4 h-4" />
                      Internacional
                    </h4>
                    <ul className="space-y-1">
                      {career.careerPaths.international.map((path) => (
                        <li key={path} className="text-xs text-gray-600">
                          • {path}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Student Life */}
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-700" />
                  Vida Estudiantil
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-600">Clubes y Organizaciones:</h4>
                    <div className="space-y-2">
                      {career.studentLife.clubs.map((club) => (
                        <div key={club} className="text-sm p-2 bg-blue-50 rounded">
                          {club}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-green-600">Competencias:</h4>
                    <div className="space-y-2">
                      {career.studentLife.competitions.map((comp) => (
                        <div key={comp} className="text-sm p-2 bg-green-50 rounded">
                          {comp}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-purple-600">Networking:</h4>
                    <div className="space-y-2">
                      {career.studentLife.networking.map((net) => (
                        <div key={net} className="text-sm p-2 bg-purple-50 rounded">
                          {net}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Alumni Success */}
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-gray-700" />
                  Éxito de Egresados
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Egresados Destacados:</h4>
                    <div className="space-y-2">
                      {career.alumniSuccess.notableAlumni.map((alumni) => (
                        <div key={alumni} className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                          <Star className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium">{alumni}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {career.alumniSuccess.averageTimeToEmployment}
                      </div>
                      <div className="text-sm text-green-700">Tiempo promedio para conseguir empleo</div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {career.alumniSuccess.employerSatisfaction}
                      </div>
                      <div className="text-sm text-blue-700">Satisfacción de empleadores</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campus Information */}
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-700" />
                  Campus Disponibles
                </h3>
                <div className="flex gap-3">
                  {career.campus.map((campus) => (
                    <Badge key={campus} variant="outline" className="flex items-center gap-2 p-3">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{campus}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )

  if (recommendations.length === 0) {
    return (
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Carreras UDD Recomendadas
          </CardTitle>
          <CardDescription>
            No se encontraron recomendaciones. Completa tu perfil para obtener sugerencias personalizadas.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          Carreras UDD Recomendadas para Ti
        </CardTitle>
        <CardDescription>Basado en tu personalidad, habilidades e intereses profesionales</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="personality">Por Personalidad</TabsTrigger>
            <TabsTrigger value="skills">Por Habilidades</TabsTrigger>
            <TabsTrigger value="interests">Por Intereses</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((career) => (
                <CareerCard key={career.id} career={career} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="personality" className="mt-6">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Basado en tu Personalidad</h3>
              <p className="text-sm text-blue-700">
                Estas carreras coinciden con tus rasgos de personalidad dominantes.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.slice(0, 3).map((career) => (
                <CareerCard key={career.id} career={career} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <div className="mb-4 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Basado en tus Habilidades</h3>
              <p className="text-sm text-green-700">Carreras que aprovechan las habilidades que ya posees.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.slice(0, 3).map((career) => (
                <CareerCard key={career.id} career={career} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="interests" className="mt-6">
            <div className="mb-4 p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Basado en tus Intereses</h3>
              <p className="text-sm text-purple-700">Carreras alineadas con tus áreas de interés profesional.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.slice(0, 3).map((career) => (
                <CareerCard key={career.id} career={career} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
