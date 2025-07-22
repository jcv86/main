"use client"

import { useState } from "react"
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
import { GraduationCap, MapPin, Clock, TrendingUp, DollarSign, Users, Briefcase } from "lucide-react"
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
  const [selectedCareer, setSelectedCareer] = useState<UDDCareer | null>(null)

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
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setSelectedCareer(career)}>
              Ver Detalles
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
